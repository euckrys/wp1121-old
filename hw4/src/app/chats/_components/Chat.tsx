import Link from "next/link";

type ChatProps = {
    chatId: string;
    username: string;
    lastContent: string;
};

export default function Chat({
    chatId,
    username,
    lastContent,
}: ChatProps) {
    return(
        <Link
            className="w-full hover:bg-gray-600"
            href={{
            pathname: `/chats/${chatId}`,
            }}
        >
            <div className="mb-5 border shadow-md h-28">
                <div className="w-full bg-white rounded-3xl p-3 flex justify-between items-center">
                    <div className="flex flex-col truncate">
                        <span className="ml-2 text-2xl font-bold mb-5">{username}</span>
                        <span className="ml-2 text-base w-max-full text-gray-700">{lastContent}</span>
                    </div>
                </div>
            </div>
      </Link>
    )
}