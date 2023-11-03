import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { repliesTable } from "@/db/schema";

const replyActivityRequestSchema = z.object({
    content: z.string().min(1).max(280),
    userName: z.string().min(1).max(50),
    userHandle: z.string().min(1).max(50),
    activityId: z.number().positive(),
});

type ReplyActivityRequest = z.infer<typeof replyActivityRequestSchema>;

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        replyActivityRequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { content, userName, userHandle, activityId } = data as ReplyActivityRequest;

    try {
        await db
            .insert(repliesTable)
            .values({
                content,
                userName,
                userHandle,
                activityId,
            })
            .onConflictDoNothing()
            .execute();
    }   catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}