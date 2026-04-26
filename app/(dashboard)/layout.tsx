"use client"

import type React from "react"

import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWallet()
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isConnected) {
      setIsWalletModalOpen(true)
    }
  }, [mounted, isConnected])

  if (!mounted) {
    return null
  }

  return (
    <>
      <DashboardLayout>
        <div className="h-full pb-20 md:pb-0">{children}</div>
      </DashboardLayout>
      <MobileBottomNav />
      <WalletConnectModal open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen} />
    </>
  )
}
