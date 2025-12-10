'use client';

import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

type ImageUploadProps = {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  category?: string;
};

export default function ImageUpload({ onImageUploaded, currentImage, category = 'blog' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);

    try {
      // Compresser l'image avant l'upload
      const options = {
        maxSizeMB: 2, // Taille max 2MB
        maxWidthOrHeight: 1920, // Dimension max
        useWebWorker: true,
        fileType: file.type,
      };

      console.log('Compression de l\'image...', file.size / 1024 / 1024, 'MB');
      const compressedFile = await imageCompression(file, options);
      console.log('Image compressée:', compressedFile.size / 1024 / 1024, 'MB');

      // Upload via l'API server-side (évite les problèmes CORS avec R2)
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('type', 'image');
      formData.append('category', category);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload');
      }

      const { filePath } = await uploadResponse.json();
      console.log('✓ Image uploadée vers R2:', filePath);

      setPreview(filePath);
      onImageUploaded(filePath);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: 600,
        color: '#0f172a',
        marginBottom: '8px'
      }}>
        Image de couverture *
      </label>

      {preview ? (
        <div style={{ marginBottom: '12px' }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onImageUploaded('');
            }}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            Changer l'image
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px dashed #6366f1' : '2px dashed #e2e8f0',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: dragActive ? '#f5f3ff' : '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={uploading}
            style={{
              display: 'none'
            }}
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            style={{
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'block'
            }}
          >
            {uploading ? (
              <div>
                <svg
                  style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 12px',
                    animation: 'spin 1s linear infinite'
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="#6366f1"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '4px'
                }}>
                  Upload en cours...
                </p>
              </div>
            ) : (
              <div>
                <svg
                  style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 12px',
                    color: '#94a3b8'
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#0f172a',
                  marginBottom: '4px'
                }}>
                  Glissez une image ici ou cliquez pour sélectionner
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  JPG, PNG, GIF, WEBP (max 10MB)
                </p>
              </div>
            )}
          </label>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
