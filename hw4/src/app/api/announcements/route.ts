import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { announcementsTable } from "@/db/schema";
import { announcementRequestSchema } from "@/validators/announcement";
import { eq } from "drizzle-orm";

type AnnouncementRequest = z.infer<typeof announcementRequestSchema>;

export async function GET(request: NextRequest){
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }

        const url = new URL(request.url);
        const chatId = url.searchParams.get("chatId");

        if (!chatId) {
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 },
            );
        }

        const [announcement] = await db
            .select({
                content: announcementsTable.content,
                username: announcementsTable.username,
            })
            .from(announcementsTable)
            .where(eq(announcementsTable.chatId, chatId))

        return NextResponse.json({ announcement }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        announcementRequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { messageId, content, username, chatId} = data as AnnouncementRequest;

    try {
        const result = await db
            .insert(announcementsTable)
            .values({
                messageId,
                content,
                username,
                chatId,
            })
            .onConflictDoUpdate({
                target: announcementsTable.chatId,
                set: {
                    messageId: messageId,
                    content: content,
                    username: username,
                },
            })
            .execute();

        console.log(result);
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}