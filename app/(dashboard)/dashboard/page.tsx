"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Calendar, CheckCircle, Code, FileText, Paintbrush, Zap, Trophy, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import RecentActivities from "@/components/dashboard/recent-activities"
import RecentEarners from "@/components/dashboard/recent-earners"
import { useEffect, useState } from "react"
import dashboardService from "@/services/dashboardService"
import useUIStore from "@/store/useUIStore"
import type { Challenge } from "@/types/challenges"
import { useWallet } from "@/hooks/use-wallet"

import type { UserData } from "@/services/dashboardService"

const formatCurrency = (amount: string | number) => {
  const n = typeof amount === "number" ? amount : Number.parseFloat(amount)
  return isNaN(n) ? "0.0000 ETH" : `${n.toFixed(4)} ETH`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "frontend":
      return <Paintbrush className="h-5 w-5" />
    case "backend":
      return <Code className="h-5 w-5" />
    case "blockchain":
      return <Zap className="h-5 w-5" />
    case "smart_contracts":
      return <Code className="h-5 w-5" />
    case "devops":
      return <FileText className="h-5 w-5" />
    default:
      return <Code className="h-5 w-5" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "frontend":
      return { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-600 dark:text-teal-400" }
    case "backend":
      return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" }
    case "blockchain":
      return { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" }
    case "smart_contracts":
      return { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" }
    case "devops":
      return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" }
    default:
      return { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-600 dark:text-gray-400" }
  }
}

const getDifficultyVariant = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "default"
    case "intermediate":
      return "secondary"
    case "advanced":
      return "destructive"
    default:
      return "outline"
  }
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const { loading, setLoading, setError, error } = useUIStore()
  const { address } = useWallet()

  useEffect(() => {
    if (!address) return
    const loadUserData = async () => {
      setLoading(true)
      setError(null)
      const data = await dashboardService.fetchUserByWallet(address)
      setUserData(data)
      setLoading(false)
    }
    loadUserData()
  }, [address, setLoading, setError])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!loading && !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex justify-center">
        <div className="w-full max-w-7xl px-4 py-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Welcome! Connect your wallet or complete your profile to get started.</p>
            </div>
            <Link href="/challenges">
              <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg px-6 py-3 text-lg">
                Browse Challenges <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {["Challenges Completed", "Total Earned", "NFT Badges", "Active Challenges"].map((title, i) => (
              <Card key={i} className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                  <p className="text-3xl font-bold mt-1">—</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><RecentActivities /></div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 h-64 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Recent Earners</h2>
              <div className="flex-1 overflow-hidden relative"><div className="absolute inset-0"><RecentEarners scrollMode="vertical" /></div></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const activeChallenges = userData?.createdChallenges
    .filter((challenge) => challenge.status !== "completed")
    .slice(0, 3)

  const completedSubmissions = userData?.submissions.filter((sub) => sub.status === "completed")

  const stats = [
    {
      title: "Challenges Completed",
      value: Array.isArray(completedSubmissions) ? completedSubmissions.length.toString() : "0",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      iconBg: "bg-green-50 dark:bg-green-900/20",
      change: Array.isArray(completedSubmissions)
        ? `+${
            completedSubmissions.filter((sub) => {
              const submissionDate = new Date(sub?.submittedAt ?? 0)
              const oneMonthAgo = new Date()
              oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
              return submissionDate > oneMonthAgo
            }).length
          } this month`
        : "0 this month",
      trend: "up" as const,
    },
    {
      title: "Total Earned",
      value: formatCurrency(userData?.totalEarnings ?? "0"),
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      iconBg: "bg-yellow-50 dark:bg-yellow-900/20",
      change: "View transactions",
      trend: "neutral" as const,
    },
    {
      title: "NFT Badges",
      value: Array.isArray(userData?.badges) ? userData.badges.length.toString() : "0",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      iconBg: "bg-purple-50 dark:bg-purple-900/20",
      change: Array.isArray(userData?.badges) ? `${userData.badges.length} earned` : "0 earned",
      trend: "up" as const,
    },
    {
      title: "Active Challenges",
      value: Array.isArray(activeChallenges) ? activeChallenges.length.toString() : "0",
      icon: <Code className="h-5 w-5 text-blue-500" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      change: (() => {
        if (!Array.isArray(activeChallenges)) return "On track"
        const upcomingCount = activeChallenges.filter(
          (c) => c.deadline && new Date(c.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ).length
        return upcomingCount > 0 ? `${upcomingCount} due soon` : "On track"
      })(),
      trend: "neutral" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex justify-center">
      <div className="w-full max-w-7xl px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Welcome back, {userData?.username}! Track your progress and find new challenges.
            </p>
          </div>
          <Link href="/challenges">
            <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg px-6 py-3 text-lg">
              Browse Challenges
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20">
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${stat.iconBg}`}>
                      {stat.icon}
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp
                        className={`h-3 w-3 ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      />
                      <div
                        className={`text-xs font-medium ${
                          stat.trend === "up"
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active Challenges</TabsTrigger>
                <TabsTrigger value="created">Created Challenges</TabsTrigger>
                <TabsTrigger value="badges">NFT Badges</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Your Active Challenges</CardTitle>
                    <CardDescription>Challenges you're currently working on.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeChallenges?.length === 0 ? (
                      <div className="text-center py-8">
                        <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No active challenges yet.</p>
                        <Link href="/challenges">
                          <Button className="mt-4 bg-teal-600 hover:bg-teal-700">Browse Challenges</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeChallenges?.map((challenge) => {
                          const categoryColors = getCategoryColor(challenge.category)
                          return (
                            <motion.div
                              key={challenge.id}
                              whileHover={{ x: 5 }}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-xl ${categoryColors.bg} flex items-center justify-center`}
                                >
                                  <div className={categoryColors.text}>{getCategoryIcon(challenge.category)}</div>
                                </div>
                                <div>
                                  <h3 className="font-medium">{challenge.title}</h3>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge variant="outline" className="capitalize text-xs">
                                      {challenge.category.replace("_", " ")}
                                    </Badge>
                                    <Badge
                                      variant={getDifficultyVariant(challenge.difficulty)}
                                      className="capitalize text-xs"
                                    >
                                      {challenge.difficulty}
                                    </Badge>
                                    <div className="flex items-center text-yellow-500 space-x-1">
                                      <Zap className="h-3.5 w-3.5" />
                                      <span className="text-xs font-medium">{formatCurrency(challenge?.reward)}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {challenge.status}
                                    </Badge>
                                    {challenge.deadline && (
                                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                                        <Calendar className="h-3.5 w-3.5 mr-1" />
                                        <span>Due {formatDate(challenge.deadline)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/challenges/${challenge.id}`}>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </Link>
                                <Link href={`/challenges/${challenge.id}/submit`}>
                                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                    Submit
                                  </Button>
                                </Link>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="created" className="mt-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Created Challenges</CardTitle>
                    <CardDescription>Challenges you've created for the community.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userData?.createdChallenges.length === 0 ? (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">You haven't created any challenges yet.</p>
                        <Link href="/challenges/create">
                          <Button className="mt-4 bg-teal-600 hover:bg-teal-700">Create Challenge</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userData?.createdChallenges.map((challenge) => {
                          const categoryColors = getCategoryColor(challenge.category)
                          return (
                            <div key={challenge.id} className="flex items-start gap-4 p-4 border rounded-lg">
                              <div
                                className={`w-12 h-12 rounded-xl ${categoryColors.bg} flex items-center justify-center`}
                              >
                                <div className={categoryColors.text}>{getCategoryIcon(challenge.category)}</div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium">{challenge.title}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="capitalize text-xs">
                                      {challenge.status}
                                    </Badge>
                                    <Badge
                                      variant={getDifficultyVariant(challenge.difficulty)}
                                      className="capitalize text-xs"
                                    >
                                      {challenge.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {challenge.description}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Created on {formatDate(challenge.createdAt)}
                                  </span>
                                  <div className="flex items-center text-yellow-500 space-x-1">
                                    <Zap className="h-3.5 w-3.5" />
                                    <span className="text-sm font-medium">{formatCurrency(challenge?.reward)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="badges" className="mt-6">
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 pb-6">
                    <CardTitle className="text-xl">Your NFT Badges</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Skill badges you've earned by completing challenges.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {userData?.badges.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Award className="h-10 w-10 text-purple-500" />
                        </div>
                        <p className="text-gray-500 text-lg mb-6">No badges earned yet.</p>
                        <p className="text-sm text-gray-400 mt-2">Complete challenges to earn skill badges!</p>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userData?.badges.map((badge, index) => (
                          <Card
                            key={badge.id}
                            className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50"
                          >
                            <CardContent className="p-6 flex flex-col items-center text-center">
                              <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                              </div>
                              <h3 className="font-medium text-lg text-gray-900 dark:text-white">{badge.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Earned on {formatDate(badge.earnedAt)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                {badge.description}
                              </p>
                              <Button variant="outline" size="sm" className="mt-4">
                                View on Chain
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Recent Earners with vertical scroll animation */}
          <div className="space-y-6 flex flex-col">
            <RecentActivities />
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 h-64 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Recent Earners</h2>
              <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0">
                  <RecentEarners scrollMode="vertical" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
