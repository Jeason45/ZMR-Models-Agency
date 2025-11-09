'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';

interface EditableField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'number' | 'textarea';
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  position: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface SignatureRequest {
  id: string;
  token: string;
  recipientEmail: string;
  recipientName: string | null;
  expiresAt: string;
  status: string;
  document: {
    id: string;
    fileName: string;
    type: string;
    filePath: string;
    template?: {
      id: string;
      name: string;
      editableFields: EditableField[] | null;
      requiresSignature: boolean;
    } | null;
  };
}

export default function SignDocumentPage() {
  const params = useParams();
  const token = params.token as string;

  const [signatureRequest, setSignatureRequest] = useState<SignatureRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);

  // Signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [showSignatureBox, setShowSignatureBox] = useState(false);

  // PDF container ref
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfScale, setPdfScale] = useState(1);

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#f8fafc';
    document.body.style.backgroundColor = '#f8fafc';

    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    fetchSignatureRequest();
  }, [token]);

  const fetchSignatureRequest = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/sign/validate?token=${token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Lien de signature invalide');
        return;
      }

      setSignatureRequest(data.signatureRequest);

      // Initialize form data
      const editableFields = data.signatureRequest?.document?.template?.editableFields as EditableField[] | null;
      if (editableFields) {
        const initialData: Record<string, string> = {};
        editableFields.forEach(field => {
          initialData[field.name] = field.defaultValue || '';
        });
        // Pre-fill with recipient info if available
        if (editableFields.find(f => f.name === 'nom_complet')) {
          initialData['nom_complet'] = data.signatureRequest.recipientName || '';
        }
        if (editableFields.find(f => f.name === 'email')) {
          initialData['email'] = data.signatureRequest.recipientEmail || '';
        }
        setFormData(initialData);
      }
    } catch (err) {
      setError('Erreur lors de la validation du lien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate PDF scale based on container width
  useEffect(() => {
    if (!pdfContainerRef.current) return;

    const updateScale = () => {
      if (!pdfContainerRef.current) return;
      const containerWidth = pdfContainerRef.current.offsetWidth;
      // Standard A4 width is 595 points (at 72 DPI)
      const pdfWidth = 595;
      const scale = containerWidth / pdfWidth;
      setPdfScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [signatureRequest]);

  // Canvas signature functions
  const initCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas || canvasRef.current) return; // Don't reinitialize if already set
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNextField = () => {
    const editableFields = signatureRequest?.document?.template?.editableFields as EditableField[] | null;
    if (!editableFields) return;

    if (currentFieldIndex < editableFields.length - 1) {
      setCurrentFieldIndex(prev => prev + 1);
      // Scroll to next field
      scrollToField(currentFieldIndex + 1);
    } else {
      // All fields filled, show signature
      setShowSignatureBox(true);
      setTimeout(() => {
        document.getElementById('signature-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handlePrevField = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(prev => prev - 1);
      scrollToField(currentFieldIndex - 1);
    }
  };

  const scrollToField = (index: number) => {
    const fieldElement = document.getElementById(`field-overlay-${index}`);
    if (fieldElement) {
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async () => {
    // Validate all required fields
    const editableFields = signatureRequest?.document?.template?.editableFields as EditableField[] | null;
    if (editableFields) {
      const missingFields = editableFields.filter(
        field => field.required && !formData[field.name]
      );
      if (missingFields.length > 0) {
        alert(`Veuillez remplir tous les champs obligatoires: ${missingFields.map(f => f.label).join(', ')}`);
        // Go to first missing field
        const firstMissingIndex = editableFields.findIndex(f => f.name === missingFields[0].name);
        setCurrentFieldIndex(firstMissingIndex);
        scrollToField(firstMissingIndex);
        return;
      }
    }

    if (!hasSignature) {
      alert('Veuillez signer le document');
      setShowSignatureBox(true);
      document.getElementById('signature-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setSigning(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const signatureImage = canvas.toDataURL('image/png');

      const res = await fetch('/api/sign/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          signerName: formData['nom_complet'] || signatureRequest?.recipientName,
          signerEmail: formData['email'] || signatureRequest?.recipientEmail,
          signatureImage,
          formData
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la signature');
      }

      setSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
      console.error(err);
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Loader2 style={{ width: '48px', height: '48px', color: '#6366f1', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          maxWidth: '448px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          textAlign: 'center'
        }}>
          <XCircle style={{
            width: '64px',
            height: '64px',
            color: '#ef4444',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '20px'
          }} />
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
          }}>Lien invalide</h1>
          <p style={{ color: '#6b7280' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          maxWidth: '448px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          textAlign: 'center'
        }}>
          <CheckCircle style={{
            width: '64px',
            height: '64px',
            color: '#22c55e',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '20px'
          }} />
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
          }}>Document signé!</h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Votre signature a été enregistrée avec succès. Vous recevrez une copie signée par email.
          </p>
        </div>
      </div>
    );
  }

  const editableFields = signatureRequest?.document?.template?.editableFields as EditableField[] | null;
  const currentField = editableFields && editableFields[currentFieldIndex];
  const progress = editableFields ? ((currentFieldIndex + 1) / editableFields.length) * 100 : 100;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header Bar with Progress */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '12px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
              {signatureRequest?.document.fileName}
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              {editableFields && editableFields.length > 0
                ? `Champ ${currentFieldIndex + 1} sur ${editableFields.length}${showSignatureBox ? ' - Prêt pour signature' : ''}`
                : 'Prêt pour signature'}
            </p>
          </div>
          {editableFields && editableFields.length > 0 && (
            <div style={{ height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                backgroundColor: '#6366f1',
                width: `${progress}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* PDF Container with Overlays */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <div
            ref={pdfContainerRef}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* PDF Viewer (iframe) */}
            <iframe
              src={signatureRequest?.document.filePath}
              style={{
                width: '100%',
                height: '842px', // A4 height ratio
                border: 'none',
                display: 'block'
              }}
              title="Document PDF"
            />

            {/* Field Overlays */}
            {editableFields && editableFields.map((field, index) => {
              const isActive = index === currentFieldIndex;
              const isFilled = !!formData[field.name];

              return (
                <div
                  key={field.name}
                  id={`field-overlay-${index}`}
                  onClick={() => setCurrentFieldIndex(index)}
                  style={{
                    position: 'absolute',
                    left: `${field.position.x * pdfScale}px`,
                    top: `${field.position.y * pdfScale}px`,
                    width: `${field.position.width * pdfScale}px`,
                    height: `${field.position.height * pdfScale}px`,
                    border: isActive ? '3px solid #6366f1' : isFilled ? '2px solid #22c55e' : '2px solid #fbbf24',
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : isFilled ? 'rgba(34, 197, 94, 0.05)' : 'rgba(251, 191, 36, 0.1)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    boxShadow: isActive ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none'
                  }}
                >
                  {isFilled ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%'
                    }}>
                      <Check style={{ width: '16px', height: '16px', color: '#22c55e', flexShrink: 0 }} />
                      <span style={{
                        fontSize: '13px',
                        color: '#111827',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {formData[field.name]}
                      </span>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      {isActive ? `Cliquez pour remplir: ${field.label}` : field.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Field Edit Panel */}
          {editableFields && currentField && !showSignatureBox && (
            <div style={{
              marginTop: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  {currentField.label} {currentField.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                {currentField.type === 'textarea' ? (
                  <textarea
                    value={formData[currentField.name] || ''}
                    onChange={(e) => handleFieldChange(currentField.name, e.target.value)}
                    placeholder={currentField.placeholder}
                    rows={4}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '15px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                ) : (
                  <input
                    type={currentField.type}
                    value={formData[currentField.name] || ''}
                    onChange={(e) => handleFieldChange(currentField.name, e.target.value)}
                    placeholder={currentField.placeholder}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {currentFieldIndex > 0 && (
                  <button
                    onClick={handlePrevField}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  >
                    <ChevronLeft style={{ width: '18px', height: '18px' }} />
                    Précédent
                  </button>
                )}
                <button
                  onClick={handleNextField}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
                >
                  {currentFieldIndex < editableFields.length - 1 ? 'Suivant' : 'Signer le document'}
                  <ChevronRight style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Signature Section */}
        {showSignatureBox && (
          <div
            id="signature-section"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '32px'
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Signature électronique
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Dessinez votre signature ci-dessous
              </label>
              <div style={{
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}>
                <canvas
                  ref={initCanvas}
                  width={800}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{
                    display: 'block',
                    backgroundColor: '#ffffff',
                    width: '100%',
                    cursor: 'crosshair'
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px'
              }}>
                <button
                  type="button"
                  onClick={clearSignature}
                  style={{
                    fontSize: '14px',
                    color: '#dc2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    fontWeight: '500'
                  }}
                >
                  Effacer
                </button>
                {hasSignature && (
                  <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: '500' }}>
                    <Check style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
                    Signature ajoutée
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={signing}
              style={{
                width: '100%',
                backgroundColor: signing ? '#9ca3af' : '#6366f1',
                color: '#ffffff',
                fontWeight: '600',
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                cursor: signing ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => !signing && (e.currentTarget.style.backgroundColor = '#4f46e5')}
              onMouseOut={(e) => !signing && (e.currentTarget.style.backgroundColor = '#6366f1')}
            >
              {signing ? (
                <>
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                  Signature en cours...
                </>
              ) : (
                'Signer le document'
              )}
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
