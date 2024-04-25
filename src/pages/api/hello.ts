// Next.js API route: /api/hello

import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import FormState from '@/components/interface';
import gerarRelatorio from './generateDoc';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const dados: FormState = req.body;

    // Gere os relatórios
    gerarRelatorio(dados);

    const filePath = path.resolve(__dirname, '../../../../', 'models', 'formState.json');
    // Escreva os dados no arquivo JSON
    fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));

    // Envie a resposta ao cliente
    res.status(200).json({ message: 'Relatórios gerados e arquivo JSON atualizado com sucesso.' });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
