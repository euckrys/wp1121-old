"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useUserInfo from "@/hooks/useUserInfo";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ChangeDialog() {
    const [showDialog, setShowDialog] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { handle } = useUserInfo();

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();


    const handleOpenChange = (open: boolean) => {
        if (open) {
            setShowDialog(true);
        } else {
            setShowDialog(false);
        }
    }

    const handleChange = async () => {
        const displayName = inputRef.current?.value;

        if (!displayName) {
            alert("Please enter your name!")
            return;
        }
        if (!handle) return;

        const params = new URLSearchParams(searchParams);
        params.set("username", displayName);
        params.set("handle", handle);
        router.push(`${pathname}?${params.toString()}`);

        setShowDialog(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleChange();
        }
    };

    return (
        <>
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-white text-black font-bold mt-1 tracking-wider hover:bg-gray-200"
          >
           <p className="text-sm text-gray-800 mt-1 border-b-2 border-gray-800">切換使用者</p>
          </Button>
          <Dialog open={showDialog} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="tracking-wide">
                        想更換顯示的名稱嗎?
                    </DialogTitle>
                    <DialogDescription className="tracking-wide">
                        請輸入新的使用者名稱
                    </DialogDescription>
                </DialogHeader>
                    <Separator />
                    <div className="grid grid-cols-4 items-center justify-start gap-4">
                        <Label
                            htmlFor="name"
                            className="text-right justify-self-center font-semibold text-base tracking-wider"
                        >
                            使用者名稱
                        </Label>
                        <Input
                            placeholder="輸入新的使用者名稱"
                            ref={inputRef}
                            className="col-span-3"
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                <DialogFooter>
                    <Button onClick={handleChange} className="font-semibold">Change</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
    )
}