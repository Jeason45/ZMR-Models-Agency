'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

type MemberStatus = 'pending' | 'active' | 'suspended' | 'banned';

interface Member {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  provider: string | null;
  emailVerified: boolean;
  status: MemberStatus;
  lastLoginAt: string | null;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', icon: '⏳' },
  active: { label: 'Actif', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', icon: '✓' },
  suspended: { label: 'Suspendu', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', icon: '⏸' },
  banned: { label: 'Banni', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.15)', icon: '⛔' }
};

export default function AdminMembersPage() {
  const { sidebarWidth, isMobile } = useSidebar();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Charger les membres
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Erreur chargement membres:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les membres
  useEffect(() => {
    let filtered = [...members];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }

    if (providerFilter !== 'all') {
      filtered = filtered.filter(m => m.provider === providerFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.email.toLowerCase().includes(query) ||
        (m.name && m.name.toLowerCase().includes(query)) ||
        (m.firstName && m.firstName.toLowerCase().includes(query)) ||
        (m.lastName && m.lastName.toLowerCase().includes(query))
      );
    }

    setFilteredMembers(filtered);
  }, [members, statusFilter, providerFilter, searchQuery]);

  // Changer le statut d'un membre
  const updateMemberStatus = async (memberId: string, newStatus: MemberStatus) => {
    setActionLoading(memberId);
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setMembers(prev => prev.map(m => m.id === memberId ? data.member : m));
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Supprimer un membre
  const deleteMember = async (memberId: string) => {
    if (!confirm('Supprimer ce membre définitivement ?')) return;

    setActionLoading(memberId);
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMembers(prev => prev.filter(m => m.id !== memberId));
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayName = (member: Member) => {
    if (member.name) return member.name;
    if (member.firstName || member.lastName) {
      return `${member.firstName || ''} ${member.lastName || ''}`.trim();
    }
    return member.email.split('@')[0];
  };

  const tabs = [
    { value: 'all', label: 'Tous', count: members.length },
    { value: 'pending', label: 'En attente', count: members.filter(m => m.status === 'pending').length },
    { value: 'active', label: 'Actifs', count: members.filter(m => m.status === 'active').length },
    { value: 'suspended', label: 'Suspendus', count: members.filter(m => m.status === 'suspended').length },
  ];

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
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        padding: isMobile ? '80px 16px 24px 16px' : '40px'
      }}>
        {/* Decorative line with title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
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
            Membres
          </span>
        </div>

        {/* Stats rapides */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#f59e0b' }}>
              {members.filter(m => m.status === 'pending').length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>En attente</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#10b981' }}>
              {members.filter(m => m.status === 'active').length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Actifs</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#ef4444' }}>
              {members.filter(m => m.status === 'suspended').length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Suspendus</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 600, color: 'white' }}>
              {members.length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Total</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value as any)}
              style={{
                padding: isMobile ? '10px 16px' : '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                background: statusFilter === tab.value
                  ? 'rgba(212, 175, 55, 0.2)'
                  : 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                border: statusFilter === tab.value ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: statusFilter === tab.value ? '#D4AF37' : 'rgba(255,255,255,0.6)',
              }}
            >
              {tab.label}
              <span style={{
                background: statusFilter === tab.value
                  ? 'rgba(212, 175, 55, 0.3)'
                  : 'rgba(255,255,255,0.1)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                color: statusFilter === tab.value ? '#D4AF37' : 'rgba(255,255,255,0.6)'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: isMobile ? '20px' : '24px'
        }}>
          {/* Filtres */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                }}
              />
            </div>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="all" style={{ background: '#0a0e1a', color: 'white' }}>Tous les providers</option>
              <option value="credentials" style={{ background: '#0a0e1a', color: 'white' }}>Email/Password</option>
              <option value="google" style={{ background: '#0a0e1a', color: 'white' }}>Google</option>
            </select>
          </div>

          {/* Liste des membres */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.6)' }}>
              Chargement...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'rgba(255,255,255,0.6)',
            }}>
              Aucun membre trouvé
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredMembers.map(member => (
                <div
                  key={member.id}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: isMobile ? '16px' : '20px 24px',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: '20px',
                    border: member.status === 'pending'
                      ? '2px solid rgba(245, 158, 11, 0.3)'
                      : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: member.avatar
                      ? `url(${member.avatar}) center/cover`
                      : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.6)',
                    flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    {!member.avatar && getDisplayName(member).charAt(0).toUpperCase()}
                  </div>

                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: 'white' }}>
                        {getDisplayName(member)}
                      </span>
                      {/* Provider badge */}
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: member.provider === 'google'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(79, 70, 229, 0.15)',
                        color: member.provider === 'google' ? '#ef4444' : '#818cf8',
                        border: '1px solid ' + (member.provider === 'google'
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(79, 70, 229, 0.3)'),
                      }}>
                        {member.provider === 'google' ? 'Google' : 'Email'}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      {member.email}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                      Inscrit le {formatDate(member.createdAt)}
                      {member.lastLoginAt && ` • Dernière connexion: ${formatDate(member.lastLoginAt)}`}
                    </div>
                  </div>

                  {/* Statut */}
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: STATUS_CONFIG[member.status].bgColor,
                    color: STATUS_CONFIG[member.status].color,
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: `1px solid ${STATUS_CONFIG[member.status].color}40`,
                  }}>
                    {STATUS_CONFIG[member.status].icon} {STATUS_CONFIG[member.status].label}
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    width: isMobile ? '100%' : 'auto'
                  }}>
                    {member.status === 'pending' && (
                      <button
                        onClick={() => updateMemberStatus(member.id, 'active')}
                        disabled={actionLoading === member.id}
                        style={{
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          opacity: actionLoading === member.id ? 0.5 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        {actionLoading === member.id ? '...' : 'Approuver'}
                      </button>
                    )}

                    {member.status === 'active' && (
                      <button
                        onClick={() => updateMemberStatus(member.id, 'suspended')}
                        disabled={actionLoading === member.id}
                        style={{
                          padding: '8px 16px',
                          background: '#f59e0b',
                          color: 'white',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          opacity: actionLoading === member.id ? 0.5 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        Suspendre
                      </button>
                    )}

                    {member.status === 'suspended' && (
                      <button
                        onClick={() => updateMemberStatus(member.id, 'active')}
                        disabled={actionLoading === member.id}
                        style={{
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          opacity: actionLoading === member.id ? 0.5 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        Réactiver
                      </button>
                    )}

                    {member.status !== 'banned' && (
                      <button
                        onClick={() => updateMemberStatus(member.id, 'banned')}
                        disabled={actionLoading === member.id}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          opacity: actionLoading === member.id ? 0.5 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        Bannir
                      </button>
                    )}

                    <button
                      onClick={() => deleteMember(member.id)}
                      disabled={actionLoading === member.id}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        opacity: actionLoading === member.id ? 0.5 : 1,
                        transition: 'all 0.2s',
                      }}
                      title="Supprimer"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
