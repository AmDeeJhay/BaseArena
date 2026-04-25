"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useState } from "react"

const MetaMaskIcon = () => (
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-6 h-6 object-contain" />
)

const CoinbaseIcon = () => (
  <svg viewBox="0 0 1024 1024" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" rx="200" fill="#0052FF" />
    <path d="M512 692C395 692 300 597 300 480C300 363 395 268 512 268C616 268 703 341 724 440H932C908 228 720 68 512 68C292 68 112 248 112 468C112 688 292 868 512 868C720 868 908 708 932 496H724C703 595 616 692 512 692Z" fill="white" />
  </svg>
)

const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    Icon: MetaMaskIcon,
    description: "Connect using MetaMask browser extension",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    Icon: CoinbaseIcon,
    description: "Connect using Coinbase Wallet",
  },
]

export function WalletConnectModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { connect } = useWallet()
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId)
    try {
      await connect(walletId)
      onOpenChange(false)
    } finally {
      setConnecting(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to access challenges, earn rewards, and build your on-chain skill portfolio on Base.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {wallets.map((wallet) => (
            <motion.div key={wallet.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
              <Button
                variant="outline"
                className="w-full justify-start p-4 h-auto"
                onClick={() => handleConnect(wallet.id)}
                disabled={connecting !== null}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <wallet.Icon />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{wallet.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{wallet.description}</span>
                  </div>
                </div>
                {connecting === wallet.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-teal-600 dark:text-teal-400" />
                  </div>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </div>
      </DialogContent>
    </Dialog>
  )
}
