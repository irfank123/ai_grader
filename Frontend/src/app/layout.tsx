import { Inter } from 'next/font/google'
import './globals.css'

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Grader',
  description: 'Master Math with AI-Powered Learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}