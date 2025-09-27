import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const bodyAny = await req.json().catch(() => ({}) as any)

    let normalizedImageB64: string | null = null
    if (typeof bodyAny?.imageB64 === "string" && bodyAny.imageB64.length > 0) {
      normalizedImageB64 = bodyAny.imageB64.startsWith("data:")
        ? bodyAny.imageB64.split(",")[1] || null
        : bodyAny.imageB64
    } else if (Array.isArray(bodyAny?.images) && bodyAny.images.length > 0) {
      const first = bodyAny.images[0]
      if (typeof first === "string" && first.length > 0) {
        normalizedImageB64 = first.startsWith("data:") ? first.split(",")[1] || null : first
      }
    }

    if (!normalizedImageB64) {
      return NextResponse.json(
        { error: "Missing image. Provide imageB64 or images[0] as base64 (data URL supported)." },
        { status: 400 },
      )
    }

    const apiKey = process.env.PLANT_ID_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "PLANT_ID_API_KEY is not set. Add it in Project Settings → Environment Variables." },
        { status: 500 },
      )
    }

    const url = "https://api.plant.id/v2/identify"
    const body = {
      images: [normalizedImageB64],
      modifiers: ["crops_fast", "similar_images"],
      plant_language: "en",
      plant_details: [
        "common_names",
        "url",
        "name_authority",
        "wiki_description",
        "taxonomy",
        "synonyms",
        "edible_parts",
        "watering",
        "propagation_methods",
        "wiki_image",
      ],
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: "Plant.id request failed", detail: errText }, { status: res.status })
    }

    const data = await res.json()
    const top =
      data?.suggestions?.[0] || // v2
      data?.result?.classification?.suggestions?.[0] || // v3
      null

    return NextResponse.json(
      {
        raw: data,
        topSuggestion: top
          ? {
              name: top?.name,
              probability: top?.probability,
              common_names: top?.plant_details?.common_names ?? top?.details?.common_names ?? [],
              wiki: top?.plant_details?.wiki_description?.value ?? top?.details?.wiki_description?.value ?? "",
              wiki_url:
                top?.plant_details?.url ??
                top?.details?.url ??
                top?.plant_details?.wiki_image?.value ??
                top?.details?.wiki_image?.value ??
                null,
              taxonomy: top?.plant_details?.taxonomy ?? top?.details?.taxonomy ?? {},
            }
          : null,
      },
      { status: 200 },
    )
  } catch (e: any) {
    return NextResponse.json({ error: "Unexpected error", detail: e?.message ?? String(e) }, { status: 500 })
  }
}
