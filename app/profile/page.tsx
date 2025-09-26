"use client"

import { useState } from "react"
import {
  Settings,
  Award,
  Users,
  Camera,
  Edit3,
  MapPin,
  Calendar,
  Leaf,
  TrendingUp,
  Heart,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Navigation from "@/components/navigation"
import { useAuth } from "@/components/auth-provider"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useAuth()

  const userStats = {
    plantsAnalyzed: 247,
    gardenPlants: 18,
    communityPosts: 34,
    helpfulVotes: 156,
    streakDays: 23,
    level: "Plant Expert",
    nextLevel: "Botanist",
    levelProgress: 68,
  }

  const achievements = [
    { id: 1, name: "First Analysis", description: "Completed your first plant analysis", icon: "🔬", earned: true },
    { id: 2, name: "Green Thumb", description: "Successfully treated 10 plant diseases", icon: "🌱", earned: true },
    { id: 3, name: "Community Helper", description: "Received 50+ helpful votes", icon: "🤝", earned: true },
    { id: 4, name: "Streak Master", description: "Maintained a 30-day analysis streak", icon: "🔥", earned: false },
    { id: 5, name: "Disease Detective", description: "Identified 25 different diseases", icon: "🕵️", earned: false },
    { id: 6, name: "Garden Guru", description: "Manage 50+ plants in your garden", icon: "🏡", earned: false },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "analysis",
      content: "Analyzed a tomato plant with early blight",
      time: "2 hours ago",
      image: "/healthy-tomato-plant.jpg",
    },
    {
      id: 2,
      type: "post",
      content: "Shared treatment success story in Community",
      time: "1 day ago",
      likes: 12,
      comments: 3,
    },
    {
      id: 3,
      type: "garden",
      content: "Added new basil plant to garden",
      time: "2 days ago",
      image: "/diseased-basil-plant.jpg",
    },
    {
      id: 4,
      type: "achievement",
      content: 'Earned "Community Helper" achievement',
      time: "3 days ago",
      badge: "Community Helper",
    },
  ]

  const followers = [
    { id: 1, name: "Sarah Chen", username: "@sarahgrows", avatar: "/diverse-user-avatars.png", following: true },
    { id: 2, name: "Mike Rodriguez", username: "@plantdad", avatar: "/diverse-user-avatars.png", following: true },
    { id: 3, name: "Emma Thompson", username: "@greenthumb", avatar: "/diverse-user-avatars.png", following: false },
    { id: 4, name: "David Kim", username: "@botanist_dave", avatar: "/diverse-user-avatars.png", following: true },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <div className="relative">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32">
                      <AvatarImage src={user?.photoURL || "/diverse-user-avatars.png"} alt="Profile" />
                      <AvatarFallback>
                        {(user?.displayName || user?.email || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-center md:text-left mt-4">
                    <h1 className="text-2xl font-bold text-foreground">
                      {user?.displayName || user?.email || "Anonymous Gardener"}
                    </h1>
                    <p className="text-muted-foreground">
                      {user?.email ? `@${user.email.split("@")[0] || "user"}` : "@guest"}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Joined</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                    <div>
                      <p className="text-foreground mb-2">
                        Plant pathologist and urban gardening enthusiast. Helping fellow gardeners identify and treat
                        plant diseases for healthier gardens.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          <strong className="text-foreground">1,234</strong> followers
                        </span>
                        <span>
                          <strong className="text-foreground">567</strong> following
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Level Progress */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">{userStats.level}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {userStats.levelProgress}% to {userStats.nextLevel}
                      </span>
                    </div>
                    <Progress value={userStats.levelProgress} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{userStats.plantsAnalyzed}</div>
              <div className="text-sm text-muted-foreground">Plants Analyzed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{userStats.gardenPlants}</div>
              <div className="text-sm text-muted-foreground">Garden Plants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{userStats.communityPosts}</div>
              <div className="text-sm text-muted-foreground">Community Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{userStats.streakDays}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weekly Analyses</span>
                    <span className="font-medium">12 (+3 from last week)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Disease Accuracy</span>
                    <span className="font-medium">94.2% (+1.8%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Community Engagement</span>
                    <span className="font-medium">High (+15%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Garden Health Score</span>
                    <span className="font-medium">8.7/10</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Expertise Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Tomato Diseases</span>
                        <span className="text-sm text-muted-foreground">Expert</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Fungal Infections</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Nutrient Deficiency</span>
                        <span className="text-sm text-muted-foreground">Advanced</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Pest Identification</span>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {activity.type === "analysis" && (
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Leaf className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          {activity.type === "post" && (
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-blue-500" />
                            </div>
                          )}
                          {activity.type === "garden" && (
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                              <Leaf className="w-5 h-5 text-green-500" />
                            </div>
                          )}
                          {activity.type === "achievement" && (
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                              <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground">{activity.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-muted-foreground">{activity.time}</span>
                            {activity.likes && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Heart className="w-4 h-4" />
                                <span>{activity.likes}</span>
                              </div>
                            )}
                            {activity.comments && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MessageCircle className="w-4 h-4" />
                                <span>{activity.comments}</span>
                              </div>
                            )}
                            {activity.badge && <Badge variant="secondary">{activity.badge}</Badge>}
                          </div>
                        </div>
                        {activity.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={activity.image || "/placeholder.svg"}
                              alt="Activity"
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </div>
                      {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={achievement.earned ? "border-primary/20 bg-primary/5" : "opacity-60"}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.earned && (
                          <Badge variant="secondary" className="mt-2">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Followers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {followers.slice(0, 4).map((follower) => (
                      <div key={follower.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.name} />
                            <AvatarFallback>
                              {follower.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{follower.name}</p>
                            <p className="text-sm text-muted-foreground">{follower.username}</p>
                          </div>
                        </div>
                        <Button variant={follower.following ? "outline" : "default"} size="sm">
                          {follower.following ? "Following" : "Follow"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Helpful Votes Received</span>
                    <span className="font-medium">{userStats.helpfulVotes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Questions Answered</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Stories Shared</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Plants Helped Heal</span>
                    <span className="font-medium">156</span>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">4.9/5</div>
                    <div className="text-sm text-muted-foreground">Community Rating</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
