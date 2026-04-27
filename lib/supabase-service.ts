import { supabase } from "@/lib/supabase"

// Types
export interface User {
    id: string
    wallet_address: string
    username: string
    email?: string
    profile_image?: string
    bio?: string
    skill_categories?: string[]
    total_earnings: string
    reputation: number
    created_at: string
    updated_at: string
}

export interface Challenge {
    id: string
    title: string
    description: string
    category: string
    difficulty: string
    reward: number
    deadline?: string
    requirements: any
    creator_id: string
    status: string
    created_at: string
    updated_at: string
}

export interface Submission {
    id: string
    challenge_id: string
    user_id: string
    status: string
    submitted_at: string
    score?: number
    feedback?: string
    submission_url?: string
    created_at: string
    updated_at: string
}

export interface Badge {
    id: string
    name: string
    description?: string
    image_url?: string
    nft_token_id?: string
    created_at: string
}

export interface UserBadge {
    id: string
    user_id: string
    badge_id: string
    earned_at: string
}

// Helper to check if supabase is initialized
const ensureSupabase = () => {
    if (!supabase) {
        throw new Error("Supabase not initialized. Check your .env.local file for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
    }
    return supabase
}

// User Service
export const userService = {
    async createUser(data: Partial<User>): Promise<User> {
        const client = ensureSupabase()
        const { data: user, error } = await client
            .from("users")
            .insert(data)
            .select()
            .single()

        if (error) throw error
        return user
    },

    async getUserById(id: string): Promise<User | null> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("users")
            .select("*")
            .eq("id", id)
            .single()

        if (error) return null
        return data
    },

    async getUserByWallet(walletAddress: string): Promise<User | null> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("users")
            .select("*")
            .eq("wallet_address", walletAddress)
            .single()

        if (error) return null
        return data
    },

    async getAllUsers(): Promise<User[]> {
        const client = ensureSupabase()
        const { data, error } = await client.from("users").select("*")
        if (error) throw error
        return data || []
    },

    async updateUser(id: string, updates: Partial<User>): Promise<User> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("users")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteUser(id: string): Promise<void> {
        const client = ensureSupabase()
        const { error } = await client.from("users").delete().eq("id", id)
        if (error) throw error
    },
}

// Challenge Service
export const challengeService = {
    async createChallenge(data: Partial<Challenge>): Promise<Challenge> {
        const client = ensureSupabase()
        const { data: challenge, error } = await client
            .from("challenges")
            .insert(data)
            .select()
            .single()

        if (error) throw error
        return challenge
    },

    async getChallengeById(id: string): Promise<Challenge | null> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("challenges")
            .select("*")
            .eq("id", id)
            .single()

        if (error) return null
        return data
    },

    async getAllChallenges(): Promise<Challenge[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("challenges")
            .select("*")
            .eq("status", "active")
            .order("created_at", { ascending: false })

        if (error) throw error
        return data || []
    },

    async getChallengesByCreator(creatorId: string): Promise<Challenge[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("challenges")
            .select("*")
            .eq("creator_id", creatorId)
            .order("created_at", { ascending: false })

        if (error) throw error
        return data || []
    },

    async updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("challenges")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteChallenge(id: string): Promise<void> {
        const client = ensureSupabase()
        const { error } = await client.from("challenges").delete().eq("id", id)
        if (error) throw error
    },
}

// Submission Service
export const submissionService = {
    async createSubmission(data: Partial<Submission>): Promise<Submission> {
        const client = ensureSupabase()
        const { data: submission, error } = await client
            .from("submissions")
            .insert(data)
            .select()
            .single()

        if (error) throw error
        return submission
    },

    async getSubmissionById(id: string): Promise<Submission | null> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("submissions")
            .select("*")
            .eq("id", id)
            .single()

        if (error) return null
        return data
    },

    async getSubmissionsByUser(userId: string): Promise<Submission[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("submissions")
            .select("*")
            .eq("user_id", userId)
            .order("submitted_at", { ascending: false })

        if (error) throw error
        return data || []
    },

    async getSubmissionsByChallenge(challengeId: string): Promise<Submission[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("submissions")
            .select("*")
            .eq("challenge_id", challengeId)
            .order("submitted_at", { ascending: false })

        if (error) throw error
        return data || []
    },

    async updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("submissions")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteSubmission(id: string): Promise<void> {
        const client = ensureSupabase()
        const { error } = await client.from("submissions").delete().eq("id", id)
        if (error) throw error
    },
}

// Badge Service
export const badgeService = {
    async createBadge(data: Partial<Badge>): Promise<Badge> {
        const client = ensureSupabase()
        const { data: badge, error } = await client
            .from("badges")
            .insert(data)
            .select()
            .single()

        if (error) throw error
        return badge
    },

    async getBadgeById(id: string): Promise<Badge | null> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("badges")
            .select("*")
            .eq("id", id)
            .single()

        if (error) return null
        return data
    },

    async getAllBadges(): Promise<Badge[]> {
        const client = ensureSupabase()
        const { data, error } = await client.from("badges").select("*")
        if (error) throw error
        return data || []
    },

    async getUserBadges(userId: string): Promise<(Badge & { earnedAt: string })[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("user_badges")
            .select("badges:badge_id(*), earned_at")
            .eq("user_id", userId)

        if (error) throw error
        return data?.map((item: any) => ({ ...item.badges, earnedAt: item.earned_at })) || []
    },

    async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("user_badges")
            .insert({ user_id: userId, badge_id: badgeId })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteBadge(id: string): Promise<void> {
        const client = ensureSupabase()
        const { error } = await client.from("badges").delete().eq("id", id)
        if (error) throw error
    },
}

// Arena Post Service
export const arenaService = {
    async createPost(data: any): Promise<any> {
        const client = ensureSupabase()
        const { data: post, error } = await client
            .from("arena_posts")
            .insert(data)
            .select()
            .single()

        if (error) throw error
        return post
    },

    async getPostById(id: string): Promise<any> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("arena_posts")
            .select("*, author:author_address(username, profile_image)")
            .eq("id", id)
            .single()

        if (error) return null
        return data
    },

    async getAllPosts(limit = 50): Promise<any[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("arena_posts")
            .select("*, author:author_address(id, username, profile_image)")
            .order("created_at", { ascending: false })
            .limit(limit)

        if (error) throw error
        return data || []
    },

    async getPostsByAuthor(authorAddress: string): Promise<any[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("arena_posts")
            .select("*")
            .eq("author_address", authorAddress)
            .order("created_at", { ascending: false })

        if (error) throw error
        return data || []
    },

    async addComment(postId: string, data: any): Promise<any> {
        const client = ensureSupabase()
        const { data: comment, error } = await client
            .from("arena_comments")
            .insert({ post_id: postId, ...data })
            .select()
            .single()

        if (error) throw error
        return comment
    },

    async likePost(postId: string, userAddress: string): Promise<void> {
        const client = ensureSupabase()
        const { error } = await client
            .from("arena_likes")
            .insert({ post_id: postId, user_address: userAddress })

        if (error && error.code !== "23505") throw error
    },

    async unlikePost(postId: string, userAddress: string): Promise<void> {
        const client = ensureSupabase()
        const { error } = await client
            .from("arena_likes")
            .delete()
            .eq("post_id", postId)
            .eq("user_address", userAddress)

        if (error) throw error
    },

    async deletePost(id: string): Promise<void> {
        const client = ensureSupabase()
        const { error } = await client.from("arena_posts").delete().eq("id", id)
        if (error) throw error
    },
}

// Activity Service
export const activityService = {
    async logActivity(data: any): Promise<any> {
        const client = ensureSupabase()
        const { data: activity, error } = await client
            .from("activities")
            .insert(data)
            .select()
            .single()

        if (error) throw error
        return activity
    },

    async getUserActivities(userId: string, limit = 50): Promise<any[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("activities")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit)

        if (error) throw error
        return data || []
    },

    async getRecentActivities(limit = 50): Promise<any[]> {
        const client = ensureSupabase()
        const { data, error } = await client
            .from("activities")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit)

        if (error) throw error
        return data || []
    },
}
