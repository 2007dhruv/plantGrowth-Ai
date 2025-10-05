import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Calendar, Sparkles } from "lucide-react"

interface Plant {
  id: string
  name: string
  species: string | null
  image_url: string | null
  ai_confidence: number | null
  care_instructions: string | null
  created_at: string
}

interface PlantCardProps {
  plant: Plant
}

export function PlantCard({ plant }: PlantCardProps) {
  const createdDate = new Date(plant.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="border-green-200 transition-shadow hover:shadow-md">
      {plant.image_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <Image src={plant.image_url || "/placeholder.svg"} alt={plant.name} fill className="object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-green-900">{plant.name}</CardTitle>
            {plant.species && <CardDescription className="mt-1">{plant.species}</CardDescription>}
          </div>
          {plant.ai_confidence && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Sparkles className="mr-1 h-3 w-3" />
              {(plant.ai_confidence * 100).toFixed(0)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {plant.care_instructions && (
          <p className="mb-3 line-clamp-2 text-sm text-green-700">{plant.care_instructions}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-green-600">
          <Calendar className="h-3 w-3" />
          <span>Added {createdDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}
