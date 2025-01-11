// pages/api/classements.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const selectedCat = req.query.category || '16';

  const validCategories = ['14', '15', '16', '17','18'];
  if (!validCategories.includes(selectedCat as string)) {
    return res.status(400).json({ message: "Paramètre invalide." });
  }

  const competId = {
    '14': '420287',
    '15': '420288',
    '16': '420289',
    '17': '420290',
    '18': '420294',
  }[selectedCat as string];

  const url = `https://api-dofa.fff.fr/api/compets/${competId}/phases/1/poules/1/classement_journees`;
 
  try {
    const response = await fetch(url);
    console.log(response);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
