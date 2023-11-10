type ChatLayoutProps = {
    children: React.ReactNode;
    navbar: React.ReactNode;
};

export default function ChatLayout({ children, navbar } : ChatLayoutProps) {
    return (
        <main>
            <nav>
                {navbar}
            </nav>
            <div>{children}</div>
        </main>
    )
}