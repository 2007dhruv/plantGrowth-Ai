"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password, displayName || undefined)
      }
      router.push("/")
    } catch (err: any) {
      console.log("[v0] Auth error:", err?.message)
      setError(err?.message || "Authentication failed")
    }
  }

  const onGoogle = async () => {
    setError(null)
    try {
      await signInWithGoogle()
      router.push("/")
    } catch (err: any) {
      console.log("[v0] Google sign-in error:", err?.message)
      setError(err?.message || "Google sign-in failed")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{mode === "signin" ? "Sign in" : "Create account"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={onEmailSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {mode === "signin" ? "Sign in" : "Sign up"}
                </Button>
              </form>

              <Separator />
              <Button variant="outline" className="w-full bg-transparent" onClick={onGoogle}>
                Continue with Google
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {mode === "signin" ? (
                  <>
                    {"Don't have an account? "}
                    <button className="text-primary" onClick={() => setMode("signup")}>
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    {"Already have an account? "}
                    <button className="text-primary" onClick={() => setMode("signin")}>
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
