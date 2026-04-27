import { challengeService as supabaseChallengeService } from "@/lib/supabase-service"
import type { Challenge } from "@/types/challenges"
import { challengesData } from "@/lib/challenges-data"

class ChallengeService {
  public async fetchChallenges(): Promise<Challenge[]> {
    try {
      const challenges = await supabaseChallengeService.getAllChallenges()
      return challenges as any[]
    } catch {
      return challengesData
    }
  }

  public async fetchSingleChallenge(challengeId: string): Promise<Challenge | null> {
    try {
      const challenge = await supabaseChallengeService.getChallengeById(challengeId)
      return challenge as any
    } catch {
      const numericId = Number.parseInt(challengeId, 10)
      return challengesData.find(
        (c) => c.id === numericId || c.id.toString() === challengeId
      ) ?? null
    }
  }

  public getAvailableChallengeIds(): string[] {
    return challengesData.map((c) => c.id.toString())
  }

  public async createChallenge(data: any) {
    try {
      const challenge = await supabaseChallengeService.createChallenge(data)
      return { data: challenge }
    } catch (error) {
      return { error }
    }
  }

  public async getAllChallenges() {
    try {
      const challenges = await supabaseChallengeService.getAllChallenges()
      return { data: challenges }
    } catch (error) {
      return { error }
    }
  }

  public async getChallengeById(id: string) {
    try {
      const challenge = await supabaseChallengeService.getChallengeById(id)
      if (!challenge) throw new Error("Challenge not found")
      return { data: challenge }
    } catch (error) {
      return { error }
    }
  }

  public async updateChallenge(id: string, data: any) {
    try {
      const challenge = await supabaseChallengeService.updateChallenge(id, data)
      return { data: challenge }
    } catch (error) {
      return { error }
    }
  }

  public async deleteChallenge(id: string) {
    try {
      await supabaseChallengeService.deleteChallenge(id)
      return { data: { success: true } }
    } catch (error) {
      return { error }
    }
  }
}

const challengeService = new ChallengeService()
export { ChallengeService, challengeService }
export default challengeService
