import { useMemo, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";

export default function useUserInfo() {
    const searchParams = useSearchParams();
    const username = useMemo(() => searchParams.get("username"), [searchParams]);
    const handle = useMemo(() => searchParams.get("handle"), [searchParams]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const postDisplayName = async ({
        handle,
        displayName,
    }: {
        handle: string;
        displayName: string;
    }) => {
        setLoading(true);

        const res = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({
                handle,
                displayName,
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
        postDisplayName,
        username,
        handle,
        loading,
    };
}