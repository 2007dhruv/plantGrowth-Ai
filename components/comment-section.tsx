"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, User } from "lucide-react"

interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    username: string | null
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface CommentSectionProps {
  postId: string
  currentUserId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      })

      if (response.ok) {
        setNewComment("")
        await fetchComments()
      }
    } catch (error) {
      console.error("[v0] Error posting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-4 border-t border-green-200 pt-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-20 flex-1 border-green-200"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="bg-green-600 hover:bg-green-700">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => {
            const displayName = comment.profiles?.full_name || comment.profiles?.username || "Anonymous"
            const initials = displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                    {comment.profiles?.avatar_url ? <User className="h-3 w-3" /> : initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-lg bg-green-50 p-3">
                  <p className="text-sm font-medium text-green-900">{displayName}</p>
                  <p className="mt-1 text-sm text-green-700">{comment.content}</p>
                  <p className="mt-1 text-xs text-green-600">
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-green-600">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
}
