import { LoginDTO, RegisterDTO } from "../dtos/auth-dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { UserEntity } from "../entities/user-entity";

const prisma = new PrismaClient();

async function register(data: RegisterDTO) {
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (user) {
      throw new Error("Email sudah terdaftar");
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await prisma.user.create({
        data: {
          name: data.username,
          email: data.email,
          password: hashedPassword,
          role: data.role,
        },
      });

      return newUser;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

async function login(data: LoginDTO) {
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) throw new Error("Email atau password salah");

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) throw new Error("Email atau password salah");

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "12h",
    });

    const role = user.role;

    await updateLogin(user.id);

    return { token, role };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

async function updateLogin(id: number) {
  try {
    const updateUser = await prisma.user.update({
      where: { id },
      data: { last_login: new Date() },
    });

    return null;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export default { register, login, updateLogin };
