import Link from "next/link";

import { Check } from "lucide-react";


type ActivityProps = {
    username?: string;
    handle?: string;
    id: number;
    authorName?: string;
    authorHandle?: string;
    content: string;
    startTime?: string;
    endTime?: string;
    joins: number;
    joined?: boolean;
};

export default function Activity({
    username,
    handle,
    id,
    content,
    joins,
    joined,
}: ActivityProps) {
    return (
        <>
          <Link
            className="w-full hover:bg-gray-600"
            href={{
                pathname: `/activity/${id}`,
                query: {
                    username,
                    handle,
                },
            }}
          >
            <div className="flex items-center p-4">
                <div className="bg-gray-200 rounded p-2 flex-grow flex justify-between items-center">
                    <article className="whitespace-pre-wrap flex-grow ml-2 text-base font-semibold font-sans tracking-wide">
                        {content}
                    </article>
                    {joined && <Check className="text-green-700 text-lg font-black"/>}
                    <p className="ml-8">{joins ? `${joins} 人參加`: "0 人參加" }</p>
                </div>
            </div>
          </Link>
        </>
    )
}