type ReplyProps = {
    username?: string;
    content: string;
}

export default function Reply({
    username,
    content,
}: ReplyProps) {
    return (
        <div>
          <p className="mb-3">
            <span className="font-semibold text-lg">{username} : </span> {content}
          </p>
        </div>
    )
}