import { UserModel } from "@/model/userModel";
import { Request, Response } from "express";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userExist = await UserModel.findOne({ _id: id });
    if (!userExist) {
      res.status(404).json({ message: "User not found" });
    }
    const updateData = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
