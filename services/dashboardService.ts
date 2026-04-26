import axios, { type AxiosInstance } from "axios"
import BASE_URL from "./baseUrl"
import type { Challenge } from "@/types/challenges"

interface BadgeType {
  id: string
  name: string
  description: string
  earnedAt: string
  nftTokenId?: string
  imageUrl?: string
}

interface Submission {
  id: string
  challengeId: string
  status: string
  submittedAt: string
  score?: number
  feedback?: string
}

export interface UserData {
  id: string
  walletAddress: string
  username: string
  email: string
  profileImage: string
  bio: string
  skillCategories: string[]
  totalEarnings: string
  reputation: number
  createdAt: string
  updatedAt: string
  badges: BadgeType[]
  submissions: Submission[]
  createdChallenges: Challenge[]
}

class DashboardService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    })
  }

  public async fetchUserData(userId: string): Promise<UserData> {
    const response = await this.api.get<UserData>(`/users/${userId}`)
    return response.data
  }

  public async fetchUserByWallet(walletAddress: string): Promise<UserData | null> {
    try {
      const response = await this.api.get<UserData>(`/users/wallet/${walletAddress}`)
      return response.data
    } catch {
      return null
    }
  }

  public async updateUserData(userId: string, updates: Partial<UserData>): Promise<UserData> {
    const response = await this.api.put<UserData>(`/users/${userId}`, updates)
    return response.data
  }
}

const dashboardService = new DashboardService()
export default dashboardService
