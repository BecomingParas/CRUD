import { NextFunction, Request, Response } from "express";
import { UserError } from "@/error";
import { createUserSchema } from "@/service/userSchema";
import { InvalidUserPayload } from "@/service/userError";
import { userService } from "@/service/userService";
import { UserModel } from "@/model/userModel";
export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userData = new UserModel(req.body);
    const { email } = userData;
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "user already exist" });
      return;
    }
    const parsed = createUserSchema.safeParse(userData);
    if (!parsed.success) {
      const parseError = parsed.error.flatten();
      const InvalidUserPayloadError = new InvalidUserPayload(parseError);
      next(InvalidUserPayloadError);
      return;
    }

    await userService.createUser({
      username: parsed.data.username,
      email: parsed.data.email,
      address: parsed.data.address,
    });

    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    const userError = new UserError("Failed to create the movie", 500);
    next(userError);
  }
}
