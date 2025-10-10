import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Plus } from "lucide-react"
import Link from "next/link"
import { HealthCheckCard } from "@/components/health-check-card"

export default async function PlantHealthPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's health checks
  const { data: healthChecks } = await supabase
    .from("health_checks")
    .select("*, plants(name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Plant Health</h1>
          <p className="mt-2 text-green-700">Detect diseases and get AI-powered recovery plans</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/dashboard/plant-health/scan">
            <Plus className="mr-2 h-4 w-4" />
            New Scan
          </Link>
        </Button>
      </div>

      {!healthChecks || healthChecks.length === 0 ? (
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">No health checks yet</CardTitle>
            <CardDescription>Start monitoring your plants' health with AI-powered disease detection</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/dashboard/plant-health/scan">
                <Heart className="mr-2 h-4 w-4" />
                Scan Your First Plant
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {healthChecks.map((check) => (
            <HealthCheckCard key={check.id} healthCheck={check} />
          ))}
        </div>
      )}
    </div>
  )
}
