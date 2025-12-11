export interface Filme {
  id: string;
  titulo: string;
  sinopse: string;
  duracao: number;
  classificacao?: string;
  genero?: string;
  dataInicioExibicao?: string;
  dataFimExibicao?: string;
}

export interface Sala {
  id: string;
  numero: number;
  capacidade: number;
}

export interface Sessao {
  id?: string;
  filmeId: string; // referencia Filme.id (string)
  salaId: string;  // referencia Sala.id (string)
  dataHora: string;
}

export interface Ingresso {
  id?: string;
  sessaoId: string; // referencia Sessao.id (string)
  tipo: "INTEIRA" | "MEIA";
  valor: number;
}
