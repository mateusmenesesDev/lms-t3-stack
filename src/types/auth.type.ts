import { type z } from "zod";
import type {
  signUpSchema,
  loginSchema,
  baseAuthSchema,
  resetPasswordSchema,
} from "~/schemas/auth.schema";

export type BaseAuth = z.infer<typeof baseAuthSchema>;
export type Login = z.infer<typeof loginSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
