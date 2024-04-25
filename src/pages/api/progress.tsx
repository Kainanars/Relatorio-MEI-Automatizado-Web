import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Caminho para o arquivo JSON
    const filePath = path.resolve(
      __dirname,
      "../../../../",
      "models",
      "filesAndProgress.json"
    );

    // Leia o arquivo JSON
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // Parseie o JSON
    const data = JSON.parse(jsonData);

    // Envie os dados JSON como resposta
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao ler o arquivo JSON:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
