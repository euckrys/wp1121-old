"use client";

import { useRef } from "react";

import { Button } from "./ui/button";
import useUserInfo from "@/hooks/useUserInfo";
import useReply from "@/hooks/useReply";

type ReplyInputProps = {
    replyToActivityId: number;
    joined: boolean;
};

export default function ReplyInput({
    replyToActivityId,
    joined,
}: ReplyInputProps) {
    const { username, handle } = useUserInfo();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { postReply, loading } = useReply();

    const handleReply = async () => {
        const content = textareaRef.current?.value;
        if (!content) {
            alert("Please enter some content");
            return;
        }
        if (!username) return;
        if (!handle) return;

        try {
            await postReply({
                content,
                userName: username,
                userHandle: handle,
                activityId: replyToActivityId,
            });
            textareaRef.current.value = "";

            textareaRef.current.dispatchEvent(
                new Event("input", { bubbles: true, composed: true }),
            );
        } catch (e) {
            console.error(e);
            alert("Error posting reply");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleReply();
        }
    };

    const auto_grow = (element: HTMLTextAreaElement) => {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
      }

    return (
        <div onClick={() => textareaRef.current?.focus()}>
            <div className="flex flex-row justify-between">
                <div className="w-full">
                    <textarea
                        ref={textareaRef}
                        className={`flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 placeholder:text-gray-700 placeholder:font-semibold
                                   ${joined? "bg-transparent": "bg-yellow-200 cursor-not-allowed placeholder:text-black"}`}
                        style={{ resize: "none", overflow: "hidden", border: "1px solid gray"}}
                        placeholder={joined? `${username}, 留下你的想法` : "加入活動來一起討論吧！"}
                        disabled={!joined}
                        onKeyDown={handleKeyDown}
                        onInput={() => auto_grow(textareaRef.current as HTMLTextAreaElement)}
                    />
                </div>
                <div className="ml-3 self-center">
                    <Button
                        onClick={handleReply}
                        disabled={loading || !joined}
                        className="font-bold text-base"
                    >
                        Reply
                    </Button>
                </div>
            </div>
        </div>
    )
}