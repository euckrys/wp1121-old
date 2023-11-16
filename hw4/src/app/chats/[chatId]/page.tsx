"use client"

import Message from "./_components/Message";

import { pusherClient } from "@/lib/pusher/client";
// import type { User } from "@/lib/types/db";

import useMessage from "@/hooks/useMessage";
import useAnnouncement from "@/hooks/useAnnouncement";
import { MessageType, AnnouncementType } from "@/lib/types/db";
// import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

type ChatPageProps = {
    params: {
        chatId: string;
    };
    searchParams: {
        search?: string;
    }
}

export default function ChatPage({
    params: { chatId },
    searchParams: { search },
}: ChatPageProps) {
    const { getMessage } = useMessage();
    const { getAnnouncement } = useAnnouncement();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [announcement, setAnnouncement] = useState<AnnouncementType>();
    const [hasAnnouncement, setHasAnnouncement] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const newMessages = await getMessage({
                    chatId: chatId,
                });
                setMessages(newMessages);
                bottomRef?.current?.scrollIntoView();
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }

        fetchMessage();

        const channel = pusherClient.subscribe(chatId);
        channel.bind("message:update", async () => {
            console.log("Message update event received");
            fetchMessage();
        });

        return () => {
            channel.unbind();
        };
    }, [chatId]);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const newAnnouncemnt = await getAnnouncement({
                    chatId: chatId,
                });
                if (!newAnnouncemnt) return;
                setAnnouncement(newAnnouncemnt);
            } catch (error) {
                console.error("Error fetching announcement:", error);
            }
        }

        fetchAnnouncement();
        announcement? setHasAnnouncement(true) : setHasAnnouncement(false);

        const channel = pusherClient.subscribe(chatId);
        channel.bind("announcement:update", async () => {
            console.log("Announcement update event received")
            fetchAnnouncement();
        });

    }, [chatId, announcement])

    // const messages = await db
    //     .select({
    //         id: messagesTable.messageId,
    //         content: messagesTable.content,
    //         username: messagesTable.username,
    //     })
    //     .from(messagesTable)
    //     .where(
    //         and(
    //             eq(messagesTable.chatId, chatId),
    //             and(
    //                 or(
    //                     eq(messagesTable.isUnsendToMe, false),
    //                     and(
    //                         eq(messagesTable.isUnsendToMe, true),
    //                         ne(messagesTable.username, username),
    //                     )
    //                 )
    //             )
    //         )
    //     )
    //     .orderBy(asc(messagesTable.createdAt))

    // const [announcement] = await db
    //     .select({
    //         content: announcementsTable.content,
    //         username: announcementsTable.username,
    //     })
    //     .from(announcementsTable)
    //     .where(eq(announcementsTable.chatId, chatId))

    // const hasAnnouncement = announcement? true : false;

    return (
        <div>Chat Id: {chatId}
            {hasAnnouncement && (
                <div>
                    <div>
                        <p>{`${announcement?.username} : ${announcement?.content}`}</p>
                    </div>
                </div>
            )}
            <div className="flex-col mt-5 ml-2 overflow-y-auto" style={{ maxHeight: "550px"}}>
                {messages.map((message) => (
                    <div key={message.id}>
                        <Message
                            chatId={chatId}
                            messageId={message.id}
                            messageUsername={message.username}
                            content={message.content}
                        />
                    </div>
                ))}
                <div className="pt-24" ref={bottomRef}/>
            </div>
        </div>
    );
}