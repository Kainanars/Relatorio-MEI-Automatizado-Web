import React, { useState, useEffect } from "react";
import { Box, Button, List, ListItem } from "@mui/material";
import JSZip from "jszip";

interface FilesAndProgress {
  files: string[];
  progress: number;
}

function ResultComponent() {
  const [jsonData, setJsonData] = useState(null);
  const [filesAndProgress, setFilesAndProgress] = useState<FilesAndProgress>({
    files: [],
    progress: 0,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchFilesAndProgress = async () => {
      try {
        const response = await fetch("/api/progress");
        const data = await response.json();
        console.log(data);
        setFilesAndProgress(data);
      } catch (error) {
        console.error("Erro ao buscar dados do JSON:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchFilesAndProgress();
    }, 1000); // Atualiza a cada 5 segundos

    fetchFilesAndProgress(); // Também faz a busca imediatamente

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch("/api/get-json");
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do JSON:", error);
      }
    };

    fetchJsonData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <div>Carregando...</div>;
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    // Cria um array de promessas para cada solicitação fetch
    const promises = filesAndProgress.files.map((file) =>
      fetch(file).then((response) => response.blob())
    );

    // Espera que todas as promessas sejam resolvidas
    await Promise.all(promises).then((blobs) => {
      // Adiciona cada blob ao zip
      blobs.forEach((blob, index) => {
        zip.file(`Relatório_${index + 1}.docx`, blob);
      });
    });

    // Gera o arquivo zip
    const content = await zip.generateAsync({ type: "blob" });

    // Cria um link para download do arquivo zip
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${jsonData.razaoSocial} - ${jsonData.cnpj}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let receitaComercio = 0;
  let receitaIndustria = 0;
  let receitaServico = 0;

  if (jsonData) {
    jsonData.meses.forEach(
      (mes: {
        comercio: { total: string };
        industria: { total: string };
        servico: { total: string };
      }) => {
        receitaComercio += parseFloat(mes.comercio.total);
        receitaIndustria += parseFloat(mes.industria.total);
        receitaServico += parseFloat(mes.servico.total);
      }
    );
  }

  const receitaBrutaTotal = (
    receitaComercio +
    receitaIndustria +
    receitaServico
  ).toFixed(2);

  return (
    <Box
      sx={{
        backgroundColor: "#f0f0f0",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center", // Centraliza o conteúdo
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Define a altura para ocupar toda a tela verticalmente
      }}
    >
      {jsonData && (
        <>
          <div
            style={{
              color: "black",
              fontWeight: "bold",
              fontSize: 25,
              fontFamily: "sans-serif",
            }}
          >
            Receita de comércio e indústria:{" R$ "}
            {(receitaComercio + receitaIndustria).toFixed(2)}
          </div>
          <div
            style={{
              color: "black",
              fontWeight: "bold",
              fontSize: 25,
              fontFamily: "sans-serif",
            }}
          >
            Receita de prestação de serviços: R$ {receitaServico.toFixed(2)}
          </div>
          <div
            style={{
              marginTop: "10vh",
              color: "black",
              fontWeight: "bold",
              fontSize: 30,
              fontFamily: "sans-serif",
            }}
          >
            Receita Bruta Total: R$ {receitaBrutaTotal}
          </div>

          {filesAndProgress.files != null &&
          filesAndProgress.files != undefined ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadAll}
                sx={{ marginTop: "20px" }}
              >
                Baixar Todos
              </Button>
            </>
          ) : null}

          {filesAndProgress.progress === 100 ? (
            <Button
              component="a"
              href="/"
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px" }}
            >
              Novo Relatório
            </Button>
          ) : null}
        </>
      )}
    </Box>
  );
}

export default ResultComponent;
