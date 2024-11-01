import { Request, Response } from "express";
import { LoginDTO, RegisterDTO } from "../dtos/auth-dto";
import { loginSchema, registerSchema } from "../validators/auth-validator";
import { ZodError } from "zod";
import authService from "../services/auth-service";

async function register(req: Request, res: Response): Promise<any> {
  try {
    const validatedData: RegisterDTO = registerSchema.parse(req.body);
    await authService.register(validatedData);
    res.status(201).json({ message: "Register Sukses", data: null });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: (error as ZodError).errors[0].message });
    }
    return res.status(500).json({ message: (error as Error).message });
  }
}

async function login(req: Request, res: Response): Promise<any> {
  try {
    const validatedData: LoginDTO = loginSchema.parse(req.body);
    const user = await authService.login(validatedData);
    res.status(201).json({ message: "Login Sukses", data: user });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: (error as ZodError).errors[0].message });
    }
    return res.status(500).json({ message: (error as Error).message });
  }
}

async function check(req: Request, res: Response): Promise<any> {
  try {
    const user = res.locals.user;

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}

export default { register, login, check };
