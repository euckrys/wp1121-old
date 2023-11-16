import Link from "next/link";

type ChatProps = {
    chatId: string;
    username: string;
};

export default function Chat({
    chatId,
    username
}: ChatProps) {
    return(
        <Link
            className="w-full hover:bg-gray-600"
            href={{
                pathname: `/chats/${chatId}`,
            }}
        >
            <div>
                <div className="bg-gray-200 rounded p-2 flex-grow flex justify-between items-center">
                    <article className="whitespace-pre-wrap flex-grow ml-2 text-base font-semibold font-sans tracking-wide">
                        {username}
                    </article>
                </div>
            </div>
        </Link>
    )
}