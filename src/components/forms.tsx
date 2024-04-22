import React from "react";
import { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deDE } from "@mui/x-date-pickers/locales";
import MonthComponent from "./monthy";
import FormState from "./interface";
import { useRouter } from "next/router";

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  deDE // use 'de' locale for UI texts (start, next month, ...)
);

export default function Formulario() {
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>(() => {
    const today = new Date();
    const lastDayOfYear = new Date(today.getFullYear() - 1, 11, 31);
    const firstDayOfYear = new Date(today.getFullYear() - 1, 0, 1);
    return {
      meses: [],
      cnpj: "",
      razaoSocial: "",
      atividadeAnoCompleto: true,
      dataInicio: firstDayOfYear.toISOString().slice(0, 10),
      dataFim: lastDayOfYear.toISOString().slice(0, 10),
      atividadesSelecionadas: [],
    };
  });

  const [inserirValores, setInserirValores] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setFormState({
        ...formState,
        atividadesSelecionadas: [...formState.atividadesSelecionadas, value],
      });
    } else {
      setFormState({
        ...formState,
        atividadesSelecionadas: formState.atividadesSelecionadas.filter(
          (atividade) => atividade !== value
        ),
      });
    }
  };

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) {
    if (e.target instanceof HTMLInputElement) {
      const value = e.target.value;
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInserirValores(true);
    console.log(formState);
  };

  let dataInputs = null;
  if (!formState.atividadeAnoCompleto) {
    dataInputs = (
      <>
        <TextField
          label="Data de Início"
          type="date"
          value={formState.dataInicio}
          onChange={(e) => handleInputChange(e, "dataInicio")}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Data de Fim"
          type="date"
          value={formState.dataFim}
          onChange={(e) => handleInputChange(e, "dataFim")}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {inserirValores ? (
            <MonthComponent formState={formState} />
          ) : (
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  backgroundColor: "#003152",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  textAlign: "center", // centralizar conteúdo
                }}
              >
                <FormControl fullWidth>
                  <TextField
                    label="CNPJ"
                    fullWidth
                    value={formState.cnpj}
                    sx={{ marginTop: "20px" }} // Adiciona margem superior
                    onChange={(e) => handleInputChange(e, "cnpj")}
                  />
                  <TextField
                    label="Razão Social"
                    fullWidth
                    value={formState.razaoSocial}
                    sx={{ marginTop: "20px" }} // Adiciona margem superior
                    onChange={(e) => handleInputChange(e, "razaoSocial")}
                  />
                  <FormGroup>
                    <FormControlLabel
                      sx={{ marginTop: "20px" }} // Adiciona margem superior
                      control={
                        <Checkbox
                          checked={formState.atividadeAnoCompleto}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              atividadeAnoCompleto: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Atividade o ano completo?"
                    />
                    {dataInputs}
                  </FormGroup>
                  <FormControl
                    component="fieldset"
                    sx={{ marginTop: "20px" }} // Adiciona margem superior
                  >
                    <legend>Escolha as atividades:</legend>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Comércio"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Comércio"
                        sx={{ marginTop: "20px" }} // Adiciona margem superior
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Indústria"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Indústria"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Serviço"
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Serviço"
                      />
                    </FormGroup>
                  </FormControl>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: "20px" }} // Adiciona margem superior
                >
                  Avançar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
