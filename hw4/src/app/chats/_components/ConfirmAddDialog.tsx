"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useChat from "@/hooks/useChat";

type ConfirmAddDialogProps = {
    username1: string;
    username2: string;
    showDialog: boolean;
    onclose: () => void;
}

export default function ConfirmAddDialog({
    username1,
    username2,
    showDialog,
    onclose,
}: ConfirmAddDialogProps) {
    const { postChat, loading } = useChat();

    const handleAdd = async () => {
        if (!username1 || !username2) return;
        try {
            await postChat({
                username1,
                username2,
            });
        } catch (error) {
            console.log(error);
            alert("Error creating chatroom");
        }

        onclose();
    };

    return (
        <>
            <Dialog open={showDialog} onOpenChange={onclose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {`您似乎尚未有與 ${username2} 的聊天室`}
                        </DialogTitle>
                        <DialogDescription>
                            {`是否要新增聊天室?`}
                        </DialogDescription>
                    </DialogHeader>
                    <Button
                        onClick={handleAdd}
                        className="font-semibold"
                        disabled={loading}
                    >
                        新增聊天室
                    </Button>
                    <DialogFooter>
                        <Button onClick={onclose} className="font-semibold">取消</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}