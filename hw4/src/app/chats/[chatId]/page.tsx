"use client"

import Message from "./_components/Message";
import { Button } from "../../../components/ui/button";

import { pusherClient } from "@/lib/pusher/client";

import useMessage from "@/hooks/useMessage";
import useAnnouncement from "@/hooks/useAnnouncement";
import useChat from "@/hooks/useChat";
import { MessageType, AnnouncementType, ChatType } from "@/lib/types/db";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Megaphone } from 'lucide-react';

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
}: ChatPageProps) {
    const { getMessage } = useMessage();
    const { getAnnouncement } = useAnnouncement();
    const { getChatUsername } = useChat();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [announcement, setAnnouncement] = useState<AnnouncementType>();
    const [hasAnnouncement, setHasAnnouncement] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [nowId, setNowId] = useState("");
    const [username2, setUsername2] = useState("");
    const [chat, setChat] = useState<ChatType>();

    const { data: session } = useSession();
    const username = session?.user?.username? session.user.username : "";

    const fetchMessages = async () => {
        try {
            const newMessages = await getMessage({
                chatId: chatId,
            });
            setMessages(newMessages);
            bottomRef?.current?.scrollIntoView();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

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

    const fetchChat = async () => {
        try {
            const chat = await getChatUsername({
                chatId: chatId,
            });
            if (!chat || !chat.username2 || !chat.username1) return;
            setChat(chat);
        } catch (error) {
            console.log("Error fetching chat:", error);
        }
    }

    if (chatId !== nowId) {
        setNowId(chatId);
    }

    useEffect(() => {
        if (chat&&username) setUsername2(chat.username1 === username ? chat.username2 : chat.username1);
        const channel = pusherClient.subscribe(chatId);
        announcement? setHasAnnouncement(true) : setHasAnnouncement(false);

        channel.bind("message:update", async () => {
            console.log("Message update event received");
            fetchMessages();
        });
        channel.bind("announcement:update", async () => {
            console.log("Announcement update event received")
            fetchAnnouncement();
        });

        return () => {
            channel.unbind();
        };
    }, [chatId, messages, announcement, chat]);


    useEffect(() => {
        if (nowId) {
            fetchMessages();
            fetchAnnouncement();
            fetchChat();
        }
    }, [nowId]);

    const { deleteChat }= useChat();
    const router = useRouter();

    const handleDelete = async () => {
        if (!chatId) return;

        try {
            console.log(chatId);
            await deleteChat({
                chatId,
            });

            router.push("/chats");
            router.refresh();
        } catch (error) {
            console.log(error);
            alert("Error deleting message");
        }
    }

    return (
        <div>
            <div className="flex p-5 text-4xl border-b border-gray-300 shadow-md">
                <p>
                    <span className="font-medium text-gray-800">{"w/ "}</span>
                    <span className="font-bold">{username2}</span>
                </p>
                <Button onClick={handleDelete} className="ml-auto p-5">
                    <p className="text-xl">DELETE</p>
                </Button>
            </div>
            <div className="ml-5 mr-5">
                {hasAnnouncement && (
                    <div className="mt-5 bg-pink-300 rounded-xl p-2 shadow-lg h-12">
                        <div className="flex">
                            <div className="ml-5 mt-[2px]">
                                <Megaphone />
                            </div>
                            <p className="truncate">
                                <span className="text-lg ml-5 font-bold">{`${announcement?.username} : `}</span>
                                <span className="ml-5 truncate break-all">{`${announcement?.content}`}</span>
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex-col mt-5 ml-2 overflow-y-auto min-h-full max-h-[70vh]">
                    <p className="font-semibold text-gray-500 ">{`這是你和 ${username2} 對話的起點！`}</p>
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
        </div>
    );
}