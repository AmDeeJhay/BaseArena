"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Award, HelpCircle, Info, Settings, LogOut, Wallet, User, BarChart3, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isConnected, disconnect } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const navigationItems = [
    { href: "/", icon: ArrowLeft, label: "Back to Home" },
    { href: "/dashboard", icon: Home, label: "Dashboard" },
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <Sidebar className="hidden md:flex w-64 flex-shrink-0 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <SidebarHeader className="px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <svg width="40" height="30" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="9,4 3,12 9,20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <polyline points="23,4 29,12 23,20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <rect x="12" y="8" width="8" height="8" rx="1.5" fill="#0d9488" />
                </svg>
              </motion.div>
              <div className="font-bold text-xl group-hover:opacity-80 transition-opacity duration-300">
                BaseSkill
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-4 py-4 overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href || (item.href === "/challenges" && pathname.startsWith("/challenges/"))
                    const Icon = item.icon
                    
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive}
                          className="group relative"
                        >
                          <Link 
                            href={item.href}
                            onMouseEnter={() => setHoveredItem(item.href)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <motion.div 
                              className="flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200"
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`p-1.5 rounded-lg mr-3 transition-all duration-200 ${
                                isActive 
                                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' 
                                  : 'text-gray-600 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                              }`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className={`font-medium transition-colors duration-200 ${
                                isActive 
                                  ? 'text-teal-600 dark:text-teal-400' 
                                  : 'text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                              }`}>
                                {item.label}
                              </span>
                            </motion.div>
                            
                            {/* Active indicator */}
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-r-full"
                                  initial={{ opacity: 0, scaleY: 0 }}
                                  animate={{ opacity: 1, scaleY: 1 }}
                                  exit={{ opacity: 0, scaleY: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                  style={{ y: "-50%" }}
                                />
                              )}
                            </AnimatePresence>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SidebarSeparator className="my-6 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                
                <SidebarGroup>
                  <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Account
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {accountItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton 
                              asChild 
                              isActive={isActive}
                              className="group relative"
                            >
                              <Link 
                                href={item.href}
                                onMouseEnter={() => setHoveredItem(item.href)}
                                onMouseLeave={() => setHoveredItem(null)}
                              >
                                <motion.div 
                                  className="flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200"
                                  whileHover={{ x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className={`p-1.5 rounded-lg mr-3 transition-all duration-200 ${
                                    isActive 
                                      ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' 
                                      : 'text-gray-600 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                                  }`}>
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <span className={`font-medium transition-colors duration-200 ${
                                    isActive 
                                      ? 'text-teal-600 dark:text-teal-400' 
                                      : 'text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                                  }`}>
                                    {item.label}
                                  </span>
                                </motion.div>
                                
                                {/* Active indicator */}
                                <AnimatePresence>
                                  {isActive && (
                                    <motion.div
                                      className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-r-full"
                                      initial={{ opacity: 0, scaleY: 0 }}
                                      animate={{ opacity: 1, scaleY: 1 }}
                                      exit={{ opacity: 0, scaleY: 0 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                      style={{ y: "-50%" }}
                                    />
                                  )}
                                </AnimatePresence>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </motion.div>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200/50 dark:border-gray-700/50 p-6 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <ModeToggle />
              </div>

              {isConnected ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <SidebarSeparator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                  
                  <div className="flex items-center gap-3 min-w-0 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-600/50">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-teal-500/20 dark:ring-teal-400/20">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-semibold">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        John Doe
                      </span>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Zap className="h-3 w-3 mr-1 text-yellow-500 flex-shrink-0" />
                        </motion.div>
                      <span className="truncate font-medium">Earnings</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 transition-all duration-200"
                      onClick={disconnect}
                    >
                      <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate font-medium">Disconnect</span>
                    </Button>
                  </motion.div>
                </motion.div>
              ) : null}
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full overflow-auto"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  )
}
