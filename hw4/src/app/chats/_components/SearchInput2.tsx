"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

type searchInputProps = {
    userId1: string;
    username1: string;
};

export default function SearchInput({

}: searchInputProps){


    return (
        <div>
            <Input />
            <Button>SEARCH</Button>
        </div>
    )
}