// pages/api/save-classements.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/db/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { classements } = req.body;

    if (!classements || classements.length === 0) {
      return res.status(400).json({ error: 'No classements provided' });
    }

    try {
      for (const classement of classements) {
        const clubId = classement.equipe.club["@id"].split("/").pop(); // Obtenir l'ID du club
        const clubName = classement.equipe.short_name; // Nom court du club
        const wonGamesCount = classement.won_games_count; // Nombre de matchs gagnés
        const drawGamesCount = classement.draw_games_count; // Nombre de matchs nuls
        const lostGamesCount = classement.lost_games_count; // Nombre de matchs perdus
        const goalsScored = classement.goals_for_count; // Nombre de buts marqués
        const goalsConceded = classement.goals_against_count; // Nombre de buts encaissés

        // Vérifier si un résultat existe déjà pour ce club
        const existingClubResult = await prisma.clubResult.findFirst({
          where: {
            clubName: clubName,
          },
        });

        if (existingClubResult) {
          // Mettre à jour les données du club
          console.log({
            clubId,
            clubName,
            wonGamesCount,
            drawGamesCount,
            lostGamesCount,
            goalsScored,
            goalsConceded,
          });
          await prisma.clubResult.update({
            where: {
              id: existingClubResult.id,
            },
            data: {
              clubId,
              clubName,
              wonGamesCount,
              drawGamesCount,
              lostGamesCount,
              goalsScored,
              goalsConceded,
            },
          });
        } else {
          // Créer une nouvelle entrée
          await prisma.clubResult.create({
            data: {
              clubId,
              clubName,
              wonGamesCount,
              drawGamesCount,
              lostGamesCount,
              goalsScored,
              goalsConceded,
            },
          });
        }
      }

      res.status(200).json({ message: 'Classements saved successfully' });
    } catch (error) {
      console.error('Error saving classements:', error);
      res.status(500).json({ error: 'Error saving classements' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
