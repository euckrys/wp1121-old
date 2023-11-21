"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useChat from "@/hooks/useChat";
import useUser from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/shadcn";

import ConfirmAddDialog from "./ConfirmAddDialog";

export default function SearchInput2(){
    const inputRef = useRef<HTMLInputElement>(null);
    const { getChat, loading: loading1 } = useChat();
    const { getUser, loading: loading2} = useUser();
    const { data: session } = useSession();
    const router = useRouter();
    const [username2, setUsername2] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);

    const username1 = session?.user?.username? session.user.username : "";

    const handleSearch = async () => {
        const inputValue = inputRef.current?.value;
        if (!inputValue) {
            alert("Please enter some username");
            return;
        }

        setUsername2(inputValue);

        try {
            const targetUser = await getUser({
                username: inputValue,
            })

            if (!targetUser) {
                alert("user not found");
                inputRef.current.value = "";
                return;
            }

            const targetChat = await getChat({
                username2: inputValue,
            })

            if (targetChat && targetChat.chatId) {
                alert("Chat has existed");
                inputRef.current.value = "";
                router.push(`/chats/${targetChat.chatId}`)
                return;
            }

            setDialogOpen(true);
            inputRef.current.value = "";
        } catch (error) {
            console.log(error);
            alert("Error creating chatroom");
        }
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (event.key === "Enter" && !event.shiftKey) {
    //         event.preventDefault();
    //         handleSearch();
    //     }
    // }

    return (
        <div className="w-full flex">
            <Input
                ref={inputRef}
                placeholder="search for users"
                className={cn("rounded-xl p-4 text-base w-full placeholder:text-gray-700 placeholder:font-semibold placeholder:text-base")}
                style={{ border: "1px solid gray" }}
            />
            <Button
                onClick={handleSearch}
                disabled={loading1 || loading2}
                className="font-bold text-base ml-2 rounded-md"
            >
                SEARCH/ADD
            </Button>
            {dialogOpen && (
                <ConfirmAddDialog
                    username1={username1}
                    username2={username2}
                    showDialog={dialogOpen}
                    onclose={handleCloseDialog}
                />
            )}
        </div>
    )
}