"use client";

import { useState } from "react";

import useJoin from "@/hooks/useJoin";

type JoinButtonProps = {
    initialJoined?: boolean;
    activityId: number;
    handle?: string;
};

export default function JoinButton({
    initialJoined,
    activityId,
    handle,
}: JoinButtonProps) {
    const [joined, setJoined] = useState(initialJoined);
    const { joinActivity, disjoinAcitivity, loading } = useJoin();

    const handleClick = async () =>{
        if (!handle) return;
        if (joined) {
            await disjoinAcitivity({
                activityId,
                userHandle: handle,
            });
            setJoined(false);
        } else {
            await joinActivity({
                activityId,
                userHandle: handle,
            });
            setJoined(true);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={
                `p-4 rounded-lg item-center hover:bg-gray-200 min-w-max
                ${joined ? "bg-green-200 hover:bg-green-400" : "bg-white hover:bg-gray-200"}`}
            style={{border: "solid 2px gray"}}
        >
            <p className="font-semibold tracking-wider mb-1">{joined? "我 已": "我 想"}</p>
            <p className="font-semibold tracking-wider">參 加</p>
        </button>
    )
}