"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { ArrowRight } from "lucide-react"

export default function TopBar() {
    const pathname = usePathname()
    const { address } = useWallet()

    const gender = typeof window !== "undefined" ? localStorage.getItem("skillmint_gender") || "male" : "male";
    const avatarUrl = address ? `https://api.dicebear.com/7.x/${gender}/svg?seed=${address}` : null;
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 flex items-center justify-between px-4 md:px-8">
            {/* Left - Empty for now */}
            <div />

            {/* Right - Icons */}
            <div className="flex items-center gap-3">
                <ModeToggle />
                <Link href="/wallet" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
                <Link href="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    )}
                </Link>
            </div>
        </header>
    )
}
