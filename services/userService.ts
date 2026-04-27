import { userService as supabaseUserService } from "@/lib/supabase-service"

export const userService = {
  async createUser(data: any) {
    try {
      const user = await supabaseUserService.createUser(data)
      return { data: user }
    } catch (error) {
      return { error }
    }
  },

  async getAllUsers() {
    try {
      const users = await supabaseUserService.getAllUsers()
      return { data: users }
    } catch (error) {
      return { error }
    }
  },

  async getUserById(id: string) {
    try {
      const user = await supabaseUserService.getUserById(id)
      if (!user) throw new Error("User not found")
      return { data: user }
    } catch (error) {
      return { error }
    }
  },

  async getUserByWallet(walletAddress: string) {
    try {
      const user = await supabaseUserService.getUserByWallet(walletAddress)
      if (!user) throw new Error("User not found")
      return { data: user }
    } catch (error) {
      return { error }
    }
  },

  async updateUser(id: string, data: any) {
    try {
      const user = await supabaseUserService.updateUser(id, data)
      return { data: user }
    } catch (error) {
      return { error }
    }
  },

  async deleteUser(id: string) {
    try {
      await supabaseUserService.deleteUser(id)
      return { data: { success: true } }
    } catch (error) {
      return { error }
    }
  },
}
