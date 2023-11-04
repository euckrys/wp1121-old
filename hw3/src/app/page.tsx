import { eq, isNull, like, sql } from "drizzle-orm";

import { db } from "@/db";
import { joinsTable, activitiesTable, usersTable } from "@/db/schema";

import Activity from "@/components/Activity";
import SearchInput from "@/components/SearchInput";
import AddActivityDialog from "@/components/AddActivityDialog"
import ChangeDialog from "@/components/ChangeDialog";
import NameDialog from "@/components/NameDialog";
import { Separator } from "@/components/ui/separator";

type HomePageProps = {
  searchParams: {
    username?: string;
    handle?: string;
    search?: string;
  };
};

export default async function Home({
  searchParams: { username, handle, search },
}: HomePageProps) {

  if (username && handle) {
    await db
      .insert(usersTable)
      .values({
        displayName: username,
        handle,
      })
      .onConflictDoUpdate({
        target: usersTable.handle,
        set: {
          displayName: username,
        },
      })
      .execute();
  }


  const joinsSubquery = db.$with("joins_count").as(
    db
      .select({
        activityId: joinsTable.activityId,
        joins: sql<number | null>`count(*)`.mapWith(Number).as("joins"),
      })
      .from(joinsTable)
      .groupBy(joinsTable.activityId),
  )

  const joinedSubquery = db.$with("liked").as(
    db
      .select({
        activityId: joinsTable.activityId,
        joined: sql<number>`1`.mapWith(Boolean).as("joined"),
      })
      .from(joinsTable)
      .where(eq(joinsTable.userHandle, handle ?? "")),
  );

  if(!search) {
    search = "";
  }

  const activities = await db
    .with(joinsSubquery, joinedSubquery)
    .select({
      id: activitiesTable.id,
      content: activitiesTable.content,
      startTime: activitiesTable.startTime,
      endTime: activitiesTable.endTime,
      username: usersTable.displayName,
      handle: usersTable.handle,
      joins: joinsSubquery.joins,
      joined: joinedSubquery.joined,
    })
    .from(activitiesTable)
    .where(isNull(activitiesTable.replyToActivityId))
    .where(like(activitiesTable.content, `%${search}%`))
    .innerJoin(usersTable, eq(activitiesTable.userHandle, usersTable.handle))
    .leftJoin(joinsSubquery, eq(activitiesTable.id, joinsSubquery.activityId))
    .leftJoin(joinedSubquery, eq(activitiesTable.id, joinedSubquery.activityId))
    .execute();

  return (
    <div className="max-h-screen flex justify-center p-10 m-10">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-min flex-col">
        <div className="max-h-full">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-2xl ml-3">{`${username}`}</h1>
            <ChangeDialog />
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="w-full">
              <SearchInput />
            </div>
            <p className="font-semibold ml-5">或</p>
            <div className="ml-5 mr-5">
              <AddActivityDialog />
            </div>
          </div>
          <Separator className="mt-8"/>
          <div className="mt-5 overflow-y-auto" style={{ height: "550px" }}>
            {activities.map((activity) => (
              <Activity
                key={activity.id}
                id={activity.id}
                username={username}
                handle={handle}
                authorName={activity.username}
                authorHandle={activity.handle}
                content={activity.content}
                startTime={activity.startTime}
                endTime={activity.endTime}
                joins={activity.joins}
                joined={activity.joined}
              />
            ))}
          </div>
        </div>
      </div>
      <NameDialog />
    </div>
  );
}