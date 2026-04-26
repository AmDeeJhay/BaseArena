"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, ExternalLink, ShieldCheck, Zap, Trophy, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { ArenaPost } from "@/types/arena"
import { useWallet } from "@/hooks/use-wallet"
import arenaService, { signMessage } from "@/services/arenaService"

interface PostCardProps {
  post: ArenaPost
  onUpdate: (post: ArenaPost) => void
}

const TYPE_CONFIG = {
  achievement: { label: "Achievement", icon: <Trophy className="h-3 w-3" />, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  earning:     { label: "Earning",     icon: <Zap className="h-3 w-3" />,    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  general:     { label: "Post",        icon: null,                            color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const { address } = useWallet()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [liking, setLiking] = useState(false)

  const hasLiked = address ? post.likes.includes(address.toLowerCase()) : false
  const isOwner = address?.toLowerCase() === post.authorAddress.toLowerCase()
  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "just now"
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  const handleLike = async () => {
    if (!address || liking) return
    setLiking(true)
    try {
      const message = `Like post ${post.id} by ${address}`
      const signature = await signMessage(message)
      await arenaService.likePost(post.id, address, signature)
      const newLikes = hasLiked
        ? post.likes.filter(a => a !== address.toLowerCase())
        : [...post.likes, address.toLowerCase()]
      onUpdate({ ...post, likes: newLikes })
    } catch (e) {
      console.error(e)
    } finally {
      setLiking(false)
    }
  }

  const handleComment = async () => {
    if (!address || !commentText.trim() || submittingComment) return
    setSubmittingComment(true)
    try {
      const message = `Comment on post ${post.id}: ${commentText}`
      const signature = await signMessage(message)
      const comment = await arenaService.addComment(post.id, commentText, address, signature)
      onUpdate({ ...post, comments: [...post.comments, comment] })
      setCommentText("")
    } catch (e) {
      console.error(e)
    } finally {
      setSubmittingComment(false)
    }
  }

  const cfg = TYPE_CONFIG[post.type]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-4 space-y-3">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                <AvatarFallback>{post.authorUsername?.slice(0, 2).toUpperCase() ?? "??"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{post.authorUsername || shortAddr(post.authorAddress)}</span>
                  {/* Proof of ownership badge */}
                  <span title={`Signed by ${post.authorAddress}`} className="text-teal-600 dark:text-teal-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 font-mono">{shortAddr(post.authorAddress)}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs flex items-center gap-1 ${cfg.color}`}>
              {cfg.icon}{cfg.label}
            </Badge>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed">{post.content}</p>

          {/* Earning / Achievement proof card */}
          {(post.earnedAmount || post.challengeTitle) && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {post.earnedAmount && (
                  <>
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-sm">{post.earnedAmount}</span>
                  </>
                )}
                {post.challengeTitle && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">· {post.challengeTitle}</span>
                )}
              </div>
              {post.txHash && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-teal-600 dark:text-teal-400"
                  onClick={() => window.open(`https://basescan.org/tx/${post.txHash}`, "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                  Verify on-chain
                </Button>
              )}
            </div>
          )}

          {/* Proof of ownership fingerprint */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <ShieldCheck className="h-3 w-3" />
            <span className="font-mono truncate" title={post.signature}>
              sig: {post.signature.slice(0, 20)}...
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-1 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleLike}
              disabled={!address || liking}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                hasLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
              <span>{post.likes.length}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </button>
          </div>

          {/* Comments */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {post.comments.map(c => (
                  <div key={c.id} className="flex items-start gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={c.authorAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{c.authorUsername?.slice(0, 2).toUpperCase() ?? "??"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold">{c.authorUsername || shortAddr(c.authorAddress)}</span>
                        <ShieldCheck className="h-3 w-3 text-teal-500" title={`Signed by ${c.authorAddress}`} />
                        <span className="text-xs text-gray-400">{timeAgo(c.createdAt)}</span>
                      </div>
                      <p className="text-xs">{c.content}</p>
                    </div>
                  </div>
                ))}

                {address && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Write a comment… (will be signed)"
                      className="text-sm h-8"
                      onKeyDown={e => e.key === "Enter" && handleComment()}
                    />
                    <Button size="sm" className="h-8 bg-teal-600 hover:bg-teal-700" onClick={handleComment} disabled={submittingComment || !commentText.trim()}>
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </CardContent>
      </Card>
    </motion.div>
  )
}
