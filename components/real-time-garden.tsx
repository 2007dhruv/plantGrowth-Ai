"use client"

import React from "react"
import { auth, db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

type PlantDoc = {
  id: string
  name: string
  commonNames?: string[]
  probability?: number
  imageBase64?: string
  createdAt?: any
}

export default function RealTimeGarden() {
  const [user, setUser] = React.useState<ReturnType<(typeof auth)["currentUser"]> | null>(null)
  const [imageBase64, setImageBase64] = React.useState<string | null>(null)
  const [isIdentifying, setIsIdentifying] = React.useState(false)
  const [predictions, setPredictions] = React.useState<
    { name: string; probability: number; common_names: string[]; description?: string }[]
  >([])
  const [plants, setPlants] = React.useState<PlantDoc[]>([])
  const [error, setError] = React.useState<string | null>(null)

  // Auth subscription
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  // Real-time subscription to user's plants
  React.useEffect(() => {
    if (!user) {
      setPlants([])
      return
    }
    const q = query(collection(db, "users", user.uid, "plants"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      const next: PlantDoc[] = []
      snap.forEach((d) => {
        const data = d.data() as any
        next.push({
          id: d.id,
          name: data?.name || "Unknown",
          commonNames: data?.commonNames || [],
          probability: typeof data?.probability === "number" ? data.probability : undefined,
          imageBase64: data?.imageBase64,
          createdAt: data?.createdAt,
        })
      })
      setPlants(next)
    })
    return () => unsub()
  }, [user])

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Ensure it's a data URL; if ArrayBuffer, convert to base64 data URL
      if (typeof result === "string" && result.startsWith("data:")) {
        setImageBase64(result)
      } else if (reader.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(reader.result)
        let binary = ""
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
        const base64 = btoa(binary)
        setImageBase64(`data:image/jpeg;base64,${base64}`)
      }
    }
    reader.readAsDataURL(file)
  }

  async function identifyPlant() {
    if (!imageBase64) return
    setIsIdentifying(true)
    setError(null)
    try {
      const res = await fetch("/api/plant-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: [imageBase64] }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to identify plant")
      }
      setPredictions(
        Array.isArray(data?.suggestions)
          ? data.suggestions.map((s: any) => ({
              name: s.name || "Unknown",
              probability: typeof s.probability === "number" ? s.probability : 0,
              common_names: Array.isArray(s.common_names) ? s.common_names : [],
              description: s.description,
            }))
          : [],
      )
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setIsIdentifying(false)
    }
  }

  async function savePlant(p: { name: string; probability: number; common_names: string[] }) {
    if (!user) {
      setError("Please sign in to save plants.")
      return
    }
    try {
      await addDoc(collection(db, "users", user.uid, "plants"), {
        name: p.name,
        commonNames: p.common_names,
        probability: p.probability,
        imageBase64: imageBase64 || null,
        createdAt: serverTimestamp(),
      })
      // Clear predictions after save
      setPredictions([])
      setImageBase64(null)
    } catch (err: any) {
      setError(err?.message || "Failed to save plant")
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-pretty">My Garden</h2>
        <p className="text-sm text-muted-foreground">
          Identify plants from a photo and save them. Your list updates in real time.
        </p>
      </header>

      {!user ? (
        <div className="rounded-md border p-4">
          <p className="text-sm">
            Please sign in to use My Garden. Once signed in, you can identify plants and your list will update live.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border p-4 space-y-4">
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={onFileChange} className="block text-sm" />
              <button
                onClick={identifyPlant}
                disabled={!imageBase64 || isIdentifying}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm disabled:opacity-50"
              >
                {isIdentifying ? "Identifying…" : "Identify plant"}
              </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {imageBase64 && (
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageBase64 || "/placeholder.svg"}
                  alt="Uploaded plant"
                  className="h-32 w-32 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <h3 className="font-medium">Predictions</h3>
                  {predictions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No predictions yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {predictions.map((p, idx) => (
                        <li key={idx} className="rounded-md border p-3 flex items-center justify-between gap-2">
                          <div>
                            <p className="font-medium">{p.name}</p>
                            {p.common_names?.length ? (
                              <p className="text-xs text-muted-foreground">
                                Also known as: {p.common_names.slice(0, 3).join(", ")}
                              </p>
                            ) : null}
                            <p className="text-xs text-muted-foreground">
                              Confidence: {(p.probability * 100).toFixed(1)}%
                            </p>
                          </div>
                          <button
                            onClick={() => savePlant(p)}
                            className="inline-flex items-center rounded-md bg-secondary px-3 py-1.5 text-secondary-foreground text-xs"
                          >
                            Save to garden
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Your plants</h3>
            {plants.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No plants yet. Identify a plant and save it to see it here.
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plants.map((pl) => (
                  <li key={pl.id} className="rounded-md border p-3 space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {pl.imageBase64 ? (
                      <img
                        src={pl.imageBase64 || "/placeholder.svg"}
                        alt={pl.name}
                        className="h-32 w-full object-cover rounded"
                      />
                    ) : (
                      <div className="h-32 w-full bg-muted rounded grid place-items-center text-xs text-muted-foreground">
                        {"No image"}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{pl.name}</p>
                      {pl.commonNames?.length ? (
                        <p className="text-xs text-muted-foreground">{pl.commonNames.slice(0, 3).join(", ")}</p>
                      ) : null}
                      {typeof pl.probability === "number" ? (
                        <p className="text-xs text-muted-foreground">
                          Confidence: {(pl.probability * 100).toFixed(1)}%
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  )
}
