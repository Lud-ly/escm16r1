"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import Loader from "../components/Loader";
import { Match } from "~/types/types";
import ChickenSoccerStory from "../components/ChickenSoccerStory";
import { useCategoryState } from '../../../../hooks/useCategoryState';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const GraphComponent: React.FC = () => {
    const [resultsByCategory, setResultsByCategory] = useState<Record<string, Match[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const { selectedCategory, setCategory } = useCategoryState();

    useEffect(() => {
        const fetchAllCategories = async () => {
            setIsLoading(true);
            const categories = ["14", "15", "16", "17", "18", "senior"];
            const results: Record<string, Match[]> = {};

            try {
                await Promise.all(
                    categories.map(async (category) => {
                        const response = await fetch(`/api/matchs?category=${category}`);
                        if (!response.ok) {
                            console.error(`Erreur API pour la catégorie ${category}`);
                            results[category] = [];
                            return;
                        }

                        const data = await response.json();
                        if (!data || !data["hydra:member"]) {
                            console.warn(`Données vides pour U${category}`);
                            results[category] = [];
                            return;
                        }

                        const matches = data["hydra:member"]
                            .filter((match: Match) => match.home_score !== null && match.away_score !== null)
                            .sort((a: Match, b: Match) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 6);

                        results[category] = matches;
                    })
                );

                console.log("🚀 Résultats récupérés :", results);
                setResultsByCategory(results);
            } catch (error) {
                console.error("Erreur lors de la récupération des résultats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllCategories();
    }, []);

    const processMatchData = () => {
        const matches = resultsByCategory[selectedCategory] || [];
        if (matches.length === 0) {
            console.warn(`⚠️ Aucun match disponible pour U${selectedCategory}`);
            return null;
        }

        // Créer l'historique des points pour ENT.ST CLEMENT MONT
        const pointsHistory = matches.map((match) => {
            const homeScore = match.home_score !== null ? match.home_score : 0;
            const awayScore = match.away_score !== null ? match.away_score : 0;

            // Vérification de l'équipe à domicile ou à l'extérieur
            const isHome = match.home.short_name === "ENT. ST CLEMENT MONT";
            const isAway = match.away.short_name === "ENT. ST CLEMENT MONT";

            let points = 0;

            // Si ENT joue à domicile
            if (isHome) {
                if (homeScore > awayScore) {
                    points = 3; // Victoire à domicile
                } else if (homeScore === awayScore) {
                    points = 1; // Match nul à domicile
                }
            }

            // Si ENT joue à l'extérieur
            if (isAway) {
                if (awayScore > homeScore) {
                    points = 3; // Victoire à l'extérieur
                } else if (awayScore === homeScore) {
                    points = 1; // Match nul à l'extérieur
                }
            }

            return points;
        });

        // Calculer le total cumulatif des points
        const cumulativePoints = pointsHistory.reduce((acc: number[], points: number) => {
            const lastTotal = acc.length > 0 ? acc[acc.length - 1] : 0;
            return [...acc, lastTotal + points];
        }, []);

        // Créer les labels des matchs
        const labels = matches.map((_, index) => `Match ${index + 1}`);
        // Retourner les bonnes données à envoyer au graphique
        return {
            labels,
            datasets: [
                {
                    label: `U${selectedCategory}`,
                    data: cumulativePoints, // Utiliser les points cumulatifs
                    borderColor: getColorForCategory(selectedCategory),
                    backgroundColor: getColorForCategory(selectedCategory),
                    tension: 0.4,
                },
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Points',
                        },
                        ticks: {
                            callback: function (tickValue: string | number) {
                                if (typeof tickValue === 'number') {
                                    return tickValue % 1 === 0 ? tickValue : Math.round(tickValue);
                                }
                                return tickValue;
                            },
                            stepSize: 1,
                        },
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context: { raw: number; }) {
                                return `Points: ${Math.round(context.raw)}`;
                            },
                        },
                    },
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Graphique des points de U${selectedCategory}`,
                    },
                },
            },
        };
    };

    const getColorForCategory = (category: string): string => {
        const colors = {
            "14": "rgb(229, 17, 38)",
            "15": "rgb(6, 108, 176)",
            "16": "rgb(16, 196, 10)",
            "17": "rgb(255, 159, 64)",
            "18": "rgb(187, 192, 44)",
        };
        return colors[category as keyof typeof colors];
    };

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Points",
                },
                ticks: {
                    callback: function (tickValue: string | number) {
                        if (typeof tickValue === 'number') {
                            return tickValue % 1 === 0 ? tickValue : Math.round(tickValue);
                        }
                        return tickValue;
                    },
                    stepSize: 1,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => {
                        const matchIndex = tooltipItems[0].dataIndex;
                        const match = resultsByCategory[selectedCategory]?.slice(0, 6).reverse()[matchIndex];

                        if (match) {
                            const date = new Date(match.date).toLocaleDateString();
                            return `${match.home.short_name} vs ${match.away.short_name}\n${date}`;
                        }
                        return "";
                    },
                    label: (tooltipItem) => {
                        const matchIndex = tooltipItem.dataIndex;
                        const matches = resultsByCategory[selectedCategory]?.slice(0, 6).reverse();

                        if (matches && matchIndex < matches.length) {
                            const match = matches[matchIndex];
                            const actualPoints = tooltipItem.formattedValue;
                            // Calculer le maximum de points possibles basé sur le nombre de matchs joués jusqu'à présent
                            // matchIndex + 1 car les indices commencent à 0
                            const maxPossiblePoints = (matchIndex + 1) * 3;

                            return `Score: ${match.home_score}-${match.away_score} (Points: ${actualPoints}/${maxPossiblePoints})`;
                        }
                        return "";
                    },
                },
            },
            legend: {
                position: "top",
                labels: {
                    generateLabels: function (chart) {
                        return chart.data.datasets.map((dataset, index) => ({
                            text: `Régional ${index + 1}`,
                            fillStyle: dataset.backgroundColor as string,
                            strokeStyle: dataset.borderColor as string,
                            lineWidth: 2,
                            hidden: !chart.isDatasetVisible(index),
                            datasetIndex: index,
                        }));
                    },
                },
            },
            title: {
                display: true,
                text: `Tendance des 6 derniers matchs`,
                font: {
                    size: 16,
                },
            },
        }
    };
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <Loader />
            </div>
        );
    }

    return (
        <div className="p-2 md:p-5">
            <div className="flex items-center justify-center p-3">
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

            {processMatchData() ? (
                <div className="mt-2 md:mt-4 h-[400px]">
                    <Line options={chartOptions} data={processMatchData()!} />
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-4">
                    Aucune statistique disponible pour cette catégorie.
                </div>
            )}

            <ChickenSoccerStory />
        </div>
    );
};

export default GraphComponent;