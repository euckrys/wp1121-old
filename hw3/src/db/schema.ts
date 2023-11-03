import { sql } from "drizzle-orm";
import {
    index,
    integer,
    pgTable,
    serial,
    timestamp,
    unique,
    varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    handle: varchar("handle", { length: 50 }).notNull().unique(),
    displayName: varchar("display_name", { length: 50 }).notNull(),
  },
  (table) => ({
    handleIndex: index("handle_index").on(table.handle),
  }),
);

export const activitiesTable = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    startTime: varchar("startTime", { length: 20 }).notNull(),
    endTime: varchar("endTime", { length: 20 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
    replyToActivityId: integer("reply_to_activity_id"),
  },
  (table) => ({
    userHandleIndex: index("user_handle_index").on(table.userHandle)
  })
);

export const joinsTable = pgTable(
  "joins",
  {
    id: serial("id").primaryKey(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, { onDelete: "cascade" }),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    activityIdIndex: index("activity_id_index").on(table.activityId),
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    uniqCombination: unique().on(table.userHandle, table.activityId),
  }),
);

export const repliesTable = pgTable(
  "replies",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, { onDelete: "cascade" }),
    userName: varchar("user_name", { length: 50 })
      .notNull(),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    activityIdIndex: index("activity_id_index").on(table.activityId),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    userHandleIndex: index("user_handle_index").on(table.userHandle),
  }),
);