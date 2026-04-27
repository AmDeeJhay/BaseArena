import { badgeService as supabaseBadgeService } from "@/lib/supabase-service"

export const badgeService = {
  async createBadge(data: any) {
    try {
      const badge = await supabaseBadgeService.createBadge(data)
      return { data: badge }
    } catch (error) {
      return { error }
    }
  },

  async getAllBadges() {
    try {
      const badges = await supabaseBadgeService.getAllBadges()
      return { data: badges }
    } catch (error) {
      return { error }
    }
  },

  async getBadgeById(id: string) {
    try {
      const badge = await supabaseBadgeService.getBadgeById(id)
      if (!badge) throw new Error("Badge not found")
      return { data: badge }
    } catch (error) {
      return { error }
    }
  },

  async getBadgesByUser(userId: string) {
    try {
      const badges = await supabaseBadgeService.getUserBadges(userId)
      return { data: badges }
    } catch (error) {
      return { error }
    }
  },

  async mintBadge(data: any) {
    try {
      const userBadge = await supabaseBadgeService.awardBadge(data.userId, data.badgeId)
      return { data: userBadge }
    } catch (error) {
      return { error }
    }
  },

  async deleteBadge(id: string) {
    try {
      await supabaseBadgeService.deleteBadge(id)
      return { data: { success: true } }
    } catch (error) {
      return { error }
    }
  },
}
