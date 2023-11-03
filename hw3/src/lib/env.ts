import { z } from "zod";

const envSchema = z.object({
    POSTGRES_URL: z.string().url(),
});

type Env = z.infer<typeof envSchema>;

export const env: Env = {
    POSTGRES_URL: process.env.POSTGRES_URL!,
};

envSchema.parse(env);