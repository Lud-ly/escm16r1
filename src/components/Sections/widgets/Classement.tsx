"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowUp, FaArrowRight, FaArrowDown, FaSync } from "react-icons/fa";
import Loader from "../components/Loader";
import ChickenSoccerStory from "../components/ChickenSoccerStory";


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
    ? "https://ccfc16r1.vercel.app"
    : "http://localhost:3000";

const ClassementComponent = () => {
  const [classements, setClassements] = useState<ClassementJournee[]>([]);
  const [logos, setLogos] = useState<{ [key: string]: string }>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<ClubResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Fonction pour récupérer les classements
    const fetchClassements = async () => {
      setIsLoading(true);

      try {
        const res = await fetch('/api/classements');
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

    // Fonction pour récupérer les résultats des clubs
    const fetchClubResults = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${baseUrl}/api/club-results`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        });
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        setResults(data);
      } catch (error) {
        console.error("Error fetching club results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassements();

    return () => {
      // controller.abort();
    };
  }, []);

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

  // Fonction pour vérifier et mettre à jour les données dans la base Prisma
  const checkAndUpdateDatabase = async (
    latestUpdate: string,
    classements: ClassementJournee[]
  ) => {

    try {
      const res = await fetch(`${baseUrl}/api/check-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latestUpdate }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la vérification de la mise à jour.");
      }

      const data = await res.json();

      if (data.shouldUpdate) {
        const saveRes = await fetch(
          `${baseUrl}/api/save-classement`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ classements }),
          }
        );

        if (!saveRes.ok) {
          throw new Error("Erreur lors de la sauvegarde des classements.");
        }

        console.log("Classements mis à jour dans la base de données.");
      } else {
        console.log("Les classements sont déjà à jour.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la base de données:",
        error
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <Loader />
      </div>
    );
  }

  const handleRefresh = async () => {
    setIsLoading(true);
    await checkAndUpdateDatabase(lastUpdated, classements);
    setIsLoading(false);
  };

  return (
    <div className="p-4 mb-5">
      <h2 className="text-2xl text-center font-bold py-5 uppercase">
        Classement U16 R1 Occitanie
      </h2>
      <div className="flex flex-row justify-between items-start md:items-center mb-4">
        <p className="text-sm text-black mt-2 md:mt-0 mr-2">
          Mise à jour le : {formatDate(lastUpdated)}
        </p>
        <button className="bg-transparent text-sm hover:bg-gray-200 text-black font-bold p-2 border border-gray-300 rounded" onClick={handleRefresh}>Saison 2024-2025</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Pos</th>
              <th className="p-2 text-left">Club</th>
              <th className="p-2 text-left">Nom</th>
              <th className="p-2 text-center text-blue-900 font-bold text-lg">
                Pts
              </th>
              <th className="p-2 text-right">J</th>
              <th className="p-2 text-right">G</th>
              <th className="p-2 text-right">N</th>
              <th className="p-2 text-right">P</th>
              <th className="p-2 text-right">BP</th>
              <th className="p-2 text-right">BC</th>
              <th className="p-2 text-right">Diff</th>
              {/* <th className="p-2 text-center">T</th> */}
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
                    <td className="py-2 text-center text-blue-800 font-bold text-xl">
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
                    {/* <td className="p-2 text-center">
                      <div className="inline-block p-2 bg-black rounded-full">
                        {trend === "up" && (
                          <FaArrowUp className="text-green-500" />
                        )}
                        {trend === "neutral" && (
                          <FaArrowRight className="text-orange-300" />
                        )}
                        {trend === "down" && (
                          <FaArrowDown className="text-red-500" />
                        )}
                        {trend === "encouraging" && (
                          <FaArrowUp className="text-blue-500" />
                        )}
                        {trend === "concerning" && (
                          <FaArrowDown className="text-purple-500" />
                        )}
                      </div>
                    </td> */}

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className="p-4 text-left text-gray-600">
                  Pas de données disponibles,
                  <br /> vérifier votre connexion.
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
