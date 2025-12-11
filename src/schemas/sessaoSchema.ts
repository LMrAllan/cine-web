import { z } from "zod";

export const sessaoSchema = z.object({
  filmeId: z
    .string()
    .min(1, "Selecione um filme"),
  salaId: z
    .string()
    .min(1, "Selecione uma sala"),
  dataHora: z
    .string()
    .nonempty("Informe a data e hora da sessão")
    .refine((value) => {
      const data = new Date(value);
      if (Number.isNaN(data.getTime())) return false;

      const agora = new Date();
      return data >= agora;
    }, "A data da sessão não pode ser retroativa"),
});

export type SessaoFormData = z.infer<typeof sessaoSchema>;
