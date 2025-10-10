import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search-bar"
import { AlertTriangle, Leaf } from "lucide-react"
import Image from "next/image"

export default async function DiseasesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient()
  const params = await searchParams
  const searchQuery = params.q || ""

  // Fetch diseases with optional search
  let query = supabase.from("diseases").select("*").order("name", { ascending: true })

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  const { data: diseases } = await query

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-900">Disease Library</h1>
        <p className="mt-2 text-green-700">Browse and learn about common plant diseases</p>
      </div>

      <div className="mb-8">
        <SearchBar placeholder="Search diseases..." defaultValue={searchQuery} />
      </div>

      {diseases && diseases.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {diseases.map((disease) => (
            <Card key={disease.id} className="border-green-200 transition-shadow hover:shadow-md">
              {disease.image_url && (
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={disease.image_url || "/placeholder.svg"}
                    alt={disease.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      {disease.name}
                    </CardTitle>
                    {disease.scientific_name && (
                      <CardDescription className="mt-1 italic">{disease.scientific_name}</CardDescription>
                    )}
                  </div>
                  {disease.severity && (
                    <Badge
                      variant="outline"
                      className={
                        disease.severity === "mild"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : disease.severity === "moderate"
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : "bg-red-100 text-red-700 border-red-200"
                      }
                    >
                      {disease.severity}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-green-900">Description</h4>
                  <p className="line-clamp-3 text-sm text-green-700">{disease.description}</p>
                </div>

                {disease.symptoms && disease.symptoms.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-green-900">Key Symptoms</h4>
                    <ul className="space-y-1">
                      {disease.symptoms.slice(0, 3).map((symptom: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-600" />
                          <span className="line-clamp-1">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {disease.affected_plants && disease.affected_plants.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-green-900">Affected Plants</h4>
                    <div className="flex flex-wrap gap-1">
                      {disease.affected_plants.slice(0, 4).map((plant: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          <Leaf className="mr-1 h-3 w-3" />
                          {plant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-green-900">Treatment</h4>
                  <p className="line-clamp-2 text-sm text-green-700">{disease.treatment}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-green-200">
          <CardContent className="py-12 text-center">
            <p className="text-green-700">
              {searchQuery ? `No diseases found matching "${searchQuery}"` : "No diseases in the library yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
