"use client"

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Megaphone } from 'lucide-react';

import UnsendDialog from "./UnsendDialog";
import useAnnouncement from "@/hooks/useAnnouncement";
import { cn } from "@/lib/utils/shadcn"

type MessageProps = {
  chatId: string;
  messageId: string;
  messageUsername: string;
  content: string;
}

export default function Message({
  chatId,
  messageId,
  messageUsername,
  content,
}: MessageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: session } = useSession();
  const { updateAnnouncement } = useAnnouncement();

  const username = session?.user?.username? session.user.username : "";

  const handleAnnouncement = async () => {
    try {
      await updateAnnouncement({
        messageId,
        content,
        username: messageUsername,
        chatId,
      });
    } catch (error) {
      console.error(error);
      alert("Error updating announcement");
    }
  };

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (messageUsername === username) {
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }

  const isLink = /^(https?:\/\/|www\.)\S+/i.test(content);

  return (
      <div onContextMenu={handleRightClick} className="border-radius flex flex-col mr-5">
        {messageUsername === username ? (
          <div className="flex-col self-end">
            <div className="flex justify-end">
              <button onClick={handleAnnouncement} className="mr-5" style={{ transform: 'scaleX(-1)' }}>
                <Megaphone />
              </button>
              <p className="font-semibold text-lg">{messageUsername}</p>
            </div>
            <div className={cn("self-end")}>
              <div className="items-end bg-pink-200 w-fit max-w-lg mt-1 mb-3 px-5 py-2 rounded-3xl font-mediun">
                {isLink ? (
                    <a href={content} target="_blank" rel="noopener noreferrer" className={cn("font-bold underline decoration-solid")}>
                      <p className={cn("font-bold underline decoration-solid")}>{content}</p>
                    </a>
                  ) : (
                    <p className="break-normal">{content}</p>
                )}
              </div>
            </div>

            {dialogOpen && (
              <UnsendDialog
                messageId={messageId}
                content={content}
                username={messageUsername}
                chatId={chatId}
                showDialog={dialogOpen}
                onclose={handleCloseDialog}
              />
            )}
          </div>
        ):(
          <div>
            <div className="flex">
              <p className="font-semibold text-lg">{messageUsername}</p>
              <button onClick={handleAnnouncement} className="ml-5">
                <Megaphone />
              </button>
            </div>
              <div className="bg-gray-200 w-fit max-w-lg mt-1 mb-3 px-5 py-2 rounded-3xl font-medium">
              {isLink ? (
                    <a href={content} target="_blank" rel="noopener noreferrer" className={cn("font-bold underline decoration-solid")}>
                      <p className={cn("font-bold underline decoration-solid")}>{content}</p>
                    </a>
                  ) : (
                    <p className="break-normal">{content}</p>
                )}
              </div>
            {dialogOpen && (
              <UnsendDialog
                messageId={messageId}
                content={content}
                username={messageUsername}
                chatId={chatId}
                showDialog={dialogOpen}
                onclose={handleCloseDialog}
              />
            )}
          </div>
        )}
      </div>
  )
}