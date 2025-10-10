import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { full_name, username, bio } = await request.json()

    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .update({
        full_name,
        username,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Error updating profile:", dbError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[v0] Error in profile API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
