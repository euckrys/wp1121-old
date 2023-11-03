import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

const postUserRequestSchema = z.object({
    handle: z.string().min(1).max(50),
    displayName: z.string().min(1).max(50),
})

type PostUserRequest = z.infer<typeof postUserRequestSchema>;

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        postUserRequestSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { handle, displayName } = data as PostUserRequest;
    try {
        await db
          .insert(usersTable)
          .values({
            handle,
            displayName,
          })
          .onConflictDoUpdate({
            target: usersTable.handle,
            set: {
              displayName: displayName,
            },
          })
          .execute();
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
    return new NextResponse("OK", { status: 200});
}