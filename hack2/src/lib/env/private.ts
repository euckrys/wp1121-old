import { z } from "zod";

const privateEnvSchema = z.object({
  // FINISHTODO: 1.2 Add your private environment variables here for your database (postgres)
  POSTGRES_URL: z.string().url(),
  // FINISHTODO: 1.2 end
});

type PrivateEnv = z.infer<typeof privateEnvSchema>;

export const privateEnv: PrivateEnv = {
  // FINISHTODO: 1.3 Add your private environment variables here for your database (postgres)
  POSTGRES_URL: process.env.POSTGRES_URL!,
  // FINISHTODO: 1.3 end
};

privateEnvSchema.parse(privateEnv);
