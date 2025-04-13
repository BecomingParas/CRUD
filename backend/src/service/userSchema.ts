import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(25),
  email: z.string().email(),
  address: z.string(),
});
