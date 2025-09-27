"use client"

import React from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"

type Health = { status: "healthy" | "warning" | "critical"; score: number }
type PlantRow = { id: string; health?: Health }

export default function HealthOverview() {
  const [user, setUser] = React.useState<ReturnType<(typeof auth)["currentUser"]> | null>(null)
  const [rows, setRows] = React.useState<PlantRow[]>([])

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  React.useEffect(() => {
    if (!user) {
      setRows([])
      return
    }

    // Subscribe to both locations and merge
    const unsubs: Array<() => void> = []

    const q1 = query(collection(db, "users", user.uid, "plants"), orderBy("createdAt", "desc"))
    unsubs.push(
      onSnapshot(q1, (snap) => {
        const list: PlantRow[] = []
        snap.forEach((d) => {
          const data = d.data() as any
          list.push({ id: d.id, health: data?.health })
        })
        setRows((prev) => mergeById(prev, list))
      }),
    )

    const q2 = query(collection(db, "plants"), orderBy("createdAt", "desc"))
    unsubs.push(
      onSnapshot(q2, (snap) => {
        const list: PlantRow[] = []
        snap.forEach((d) => {
          const data = d.data() as any
          // Only include current user's plants if userId matches
          if (data?.userId === user.uid) list.push({ id: d.id, health: data?.health })
        })
        setRows((prev) => mergeById(prev, list))
      }),
    )

    return () => {
      unsubs.forEach((u) => u())
    }
  }, [user])

  const stats = React.useMemo(() => {
    const total = rows.length
    const healthy = rows.filter((r) => r.health?.status === "healthy").length
    const warning = rows.filter((r) => r.health?.status === "warning").length
    const critical = rows.filter((r) => r.health?.status === "critical").length
    const scores = rows
      .map((r) => (typeof r.health?.score === "number" ? r.health!.score : null))
      .filter((v) => v !== null) as number[]
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return { total, healthy, warning, critical, avg, analyses: rows.length } // simple proxy
  }, [rows])

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Plants</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div className="text-2xl font-bold">{stats.healthy}</div>
          <div className="text-sm text-muted-foreground">Healthy</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>
          <div className="text-2xl font-bold">{stats.warning}</div>
          <div className="text-sm text-muted-foreground">At Risk</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <div className="text-2xl font-bold">{stats.avg}%</div>
          <div className="text-sm text-muted-foreground">Avg Health</div>
        </CardContent>
      </Card>
    </div>
  )
}

function mergeById(prev: PlantRow[], next: PlantRow[]) {
  const map = new Map<string, PlantRow>()
  ;[...prev, ...next].forEach((r) => map.set(r.id, r))
  return Array.from(map.values())
}
