"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home, Award, HelpCircle, Info, Settings,
  LogOut, Wallet, User, BarChart3, Zap, ArrowLeft, Swords,
} from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { motion, AnimatePresence } from "framer-motion"

const COLLAPSED_W = 56   // px — icon-only width
const EXPANDED_W = 200  // px — full width

const navigationItems = [
  { href: "/", icon: ArrowLeft, label: "Back to Home" },
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/arena", icon: Swords, label: "BaseArena" },
  { href: "/challenges", icon: Award, label: "Challenges" },
  { href: "/leaderboard", icon: BarChart3, label: "Leaderboard" },
  { href: "/how-it-works", icon: HelpCircle, label: "How It Works" },
  { href: "/about", icon: Info, label: "About" },
]

const accountItems = [
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
          <polyline points="9,4 3,12 9,20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <polyline points="23,4 29,12 23,20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="12" y="8" width="8" height="8" rx="1.5" fill="#0d9488" />
        </svg>
      </motion.div>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="font-bold text-xl whitespace-nowrap overflow-hidden"
          >
            BaseArena
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

function NavItem({
  href, icon: Icon, label, isActive, collapsed,
}: {
  href: string; icon: React.ElementType; label: string; isActive: boolean; collapsed: boolean
}) {
  return (
    // wrapper needs overflow-visible so the bar can escape the px padding
    <div className="relative group">
      <Link href={href} className="group block">
        <motion.div
          whileHover={{ x: collapsed ? 0 : 2 }}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? "bg-teal-50 dark:bg-teal-900/20" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            } ${collapsed ? "justify-center" : ""}`}
        >
          <div className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${isActive
            ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
            : "text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400"
            }`}>
            <Icon className="h-4 w-4" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-sm font-medium whitespace-nowrap overflow-hidden ${isActive ? "text-teal-600 dark:text-teal-400" : "text-gray-700 dark:text-gray-300"
                  }`}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>

      {/* Active bar — positioned on the outer wrapper, negative left to reach sidebar edge */}
      {isActive && (
        <motion.div
          layoutId="activeBar"
          className="absolute top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-teal-500 to-teal-600 rounded-r-full pointer-events-none"
          style={{ left: collapsed ? -20 : -28 }}
        />
      )}

      {/* Tooltip — only when collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[60] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isConnected, address, disconnect } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isArena = pathname.startsWith("/arena")
  const collapsed = !hovered
  const sidebarW = collapsed ? COLLAPSED_W : EXPANDED_W

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    // Root: full viewport, no overflow, no scroll at this level
    <div className="h-screen w-screen overflow-hidden flex bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* ── Sidebar: FIXED so it never pushes content ── */}
      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="hidden md:flex fixed left-0 top-0 h-screen flex-col z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden"
        style={{ width: sidebarW }}
      >
        {/* Logo */}
        <div className={`flex-shrink-0 transition-all duration-200 ${collapsed ? "px-3 py-5" : "px-5 py-6"}`}>
          <Logo collapsed={collapsed} />
        </div>

        {/* Divider - aligned with topbar */}
        <div className={`h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent ${collapsed ? "mx-1" : "mx-2"}`} />

        {/* Nav */}
        <div className={`flex-1 overflow-y-auto scrollbar-none py-4 transition-all duration-200 ${collapsed ? "px-2" : "px-4"}`}>
          {!collapsed && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Navigation</p>
          )}
          <div className="space-y-1">
            {navigationItems.map(item => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={
                  pathname === item.href ||
                  (item.href === "/challenges" && pathname.startsWith("/challenges/")) ||
                  (item.href === "/arena" && pathname.startsWith("/arena"))
                }
                collapsed={collapsed}
              />
            ))}
          </div>

          {!collapsed && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-4 px-3">Account</p>
          )}
          <div className="space-y-1">
            {accountItems.map(item => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 transition-all duration-200 ${collapsed ? "px-2 py-4" : "px-4 py-5"}`}>
          <div className={`flex ${collapsed ? "flex-col items-center gap-3" : "items-center justify-between mb-4"}`}>
            {!collapsed && <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme</span>}
            <ModeToggle />
          </div>

          {isConnected && !collapsed && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50">
                <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-teal-500/20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-teal-500 text-white text-xs font-bold">
                    {address ? address.slice(2, 4).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-gray-800 dark:text-gray-200">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-500">Earnings</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline" size="sm"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                onClick={disconnect}
              >
                <LogOut className="h-4 w-4 mr-2" />Disconnect
              </Button>
            </div>
          )}

          {isConnected && collapsed && (
            <div className="relative group mt-2">
              <button
                onClick={disconnect}
                className="w-full flex justify-center p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[60] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                  Disconnect
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ── Main content: offset by sidebar width, never pushed ── */}
      <motion.div
        animate={{ marginLeft: sidebarW }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="hidden md:flex flex-1 min-w-0 flex-col overflow-hidden"
        style={{ marginLeft: sidebarW }}
      >
        <div className="flex-1 overflow-auto scrollbar-none">
          {children}
        </div>
      </motion.div>

      {/* Mobile: no sidebar offset */}
      <div className="flex md:hidden flex-1 min-w-0 overflow-auto scrollbar-none">
        {children}
      </div>
    </div>
  )
}
