"use client";

import React, { useEffect, useState } from "react";
import { Match } from "../../../../types/types";
import Image from "next/image";
import Loader from "../components/Loader";
import Link from "next/link";

export default function DernierMatch() {
    const [latestMatch, setLatestMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLatestMatch = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://api-dofa.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=1&clNo=23399`
            );
            const data = await response.json();
            const matches = data["hydra:member"];

            // Filtrer les matchs dont la date est passée
            const pastMatches = matches.filter((match: Match) => {
                const matchDate = new Date(match.date);
                const today = new Date();
                return matchDate < today;
            });

            // Trier les matchs du plus récent au plus ancien
            pastMatches.sort((a: Match, b: Match) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Prendre le dernier match
            const lastMatch = pastMatches[0];
            setLatestMatch(lastMatch);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération du dernier match:", error);
        }
    };

    useEffect(() => {
        fetchLatestMatch();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-start min-h-screen">
                <Loader />
            </div>
        );
    }

    if (!latestMatch) {
        return <div>Pas de match trouvé.</div>;
    }

    return (
        <Link href="/matchs" className="mt-8">
            <div className="w-full bg-white shadow-lg opacity-70 overflow-hidden cursor-pointer rounded">
                <div className="flex flex-col md:flex-row justify-between items-center p-4">
                    <div className="flex flex-col items-center space-y-2 px-5">
                        <small className="inline-block text-gray-800 p-1 text-sm text-center rounded italic">
                            {latestMatch.poule_journee.number}<sup>e</sup> j
                        </small>
                        <Image
                            src="/images/lfo.png"
                            alt="logo escm"
                            width={30}
                            height={30}
                            priority
                        />
                    </div>

                    <span className="text-gray-800 text-center text-sm-2xl font-bold">
                        {new Date(latestMatch.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }).replace(/^\w/, (c) => c.toUpperCase())}{" "}
                        à <span className="text-blue-500">{latestMatch.time}</span>
                    </span>
                    <div className="flex flex-col md:flex-row items-center justify-center w-full mt-5 md:mt-2 text-bold">
                        <div className="flex flex-col items-center mx-2">
                            <Image
                                src={latestMatch.home.club.logo}
                                alt={`Logo ${latestMatch.home.short_name}`}
                                width={80}
                                height={80}
                                className="w-16 h-16 mb-2"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/next.svg.png";
                                }}
                            />
                            <span className="text-sm font-bold text-gray-800 text-center">
                                {latestMatch.home.short_name}
                            </span>
                        </div>

                        {latestMatch.home_score !== null && latestMatch.away_score !== null ? (
                            <h2 className="text-lg sm:text-2xl font-bold p-5">
                                {latestMatch.home_score} - {latestMatch.away_score}
                            </h2>
                        ) : (
                            <h2 className="text-lg sm:text-2xl font-bold p-5">⏳</h2>
                        )}

                        <div className="flex flex-col items-center mx-2">
                            <Image
                                src={latestMatch.away.club.logo}
                                alt={`Logo ${latestMatch.away.short_name}`}
                                width={80}
                                height={80}
                                className="w-16 h-16 mb-2"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/next.svg.png";
                                }}
                            />
                            <span className="text-sm font-bold text-gray-800 text-center">
                                {latestMatch.away.short_name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}