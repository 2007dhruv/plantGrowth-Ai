"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CommentSection } from "@/components/comment-section"
import { useRouter } from "next/navigation"

interface Post {
  id: string
  content: string
  image_url: string | null
  likes_count: number
  comments_count: number
  created_at: string
  profiles: {
    username: string | null
    full_name: string | null
    avatar_url: string | null
  } | null
  plants?: {
    name: string
    species: string | null
  } | null
}

interface PostCardProps {
  post: Post
  currentUserId: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking] = useState(false)
  const router = useRouter()

  const createdDate = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const displayName = post.profiles?.full_name || post.profiles?.username || "Anonymous"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)

    try {
      const response = await fetch("/api/likes", {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
      }
    } catch (error) {
      console.error("[v0] Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card className="border-green-200 bg-white">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-green-100 text-green-700">
              {post.profiles?.avatar_url ? <User className="h-4 w-4" /> : initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-green-900">{displayName}</p>
            <p className="text-sm text-green-600">{createdDate}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-green-900 whitespace-pre-wrap">{post.content}</p>

        {post.image_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image src={post.image_url || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
          </div>
        )}

        {post.plants && (
          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-sm text-green-700">
              <span className="font-medium">{post.plants.name}</span>
              {post.plants.species && <span className="text-green-600"> • {post.plants.species}</span>}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className={isLiked ? "text-red-600 hover:text-red-700" : "text-green-700 hover:text-green-900"}
          >
            <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-green-700 hover:text-green-900"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {post.comments_count} {post.comments_count === 1 ? "Comment" : "Comments"}
          </Button>
        </div>

        {showComments && <CommentSection postId={post.id} currentUserId={currentUserId} />}
      </CardFooter>
    </Card>
  )
}
