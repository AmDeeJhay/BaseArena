"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle, Code, FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: "submission",
      title: "Submitted solution for 'Implement a Base Wallet Connector'",
      time: "2 hours ago",
      icon: <Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      status: "Pending",
    },
    {
      id: 2,
      type: "approval",
      title: "Your 'Design a DeFi Dashboard UI' submission was approved",
      time: "1 day ago",
      icon: <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />,
      status: "Approved",
    },
    {
      id: 3,
      type: "badge",
      title: "Earned 'UI Designer' NFT badge",
      time: "1 day ago",
      icon: <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
    },
    {
      id: 4,
      type: "challenge",
      title: "Started 'Build a Supply Chain Tracking System' challenge",
      time: "3 days ago",
      icon: <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />,
    },
    {
      id: 5,
      type: "approval",
      title: "Your 'Write a Technical Guide on NFT Minting' submission was approved",
      time: "1 week ago",
      icon: <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />,
      status: "Approved",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  {activity.status && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        activity.status === "Approved"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : activity.status === "Rejected"
                            ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
