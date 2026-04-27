import TopBar from "@/components/topbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopBar />
            <div className="pt-4 md:pt-8">{children}</div>
        </>
    )
}
