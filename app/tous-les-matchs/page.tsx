"use client";

import React, { useEffect, useState } from "react";
import { Match } from "../../types/types";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import Loader from "../../src/components/Sections/components/Loader";
import { FaSync } from "react-icons/fa";
import Link from "next/link";
import ChickenSoccerStory from "~/src/components/Sections/components/ChickenSoccerStory";


export default function TousLesMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJournee, setSelectedJournee] = useState<number | null>(null);
  const [selectedCategoryMatch, setSelectedCategoryMatch] = useState<string>('16');

  const categories = [
    { id: '14', name: 'U14' },
    { id: '15', name: 'U15' },
    { id: '16', name: 'U16' },
    { id: '17', name: 'U17' },
    { id: '18', name: 'U18' },
  ];

  const findPageWithNextMatch = (allMatches: Match[]): number => {
    const today = new Date();
    const nextMatch = allMatches.find(match => new Date(match.date) >= today);
    if (nextMatch) {
      const matchIndex = allMatches.indexOf(nextMatch);
      return Math.floor(matchIndex / 30) + 1;
    }
    return 1;
  };

  const fetchAllMatches = async () => {
    setIsLoading(true);
    try {
      // Fetch first page to get total items
      const firstResponse = await fetch(`/api/matchs/1?category=${selectedCategoryMatch}`);
      const firstData = await firstResponse.json();
      const totalItems = firstData["hydra:totalItems"];
      const totalPages = Math.ceil(totalItems / 30);

      const allMatches: Match[] = [];
      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`/api/matchs/${page}?category=${selectedCategoryMatch}`);
        const data = await response.json();
        allMatches.push(...data["hydra:member"]);
      }

      const nextPage = findPageWithNextMatch(allMatches);
      setCurrentPage(nextPage);

      const today = new Date();
      const nextMatch = allMatches.find(match => new Date(match.date) >= today);
      if (nextMatch) {
        setSelectedJournee(nextMatch.poule_journee.number);
      }

      const matchesForPage = allMatches.slice((nextPage - 1) * 30, nextPage * 30);
      setMatches(matchesForPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Erreur lors de la récupération des matchs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatchesForPage = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/matchs/${page}?category=${selectedCategoryMatch}`);
      const data = await response.json();
      setMatches(data["hydra:member"]);
      setTotalPages(Math.ceil(data["hydra:totalItems"] / 30));
    } catch (error) {
      console.error("Erreur lors de la récupération des matchs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMatches();
  }, [selectedCategoryMatch]);

  useEffect(() => {
    if (currentPage >= 1) {
      fetchMatchesForPage(currentPage);
    }
  }, [currentPage]);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategoryMatch(category);
    setCurrentPage(1);
  };

  const groupedMatches = matches.reduce((acc: Record<number, Match[]>, match) => {
    const journeeNumber = match.poule_journee.number;
    if (!acc[journeeNumber]) {
      acc[journeeNumber] = [];
    }
    acc[journeeNumber].push(match);
    return acc;
  }, {});

  const getSuffix = (number: number) => {
    if (number === 1) return "ère";
    return "ème";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-1">
      <h1 className="text-2xl font-bold py-5 text-center uppercase">Tous les Matchs</h1>
      {/* Sélecteur de catégorie */}
      <div className="flex items-center p-3">
        <label htmlFor="category" className="mr-2 font-semibold">
          Catégorie :
        </label>
        <select
          id="category"
          value={selectedCategoryMatch}
          onChange={(e) => setSelectedCategoryMatch(e.target.value)}
          className="p-2 border rounded-md bg-[#800020] text-gray-300"
        >
          <option value="14">U14</option>
          <option value="15">U15</option>
          <option value="16">U16</option>
          <option value="17">U17</option>
          <option value="18">U18</option>
        </select>
      </div>
      <div className="mb-4 text-center flex flex-wrap justify-center">
        {Object.keys(groupedMatches).map((journeeNumber) => (
          <button
            key={journeeNumber}
            className={`mx-1 my-1 px-4 py-2 rounded transition duration-200 ease-in-out 
              ${selectedJournee === Number(journeeNumber) ? "bg-yellow-500" : "bg-red-800"} 
              text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300`}
            onClick={() => setSelectedJournee(selectedJournee === Number(journeeNumber) ? null : Number(journeeNumber))}
          >
            {journeeNumber}{getSuffix(Number(journeeNumber))} jour.
          </button>
        ))}
        <button
          className="mx-1 my-1 bg-gray-300 text-black px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setSelectedJournee(null)}
        >
          <FaSync />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="hidden md:table-header-group p-2">
            <tr className="bg-gray-200">
              <th className="p-2 text-center">Date</th>
              <th className="p-2 text-center">Match</th>
              <th className="p-2 text-center">Résultat</th>
              <th className="p-2 text-center">Terrain</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedMatches).map(([journeeNumber, matches]) => (
              <React.Fragment key={journeeNumber}>
                {selectedJournee === Number(journeeNumber) && (
                  <>
                    <tr className="bg-yellow-100">
                      <td colSpan={4} className="text-center text-red-500 font-bold bg-yellow-500 text-2xl p-5 rounded">
                        {journeeNumber}
                        <sup>{getSuffix(Number(journeeNumber))}</sup> Journée
                      </td>
                    </tr>
                    {matches.map((match) => (
                      <tr key={match.ma_no} className="border-b-2 border-gray-700 bg-white my-4">
                        <td className="p-2 block sm:table-cell">
                          <Link href={`/matchs/${match.ma_no}`} className="block w-full h-full mt-5">
                            <p className="text-center mt-2">
                              {new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())} à <span className="text-red-500">{match.time}</span>
                            </p>
                            <div className="flex flex-row justify-around items-center m-2">
                              {/* Équipe domicile */}
                              <div className="flex flex-col items-center">
                                <Image
                                  src={match.home.club.logo}
                                  alt={`Logo ${match.home.club.logo}`}
                                  width={70}
                                  height={70}
                                  className="mb-2"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/next.svg.png";
                                  }}
                                />
                                <span className="text-center text-sm font-bold">
                                  {match.home.short_name.split(' ')[0]}
                                </span>
                              </div>

                              {/* VS */}
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-red-500 text-2xl">vs</span>
                              </div>

                              {/* Équipe extérieur */}
                              <div className="flex flex-col items-center">
                                <Image
                                  src={match.away.club.logo}
                                  alt={`Logo ${match.away.short_name}`}
                                  width={70}
                                  height={70}
                                  className="mb-2"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/next.svg.png";
                                  }}
                                />
                                <span className="text-center text-sm font-bold">
                                  {match.away.short_name.split(' ')[0]}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="p-2 font-semibold block sm:table-cell">
                          <Link href={`/matchs/${match.ma_no}`} className="block w-full h-full">
                            <div className="flex flex-row justify-around items-center m-2">
                              {match.home_score !== null && match.away_score !== null ? (
                                <h2 className="text-lg sm:text-2xl font-bold">
                                  {match.home_score} - {match.away_score}
                                </h2>
                              ) : (
                                <h2 className="text-lg sm:text-2xl font-bold">⏳</h2>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="p-2 block sm:table-cell">
                          <Link href={`/matchs/${match.ma_no}`} className="block w-full h-full">
                            <div className="flex flex-row justify-center items-center m-2">
                              <span className="text-gray-500 text-sm">
                                {match.terrain?.name ?? "⏳"}, {match.terrain?.city ?? ""}
                              </span>
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <ChickenSoccerStory />
    </div>
  );
}