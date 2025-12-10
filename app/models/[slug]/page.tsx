'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ModelsRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  useEffect(() => {
    // Redirect to unified talent page
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
