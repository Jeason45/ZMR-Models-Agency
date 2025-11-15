import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch models');
  return res.json();
};

export function useModels() {
  const { data, error, isLoading } = useSWR('/api/models?status=active', fetcher, {
    revalidateOnFocus: false, // Ne pas revalider quand on revient sur l'onglet
    revalidateOnReconnect: false, // Ne pas revalider à la reconnexion
    dedupingInterval: 60000, // Cache pendant 1 minute minimum
  });

  return {
    models: data || [],
    isLoading,
    error,
  };
}
