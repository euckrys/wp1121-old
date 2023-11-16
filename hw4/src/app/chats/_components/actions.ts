import { db } from "@/db";
import { chatsTable, usersTable, usersToChatsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// export const createChat = async (userId1: string, username: string) => {
//     const [userinfo] = await db
//         .select({
//             userId: usersTable.displayId,
//         })
//         .from(usersTable)
//         .where(eq(usersTable.username, username));

//     //no existed user
//     if (!userinfo) {
//         return "-1";
//     }

//     const userId2 = userinfo.userId;

//     const user1Chats = await db
//         .select({
//             chatId: usersToChatsTable.chatId,
//         })
//         .from(usersToChatsTable)
//         .where(eq(usersToChatsTable.userId, userId1))

//     const user2Chats = await db
//         .select({
//             chatId: usersToChatsTable.chatId,
//         })
//         .from(usersToChatsTable)
//         .where(eq(usersToChatsTable.userId, userId2))


//     if (user1Chats.some(item => user2Chats.includes(item))) {
//         return "0";
//     }

//     const newChatId = await db.transaction(async (tx) => {
//         const [newChat] = await tx
//             .insert(chatsTable)
//             .values({})
//             .returning();

//         await tx.insert(usersToChatsTable).values({
//             userId: userId1,
//             chatId: newChat.displayId,
//         });
//         await tx.insert(usersToChatsTable).values({
//             userId: userId2,
//             chatId: newChat.displayId,
//         });
//         return newChat.displayId;
//     });
//     console.log("[createChat]");
//     return newChatId;
// }

export const createChat = async (userId1: string, username1: string, username2: string) => {
    if (!username2) return;
    if (typeof username2 !== "string") return;

    const [user2info] = await db
        .select({
            userId: usersTable.displayId,
            username: usersTable.username,
        })
        .from(usersTable)
        .where(eq(usersTable.username, username2));

    //no existed user
    if (!user2info) {
        return "-1";
    }

    const userId2 = user2info.userId;
    username2 = user2info.username;

    const user1Chats = await db
        .select({
            chatId: usersToChatsTable.chatId,
        })
        .from(usersToChatsTable)
        .where(eq(usersToChatsTable.userId, userId1))

    const user2Chats = await db
        .select({
            chatId: usersToChatsTable.chatId,
        })
        .from(usersToChatsTable)
        .where(eq(usersToChatsTable.userId, userId2))


    if (user1Chats.some(item => user2Chats.includes(item))) {
        return "0";
    }

    const newChatId = await db.transaction(async (tx) => {
        const [newChat] = await tx
            .insert(chatsTable)
            .values({
                username1: username1,
                username2: username2,
            })
            .returning();

        await tx.insert(usersToChatsTable).values({
            username: username1,
            userId: userId1,
            chatId: newChat.displayId,
        });
        await tx.insert(usersToChatsTable).values({
            username: username2,
            userId: userId2,
            chatId: newChat.displayId,
        });
        return newChat.displayId;
    });
    console.log("[createChat]");
    return newChatId;
}
