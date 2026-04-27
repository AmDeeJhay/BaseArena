"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function TopBar() {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 flex items-center justify-between px-4 md:px-8">
      {/* Left - Browse Challenges (only on dashboard) */}
      {isDashboard && (
        <Link href="/challenges">
          <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg px-6 py-3">
            Browse Challenges
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      )}
      {!isDashboard && <div />}

      {/* Right - Icons */}
      <div className="flex items-center gap-3">
        <ModeToggle />
        <Link href="/wallet" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <Link href="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Link>
      </div>
    </header>
  )
}
