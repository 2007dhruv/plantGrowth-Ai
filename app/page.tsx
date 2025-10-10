import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Leaf, Camera, Heart, BookOpen, Sparkles, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-green-900">PlantGrowth AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-green-700 hover:text-green-900">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Plant Care</span>
          </div>
          <h1 className="text-balance text-5xl font-bold leading-tight text-green-900 md:text-6xl">
            Your Intelligent Plant Care Companion
          </h1>
          <p className="text-pretty text-lg text-green-700 md:text-xl">
            Identify plants instantly, diagnose diseases with AI, and connect with a community of plant enthusiasts.
            Keep your plants healthy and thriving.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/auth/sign-up">Start Free Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-green-900 md:text-4xl">Everything You Need for Plant Care</h2>
          <p className="mt-4 text-lg text-green-700">Powerful AI tools to help your plants thrive</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-green-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-green-900">Plant Identification</h3>
              <p className="text-green-700">
                Snap a photo and instantly identify any plant species with our advanced AI powered by Gemini.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-green-900">Disease Detection</h3>
              <p className="text-green-700">
                Detect plant diseases early with ML analysis and get personalized recovery plans to save your plants.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-green-900">Community</h3>
              <p className="text-green-700">
                Share your plant journey, get advice from experts, and connect with fellow plant enthusiasts.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-green-900">Disease Library</h3>
              <p className="text-green-700">
                Access a comprehensive database of plant diseases with symptoms, causes, and treatment guides.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-green-900">Care Recommendations</h3>
              <p className="text-green-700">
                Get personalized care instructions tailored to each plant in your collection.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-green-900">Plant Collection</h3>
              <p className="text-green-700">
                Organize and track all your plants in one place with photos and care history.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-green-200 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready to Transform Your Plant Care?</h2>
            <p className="mb-8 text-lg text-green-50">
              Join thousands of plant lovers using AI to keep their plants healthy
            </p>
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-green-700">
          <p>&copy; 2025 PlantGrowth AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
