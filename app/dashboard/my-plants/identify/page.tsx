import { IdentifyPlantForm } from "@/components/identify-plant-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera } from "lucide-react"

export default function IdentifyPlantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900">Identify Plant</h1>
          <p className="mt-2 text-green-700">Upload a photo to identify your plant using AI</p>
        </div>

        <Card className="border-green-200">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Camera className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">Plant Identification</CardTitle>
            <CardDescription>
              Take a clear photo of the plant, including leaves and any flowers if possible for best results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IdentifyPlantForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
