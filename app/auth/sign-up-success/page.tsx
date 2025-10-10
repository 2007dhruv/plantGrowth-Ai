import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-900">PlantGrowth AI</h1>
          </div>
        </div>

        <Card className="border-green-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">Check your email</CardTitle>
            <CardDescription>We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Please check your email and click the confirmation link to activate your account. Once confirmed, you can
              sign in and start your plant care journey.
            </p>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/auth/login">Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
