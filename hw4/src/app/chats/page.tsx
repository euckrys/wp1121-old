
type pageProps = {
    searchParams: {
        search?: string;
    }
}

export default function ChatsPage({
    searchParams: { search },
}: pageProps) {
    return (
        <div>
            <h1>Chats</h1>
            {Array.from({ length: 100 }, (_, i) => (
                <div key={i} className="w-full border">
                    content {i}
                </div>
            ))}
        </div>
    )
}