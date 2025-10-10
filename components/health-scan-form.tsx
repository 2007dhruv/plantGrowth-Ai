"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Plant {
  id: string
  name: string
  species: string | null
}

interface HealthScanFormProps {
  plants: Plant[]
}

export function HealthScanForm({ plants }: HealthScanFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedPlantId, setSelectedPlantId] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<{
    disease: string
    confidence: number
    severity: string
    recoveryPlan: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleScan = async () => {
    if (!file) return

    setIsScanning(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/scan-plant-health", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to scan plant")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan plant")
    } finally {
      setIsScanning(false)
    }
  }

  const handleSave = async () => {
    if (!result || !file) return

    setIsScanning(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("plantId", selectedPlantId)
      formData.append("disease", result.disease)
      formData.append("confidence", result.confidence.toString())
      formData.append("severity", result.severity)
      formData.append("recoveryPlan", result.recoveryPlan)

      const response = await fetch("/api/health-checks", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to save health check")
      }

      router.push("/dashboard/plant-health")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save health check")
    } finally {
      setIsScanning(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
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

  return (
    <div className="space-y-6">
      {/* Plant Selection */}
      {plants.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="plant-select">Select Plant (Optional)</Label>
          <Select value={selectedPlantId} onValueChange={setSelectedPlantId}>
            <SelectTrigger id="plant-select" className="border-green-200">
              <SelectValue placeholder="Choose a plant from your collection" />
            </SelectTrigger>
            <SelectContent>
              {plants.map((plant) => (
                <SelectItem key={plant.id} value={plant.id}>
                  {plant.name} {plant.species && `(${plant.species})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="plant-image">Plant Photo</Label>
        <div className="flex items-center gap-4">
          <Input
            id="plant-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border-green-200"
            disabled={isScanning}
          />
          {file && !result && (
            <Button onClick={handleScan} disabled={isScanning} className="bg-green-600 hover:bg-green-700">
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Scan
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {preview && (
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image src={preview || "/placeholder.svg"} alt="Plant preview" fill className="object-cover" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Result */}
      {result && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-semibold text-orange-900">Disease Detected</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Disease</Label>
                <p className="mt-1 text-lg font-medium text-orange-900">{result.disease}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Confidence</Label>
                  <p className="mt-1 text-sm text-orange-700">{(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <div className="flex-1">
                  <Label>Severity</Label>
                  <Badge className={`mt-1 ${getSeverityColor(result.severity)}`}>{result.severity}</Badge>
                </div>
              </div>

              <div>
                <Label>Recovery Plan</Label>
                <Textarea value={result.recoveryPlan} readOnly className="mt-1 min-h-40 border-orange-200 bg-white" />
              </div>

              <Button onClick={handleSave} disabled={isScanning} className="w-full bg-green-600 hover:bg-green-700">
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Health Check"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
