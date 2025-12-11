import { z } from "zod";

export const ingressoSchema = z.object({
  sessaoId: z
    .string()
    .min(1, "Sessão é obrigatória"),

  // Enum sem objeto de opções
  tipo: z.enum(["INTEIRA", "MEIA"]),

  valor: z
    .number("Valor deve ser um número")
    .positive("Valor deve ser maior que zero"),
});

export type IngressoFormData = z.infer<typeof ingressoSchema>;
