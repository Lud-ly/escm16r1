import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const selectedCat = req.query.category || '16';
console.log('Selected category:', selectedCat);
  const validCategories = ['14', '15', '16', '17', '18', 'senior'];
  if (!validCategories.includes(selectedCat as string)) {
    return res.status(400).json({ message: "Paramètre invalide." });
  }

  // Configuration des compétitions avec leurs phases
  const competConfig = {
    '14': { id: '420287', phase: 2 },
    '15': { id: '420288', phase: 1 },
    '16': { id: '420289', phase: 1 },
    '17': { id: '420290', phase: 1 },
    '18': { id: '420294', phase: 1 },
    'senior': { id: '420269', phase: 1 },
  };

  const competInfo = competConfig[selectedCat as keyof typeof competConfig];

  const apiUrl = `https://api-dofa.fff.fr/api/compets/${competInfo.id}/phases/${competInfo.phase}/poules/1/matchs?page=1&clNo=21095`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch match data');
    }

    const data = await response.json();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des matchs" });
  }
}