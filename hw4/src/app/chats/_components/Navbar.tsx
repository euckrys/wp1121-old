"use server"
import { RxAvatar } from "react-icons/rx";

import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import { db } from "@/db";
import { chatsTable } from "@/db/schema";
import { and, eq, desc, or } from "drizzle-orm";
import Chat from "./Chat";
import SearchInput2 from "./SearchInput2";
import type { ChatType } from "@/lib/types/db";

export default async function Navbar() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const username1 = session.user.username;

  const chats: ChatType[] = await db
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

  return (
    <nav className="flex w-full flex-col overflow-y-scroll pb-10">
      <nav className="sticky top-0 flex flex-col items-center justify-between border-b pb-2">
        <div className="flex w-full items-center justify-between px-3 py-1 mt-5">
          <div className="flex items-center gap-2 text-2xl">
            <RxAvatar />
            <h1 className="text-2xl font-semibold">
              {session?.user?.username ?? "User"}
            </h1>
          </div>
          <Link href={`/auth/signout`}>
            <Button
              variant={"ghost"}
              type={"submit"}
              className="hover:bg-slate-200"
            >
              <p className="text-lg underline">Sign Out</p>
            </Button>
          </Link>
        </div>
        <div className="w-full p-3">
          <SearchInput2 />
        </div>
        {chats && (
          <div className="w-full p-3">
            {chats.map((chat) => (
              <Chat
                key={chat.id}
                chatId={chat.chatId}
                username={chat.username1 === username1? chat.username2 : chat.username1}
                lastContent={chat.lastContent? chat.lastContent: "開始你們的第一則對話吧！"}
              />
            ))}
          </div>
        )}
      </nav>
    </nav>
  );
}