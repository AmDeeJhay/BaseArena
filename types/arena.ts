export interface ArenaPost {
  id: string
  authorAddress: string
  authorUsername: string
  authorAvatar: string
  content: string
  type: "achievement" | "earning" | "general"
  // proof of ownership
  signature: string        // EIP-191 signature of content hash
  contentHash: string      // keccak256-like hash of content + address + timestamp
  // optional attached proof
  txHash?: string          // on-chain tx as proof (e.g. reward received)
  challengeTitle?: string
  earnedAmount?: string    // e.g. "0.05 ETH"
  // engagement
  likes: string[]          // array of wallet addresses that liked
  comments: ArenaComment[]
  createdAt: string
}

export interface ArenaComment {
  id: string
  authorAddress: string
  authorUsername: string
  authorAvatar: string
  content: string
  signature: string
  createdAt: string
}

export interface CreatePostPayload {
  content: string
  type: ArenaPost["type"]
  authorAddress: string
  signature: string
  contentHash: string
  txHash?: string
  challengeTitle?: string
  earnedAmount?: string
}
