import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page } = req.query;
  // URL de l'API externe pour récupérer les matchs
  const apiUrl = `https://api-dofa.fff.fr/api/compets/420289/phases/1/poules/1/matchs?page=${page}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch match data');
    }

    const data = await response.json();

    // Renvoie les données des matchs à la réponse API interne
    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des matchs" });
  }
}
