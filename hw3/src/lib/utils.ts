import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function validateHandle(handle?: string | null) {
    if (!handle) return false;
    return /^[a-z0-9\\._-]{1,25}$/.test(handle);
}

export function validateUsername(username?: string | null) {
    if (!username) return false;
    return /^[a-zA-Z0-9 ]{1,50}$/.test(username);
}