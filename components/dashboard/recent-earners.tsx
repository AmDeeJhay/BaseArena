"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface RecentEarnersProps {
  scrollMode?: "vertical"
}

export default function RecentEarners({ scrollMode }: RecentEarnersProps) {
  const earners = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      amount: "0.05 ETH",
      challenge: "Build a DEX Order Book",
      time: "2 hours ago",
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      amount: "0.03 ETH",
      challenge: "Design a DeFi Dashboard",
      time: "1 day ago",
    },
    {
      id: 3,
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      amount: "0.02 ETH",
      challenge: "Technical Guide on NFTs",
      time: "2 days ago",
    },
    {
      id: 4,
      name: "Diana Prince",
      avatar: "/placeholder.svg?height=32&width=32",
      amount: "0.04 ETH",
      challenge: "Base Wallet Connector",
      time: "3 days ago",
    },
    {
      id: 5,
      name: "Ethan Hunt",
      avatar: "/placeholder.svg?height=32&width=32",
      amount: "0.025 ETH",
      challenge: "Educational Infographic",
      time: "4 days ago",
    },
  ]

  // Vertical scroll animation logic
  const [visibleIndex, setVisibleIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const VISIBLE_COUNT = 3

  useEffect(() => {
    if (scrollMode === "vertical") {
      intervalRef.current = setInterval(() => {
        setVisibleIndex((prev) => (prev + 1) % earners.length)
      }, 2000)
      return () => intervalRef.current && clearInterval(intervalRef.current)
    }
  }, [scrollMode, earners.length])

  if (scrollMode === "vertical") {
    // Show only VISIBLE_COUNT earners, scrolling up
    const items = []
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      const idx = (visibleIndex + i) % earners.length
      items.push(earners[idx])
    }
    return (
      <div className="h-full flex flex-col justify-center overflow-hidden">
        <div
          className="flex flex-col transition-transform duration-700"
          style={{ transform: `translateY(-${visibleIndex * (100 / VISIBLE_COUNT)}%)` }}
        >
          {items.map((earner, i) => (
            <motion.div
              key={earner.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex items-center gap-3 py-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={earner.avatar || "/placeholder.svg"} alt={earner.name} />
                <AvatarFallback>{earner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{earner.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-yellow-500">
                    <Zap className="h-3 w-3 mr-0.5" />
                    <span className="text-xs font-medium">{earner.amount}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{earner.time}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs truncate max-w-[100px]">
                {earner.challenge}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Earners</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {earners.map((earner, index) => (
            <motion.div
              key={earner.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={earner.avatar || "/placeholder.svg"} alt={earner.name} />
                <AvatarFallback>{earner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{earner.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-yellow-500">
                    <Zap className="h-3 w-3 mr-0.5" />
                    <span className="text-xs font-medium">{earner.amount}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{earner.time}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs truncate max-w-[100px]">
                {earner.challenge}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
