import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Camera, Heart, Users, BookOpen, Leaf, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single()

  // Fetch user's plants count
  const { count: plantsCount } = await supabase
    .from("plants")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)

  // Fetch user's health checks count
  const { count: healthChecksCount } = await supabase
    .from("health_checks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)

  // Fetch user's posts count
  const { count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-900">
          Welcome back, {profile?.full_name || profile?.username || "Plant Lover"}!
        </h1>
        <p className="mt-2 text-green-700">Here's what's happening with your plants today</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">My Plants</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{plantsCount || 0}</div>
            <p className="text-xs text-green-600">Plants in your collection</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Health Checks</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{healthChecksCount || 0}</div>
            <p className="text-xs text-green-600">Disease scans performed</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Community Posts</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{postsCount || 0}</div>
            <p className="text-xs text-green-600">Posts shared</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">+12%</div>
            <p className="text-xs text-green-600">Plant health improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-green-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-green-200 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-900">Identify Plant</CardTitle>
              <CardDescription>Snap a photo to identify any plant</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/dashboard/my-plants">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-900">Check Plant Health</CardTitle>
              <CardDescription>Detect diseases and get recovery plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/dashboard/plant-health">Scan Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-900">Join Community</CardTitle>
              <CardDescription>Share and learn from plant lovers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/dashboard/community">Explore</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-900">Disease Library</CardTitle>
              <CardDescription>Browse plant disease information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/dashboard/diseases">Browse</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
