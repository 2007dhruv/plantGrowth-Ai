import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, AlertCircle } from "lucide-react"

export default async function ErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-900">PlantGrowth AI</h1>
          </div>
        </div>

        <Card className="border-red-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-900">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <p className="text-center text-sm text-muted-foreground">Error: {params.error}</p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                An unexpected error occurred during authentication.
              </p>
            )}
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/auth/login">Back to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
