import { Request, Response } from "express";
import userService from "../services/user-service";

async function findAll(req: Request, res: Response): Promise<any> {
  try {
    const users = await userService.findAll();
    res.status(200).json({ message: "Ambil Data Sukses", data: users });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}

async function create(req: Request, res: Response): Promise<any> {
  try {
    const data = req.body;
    const newUser = await userService.create(data);
    res.status(200).json({ message: "Buat Data Sukses", data: newUser });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}

async function update(req: Request, res: Response): Promise<any> {
  try {
    const data = req.body;
    const { id } = req.params;
    const newUser = await userService.update(Number(id), data);
    res.status(200).json({ message: "Edit Data Sukses", data: newUser });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}

async function destroy(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    await userService.destroy(Number(id));
    res.status(200).json({ message: "Hapus Data Sukses", data: null });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}

export default { findAll, create, update, destroy };
