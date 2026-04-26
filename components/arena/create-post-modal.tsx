"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldCheck, Trophy, Zap, MessageSquare } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import arenaService, { signMessage, buildContentHash } from "@/services/arenaService"
import type { ArenaPost } from "@/types/arena"

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (post: ArenaPost) => void
}

type PostType = "achievement" | "earning" | "general"

const TYPES: { value: PostType; label: string; icon: React.ReactNode }[] = [
  { value: "general",     label: "Post",        icon: <MessageSquare className="h-4 w-4" /> },
  { value: "achievement", label: "Achievement", icon: <Trophy className="h-4 w-4" /> },
  { value: "earning",     label: "Earning",     icon: <Zap className="h-4 w-4" /> },
]

export function CreatePostModal({ open, onOpenChange, onCreated }: CreatePostModalProps) {
  const { address } = useWallet()
  const [type, setType] = useState<PostType>("general")
  const [content, setContent] = useState("")
  const [txHash, setTxHash] = useState("")
  const [challengeTitle, setChallengeTitle] = useState("")
  const [earnedAmount, setEarnedAmount] = useState("")
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setContent("")
    setTxHash("")
    setChallengeTitle("")
    setEarnedAmount("")
    setType("general")
    setError(null)
  }

  const handleSubmit = async () => {
    if (!address || !content.trim()) return
    setSigning(true)
    setError(null)
    try {
      const timestamp = new Date().toISOString()
      const contentHash = buildContentHash(content, address, timestamp)
      // Ask wallet to sign — this proves the post was authored by this address
      const message = `BaseArena post\nAddress: ${address}\nTimestamp: ${timestamp}\nHash: ${contentHash}`
      const signature = await signMessage(message)

      const post = await arenaService.createPost({
        content,
        type,
        authorAddress: address,
        signature,
        contentHash,
        txHash: txHash.trim() || undefined,
        challengeTitle: challengeTitle.trim() || undefined,
        earnedAmount: earnedAmount.trim() || undefined,
      })

      onCreated(post)
      reset()
      onOpenChange(false)
    } catch (e: any) {
      if (e?.code === 4001) {
        setError("Signature rejected. Your post needs to be signed to prove ownership.")
      } else {
        setError(e?.message ?? "Failed to create post.")
      }
    } finally {
      setSigning(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            New Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Post type selector */}
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  type === t.value
                    ? "bg-teal-600 text-white border-teal-600"
                    : "border-gray-200 dark:border-gray-700 hover:border-teal-400"
                }`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <Textarea
            placeholder={
              type === "earning" ? "Share what you earned and how…"
              : type === "achievement" ? "Describe your achievement…"
              : "What's on your mind?"
            }
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />

          {/* Extra fields for earning/achievement */}
          {(type === "earning" || type === "achievement") && (
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Proof of Work (optional)</p>
              {type === "earning" && (
                <div className="space-y-1">
                  <Label className="text-xs">Amount Earned</Label>
                  <Input placeholder="e.g. 0.05 ETH" value={earnedAmount} onChange={e => setEarnedAmount(e.target.value)} className="h-8 text-sm" />
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-xs">Challenge Title</Label>
                <Input placeholder="e.g. Build a DEX Order Book on Base" value={challengeTitle} onChange={e => setChallengeTitle(e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Transaction Hash (on-chain proof)</Label>
                <Input placeholder="0x..." value={txHash} onChange={e => setTxHash(e.target.value)} className="h-8 text-sm font-mono" />
              </div>
            </div>
          )}

          {/* Signing notice */}
          <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
            <ShieldCheck className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <span>Your wallet will sign this post to prove ownership. The signature is stored with the post so anyone can verify it was authored by <span className="font-mono">{address ? `${address.slice(0,6)}...${address.slice(-4)}` : "your address"}</span>.</span>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { reset(); onOpenChange(false) }}>Cancel</Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleSubmit}
              disabled={!content.trim() || signing}
            >
              {signing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing…</> : "Post & Sign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
