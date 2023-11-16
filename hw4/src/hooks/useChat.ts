"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useChat() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const postChat = async ({
        username1,
        username2,
    }: {
        username1: string,
        username2: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/chats", {
            method: "POST",
            body: JSON.stringify({
                username1,
                username2,
            }),
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    }

    const updateChat = async ({
        chatId,
        username1,
        username2,
        lastContent,
        lastUpdate,
    }: {
        chatId: string;
        username1: string,
        username2: string,
        lastContent: string,
        lastUpdate: Date,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/chats", {
            method: "PUT",
            body: JSON.stringify({
                chatId,
                username1,
                username2,
                lastContent,
                lastUpdate,
            }),
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    }

    const deleteChat = async ({
        chatId,
    }: {
        chatId: string;
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/chats", {
            method: "DELETE",
            body: JSON.stringify({
                chatId,
            }),
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    }

    return {
        postChat,
        updateChat,
        deleteChat,
    }
}