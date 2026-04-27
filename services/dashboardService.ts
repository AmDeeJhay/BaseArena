import { userService, challengeService, submissionService, badgeService } from "@/lib/supabase-service"
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
  async fetchUserData(userId: string): Promise<UserData> {
    const user = await userService.getUserById(userId)
    const badges = await badgeService.getUserBadges(userId)
    const submissions = await submissionService.getSubmissionsByUser(userId)
    const createdChallenges = await challengeService.getChallengesByCreator(userId)

    return {
      id: user.id,
      walletAddress: user.wallet_address,
      username: user.username,
      email: user.email || "",
      profileImage: user.profile_image || "",
      bio: user.bio || "",
      skillCategories: user.skill_categories || [],
      totalEarnings: user.total_earnings.toString(),
      reputation: user.reputation,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      badges: badges.map((b: any) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        earnedAt: b.earnedAt,
        nftTokenId: b.nft_token_id,
        imageUrl: b.image_url,
      })),
      submissions: submissions.map((s: any) => ({
        id: s.id,
        challengeId: s.challenge_id,
        status: s.status,
        submittedAt: s.submitted_at,
        score: s.score,
        feedback: s.feedback,
      })),
      createdChallenges: createdChallenges.map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        difficulty: c.difficulty,
        reward: c.reward,
        deadline: c.deadline,
        requirements: c.requirements,
        creatorId: c.creator_id,
        status: c.status,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
    }
  }

  async fetchUserByWallet(walletAddress: string): Promise<UserData | null> {
    try {
      const user = await userService.getUserByWallet(walletAddress)
      if (!user) return null
      return await this.fetchUserData(user.id)
    } catch {
      return null
    }
  }

  async updateUserData(userId: string, updates: Partial<UserData>): Promise<UserData> {
    const updateData: any = {}

    if (updates.username) updateData.username = updates.username
    if (updates.email) updateData.email = updates.email
    if (updates.bio) updateData.bio = updates.bio
    if (updates.profileImage) updateData.profile_image = updates.profileImage
    if (updates.skillCategories) updateData.skill_categories = updates.skillCategories
    if (updates.totalEarnings) updateData.total_earnings = updates.totalEarnings
    if (updates.reputation !== undefined) updateData.reputation = updates.reputation

    await userService.updateUser(userId, updateData)
    return this.fetchUserData(userId)
  }
}

const dashboardService = new DashboardService()
export default dashboardService
