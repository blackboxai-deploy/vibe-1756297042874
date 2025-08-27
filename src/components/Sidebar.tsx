'use client'

import { useState } from 'react'
import { useWorkspace } from '@/lib/WorkspaceContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Page } from '@/lib/types'

interface SidebarProps {
  selectedPageId: string
  onSelectPage: (pageId: string) => void
}

export function Sidebar({ selectedPageId, onSelectPage }: SidebarProps) {
  const { workspace, createNewPage, deletePage } = useWorkspace()
  const [isCreating, setIsCreating] = useState(false)
  const [newPageTitle, setNewPageTitle] = useState('')

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      const page = createNewPage(newPageTitle.trim())
      setNewPageTitle('')
      setIsCreating(false)
      onSelectPage(page.id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreatePage()
    } else if (e.key === 'Escape') {
      setIsCreating(false)
      setNewPageTitle('')
    }
  }

  const topLevelPages = workspace.pageOrder
    .map(id => workspace.pages[id])
    .filter(page => !page.parentId)

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">NotionClone</h1>
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
          >
            +
          </Button>
        </div>
        
        {isCreating && (
          <Input
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!newPageTitle.trim()) {
                setIsCreating(false)
              }
            }}
            placeholder="Page title..."
            className="h-8 text-sm"
            autoFocus
          />
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {topLevelPages.map(page => (
            <PageItem
              key={page.id}
              page={page}
              isSelected={selectedPageId === page.id}
              onSelect={onSelectPage}
              onDelete={deletePage}
              allPages={workspace.pages}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

interface PageItemProps {
  page: Page
  isSelected: boolean
  onSelect: (pageId: string) => void
  onDelete: (pageId: string) => void
  allPages: Record<string, Page>
  level?: number
}

function PageItem({ page, isSelected, onSelect, onDelete, allPages, level = 0 }: PageItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (page.id !== 'welcome') {
      onDelete(page.id)
    }
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors",
          isSelected && "bg-blue-100 hover:bg-blue-100",
          level > 0 && "ml-4"
        )}
        onClick={() => onSelect(page.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm">{page.icon || '📄'}</span>
          <span className="text-sm text-gray-700 truncate">
            {page.title || 'Untitled'}
          </span>
        </div>
        
        {isHovered && page.id !== 'welcome' && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-xs text-gray-500 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
      
      {page.children && page.children.length > 0 && (
        <div className="ml-2">
          {page.children.map((childId: string) => {
            const childPage = allPages[childId]
            if (!childPage) return null
            
            return (
              <PageItem
                key={childId}
                page={childPage}
                isSelected={isSelected}
                onSelect={onSelect}
                onDelete={onDelete}
                allPages={allPages}
                level={level + 1}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}