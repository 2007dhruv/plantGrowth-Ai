import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Calendar, AlertTriangle } from "lucide-react"

interface HealthCheck {
  id: string
  image_url: string
  disease_detected: string | null
  confidence: number | null
  severity: string | null
  recovery_plan: string | null
  status: string
  created_at: string
  plants?: {
    name: string
  } | null
}

interface HealthCheckCardProps {
  healthCheck: HealthCheck
}

export function HealthCheckCard({ healthCheck }: HealthCheckCardProps) {
  const createdDate = new Date(healthCheck.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const getSeverityColor = (severity: string | null) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "moderate":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "severe":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gray-100 text-gray-700"
      case "analyzed":
        return "bg-blue-100 text-blue-700"
      case "recovering":
        return "bg-yellow-100 text-yellow-700"
      case "recovered":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="border-green-200 transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        <Image
          src={healthCheck.image_url || "/placeholder.svg"}
          alt={healthCheck.disease_detected || "Plant health check"}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg text-green-900">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              {healthCheck.disease_detected || "Unknown Disease"}
            </CardTitle>
            {healthCheck.plants && <CardDescription className="mt-1">{healthCheck.plants.name}</CardDescription>}
          </div>
          {healthCheck.severity && (
            <Badge variant="outline" className={getSeverityColor(healthCheck.severity)}>
              {healthCheck.severity}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthCheck.confidence && (
            <div className="text-sm text-green-700">
              Confidence: <span className="font-medium">{(healthCheck.confidence * 100).toFixed(0)}%</span>
            </div>
          )}
          {healthCheck.recovery_plan && (
            <p className="line-clamp-2 text-sm text-green-700">{healthCheck.recovery_plan}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Calendar className="h-3 w-3" />
              <span>{createdDate}</span>
            </div>
            <Badge className={getStatusColor(healthCheck.status)}>{healthCheck.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
