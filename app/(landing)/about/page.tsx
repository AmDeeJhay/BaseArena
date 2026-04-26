"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Twitter, Globe, Users, Target, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Blockchain developer with 8+ years experience in DeFi and smart contracts.",
      avatar: "/placeholder.svg?height=100&width=100",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      bio: "Full-stack developer and Base ecosystem contributor since 2022.",
      avatar: "/placeholder.svg?height=100&width=100",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Community",
      bio: "Community builder focused on creating inclusive learning environments.",
      avatar: "/placeholder.svg?height=100&width=100",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
  ]

  const stats = [
    { label: "Active Challenges", value: "150+", icon: <Target className="h-6 w-6" /> },
    { label: "Community Members", value: "5,000+", icon: <Users className="h-6 w-6" /> },
    { label: "ETH Distributed", value: "50,000+", icon: <Zap className="h-6 w-6" /> },
    { label: "Skills Verified", value: "2,500+", icon: <Badge className="h-6 w-6" /> },
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
                About BaseArena
              </h1>
              <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're building the future of skill verification and career development on the blockchain.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Mission</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                BaseArena democratizes opportunity by creating a transparent, merit-based platform where anyone can
                prove their skills and get rewarded for their expertise.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                We believe that talent is universal, but opportunity is not. By leveraging blockchain technology, we're
                removing traditional barriers and creating a global marketplace for skills where your work speaks for
                itself.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/challenges">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
                    Start Building
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn How
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-teal-200 dark:bg-teal-900/30 rounded-full filter blur-3xl opacity-70"></div>
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-cyan-200 dark:bg-cyan-900/30 rounded-full filter blur-3xl opacity-70"></div>
                <Card className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <CardTitle>Global Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Connecting talent worldwide through blockchain-verified skills and achievements.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Impact</h2>
            <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See how BaseArena is transforming the way people prove and monetize their skills.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <div className="text-teal-600 dark:text-teal-400">{stat.icon}</div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Meet Our Team</h2>
            <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The passionate individuals building the future of skill verification.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center">
                  <CardHeader>
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle>{member.name}</CardTitle>
                    <Badge variant="secondary" className="w-fit mx-auto">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{member.bio}</p>
                    <div className="flex justify-center space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={member.social.twitter}>
                          <Twitter className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={member.social.linkedin}>
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={member.social.github}>
                          <Github className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Be part of the revolution in skill verification and career development.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/challenges">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Join Discord
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
