import { z } from "zod";

export const filmeSchema = z.object({
  titulo: z
    .string()
    .min(1, "Título é obrigatório"),
  sinopse: z
    .string()
    .min(1, "Sinopse é obrigatória"),
  duracao: z
    .number("Duração deve ser um número")
    .positive("A duração deve ser maior que 0"),
  classificacao: z.string().optional(),
  genero: z.string().optional(),
  dataInicioExibicao: z.string().optional(),
  dataFimExibicao: z.string().optional(),
});

export type FilmeFormData = z.infer<typeof filmeSchema>;
