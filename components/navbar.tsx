"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { motion } from "framer-motion"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
]

function BaseArenaLogo({ size = 30 }: { size?: number }) {
  // viewBox: 32 wide, 24 tall
  // < at left, > at right, ■ perfectly centered between them
  return (
    <svg width={size} height={size * 24 / 32} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* < chevron */}
      <polyline points="9,4 3,12 9,20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* > chevron */}
      <polyline points="23,4 29,12 23,20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* ■ square — centered at 16,12 */}
      <rect x="12" y="8" width="8" height="8" rx="1.5" fill="#0d9488" />
    </svg>
  )
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const pathname = usePathname()
  const { isConnected, address, disconnect } = useWallet()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
            <BaseArenaLogo />
          </motion.div>
          <span className="font-bold text-xl tracking-tight">BaseArena</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                isActive(href) ? "text-teal-600 dark:text-teal-400" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          {isConnected ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="sm" className="font-mono text-xs" onClick={disconnect}>
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="hidden md:flex bg-teal-600 hover:bg-teal-700"
              onClick={() => setIsWalletModalOpen(true)}
            >
              Connect Wallet
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t p-4"
        >
          <nav className="flex flex-col space-y-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                  isActive(href) ? "text-teal-600 dark:text-teal-400" : ""
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              {isConnected ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full font-mono text-xs" onClick={disconnect}>
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={() => setIsWalletModalOpen(true)}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </nav>
        </motion.div>
      )}

      <WalletConnectModal open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen} />
    </header>
  )
}
