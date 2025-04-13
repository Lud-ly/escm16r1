"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowUp, FaArrowRight, FaArrowDown, FaSync } from "react-icons/fa";
import Loader from "../components/Loader";
import ChickenSoccerStory from "../components/ChickenSoccerStory";
import { useCategoryState } from '../../../../hooks/useCategoryState';

interface ClassementJournee {
  "@id": string;
  rank: number;
  point_count: number;
  total_games_count: number;
  won_games_count: number;
  draw_games_count: number;
  lost_games_count: number;
  goals_for_count: number;
  goals_against_count: number;
  goals_diff: number;
  poule: {
    name: string;
  };
  equipe: {
    club: {
      "@id": string;
    };
    short_name: string;
  };
  external_updated_at: string;
}

interface ApiResponse {
  "hydra:member": ClassementJournee[];
}

interface ClubResult {
  clubId: string;
  clubName: string;
  wonGamesCount: number;
  drawGamesCount: number;
  lostGamesCount: number;
  totalGames: number;
  goals_for_count: number;
  goals_against_count: number;
  trend: string;
}
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://escmr1.vercel.app"
    : "http://localhost:3000";

const ClassementComponent = () => {
  const [classements, setClassements] = useState<ClassementJournee[]>([]);
  const [logos, setLogos] = useState<{ [key: string]: string }>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { selectedCategory, setCategory } = useCategoryState();
  const [results, setResults] = useState<ClubResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Fonction pour récupérer les classements
    const fetchClassements = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/classements?category=${selectedCategory}`, { signal });
        if (!res.ok) throw new Error("Failed to fetch classement data");
        const data = await res.json();

        setClassements(data["hydra:member"]);

        // Obtenir la date de mise à jour la plus récente
        const latestUpdate = data["hydra:member"].reduce((latest: string, current: any) => {
          return latest > current.external_updated_at
            ? latest
            : current.external_updated_at;
        }, "");
        setLastUpdated(latestUpdate);

        // Récupérer les logos pour chaque équipe
        const logoPromises = data["hydra:member"].map(async (classement: any) => {
          const clubId = classement.equipe.club["@id"].split("/").pop();
          try {
            const clubRes = await fetch(`/api/clubs/${clubId}`, { signal });
            const clubData = await clubRes.json();
            return { clubId, logo: clubData.logo };
          } catch (error) {
            console.error(`Erreur lors de la récupération du logo pour le club ${clubId}:`, error);
            return { clubId, logo: null };
          }
        });

        // Stocker les logos dans un objet { clubId: logo }
        const logosData = await Promise.all(logoPromises);
        const logosMap = logosData.reduce((acc, { clubId, logo }) => {
          if (clubId && logo) {
            acc[clubId] = logo;
          }
          return acc;
        }, {} as { [key: string]: string });

        setLogos(logosMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des classements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassements();

    return () => {
      controller.abort();
    };
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 mb-5">
      <h2 className="text-2xl text-center font-bold py-5 uppercase">
        Classement {selectedCategory} R1
      </h2>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Bouton Saison */}
        <button className="bg-transparent text-sm hover:bg-gray-200 text-black font-bold px-4 py-2 border border-gray-300 rounded">
          Saison 2024-2025
        </button>

        {/* Sélecteur de catégorie */}
        <div className="flex items-center p-1">
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
        <p className="text-sm text-black">Mise à jour le : {formatDate(lastUpdated)}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Pos</th>
              <th className="p-2 text-left">Club</th>
              <th className="p-2 text-left">Nom</th>
              <th className="p-2 text-center text-red-800 font-bold text-lg">
                Pts
              </th>
              <th className="p-2 text-right">J</th>
              <th className="p-2 text-right">G</th>
              <th className="p-2 text-right">N</th>
              <th className="p-2 text-right">P</th>
              <th className="p-2 text-right">BP</th>
              <th className="p-2 text-right">BC</th>
              <th className="p-2 text-right">Diff</th>
            </tr>
          </thead>
          <tbody>
            {classements && classements.length > 0 ? (
              classements.map((classement) => {
                const clubId = classement.equipe.club["@id"].split("/").pop();
                const clubResult = results.find(
                  (result) => result.clubId === clubId
                ); // Trouver le résultat du club correspondant
                const trend = clubResult ? clubResult.trend : "neutral"; // Déterminer la tendance

                return (
                  <tr key={classement["@id"]} className="border-b">
                    <td className="p-2">{classement.rank}</td>
                    <td className="p-2 flex items-center">
                      {clubId && logos[clubId] ? (
                        <Image
                          src={logos[clubId]}
                          alt={`Logo ${classement.equipe.short_name}`}
                          width={40}
                          height={40}
                          className="mr-2 w-auto h-auto"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/next.svg.png";
                          }}
                        />
                      ) : (
                        <div className="w-[30px] h-[30px] bg-gray-200 mr-2"></div>
                      )}
                    </td>
                    <td className="p-2">{classement.equipe.short_name}</td>
                    <td className="py-2 text-center text-red-900 font-bold text-xl">
                      {classement.point_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.total_games_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.won_games_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.draw_games_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.lost_games_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.goals_for_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.goals_against_count}
                    </td>
                    <td className="p-2 text-right">
                      {classement.goals_for_count -
                        classement.goals_against_count}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className="p-4 text-left text-gray-600">
                  Pas de données disponibles,
                  <br /> vérifier votre connexion ou revenez plus tard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ChickenSoccerStory />
    </div>
  );
};

export default ClassementComponent;
