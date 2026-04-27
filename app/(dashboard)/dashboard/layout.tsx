import TopBar from "@/components/topbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopBar />
            <div >{children}</div>
        </>
    )
}