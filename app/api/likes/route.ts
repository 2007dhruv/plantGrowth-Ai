import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("likes").insert({
      post_id: postId,
      user_id: user.id,
    })

    if (error) {
      console.error("[v0] Error creating like:", error)
      return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in likes POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error deleting like:", error)
      return NextResponse.json({ error: "Failed to unlike post" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in likes DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
