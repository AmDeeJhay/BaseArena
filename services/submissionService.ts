import { submissionService as supabaseSubmissionService } from "@/lib/supabase-service"

export const submissionService = {
  async createSubmission(data: any) {
    try {
      const submission = await supabaseSubmissionService.createSubmission(data)
      return { data: submission }
    } catch (error) {
      return { error }
    }
  },

  async getAllSubmissions() {
    try {
      return { data: [] }
    } catch (error) {
      return { error }
    }
  },

  async getSubmissionById(id: string) {
    try {
      const submission = await supabaseSubmissionService.getSubmissionById(id)
      if (!submission) throw new Error("Submission not found")
      return { data: submission }
    } catch (error) {
      return { error }
    }
  },

  async getSubmissionsByChallenge(challengeId: string) {
    try {
      const submissions = await supabaseSubmissionService.getSubmissionsByChallenge(challengeId)
      return { data: submissions }
    } catch (error) {
      return { error }
    }
  },

  async getSubmissionsByUser(userId: string) {
    try {
      const submissions = await supabaseSubmissionService.getSubmissionsByUser(userId)
      return { data: submissions }
    } catch (error) {
      return { error }
    }
  },

  async updateSubmission(id: string, data: any) {
    try {
      const submission = await supabaseSubmissionService.updateSubmission(id, data)
      return { data: submission }
    } catch (error) {
      return { error }
    }
  },

  async deleteSubmission(id: string) {
    try {
      await supabaseSubmissionService.deleteSubmission(id)
      return { data: { success: true } }
    } catch (error) {
      return { error }
    }
  },
}
