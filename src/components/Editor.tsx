'use client'

import { useState, useRef, useEffect } from 'react'
import { useWorkspace } from '@/lib/WorkspaceContext'
import { BlockComponent } from './Block'
import { BlockToolbar } from './BlockToolbar'
import { Button } from '@/components/ui/button'
import { createBlock, BlockType } from '@/lib/types'

interface EditorProps {
  pageId: string
}

export function Editor({ pageId }: EditorProps) {
  const { getPageById, updatePage, addBlock } = useWorkspace()
  const [showToolbar, setShowToolbar] = useState<string | null>(null)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const editorRef = useRef<HTMLDivElement>(null)

  const page = getPageById(pageId)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showToolbar && !((event.target as Element)?.closest?.('.block-toolbar'))) {
        setShowToolbar(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showToolbar])

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Page not found</h2>
          <p>The selected page could not be found.</p>
        </div>
      </div>
    )
  }

  const handleTitleChange = (newTitle: string) => {
    updatePage(pageId, { title: newTitle })
  }

  const handleShowToolbar = (blockId: string, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    setToolbarPosition({ x: rect.right + 10, y: rect.top })
    setShowToolbar(blockId)
  }

  const handleAddBlock = (type: BlockType, afterBlockId?: string) => {
    const newBlock = createBlock(type)
    
    if (afterBlockId) {
      const blockIndex = page.blocks.findIndex(b => b.id === afterBlockId)
      addBlock(pageId, newBlock, blockIndex + 1)
    } else {
      addBlock(pageId, newBlock)
    }
    
    setShowToolbar(null)
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div 
        ref={editorRef}
        className="flex-1 max-w-4xl mx-auto px-8 py-16 w-full"
      >
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={page.icon || ''}
              onChange={(e) => updatePage(pageId, { icon: e.target.value })}
              placeholder="📄"
              className="text-6xl w-20 text-center bg-transparent border-none outline-none"
              maxLength={2}
            />
          </div>
          
          <input
            type="text"
            value={page.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-5xl font-bold text-gray-900 bg-transparent border-none outline-none w-full placeholder-gray-300"
            placeholder="Untitled"
          />
        </div>

        {/* Blocks */}
        <div className="space-y-2">
          {page.blocks.map((block) => (
            <BlockComponent
              key={block.id}
              block={block}
              pageId={pageId}
              onShowToolbar={handleShowToolbar}
              onAddBlock={(type) => handleAddBlock(type, block.id)}
            />
          ))}
          
          {/* Add first block button */}
          {page.blocks.length === 0 && (
            <div className="py-4">
              <Button
                variant="ghost"
                onClick={() => handleAddBlock('paragraph')}
                className="text-gray-400 hover:text-gray-600"
              >
                + Click to add content
              </Button>
            </div>
          )}
        </div>

        {/* Add block at end */}
        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => handleAddBlock('paragraph')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            + Add a block
          </Button>
        </div>
      </div>

      {/* Block Toolbar */}
      {showToolbar && (
        <BlockToolbar
          position={toolbarPosition}
          onAddBlock={(type) => handleAddBlock(type, showToolbar)}
          onClose={() => setShowToolbar(null)}
        />
      )}
    </div>
  )
}