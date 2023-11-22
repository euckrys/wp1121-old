import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const url = new URL(request.url);
        const username2 = url.searchParams.get("username2");
        console.log(username2);

        if (!username2) {
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 },
            );
        }

        const [user] = await db
            .select({
                username: usersTable.username,
            })
            .from(usersTable)
            .where(eq(usersTable.username, username2))
            .execute();

        console.log(user);

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}