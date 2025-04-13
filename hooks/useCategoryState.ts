// hooks/useCategoryState.ts
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useCategoryState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupérer la catégorie depuis l'URL ou utiliser la valeur par défaut
  const selectedCategory = searchParams.get('category') || '16';
  
  // Fonction pour mettre à jour la catégorie
  const setCategory = useCallback((category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    
    // Mettre à jour l'URL avec la nouvelle catégorie
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);
  
  return { selectedCategory, setCategory };
}
