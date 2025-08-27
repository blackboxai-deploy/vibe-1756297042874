'use client'

import { BlockType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BlockToolbarProps {
  position: { x: number; y: number }
  onAddBlock: (type: BlockType) => void
  onClose: () => void
}

const blockTypes: Array<{ type: BlockType; label: string; icon: string; description: string }> = [
  { type: 'paragraph', label: 'Text', icon: '📝', description: 'Plain text paragraph' },
  { type: 'heading1', label: 'Heading 1', icon: 'H1', description: 'Large section heading' },
  { type: 'heading2', label: 'Heading 2', icon: 'H2', description: 'Medium section heading' },
  { type: 'heading3', label: 'Heading 3', icon: 'H3', description: 'Small section heading' },
  { type: 'bulletList', label: 'Bullet List', icon: '•', description: 'Bulleted list item' },
  { type: 'numberedList', label: 'Numbered List', icon: '1.', description: 'Numbered list item' },
  { type: 'quote', label: 'Quote', icon: '❝', description: 'Quoted text block' },
  { type: 'code', label: 'Code', icon: '</>', description: 'Code snippet' },
  { type: 'divider', label: 'Divider', icon: '—', description: 'Visual separator' },
  { type: 'image', label: 'Image', icon: '🖼️', description: 'Upload or embed image' }
]

export function BlockToolbar({ position, onAddBlock, onClose }: BlockToolbarProps) {
  const handleAddBlock = (type: BlockType) => {
    onAddBlock(type)
    onClose()
  }

  return (
    <div 
      className="block-toolbar fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-64"
      style={{
        left: Math.min(position.x, window.innerWidth - 280),
        top: Math.min(position.y, window.innerHeight - 400),
      }}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900">Add a block</h3>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {blockTypes.map((blockType) => (
          <button
            key={blockType.type}
            onClick={() => handleAddBlock(blockType.type)}
            className={cn(
              "w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            )}
          >
            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-sm">
              {blockType.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {blockType.label}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {blockType.description}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="px-3 py-2 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-full text-gray-500"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}