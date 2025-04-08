import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prasad Chattar - Portfolio",
  description: "A modern portfolio website showcasing my work, skills, and experience in web development.",
  icons: {
    icon: [
      {
        url: "/placeholder-logo-modified.png",
        href: "/placeholder-logo-modified.png",
      },
    ],
    apple: [
      {
        url: "/placeholder-logo-modified.png",
        href: "/placeholder-logo-modified.png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/placeholder-logo-modified.png" />
        <link rel="apple-touch-icon" href="/placeholder-logo-modified.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'