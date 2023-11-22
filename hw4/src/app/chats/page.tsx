import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { chatsTable } from "@/db/schema";
import { and, eq, desc, or } from "drizzle-orm";
import { headers } from "next/headers";

export default async function ChatsPage() {
    const session = await auth();
    if (!session || !session?.user?.id) {
      redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
    }
    const username1 = session.user.username;

    const chats = await db
      .select({
        id: chatsTable.id,
        chatId: chatsTable.displayId,
        username1: chatsTable.username1,
        username2: chatsTable.username2,
        lastContent: chatsTable.lastContent,
      })
      .from(chatsTable)
      .where(
        and(
          or(
            eq(chatsTable.username1, username1),
            eq(chatsTable.username2, username1),
          ),
        )
      )
      .orderBy(desc(chatsTable.lastUpdate))
      .execute();

      console.log(chats);

    const headersList = headers();
    const currentURL = headersList.get("referer");
    console.log(currentURL);
    if (chats && chats.length > 0 && (currentURL?.endsWith("localhost:3000/") || currentURL?.endsWith("localhost:3000/chats"))) {
        redirect(`/chats/${chats[0].chatId}`);
    }

    return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-3xl font-bold">
            選擇聊天室開始聊天吧！
            或者你可以創建新的聊天室。
          </p>
        </div>
    )
}