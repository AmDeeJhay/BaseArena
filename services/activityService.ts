import { activityService as supabaseActivityService, userService } from "@/lib/supabase-service"

interface Activity {
  id: string
  type: "challenge_completed" | "badge_earned" | "challenge_submitted" | "user_joined" | "milestone_reached"
  userId: string
  username: string
  userAvatar: string
  challengeId?: string
  challengeTitle?: string
  badgeId?: string
  badgeName?: string
  description: string
  reward?: string
  timestamp: string
  metadata?: Record<string, any>
}

interface ActivitiesResponse {
  activities: Activity[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// Mock activities for fallback
const mockActivities: Activity[] = [
  {
    id: "activity-1",
    type: "challenge_completed",
    userId: "user-1",
    username: "CryptoMaster",
    userAvatar: "/placeholder.svg?height=32&width=32",
    challengeId: "1",
    challengeTitle: "Build a Decentralized Exchange (DEX)",
    description: "completed the DEX challenge",
    reward: "500",
    timestamp: "2024-12-16T10:30:00Z",
    metadata: {
      score: 95,
      difficulty: "advanced",
    },
  },
  {
    id: "activity-2",
    type: "badge_earned",
    userId: "user-2",
    username: "ReactNinja",
    userAvatar: "/placeholder.svg?height=32&width=32",
    badgeId: "badge-frontend-master",
    badgeName: "Frontend Master",
    description: "earned the Frontend Master badge",
    timestamp: "2024-12-16T09:15:00Z",
    metadata: {
      badgeType: "skill",
      category: "frontend",
    },
  },
]

class ActivityService {
  async fetchActivities(filters?: {
    userId?: string
    type?: string
    limit?: number
    offset?: number
  }): Promise<Activity[]> {
    try {
      console.log("Fetching activities from Supabase...")

      const activities = await supabaseActivityService.getRecentActivities(filters?.limit || 50)

      // Transform activities with user data
      const enrichedActivities = await Promise.all(
        activities.map(async (activity: any) => {
          const user = await userService.getUserById(activity.user_id)
          return {
            id: activity.id,
            type: activity.type,
            userId: activity.user_id,
            username: user?.username || "Unknown",
            userAvatar: user?.profile_image || "/placeholder.svg",
            challengeId: activity.challenge_id,
            challengeTitle: activity.challengeTitle,
            badgeId: activity.badge_id,
            badgeName: activity.badgeName,
            description: activity.description,
            reward: activity.reward,
            timestamp: activity.created_at,
            metadata: activity.metadata,
          }
        })
      )

      // Apply filters
      let filtered = [...enrichedActivities]

      if (filters?.userId) {
        filtered = filtered.filter((activity) => activity.userId === filters.userId)
      }

      if (filters?.type) {
        filtered = filtered.filter((activity) => activity.type === filters.type)
      }

      // Apply pagination
      if (filters?.offset || filters?.limit) {
        const offset = filters.offset || 0
        const limit = filters.limit || filtered.length
        filtered = filtered.slice(offset, offset + limit)
      }

      console.log(`Successfully fetched ${filtered.length} activities from Supabase`)
      return filtered
    } catch (error) {
      console.warn("Supabase request failed, using fallback activities:", error)
      return mockActivities
    }
  }

  async createActivity(activityData: {
    type: Activity["type"]
    userId: string
    username: string
    description: string
    challengeId?: string
    challengeTitle?: string
    badgeId?: string
    badgeName?: string
    reward?: string
    metadata?: Record<string, any>
  }): Promise<Activity | null> {
    try {
      console.log("Creating new activity...")

      const activity = await supabaseActivityService.logActivity({
        user_id: activityData.userId,
        type: activityData.type,
        description: activityData.description,
        challenge_id: activityData.challengeId,
        badge_id: activityData.badgeId,
        reward: activityData.reward,
        metadata: activityData.metadata,
      })

      console.log(`Successfully created activity: ${activityData.description}`)

      return {
        id: activity.id,
        type: activity.type,
        userId: activity.user_id,
        username: activityData.username,
        userAvatar: "/placeholder.svg",
        challengeId: activity.challenge_id,
        challengeTitle: activityData.challengeTitle,
        badgeId: activity.badge_id,
        badgeName: activityData.badgeName,
        description: activity.description,
        reward: activity.reward,
        timestamp: activity.created_at,
        metadata: activity.metadata,
      }
    } catch (error) {
      console.error("Failed to create activity:", error)
      return null
    }
  }

  async checkApiHealth(): Promise<boolean> {
    try {
      const activities = await supabaseActivityService.getRecentActivities(1)
      return true
    } catch {
      return false
    }
  }
}

const activityService = new ActivityService()
export default activityService
