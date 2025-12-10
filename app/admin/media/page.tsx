'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

type FileItem = {
  name: string;
  path: string;
  size: number;
  sizeFormatted: string;
  lastModified: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
};

type FolderItem = {
  name: string;
  path: string;
  type: 'folder';
};

type BucketStats = {
  totalSize: number;
  fileCount: number;
  totalSizeFormatted: string;
};

export default function MediaPage() {
  const { sidebarWidth, isMobile } = useSidebar();
  const [currentPath, setCurrentPath] = useState('');
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BucketStats | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Charger les statistiques du bucket
  useEffect(() => {
    fetchStats();
  }, []);

  // Charger les fichiers du dossier actuel
  useEffect(() => {
    fetchFiles();
  }, [currentPath]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/r2?action=stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/r2?prefix=${encodeURIComponent(currentPath)}`);
      const data = await response.json();
      setFolders(data.folders || []);
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath);
  };

  const handleBack = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length > 0 ? parts.join('/') + '/' : '');
  };

  const handleDeleteClick = (file: FileItem) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFile) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/r2?key=${encodeURIComponent(selectedFile.path)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Rafraîchir la liste et les stats
        await Promise.all([fetchFiles(), fetchStats()]);
        setShowDeleteModal(false);
        setSelectedFile(null);
      } else {
        alert('Erreur lors de la suppression du fichier');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Erreur lors de la suppression du fichier');
    } finally {
      setDeleting(false);
    }
  };

  const getBreadcrumbs = () => {
    if (!currentPath) return ['Racine'];
    const parts = currentPath.split('/').filter(Boolean);
    return ['Racine', ...parts];
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiée dans le presse-papier');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        );
      case 'video':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
        );
      case 'document':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
        );
    }
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
        marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
        padding: isMobile ? '20px' : '40px',
        paddingTop: isMobile ? '80px' : '40px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Decorative line with title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)'
          }} />
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.3) 0%, transparent 100%)'
          }} />
          <span style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}>
            Médias
          </span>
        </div>

        {/* Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px'
        }}>
          <div>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Gérez vos fichiers stockés sur Cloudflare R2
            </p>
          </div>

          {/* Stats */}
          {stats && (
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '4px'
                }}>
                  Fichiers
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'white'
                }}>
                  {stats.fileCount}
                </div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '4px'
                }}>
                  Espace utilisé
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#D4AF37'
                }}>
                  {stats.totalSizeFormatted}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Breadcrumbs */}
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          flexWrap: 'wrap'
        }}>
          {getBreadcrumbs().map((crumb, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {index > 0 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              )}
              <button
                onClick={() => {
                  if (index === 0) {
                    setCurrentPath('');
                  } else {
                    const parts = currentPath.split('/').filter(Boolean);
                    const newPath = parts.slice(0, index).join('/') + '/';
                    setCurrentPath(newPath);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: index === getBreadcrumbs().length - 1 ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  fontWeight: index === getBreadcrumbs().length - 1 ? 600 : 400,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {crumb}
              </button>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '400px',
          backdropFilter: 'blur(10px)'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <div style={{ textAlign: 'center' }}>
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
                  <circle cx="12" cy="12" r="10" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="4"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round"/>
                </svg>
                <p>Chargement...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Folders */}
              {folders.length > 0 && (
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px'
                  }}>
                    Dossiers
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    {folders.map((folder) => (
                      <button
                        key={folder.path}
                        onClick={() => handleFolderClick(folder.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: 'white'
                        }}>
                          {folder.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {files.length > 0 ? (
                <div style={{ padding: '24px' }}>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px'
                  }}>
                    Fichiers ({files.length})
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '16px'
                  }}>
                    {files.map((file) => (
                      <div
                        key={file.path}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'all 0.2s'
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{
                          width: '100%',
                          height: '180px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          {file.type === 'image' ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                              {getFileIcon(file.type)}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ padding: '12px' }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'white',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }} title={file.name}>
                            {file.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: '12px'
                          }}>
                            {file.sizeFormatted}
                          </div>

                          {/* Actions */}
                          <div style={{
                            display: 'flex',
                            gap: '8px'
                          }}>
                            <button
                              onClick={() => copyToClipboard(file.url)}
                              style={{
                                flex: 1,
                                padding: '6px 12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: 'rgba(255, 255, 255, 0.7)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                              }}
                            >
                              Copier URL
                            </button>
                            <button
                              onClick={() => handleDeleteClick(file)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#ef4444',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : folders.length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '400px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p style={{ fontSize: '14px' }}>Aucun fichier dans ce dossier</p>
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && selectedFile && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              backgroundColor: '#1a1f2e',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'white',
                marginBottom: '12px'
              }}>
                Confirmer la suppression
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '24px'
              }}>
                Êtes-vous sûr de vouloir supprimer <strong style={{ color: 'white' }}>{selectedFile.name}</strong> ?
                Cette action est irréversible.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedFile(null);
                  }}
                  disabled={deleting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.5 : 1
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'white',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.5 : 1
                  }}
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
