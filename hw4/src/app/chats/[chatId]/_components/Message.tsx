"use client"

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Megaphone } from 'lucide-react';

import UnsendDialog from "./UnsendDialog";
import useAnnouncement from "@/hooks/useAnnouncement";

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

  return (
      <div onContextMenu={handleRightClick}>
        <p className="mb-3">
          <span className="font-semibold text-lg">{messageUsername} : </span> {content}
        </p>
        <button onClick={handleAnnouncement}>
          <Megaphone />
        </button>

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
  )
}