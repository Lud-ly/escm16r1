"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loader from '../../../src/components/Sections/components/Loader';
import ArrowBack from "../../../src/components/Sections/components/ArrowBack";
import Link from "next/link";

interface Club {
    logo: string;
}

interface Equipe {
    short_name: string;
    club: Club;
}

interface Terrain {
    name: string;
    city: string;
    adress2?: string;
    zip_code?: string;
    libelle_surface?: string;
}

interface MatchEntity {
    ma_no: number;
    date: string;
    time: string;
    home_score: number;
    away_score: number;
    home: Equipe;
    away: Equipe;
    terrain: Terrain;
    season: number;
    is_overtime: string;
    home_resu: string;
    away_resu: string;
}

interface MatchMembre {
    match_entity: MatchEntity;
    prenom: string;
    nom: string;
    label_position: string;
}

interface MatchData {
    "hydra:member": MatchMembre[];
}

const MatchAVenirPage: React.FC<{ params: { 'matchId': string } }> = ({ params }) => {
    const [matchData, setMatchData] = useState<MatchData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMatchDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://api-dofa.fff.fr/api/match_membres?match_entity.ma_no=${params['matchId']}`
                );
                const data: MatchData = await response.json();
                setMatchData(data);
            } catch (error) {
                console.error('Erreur lors du chargement des détails du match:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchDetails();
    }, [params]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-start min-h-screen">
                <Loader />
            </div>
        );
    }    

    if (!matchData || matchData["hydra:member"].length === 0) {
        return <div><ArrowBack iSize={40} /><p className="text-center">Match non disponible pour l&#39;instant</p></div>;
    }

    const matchMembre = matchData["hydra:member"][0];
    const match = matchMembre.match_entity;

    return (
        <div className="flex flex-col gap-8 p-4">
            <ArrowBack iSize={40} />
            <h1 className="text-2xl font-bold text-center">Détails du Match</h1>
            <p className="text-center">
                {new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())} à {match.time}
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex items-center w-1/2 justify-center">
                    <Image
                        src={match.home.club.logo}
                        alt={`Logo ${match.home.short_name}`}
                        width={60}
                        height={60}
                        className="w-10 h-10 mr-4"
                    />
                    <span className="text-lg">{match.home.short_name}</span>
                </div>
                <div className="flex flex-row items-center w-1/2 justify-center shadow-lg rounded-lg p-3 text-5xl text-blue-800">
                    {match.home_score} - {match.away_score}
                </div>
                <div className="flex items-center w-1/2 justify-center">
                    <span className="order-2 md:order-1 ml-4 md:ml-0 md:mr-4 text-lg">{match.away.short_name}</span>
                    <Image
                        src={match.away.club.logo}
                        alt={`Logo ${match.away.short_name}`}
                        width={60}
                        height={60}
                        className="w-10 h-10 order-1 md:order-2"
                    />
                </div>
            </div>

            <div className="text-center">
                <p className="font-semibold text-blue-500">Lieu du match</p>
                <p>{match.terrain.name}</p>
                <p>{match.terrain.city} {match.terrain.zip_code && `(${match.terrain.zip_code})`}</p>
                {match.terrain.adress2 && <p>{match.terrain.adress2}</p>}
                {match.terrain.libelle_surface && <p>Surface : {match.terrain.libelle_surface}</p>}
            </div>
            <div className="text-center">
                <p className="font-semibold text-blue-500">Officiels</p>
                <p>{matchMembre.prenom} {matchMembre.nom}</p>
                <p>{matchMembre.label_position}</p>

            </div>
            <Link href={`https://occitanie.fff.fr/competitions?competition_id=420289&poule=1&match_id=${params['matchId']}`} target="_blank" className="mb-5">
                <div className="flex justify-center items-center">
                    <button className="text-white rounded-md p-2 hover:bg-gray-900"style={{ backgroundColor: "rgb(9, 87, 159)" }}>
                        Fiche Match LFO
                    </button>
                </div>
            </Link>

        </div>
    );
};

export default MatchAVenirPage;
