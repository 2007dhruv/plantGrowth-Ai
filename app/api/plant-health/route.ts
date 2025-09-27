import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { speciesName, commonNames, notes } = body || {}

    const prompt = [
      "You are a plant health assistant.",
      "Classify this plant's current health as one of: healthy, warning, critical.",
      "Return strict JSON with keys: status (one of healthy|warning|critical), score (0-100), issues (string[]), tips (string[]).",
      "No prose. Only JSON.",
      `Species: ${speciesName || "Unknown"}`,
      `Common names: ${Array.isArray(commonNames) && commonNames.length ? commonNames.join(", ") : "N/A"}`,
      `Notes: ${typeof notes === "string" ? notes : ""}`,
    ].join("\n")

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
    })

    // Attempt to parse model output as JSON
    let parsed: any = null
    try {
      parsed = JSON.parse(text)
    } catch {
      // fallback minimal object if parsing fails
      parsed = { status: "warning", score: 60, issues: [], tips: [] }
    }

    const status = ["healthy", "warning", "critical"].includes(parsed?.status) ? parsed.status : "warning"
    const score = typeof parsed?.score === "number" ? Math.max(0, Math.min(100, parsed.score)) : 60
    const issues = Array.isArray(parsed?.issues) ? parsed.issues.slice(0, 5) : []
    const tips = Array.isArray(parsed?.tips) ? parsed.tips.slice(0, 5) : []

    return NextResponse.json({ status, score, issues, tips })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to assess plant health" }, { status: 500 })
  }
}
