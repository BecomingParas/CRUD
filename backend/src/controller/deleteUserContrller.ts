import { UserModel } from "@/model/userModel";
import { Request, Response } from "express";

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userExist = await UserModel.findOne({ _id: id });
    if (!userExist) {
      res.status(404).json({ Message: "User not found" });
    }
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
