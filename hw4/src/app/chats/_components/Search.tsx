"use client";

import { useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils/shadcn";

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSearch = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const params = new URLSearchParams(searchParams);
        const username = searchParams.get("username");
        const handle = searchParams.get("handle");
        params.set("search", !e.target.value ? "" : e.target.value);
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div onClick={() => textareaRef.current?.focus()} className="w-full">
            <div className="flex">
                <input
                    onChange={handleSearch}
                    placeholder=" 搜尋想參加的活動 . . . "
                    className={cn("ml-4 rounded-xl p-2 w-full placeholder:text-gray-700 placeholder:font-semibold")}
                    style={{ border: "1px solid gray" }}
                />
            </div>
        </div>
    )
}