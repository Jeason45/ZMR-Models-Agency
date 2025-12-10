'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MemberUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface MemberAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: MemberUser | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const MemberAuthContext = createContext<MemberAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  refresh: async () => {},
  logout: async () => {},
});

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<MemberUser | null>(null);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/members/session');
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching member session:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    await fetchSession();
  };

  const logout = async () => {
    try {
      await fetch('/api/members/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <MemberAuthContext.Provider value={{ isAuthenticated, isLoading, user, refresh, logout }}>
      {children}
    </MemberAuthContext.Provider>
  );
}

export function useMemberAuth() {
  const context = useContext(MemberAuthContext);
  if (!context) {
    throw new Error('useMemberAuth must be used within a MemberAuthProvider');
  }
  return context;
}

// Hook pour vérifier si le contenu doit être restreint
export function useIsContentRestricted(
  category?: string,
  hasRestrictedContent?: boolean,
  isInRestrictedGallery?: boolean
) {
  const { isAuthenticated, isLoading } = useMemberAuth();

  // Si on charge encore, on considère le contenu comme restreint par défaut
  if (isLoading) {
    return { isRestricted: true, isLoading: true };
  }

  // Si authentifié, rien n'est restreint
  if (isAuthenticated) {
    return { isRestricted: false, isLoading: false };
  }

  // Catégories automatiquement restreintes
  const restrictedCategories = ['hands', 'feet'];
  const isCategoryRestricted = category ? restrictedCategories.includes(category.toLowerCase()) : false;

  // Le contenu est restreint si:
  // 1. La catégorie est restreinte (hands/feet)
  // 2. Le talent a le flag hasRestrictedContent
  // 3. La photo est dans la galerie restreinte
  const isRestricted = isCategoryRestricted || hasRestrictedContent || isInRestrictedGallery || false;

  return { isRestricted, isLoading: false };
}
