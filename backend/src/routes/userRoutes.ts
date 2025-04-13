import { createUserController } from "@/controller/createUsersController";
import { deleteUser } from "@/controller/deleteUserContrller";
import { getAllUsers } from "@/controller/getAllController";
import { getUserById } from "@/controller/getByIdController";
import { updateUser } from "@/controller/updateUserController";
import { Express } from "express";
export function userRoutes(app: Express) {
  app.post("/api/users/create", createUserController);
  app.get("/api/users", getAllUsers);
  app.get("/api/users/:id", getUserById);
  app.put("/api/users/update/:id", updateUser);
  app.delete("/api/users/delete/:id", deleteUser);
}
