import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useUser() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getUser = async ({
        username,
    }: {
        username: string;
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/users?username2=${username}`, {
            method: "GET",
        });

        if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error);
        }

        const data = await res.json();
        const user = data.user;

        router.refresh();
        setLoading(false);
        return user;
    }

    return {
        getUser,
        loading,
    };
}