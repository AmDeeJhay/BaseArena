"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  PenSquare, Users, Zap, Trophy, Loader2, TrendingUp,
  Swords, ImagePlus, Link2, BarChart2, ShieldCheck, Gamepad2
} from "lucide-react"
import { motion } from "framer-motion"
import { useWallet } from "@/hooks/use-wallet"
import arenaService from "@/services/arenaService"
import type { ArenaPost } from "@/types/arena"
import { PostCard } from "@/components/arena/post-card"
import { CreatePostModal } from "@/components/arena/create-post-modal"

type Filter = "all" | "achievement" | "earning"

const TRENDING_TAGS = ["#BaseChain", "#DeFi", "#SmartContracts", "#Web3", "#NFT", "#Solidity", "#OpenSource"]

const WHO_TO_FOLLOW = [
  { username: "CryptoBuilder", address: "0x71C7...976F", avatar: "/placeholder.svg" },
  { username: "Web3Dev",       address: "0xabc1...bc1",  avatar: "/placeholder.svg" },
  { username: "UIWizard",      address: "0xdead...beef", avatar: "/placeholder.svg" },
]

// Top bar height in px — used to offset sticky positions
const TOP_BAR_H = 56 // h-14 = 56px

export default function ArenaPage() {
  const { address, isConnected } = useWallet()
  const [posts, setPosts] = useState<ArenaPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadPosts = useCallback(async (reset = false) => {
    const currentPage = reset ? 1 : page
    reset ? setLoading(true) : setLoadingMore(true)
    try {
      const fetched = await arenaService.fetchPosts(currentPage, 20)
      if (reset) { setPosts(fetched); setPage(2) }
      else { setPosts(prev => [...prev, ...fetched]); setPage(p => p + 1) }
      if (fetched.length < 20) setHasMore(false)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [page])

  useEffect(() => { loadPosts(true) }, [])

  const handlePostCreated = (post: ArenaPost) => setPosts(prev => [post, ...prev])
  const handlePostUpdate  = (updated: ArenaPost) => setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))

  const filtered = filter === "all" ? posts : posts.filter(p => p.type === filter)
  const shortAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`

  return (
    // Full viewport height, no page-level scroll
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">

      {/* ── Fixed top bar ── */}
      <div className="flex-shrink-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-teal-600" />
            <span className="font-bold text-lg">BaseArena</span>
            <Badge variant="outline" className="text-xs ml-1 hidden sm:flex">Social Feed</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              {(["all", "achievement", "earning"] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-white dark:bg-gray-700 shadow text-teal-600 dark:text-teal-400"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {f === "all" ? "All" : f === "achievement" ? "🏆 Achievements" : "⚡ Earnings"}
                </button>
              ))}
            </div>
            {isConnected && (
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 gap-1.5" onClick={() => setShowCreateModal(true)}>
                <PenSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Post</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body: three columns, fills remaining height ── */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 flex gap-6 overflow-hidden">

          {/* ── Left sidebar — sticky, scrolls its own content, stops at bottom ── */}
          <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 py-6 overflow-y-auto scrollbar-none">
            {/* Profile card */}
            {isConnected && (
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Avatar className="h-14 w-14 ring-2 ring-teal-500/30">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">
                        {address ? address.slice(2, 4).toUpperCase() : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{shortAddr(address!)}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-teal-500" /> Verified wallet
                      </p>
                    </div>
                    <Separator />
                    <div className="w-full grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="font-bold text-sm">{posts.filter(p => p.authorAddress.toLowerCase() === address?.toLowerCase()).length}</p>
                        <p className="text-xs text-gray-500">Posts</p>
                      </div>
                      <div><p className="font-bold text-sm">—</p><p className="text-xs text-gray-500">Following</p></div>
                      <div><p className="font-bold text-sm">—</p><p className="text-xs text-gray-500">Followers</p></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <Card className="mb-4">
              <CardContent className="p-3 space-y-1">
                {[
                  { icon: <Users className="h-4 w-4" />, label: "Feed", active: filter === "all", onClick: () => setFilter("all") },
                  { icon: <Trophy className="h-4 w-4" />, label: "Achievements", active: filter === "achievement", onClick: () => setFilter("achievement") },
                  { icon: <Zap className="h-4 w-4" />, label: "Earnings", active: filter === "earning", onClick: () => setFilter("earning") },
                  { icon: <TrendingUp className="h-4 w-4" />, label: "Trending", active: false, onClick: () => {} },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.icon}{item.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Games — Coming Soon */}
            <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="h-4 w-4 text-teal-600" />
                  <p className="font-semibold text-sm">Arena Games</p>
                  <Badge className="text-xs bg-teal-600 text-white ml-auto">Soon</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Compete in skill-based games, earn rewards, and climb the Arena leaderboard.
                </p>
                <div className="mt-3 space-y-2">
                  {["Trivia Blitz", "Code Duel", "Design Sprint"].map(game => (
                    <div key={game} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{game}</span>
                      <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* ── Main feed — ONLY this scrolls ── */}
          <main className="flex-1 min-w-0 py-6 overflow-y-auto scrollbar-none">

            {/* Compose box */}
            {isConnected && (
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-teal-100 text-teal-700 text-xs font-bold">
                        {address ? address.slice(2, 4).toUpperCase() : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex-1 text-left px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Share an achievement or earning…
                    </button>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-around">
                    {[
                      { icon: <Trophy className="h-4 w-4 text-purple-500" />, label: "Achievement" },
                      { icon: <Zap className="h-4 w-4 text-yellow-500" />, label: "Earning" },
                      { icon: <Link2 className="h-4 w-4 text-blue-500" />, label: "Proof" },
                      { icon: <ImagePlus className="h-4 w-4 text-green-500" />, label: "Media" },
                    ].map(a => (
                      <button key={a.label} onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 text-xs text-gray-500 hover:text-teal-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20">
                        {a.icon}{a.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mobile filter pills */}
            <div className="flex sm:hidden gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
              {(["all", "achievement", "earning"] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    filter === f
                      ? "bg-teal-600 text-white border-teal-600"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {f === "all" ? "All" : f === "achievement" ? "🏆 Achievements" : "⚡ Earnings"}
                </button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center text-gray-500 dark:text-gray-400">
                  <Swords className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-semibold">No posts yet</p>
                  <p className="text-sm mt-1">Be the first to share in the Arena!</p>
                  {isConnected && (
                    <Button className="mt-4 bg-teal-600 hover:bg-teal-700" onClick={() => setShowCreateModal(true)}>
                      Create Post
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filtered.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <PostCard post={post} onUpdate={handlePostUpdate} />
                  </motion.div>
                ))}
                {hasMore && (
                  <div className="flex justify-center pt-2 pb-6">
                    <Button variant="outline" onClick={() => loadPosts()} disabled={loadingMore}>
                      {loadingMore && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Load more
                    </Button>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* ── Right sidebar — sticky, scrolls its own content, stops at bottom ── */}
          <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 py-6 overflow-y-auto scrollbar-none">

            {/* Arena Stats */}
            <Card className="mb-4">
              <CardContent className="p-4 space-y-3">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-teal-600" />Arena Stats
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Total Posts",     value: posts.length },
                    { label: "Achievements",    value: posts.filter(p => p.type === "achievement").length },
                    { label: "Earnings Shared", value: posts.filter(p => p.type === "earning").length },
                    { label: "Total Likes",     value: posts.reduce((acc, p) => acc + p.likes.length, 0) },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
                      <span className="font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending */}
            <Card className="mb-4">
              <CardContent className="p-4 space-y-3">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-teal-600" />Trending
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-full cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Builders to Follow */}
            <Card className="mb-4">
              <CardContent className="p-4 space-y-3">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-600" />Builders to Follow
                </p>
                <div className="space-y-3">
                  {WHO_TO_FOLLOW.map(u => (
                    <div key={u.address} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={u.avatar} />
                          <AvatarFallback className="text-xs">{u.username.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{u.username}</p>
                          <p className="text-xs text-gray-500 font-mono">{u.address}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs flex-shrink-0">Follow</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Proof of ownership */}
            <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold text-sm flex items-center gap-2 text-teal-700 dark:text-teal-400">
                  <ShieldCheck className="h-4 w-4" />Proof of Ownership
                </p>
                <p className="text-xs text-teal-700/80 dark:text-teal-400/80 leading-relaxed">
                  Every post is signed by your wallet. The 🛡 badge means the post is cryptographically verified — no one can post as you.
                </p>
              </CardContent>
            </Card>

          </aside>

        </div>
      </div>

      <CreatePostModal open={showCreateModal} onOpenChange={setShowCreateModal} onCreated={handlePostCreated} />
    </div>
  )
}
