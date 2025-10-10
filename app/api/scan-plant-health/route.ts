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

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    const flaskBackendUrl = process.env.FLASK_BACKEND_URL

    let mlResult
    if (flaskBackendUrl) {
      try {
        // Call Flask ML backend
        const mlResponse = await fetch(`${flaskBackendUrl}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
          }),
        })

        if (mlResponse.ok) {
          mlResult = await mlResponse.json()
        }
      } catch (error) {
        console.error("[v0] Flask backend error:", error)
        // Fall back to Gemini if Flask backend fails
      }
    }

    // If ML backend didn't work or isn't configured, use Gemini as fallback
    if (!mlResult) {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'Analyze this plant image for diseases or health issues. Identify any disease, assess severity (mild/moderate/severe), and provide a detailed recovery plan. Format your response as JSON with fields: disease, confidence (0-1), severity, recoveryPlan. If the plant appears healthy, set disease to "Healthy" and provide care tips.',
                  },
                  {
                    inline_data: {
                      mime_type: image.type,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        },
      )

      if (!geminiResponse.ok) {
        throw new Error("Failed to analyze plant health")
      }

      const geminiData = await geminiResponse.json()
      const responseText = geminiData.candidates[0].content.parts[0].text

      // Parse the JSON response from Gemini
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          mlResult = JSON.parse(jsonMatch[0])
        } else {
          mlResult = {
            disease: "Analysis Complete",
            confidence: 0.7,
            severity: "moderate",
            recoveryPlan: responseText,
          }
        }
      } catch {
        mlResult = {
          disease: "Health Check",
          confidence: 0.6,
          severity: "moderate",
          recoveryPlan: responseText,
        }
      }
    }

    let recoveryPlan = mlResult.recoveryPlan
    if (!recoveryPlan && mlResult.disease) {
      const recoveryResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Create a detailed recovery plan for a plant with ${mlResult.disease} (severity: ${mlResult.severity}). Include immediate actions, treatment steps, prevention tips, and timeline for recovery.`,
                  },
                ],
              },
            ],
          }),
        },
      )

      if (recoveryResponse.ok) {
        const recoveryData = await recoveryResponse.json()
        recoveryPlan = recoveryData.candidates[0].content.parts[0].text
      }
    }

    return NextResponse.json({
      disease: mlResult.disease || "Unknown Disease",
      confidence: mlResult.confidence || 0.75,
      severity: mlResult.severity || "moderate",
      recoveryPlan: recoveryPlan || "Please consult with a plant expert for specific treatment.",
    })
  } catch (error) {
    console.error("[v0] Error scanning plant health:", error)
    return NextResponse.json({ error: "Failed to scan plant health" }, { status: 500 })
  }
}
