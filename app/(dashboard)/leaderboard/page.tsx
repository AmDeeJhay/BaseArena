"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Zap, TrendingUp, Calendar, Users } from "lucide-react"
import { motion } from "framer-motion"
import leaderboardService from "@/services/leaderboardService"
import { WalletGuard } from "@/components/wallet-guard"

interface LeaderboardUser {
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

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTimeframe, setCurrentTimeframe] = useState("all-time")
  const [currentCategory, setCurrentCategory] = useState("all")

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await leaderboardService.fetchLeaderboard({
          category: currentCategory,
          timeframe: currentTimeframe,
          limit: 50,
        })
        setLeaderboardData(data)
        console.log(`Loaded ${data.length} leaderboard entries`)
      } catch (err) {
        console.error("Error loading leaderboard:", err)
        setError("Unable to load leaderboard. Please try again later.")
        setLeaderboardData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [currentTimeframe, currentCategory])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const formatCurrency = (amount: string) => {
    return `${Number.parseFloat(amount).toFixed(4)} ETH`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  if (isLoading) {
    return (
      <WalletGuard message="Connect your wallet to view the leaderboard and see how you rank against other developers">
        <div className="space-y-4 p-4 max-w-7xl mx-auto">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </WalletGuard>
    )
  }

  return (
    <WalletGuard message="Connect your wallet to view the leaderboard and see how you rank against other developers">
      <div className="space-y-4 p-4 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Leaderboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            See how you rank against other developers in the BaseSkill community.
          </p>
        </div>

        <Tabs defaultValue="all-time" className="w-full" onValueChange={setCurrentTimeframe}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="all-time" className="text-xs">
                All Time
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">
                This Month
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">
                This Week
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant={currentCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentCategory("all")}
                className="text-xs"
              >
                All Skills
              </Button>
              <Button
                variant={currentCategory === "frontend" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentCategory("frontend")}
                className="text-xs"
              >
                Frontend
              </Button>
              <Button
                variant={currentCategory === "blockchain" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentCategory("blockchain")}
                className="text-xs"
              >
                Blockchain
              </Button>
              <Button
                variant={currentCategory === "backend" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentCategory("backend")}
                className="text-xs"
              >
                Backend
              </Button>
            </div>
          </div>

          <TabsContent value="all-time" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Performers - All Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-center py-6">
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} size="sm">
                      Try Again
                    </Button>
                  </div>
                )}

                {!error && leaderboardData.length === 0 && (
                  <div className="text-center py-6">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No leaderboard data available.</p>
                  </div>
                )}

                {!error && leaderboardData.length > 0 && (
                  <div className="space-y-3">
                    {leaderboardData.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                          user.rank <= 3
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8">{getRankIcon(user.rank)}</div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.username} />
                            <AvatarFallback className="text-xs">
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm truncate">{user.username}</h3>
                              {user.rank <= 3 && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  Top {user.rank}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex flex-wrap gap-1">
                                {user.skillCategories.slice(0, 2).map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs px-1 py-0">
                                    {skill}
                                  </Badge>
                                ))}
                                {user.skillCategories.length > 2 && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    +{user.skillCategories.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {user.recentActivity}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 text-right">
                          <div className="flex items-center text-yellow-500 gap-1">
                            <Zap className="h-3 w-3" />
                            <span className="text-sm font-medium">{formatCurrency(user.totalEarnings)}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>{user.challengesCompleted}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              <span>{user.badges}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>Joined {formatDate(user.joinedAt)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Top Performers - This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.slice(0, 10).map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8">{getRankIcon(index + 1)}</div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.username} />
                          <AvatarFallback className="text-xs">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm">{user.username}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.challengesCompleted} challenges completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-500 gap-1">
                          <Zap className="h-3 w-3" />
                          <span className="text-sm font-medium">{formatCurrency(user.totalEarnings)}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.reputation} reputation</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Medal className="h-5 w-5 text-green-500" />
                  Top Performers - This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.slice(0, 10).map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8">{getRankIcon(index + 1)}</div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.username} />
                          <AvatarFallback className="text-xs">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm">{user.username}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.recentActivity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-500 gap-1">
                          <Zap className="h-3 w-3" />
                          <span className="text-sm font-medium">{formatCurrency(user.totalEarnings)}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.badges} badges</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </WalletGuard>
  )
}
