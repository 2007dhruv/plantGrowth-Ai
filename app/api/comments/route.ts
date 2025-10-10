import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const { data: comments, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching comments:", error)
      return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
    }

    return NextResponse.json(comments)
  } catch (error) {
    console.error("[v0] Error in comments GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId, content } = await request.json()

    if (!postId || !content) {
      return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 })
    }

    const { data: comment, error: dbError } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Error creating comment:", dbError)
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error("[v0] Error in comments POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
