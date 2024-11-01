import express, { Request, Response } from "express";
import authController from "./controllers/auth-controller";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware } from "./middlewares/auth-middleware";
import userController from "./controllers/user-controller";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", async (req: Request, res: Response) => {
  res.send("HELLO");
});

app.post("/register", authController.register);
app.post("/login", authController.login);
app.post("/check", authMiddleware as any, authController.check);

app.get("/users", userController.findAll);
app.post("/users", userController.create);
app.put("/users/:id", userController.update);
app.delete("/users/:id", userController.destroy);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER RUNING ON PORT : ${PORT}`);
});
