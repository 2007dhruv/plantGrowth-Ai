"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, Leaf, Users, BookOpen, TrendingUp, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export default function HomePage() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const stats = [
    { label: "Plants Analyzed", value: "12,847", icon: Leaf, color: "text-success" },
    { label: "Community Members", value: "3,421", icon: Users, color: "text-primary" },
    { label: "Disease Entries", value: "156", icon: BookOpen, color: "text-warning" },
    { label: "Success Rate", value: "94.2%", icon: TrendingUp, color: "text-success" },
  ]

  const recentAnalyses = [
    {
      id: 1,
      plant: "Tomato Plant",
      status: "healthy",
      confidence: 96,
      date: "2 hours ago",
      image: "/healthy-tomato-plant.jpg",
    },
    {
      id: 2,
      plant: "Rose Bush",
      status: "warning",
      confidence: 78,
      date: "5 hours ago",
      image: "/rose-bush-with-spots.jpg",
    },
    {
      id: 3,
      plant: "Basil",
      status: "critical",
      confidence: 89,
      date: "1 day ago",
      image: "/diseased-basil-plant.jpg",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "healthy":
        return "status-healthy"
      case "warning":
        return "status-warning"
      case "critical":
        return "status-critical"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">PlantGrowth AI</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Monitor, Share, and Grow Together</p>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered plant health analysis, personal garden management, and a thriving community of plant
            enthusiasts. Upload a photo to get instant insights about your plant's health, growth stage, and care
            recommendations.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-12 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Analyze Your Plant</h2>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                      alt="Selected plant"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                  <div className="flex gap-3 justify-center">
                    <Button size="lg" className="px-8">
                      Analyze Plant
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => setSelectedFile(null)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">Drop your plant image here</p>
                    <p className="text-sm text-muted-foreground mb-4">Supports JPG, PNG formats up to 10MB</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button size="lg" className="px-8" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </label>
                    </Button>
                    <Button variant="outline" size="lg">
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </Button>
                  </div>
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Analyses */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Recent Community Analyses</h3>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <img
                    src={analysis.image || "/placeholder.svg"}
                    alt={analysis.plant}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{analysis.plant}</h4>
                      {getStatusIcon(analysis.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{analysis.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusClass(analysis.status)}>{analysis.confidence}% confidence</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline">View All Analyses</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
