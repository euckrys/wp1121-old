import { z } from "zod";

export const messageRequestSchema1 = z.object({
    messageId: z.string().optional(),
    content: z.string().min(1).max(280),
    username: z.string().min(1).max(100),
    chatId: z.string(),
    isUnsendToMe: z.boolean().optional(),
});

export const messageRequestSchema2 = z.object({
    messageId: z.string(),
    isUnsendToMe: z.boolean().optional(),
})