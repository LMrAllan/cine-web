import { z } from "zod";

export const salaSchema = z.object({
  numero: z
    .number("Número da sala deve ser um número")
    .positive("O número da sala deve ser maior que 0"),
  capacidade: z
    .number("Capacidade deve ser um número")
    .positive("A capacidade deve ser maior que 0"),
});

export type SalaFormData = z.infer<typeof salaSchema>;
