import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useActivity() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getActivity = async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/activities", {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);

        return res;
    }

    const postActivity = async ({
        handle,
        content,
        startTime,
        endTime,
        replyToActivityId,
    }: {
        handle: string;
        content: string;
        startTime?: string;
        endTime?: string;
        replyToActivityId?: number;
    }) => {
        setLoading(true);

        const res = await fetch("/api/activities", {
            method: "POST",
            body: JSON.stringify({
                handle,
                content,
                startTime,
                endTime,
                replyToActivityId,
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
        getActivity,
        postActivity,
        loading,
    };
}