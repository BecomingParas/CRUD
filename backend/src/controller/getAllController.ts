import { UserModel } from "@/model/userModel";
import { NextFunction, Request, Response } from "express";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await UserModel.find();
    if (!userData || userData.length === 0) {
      res.status(404).json({ message: "User data not found" });
      return;
    }
    res.status(200).json(userData);
  } catch (error: any) {
    res.status(500).json({ errorMassege: error.message });
    next(error);
  }
};
