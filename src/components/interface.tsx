export default interface FormState {
  [x: string]: any;
  meses: Mes[];
  cnpj: string;
  razaoSocial: string;
  atividadeAnoCompleto: boolean;
  dataInicio: string;
  dataFim: string;
  atividadesSelecionadas: string[];
}

interface Mes {
  mes: number;
  periodo: string;
  comercio: {
    comNota: number;
    semNota: number;
    total: number;
  };
  industria: {
    comNota: number;
    semNota: number;
    total: number;
  };
  servico: {
    comNota: number;
    semNota: number;
    total: number;
  };
  total: number;
}

interface RelatorioAnual {
  formState: FormState;
}
