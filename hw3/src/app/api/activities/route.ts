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

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        postActivityRequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { handle, content, startTime, endTime, replyToActivityId } = data as PostActivityRequest;

    try {
        const result = await db
          .insert(activitiesTable)
          .values({
            userHandle: handle,
            content,
            startTime,
            endTime,
            replyToActivityId,
          })
          .returning()
          .execute();

          console.log(result);

          const newActivityId = result;

          return NextResponse.json({ id: newActivityId[0].id }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}