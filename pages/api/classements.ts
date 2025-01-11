// pages/api/classements.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = `https://api-dofa.fff.fr/api/compets/420289/phases/1/poules/1/classement_journees`;

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
