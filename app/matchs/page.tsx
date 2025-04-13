"use client";

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import Loader from '../../src/components/Sections/components/Loader';
import ChickenSoccerStory from '~/src/components/Sections/components/ChickenSoccerStory';
import { useCategoryState } from '../../hooks/useCategoryState';

interface Match {
  ma_no: number;
  date: string;
  home_score: number;
  away_score: number;
  time: number;
  home: {
    short_name: string;
    club: {
      logo: string;
    };
  };
  away: {
    short_name: string;
    club: {
      logo: string;
    };
  };
}

const MatchsAVenirPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedCategory, setCategory } = useCategoryState();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching matches for category:', selectedCategory);
        
        const response = await fetch(`/api/matchs?category=${selectedCategory}`, { signal });

        if (!response.ok) {
          throw new Error('Failed to fetch match data');
        }
        const data = await response.json();

        console.log('Fetched matches:', data['hydra:member']);

        setMatches(data['hydra:member']);
      } catch (error) {
        if (error === 'AbortError') {
          console.log('Requête annulée');
        } else {
          console.error('Erreur lors du chargement des matchs:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();

    return () => {
      controller.abort(); // Annule la requête si le composant est démonté
    };
  }, [selectedCategory]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl text-center font-bold py-5 uppercase">Matchs</h1>
      {/* Sélecteur de catégorie */}
      <div className="flex items-center p-3">
        <label htmlFor="category" className="mr-2 font-semibold">
          Catégorie :
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md bg-[#800020] text-gray-300"
        >
          <option value="14">U14</option>
          <option value="15">U15</option>
          <option value="16">U16</option>
          <option value="17">U17</option>
          <option value="18">U18</option>
          <option value="senior">SÉNIOR</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <Link key={match.ma_no} href={`/matchs/${match.ma_no}`}>
            <div className="border p-4 rounded-md shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white">
              <p className="text-center text-gray-600 mb-3">
                {new Date(match.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).replace(/^\w/, (c) => c.toUpperCase())} à <span className="text-blue-500">{match.time}</span>
              </p>

              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Équipe domicile */}
                <div className="flex flex-col items-center shadow-lg rounded-lg p-3 bg-gray-50">
                  <Image
                    src={match.home.club.logo}
                    alt={`Logo ${match.home.club.logo}`}
                    width={40}
                    height={40}
                    className="w-10 h-10 mb-2 object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/next.svg.png";
                    }}
                  />
                  <span className="text-center truncate max-w-[80px] text-sm font-medium">
                    {match.home.short_name}
                  </span>
                </div>

                {/* Score */}
                <div className="text-2xl font-bold text-center shadow-lg rounded-lg p-3 bg-gray-100">
                  {match.home_score !== null && match.away_score !== null
                    ? `${match.home_score} - ${match.away_score}`
                    : '⏳'}
                </div>

                {/* Équipe extérieur */}
                <div className="flex flex-col items-center shadow-lg rounded-lg p-3 bg-gray-50">
                  <Image
                    src={match.away.club.logo}
                    alt={`Logo ${match.away.club.logo}`}
                    width={40}
                    height={40}
                    className="w-10 h-10 mb-2 object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/next.svg.png";
                    }}
                  />
                  <span className="text-center truncate max-w-[80px] text-sm font-medium">
                    {match.away.short_name}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <ChickenSoccerStory />
    </div>
  );
};

export default MatchsAVenirPage;