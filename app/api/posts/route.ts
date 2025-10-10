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

    const formData = await request.formData()
    const content = formData.get("content") as string
    const image = formData.get("image") as File | null

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    let imageUrl: string | null = null

    // Upload image if provided
    if (image) {
      const fileExt = image.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, image)

      if (uploadError) {
        console.error("[v0] Error uploading image:", uploadError)
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("post-images").getPublicUrl(uploadData.path)
        imageUrl = publicUrl
      }
    }

    // Create post
    const { data: post, error: dbError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content,
        image_url: imageUrl,
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Error creating post:", dbError)
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("[v0] Error in posts API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
