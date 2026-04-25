import axios, { type AxiosInstance } from "axios"
import BASE_URL from "./baseUrl"

export interface LeaderboardUser {
  id: string
  username: string
  walletAddress: string
  profileImage: string
  totalEarnings: string
  challengesCompleted: number
  reputation: number
  badges: number
  rank: number
  skillCategories: string[]
  recentActivity: string
  joinedAt: string
}

interface LeaderboardResponse {
  leaderboard: LeaderboardUser[]
  total: number
  timeframe: string
  category: string
}

class LeaderboardService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    })
  }

  public async fetchLeaderboard(filters?: {
    category?: string
    timeframe?: string
    limit?: number
  }): Promise<LeaderboardUser[]> {
    const params = new URLSearchParams()
    if (filters?.category) params.append("category", filters.category)
    if (filters?.timeframe) params.append("timeframe", filters.timeframe)
    if (filters?.limit) params.append("limit", filters.limit.toString())

    const response = await this.api.get<LeaderboardResponse>(`/leaderboard?${params.toString()}`)
    return response.data.leaderboard
  }
}

const leaderboardService = new LeaderboardService()
export default leaderboardService
