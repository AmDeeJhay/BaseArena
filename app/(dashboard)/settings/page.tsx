"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const [username, setUsername] = useState("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [usernameError, setUsernameError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    browser: true,
    newChallenges: true,
    submissionUpdates: true,
    rewards: true,
    systemUpdates: false,
  })

  useEffect(() => {
    const storedUsername = localStorage.getItem("skillmint_username")
    const storedGender = localStorage.getItem("skillmint_gender") as "male" | "female" | null
    setUsername(storedUsername || "")
    setGender(storedGender || "male")
  }, [])

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    setUsernameError("")
  }

  const handleSaveUsername = () => {
    if (!username.trim()) {
      setUsernameError("Username is required")
      return
    }
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters")
      return
    }
    if (username.length > 20) {
      setUsernameError("Username must be less than 20 characters")
      return
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameError("Username can only contain letters, numbers, dashes, and underscores")
      return
    }
    localStorage.setItem("skillmint_username", username)
    localStorage.setItem("skillmint_gender", gender)
    setSuccessMessage("Profile updated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleNotificationChange = (key: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="flex gap-2">
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="Enter your username"
                      />
                      <Button onClick={handleSaveUsername} className="bg-teal-600 hover:bg-teal-700">
                        Save
                      </Button>
                    </div>
                    {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
                    {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
                    <p className="text-xs text-gray-500">3-20 characters. Letters, numbers, dashes, and underscores only.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={(value: "male" | "female") => setGender(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="w-full min-h-[100px] p-2 border rounded-md bg-background"
                      defaultValue="Blockchain developer and designer with a passion for building decentralized applications on Cardano. Focused on creating user-friendly interfaces for DeFi projects."
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Social Links</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input id="github" defaultValue="github.com/johndoe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input id="twitter" defaultValue="twitter.com/johndoe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue="johndoe.com" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how and when you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="font-medium">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notificationSettings.email}
                        onCheckedChange={() => handleNotificationChange("email")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="browser-notifications" className="font-medium">
                          Browser Notifications
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="browser-notifications"
                        checked={notificationSettings.browser}
                        onCheckedChange={() => handleNotificationChange("browser")}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="new-challenges" className="font-medium">
                          New Challenges
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          When new challenges matching your skills are posted
                        </p>
                      </div>
                      <Switch
                        id="new-challenges"
                        checked={notificationSettings.newChallenges}
                        onCheckedChange={() => handleNotificationChange("newChallenges")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="submission-updates" className="font-medium">
                          Submission Updates
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          When your submissions are reviewed or updated
                        </p>
                      </div>
                      <Switch
                        id="submission-updates"
                        checked={notificationSettings.submissionUpdates}
                        onCheckedChange={() => handleNotificationChange("submissionUpdates")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="rewards" className="font-medium">
                          Rewards
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          When you receive rewards or NFT badges
                        </p>
                      </div>
                      <Switch
                        id="rewards"
                        checked={notificationSettings.rewards}
                        onCheckedChange={() => handleNotificationChange("rewards")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-updates" className="font-medium">
                          System Updates
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Platform updates and announcements</p>
                      </div>
                      <Switch
                        id="system-updates"
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={() => handleNotificationChange("systemUpdates")}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-teal-600 hover:bg-teal-700">Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="wallet" className="mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Settings</CardTitle>
                  <CardDescription>Manage your connected wallet and payment preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Connected Wallet</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Nami Wallet</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Connected on May 1, 2023</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Address</p>
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1 block overflow-x-auto">
                          addr1qxy8p07tr4877vdlr98f87e4mnmf3fvnfcyjh9r5vr9qkyfg8jlj2f5xvvdpjh3s7y4rr9c8jjj9f2k3v4nvz8tk8g3qn8l7vz
                        </code>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Preferences</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-claim" className="font-medium">
                          Auto-claim Rewards
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically claim rewards when they're available
                        </p>
                      </div>
                      <Switch id="auto-claim" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="transaction-notifications" className="font-medium">
                          Transaction Notifications
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications for wallet transactions
                        </p>
                      </div>
                      <Switch id="transaction-notifications" defaultChecked />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-teal-600 hover:bg-teal-700">Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="privacy" className="mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage your privacy settings and account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Privacy Settings</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="public-profile" className="font-medium">
                          Public Profile
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <Switch id="public-profile" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-earnings" className="font-medium">
                          Show Earnings
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Display your earnings on your public profile
                        </p>
                      </div>
                      <Switch id="show-earnings" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-badges" className="font-medium">
                          Show NFT Badges
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Display your NFT badges on your public profile
                        </p>
                      </div>
                      <Switch id="show-badges" defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Security</h3>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data & Privacy</h3>
                    <Button variant="outline">Download Your Data</Button>
                    <Button
                      variant="outline"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
