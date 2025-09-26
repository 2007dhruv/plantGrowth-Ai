import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "PlantGrowth AI - Monitor, Share, and Grow Together",
  description: "Complete plant health monitoring and community platform powered by AI",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense>
          <Providers>{children}</Providers>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
