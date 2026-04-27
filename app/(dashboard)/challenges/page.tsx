"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Filter, Search, Zap, ArrowRight, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import challengeService from "@/services/challengeService"
import type { Challenge } from "@/types/challenges"
import usePaginationStore from "@/store/usePaginationStore"
import Pagination from "@/components/Pagination"
import { WalletGuard } from "@/components/wallet-guard"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ChallengesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentTab, setCurrentTab] = useState("all")
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currentPage, itemsPerPage, resetPagination } = usePaginationStore()

  useEffect(() => {
    const loadChallenges = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await challengeService.fetchChallenges()
        setChallenges(data)
        console.log(`Loaded ${data.length} challenges successfully`)
      } catch (err) {
        console.error("Error loading challenges:", err)
        setError("Unable to load challenges. Please try again later.")
        setChallenges([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    loadChallenges()
  }, [])

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = currentTab === "all" || challenge.category === currentTab
    return matchesSearch && matchesTab
  })

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "reward-high":
        return Number.parseFloat(b.reward) - Number.parseFloat(a.reward)
      case "reward-low":
        return Number.parseFloat(a.reward) - Number.parseFloat(b.reward)
      default:
        return 0
    }
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentChallenges = sortedChallenges.slice(startIndex, endIndex)

  useEffect(() => {
    resetPagination()
  }, [searchTerm, sortBy, currentTab, resetPagination])

  const renderChallengeCard = (challenge: Challenge) => (
    <motion.div
      key={challenge.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3 p-4">
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-12 h-12 rounded-xl ${challenge.bgColor || "bg-teal-100 dark:bg-teal-900/30"} flex items-center justify-center flex-shrink-0`}
            >
              <div className={challenge.color || "text-teal-600 dark:text-teal-400"}>
                {challenge.icon || <Zap className="h-6 w-6" />}
              </div>
            </div>
            <Badge variant="outline" className="font-normal text-xs flex-shrink-0">
              {challenge.category}
            </Badge>
          </div>
          <CardTitle className="text-lg leading-tight line-clamp-2 min-h-[3.5rem]">{challenge.title}</CardTitle>
          <div className="flex items-center space-x-3 mt-2">
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {challenge.difficulty}
            </Badge>
            <div className="flex items-center text-yellow-500 space-x-1 flex-shrink-0">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">${challenge.reward}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-4 p-4 pt-0">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 min-h-[4.5rem]">
            {challenge.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
            <div className="flex items-center flex-shrink-0">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{challenge.duration}</span>
            </div>
            <div className="flex items-center flex-shrink-0">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>
                {challenge.deadline ? `Due ${new Date(challenge.deadline).toLocaleDateString()}` : "No deadline"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 p-4">
          <div className="flex gap-2 w-full">
            <Link href={`/challenges/${challenge.id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full text-xs">
                View Details
              </Button>
            </Link>
            <Link href={`/challenges/${challenge.id}`} className="flex-1">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 w-full text-xs">
                Accept
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )

  if (isLoading) {
    return (
      <WalletGuard message="Connect your wallet to browse and participate in challenges">
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </WalletGuard>
    )
  }

  return (
    <WalletGuard message="Connect your wallet to browse and participate in challenges">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Browse and complete challenges to earn rewards and build your on-chain skill portfolio.
            </p>
          </div>

          {error && (
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">{error}</AlertDescription>
            </Alert>
          )}

          <div className="w-full overflow-hidden">
            <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="w-full lg:w-auto">
                  <TabsList className="bg-gray-100 dark:bg-gray-800 w-full lg:w-auto min-w-max">
                    <TabsTrigger value="all" className="whitespace-nowrap">
                      All Challenges
                    </TabsTrigger>
                    <TabsTrigger value="frontend" className="whitespace-nowrap">
                      Frontend
                    </TabsTrigger>
                    <TabsTrigger value="backend" className="whitespace-nowrap">
                      Backend
                    </TabsTrigger>
                    <TabsTrigger value="devops" className="whitespace-nowrap">
                      DevOps
                    </TabsTrigger>
                    <TabsTrigger value="mobile" className="whitespace-nowrap">
                      Mobile
                    </TabsTrigger>
                    <TabsTrigger value="blockchain" className="whitespace-nowrap">
                      Blockchain
                    </TabsTrigger>
                    <TabsTrigger value="design" className="whitespace-nowrap">
                      Design
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search challenges..."
                      className="pl-10 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="reward-high">Highest Reward</SelectItem>
                        <SelectItem value="reward-low">Lowest Reward</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="flex-shrink-0">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                  {currentChallenges.map(renderChallengeCard)}
                </div>

                {sortedChallenges.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No challenges found matching your criteria.</p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setCurrentTab("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}

                {sortedChallenges.length > 0 && (
                  <div className="mt-8">
                    <Pagination totalItems={sortedChallenges.length} />
                  </div>
                )}
              </TabsContent>

              {["frontend", "backend", "devops", "mobile", "blockchain", "design"].map((category) => {
                const categoryFilteredChallenges = sortedChallenges.filter(
                  (challenge) => challenge.category === category,
                )
                const categoryChallengesStartIndex = (currentPage - 1) * itemsPerPage
                const categoryChallengesEndIndex = categoryChallengesStartIndex + itemsPerPage
                const currentCategoryChallenges = categoryFilteredChallenges.slice(
                  categoryChallengesStartIndex,
                  categoryChallengesEndIndex,
                )

                return (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                      {currentCategoryChallenges.map(renderChallengeCard)}
                    </div>

                    {categoryFilteredChallenges.length > 0 && (
                      <div className="mt-8">
                        <Pagination totalItems={categoryFilteredChallenges.length} />
                      </div>
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>
        </div>
      </div>
    </WalletGuard>
  )
}
