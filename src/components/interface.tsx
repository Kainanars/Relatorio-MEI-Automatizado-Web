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
    comNota: string;
    semNota: string;
    total: string;
  };
  industria: {
    comNota: string;
    semNota: string;
    total: string;
  };
  servico: {
    comNota: string;
    semNota: string;
    total: string;
  };
  total: string;
}

interface RelatorioAnual {
  formState: FormState;
}
