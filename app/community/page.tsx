"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search,
  Filter,
  TrendingUp,
  Users,
  MessageSquare,
  Award,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ThumbsUp,
  Reply,
} from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [selectedFilter, setSelectedFilter] = useState("recent")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock community data
  const communityStats = {
    totalMembers: 3421,
    postsToday: 47,
    activeDiscussions: 23,
    helpfulAnswers: 156,
  }

  const posts = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "/diverse-user-avatars.png",
        badge: "Plant Expert",
        reputation: 1250,
      },
      content:
        "My tomato plant has been showing incredible growth! Here's the latest analysis showing 94% health score.",
      image: "/healthy-tomato-plant.jpg",
      plantType: "Tomato",
      healthStatus: "healthy",
      healthScore: 94,
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      bookmarks: 5,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 2,
      user: {
        name: "Mike Rodriguez",
        avatar: "/diverse-user-avatars.png",
        badge: "Growing Enthusiast",
        reputation: 680,
      },
      content: "Need help with my rose bush - noticed some spots appearing on the leaves. Any suggestions?",
      image: "/rose-bush-with-spots.jpg",
      plantType: "Rose",
      healthStatus: "warning",
      healthScore: 76,
      timestamp: "5 hours ago",
      likes: 12,
      comments: 15,
      bookmarks: 3,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 3,
      user: {
        name: "Emma Thompson",
        avatar: "/diverse-user-avatars.png",
        badge: "Herb Specialist",
        reputation: 890,
      },
      content:
        "Unfortunately my basil plant is struggling. The AI detected some concerning signs. Looking for recovery tips!",
      image: "/diseased-basil-plant.jpg",
      plantType: "Basil",
      healthStatus: "critical",
      healthScore: 45,
      timestamp: "1 day ago",
      likes: 8,
      comments: 22,
      bookmarks: 7,
      isLiked: false,
      isBookmarked: true,
    },
  ]

  const discussions = [
    {
      id: 1,
      title: "Best practices for preventing early blight in tomatoes",
      category: "Plant Diseases",
      author: "Dr. Plant Expert",
      replies: 34,
      lastActivity: "2 hours ago",
      isHot: true,
    },
    {
      id: 2,
      title: "Organic fertilizer recommendations for herb gardens",
      category: "Growing Tips",
      author: "GreenThumb2024",
      replies: 18,
      lastActivity: "4 hours ago",
      isHot: false,
    },
    {
      id: 3,
      title: "Success story: Revived my dying succulent collection!",
      category: "Success Stories",
      author: "SucculentSaver",
      replies: 12,
      lastActivity: "6 hours ago",
      isHot: false,
    },
    {
      id: 4,
      title: "How to interpret pigmentation analysis results?",
      category: "Q&A",
      author: "NewGardener",
      replies: 7,
      lastActivity: "8 hours ago",
      isHot: false,
    },
  ]

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getHealthBadgeClass = (status: string) => {
    switch (status) {
      case "healthy":
        return "status-healthy"
      case "warning":
        return "status-warning"
      case "critical":
        return "status-critical"
      default:
        return ""
    }
  }

  const PostCard = ({ post }: { post: (typeof posts)[0] }) => (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
              <AvatarFallback>
                {post.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{post.user.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {post.user.badge}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.timestamp}</span>
                <span>•</span>
                <span>{post.user.reputation} reputation</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                Follow Discussion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-foreground">{post.content}</p>

        {post.image && (
          <div className="relative">
            <img src={post.image || "/placeholder.svg"} alt="Plant" className="w-full h-64 object-cover rounded-lg" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary">{post.plantType}</Badge>
              <Badge className={getHealthBadgeClass(post.healthStatus)}>
                {getHealthIcon(post.healthStatus)}
                <span className="ml-1">{post.healthScore}%</span>
              </Badge>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className={`gap-2 ${post.isLiked ? "text-red-500" : ""}`}>
              <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
              {post.likes}
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {post.comments}
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          <Button variant="ghost" size="sm" className={`gap-2 ${post.isBookmarked ? "text-primary" : ""}`}>
            <Bookmark className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`} />
            {post.bookmarks}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const DiscussionItem = ({ discussion }: { discussion: (typeof discussions)[0] }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/community/discussions/${discussion.id}`} className="font-semibold hover:text-primary">
                {discussion.title}
              </Link>
              {discussion.isHot && (
                <Badge variant="destructive" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Hot
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">{discussion.category}</Badge>
              <span>by {discussion.author}</span>
              <span>{discussion.replies} replies</span>
              <span>Last activity {discussion.lastActivity}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Reply className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Community Hub</h1>
            <p className="text-muted-foreground">Connect with fellow plant enthusiasts</p>
          </div>
          <Button>Share Your Plant</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{communityStats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{communityStats.postsToday}</div>
              <div className="text-sm text-muted-foreground">Posts Today</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{communityStats.activeDiscussions}</div>
              <div className="text-sm text-muted-foreground">Active Discussions</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{communityStats.helpfulAnswers}</div>
              <div className="text-sm text-muted-foreground">Helpful Answers</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList>
            <TabsTrigger value="feed">Main Feed</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-3 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plants</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="flowers">Flowers</SelectItem>
                    <SelectItem value="herbs">Herbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              <div className="text-center py-8">
                <Button variant="outline">Load More Posts</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            {/* Discussion Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-destructive">24</div>
                  <div className="text-sm font-medium">Plant Diseases</div>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-success">18</div>
                  <div className="text-sm font-medium">Growing Tips</div>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm font-medium">Success Stories</div>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-warning">31</div>
                  <div className="text-sm font-medium">Q&A</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Discussions */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Recent Discussions</h3>
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <DiscussionItem key={discussion.id} discussion={discussion} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Community Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Member Directory Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Discover and connect with plant enthusiasts, experts, and fellow gardeners in your area.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
