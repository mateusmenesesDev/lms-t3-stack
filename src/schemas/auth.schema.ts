import { z } from "zod";

export const baseAuthSchema = z.object({
  email: z
    .string({ required_error: "Informe seu email" })
    .email("Insira um email válido."),
});

export const loginSchema = baseAuthSchema.extend({
  password: z
    .string({ required_error: "Informe sua senha" })
    .min(1, "Insira sua senha"),
});

export const signUpSchema = baseAuthSchema.extend({
  firstName: z
    .string({ required_error: "Informe seu nome" })
    .min(1, "Insira seu nome"),
  lastName: z
    .string({ required_error: "Informe seu sobrenome" })
    .min(1, "Insira seu sobrenome"),
  password: z
    .string({ required_error: "Informe sua senha" })
    .min(1, "Insira sua senha"),
});

export const resetPasswordSchema = z.object({
  code: z
    .string({ required_error: "Informe o código" })
    .min(1, "Insira o código"),
  password: z
    .string({ required_error: "Informe sua senha" })
    .min(1, "Insira sua senha"),
});
