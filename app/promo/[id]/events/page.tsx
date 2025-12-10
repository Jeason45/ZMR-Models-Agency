'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PromoEventsRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  useEffect(() => {
    // Redirect to unified talent page (events are now in main page)
    router.replace(`/talent/${slug}`);
  }, [slug, router]);

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div>Redirecting...</div>
    </main>
  );
}
