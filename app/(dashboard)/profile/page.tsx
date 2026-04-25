"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Calendar,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Trophy,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { userService } from "@/services/userService"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Example: Fetch user by ID (replace '1' with actual user ID or logic)
    userService.getUserById("1")
      .then(res => setUser(res.data))
      .catch(err => setError("Failed to load user"))
      .finally(() => setLoading(false))
  }, [])

  const userStats = {
    totalEarnings: user?.totalEarnings || "1,250",
    challengesCompleted: user?.challengesCompleted || 8,
    skillsVerified: user?.skillsVerified || 12,
    rank: user?.rank || 47,
  }

  const completedChallenges = [
    {
      id: 1,
      title: "Build a DEX Order Book",
      category: "Development",
      reward: "0.05 ETH",
      completedAt: "2024-01-15",
      status: "Verified",
      rating: 5,
    },
    {
      id: 2,
      title: "Design a Mobile Wallet UI",
      category: "Design",
      reward: "0.03 ETH",
      completedAt: "2024-01-10",
      status: "Verified",
      rating: 4,
    },
    {
      id: 3,
      title: "Smart Contract Security Audit",
      category: "Security",
      reward: "0.06 ETH",
      completedAt: "2024-01-05",
      status: "Verified",
      rating: 5,
    },
  ]

  const skillBadges = [
    { name: "Smart Contracts", level: "Expert", color: "bg-purple-100 text-purple-800" },
    { name: "React Development", level: "Advanced", color: "bg-blue-100 text-blue-800" },
    { name: "UI/UX Design", level: "Intermediate", color: "bg-green-100 text-green-800" },
    { name: "Blockchain Security", level: "Advanced", color: "bg-red-100 text-red-800" },
    { name: "TypeScript", level: "Expert", color: "bg-indigo-100 text-indigo-800" },
    { name: "Base", level: "Advanced", color: "bg-teal-100 text-teal-800" },
  ]

  const nftBadges = [
    {
      id: 1,
      name: "DEX Builder",
      image: "/placeholder.svg?height=80&width=80",
      rarity: "Rare",
      earnedAt: "2024-01-15",
    },
    {
      id: 2,
      name: "UI Designer",
      image: "/placeholder.svg?height=80&width=80",
      rarity: "Common",
      earnedAt: "2024-01-10",
    },
    {
      id: 3,
      name: "Security Expert",
      image: "/placeholder.svg?height=80&width=80",
      rarity: "Epic",
      earnedAt: "2024-01-05",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatarUrl || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                  <AvatarFallback className="text-2xl">{user?.initials || "JD"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold">{user?.name || "John Doe"}</h1>
                      <p className="text-gray-500 dark:text-gray-400">{user?.bio || "Full-Stack Blockchain Developer"}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{user?.location || "San Francisco, CA"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {user?.joinedAt || "January 2024"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon">
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Globe className="h-4 w-4" />
                      </Button>
                      <Button>Edit Profile</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
                      <p className="text-2xl font-bold">{userStats.totalEarnings} ETH</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Challenges</p>
                      <p className="text-2xl font-bold">{userStats.challengesCompleted}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills Verified</p>
                      <p className="text-2xl font-bold">{userStats.skillsVerified}</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Global Rank</p>
                      <p className="text-2xl font-bold">#{userStats.rank}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="challenges" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="nfts">NFT Badges</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="challenges" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedChallenges.map((challenge) => (
                      <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{challenge.title}</h3>
                            <Badge variant="outline">{challenge.category}</Badge>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              {challenge.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Completed: {challenge.completedAt}</span>
                            <span>Reward: {challenge.reward}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < challenge.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Verified Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {skillBadges.map((skill, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mx-auto mb-3">
                            <Award className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                          </div>
                          <h3 className="font-medium mb-1">{skill.name}</h3>
                          <Badge className={skill.color}>{skill.level}</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nfts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>NFT Achievement Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {nftBadges.map((nft) => (
                      <motion.div
                        key={nft.id}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 mx-auto mb-3 flex items-center justify-center">
                            <Award className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="font-medium mb-1">{nft.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              nft.rarity === "Epic"
                                ? "border-purple-500 text-purple-500"
                                : nft.rarity === "Rare"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-gray-500 text-gray-500"
                            }
                          >
                            {nft.rarity}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Earned {nft.earnedAt}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Completed "Build a DEX Order Book" challenge</p>
                        <p className="text-sm text-gray-500">Earned 0.05 ETH • 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Started "Smart Contract Security Audit" challenge</p>
                        <p className="text-sm text-gray-500">5 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Earned "UI Designer" NFT badge</p>
                        <p className="text-sm text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  )
}
