import { useRouter } from "next/navigation";
import { useState } from "react";

import { AnnouncementType } from "@/lib/types/db";

export default function useAnnouncement() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getAnnouncement = async ({
        chatId,
    }: {
        chatId: string;
    }): Promise<AnnouncementType | undefined> => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/announcements?chatId=${chatId}`, {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const announcement = data.announcement;

        router.refresh();
        setLoading(false);
        return announcement;
    }

    const updateAnnouncement = async ({
        messageId,
        content,
        username,
        chatId,
    }: {
        messageId: string,
        content: string,
        username: string,
        chatId: string,
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/announcements", {
            method: "POST",
            body: JSON.stringify({
                messageId,
                content,
                username,
                chatId,
            }),
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    };

    return {
        getAnnouncement,
        updateAnnouncement,
    };
}