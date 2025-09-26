"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, orderBy, query, where, type Timestamp } from "firebase/firestore"
import { Separator } from "@/components/ui/separator"

type Analysis = {
  id: string
  image?: string
  overallHealth?: { status: string; score: number; description?: string }
  germinationStage?: { stage: string; day: number }
  createdAt?: Timestamp
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "analyses"), where("uid", "==", user.uid), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      const rows: Analysis[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      setItems(rows)
      setLoading(false)
    })
    return () => unsub()
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">History</h1>
          <Button asChild>
            <Link href="/">Analyze New</Link>
          </Button>
        </div>

        {!user ? (
          <Card>
            <CardContent className="p-6">
              <p className="mb-4">Please sign in to view your analysis history.</p>
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">No analyses yet. Run your first analysis to see it here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((a, idx) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Health Score: {a.overallHealth?.score ?? "—"}%</span>
                    <span className="text-sm text-muted-foreground">
                      {a.createdAt?.toDate().toLocaleString() ?? ""}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 items-center">
                  <img
                    src={a.image || "/placeholder.svg?height=96&width=128&query=analysis%20image"}
                    alt="Analysis"
                    className="w-32 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm">
                      <div>
                        Stage: {a.germinationStage?.stage ?? "—"} • Day {a.germinationStage?.day ?? "—"}
                      </div>
                      <div className="text-muted-foreground">{a.overallHealth?.description || "—"}</div>
                    </div>
                  </div>
                </CardContent>
                {idx < items.length - 1 && <Separator />}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
