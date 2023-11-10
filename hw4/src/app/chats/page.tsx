export default function ChatsPage() {
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