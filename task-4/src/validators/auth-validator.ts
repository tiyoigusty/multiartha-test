import { z } from "zod";

export const registerSchema = z.object({
  username: z.string(),
  email: z.string().email({ message: "Paramter email tidak sesuai format" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  role: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Paramter email tidak sesuai format" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});
