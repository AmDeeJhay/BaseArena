import axios, { type AxiosInstance } from "axios"
import BASE_URL from "./baseUrl"
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
  {
    id: "mock-2",
    authorAddress: "0xabc123def456abc123def456abc123def456abc1",
    authorUsername: "Web3Dev",
    authorAvatar: "/placeholder.svg",
    content: "Earned 0.05 ETH from the Smart Contract Security Audit challenge. This platform is the real deal — proof is on-chain 💎",
    type: "earning",
    signature: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    contentHash: "xyz789",
    earnedAmount: "0.05 ETH",
    challengeTitle: "Smart Contract Security Audit",
    txHash: "0x4e3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3",
    likes: ["0x111", "0x222", "0x333"],
    comments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mock-3",
    authorAddress: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    authorUsername: "UIWizard",
    authorAvatar: "/placeholder.svg",
    content: "Working on a new DeFi dashboard design for the upcoming challenge. Anyone want to collaborate? Drop a comment 👇",
    type: "general",
    signature: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8",
    contentHash: "qrs456",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

class ArenaService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    })
  }

  async fetchPosts(page = 1, limit = 20): Promise<ArenaPost[]> {
    try {
      const res = await this.api.get<{ posts: ArenaPost[] }>(`/arena/posts?page=${page}&limit=${limit}`)
      return res.data.posts
    } catch {
      return page === 1 ? MOCK_POSTS : []
    }
  }

  async createPost(payload: CreatePostPayload): Promise<ArenaPost> {
    try {
      const res = await this.api.post<ArenaPost>("/arena/posts", payload)
      return res.data
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
      await this.api.post(`/arena/posts/${postId}/like`, { address, signature })
    } catch { /* optimistic update handled in UI */ }
  }

  async addComment(postId: string, content: string, authorAddress: string, signature: string): Promise<ArenaComment> {
    try {
      const res = await this.api.post<ArenaComment>(`/arena/posts/${postId}/comments`, { content, authorAddress, signature })
      return res.data
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
      await this.api.delete(`/arena/posts/${postId}`, { data: { address, signature } })
    } catch { /* silent */ }
  }
}

const arenaService = new ArenaService()
export default arenaService
