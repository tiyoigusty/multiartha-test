import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user-dto";

const prisma = new PrismaClient();

async function findAll() {
  try {
    return await prisma.user.findMany({ where: { role: "User" } });
  } catch (error) {
    throw new Error("Error fetching users");
  }
}

async function create(data: CreateUserDTO) {
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
          role: "User",
        },
      });

      return newUser;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

async function update(id: number, data: UpdateUserDTO) {
  try {
    // if (data.password) {
    //   data.password = await bcrypt.hash(data.password, 10);
    // }

    const updateUser = await prisma.user.update({
      where: { id },
      data: { name: data.username, email: data.password },
    });
    return updateUser;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

async function destroy(id: number) {
  try {
    await prisma.user.delete({ where: { id } });
    return null;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export default { findAll, create, destroy, update };
