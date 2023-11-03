import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { activitiesTable } from "@/db/schema";

const postActivityRequestSchema = z.object({
    handle: z.string().min(1).max(50),
    content: z.string().min(1).max(280),
    startTime: z.string().min(1).max(20),
    endTime: z.string().min(1).max(20),
    replyToActivityId: z.number().optional(),
});

type PostActivityRequest = z.infer<typeof postActivityRequestSchema>;

export async function GET() {
    // const data = await request.json();

    // try {
    //     postActivityRequestSchema.parse(data);
    // } catch (error) {
    //     return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    // }

    // const { content } = data as PostActivityRequest;

    try {
        const [results] = await db
        .select({
            id: activitiesTable.id,
            content: activitiesTable.content
        })
        .from(activitiesTable)
        .execute();

        return NextResponse.json({ id: results.id, content: results.content }, { status: 200 });
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
        postActivityRequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { handle, content, startTime, endTime, replyToActivityId } = data as PostActivityRequest;

    try {
        await db
          .insert(activitiesTable)
          .values({
            userHandle: handle,
            content,
            startTime,
            endTime,
            replyToActivityId,
          })
          .execute();
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}