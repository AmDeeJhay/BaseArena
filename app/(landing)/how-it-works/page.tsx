"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Code, FileCheck, Trophy, Wallet, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Connect Your Wallet",
      description:
        "Connect your Base-compatible wallet to get started. Your wallet serves as your identity and portfolio on BaseSkill.",
      details: ["Supports MetaMask and Coinbase Wallet", "Secure blockchain authentication", "No personal data required"],
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Choose a Challenge",
      description:
        "Browse available challenges across different categories and skill levels. Find projects that match your expertise.",
      details: ["Multiple difficulty levels", "Various categories available", "Clear requirements and deadlines"],
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "Submit Your Work",
      description:
        "Complete the challenge and submit your solution. Include documentation, code, or other deliverables as required.",
      details: ["Upload files and links", "Provide detailed documentation", "Meet submission deadlines"],
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Get Verified & Rewarded",
      description:
        "Your submission is reviewed by the community. Successful submissions earn ETH rewards and skill NFTs.",
      details: ["Community-driven verification", "Instant ETH rewards", "Permanent skill certificates"],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                How BaseSkill Works
              </h1>
              <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Learn how to prove your skills, earn rewards, and build your on-chain reputation in four simple steps.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`flex flex-col justify-center space-y-4 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                      <div className="text-teal-600 dark:text-teal-400">{step.icon}</div>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      Step {index + 1}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">{step.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`flex items-center justify-center ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="relative w-full max-w-md">
                    <div className="absolute -top-4 -left-4 w-72 h-72 bg-teal-200 dark:bg-teal-900/30 rounded-full filter blur-3xl opacity-70"></div>
                    <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-cyan-200 dark:bg-cyan-900/30 rounded-full filter blur-3xl opacity-70"></div>
                    <Card className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mx-auto mb-4">
                          <div className="text-teal-600 dark:text-teal-400">{step.icon}</div>
                        </div>
                        <CardTitle>{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-center text-gray-500 dark:text-gray-400">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose BaseSkill?</h2>
              <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                BaseSkill offers unique advantages for skill verification and career development.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle>Instant Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Get your skills verified instantly through blockchain technology. No waiting for traditional
                    certification processes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle>Real Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Earn actual ETH on Base for completing challenges. Your skills have real monetary value.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                    <FileCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle>Portable Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Build a portable, verifiable skill portfolio that you own forever. Take your reputation anywhere.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join BaseSkill today and start proving your skills on the blockchain.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/challenges">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
                  Browse Challenges
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
