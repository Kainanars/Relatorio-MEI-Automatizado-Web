import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import FormState from "./interface";
import RelatorioAnual from "./interface";
import axios from "axios";
import router from "next/router";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
  },
});

interface IntervaloMes {
  mes: number;
  dataInicio: string;
  dataFim: string;
}

function gerarIntervalosMeses(
  dataInicioStr: string,
  dataFimStr: string
): IntervaloMes[] {
  const intervalos: IntervaloMes[] = [];

  const dataInicioParts = dataInicioStr.split("-");
  const dataFimParts = dataFimStr.split("-");

  const inicio = new Date(
    parseInt(dataInicioParts[0]),
    parseInt(dataInicioParts[1]) - 1,
    parseInt(dataInicioParts[2])
  );

  console.log(inicio);

  const fim = new Date(
    parseInt(dataFimParts[0]),
    parseInt(dataFimParts[1]) - 1,
    parseInt(dataFimParts[2])
  );

  let atual = inicio;
  let mesAtual = atual.getMonth();
  let anoAtual = atual.getFullYear();

  while (atual <= fim) {
    const primeiroDiaMes = new Date(anoAtual, mesAtual, 1);
    const ultimoDiaMes = new Date(anoAtual, mesAtual + 1, 0);
    const dataInicioFormatada =
      atual.getMonth() == inicio.getMonth()
        ? inicio.toLocaleDateString("pt-BR")
        : primeiroDiaMes.toLocaleDateString("pt-BR");
    const dataFimFormatada =
      atual.getMonth() == fim.getMonth()
        ? fim.toLocaleDateString("pt-BR")
        : ultimoDiaMes.toLocaleDateString("pt-BR");

    const intervalo: IntervaloMes = {
      mes: mesAtual + 1,
      dataInicio: dataInicioFormatada,
      dataFim: dataFimFormatada,
    };

    intervalos.push(intervalo);

    mesAtual++;
    if (mesAtual === 12) {
      mesAtual = 0;
      anoAtual++;
    }

    atual = new Date(anoAtual, mesAtual, 1);
  }
  console.log(intervalos);

  return intervalos;
}

interface Props {
  formState: FormState;
}

const getMonthName = (monthNumber: number): string => {
  console.log(monthNumber - 1);
  const date = new Date(2000, monthNumber, 1);

  const monthName = date.toLocaleString("pt-BR", { month: "long" });
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};

const MonthComponent: React.FC<Props> = ({ formState }) => {
  const meses = gerarIntervalosMeses(formState.dataInicio, formState.dataFim);

  const [mesAtual, setMesAtual] = useState<number>(0);
  const [totalGeral, setTotalGeral] = useState<number>(0);

  const [semNotaValueC, setSemNotaValueC] = useState<number>(0.0);
  const [notaValueC, setNotaValueC] = useState<number>(0.0);
  const [totalValueC, setTotalNotaValueC] = useState<number>(0.0);

  const [semNotaValueI, setSemNotaValueI] = useState<number>(0.0);
  const [notaValueI, setNotaValueI] = useState<number>(0.0);
  const [totalValueI, setTotalNotaValueI] = useState<number>(0.0);

  const [semNotaValueS, setSemNotaValueS] = useState<number>(0.0);
  const [notaValueS, setNotaValueS] = useState<number>(0.0);
  const [totalValueS, setTotalNotaValueS] = useState<number>(0.0);

  const [saveExecuted, setSaveExecuted] = useState(false);

  useEffect(() => {
    setTotalNotaValueC(semNotaValueC + notaValueC);
  }, [semNotaValueC, notaValueC]);

  useEffect(() => {
    setTotalNotaValueI(semNotaValueI + notaValueI);
  }, [semNotaValueI, notaValueI]);

  useEffect(() => {
    setTotalNotaValueS(semNotaValueS + notaValueS);
  }, [semNotaValueS, notaValueS]);

  useEffect(() => {
    setTotalGeral(totalValueC + totalValueI + totalValueS);
  }, [totalValueC, totalValueI, totalValueS]);

  useEffect(() => {
    const saveData = async () => {
      if (saveExecuted) {
        try {
          const response = await axios.post("api/hello", formState);

          router.push({
            pathname: "/resultado",
          });
          // Verifica se a solicitação foi bem-sucedida
          if (response.status === 200) {
            console.log("Solicitação POST bem-sucedida:", response.data);
          } else {
            console.log("Erro na solicitação POST:", response.statusText);
          }
        } catch (error) {
          console.error("Erro ao fazer solicitação POST:", error);
        }
      }
    };

    saveData();
  }, [formState, saveExecuted]);

  const handleNextMonth = async () => {
    console.log("next" + mesAtual);

    if (meses.length - 1 > mesAtual) {
      setMesAtual(mesAtual + 1);
      save();
    }

    if (meses.length === mesAtual + 1) {
      save();
      setSaveExecuted(true);
    }
  };

  const [relatorioAnual, setRelatorioAnual] =
    useState<RelatorioAnual>(formState);

  const save = (): void => {
    // Verifica se os valores são NaN e os define como 0.0
    const cleanNaN = (value: number): number => {
      return isNaN(value) ? 0.0 : value;
    };
    const mesData = {
      mes: meses[mesAtual].mes,
      periodo: `${meses[mesAtual].dataInicio} à ${meses[mesAtual].dataFim}`,
      comercio: {
        comNota: cleanNaN(notaValueC).toFixed(2),
        semNota: cleanNaN(semNotaValueC).toFixed(2),
        total: cleanNaN(totalValueC).toFixed(2),
      },
      industria: {
        comNota: cleanNaN(notaValueI).toFixed(2),
        semNota: cleanNaN(semNotaValueI).toFixed(2),
        total: cleanNaN(totalValueI).toFixed(2),
      },
      servico: {
        comNota: cleanNaN(notaValueS).toFixed(2),
        semNota: cleanNaN(semNotaValueS).toFixed(2),
        total: cleanNaN(totalValueS).toFixed(2),
      },
      total: cleanNaN(totalGeral).toFixed(2),
    };

    formState.meses = [...formState.meses, mesData];

    setRelatorioAnual((prevRelatorio) => ({
      ...prevRelatorio,
    }));

    // Limpa os campos de entrada
    setNotaValueC(0.0);
    setNotaValueI(0.0);
    setNotaValueS(0.0);
    setSemNotaValueC(0.0);
    setSemNotaValueI(0.0);
    setSemNotaValueS(0.0);
    setTotalNotaValueC(0.0);
    setTotalNotaValueI(0.0);
    setTotalNotaValueS(0.0);
  };

  // Verifica se formState está definido antes de acessar suas propriedades
  const atividadesSelecionadas = formState?.atividadesSelecionadas || [];

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider>
        <Box
          sx={{
            backgroundColor: "white",

            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form>
            <FormControl>
              <FormGroup
                sx={{
                  flexDirection: "column",
                }}
              >
                <h1
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 25,
                    fontFamily: "sans-serif",
                  }}
                >
                  {getMonthName(meses[mesAtual].mes - 1)}
                </h1>
                {atividadesSelecionadas.includes("Comércio") ? (
                  <div>
                    <br />
                    <TextField
                      id="outlined-basic"
                      label="Receita sem nota"
                      type="number"
                      fullWidth
                      value={semNotaValueC}
                      variant="outlined"
                      onChange={(e) =>
                        setSemNotaValueC(parseFloat(e.target.value))
                      }
                    />

                    <br />
                    <br />
                    <TextField
                      label="Receita com nota"
                      type="number"
                      fullWidth
                      value={notaValueC}
                      onChange={(e) =>
                        setNotaValueC(parseFloat(e.target.value))
                      }
                    />
                    <br />
                    <br />
                    <FormLabel
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      Total Comércio:{" "}
                      {isNaN(totalValueC) ? 0.0 : totalValueC.toFixed(2)}
                    </FormLabel>
                  </div>
                ) : (
                  <br />
                )}
                {atividadesSelecionadas.includes("Indústria") ? (
                  <div>
                    <br />

                    <TextField
                      label="Receita sem nota"
                      type="number"
                      fullWidth
                      value={semNotaValueI}
                      onChange={(e) =>
                        setSemNotaValueI(parseFloat(e.target.value))
                      }
                    />
                    <br />
                    <br />

                    <TextField
                      label="Receita com nota"
                      type="number"
                      fullWidth
                      value={notaValueI}
                      onChange={(e) =>
                        setNotaValueI(parseFloat(e.target.value))
                      }
                    />
                    <br />
                    <br />

                    <FormLabel
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      Total Indústria:{" "}
                      {isNaN(totalValueI) ? 0.0 : totalValueI.toFixed(2)}
                    </FormLabel>
                  </div>
                ) : (
                  <br />
                )}
                {atividadesSelecionadas.includes("Serviço") ? (
                  <div>
                    <br />
                    <TextField
                      label="Receita sem nota"
                      type="number"
                      fullWidth
                      value={semNotaValueS}
                      onChange={(e) =>
                        setSemNotaValueS(parseFloat(e.target.value))
                      }
                    />
                    <br />
                    <br />
                    <TextField
                      label="Receita com nota"
                      type="number"
                      fullWidth
                      value={notaValueS}
                      onChange={(e) =>
                        setNotaValueS(parseFloat(e.target.value))
                      }
                    />
                    <br />
                    <br />

                    <FormLabel
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      Total Serviço:{" "}
                      {isNaN(totalValueS) ? 0.0 : totalValueS.toFixed(2)}
                    </FormLabel>
                  </div>
                ) : (
                  <br />
                )}
                <FormLabel
                  sx={{
                    marginTop: "30px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Total Geral: {isNaN(totalGeral) ? 0.0 : totalGeral.toFixed(2)}
                </FormLabel>
              </FormGroup>
              {meses.length - 1 === mesAtual ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextMonth}
                >
                  Salvar
                </Button>
              ) : (
                <Button
                  component="a"
                  variant="contained"
                  color="secondary"
                  sx={{ marginTop: "20px" }} // Adiciona margem superior
                  onClick={handleNextMonth}
                >
                  Próximo Mês
                </Button>
              )}
            </FormControl>
          </form>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default MonthComponent;
