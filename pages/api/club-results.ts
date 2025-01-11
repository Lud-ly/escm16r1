import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/db/prisma';

interface ClubResult {
  clubId: string;
  clubName: string;
  wonGamesCount: number;
  drawGamesCount: number;
  lostGamesCount: number;
  totalGames: number;
  goalsScored: number;
  goalsConceded: number;
  trend: string;
  updatedAt:Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ClubResult[] | { error: string }>) {
  if (req.method === 'GET') {
    try {
      const results = await prisma.clubResult.findMany();
      const trends: ClubResult[] = results.map(result => {
        const totalGames = result.wonGamesCount + result.drawGamesCount + result.lostGamesCount;
      
        // Calcul des pourcentages
        const winPercentage = totalGames > 0 ? (result.wonGamesCount / totalGames) * 100 : 0;
        const drawPercentage = totalGames > 0 ? (result.drawGamesCount / totalGames) * 100 : 0;
        const losePercentage = totalGames > 0 ? (result.lostGamesCount / totalGames) * 100 : 0;
      
        let trend = '';
      
        // Évaluation de la tendance basée sur les pourcentages
        if (winPercentage >= 60) {
          trend = 'up'; // Tendance forte vers le haut
        } else if (winPercentage >= 40 && drawPercentage >= 20) {
          trend = 'neutral'; // Victoires et nuls significatifs
        } else if (losePercentage >= 60) {
          trend = 'down'; // Tendance forte vers le bas
        } else if (losePercentage >= 40 && winPercentage < 40) {
          trend = 'concerning'; // Beaucoup de défaites, mais peu de victoires
        } else if (winPercentage >= 40 && losePercentage < 20) {
          trend = 'encouraging'; // Quelques victoires avec peu de défaites
        } else {
          trend = 'neutral'; // Par défaut, si rien ne s'applique
        }
      
        return {
          clubId: result.clubId,
          clubName: result.clubName,
          wonGamesCount: result.wonGamesCount,
          drawGamesCount: result.drawGamesCount,
          lostGamesCount: result.lostGamesCount,
          totalGames,
          goalsScored: result.goalsScored,
          goalsConceded: result.goalsConceded,
          trend,
          winPercentage: winPercentage.toFixed(2), 
          drawPercentage: drawPercentage.toFixed(2),
          losePercentage: losePercentage.toFixed(2),
          updatedAt: new Date(result.updatedAt),
        };
      });
      

      res.status(200).json(trends);
    } catch (error) {
      console.error("Error fetching club results:", error);
      res.status(500).json({ error: 'Failed to fetch club results' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}