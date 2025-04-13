// src/components/CategoryPreference.tsx
"use client";
import { useState } from 'react';
import Image from "next/image";
import { useCategoryState } from '../../../hooks/useCategoryState';

interface CategoryPreferenceProps {
  onComplete: () => void;
}

const CategoryPreference: React.FC<CategoryPreferenceProps> = ({ onComplete }) => {
  const { setCategory } = useCategoryState();
  const [selectedValue, setSelectedValue] = useState('16');
  
  const categories = [
    { id: '14', name: 'U14' },
    { id: '15', name: 'U15' },
    { id: '16', name: 'U16' },
    { id: '17', name: 'U17' },
    { id: '18', name: 'U18' },
    { id: 'senior', name: 'Sénior' }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategory(selectedValue);
    onComplete();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-90 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-center mb-4">
        <Image
            src="/images/logo.png"
            alt="logo escm"
            width={70}
            height={70}
            priority
            />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center text-red-800">
            Choisissez votre catégorie
        </h2>
        <p className="mb-6 text-gray-600 text-center">
          Vous pourrez toujours changer de catégorie plus tard.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="radio"
                  id={`cat-${category.id}`}
                  name="category"
                  value={category.id}
                  checked={selectedValue === category.id}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  className="mr-2"
                />
                <label 
                  htmlFor={`cat-${category.id}`}
                  className={`flex-1 p-3 text-center rounded-md cursor-pointer transition-colors ${
                    selectedValue === category.id 
                      ? 'bg-red-800 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors"
          >
            Confirmer
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryPreference;
