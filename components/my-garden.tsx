"use client"

import React from "react"
import "../lib/firebase" // ensure Firebase app is initialized
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  addDoc as addDocAlias,
  deleteDoc,
} from "firebase/firestore"
import { getAuth, onAuthStateChanged, type User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type PlantDoc = {
  userId: string
  speciesName: string
  probability?: number
  commonNames?: string[]
  wiki?: string
  wikiUrl?: string | null
  createdAt?: any
  notes?: string
  imageBase64?: string // new
  health?: { status: "healthy" | "warning" | "critical"; score: number; issues?: string[]; tips?: string[] } // optional
}

type Measurement = {
  heightCm?: number
  note?: string
  createdAt?: any
}

export default function MyGarden() {
  const [user, setUser] = React.useState<User | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [identifyLoading, setIdentifyLoading] = React.useState(false)
  const [identifyError, setIdentifyError] = React.useState<string | null>(null)
  const [identifyResult, setIdentifyResult] = React.useState<{
    speciesName?: string
    probability?: number
    commonNames?: string[]
    wiki?: string
    wikiUrl?: string | null
  } | null>(null)

  const [plants, setPlants] = React.useState<(PlantDoc & { id: string })[]>([])
  const [saveNotes, setSaveNotes] = React.useState("")
  const [imageDataUrl, setImageDataUrl] = React.useState<string | null>(null) // new state

  const db = React.useMemo(() => getFirestore(), [])
  const auth = React.useMemo(() => getAuth(), [])

  // Auth state
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsub()
  }, [auth])

  // Real-time subscription to user's plants
  React.useEffect(() => {
    if (!user) {
      setPlants([])
      return
    }
    const q = query(collection(db, "plants"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      const rows: (PlantDoc & { id: string })[] = []
      snap.forEach((docSnap) => {
        const d = docSnap.data() as PlantDoc
        rows.push({ id: docSnap.id, ...d })
      })
      setPlants(rows)
    })
    return () => unsub()
  }, [db, user])

  async function fileToBase64(f: File): Promise<string> {
    const buffer = await f.arrayBuffer()
    // Plant.id expects plain base64 without data: prefix
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
    return base64
  }

  async function handleIdentify() {
    setIdentifyError(null)
    setIdentifyResult(null)
    if (!file) {
      setIdentifyError("Please select an image first.")
      return
    }
    try {
      setIdentifyLoading(true)
      const base64 = await fileToBase64(file)
      // ensure we have a dataURL for saving
      setImageDataUrl(`data:image/jpeg;base64,${base64}`)
      const res = await fetch("/api/plant-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageB64: base64 }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to identify plant")
      }
      const top = data?.topSuggestion
      if (!top) {
        setIdentifyError("No plant suggestion was returned.")
        return
      }
      setIdentifyResult({
        speciesName: top.name,
        probability: top.probability,
        commonNames: top.common_names ?? [],
        wiki: top.wiki ?? "",
        wikiUrl: top.wiki_url ?? null,
      })
    } catch (e: any) {
      setIdentifyError(e?.message ?? String(e))
    } finally {
      setIdentifyLoading(false)
    }
  }

  function omitUndefined<T extends Record<string, any>>(obj: T) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
  }

  async function handleSave() {
    if (!user) {
      setIdentifyError("Please sign in to save plants.")
      return
    }
    if (!identifyResult) return

    // Compute health using Gemini
    let health:
      | { status: "healthy" | "warning" | "critical"; score: number; issues?: string[]; tips?: string[] }
      | undefined
    try {
      const res = await fetch("/api/plant-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speciesName: identifyResult.speciesName,
          commonNames: identifyResult.commonNames,
          notes: saveNotes?.trim() || "",
        }),
      })
      const data = await res.json()
      if (res.ok && data?.status) {
        health = {
          status: data.status,
          score: typeof data.score === "number" ? data.score : 0,
          issues: Array.isArray(data.issues) ? data.issues : undefined,
          tips: Array.isArray(data.tips) ? data.tips : undefined,
        }
      }
    } catch {
      // Non-blocking: if health fails, still save the plant without health
    }

    // Build payload with conditional spreads (no undefined values)
    const base: any = {
      userId: user.uid,
      speciesName: identifyResult.speciesName || "Unknown",
      createdAt: serverTimestamp(),
    }

    const extra: any = {}
    if (typeof identifyResult.probability === "number") extra.probability = identifyResult.probability
    if (Array.isArray(identifyResult.commonNames) && identifyResult.commonNames.length)
      extra.commonNames = identifyResult.commonNames
    if (identifyResult.wiki && identifyResult.wiki.trim()) extra.wiki = identifyResult.wiki
    if (identifyResult.wikiUrl) extra.wikiUrl = identifyResult.wikiUrl
    if (saveNotes.trim()) extra.notes = saveNotes.trim()
    if (imageDataUrl) extra.imageBase64 = imageDataUrl
    if (health) extra.health = health

    const payload = { ...base, ...extra }
    await addDoc(collection(db, "plants"), payload)

    // reset
    setSaveNotes("")
    setIdentifyResult(null)
    setFile(null)
    setPreview(null)
    setImageDataUrl(null)
  }

  function onChooseFile(f?: File | null) {
    if (!f) return
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
    // Also get a data URL to save with the plant
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result) // data:image/...;base64,....
      }
    }
    reader.readAsDataURL(f)
  }

  async function addMeasurement(plantId: string, heightCm?: number, note?: string) {
    const measurementsCol = collection(db, "plants", plantId, "measurements")
    const extra = {
      heightCm: Number.isFinite(Number(heightCm)) ? Number(heightCm) : undefined,
      note: note && note.trim() ? note.trim() : undefined,
    }
    const payload = omitUndefined({ ...extra, createdAt: serverTimestamp() })
    await addDocAlias(measurementsCol, payload)
  }

  async function removePlant(plantId: string) {
    await deleteDoc(doc(db, "plants", plantId))
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please sign in to identify plants and manage your garden in real time.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Identify a plant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plant-image">Upload plant image</Label>
                <Input
                  id="plant-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChooseFile(e.target.files?.[0] ?? null)}
                />
                {preview ? (
                  // Using placeholder in case preview fails
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Selected plant"
                    className="mt-2 h-48 w-full rounded-md object-cover"
                    crossOrigin="anonymous"
                  />
                ) : null}
                {identifyError ? <p className="text-destructive text-sm">{identifyError}</p> : null}
                <div className="flex items-center gap-2">
                  <Button onClick={handleIdentify} disabled={identifyLoading || !file}>
                    {identifyLoading ? "Identifying..." : "Identify Plant"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Result</Label>
                {identifyResult ? (
                  <div className="rounded-md border p-3">
                    <div className="font-medium">{identifyResult.speciesName ?? "Unknown species"}</div>
                    {typeof identifyResult.probability === "number" ? (
                      <div className="text-sm text-muted-foreground">
                        Confidence: {(identifyResult.probability * 100).toFixed(1)}%
                      </div>
                    ) : null}
                    {identifyResult.commonNames?.length ? (
                      <div className="text-sm">Common names: {identifyResult.commonNames.join(", ")}</div>
                    ) : null}
                    {identifyResult.wiki ? (
                      <p className="mt-2 text-sm text-muted-foreground">{identifyResult.wiki}</p>
                    ) : null}
                    {identifyResult.wikiUrl ? (
                      <a href={identifyResult.wikiUrl} target="_blank" rel="noreferrer" className="text-sm underline">
                        Learn more
                      </a>
                    ) : null}

                    <div className="mt-3 space-y-2">
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Where did you find it? Light, soil, etc."
                        value={saveNotes}
                        onChange={(e) => setSaveNotes(e.target.value)}
                      />
                      <Button onClick={handleSave}>Save to My Garden</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Upload a photo and click Identify to see results here.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">My Plants (real-time)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!plants.length ? (
              <p className="text-sm text-muted-foreground">
                No plants saved yet. Identify one and click “Save to My Garden”.
              </p>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {plants.map((p) => (
                  <li key={p.id} className="rounded-md border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{p.speciesName}</div>
                      <Button variant="destructive" size="sm" onClick={() => removePlant(p.id)}>
                        Remove
                      </Button>
                    </div>
                    {typeof p.probability === "number" ? (
                      <div className="text-xs text-muted-foreground">
                        Confidence: {(p.probability * 100).toFixed(1)}%
                      </div>
                    ) : null}
                    {p.commonNames?.length ? (
                      <div className="text-xs">Also known as: {p.commonNames.slice(0, 5).join(", ")}</div>
                    ) : null}
                    {p.wiki ? <p className="text-xs text-muted-foreground line-clamp-3">{p.wiki}</p> : null}
                    {p.wikiUrl ? (
                      <a href={p.wikiUrl} target="_blank" rel="noreferrer" className="text-xs underline">
                        Details
                      </a>
                    ) : null}
                    {p.imageBase64 ? (
                      <img
                        src={p.imageBase64 || "/placeholder.svg"}
                        alt="Plant"
                        className="mt-2 h-24 w-full rounded-md object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : null}

                    <MeasurementForm onSubmit={(h, note) => addMeasurement(p.id, h, note)} />
                    <PlantMeasurements plantId={p.id} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function MeasurementForm({
  onSubmit,
}: {
  onSubmit: (heightCm?: number, note?: string) => Promise<void>
}) {
  const [height, setHeight] = React.useState<string>("")
  const [note, setNote] = React.useState<string>("")
  const [pending, setPending] = React.useState(false)

  return (
    <div className="mt-2 rounded-md border p-2 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input id="height" type="number" min="0" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="mnote">Note</Label>
          <Input id="mnote" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Leaves, growth, etc." />
        </div>
      </div>
      <Button
        size="sm"
        disabled={pending}
        onClick={async () => {
          try {
            setPending(true)
            const hVal = height ? Number(height) : undefined
            await onSubmit(isFinite(hVal as any) ? hVal : undefined, note || undefined)
            setHeight("")
            setNote("")
          } finally {
            setPending(false)
          }
        }}
      >
        Add measurement
      </Button>
    </div>
  )
}

function PlantMeasurements({ plantId }: { plantId: string }) {
  const [rows, setRows] = React.useState<Measurement[]>([])
  const db = React.useMemo(() => getFirestore(), [])

  React.useEffect(() => {
    const q = query(collection(db, "plants", plantId, "measurements"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      const out: Measurement[] = []
      snap.forEach((d) => {
        out.push(d.data() as Measurement)
      })
      setRows(out)
    })
    return () => unsub()
  }, [db, plantId])

  if (!rows.length) return null
  return (
    <div className="mt-2">
      <div className="text-xs font-medium mb-1">Measurements</div>
      <ul className="space-y-1">
        {rows.map((m, idx) => (
          <li key={idx} className="text-xs text-muted-foreground">
            {m.heightCm ? `${m.heightCm} cm` : "—"} · {m.note || "No note"}
          </li>
        ))}
      </ul>
    </div>
  )
}
