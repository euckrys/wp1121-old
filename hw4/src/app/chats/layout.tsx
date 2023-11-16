import Navbar from "./_components/Navbar";

type ChatLayoutProps = {
    children: React.ReactNode;
    params: { chatId: string };
};

export default function ChatLayout({ children, params } : ChatLayoutProps) {
    return (
        <main className="flex-rows fixed top-0 flex h-screen w-full overflow-hidden">
            <nav className="flex w-2/5 flex-col overflow-y-scroll border-r bg-slate-100 pb-10">
                <Navbar />
            </nav>
        <div className="w-full overflow-y-scroll">{children}</div>
      </main>
    )
}