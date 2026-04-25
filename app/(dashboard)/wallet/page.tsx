"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, QrCode, Wallet, Zap, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@/hooks/use-wallet"

const BASESCAN_API = "https://api.basescan.org/api"
const BASESCAN_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY ?? ""

interface Tx {
  hash: string
  from: string
  to: string
  value: string       // wei
  timeStamp: string
  isError: string
  functionName: string
}

interface NftToken {
  tokenName: string
  tokenSymbol: string
  tokenID: string
  contractAddress: string
}

function weiToEth(wei: string) {
  return (parseInt(wei) / 1e18).toFixed(4)
}

function formatDate(ts: string) {
  return new Date(parseInt(ts) * 1000).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  })
}

export default function WalletPage() {
  const { address, balance, balanceUsd, connectedAt, refreshBalance } = useWallet()
  const [copied, setCopied] = useState(false)
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [nfts, setNfts] = useState<NftToken[]>([])
  const [loadingTx, setLoadingTx] = useState(false)
  const [loadingNfts, setLoadingNfts] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const walletAddress = address ?? ""
  const shortenedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "—"

  const fetchTransactions = useCallback(async () => {
    if (!walletAddress) return
    setLoadingTx(true)
    try {
      const url = `${BASESCAN_API}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${BASESCAN_KEY}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === "1") setTransactions(data.result)
    } catch (e) {
      console.error("Failed to fetch transactions", e)
    } finally {
      setLoadingTx(false)
    }
  }, [walletAddress])

  const fetchNfts = useCallback(async () => {
    if (!walletAddress) return
    setLoadingNfts(true)
    try {
      const url = `${BASESCAN_API}?module=account&action=tokennfttx&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${BASESCAN_KEY}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === "1") {
        // Deduplicate by contractAddress + tokenID
        const seen = new Set<string>()
        const unique: NftToken[] = []
        for (const tx of data.result) {
          const key = `${tx.contractAddress}-${tx.tokenID}`
          if (!seen.has(key) && tx.to.toLowerCase() === walletAddress.toLowerCase()) {
            seen.add(key)
            unique.push({ tokenName: tx.tokenName, tokenSymbol: tx.tokenSymbol, tokenID: tx.tokenID, contractAddress: tx.contractAddress })
          }
        }
        setNfts(unique)
      }
    } catch (e) {
      console.error("Failed to fetch NFTs", e)
    } finally {
      setLoadingNfts(false)
    }
  }, [walletAddress])

  useEffect(() => {
    fetchTransactions()
    fetchNfts()
  }, [fetchTransactions, fetchNfts])

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([refreshBalance(), fetchTransactions(), fetchNfts()])
    setRefreshing(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const connectedSince = connectedAt
    ? new Date(connectedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—"

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your wallet, view transactions, and track your assets.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Overview</CardTitle>
                <CardDescription>Your connected Base network wallet details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Address</p>
                      <div className="flex items-center mt-1">
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{shortenedAddress}</code>
                        <Button variant="ghost" size="icon" onClick={copyToClipboard} className="ml-2">
                          {copied ? <span className="text-green-500 text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Network</p>
                      <p className="mt-1">Base Mainnet</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Connected Since</p>
                      <p className="mt-1">{connectedSince}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(`https://basescan.org/address/${walletAddress}`, "_blank")}>
                        <ExternalLink className="h-4 w-4" />
                        View on Basescan
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <QrCode className="h-4 w-4" />
                        Show QR Code
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Balance</h3>
                        <Wallet className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center">
                            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                            <span className="text-2xl font-bold">
                              {balance !== null ? `${balance} ETH` : "Loading..."}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {balanceUsd !== null ? `≈ $${balanceUsd} USD` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start bg-teal-600 hover:bg-teal-700">
                    <Zap className="mr-2 h-4 w-4" />Claim Rewards
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.open(`https://basescan.org/address/${walletAddress}#nfttransfers`, "_blank")}>
                    <ExternalLink className="mr-2 h-4 w-4" />View NFT Gallery
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <QrCode className="mr-2 h-4 w-4" />Receive ETH
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="assets">NFT Assets</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your recent on-chain transactions on Base</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingTx ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : transactions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No transactions found for this address on Base.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 font-medium">Type</th>
                            <th className="text-left py-3 px-2 font-medium">Amount</th>
                            <th className="text-left py-3 px-2 font-medium">From / To</th>
                            <th className="text-left py-3 px-2 font-medium">Date</th>
                            <th className="text-left py-3 px-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => {
                            const isSent = tx.from.toLowerCase() === walletAddress.toLowerCase()
                            const counterparty = isSent
                              ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                              : `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                            return (
                              <tr key={tx.hash} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="py-3 px-2">
                                  <Badge variant="outline" className={isSent
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                  }>
                                    {isSent ? "Sent" : "Received"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex items-center">
                                    <Zap className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                                    <span className="font-medium">{weiToEth(tx.value)} ETH</span>
                                  </div>
                                </td>
                                <td className="py-3 px-2">
                                  <button
                                    className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                                    onClick={() => window.open(`https://basescan.org/address/${isSent ? tx.to : tx.from}`, "_blank")}
                                  >
                                    {counterparty}
                                  </button>
                                </td>
                                <td className="py-3 px-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(tx.timeStamp)}</span>
                                </td>
                                <td className="py-3 px-2">
                                  {tx.isError === "0"
                                    ? <span className="text-sm text-green-600 dark:text-green-400">Confirmed</span>
                                    : <span className="text-sm text-red-500">Failed</span>
                                  }
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your NFT Assets</CardTitle>
                  <CardDescription>NFTs received by this wallet on Base</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingNfts ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : nfts.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No NFTs found for this address on Base.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 font-medium">Name</th>
                            <th className="text-left py-3 px-2 font-medium">Symbol</th>
                            <th className="text-left py-3 px-2 font-medium">Token ID</th>
                            <th className="text-left py-3 px-2 font-medium">Contract</th>
                            <th className="text-left py-3 px-2 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nfts.map((nft) => (
                            <tr key={`${nft.contractAddress}-${nft.tokenID}`} className="border-b">
                              <td className="py-3 px-2"><span className="font-medium">{nft.tokenName || "Unknown"}</span></td>
                              <td className="py-3 px-2"><Badge variant="outline">{nft.tokenSymbol || "—"}</Badge></td>
                              <td className="py-3 px-2"><span className="text-sm">#{nft.tokenID}</span></td>
                              <td className="py-3 px-2">
                                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                                  {nft.contractAddress.slice(0, 6)}...{nft.contractAddress.slice(-4)}
                                </code>
                              </td>
                              <td className="py-3 px-2">
                                <Button variant="ghost" size="sm" onClick={() => window.open(`https://basescan.org/token/${nft.contractAddress}?a=${walletAddress}`, "_blank")}>
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
