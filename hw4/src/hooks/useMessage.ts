import { useRouter } from "next/navigation";
import { useState } from "react";


export default function useMessage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getMessage = async ({
        chatId,
    }: {
        chatId: string;
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/messages?chatId=${chatId}`, {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const messages = data.messages;

        router.refresh();
        setLoading(false);
        return messages;
    }

    const postMessage = async ({
        messageId,
        content,
        username,
        chatId,
        isUnsendToMe,
    }: {
        messageId?: string;
        content: string;
        username: string;
        chatId: string;
        isUnsendToMe?: boolean;
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/messages", {
            method: "POST",
            body: JSON.stringify({
                messageId,
                content,
                username,
                chatId,
                isUnsendToMe,
            }),
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    };

    const deleteMessage = async ({
        messageId,
    }: {
        messageId: string;
    }) => {
        if (loading) return;

        setLoading(true);
        const res = await fetch("/api/messages", {
            method: "DELETE",
            body: JSON.stringify({
                messageId,
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
        getMessage,
        postMessage,
        deleteMessage,
        loading,
    };
}
