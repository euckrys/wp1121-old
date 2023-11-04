"use client"

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
import useActivity from "@/hooks/useActivity";
import useJoin from "@/hooks/useJoin";

export default function AddActivityDialogs() {
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();
    const { username, handle } = useUserInfo();
    const contentInputRef = useRef<HTMLInputElement>(null);
    const startTimeInputRef = useRef<HTMLInputElement>(null);
    const endTimeInputRef = useRef<HTMLInputElement>(null);
    const { postActivity, loading } = useActivity();
    const { joinActivity } = useJoin();

    const isCorrectDate = (date: Date | string): boolean => {
        return isFinite(+(date instanceof Date ? date : new Date(date)));
    };

    const handleAdd = async () => {
        const content = contentInputRef.current?.value;
        const startTime = startTimeInputRef.current?.value;
        const endTime = endTimeInputRef.current?.value;

        // 欄位都有填寫
        if (!handle) return;
        if (!content) {
            alert("Please enter the event name");
            return;
        }
        if (!startTime) {
            alert("Please enter the start time");
            return;
        }
        if (!endTime) {
            alert("Please enter the end time");
            return;
        }

        const st1 = startTime.split(" ", 2); // YYYY-MM-DD and HH
        const st2 = st1[0].split("-", 3); // YYYY and MM and DD

        const et1 = endTime.split(" ", 2);
        const et2 = et1[0].split("-", 3);

        const stDate = new Date(st1[0]);
        const etDate = new Date(et1[0]);

        const timeDiff = etDate.getTime() - stDate.getTime();

        if (!st1[1] || !st2[1] || !st2[0] || !st2[1] || !st2[2] || !et2[0] || !et2[1] || !et2[2]) {
            alert("請確認格式是否正確 : \"YYYY-MM-DD HH\"")
            return;
        }

        // 合法日期與時間
        if (!isCorrectDate(startTime.split(" ", 2)[0]) || !isCorrectDate(endTime.split(" ", 2)[0])) {
            alert("The Date is not valid");
            return;
        } else if (st2[1].length!=2 || et2[1].length!=2) {
            alert("月份應為2位整數, 必要時請補0");
            return;
        } else if (st2[2].length!=2 || et2[2].length!=2) {
            alert("日期應為2位整數, 必要時請補0");
            return;
        } else if (st1[1].length!=2 || et1[1].length!=2) {
            alert("小時應為2位整數(24小時制)");
            return;
        } else if (Number(st1[1])<0 || Number(st1[1])>=24) {
            alert("Invalid hour value of the start time");
            return;
        } else if (Number(et1[1])<0 || Number(et1[1])>=24) {
            alert("Invalid hour value of the end time");
            return;
        };

        // startTime早於endTime
        if (etDate.toISOString() < stDate.toISOString()) {
            alert("endTime should be later than startTime");
            return;
        } else if (etDate.toISOString() === stDate.toISOString() && et1[1] <= st1[1]) {
            alert("endTime should be later than startTime");
            return;
        }

        // 相差最多7天
        if ( timeDiff > 86400000*7 ) {
            alert("最多相差7天");
            return;
        } else if ( timeDiff === 86400000*7 && et1[1] > st1[1] ) {
            alert("最多相差7天");
            return;
        }

        try {
            const newActivityId = await postActivity({
                handle,
                content,
                startTime,
                endTime,
            });

            contentInputRef.current.value = "";
            startTimeInputRef.current.value = "";
            endTimeInputRef.current.value = "";

            await joinActivity({
                activityId: newActivityId,
                userHandle: handle,
            });

            router.push(`/activity/${newActivityId}?username=${username}&handle=${handle}`);
        } catch (e) {
            console.error(e);
            alert("Error posting activitiy");
        }
        setShowDialog(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setShowDialog(true);
        } else {
            setShowDialog(false);
        }
    }

    return (
        <>
            <Button
                onClick={ () => setShowDialog(true) }
                className="min-w-max font-semibold text-base tracking-wider"
            >
                新增活動
            </Button>
            <Dialog open={showDialog} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="tracking-wide">
                            來建立活動吧！
                        </DialogTitle>
                        <DialogDescription className="tracking-wide">
                            請輸入活動標題、時間。
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Separator className="mb-5"/>
                        <div className="grid grid-cols-4 items-center gap-4 mb-2">
                            <Label htmlFor="name" className="text-right justify-self-center font-semibold text-base tracking-wider">
                                活動標題
                            </Label>
                            <Input
                                placeholder="請輸入標題"
                                ref={contentInputRef}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 mb-2">
                            <Label htmlFor="name" className="text-right justify-self-center font-semibold text-base tracking-wider">
                                開始時間
                            </Label>
                            <Input
                                placeholder="YYYY-MM-DD HH"
                                ref={startTimeInputRef}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right justify-self-center font-semibold text-base tracking-wider">
                                結束時間
                            </Label>
                            <Input
                                placeholder="YYYY-MM-DD HH"
                                ref={endTimeInputRef}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleAdd}
                            disabled={loading}
                            className="font-semibold"
                        >
                            ADD
                        </Button>
                    </DialogFooter>
                 </DialogContent>
            </Dialog>
        </>
    )
}