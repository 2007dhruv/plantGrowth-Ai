"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  BookOpen,
  AlertTriangle,
  Bug,
  Leaf,
  Droplets,
  Wind,
  MessageCircle,
  ExternalLink,
  Grid3X3,
  List,
} from "lucide-react"
import Link from "next/link"

export default function DiseasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock disease data
  const diseases = [
    {
      id: 1,
      name: "Early Blight",
      scientificName: "Alternaria solani",
      category: "Fungal",
      severity: "moderate",
      affectedPlants: ["Tomato", "Potato", "Eggplant"],
      symptoms: [
        "Dark brown spots with concentric rings on leaves",
        "Yellowing around spots",
        "Leaf drop in severe cases",
        "Stem lesions near soil line",
      ],
      causes: ["High humidity", "Warm temperatures", "Poor air circulation", "Overhead watering"],
      prevention: [
        "Ensure good air circulation",
        "Water at soil level",
        "Remove infected plant debris",
        "Rotate crops annually",
      ],
      treatment: [
        "Apply copper-based fungicides",
        "Remove affected leaves immediately",
        "Improve drainage",
        "Use disease-resistant varieties",
      ],
      image: "/placeholder.svg?key=early-blight",
      commonality: "Very Common",
      discussionCount: 45,
      identificationAccuracy: 92,
    },
    {
      id: 2,
      name: "Powdery Mildew",
      scientificName: "Erysiphe cichoracearum",
      category: "Fungal",
      severity: "mild",
      affectedPlants: ["Rose", "Cucumber", "Zucchini", "Pumpkin"],
      symptoms: [
        "White powdery coating on leaves",
        "Distorted leaf growth",
        "Yellowing of affected areas",
        "Stunted plant growth",
      ],
      causes: ["High humidity with dry conditions", "Poor air circulation", "Overcrowding", "Shade"],
      prevention: [
        "Plant in sunny locations",
        "Ensure proper spacing",
        "Avoid overhead watering",
        "Choose resistant varieties",
      ],
      treatment: [
        "Apply baking soda spray",
        "Use sulfur-based fungicides",
        "Improve air circulation",
        "Remove affected plant parts",
      ],
      image: "/placeholder.svg?key=powdery-mildew",
      commonality: "Common",
      discussionCount: 32,
      identificationAccuracy: 88,
    },
    {
      id: 3,
      name: "Black Spot",
      scientificName: "Diplocarpon rosae",
      category: "Fungal",
      severity: "moderate",
      affectedPlants: ["Rose"],
      symptoms: [
        "Black circular spots on leaves",
        "Yellow halos around spots",
        "Premature leaf drop",
        "Weakened plant structure",
      ],
      causes: ["Wet foliage", "High humidity", "Poor air circulation", "Overhead watering"],
      prevention: [
        "Water at soil level",
        "Prune for air circulation",
        "Clean up fallen leaves",
        "Choose resistant varieties",
      ],
      treatment: [
        "Apply fungicidal sprays",
        "Remove infected leaves",
        "Improve garden hygiene",
        "Use preventive treatments",
      ],
      image: "/placeholder.svg?key=black-spot",
      commonality: "Common",
      discussionCount: 28,
      identificationAccuracy: 94,
    },
    {
      id: 4,
      name: "Aphid Infestation",
      scientificName: "Aphidoidea",
      category: "Pest",
      severity: "mild",
      affectedPlants: ["Most plants"],
      symptoms: [
        "Small green/black insects on stems",
        "Sticky honeydew on leaves",
        "Curled or distorted leaves",
        "Yellowing foliage",
      ],
      causes: ["Warm weather", "New plant growth", "Ant farming", "Stressed plants"],
      prevention: [
        "Encourage beneficial insects",
        "Regular plant inspection",
        "Avoid over-fertilizing",
        "Use companion planting",
      ],
      treatment: ["Spray with water", "Apply insecticidal soap", "Release ladybugs", "Use neem oil"],
      image: "/placeholder.svg?key=aphids",
      commonality: "Very Common",
      discussionCount: 67,
      identificationAccuracy: 96,
    },
    {
      id: 5,
      name: "Root Rot",
      scientificName: "Phytophthora spp.",
      category: "Fungal",
      severity: "severe",
      affectedPlants: ["Most plants"],
      symptoms: ["Wilting despite moist soil", "Yellowing leaves", "Soft, brown roots", "Stunted growth"],
      causes: ["Overwatering", "Poor drainage", "Contaminated soil", "Root damage"],
      prevention: ["Ensure proper drainage", "Water appropriately", "Use sterile potting mix", "Avoid root damage"],
      treatment: [
        "Improve drainage immediately",
        "Reduce watering frequency",
        "Remove affected roots",
        "Apply fungicide treatment",
      ],
      image: "/placeholder.svg?key=root-rot",
      commonality: "Common",
      discussionCount: 89,
      identificationAccuracy: 85,
    },
    {
      id: 6,
      name: "Leaf Miners",
      scientificName: "Liriomyza spp.",
      category: "Pest",
      severity: "mild",
      affectedPlants: ["Spinach", "Lettuce", "Tomato", "Bean"],
      symptoms: ["Serpentine trails in leaves", "White or brown tunnels", "Leaf stippling", "Reduced photosynthesis"],
      causes: ["Adult flies laying eggs", "Warm weather", "Tender new growth", "Garden proximity"],
      prevention: ["Use row covers", "Remove affected leaves", "Encourage beneficial insects", "Regular monitoring"],
      treatment: [
        "Remove infected leaves",
        "Apply beneficial nematodes",
        "Use yellow sticky traps",
        "Spray with neem oil",
      ],
      image: "/placeholder.svg?key=leaf-miners",
      commonality: "Moderate",
      discussionCount: 23,
      identificationAccuracy: 91,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "text-success"
      case "moderate":
        return "text-warning"
      case "severe":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "mild":
        return "status-healthy"
      case "moderate":
        return "status-warning"
      case "severe":
        return "status-critical"
      default:
        return ""
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Fungal":
        return <Droplets className="h-4 w-4" />
      case "Pest":
        return <Bug className="h-4 w-4" />
      case "Bacterial":
        return <AlertTriangle className="h-4 w-4" />
      case "Viral":
        return <Wind className="h-4 w-4" />
      default:
        return <Leaf className="h-4 w-4" />
    }
  }

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.affectedPlants.some((plant) => plant.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || disease.category.toLowerCase() === selectedCategory
    const matchesSeverity = selectedSeverity === "all" || disease.severity === selectedSeverity

    return matchesSearch && matchesCategory && matchesSeverity
  })

  const DiseaseCard = ({ disease }: { disease: (typeof diseases)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={disease.image || "/placeholder.svg"}
            alt={disease.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-3 right-3">
            <Badge className={getSeverityBadgeClass(disease.severity)}>{disease.severity}</Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              {getCategoryIcon(disease.category)}
              {disease.category}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-lg mb-1">{disease.name}</h3>
            <p className="text-sm text-muted-foreground italic">{disease.scientificName}</p>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div>
              <span className="font-medium">Affects:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {disease.affectedPlants.slice(0, 3).map((plant, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {plant}
                  </Badge>
                ))}
                {disease.affectedPlants.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{disease.affectedPlants.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{disease.commonality}</span>
              <span>{disease.identificationAccuracy}% accuracy</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/diseases/${disease.id}`}>Learn More</Link>
            </Button>
            <Button size="sm" variant="outline">
              <MessageCircle className="h-4 w-4 mr-1" />
              {disease.discussionCount}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const DiseaseListItem = ({ disease }: { disease: (typeof diseases)[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={disease.image || "/placeholder.svg"}
            alt={disease.name}
            className="w-16 h-16 object-cover rounded-lg"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{disease.name}</h3>
              <Badge className={getSeverityBadgeClass(disease.severity)}>{disease.severity}</Badge>
            </div>
            <p className="text-sm text-muted-foreground italic mb-2">{disease.scientificName}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="flex items-center gap-1">
                {getCategoryIcon(disease.category)}
                {disease.category}
              </Badge>
              <span>•</span>
              <span>{disease.commonality}</span>
              <span>•</span>
              <span>{disease.identificationAccuracy}% accuracy</span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex gap-2 mb-2">
              <Button size="sm" asChild>
                <Link href={`/diseases/${disease.id}`}>View Details</Link>
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-1" />
                {disease.discussionCount}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">Affects {disease.affectedPlants.length} plant types</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Disease Library</h1>
            <p className="text-muted-foreground">Comprehensive database of plant diseases and treatments</p>
          </div>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Suggest Addition
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{diseases.length}</div>
              <div className="text-sm text-muted-foreground">Total Diseases</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{diseases.filter((d) => d.category === "Fungal").length}</div>
              <div className="text-sm text-muted-foreground">Fungal</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Bug className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{diseases.filter((d) => d.category === "Pest").length}</div>
              <div className="text-sm text-muted-foreground">Pests</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">
                {diseases.reduce((sum, disease) => sum + disease.discussionCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Discussions</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Diseases</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="plants">By Plant Type</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-3 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search diseases, plants, symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fungal">Fungal</SelectItem>
                    <SelectItem value="pest">Pest</SelectItem>
                    <SelectItem value="bacterial">Bacterial</SelectItem>
                    <SelectItem value="viral">Viral</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Disease Display */}
            {filteredDiseases.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No diseases found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
                  <Button variant="outline">Clear Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredDiseases.map((disease) =>
                  viewMode === "grid" ? (
                    <DiseaseCard key={disease.id} disease={disease} />
                  ) : (
                    <DiseaseListItem key={disease.id} disease={disease} />
                  ),
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <Droplets className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fungal Diseases</h3>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {diseases.filter((d) => d.category === "Fungal").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Caused by fungi, often thrive in humid conditions</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <Bug className="h-12 w-12 text-warning" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Pest Issues</h3>
                  <p className="text-3xl font-bold text-warning mb-2">
                    {diseases.filter((d) => d.category === "Pest").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Insects and other pests that damage plants</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Bacterial</h3>
                  <p className="text-3xl font-bold text-destructive mb-2">0</p>
                  <p className="text-sm text-muted-foreground">Bacterial infections and related issues</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <Wind className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Viral</h3>
                  <p className="text-3xl font-bold text-muted-foreground mb-2">0</p>
                  <p className="text-sm text-muted-foreground">Viral diseases affecting plant health</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plants">
            <Card>
              <CardHeader>
                <CardTitle>Browse by Plant Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Leaf className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Plant-Specific View Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Browse diseases organized by specific plant types for targeted information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
