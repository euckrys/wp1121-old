import { relations, sql } from "drizzle-orm";
import {
    index,
    text,
    pgTable,
    serial,
    uuid,
    varchar,
    unique,
    boolean,
    timestamp
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        displayId: uuid("display_id").defaultRandom().notNull().unique(),
        username: varchar("username", { length: 100 }).notNull().unique(),
        email: varchar("email", { length: 100 }).notNull().unique(),
        hashedPassword: varchar("hashed_password", { length: 100 }),
        provider: varchar("provider", {
            length: 100,
            enum: ["github", "credentials"],
        })
            .notNull()
            .default("credentials"),
    },
    (table) => ({
        displayIdIndex: index("display_id_index").on(table.displayId),
        emailIndex: index("email_index").on(table.email),
    }),
);

export const usersRelations = relations(usersTable, ({ many }) => ({
    usersToChatsTable: many(usersToChatsTable),
}));

export const chatsTable = pgTable(
    "chats",
    {
        id: serial("id").primaryKey(),
        displayId: uuid("display_id").defaultRandom().notNull().unique(),
        username1: varchar("username_1", { length: 100 })
            .notNull()
            .references(() => usersTable.username, { onDelete: "cascade", onUpdate: "cascade", }),
        username2: varchar("username_2", { length: 100 })
            .notNull()
            .references(() => usersTable.username, { onDelete: "cascade", onUpdate: "cascade", }),
        lastContent: varchar("last_content", { length: 280 }).notNull().default(""),
        lastUpdate: timestamp("last_update").default(sql`now()`),
    },
    (table) => ({
        displayIdIndex: index("display_id_index").on(table.displayId),
        lastUpdateIndex: index("last_update_index").on(table.lastUpdate),
    }),
);

export const chatsRelations = relations(chatsTable, ({ many }) => ({
    usersToChatsTable: many(usersToChatsTable),
}));

export const usersToChatsTable = pgTable(
    "users_to_chats",
    {
        id: serial("id").primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => usersTable.displayId, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        chatId: uuid("chat_id")
            .notNull()
            .references(() => chatsTable.displayId, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        username: varchar("username", { length: 100 })
            .notNull()
            .references(() => usersTable.username, { onDelete: "cascade", onUpdate: "cascade", }),

    },
    (table) => ({
        usersAndChatIndex: index("user_and_chat_index").on(
            table.userId,
            table.chatId,
        ),
        uniqCombination: unique().on(table.chatId, table.userId),
    }),
);

export const usersToChatsRelations = relations(
    usersToChatsTable,
    ({ one }) => ({
        chat: one(chatsTable, {
            fields: [usersToChatsTable.chatId],
            references: [chatsTable.displayId],
        }),
        user: one(usersTable, {
            fields: [usersToChatsTable.userId],
            references: [usersTable.displayId],
        }),
    }),
);

export const messagesTable = pgTable(
    "messages",
    {
        id: serial("id").primaryKey(),
        messageId: uuid("message_id").defaultRandom().notNull().unique(),
        content: varchar("content", { length: 280 }).notNull(),
        username: varchar("username", { length: 100 })
            .notNull()
            .references(() => usersTable.username, { onDelete: "cascade", onUpdate: "cascade", }),
        chatId: uuid("chat_id")
            .notNull()
            .references(() => chatsTable.displayId, { onDelete: "cascade", onUpdate: "cascade", }),
        isUnsendToMe: boolean("is_unsend_to_me").notNull().default(false),
        createdAt: timestamp("created_at").default(sql`now()`),
    },
    (table) => ({
        messageIdIndex: index("message_id_index").on(table.messageId),
        usernameIndex: index("username_index").on(table.username),
        chatIdIndex: index("chat_id_index").on(table.chatId),
        createdAtIndex: index("created_at_index").on(table.createdAt),
    }),
);

export const announcementsTable = pgTable(
    "announcements",
    {
        id: serial("id").primaryKey(),
        messageId: uuid("message_id")
            .notNull()
            .references(() => messagesTable.messageId, { onDelete: "cascade" }),
        content: varchar("content", { length: 280 }).notNull(),
        username: varchar("user_name", { length: 100 })
            .notNull()
            .references(() => usersTable.username, { onDelete: "cascade" }),
        chatId: uuid("chat_id")
            .notNull()
            .references(() => chatsTable.displayId, { onDelete: "cascade" })
            .unique(),
    },
    (table) => ({
        chatIdIndex: index("chat_id_index").on(table.chatId),
    })
);