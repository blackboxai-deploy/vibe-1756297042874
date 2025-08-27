import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WorkspaceProvider } from '@/lib/WorkspaceContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NotionClone - Your Productivity Workspace',
  description: 'A modern block-based productivity app inspired by Notion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WorkspaceProvider>
          <div className="flex h-screen bg-white">
            {children}
          </div>
        </WorkspaceProvider>
      </body>
    </html>
  )
}