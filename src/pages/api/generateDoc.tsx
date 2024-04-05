import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";
import FormState from "@/components/interface";

const saveFilesAndProgressToJson = (files: string[], progress: number) => {
  const data = {
    files,
    progress,
  };
  const jsonData = JSON.stringify(data, null, 2);
  const filePath = path.join(process.cwd(), "public", "filesAndProgress.json");

  try {
    fs.writeFileSync(filePath, jsonData);
    console.log("Progresso e caminhos dos arquivos salvos com sucesso.");
  } catch (error) {
    console.error("Erro ao salvar progresso e caminhos dos arquivos:", error);
  }
};

const gerarRelatorio = async (dados: FormState) => {
  const relatorioPath = path.resolve(process.cwd(), "public/RELATORIO.docx");
  const outputPath = path.resolve(process.cwd(), "public/output.docx");
  const docs: string[] = [];

  const totalDocs = dados.meses.length;
  let progressTotal = 0;

  for (const [, mes] of dados.meses.entries()) {
    const content = fs.readFileSync(relatorioPath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      cnpj: dados.cnpj,
      nome: dados.razaoSocial,
      periodo: mes.periodo,
      semNotaC: mes.comercio.semNota,
      notaC: mes.comercio.comNota,
      totalC: mes.comercio.total,
      semNotaI: mes.industria.semNota,
      notaI: mes.industria.comNota,
      totalI: mes.industria.total,
      semNotaS: mes.servico.semNota,
      notaS: mes.servico.comNota,
      totalS: mes.servico.total,
      totalGeral: mes.total,
    });

    const mergedContent = doc
      .getZip()
      .generate({ type: "nodebuffer", compression: "DEFLATE" });
    const outRelatorioPath = path.resolve(
      process.cwd(),
      `public/output${mes.mes}.docx`
    );
    fs.writeFileSync(outRelatorioPath, mergedContent);
    // Aqui assumimos que a conversão para PDF é feita em outro lugar
    const caminhoRelativo = `/output${mes.mes}.docx`; // A conversão para PDF deve refletir esta mudança
    docs.push(caminhoRelativo);
    progressTotal += (1 / totalDocs) * 100;

    saveFilesAndProgressToJson(docs, progressTotal);
  }

  saveFilesAndProgressToJson(docs, 100);
};

export default gerarRelatorio;
