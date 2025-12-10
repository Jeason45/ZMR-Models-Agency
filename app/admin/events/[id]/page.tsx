'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import imageCompression from 'browser-image-compression';

interface TicketType {
  name: string;
  price: number;
  quantity: number;
  sold?: number;
  description?: string;
}

interface Booking {
  id: string;
  bookingNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  qrCode?: string;
  checkedInAt?: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  date: string;
  endDate?: string;
  location: string;
  address?: string;
  city?: string;
  coverImage?: string;
  type: string;
  status: string;
  isFree: boolean;
  ticketTypes?: TicketType[];
  maxCapacity?: number;
  hasGuestList: boolean;
  guestListInfo?: string;
  dresscode?: string;
  ageRestriction?: string;
  published: boolean;
  bookings: Booking[];
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { sidebarWidth } = useSidebar();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'bookings'>('details');
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

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

  useEffect(() => {
    fetchEvent();
  }, [resolvedParams.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${resolvedParams.id}`);
      if (!response.ok) throw new Error('Event not found');

      const data = await response.json();
      setEvent(data);

      // Format dates for input
      const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        date: formatDateForInput(data.date),
        endDate: formatDateForInput(data.endDate),
        location: data.location || '',
        address: data.address || '',
        city: data.city || '',
        coverImage: data.coverImage || '',
        type: data.type || 'club',
        status: data.status || 'upcoming',
        isFree: data.isFree || false,
        maxCapacity: data.maxCapacity?.toString() || '',
        hasGuestList: data.hasGuestList || false,
        guestListInfo: data.guestListInfo || '',
        dresscode: data.dresscode || '',
        ageRestriction: data.ageRestriction || '',
        published: data.published || false
      });

      setTicketTypes(data.ticketTypes || [{ name: 'Standard', price: 0, quantity: 100 }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      { name: '', price: 0, quantity: 50, sold: 0, description: '' }
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
      // Upload cover image if a new file was selected
      let coverImageUrl = formData.coverImage;
      if (coverImageFile) {
        coverImageUrl = await uploadImage(coverImageFile);
      }

      const eventData = {
        ...formData,
        coverImage: coverImageUrl,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null,
        ticketTypes: formData.isFree ? null : ticketTypes.map(t => ({
          ...t,
          price: parseFloat(String(t.price)),
          quantity: parseInt(String(t.quantity)),
          sold: t.sold || 0
        }))
      };

      const response = await fetch(`/api/events/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      alert('Événement mis à jour avec succès !');
      setCoverImageFile(null);
      setCoverImagePreview('');
      fetchEvent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'checked_in' })
      });

      if (!response.ok) throw new Error('Erreur lors du check-in');

      fetchEvent();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'annulation');

      fetchEvent();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; bg: string; color: string }> = {
      'paid': { label: 'Payé', bg: '#d1fae5', color: '#059669' },
      'pending': { label: 'En attente', bg: '#fef3c7', color: '#d97706' },
      'failed': { label: 'Échoué', bg: '#fee2e2', color: '#dc2626' },
      'refunded': { label: 'Remboursé', bg: '#e0e7ff', color: '#4f46e5' }
    };
    return badges[status] || { label: status, bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' };
  };

  const getBookingStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; bg: string; color: string }> = {
      'confirmed': { label: 'Confirmé', bg: '#d1fae5', color: '#059669' },
      'pending': { label: 'En attente', bg: '#fef3c7', color: '#d97706' },
      'cancelled': { label: 'Annulé', bg: '#fee2e2', color: '#dc2626' },
      'checked_in': { label: 'Enregistré', bg: '#dbeafe', color: '#2563eb' }
    };
    return badges[status] || { label: status, bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '8px'
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1b2e 100%)'
      }}>
        <AdminSidebar />
        <div style={{
          flex: 1,
          marginLeft: `${sidebarWidth}px`,
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1b2e 100%)'
      }}>
        <AdminSidebar />
        <div style={{
          flex: 1,
          marginLeft: `${sidebarWidth}px`,
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.6)' }}>Événement non trouvé</p>
          <Link
            href="/admin/events"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const bookingStats = {
    total: event.bookings.length,
    confirmed: event.bookings.filter(b => b.status === 'confirmed').length,
    checkedIn: event.bookings.filter(b => b.status === 'checked_in').length,
    cancelled: event.bookings.filter(b => b.status === 'cancelled').length,
    revenue: event.bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0),
    totalTickets: event.bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.quantity, 0)
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1b2e 100%)'
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
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            ← Retour
          </Link>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '4px'
            }}>
              {event.title}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
              {formatDate(event.date)} - {event.location}
            </p>
          </div>
          <Link
            href={`/events/${event.slug}`}
            target="_blank"
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Voir l'événement
          </Link>
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

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
              Réservations
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>
              {bookingStats.total}
            </p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
              Confirmées
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#059669' }}>
              {bookingStats.confirmed}
            </p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
              Enregistrés
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb' }}>
              {bookingStats.checkedIn}
            </p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
              Annulées
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#dc2626' }}>
              {bookingStats.cancelled}
            </p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
              Billets vendus
            </p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#a21caf' }}>
              {bookingStats.totalTickets}
            </p>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
              Revenus
            </p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#059669' }}>
              {formatPrice(bookingStats.revenue)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '6px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: 'fit-content',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'details' ? 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)' : 'transparent',
              color: activeTab === 'details' ? 'black' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Détails
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'bookings' ? 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)' : 'transparent',
              color: activeTab === 'bookings' ? 'black' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Réservations ({event.bookings.length})
          </button>
        </div>

        {activeTab === 'details' ? (
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '28px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'white',
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
                        onChange={handleChange}
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
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '28px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'white',
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
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* Tickets */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '28px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
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
                      color: 'white'
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
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>
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
                            background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1b2e 100%)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                          }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>
                              Type de billet #{index + 1}
                              {ticket.sold ? ` (${ticket.sold} vendus)` : ''}
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
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addTicketType}
                        style={{
                          padding: '12px',
                          backgroundColor: 'transparent',
                          color: '#D4AF37',
                          border: '1px dashed rgba(212, 175, 55, 0.5)',
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
                      style={{ ...inputStyle, maxWidth: '200px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Publish */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'white',
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
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Publié
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: saving ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                      color: saving ? 'rgba(255, 255, 255, 0.5)' : 'black',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      boxShadow: saving ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)'
                    }}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>

                {/* Type & Status */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'white',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'white',
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
                        border: `2px dashed ${isDragging ? '#D4AF37' : 'rgba(255, 255, 255, 0.2)'}`,
                        borderRadius: '12px',
                        padding: '32px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragging ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#D4AF37' : 'rgba(255, 255, 255, 0.4)'} strokeWidth="1.5" style={{ margin: '0 auto' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="17,8 12,3 7,8" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                        Glissez-déposez une image ici
                      </p>
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        ou cliquez pour sélectionner
                      </p>
                      <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)', marginTop: '8px' }}>
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
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '8px', textAlign: 'center' }}>
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
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#D4AF37',
                      textAlign: 'center'
                    }}>
                      {uploadProgress}
                    </div>
                  )}

                  {/* Option URL alternative */}
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'white',
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
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>
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
        ) : (
          /* Bookings Tab */
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1b2e 100%)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    N° Réservation
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Client
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Billet
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Qté
                  </th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Montant
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Paiement
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Statut
                  </th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {event.bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                      <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</p>
                      <p>Aucune réservation pour cet événement</p>
                    </td>
                  </tr>
                ) : (
                  event.bookings.map((booking) => {
                    const paymentBadge = getPaymentStatusBadge(booking.paymentStatus);
                    const statusBadge = getBookingStatusBadge(booking.status);

                    return (
                      <tr
                        key={booking.id}
                        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '16px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'white' }}>
                            {booking.bookingNumber}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <p style={{ fontWeight: 500, color: 'white', marginBottom: '2px' }}>
                            {booking.firstName} {booking.lastName}
                          </p>
                          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {booking.email}
                          </p>
                          {booking.phone && (
                            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                              {booking.phone}
                            </p>
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {booking.ticketType}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'white' }}>
                            {booking.quantity}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ fontWeight: 600, color: 'white' }}>
                            {formatPrice(booking.totalAmount)}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: paymentBadge.bg,
                            color: paymentBadge.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}>
                            {paymentBadge.label}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleCheckIn(booking.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Check-in
                              </button>
                            )}
                            {booking.status !== 'cancelled' && booking.status !== 'checked_in' && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Annuler
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
