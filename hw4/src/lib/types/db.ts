export type User = {
    id: string;
    username: string;
    email: string;
    provider: "github" | "credentials";
};

export type ChatType = {
    id: string;
    chatId: string;
    username1: string;
    username2: string;
    lastContent: string;
};

export type MessageType = {
    id: string;
    content: string;
    username: string;
};

export type AnnouncementType = {
    content: string;
    username: string;
}
