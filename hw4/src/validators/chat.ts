import { z } from "zod";

export const chatRequestSchema = z.object({
    chatId: z.string().optional(),
    username1: z.string().min(1).max(100),
    username2: z.string().min(1).max(100),
    lastContent: z.string().min(1).max(280).optional(),
    lastUpdate: z.date().optional(),
});

export const chatDELETERequestSchema = z.object({
    chatId: z.string().min(1),
})