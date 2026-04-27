import { userService, submissionService } from "@/lib/supabase-service"

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
  async fetchLeaderboard(filters?: {
    category?: string
    timeframe?: string
    limit?: number
  }): Promise<LeaderboardUser[]> {
    try {
      const users = await userService.getAllUsers()

      // Transform users to leaderboard format
      const leaderboardUsers: LeaderboardUser[] = await Promise.all(
        users.map(async (user: any, index: number) => {
          const submissions = await submissionService.getSubmissionsByUser(user.id)
          const completedCount = submissions.filter((s: any) => s.status === "completed").length

          return {
            id: user.id,
            username: user.username,
            walletAddress: user.wallet_address,
            profileImage: user.profile_image || "/placeholder.svg",
            totalEarnings: user.total_earnings.toString(),
            challengesCompleted: completedCount,
            reputation: user.reputation,
            badges: 0, // Would be fetched from badges table if needed
            rank: index + 1,
            skillCategories: user.skill_categories || [],
            recentActivity: new Date(user.updated_at).toLocaleDateString(),
            joinedAt: user.created_at,
          }
        })
      )

      // Sort by reputation then earnings
      leaderboardUsers.sort((a, b) => {
        if (b.reputation !== a.reputation) return b.reputation - a.reputation
        return parseFloat(b.totalEarnings) - parseFloat(a.totalEarnings)
      })

      // Update ranks
      leaderboardUsers.forEach((user, index) => {
        user.rank = index + 1
      })

      // Apply limit if specified
      const limit = filters?.limit || 50
      return leaderboardUsers.slice(0, limit)
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
      return []
    }
  }
}

const leaderboardService = new LeaderboardService()
export default leaderboardService
