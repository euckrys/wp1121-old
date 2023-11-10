import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthInputProps = {
    label: string;
    type: React.HTMLInputTypeAttribute;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function AuthInput({ label, type, value, setValue }: AuthInputProps) {
    return (
        <div className="w-full">
            <Label>{label}</Label>
            <Input
                type={type}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
        </div>
    );
}