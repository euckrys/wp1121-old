import { z } from "zod";

export const authSchema = z.object({
  username: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});