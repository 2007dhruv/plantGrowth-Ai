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
    const plantId = formData.get("plantId") as string
    const disease = formData.get("disease") as string
    const confidence = Number.parseFloat(formData.get("confidence") as string)
    const severity = formData.get("severity") as string
    const recoveryPlan = formData.get("recoveryPlan") as string

    if (!image || !disease) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload image to Supabase Storage
    const fileExt = image.name.split(".").pop() || "jpg" || "jpeg"
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("health-check-images")
      .upload(fileName, image)

    if (uploadError) {
      console.error("[v0] Error uploading image:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("health-check-images").getPublicUrl(uploadData.path)

    // Save health check to database
    const { data: healthCheck, error: dbError } = await supabase
      .from("health_checks")
      .insert({
        user_id: user.id,
        plant_id: plantId || null,
        image_url: publicUrl,
        disease_detected: disease,
        confidence,
        severity,
        recovery_plan: recoveryPlan,
        status: "analyzed",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Error saving health check:", dbError)
      return NextResponse.json({ error: "Failed to save health check" }, { status: 500 })
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    console.error("[v0] Error in health checks API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
