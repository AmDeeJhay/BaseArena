import axios, { type AxiosInstance, type AxiosError } from "axios"
import BASE_URL from "./baseUrl"
import type { Challenge } from "@/types/challenges"
import { challengesData } from "@/lib/challenges-data"

class ChallengeService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 8000,
      headers: { "Content-Type": "application/json" },
    })

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.warn("API request failed:", error.message)
        return Promise.reject(error)
      },
    )
  }

  public async fetchChallenges(): Promise<Challenge[]> {
    try {
      const response = await this.api.get<Challenge[]>("/challenges")
      return response.data
    } catch {
      return challengesData
    }
  }

  public async fetchSingleChallenge(challengeId: string): Promise<Challenge | null> {
    try {
      const response = await this.api.get<Challenge>(`/challenges/${challengeId}`)
      return response.data
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

  public createChallenge(data: any) { return this.api.post("/challenges", data) }
  public getAllChallenges() { return this.api.get("/challenges") }
  public getChallengeById(id: string) { return this.api.get(`/challenges/${id}`) }
  public updateChallenge(id: string, data: any) { return this.api.patch(`/challenges/${id}`, data) }
  public deleteChallenge(id: string) { return this.api.delete(`/challenges/${id}`) }
}

const challengeService = new ChallengeService()
export { ChallengeService, challengeService }
export default challengeService
