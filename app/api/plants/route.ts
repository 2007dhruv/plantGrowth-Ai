import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File
    const name = formData.get("name") as string
    const species = formData.get("species") as string
    const confidence = Number.parseFloat(formData.get("confidence") as string)
    const careInstructions = formData.get("careInstructions") as string

    if (!image || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload image to Supabase Storage
    const fileExt = image.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("plant-images").upload(fileName, image)

    if (uploadError) {
      console.error("[v0] Error uploading image:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("plant-images").getPublicUrl(uploadData.path)

    // Save plant to database
    const { data: plant, error: dbError } = await supabase
      .from("plants")
      .insert({
        user_id: user.id,
        name,
        species,
        image_url: publicUrl,
        ai_confidence: confidence,
        care_instructions: careInstructions,
        identified_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Error saving plant:", dbError)
      return NextResponse.json({ error: "Failed to save plant" }, { status: 500 })
    }

    return NextResponse.json(plant)
  } catch (error) {
    console.error("[v0] Error in plants API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
