import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";

import { z } from "zod";

import { db } from "@/db";
import { chatsTable, usersTable, usersToChatsTable } from "@/db/schema";
import { chatRequestSchema, chatDELETERequestSchema } from "@/validators/chat";
import { eq, and, or, desc } from "drizzle-orm";


type ChatRequest = z.infer<typeof chatRequestSchema>;
type ChatDeleteRequest = z.infer<typeof chatDELETERequestSchema>;

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
        }
        const username1 = session.user.username;
        const url = new URL(request.url);
        const username2 = url.searchParams.get("username2");
        const chatId = url.searchParams.get("chatId");

        if (!username2 && !chatId) {
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 },
            );
        }

        if (!chatId && username2) {
            const [chat] = await db
                .select({
                    id: chatsTable.id,
                    chatId: chatsTable.displayId,
                    username1: chatsTable.username1,
                    username2: chatsTable.username2,
                    lastContent: chatsTable.lastContent,
                })
                .from(chatsTable)
                .where(
                    or(
                        and(
                            eq(chatsTable.username1, username1),
                            eq(chatsTable.username2, username2),
                        ),
                        and(
                            eq(chatsTable.username1, username2),
                            eq(chatsTable.username2, username1),
                        )
                    )
                )
                .execute();
            return NextResponse.json({ chat }, { status: 200 });
        }
        else if (!username2 && chatId) {
            const [chat] = await db
                .select({
                    id: chatsTable.id,
                    chatId: chatsTable.displayId,
                    username1: chatsTable.username1,
                    username2: chatsTable.username2,
                    lastContent: chatsTable.lastContent,
                })
                .from(chatsTable)
                .where(
                    eq(chatsTable.displayId, chatId),
                )
                .execute();
            return NextResponse.json({ chat }, { status: 200 });
        }
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
        chatRequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { username1, username2, lastContent, lastUpdate } = data as ChatRequest;

    try {
        const result =  await db.transaction(async(tx) => {
            const [newChat] = await tx
                .insert(chatsTable)
                .values({
                    username1: username1,
                    username2: username2,
                    lastContent: lastContent,
                    lastUpdate: lastUpdate,
                })
                .returning();

            const [user1info] = await db
                .select({
                    userId: usersTable.displayId,
                })
                .from(usersTable)
                .where(eq(usersTable.username, username1));

            const userId1 = user1info.userId;

            const [user2info] = await db
                .select({
                    userId: usersTable.displayId,
                })
                .from(usersTable)
                .where(eq(usersTable.username, username2));

            const userId2 = user2info.userId;

            await tx.insert(usersToChatsTable)
                .values({
                    username: username1,
                    userId: userId1,
                    chatId: newChat.displayId,
                });
            await tx.insert(usersToChatsTable)
                .values({
                    username: username2,
                    userId: userId2,
                    chatId: newChat.displayId,
                });
        })

        console.log(result);
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}

export async function PUT(request: NextRequest) {
    const data = await request.json();

    try {
        chatRequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { chatId, lastContent, lastUpdate } = data as ChatRequest;

    try {
        if (!chatId) {
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 },
            );
        }
        const [result] =  await db
            .update(chatsTable)
            .set({
                lastContent: lastContent,
                lastUpdate: new Date(),
            })
            .where(eq(chatsTable.displayId, chatId))
            .returning();

        console.log(result);
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
        chatDELETERequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { chatId } = data as ChatDeleteRequest;

    try {
        if (!chatId) {
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 },
            );
        }
        await db
            .delete(chatsTable)
            .where(eq(chatsTable.displayId, chatId))
            .execute();

    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}