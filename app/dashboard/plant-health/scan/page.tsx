import { HealthScanForm } from "@/components/health-scan-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function ScanPlantPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's plants for selection
  const { data: plants } = await supabase.from("plants").select("id, name, species").eq("user_id", user!.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900">Plant Health Scan</h1>
          <p className="mt-2 text-green-700">Upload a photo to detect diseases and get recovery recommendations</p>
        </div>

        <Card className="border-green-200">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">Disease Detection</CardTitle>
            <CardDescription>
              Take a clear photo of the affected area showing any discoloration, spots, or unusual growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HealthScanForm plants={plants || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
