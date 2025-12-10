'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import imageCompression from 'browser-image-compression';

interface TicketType {
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const { sidebarWidth } = useSidebar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    address: '',
    city: '',
    coverImage: '',
    type: 'club',
    status: 'upcoming',
    isFree: false,
    maxCapacity: '',
    hasGuestList: false,
    guestListInfo: '',
    dresscode: '',
    ageRestriction: '',
    published: false
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: 'Standard', price: 0, quantity: 100, description: '' }
  ]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Image handling functions
  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const removeImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview('');
    setFormData({ ...formData, coverImage: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload image to R2
  const uploadImage = async (file: File): Promise<string> => {
    setUploadProgress('Compression de l\'image...');

    // Compress image
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    let fileToUpload = file;
    try {
      fileToUpload = await imageCompression(file, options);
    } catch (err) {
      console.log('Compression skipped:', err);
    }

    setUploadProgress('Upload en cours...');

    const uploadFormData = new FormData();
    uploadFormData.append('file', fileToUpload);
    uploadFormData.append('type', 'image');
    uploadFormData.append('category', 'events');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const { filePath } = await response.json();
    setUploadProgress('');
    return filePath;
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: '', price: 0, quantity: 50, description: '' }
    ]);
  };

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    }
  };

  const updateTicketType = (index: number, field: keyof TicketType, value: string | number) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Validation
      if (!formData.title || !formData.date || !formData.location) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Upload cover image if selected
      let coverImageUrl = formData.coverImage;
      if (coverImageFile) {
        coverImageUrl = await uploadImage(coverImageFile);
      }

      // Préparer les données
      const eventData = {
        ...formData,
        coverImage: coverImageUrl,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null,
        ticketTypes: formData.isFree ? null : ticketTypes.map(t => ({
          ...t,
          price: parseFloat(String(t.price)),
          quantity: parseInt(String(t.quantity)),
          sold: 0
        }))
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }

      const event = await response.json();
      router.push(`/admin/events/${event.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: 'white',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px'
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        padding: '40px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <Link
            href="/admin/events"
            style={{
              padding: '8px 12px',
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            ← Retour
          </Link>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '4px'
            }}>
              Créer un événement
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Remplissez les informations de votre événement
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '32px'
          }}>
            {/* Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Basic Info */}
              <div style={{
                backgroundColor: 'white',
                padding: '28px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '24px'
                }}>
                  Informations générales
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Titre *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Nom de l'événement"
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Slug (URL)</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="mon-evenement"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Décrivez votre événement..."
                      rows={5}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Date et heure de début *</label>
                      <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Date et heure de fin</label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={{
                backgroundColor: 'white',
                padding: '28px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '24px'
                }}>
                  Lieu
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Nom du lieu *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: Le Loft Club"
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Adresse</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="12 rue de la Paix"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Ville</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Paris"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Tickets */}
              <div style={{
                backgroundColor: 'white',
                padding: '28px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#0f172a'
                  }}>
                    Billetterie
                  </h3>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleChange}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                      Événement gratuit
                    </span>
                  </label>
                </div>

                {!formData.isFree && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {ticketTypes.map((ticket, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '20px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                            Type de billet #{index + 1}
                          </span>
                          {ticketTypes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTicketType(index)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Supprimer
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ ...labelStyle, fontSize: '12px' }}>Nom</label>
                            <input
                              type="text"
                              value={ticket.name}
                              onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                              placeholder="Ex: VIP, Standard..."
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={{ ...labelStyle, fontSize: '12px' }}>Prix (€)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={ticket.price}
                              onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={{ ...labelStyle, fontSize: '12px' }}>Quantité</label>
                            <input
                              type="number"
                              min="1"
                              value={ticket.quantity}
                              onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                              style={inputStyle}
                            />
                          </div>
                        </div>

                        <div style={{ marginTop: '12px' }}>
                          <label style={{ ...labelStyle, fontSize: '12px' }}>Description (optionnel)</label>
                          <input
                            type="text"
                            value={ticket.description || ''}
                            onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                            placeholder="Ex: Accès VIP + boisson offerte"
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addTicketType}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f1f5f9',
                        color: '#6366f1',
                        border: '1px dashed #6366f1',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      + Ajouter un type de billet
                    </button>
                  </div>
                )}

                <div style={{ marginTop: '20px' }}>
                  <label style={labelStyle}>Capacité maximale</label>
                  <input
                    type="number"
                    name="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    placeholder="Laisser vide si illimité"
                    style={{ ...inputStyle, maxWidth: '200px' }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Publish */}
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '20px'
                }}>
                  Publication
                </h3>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}>
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Publier immédiatement
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: saving ? '#94a3b8' : '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Création...' : 'Créer l\'événement'}
                </button>
              </div>

              {/* Type & Status */}
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '20px'
                }}>
                  Type & Statut
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Type d'événement</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="club">Club</option>
                      <option value="restaurant-bar">Restaurant & Bar</option>
                      <option value="private">Privé</option>
                      <option value="fashion">Fashion</option>
                      <option value="casting">Casting</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Statut</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      style={inputStyle}
                    >
                      <option value="upcoming">À venir</option>
                      <option value="ongoing">En cours</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '20px'
                }}>
                  Image de couverture
                </h3>

                {/* Drag and Drop Zone */}
                {!coverImagePreview && !formData.coverImage ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${isDragging ? '#6366f1' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      padding: '32px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: isDragging ? '#eef2ff' : '#f8fafc',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#6366f1' : '#94a3b8'} strokeWidth="1.5" style={{ margin: '0 auto' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="17,8 12,3 7,8" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                      Glissez-déposez une image ici
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      ou cliquez pour sélectionner
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                      PNG, JPG, WEBP (max 10MB)
                    </p>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={coverImagePreview || formData.coverImage}
                      alt="Preview"
                      style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
                        <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>
                      Cliquez sur la croix pour changer l'image
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />

                {uploadProgress && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#eef2ff',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#6366f1',
                    textAlign: 'center'
                  }}>
                    {uploadProgress}
                  </div>
                )}

                {/* Option URL alternative */}
                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    Ou entrez une URL d'image :
                  </p>
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) {
                        setCoverImageFile(null);
                        setCoverImagePreview('');
                      }
                    }}
                    placeholder="https://..."
                    style={{ ...inputStyle, fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '20px'
                }}>
                  Options
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Dress code</label>
                    <input
                      type="text"
                      name="dresscode"
                      value={formData.dresscode}
                      onChange={handleChange}
                      placeholder="Ex: Tenue chic exigée"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Restriction d'âge</label>
                    <input
                      type="text"
                      name="ageRestriction"
                      value={formData.ageRestriction}
                      onChange={handleChange}
                      placeholder="Ex: 18+ avec ID"
                      style={inputStyle}
                    />
                  </div>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      name="hasGuestList"
                      checked={formData.hasGuestList}
                      onChange={handleChange}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                      Activer la Guest List
                    </span>
                  </label>

                  {formData.hasGuestList && (
                    <div>
                      <label style={labelStyle}>Instructions Guest List</label>
                      <textarea
                        name="guestListInfo"
                        value={formData.guestListInfo}
                        onChange={handleChange}
                        placeholder="Informations sur la guest list..."
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
