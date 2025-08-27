'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Editor } from '@/components/Editor'
import { WorkspaceProvider } from '@/lib/WorkspaceContext'

export default function Home() {
  const [selectedPageId, setSelectedPageId] = useState<string>('welcome')
  
  return (
    <WorkspaceProvider>
      <div className="flex h-screen w-full">
        <Sidebar 
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Editor pageId={selectedPageId} />
        </div>
      </div>
    </WorkspaceProvider>
  )
}