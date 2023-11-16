"use client"

import MessageInput from "./_components/MessageInput";
import { Button } from "@/components/ui/button";

import useChat from "@/hooks/useChat";
import { useRouter } from "next/navigation";

type Props = {
    children: React.ReactNode;
    params: { chatId: string };
};

export default function layout({ children, params }: Props) {
    const { deleteChat }= useChat();
    const router = useRouter();

    const handleDelete = async () => {
        if (!params.chatId) return;
        const chatId = params.chatId;

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
            <Button onClick={handleDelete}>DELETE</Button>
            <div>{children}</div>
            <MessageInput chatId={params.chatId}/>
        </div>
    )
}