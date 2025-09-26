"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Save,
  Share2,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Leaf,
  Calendar,
  Ruler,
  Palette,
  Bug,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

export default function ResultsPage() {
  const [showSegmentation, setShowSegmentation] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Mock analysis data
  const analysisData = {
    image: "/healthy-tomato-plant.jpg",
    overallHealth: {
      status: "healthy",
      score: 92,
      description: "Your plant appears to be in excellent health with vibrant foliage and strong structure.",
    },
    germinationStage: {
      stage: "Vegetative Growth",
      day: 45,
      description: "Plant is in active vegetative growth phase with strong leaf development.",
    },
    leafArea: {
      measurement: "847 cm²",
      percentageIncrease: 12,
      description: "Leaf area has increased by 12% since last analysis, indicating healthy growth.",
    },
    pigmentation: {
      chlorophyll: 85,
      carotenoids: 78,
      anthocyanins: 23,
      description: "Excellent chlorophyll levels indicate optimal photosynthesis capacity.",
    },
    diseases: [
      {
        name: "Early Blight",
        confidence: 15,
        severity: "low",
        description: "Very low probability of early blight. Continue current care routine.",
      },
      {
        name: "Powdery Mildew",
        confidence: 8,
        severity: "low",
        description: "No signs of powdery mildew detected.",
      },
    ],
    recommendations: [
      "Continue current watering schedule",
      "Consider light fertilization in 2 weeks",
      "Monitor for pest activity on undersides of leaves",
      "Ensure adequate air circulation around plant",
    ],
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case "critical":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-success"
      case "warning":
        return "text-warning"
      case "critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getHealthBadgeClass = (status: string) => {
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

  const saveAnalysis = async () => {
    try {
      if (!user) {
        toast({ title: "Sign in required", description: "Please sign in to save your analysis." })
        return
      }
      await addDoc(collection(db, "analyses"), {
        uid: user.uid,
        image: analysisData.image,
        overallHealth: analysisData.overallHealth,
        germinationStage: analysisData.germinationStage,
        leafArea: analysisData.leafArea,
        pigmentation: analysisData.pigmentation,
        diseases: analysisData.diseases,
        recommendations: analysisData.recommendations,
        createdAt: serverTimestamp(),
      })
      toast({ title: "Saved", description: "Analysis saved to your history." })
    } catch (e: any) {
      console.log("[v0] Save analysis error:", e?.message)
      toast({ title: "Save failed", description: e?.message || "Could not save analysis." })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Analysis Results</h1>
              <p className="text-muted-foreground">Completed just now</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={saveAnalysis}>
              <Save className="h-4 w-4 mr-2" />
              Save Analysis
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share to Community
            </Button>
            <Button>
              <RotateCcw className="h-4 w-4 mr-2" />
              Analyze Another
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Plant Image</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowSegmentation(!showSegmentation)}>
                    {showSegmentation ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Segmentation
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show Segmentation
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src={analysisData.image || "/placeholder.svg"}
                    alt="Plant analysis"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {showSegmentation && (
                    <div className="absolute inset-0 bg-primary/20 rounded-lg border-2 border-primary/50">
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                        Leaf Segmentation Active
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">{getHealthIcon(analysisData.overallHealth.status)}</div>
                  <div className="text-2xl font-bold mb-1">{analysisData.overallHealth.score}%</div>
                  <div className="text-sm text-muted-foreground">Health Score</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold mb-1">Day {analysisData.germinationStage.day}</div>
                  <div className="text-sm text-muted-foreground">Growth Stage</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            {/* Overall Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getHealthIcon(analysisData.overallHealth.status)}
                  Overall Health Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Health Score</span>
                  <Badge className={getHealthBadgeClass(analysisData.overallHealth.status)}>
                    {analysisData.overallHealth.status.toUpperCase()}
                  </Badge>
                </div>
                <Progress value={analysisData.overallHealth.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{analysisData.overallHealth.description}</p>
              </CardContent>
            </Card>

            {/* Germination Stage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Germination Stage & Day
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Stage</span>
                  <Badge variant="secondary">{analysisData.germinationStage.stage}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Day</span>
                  <span className="font-semibold">{analysisData.germinationStage.day}</span>
                </div>
                <p className="text-sm text-muted-foreground">{analysisData.germinationStage.description}</p>
              </CardContent>
            </Card>

            {/* Leaf Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  Leaf Area Measurement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Area</span>
                  <span className="font-semibold">{analysisData.leafArea.measurement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Growth Rate</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="font-semibold text-success">+{analysisData.leafArea.percentageIncrease}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{analysisData.leafArea.description}</p>
              </CardContent>
            </Card>

            {/* Pigmentation Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Pigmentation Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chlorophyll</span>
                    <span className="font-semibold">{analysisData.pigmentation.chlorophyll}%</span>
                  </div>
                  <Progress value={analysisData.pigmentation.chlorophyll} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Carotenoids</span>
                    <span className="font-semibold">{analysisData.pigmentation.carotenoids}%</span>
                  </div>
                  <Progress value={analysisData.pigmentation.carotenoids} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Anthocyanins</span>
                    <span className="font-semibold">{analysisData.pigmentation.anthocyanins}%</span>
                  </div>
                  <Progress value={analysisData.pigmentation.anthocyanins} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">{analysisData.pigmentation.description}</p>
              </CardContent>
            </Card>

            {/* Disease Detection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5 text-primary" />
                  Disease Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisData.diseases.map((disease, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{disease.name}</span>
                      <Badge variant={disease.confidence > 50 ? "destructive" : "secondary"}>
                        {disease.confidence}% confidence
                      </Badge>
                    </div>
                    <Progress value={disease.confidence} className="h-2" />
                    <p className="text-xs text-muted-foreground">{disease.description}</p>
                    {index < analysisData.diseases.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Care Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisData.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
