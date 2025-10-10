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

    // Call Gemini API for plant identification
    // Note: You'll need to add GEMINI_API_KEY to your environment variables
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`||AIzaSyDI_16T0muf4jM5jO3N9DxNj-mR5Zk8loI,
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
                  text: "Identify this plant. Provide the common name, scientific name, and detailed care instructions including light, water, temperature, and soil requirements. Format your response as JSON with fields: commonName, scientificName, careInstructions, confidence (0-1).",
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
      throw new Error("Failed to identify plant with Gemini API")
    }

    const geminiData = await geminiResponse.json()
    const responseText = geminiData.candidates[0].content.parts[0].text

    // Parse the JSON response from Gemini
    let plantData
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        plantData = JSON.parse(jsonMatch[0])
      } else {
        // Fallback: create structured data from text
        plantData = {
          commonName: "Unknown Plant",
          scientificName: "Species identification needed",
          careInstructions: responseText,
          confidence: 0.7,
        }
      }
    } catch {
      // If parsing fails, use the raw text
      plantData = {
        commonName: "Plant",
        scientificName: "See care instructions",
        careInstructions: responseText,
        confidence: 0.6,
      }
    }

    return NextResponse.json({
      species: `${plantData.commonName} (${plantData.scientificName})`,
      confidence: plantData.confidence || 0.75,
      careInstructions: plantData.careInstructions,
    })
  } catch (error) {
    console.error("[v0] Error identifying plant:", error)
    return NextResponse.json({ error: "Failed to identify plant" }, { status: 500 })
  }
}
