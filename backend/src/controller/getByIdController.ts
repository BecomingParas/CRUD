import { UserModel } from "@/model/userModel";
import { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userExist = await UserModel.findById(id);
    if (!userExist) {
      res.status(404).json({ message: "User not foud" });
    }
    res.status(200).json(userExist);
  } catch (error: any) {
    res.status(500).json({ errorMessage: error.message });
  }
};
