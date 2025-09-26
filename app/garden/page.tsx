"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Calendar,
  TrendingUp,
  Leaf,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Eye,
  Share2,
  Trash2,
} from "lucide-react"
import Link from "next/link"

export default function GardenPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  // Mock garden data
  const gardenStats = {
    totalPlants: 12,
    healthyPlants: 9,
    atRiskPlants: 2,
    criticalPlants: 1,
    avgHealthScore: 87,
    totalAnalyses: 45,
    growthTrend: 12,
  }

  const plants = [
    {
      id: 1,
      name: "Cherry Tomato",
      type: "Vegetable",
      status: "healthy",
      healthScore: 94,
      lastAnalyzed: "2 hours ago",
      plantedDate: "2024-01-15",
      image: "/healthy-tomato-plant.jpg",
      analyses: 8,
      stage: "Flowering",
    },
    {
      id: 2,
      name: "Garden Rose",
      type: "Flower",
      status: "warning",
      healthScore: 76,
      lastAnalyzed: "1 day ago",
      plantedDate: "2024-02-01",
      image: "/rose-bush-with-spots.jpg",
      analyses: 5,
      stage: "Vegetative",
    },
    {
      id: 3,
      name: "Sweet Basil",
      type: "Herb",
      status: "critical",
      healthScore: 45,
      lastAnalyzed: "3 days ago",
      plantedDate: "2024-02-20",
      image: "/diseased-basil-plant.jpg",
      analyses: 3,
      stage: "Declining",
    },
    {
      id: 4,
      name: "Sunflower",
      type: "Flower",
      status: "healthy",
      healthScore: 91,
      lastAnalyzed: "5 hours ago",
      plantedDate: "2024-01-10",
      image: "/placeholder.svg?key=sunflower",
      analyses: 12,
      stage: "Mature",
    },
    {
      id: 5,
      name: "Mint",
      type: "Herb",
      status: "healthy",
      healthScore: 88,
      lastAnalyzed: "1 day ago",
      plantedDate: "2024-02-05",
      image: "/placeholder.svg?key=mint",
      analyses: 6,
      stage: "Vegetative",
    },
    {
      id: 6,
      name: "Bell Pepper",
      type: "Vegetable",
      status: "warning",
      healthScore: 72,
      lastAnalyzed: "2 days ago",
      plantedDate: "2024-01-25",
      image: "/placeholder.svg?key=pepper",
      analyses: 7,
      stage: "Fruiting",
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

  const getStatusBadgeClass = (status: string) => {
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

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || plant.status === filterStatus
    const matchesType = filterType === "all" || plant.type.toLowerCase() === filterType.toLowerCase()

    return matchesSearch && matchesStatus && matchesType
  })

  const PlantCard = ({ plant }: { plant: (typeof plants)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={plant.image || "/placeholder.svg"}
            alt={plant.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share to Community
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from Garden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute top-3 left-3">
            <Badge className={getStatusBadgeClass(plant.status)}>{plant.healthScore}%</Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{plant.name}</h3>
            {getStatusIcon(plant.status)}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Type:</span>
              <span>{plant.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Stage:</span>
              <span>{plant.stage}</span>
            </div>
            <div className="flex justify-between">
              <span>Analyses:</span>
              <span>{plant.analyses}</span>
            </div>
            <div className="flex justify-between">
              <span>Last checked:</span>
              <span>{plant.lastAnalyzed}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/garden/${plant.id}`}>View Progress</Link>
            </Button>
            <Button size="sm" variant="outline">
              Analyze Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PlantListItem = ({ plant }: { plant: (typeof plants)[0] }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img src={plant.image || "/placeholder.svg"} alt={plant.name} className="w-16 h-16 object-cover rounded-lg" />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{plant.name}</h3>
              {getStatusIcon(plant.status)}
            </div>
            <div className="text-sm text-muted-foreground">
              {plant.type} • {plant.stage} • {plant.analyses} analyses
            </div>
          </div>

          <div className="text-right">
            <Badge className={getStatusBadgeClass(plant.status)}>{plant.healthScore}%</Badge>
            <div className="text-xs text-muted-foreground mt-1">{plant.lastAnalyzed}</div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" asChild>
              <Link href={`/garden/${plant.id}`}>View</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share to Community
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from Garden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <h1 className="text-3xl font-bold">My Garden</h1>
            <p className="text-muted-foreground">Track and monitor your plant collection</p>
          </div>
          <Button asChild>
            <Link href="/">
              <Plus className="h-4 w-4 mr-2" />
              Add New Plant
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plants">Plants</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{gardenStats.totalPlants}</div>
                  <div className="text-sm text-muted-foreground">Total Plants</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <div className="text-2xl font-bold">{gardenStats.healthyPlants}</div>
                  <div className="text-sm text-muted-foreground">Healthy Plants</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{gardenStats.avgHealthScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Health</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{gardenStats.totalAnalyses}</div>
                  <div className="text-sm text-muted-foreground">Total Analyses</div>
                </CardContent>
              </Card>
            </div>

            {/* Health Status Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="status-healthy">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
                  <div className="text-3xl font-bold text-success">{gardenStats.healthyPlants}</div>
                  <div className="text-sm font-medium">Healthy Plants</div>
                </CardContent>
              </Card>

              <Card className="status-warning">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-warning" />
                  <div className="text-3xl font-bold text-warning">{gardenStats.atRiskPlants}</div>
                  <div className="text-sm font-medium">At Risk Plants</div>
                </CardContent>
              </Card>

              <Card className="status-critical">
                <CardContent className="p-6 text-center">
                  <XCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
                  <div className="text-3xl font-bold text-destructive">{gardenStats.criticalPlants}</div>
                  <div className="text-sm font-medium">Critical Plants</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plants" className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-3 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search plants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="warning">At Risk</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vegetable">Vegetable</SelectItem>
                    <SelectItem value="flower">Flower</SelectItem>
                    <SelectItem value="herb">Herb</SelectItem>
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

            {/* Plants Display */}
            {filteredPlants.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Leaf className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No plants found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterStatus !== "all" || filterType !== "all"
                      ? "Try adjusting your search or filters"
                      : "Start by analyzing your first plant to add it to your garden"}
                  </p>
                  <Button asChild>
                    <Link href="/">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Plant
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredPlants.map((plant) =>
                  viewMode === "grid" ? (
                    <PlantCard key={plant.id} plant={plant} />
                  ) : (
                    <PlantListItem key={plant.id} plant={plant} />
                  ),
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Garden Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Calendar View Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Track planting dates, growth milestones, and care schedules in an interactive calendar view.
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
