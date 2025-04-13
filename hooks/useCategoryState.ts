// hooks/useCategoryState.ts
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function useCategoryState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Récupérer la catégorie depuis l'URL ou utiliser la valeur stockée ou la valeur par défaut
  const selectedCategory = searchParams.get('category') || 
    (typeof window !== 'undefined' ? localStorage.getItem('preferredCategory') : null) || 
    '16';
  
  // Synchroniser avec localStorage au premier rendu
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      // Si la catégorie n'est pas dans l'URL mais existe dans localStorage, mettre à jour l'URL
      if (!searchParams.get('category') && localStorage.getItem('preferredCategory')) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', localStorage.getItem('preferredCategory')!);
        router.push(`?${params.toString()}`);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, router, searchParams]);
  
  // Fonction pour mettre à jour la catégorie
  const setCategory = useCallback((category: string) => {
    // Stocker dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredCategory', category);
    }
    
    // Mettre à jour l'URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);
  
  return { selectedCategory, setCategory };
}
