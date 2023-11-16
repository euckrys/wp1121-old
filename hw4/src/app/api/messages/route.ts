import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import Pusher from "pusher";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";
import { auth } from "@/lib/auth";

import { z } from "zod";

import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { messageRequestSchema1, messageRequestSchema2 } from "@/validators/message";
import { eq, and, or, ne, asc } from "drizzle-orm";

type MessageRequest1 = z.infer<typeof messageRequestSchema1>;
type MessageRequest2 = z.infer<typeof messageRequestSchema2>;

export async function GET(request: NextRequest){
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }
        const username = session.user.username;
        const url = new URL(request.url);
        const chatId = url.searchParams.get("chatId");

        if (!chatId) {
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 },
            );
        }

        const messages = await db
        .select({
            id: messagesTable.messageId,
            content: messagesTable.content,
            username: messagesTable.username,
        })
        .from(messagesTable)
        .where(
            and(
                eq(messagesTable.chatId, chatId),
                and(
                    or(
                        eq(messagesTable.isUnsendToMe, false),
                        and(
                            eq(messagesTable.isUnsendToMe, true),
                            ne(messagesTable.username, username),
                        )
                    )
                )
            )
        )
        .orderBy(asc(messagesTable.createdAt))

        return NextResponse.json({ messages }, { status: 200 });

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
        messageRequestSchema1.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { messageId, content, username, chatId, isUnsendToMe } = data as MessageRequest1;

    try {
        const session = await auth();
        const userId = session?.user?.id? session.user.id : "";

        if (!messageId) {
            const [result] =  await db
                .insert(messagesTable)
                .values({
                    messageId,
                    content,
                    username,
                    chatId,
                    isUnsendToMe,
                })
                .returning();

            const pusher = new Pusher({
                appId: privateEnv.PUSHER_ID,
                key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
                secret: privateEnv.PUSHER_SECRET,
                cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
                useTLS: true,
            });

            await pusher.trigger(`${result.chatId}`, "message:update", {
                senderId: userId,
                message: {
                    messageId: result.messageId,
                    content: result.content,
                    username: result.username,
                    chatId: result.chatId,
                    isUnsendToMe: result.isUnsendToMe,
                },
            });

            console.log(result);
        } else {
            const [result] =  await db
                .insert(messagesTable)
                .values({
                    messageId,
                    content,
                    username,
                    chatId,
                    isUnsendToMe,
                })
                .onConflictDoUpdate({
                    target: messagesTable.messageId,
                    set: {
                        isUnsendToMe: true,
                    },
                })
                .returning();

            const pusher = new Pusher({
                appId: privateEnv.PUSHER_ID,
                key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
                secret: privateEnv.PUSHER_SECRET,
                cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
                useTLS: true,
            });

            await pusher.trigger(`${result.chatId}`, "message:update", {
                senderId: userId,
            });

            console.log(result);
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const data = await request.json();

    try {
        messageRequestSchema2.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { messageId } = data as MessageRequest2;

    try {
        const session = await auth();
        const userId = session?.user?.id? session.user.id : "";

        const id = messageId? messageId: "";

        const [chatInfo] = await db
            .select({
                chatId: messagesTable.chatId,
            })
            .from(messagesTable)
            .where(eq(messagesTable.messageId, id))

        await db
            .delete(messagesTable)
            .where(eq(messagesTable.messageId, id))
            .execute()

        const pusher = new Pusher({
            appId: privateEnv.PUSHER_ID,
            key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
            secret: privateEnv.PUSHER_SECRET,
            cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
            useTLS: true,
        });

        await pusher.trigger(`${chatInfo.chatId}`, "message:update", {
            senderId: userId,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }

    return new NextResponse("OK", { status: 200 });
}


