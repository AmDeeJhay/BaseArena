import { arenaService as supabaseArenaService } from "@/lib/supabase-service"
import type { ArenaPost, ArenaComment, CreatePostPayload } from "@/types/arena"

export async function signMessage(message: string): Promise<string> {
  const provider = (window as any).ethereum
  if (!provider) throw new Error("No wallet connected")
  const accounts: string[] = await provider.request({ method: "eth_accounts" })
  if (!accounts.length) throw new Error("No accounts found")
  return provider.request({ method: "personal_sign", params: [message, accounts[0]] })
}

export function buildContentHash(content: string, address: string, timestamp: string): string {
  const raw = `${address.toLowerCase()}:${timestamp}:${content}`
  return btoa(encodeURIComponent(raw)).slice(0, 64)
}

// Local mock posts shown when backend is unavailable
const MOCK_POSTS: ArenaPost[] = [
  {
    id: "mock-1",
    authorAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    authorUsername: "CryptoBuilder",
    authorAvatar: "/placeholder.svg",
    content: "Just completed the DEX Order Book challenge on Base! Took 3 weeks but the smart contract is live. Huge shoutout to the community for the feedback 🚀",
    type: "achievement",
    signature: "0x4a8f2c1d3e5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    contentHash: "abc123def456",
    challengeTitle: "Build a DEX Order Book on Base",
    likes: ["0xabc", "0xdef"],
    comments: [
      {
        id: "c1",
        authorAddress: "0xabc123",
        authorUsername: "ReactNinja",
        authorAvatar: "/placeholder.svg",
        content: "Congrats! The implementation looks clean 🔥",
        signature: "0xsig",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

class ArenaService {
  async fetchPosts(page = 1, limit = 20): Promise<ArenaPost[]> {
    try {
      const posts = await supabaseArenaService.getAllPosts(limit)
      return posts || MOCK_POSTS
    } catch {
      return page === 1 ? MOCK_POSTS : []
    }
  }

  async createPost(payload: CreatePostPayload): Promise<ArenaPost> {
    try {
      const post = await supabaseArenaService.createPost({
        author_id: payload.authorAddress,
        content: payload.content,
        type: payload.type,
        signature: payload.signature,
        content_hash: payload.contentHash,
        tx_hash: payload.txHash,
        challenge_title: payload.challengeTitle,
        earned_amount: payload.earnedAmount,
      })

      return {
        id: post.id,
        authorAddress: payload.authorAddress,
        authorUsername: `${payload.authorAddress.slice(0, 6)}...${payload.authorAddress.slice(-4)}`,
        authorAvatar: "/placeholder.svg",
        content: payload.content,
        type: payload.type,
        signature: payload.signature,
        contentHash: payload.contentHash,
        txHash: payload.txHash,
        challengeTitle: payload.challengeTitle,
        earnedAmount: payload.earnedAmount,
        likes: [],
        comments: [],
        createdAt: post.created_at,
      }
    } catch {
      // Optimistic local post when backend is down
      return {
        id: `local-${Date.now()}`,
        authorAddress: payload.authorAddress,
        authorUsername: `${payload.authorAddress.slice(0, 6)}...${payload.authorAddress.slice(-4)}`,
        authorAvatar: "/placeholder.svg",
        content: payload.content,
        type: payload.type,
        signature: payload.signature,
        contentHash: payload.contentHash,
        txHash: payload.txHash,
        challengeTitle: payload.challengeTitle,
        earnedAmount: payload.earnedAmount,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      }
    }
  }

  async likePost(postId: string, address: string, signature: string): Promise<void> {
    try {
      await supabaseArenaService.likePost(postId, address)
    } catch {
      // optimistic update handled in UI
    }
  }

  async addComment(postId: string, content: string, authorAddress: string, signature: string): Promise<ArenaComment> {
    try {
      const comment = await supabaseArenaService.addComment(postId, {
        author_id: authorAddress,
        content,
        signature,
      })

      return {
        id: comment.id,
        authorAddress,
        authorUsername: `${authorAddress.slice(0, 6)}...${authorAddress.slice(-4)}`,
        authorAvatar: "/placeholder.svg",
        content,
        signature,
        createdAt: comment.created_at,
      }
    } catch {
      return {
        id: `local-${Date.now()}`,
        authorAddress,
        authorUsername: `${authorAddress.slice(0, 6)}...${authorAddress.slice(-4)}`,
        authorAvatar: "/placeholder.svg",
        content,
        signature,
        createdAt: new Date().toISOString(),
      }
    }
  }

  async deletePost(postId: string, address: string, signature: string): Promise<void> {
    try {
      await supabaseArenaService.deletePost(postId)
    } catch {
      // silent
    }
  }
}

const arenaService = new ArenaService()
export default arenaService
