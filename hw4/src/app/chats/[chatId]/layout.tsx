"use client"

import MessageInput from "./_components/MessageInput";

type Props = {
    children: React.ReactNode;
    params: { chatId: string };
};

export default function layout({ children, params }: Props) {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1">{children}</div>
            <div className="p-3">
                <MessageInput chatId={params.chatId}/>
            </div>
        </div>
    )
}