"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

const BASE_CHAIN_ID = "0x2105" // Base mainnet (8453)

type WalletContextType = {
  isConnected: boolean
  isConnecting: boolean
  address: string | null
  balance: string | null       // ETH balance, formatted
  balanceUsd: string | null    // USD equivalent
  connectedAt: string | null   // ISO timestamp of first connection
  connect: (walletType?: string) => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isConnecting: false,
  address: null,
  balance: null,
  balanceUsd: null,
  connectedAt: null,
  connect: async () => {},
  disconnect: () => {},
  refreshBalance: async () => {},
})

async function switchToBase(provider: any) {
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BASE_CHAIN_ID }] })
  } catch (err: any) {
    if (err.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: BASE_CHAIN_ID,
          chainName: "Base",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://mainnet.base.org"],
          blockExplorerUrls: ["https://basescan.org"],
        }],
      })
    } else {
      throw err
    }
  }
}

function hexToEth(hex: string): string {
  const wei = BigInt(hex)
  const eth = Number(wei) / 1e18
  return eth.toFixed(4)
}

async function fetchEthBalance(address: string): Promise<string | null> {
  try {
    const provider = (window as any).ethereum
    if (!provider) return null
    const hex: string = await provider.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    })
    return hexToEth(hex)
  } catch {
    return null
  }
}

async function fetchEthPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 60 } }
    )
    const data = await res.json()
    return data?.ethereum?.usd ?? null
  } catch {
    return null
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [balanceUsd, setBalanceUsd] = useState<string | null>(null)
  const [connectedAt, setConnectedAt] = useState<string | null>(null)
  const router = useRouter()

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
    setBalance(null)
    setBalanceUsd(null)
    setConnectedAt(null)
    localStorage.removeItem("wallet-connected")
    localStorage.removeItem("wallet-address")
    localStorage.removeItem("wallet-connected-at")
    router.push("/")
  }, [router])

  const refreshBalance = useCallback(async (addr?: string) => {
    const target = addr ?? address
    if (!target) return
    const [eth, price] = await Promise.all([fetchEthBalance(target), fetchEthPrice()])
    if (eth !== null) setBalance(eth)
    if (eth !== null && price !== null) {
      setBalanceUsd((parseFloat(eth) * price).toFixed(2))
    }
  }, [address])

  // Restore session on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("wallet-address")
    const savedAt = localStorage.getItem("wallet-connected-at")
    if (savedAddress) {
      setIsConnected(true)
      setAddress(savedAddress)
      setConnectedAt(savedAt)
      refreshBalance(savedAddress)
    }

    const provider = (window as any).ethereum
    if (!provider) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setAddress(accounts[0])
        localStorage.setItem("wallet-address", accounts[0])
        refreshBalance(accounts[0])
      }
    }

    provider.on("accountsChanged", handleAccountsChanged)
    return () => provider.removeListener("accountsChanged", handleAccountsChanged)
  }, [disconnect, refreshBalance])

  const connect = async (walletType = "metamask") => {
    setIsConnecting(true)
    try {
      let provider = (window as any).ethereum

      if (!provider) {
        const url = walletType === "coinbase"
          ? "https://www.coinbase.com/wallet"
          : "https://metamask.io/download/"
        window.open(url, "_blank")
        return
      }

      if (provider.providers?.length) {
        provider = walletType === "coinbase"
          ? provider.providers.find((p: any) => p.isCoinbaseWallet) ?? provider.providers[0]
          : provider.providers.find((p: any) => p.isMetaMask) ?? provider.providers[0]
      }

      await switchToBase(provider)
      const accounts: string[] = await provider.request({ method: "eth_requestAccounts" })
      if (accounts.length === 0) throw new Error("No accounts returned")

      const now = new Date().toISOString()
      setAddress(accounts[0])
      setIsConnected(true)
      setConnectedAt(now)
      localStorage.setItem("wallet-connected", "true")
      localStorage.setItem("wallet-address", accounts[0])
      localStorage.setItem("wallet-connected-at", now)

      await refreshBalance(accounts[0])
      router.push("/dashboard")
    } catch (err: any) {
      if (err.code !== 4001) console.error("Wallet connect error:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <WalletContext.Provider value={{ isConnected, isConnecting, address, balance, balanceUsd, connectedAt, connect, disconnect, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
