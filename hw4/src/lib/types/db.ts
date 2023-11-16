export type User = {
    id: string;
    username: string;
    email: string;
    provider: "github" | "credentials";
};

export type Chat = {
    id: string;
    title: string;
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
