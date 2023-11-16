"use server"
import { RxAvatar } from "react-icons/rx";

import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import SearchInput from "./SearchInput";
import Search from "./Search";
import { db } from "@/db";
import { chatsTable } from "@/db/schema";
import { and, eq, like, or } from "drizzle-orm";
import Chat from "./Chat";

export default async function Navbar() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId1 = session.user.id;
  const username1 = session.user.username;

  const chats = await db
    .select({
      id: chatsTable.id,
      chatId: chatsTable.displayId,
      username1: chatsTable.username1,
      username2: chatsTable.username2,
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
    .execute();

  return (
    <nav className="flex w-full flex-col overflow-y-scroll bg-slate-100 pb-10">
      <nav className="sticky top-0 flex flex-col items-center justify-between border-b bg-slate-100 pb-2">
        <div className="flex w-full items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2">
            <RxAvatar />
            <h1 className="text-sm font-semibold">
              {session?.user?.username ?? "User"}
            </h1>
          </div>
          <Link href={`/auth/signout`}>
            <Button
              variant={"ghost"}
              type={"submit"}
              className="hover:bg-slate-200"
            >
              Sign Out
            </Button>
          </Link>
        </div>
        <SearchInput
          userId1={userId1}
          username1={username1}
        />
        <Search />
        <div>
          {chats.map((chat) => (
            <Chat
              key={chat.id}
              chatId={chat.chatId}
              username={chat.username1 === username1? chat.username2 : chat.username1}
            />
          ))}
        </div>
      </nav>
    </nav>
  );
}