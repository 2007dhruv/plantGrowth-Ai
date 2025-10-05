"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function IdentifyPlantForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isIdentifying, setIsIdentifying] = useState(false)
  const [result, setResult] = useState<{
    species: string
    confidence: number
    careInstructions: string
  } | null>(null)
  const [plantName, setPlantName] = useState("")
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

  const handleIdentify = async () => {
    if (!file) return

    setIsIdentifying(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/identify-plant", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to identify plant")
      }

      const data = await response.json()
      setResult(data)
      setPlantName(data.species)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to identify plant")
    } finally {
      setIsIdentifying(false)
    }
  }

  const handleSave = async () => {
    if (!result || !file) return

    setIsIdentifying(true)
    setError(null)

    try {
      // Upload image to storage
      const formData = new FormData()
      formData.append("image", file)
      formData.append("name", plantName)
      formData.append("species", result.species)
      formData.append("confidence", result.confidence.toString())
      formData.append("careInstructions", result.careInstructions)

      const response = await fetch("/api/plants", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to save plant")
      }

      router.push("/dashboard/my-plants")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plant")
    } finally {
      setIsIdentifying(false)
    }
  }

  return (
    <div className="space-y-6">
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
            disabled={isIdentifying}
          />
          {file && !result && (
            <Button onClick={handleIdentify} disabled={isIdentifying} className="bg-green-600 hover:bg-green-700">
              {isIdentifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Identifying...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Identify
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

      {/* Identification Result */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Plant Identified!</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="plant-name">Plant Name (you can edit this)</Label>
                <Input
                  id="plant-name"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  className="mt-1 border-green-200 bg-white"
                />
              </div>

              <div>
                <Label>Species</Label>
                <p className="mt-1 text-sm text-green-700">{result.species}</p>
              </div>

              <div>
                <Label>Confidence</Label>
                <p className="mt-1 text-sm text-green-700">{(result.confidence * 100).toFixed(1)}%</p>
              </div>

              <div>
                <Label>Care Instructions</Label>
                <Textarea
                  value={result.careInstructions}
                  readOnly
                  className="mt-1 min-h-32 border-green-200 bg-white"
                />
              </div>

              <Button onClick={handleSave} disabled={isIdentifying} className="w-full bg-green-600 hover:bg-green-700">
                {isIdentifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save to My Plants"
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
