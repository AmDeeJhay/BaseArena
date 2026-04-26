"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Award, BarChart3, User, ChevronRight, ArrowLeft, Swords } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    icon: ArrowLeft,
    label: "Home",
    activePattern: "/",
  },
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
    activePattern: "/dashboard",
  },
  {
    href: "/arena",
    icon: Swords,
    label: "Arena",
    activePattern: "/arena",
  },
  {
    href: "/challenges",
    icon: Award,
    label: "Challenges",
    activePattern: "/challenges",
  },
  {
    href: "/leaderboard",
    icon: BarChart3,
    label: "Leaderboard",
    activePattern: "/leaderboard",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
    activePattern: "/profile",
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden pb-safe">
      <nav className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.activePattern))
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors",
                  isActive
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                )}
              >
                <div className="relative">
                  <Icon className="h-4 w-4" />
                  {isActive && (
                    <ChevronRight className="h-2 w-2 absolute -top-0.5 -right-0.5 text-teal-600 dark:text-teal-400" />
                  )}
                </div>
                <span className="text-xs font-medium mt-1 truncate">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
