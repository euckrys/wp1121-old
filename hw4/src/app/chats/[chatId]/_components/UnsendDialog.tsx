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

import useMessage from "@/hooks/useMessage";
import useChat from "@/hooks/useChat";

type UnsendDialogProps = {
    messageId: string;
    content: string;
    username: string;
    chatId: string;
    showDialog: boolean;
    onclose: () => void;
}

export default function UnsendDialog({
    messageId,
    content,
    username,
    chatId,
    showDialog,
    onclose,
}: UnsendDialogProps) {
    const { postMessage, deleteMessage, loading: loading1 } = useMessage();
    const { updateChat, loading: loading2 } = useChat();

    const handleUnsend = async () => {
        if (!messageId) return;

        try {
            await postMessage({
                messageId,
                content,
                username,
                chatId,
                isUnsendToMe: true,
            });
        } catch (error) {
            console.error(error);
            alert("Error updating reply");
        }

        onclose();
    };

    const handleDelete = async () => {
        if (!messageId) return;

        try {
            await deleteMessage({
                messageId,
            });
            // if (content ==)

            // await updateChat({
            //     chatId,
            //     username1: username,
            //     username2: username,
            //     lastContent: "",
            // })
        } catch (error) {
            console.log(error);
            alert("Error deleting message");
        }

        onclose();
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={onclose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            收回訊息？
                        </DialogTitle>
                        <DialogDescription>
                            你想對誰移除這則訊息
                        </DialogDescription>
                    </DialogHeader>
                        <Button
                            onClick={handleUnsend}
                            className="font-semibold"
                            disabled={loading1 || loading2}
                        >
                            對你移除訊息
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="font-semibold"
                            disabled={loading1 || loading2}
                        >
                            收回訊息
                        </Button>
                    <DialogFooter>
                        <Button onClick={onclose} className="font-semibold">Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}