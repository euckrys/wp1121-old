import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useReply() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const postReply = async ({
        content,
        userName,
        userHandle,
        activityId,
    }: {
        content: string;
        userName: string;
        userHandle: string;
        activityId: number;
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/replies", {
            method: "POST",
            body: JSON.stringify({
                content,
                userName,
                userHandle,
                activityId,
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
        postReply,
        loading,
    };
}