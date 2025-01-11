import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { clubId } = req.query;

  // URL de l'API externe pour récupérer les infos du club
  const apiUrl = `https://api-dofa.fff.fr/api/clubs/${clubId}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch club data');
    }

    const data = await response.json();

    // On retourne directement les données du club, y compris le logo
    res.status(200).json(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour le club ${clubId}:`, error);
    res.status(500).json({ message: "Erreur lors de la récupération des données du club" });
  }
}
