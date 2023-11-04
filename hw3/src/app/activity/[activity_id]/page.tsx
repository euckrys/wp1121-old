import Link from "next/link";
import { redirect } from "next/navigation";

import { eq, asc, and } from "drizzle-orm";

import { Separator } from "@/components/ui/separator";
import JoinButton from "@/components/JoinButton";
import ReplyInput from "@/components/ReplyInput";
import Reply from "@/components/Reply";
import { ChevronLeft } from 'lucide-react';

import { db } from "@/db";
import { joinsTable, activitiesTable, usersTable, repliesTable } from "@/db/schema";

type ActivityPageProps = {
    params: {
        activity_id: string;
    };
    searchParams: {
        username?: string;
        handle?: string;
    };
};

export default async function ActivityPage({
    params: { activity_id },
    searchParams: { username, handle },
}: ActivityPageProps) {
    const errorRedirect = () => {
        const params = new URLSearchParams();
        username && params.set("username", username);
        handle && params.set("handle", handle);
        redirect(`/?${params.toString()}`);
    };

    const activity_id_num = parseInt(activity_id);
    if (isNaN(activity_id_num)) {
        errorRedirect();
    }

    const [activityData] = await db
      .select({
        id: activitiesTable.id,
        content: activitiesTable.content,
        startTime: activitiesTable.startTime,
        endTime: activitiesTable.endTime,
        userHandle: activitiesTable.userHandle,
      })
      .from(activitiesTable)
      .where(eq(activitiesTable.id, activity_id_num))
      .execute();

    if(!activityData) {
      errorRedirect();
    }

    const joins = await db
      .select({
          id: joinsTable.id,
      })
      .from(joinsTable)
      .where(eq(joinsTable.activityId, activity_id_num))
      .execute();

    const numJoins = joins.length;

    const [joined] = await db
      .select({
          id: joinsTable.id,
      })
      .from(joinsTable)
      .where(
          and(
              eq(joinsTable.activityId, activity_id_num),
              eq(joinsTable.userHandle, handle ?? ""),
          ),
      )
      .execute();

    const [user] = await db
      .select({
        displayName: usersTable.displayName,
        handle: usersTable.handle,
      })
      .from(usersTable)
      .where(eq(usersTable.handle, activityData.userHandle))
      .execute();

    const activity = {
      id: activityData.id,
      content: activityData.content,
      startTime: activityData.startTime,
      endTime: activityData.endTime,
      username: user.displayName,
      handle: user.handle,
      joins: numJoins,
      joined: Boolean(joined),
    };

    const replies = await db
      .select({
        id: repliesTable.id,
        content: repliesTable.content,
        userName: usersTable.displayName,
        userHandle: usersTable.handle,
        activityId: repliesTable.activityId,
        createdAt: repliesTable.createdAt,
      })
      .from(repliesTable)
      .where(eq(repliesTable.activityId, activity_id_num))
      .orderBy(asc(repliesTable.createdAt))
      .innerJoin(usersTable, eq(repliesTable.userHandle, usersTable.handle))
      .execute();

    return (
      <div className="max-h-screen flex justify-center p-10 m-10">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-min flex-col">
          <div className="flex items-center mb-5">
            <Link href={{ pathname: "/", query: { username, handle } }}>
              <ChevronLeft size={40} />
            </Link>
            <div className="flex flex-row justify-between w-full ml-4">
              <div className="flex flex-col w-full item-center">
                <div className="flex items-center p-0 m-0">
                  <div className="bg-gray-200 rounded p-2 m-1 flex-grow flex justify-between items-center">
                    <p className="font-semibold text-xl ml-1">{activity.content}</p>
                    <p className="font-semibold mr-1 text-gray-800">{numJoins? `${numJoins} 人參加`: "0 人參加" }</p>
                  </div>
                </div>
                <div className="flex items-center p-0 m-0">
                  <div className="bg-gray-200 rounded p-2 m-1 flex-grow flex justify-between items-center">
                    <p className="font-semibold ml-1">{`From "${activity.startTime}" to "${activity.endTime}"`}</p>
                  </div>
                </div>
              </div>
              <div className="border-gray-400 border-solid flex item-center rounded-lg p-2 ml-3">
                <JoinButton
                  initialJoined={activity.joined}
                  activityId={activity.id}
                  handle={handle}
                />
              </div>
            </div>
          </div>
          <div className="font-semibold text-xl ml-1 text-mono">討論區</div>
          <Separator className="mt-2 mb-4"/>
          <ReplyInput
            joined={Boolean(joined)}
            replyToActivityId={activity.id}
          />
          <div className="flex-col mt-5 ml-2 overflow-y-auto" style={{ maxHeight: "550px"}}>
            {replies.map((reply) => (
              <div key={reply.id}>
                <Reply
                  username={reply.userName}
                  content={reply.content}
                />
                <Separator className="mb-2"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}