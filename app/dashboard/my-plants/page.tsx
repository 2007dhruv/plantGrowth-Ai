import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Plus } from "lucide-react"
import Link from "next/link"
import { PlantCard } from "@/components/plant-card"

export default async function MyPlantsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's plants
  const { data: plants } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">My Plants</h1>
          <p className="mt-2 text-green-700">Manage your plant collection and identify new plants</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/dashboard/my-plants/identify">
            <Plus className="mr-2 h-4 w-4" />
            Add Plant
          </Link>
        </Button>
      </div>

      {!plants || plants.length === 0 ? (
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Camera className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">No plants yet</CardTitle>
            <CardDescription>Start building your plant collection by identifying your first plant</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/dashboard/my-plants/identify">
                <Camera className="mr-2 h-4 w-4" />
                Identify Your First Plant
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  )
}
