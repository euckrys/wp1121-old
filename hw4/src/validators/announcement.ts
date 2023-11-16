import { z } from "zod";

export const announcementRequestSchema = z.object({
    messageId: z.string(),
    content: z.string().min(1).max(280),
    username: z.string().min(1).max(100),
    chatId: z.string(),
});