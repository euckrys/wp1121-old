import { createChat } from "./actions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";

type SearchInputProps = {
    userId1: string;
    username1: string;
}

export default async function SearchInput({ userId1, username1 }: SearchInputProps) {

    // const handleSearch = async () => {
    //     const username = inputRef.current?.value;
    //     if (!username) {
    //         alert("Please enter some username");
    //         return;
    //     }
    //     inputRef.current.value = "";

    //     const newId = await createChat(userId1, username);
    //     if (newId === "-1") {
    //         alert("The user is not existed");
    //         return;
    //     } else if (newId === "0") {
    //         alert("聊天室已存在");
    //         return;
    //     }
    //     setNewChatId(newId);
    // }

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === "Enter" && !e.shiftKey) {
    //         e.preventDefault();
    //         handleSearch();
    //     }
    // };

    // const handleSearch = async () => {
    //     const newId = createChat(userId1, searchValue);
    // }

    return (
        <form
            // onSubmit={handleSubmit}
            action={async (e) => {
                "use server";
                const username2 = e.get("user");
                if (!username2) return;
                if (typeof username2 !== "string") return;
                const newChatId = await createChat(userId1, username1, username2);
                if (newChatId === "-1") {
                    // alert("The user is not existed");
                    return;
                } else if (newChatId === "0") {
                    // alert("聊天室已存在");
                    return;
                }
                revalidatePath("/chats");
                redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chats/${newChatId}`);
            }}
        >
            <Input placeholder="user" name="user"/>
            <Button type="submit">Search</Button>
        </form>
    );
}

