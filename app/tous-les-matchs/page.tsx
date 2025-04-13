"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Match } from "../../types/types";
import Image from "next/image";
import Loader from "../../src/components/Sections/components/Loader";
import { FaSync, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import ChickenSoccerStory from "~/src/components/Sections/components/ChickenSoccerStory";
import { useCategoryState } from "../../hooks/useCategoryState";

export default function TousLesMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJournee, setSelectedJournee] = useState<number | null>(null);
  const { selectedCategory, setCategory } = useCategoryState();
  const [lastViewedCategory, setLastViewedCategory] = useState<string | null>(
    null
  );

  const categories = [
    { id: "14", name: "U14" },
    { id: "15", name: "U15" },
    { id: "16", name: "U16" },
    { id: "17", name: "U17" },
    { id: "18", name: "U18" },
    { id: "senior", name: "Sénior" },
  ];

  const fetchAllMatches = async () => {
    // Si on a déjà chargé cette catégorie, ne pas recharger
    if (lastViewedCategory === selectedCategory && matches.length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      // Fetch first page to get total items
      const firstResponse = await fetch(
        `/api/matchs/1?category=${selectedCategory}`
      );
      const firstData = await firstResponse.json();
      const totalItems = firstData["hydra:totalItems"];
      const totalPages = Math.ceil(totalItems / 30);

      const allMatches: Match[] = [];
      // Ajouter les matchs de la première page déjà récupérée
      allMatches.push(...firstData["hydra:member"]);

      // Récupérer les autres pages en parallèle pour accélérer le chargement
      const otherPagesPromises = [];
      for (let page = 2; page <= totalPages; page++) {
        otherPagesPromises.push(
          fetch(`/api/matchs/${page}?category=${selectedCategory}`)
            .then((res) => res.json())
            .then((data) => data["hydra:member"])
        );
      }

      const otherPagesResults = await Promise.all(otherPagesPromises);
      otherPagesResults.forEach((pageMatches) => {
        allMatches.push(...pageMatches);
      });

      // Traiter les matchs pour détecter ceux qui sont reportés
      const processedMatches = allMatches.map((match) => {
        const matchDate = new Date(match.date);
        const today = new Date();

        // Si la date est passée, mais qu'il n'y a pas de score, considérer comme reporté
        const isLikelyPostponed =
          matchDate < today &&
          (match.home_score === null || match.away_score === null);

        return {
          ...match,
          postponed: match.postponed || isLikelyPostponed,
        };
      });

      // Sort matches by journée and then by date
      const sortedMatches = processedMatches.sort(
        (a, b) =>
          a.poule_journee.number - b.poule_journee.number ||
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setMatches(sortedMatches);
      setLastViewedCategory(selectedCategory);

      // Trouver automatiquement la journée pertinente en utilisant les matchs traités
      findRelevantJournee(sortedMatches);
    } catch (error) {
      console.error("Erreur lors de la récupération des matchs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const findRelevantJournee = (matchesList: Match[]) => {
    const today = new Date();

    // Regrouper les matchs par journée
    const journees: Record<number, Match[]> = {};
    matchesList.forEach((match) => {
      const journeeNum = match.poule_journee.number;
      if (!journees[journeeNum]) {
        journees[journeeNum] = [];
      }
      journees[journeeNum].push(match);
    });

    // Calculer le statut de chaque journée
    const journeeStatuses = Object.entries(journees).map(
      ([journeeNum, matches]) => {
        const numericJournee = parseInt(journeeNum);
        const totalMatches = matches.length;
        const matchesWithScores = matches.filter(
          (m) => m.home_score !== null && m.away_score !== null
        ).length;
        const upcomingMatches = matches.filter(
          (m) => new Date(m.date) >= today && !m.postponed
        ).length;

        // Pourcentage de matchs joués dans cette journée
        const completionRate =
          totalMatches > 0 ? matchesWithScores / totalMatches : 0;

        // Déterminer si cette journée est terminée, en cours ou à venir
        let status;
        if (completionRate >= 0.75) {
          status = "completed"; // Journée terminée (75% ou plus des matchs ont des scores)
        } else if (completionRate > 0) {
          status = "in_progress"; // Journée en cours (certains matchs ont des scores)
        } else if (upcomingMatches > 0) {
          status = "upcoming"; // Journée à venir (aucun match n'a de score mais certains sont à venir)
        } else {
          status = "postponed"; // Journée reportée (aucun match n'a de score et aucun n'est à venir)
        }

        // Date du prochain match de cette journée (si applicable)
        const nextMatchDate = matches
          .filter(
            (m) =>
              new Date(m.date) >= today && !m.postponed && m.home_score === null
          )
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )[0]?.date;

        return {
          journeeNum: numericJournee,
          status,
          completionRate,
          nextMatchDate: nextMatchDate ? new Date(nextMatchDate) : null,
        };
      }
    );

    // Trouver la journée en cours
    const inProgressJournees = journeeStatuses.filter(
      (j) => j.status === "in_progress"
    );
    if (inProgressJournees.length > 0) {
      // Prendre la journée en cours avec le taux de complétion le plus bas
      const currentJournee = inProgressJournees.sort(
        (a, b) => a.completionRate - b.completionRate
      )[0];
      setSelectedJournee(currentJournee.journeeNum);
      return;
    }

    // Si aucune journée n'est en cours, trouver la prochaine journée à venir
    const upcomingJournees = journeeStatuses.filter(
      (j) => j.status === "upcoming"
    );
    if (upcomingJournees.length > 0) {
      // Prendre la journée à venir avec le prochain match le plus proche
      const nextJournee = upcomingJournees
        .filter((j) => j.nextMatchDate !== null)
        .sort(
          (a, b) => a.nextMatchDate!.getTime() - b.nextMatchDate!.getTime()
        )[0];

      if (nextJournee) {
        setSelectedJournee(nextJournee.journeeNum);
        return;
      }
    }

    // Si aucune journée n'est en cours ou à venir, prendre la dernière journée terminée
    const completedJournees = journeeStatuses.filter(
      (j) => j.status === "completed"
    );
    if (completedJournees.length > 0) {
      // Prendre la journée terminée avec le numéro le plus élevé
      const lastCompletedJournee = completedJournees.sort(
        (a, b) => b.journeeNum - a.journeeNum
      )[0];
      setSelectedJournee(lastCompletedJournee.journeeNum);
      return;
    }

    // Si aucune journée n'est trouvée, prendre la première journée
    if (journeeStatuses.length > 0) {
      const firstJournee = journeeStatuses.sort(
        (a, b) => a.journeeNum - b.journeeNum
      )[0];
      setSelectedJournee(firstJournee.journeeNum);
    }
  };

  useEffect(() => {
    fetchAllMatches();
  }, [selectedCategory]);

  const getSuffix = (number: number) => {
    if (number === 1) return "ère";
    return "ème";
  };

  // Utiliser useMemo pour éviter de recalculer les groupes à chaque rendu
  const groupedMatches = useMemo(() => {
    return matches.reduce((acc: Record<number, Match[]>, match) => {
      const journeeNumber = match.poule_journee.number;
      if (!acc[journeeNumber]) {
        acc[journeeNumber] = [];
      }
      acc[journeeNumber].push(match);
      return acc;
    }, {});
  }, [matches]);

  // Obtenir les journées triées
  const sortedJournees = useMemo(() => {
    return Object.keys(groupedMatches)
      .map(Number)
      .sort((a, b) => a - b);
  }, [groupedMatches]);

  // Trouver les indices des journées précédente, actuelle et suivante
  const currentJourneeIndex = useMemo(() => {
    if (selectedJournee === null) return -1;
    return sortedJournees.findIndex((j) => j === selectedJournee);
  }, [selectedJournee, sortedJournees]);

  const prevJournee =
    currentJourneeIndex > 0 ? sortedJournees[currentJourneeIndex - 1] : null;
  const nextJournee =
    currentJourneeIndex < sortedJournees.length - 1
      ? sortedJournees[currentJourneeIndex + 1]
      : null;

  // Déterminer si un match est passé mais sans score
  const isPastMatchWithoutScore = (match: Match) => {
    const matchDate = new Date(match.date);
    const today = new Date();
    return (
      matchDate < today &&
      (match.home_score === null || match.away_score === null)
    );
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
      <h1 className="text-2xl font-bold py-5 text-center uppercase">
        Tous les Matchs
      </h1>

      {/* Sélecteur de catégorie */}
      <div className="flex items-center p-3 justify-center">
        <label htmlFor="category" className="mr-2 font-semibold">
          Catégorie :
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md bg-[#800020] text-gray-300"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation simplifiée des journées */}
      <div className="mb-4 text-center flex justify-center items-center">
        {prevJournee !== null && (
          <button
            className="mx-1 my-1 px-4 py-2 rounded bg-gray-300 text-black transition duration-200 ease-in-out hover:bg-gray-400 focus:outline-none"
            onClick={() => setSelectedJournee(prevJournee)}
          >
            <FaArrowLeft className="inline mr-1" /> {prevJournee}
            {getSuffix(prevJournee)}
          </button>
        )}

        <div className="mx-2 px-4 py-2 bg-yellow-500 text-white rounded">
          {selectedJournee !== null ? (
            <span>
              {selectedJournee}
              {getSuffix(selectedJournee)} journée
            </span>
          ) : (
            <span>Sélectionnez une journée</span>
          )}
        </div>

        {nextJournee !== null && (
          <button
            className="mx-1 my-1 px-4 py-2 rounded bg-gray-300 text-black transition duration-200 ease-in-out hover:bg-gray-400 focus:outline-none"
            onClick={() => setSelectedJournee(nextJournee)}
          >
            {nextJournee}
            {getSuffix(nextJournee)} <FaArrowRight className="inline ml-1" />
          </button>
        )}

        <button
          className="ml-2 bg-red-800 text-white p-2 rounded-full transition duration-200 ease-in-out hover:bg-red-600 focus:outline-none"
          onClick={() => setSelectedJournee(null)}
          title="Voir toutes les journées"
        >
          <FaSync />
        </button>
      </div>

      {/* Menu déroulant pour toutes les journées */}
      {selectedJournee === null && (
        <div className="mb-4 text-center">
          <select
            className="p-2 border rounded-md bg-[#800020] text-white"
            onChange={(e) => setSelectedJournee(Number(e.target.value))}
            value=""
          >
            <option value="" disabled>
              Choisir une journée
            </option>
            {sortedJournees.map((journee) => (
              <option key={journee} value={journee}>
                {journee}
                {getSuffix(journee)} journée
              </option>
            ))}
          </select>
        </div>
      )}

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
            {Object.entries(groupedMatches).map(
              ([journeeNumber, journeeMatches]) => {
                // Si une journée est sélectionnée et que ce n'est pas celle-ci, ne pas afficher
                if (
                  selectedJournee !== null &&
                  Number(journeeNumber) !== selectedJournee
                ) {
                  return null;
                }

                // Filtrer les matchs passés sans score pour les journées à venir
                const filteredMatches = journeeMatches.filter(
                  (match) => !isPastMatchWithoutScore(match)
                );

                if (filteredMatches.length === 0) return null;

                return (
                  <React.Fragment key={journeeNumber}>
                    <tr className="bg-yellow-100">
                      <td
                        colSpan={4}
                        className="text-center text-red-500 font-bold bg-yellow-500 text-2xl p-5 rounded"
                      >
                        {journeeNumber}
                        <sup>{getSuffix(Number(journeeNumber))}</sup> Journée
                      </td>
                    </tr>
                    {filteredMatches.map((match) => (
                      <tr
                        key={match.ma_no}
                        className="border-b-2 border-gray-700 bg-white my-4"
                      >
                        <td colSpan={4} className="p-4">
                          <Link
                            href={`/matchs/${match.ma_no}`}
                            className="block w-full h-full"
                          >
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4 flex flex-col md:flex-row items-center">
                              <div className="flex-1 text-center md:text-left">
                                <p className="text-center md:text-left text-gray-700 font-semibold">
                                  {new Date(match.date)
                                    .toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                    .replace(/^\w/, (c) =>
                                      c.toUpperCase()
                                    )}{" "}
                                  à{" "}
                                  <span className="text-red-500">
                                    {match.time}
                                  </span>
                                </p>
                              </div>
                              <div className="flex flex-row justify-around items-center flex-1 my-4">
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
                                    {match.home.short_name.split(" ")[0]}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center justify-center mx-5">
                                  <span className="text-red-500 text-2xl">
                                    vs
                                  </span>
                                  {match.home_score !== null &&
                                  match.away_score !== null ? (
                                    <h2 className="text-lg sm:text-2xl font-bold">
                                      {match.home_score} - {match.away_score}
                                    </h2>
                                  ) : (
                                    <h2 className="text-lg sm:text-2xl font-bold">
                                      ⏳
                                    </h2>
                                  )}
                                </div>
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
                                    {match.away.short_name.split(" ")[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 text-center md:text-right">
                                <p className="text-gray-500 text-sm mt-2">
                                  {match.terrain?.name ?? "⏳"},{" "}
                                  {match.terrain?.city ?? ""}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
            )}
          </tbody>
        </table>
      </div>
      <ChickenSoccerStory />
    </div>
  );
}
