import { UserModel } from "@/model/userModel";
import { json } from "body-parser";
type TUsers = {
  id: string;
  username: string;
  email: string;
  address: string;
};
// create users
async function createUser(input: Omit<TUsers, "id">) {
  const user = new UserModel({
    username: input.username,
    email: input.email,
    address: input.address,
  });
  await user.save();
}

// // get users
// async function getAllUsers() {
//   const users = await UserModel.find();
//   if (!users || users.length === 0) {
//     throw new Error
//   }
// }

export const userService = {
  createUser,
};
