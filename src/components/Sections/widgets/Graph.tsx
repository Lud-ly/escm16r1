"use client";

import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from "chart.js";
import Loader from "../components/Loader";
import { ClubData, Match } from "~/types/types";
import Image from "next/image";
import { FaChartBar, FaChartLine } from "react-icons/fa";
import ChickenSoccerStory from "../components/ChickenSoccerStory";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GraphComponent: React.FC = () => {
    const [logos, setLogos] = useState<{ [key: string]: string }>({});
    const [results, setResults] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chartType, setChartType] = useState<"line" | "bar">("line");
    const [activeClub, setActiveClub] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatchResults = async (page: number = 1) => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/matchs?page=${page}`);
                const data = await response.json();
                console.log(data);
                
                const clubIds = new Set<number>();
                data["hydra:member"].forEach((match: Match) => {
                    clubIds.add(match.home.club.cl_no);
                    clubIds.add(match.away.club.cl_no);
                });

                const logoPromises = Array.from(clubIds).map(clubId => fetchClubLogo(clubId));
                const logosData = await Promise.all(logoPromises);
                const logosMap = logosData.reduce((acc, { clubId, logo, shortName }) => {
                    if (clubId && logo) {
                        acc[shortName] = logo;
                        acc[logo] = logo;
                    }
                    return acc;
                }, {} as { [key: string]: string });

                setLogos(logosMap);
                setResults(data["hydra:member"].sort((a: Match, b: Match) => a.poule_journee.number - b.poule_journee.number));
            } catch (error) {
                console.error("Erreur lors de la récupération des résultats de match:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchResults();
    }, []);

    const fetchClubLogo = async (clubId: number) => {
        const controller = new AbortController();
        const signal = controller.signal;
        try {
            const clubRes = await fetch(`/api/clubs/${clubId}`, { signal });
            const clubData: ClubData = await clubRes.json();
            return { clubId, logo: clubData.logo, shortName: clubData.name };
        } catch (error) {
            console.error(`Erreur lors de la récupération du logo pour le club ${clubId}:`, error);
            return { clubId, logo: null, shortName: null };
        }
    };

    const calculatePoints = (match: Match, clubName: string): number | null => {
        if (match.home_score === null || match.away_score === null) return null;
        const isHome = match.home.short_name === clubName;
        const score = isHome ? match.home_score - match.away_score : match.away_score - match.home_score;
        return score > 0 ? 3 : score === 0 ? 1 : 0;
    };

    const generateChartDataForClub = (clubName: string, matches: Match[]): ChartData<'line'> => {
        const pointsData: (number | null)[] = [];
        const goalsForData: (number | null)[] = [];
        const goalsAgainstData: (number | null)[] = [];
        const labels: string[] = [];
        let cumulativePoints = 0;

        const filteredMatches = matches.filter(match =>
            match.home.short_name === clubName || match.away.short_name === clubName
        );

        filteredMatches.forEach((match) => {
            const matchDay = match.poule_journee.number;
            labels.push(`J${matchDay}`);

            const points = calculatePoints(match, clubName);
            if (points !== null) {
                cumulativePoints += points;
                pointsData.push(cumulativePoints);
            } else {
                pointsData.push(null);
            }

            const isHome = match.home.short_name === clubName;
            goalsForData.push(isHome ? match.home_score : match.away_score);
            goalsAgainstData.push(isHome ? match.away_score : match.home_score);
        });

        return {
            labels,
            datasets: [
                {
                    label: "Points cumulés",
                    data: pointsData,
                    borderColor: "rgba(56, 189, 248, 1)",
                    backgroundColor: "rgba(56, 189, 248, 0.2)",
                    fill: false,
                    spanGaps: true,
                },
                {
                    label: "Buts marqués",
                    data: goalsForData,
                    borderColor: "rgba(34, 197, 94, 1)",
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                    fill: false,
                    spanGaps: true,
                },
                {
                    label: "Buts encaissés",
                    data: goalsAgainstData,
                    borderColor: "rgba(239, 68, 68, 1)",
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    fill: false,
                    spanGaps: true,
                },
            ],
        };
    };

    const generateBarChartDataForClub = (clubName: string, matches: Match[]): ChartData<'bar'> => {
        const labels: string[] = [];
        const goalsForData: (number | null)[] = [];
        const goalsAgainstData: (number | null)[] = [];

        const filteredMatches = matches.filter(match =>
            match.home.short_name === clubName || match.away.short_name === clubName
        );

        filteredMatches.forEach((match) => {
            const matchDay = match.poule_journee.number;
            labels.push(`J${matchDay}`);
            const isHome = match.home.short_name === clubName;
            goalsForData.push(isHome ? match.home_score : match.away_score);
            goalsAgainstData.push(isHome ? match.away_score : match.home_score);
        });

        return {
            labels,
            datasets: [
                {
                    label: "Buts marqués",
                    data: goalsForData,
                    backgroundColor: "rgba(34, 197, 94, 1)",
                },
                {
                    label: "Buts encaissés",
                    data: goalsAgainstData,
                    backgroundColor: "rgba(239, 68, 68, 1)",
                },
            ],
        };
    };

    const commonOptions: ChartOptions<'line' | 'bar'> = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                display: true, // Garder l'axe des ordonnées à gauche visible
            },
            y1: {
                beginAtZero: true,
                display: false, // Cacher l'axe des ordonnées à droite
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    const sortClubs = (matches: Match[], type: 'attack' | 'defense') => {
        const clubStats: {
            [key: string]: {
                goalsFor: number;
                goalsAgainst: number;
                clubId: number;
                logo: string;
            }
        } = {};

        matches.forEach(match => {
            const homeTeam = match.home.short_name;
            const awayTeam = match.away.short_name;
            const homeTeamId = match.home.club.cl_no;
            const awayTeamId = match.away.club.cl_no;
            const homeTeamLogo = match.home.club.logo;
            const awayTeamLogo = match.away.club.logo;

            if (!clubStats[homeTeam]) {
                clubStats[homeTeam] = {
                    goalsFor: 0,
                    goalsAgainst: 0,
                    clubId: homeTeamId,
                    logo: homeTeamLogo
                };
            }
            if (!clubStats[awayTeam]) {
                clubStats[awayTeam] = {
                    goalsFor: 0,
                    goalsAgainst: 0,
                    clubId: awayTeamId,
                    logo: awayTeamLogo
                };
            }

            clubStats[homeTeam].goalsFor += match.home_score || 0;
            clubStats[homeTeam].goalsAgainst += match.away_score || 0;
            clubStats[awayTeam].goalsFor += match.away_score || 0;
            clubStats[awayTeam].goalsAgainst += match.home_score || 0;
        });

        const sortedClubs = Object.entries(clubStats)
            .map(([club, stats]) => ({
                club,
                ...stats,
                points: stats.goalsFor - stats.goalsAgainst,
            }))
            .sort((a, b) => type === 'attack' ? b.goalsFor - a.goalsFor : a.goalsAgainst - b.goalsAgainst);
         
        return sortedClubs;
    };

    const bestAttackers = sortClubs(results, 'attack').slice(0, 4);
    const bestDefenders = sortClubs(results, 'defense').slice(0, 4);

    return (
        <div className="p-8 bg-white min-h-screen">
            {/* Podium Meilleures Attaques */}
            <div className="flex items-start mb-4">
                <h2 className="text-2xl font-bold">Meilleures Attaques</h2>
            </div>
            {/* Graphiques pour Meilleures Attaques */}
            <div className="flex flex-col gap-4">
                {bestAttackers.map(({ club, logo }, index) => (
                    activeClub === club && (
                        <div key={index} className="w-full mt-4">
                            <div className="flex flex-row items-center justify-around">
                                <Image
                                    src={logo}
                                    alt={`Logo ${club}`}
                                    width={60}
                                    height={60}
                                    className="mx-auto my-2 w-auto h-auto"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "./images/next.svg";
                                    }}
                                    unoptimized
                                />
                                <select
                                    value={chartType}
                                    onChange={(e) => setChartType(e.target.value as "line" | "bar")}
                                    className="p-2 border border-gray-300 rounded"
                                >
                                    <option value="line">Courbes</option>
                                    <option value="bar">Barres</option>
                                </select>
                            </div>
                            {chartType === "line" ? (
                                <Line data={generateChartDataForClub(club, results)} options={commonOptions} />
                            ) : (
                                <Bar data={generateBarChartDataForClub(club, results)} options={commonOptions} />
                            )}
                        </div>
                    )
                ))}
            </div>
            {isLoading ? (
                <div className="flex justify-center items-start min-h-screen">
                    <Loader />
                </div>
            ) : (
                <div>
                    {/* Podium Meilleures Attaques */}
                    <div className="flex justify-center items-center mb-8">
                        {bestAttackers.map(({ club, goalsFor, logo }, index) => (
                            <div key={index} className={`w-48 rounded ${index === 0 ? 'min-h-[350px] bg-gradient-to-b from-[#FFAC25] via-[#FECF33] to-[#FFAC25]' : index === 1 ? 'min-h-[250px] bg-blue-500' : 'min-h-[80px] bg-green-500'}`}>
                                <button
                                    onClick={() => setActiveClub(activeClub === club ? null : club)}
                                    className="flex flex-col items-center w-full"
                                >
                                    <div className="flex justify-center items-center text-white text-[35px] badge">
                                        {index + 1}
                                    </div>
                                    <Image
                                        src={logo}
                                        alt={`Logo ${club}`}
                                        width={60}
                                        height={60}
                                        className="mx-auto my-2 w-auto h-auto"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "./images/next.svg";
                                        }}
                                        unoptimized
                                    />
                                    <div className="text-center text-white mb-3">{goalsFor} Buts marqués</div>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Podium Meilleures Défenses */}
                    <div className="flex items-start mb-4">
                        <h2 className="text-2xl font-bold">Meilleures Défenses</h2>
                    </div>
                    {/* Graphiques pour Meilleures Défenses */}
                    <div className="flex flex-col gap-4">
                        
                        {bestDefenders.map(({ club, logo }, index) => (
                            activeClub === club && (
                                <div key={index} className="w-full mt-4">
                                       <div className="flex flex-row items-center justify-around">
                                <Image
                                    src={logo}
                                    alt={`Logo ${club}`}
                                    width={60}
                                    height={60}
                                    className="mx-auto my-2 w-auto h-auto"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "./images/next.svg";
                                    }}
                                    unoptimized
                                />
                                </div>
                                    {chartType === "line" ? (
                                        <Line data={generateChartDataForClub(club, results)} options={commonOptions} />
                                    ) : (
                                        <Bar data={generateBarChartDataForClub(club, results)} options={commonOptions} />
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                    <div className="flex justify-center items-center mb-8">
                        {bestDefenders.map(({ club, logo, goalsAgainst }, index) => (
                            <div key={index} className={`w-48 ${index === 0 ? 'min-h-[350px] bg-gradient-to-b from-[#FFAC25] via-[#FECF33] to-[#FFAC25] rounded' : index === 1 ? 'min-h-[250px] bg-blue-500' : 'min-h-[80px] bg-green-500'}`}>
                                <button
                                    onClick={() => setActiveClub(activeClub === club ? null : club)}
                                    className="flex flex-col items-center w-full"
                                >
                                    <div className="flex justify-center items-center text-white text-[35px]">
                                        {index + 1}
                                    </div>
                                    <Image
                                        src={logo}
                                        alt={`Logo ${club}`}
                                        width={60}
                                        height={60}
                                        className="mx-auto my-2 w-auto h-auto"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "./images/next.svg";
                                        }}
                                        unoptimized
                                    />
                                    <div className="text-center text-white mb-3">{goalsAgainst} Buts encaissés</div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             <ChickenSoccerStory/>
        </div>
    );
};

export default GraphComponent;
