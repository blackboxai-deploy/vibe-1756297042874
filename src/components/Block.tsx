'use client'

import { useState, useRef, useEffect } from 'react'
import { useWorkspace } from '@/lib/WorkspaceContext'
import { Block, BlockType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BlockComponentProps {
  block: Block
  pageId: string
  onShowToolbar: (blockId: string, event: React.MouseEvent) => void
  onAddBlock: (type: BlockType) => void
}

export function BlockComponent({ block, pageId, onShowToolbar, onAddBlock }: BlockComponentProps) {
  const { updateBlock, deleteBlock } = useWorkspace()
  const [content, setContent] = useState(block.content)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setContent(block.content)
  }, [block.content])

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerText
      setContent(newContent)
      updateBlock(pageId, block.id, { content: newContent })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onAddBlock('paragraph')
    } else if (e.key === 'Backspace' && content === '' && contentRef.current) {
      e.preventDefault()
      deleteBlock(pageId, block.id)
    }
  }

  const handleBlur = () => {
    handleContentChange()
  }

  const renderBlock = () => {
    const commonProps = {
      ref: contentRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: handleContentChange,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      className: cn(
        "outline-none focus:bg-blue-50/30 rounded px-2 py-1 min-h-[1.5rem]",
        content === '' && "text-gray-400 before:content-[attr(data-placeholder)]"
      ),
      'data-placeholder': getPlaceholder(block.type),
      dangerouslySetInnerHTML: { __html: content }
    }

    switch (block.type) {
      case 'heading1':
        return <h1 {...commonProps} className={cn(commonProps.className, "text-3xl font-bold text-gray-900")} />
      
      case 'heading2':
        return <h2 {...commonProps} className={cn(commonProps.className, "text-2xl font-semibold text-gray-900")} />
      
      case 'heading3':
        return <h3 {...commonProps} className={cn(commonProps.className, "text-xl font-medium text-gray-900")} />
      
      case 'bulletList':
        return (
          <div className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            <div {...commonProps} className={cn(commonProps.className, "flex-1")} />
          </div>
        )
      
      case 'numberedList':
        return (
          <div className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">1.</span>
            <div {...commonProps} className={cn(commonProps.className, "flex-1")} />
          </div>
        )
      
      case 'quote':
        return (
          <div className="border-l-4 border-gray-300 bg-gray-50 pl-4 py-2">
            <div {...commonProps} className={cn(commonProps.className, "italic text-gray-700")} />
          </div>
        )
      
      case 'code':
        return (
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 font-mono">
            <div {...commonProps} className={cn(commonProps.className, "text-sm text-gray-800")} />
          </div>
        )
      
      case 'divider':
        return (
          <div className="py-4">
            <hr className="border-gray-300" />
          </div>
        )
      
      case 'image':
        return (
          <div className="py-2">
            <img 
              src={block.properties?.url || "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bd38da2d-b28b-44bc-a733-d191bf11607a.png"} 
              alt={block.properties?.caption || "Image"}
              className="max-w-full h-auto rounded-lg border border-gray-200"
            />
            {block.properties?.caption && (
              <p className="text-sm text-gray-500 mt-2 text-center italic">
                {block.properties.caption}
              </p>
            )}
          </div>
        )
      
      default:
        return <div {...commonProps} className={cn(commonProps.className, "text-gray-900")} />
    }
  }

  return (
    <div className="group relative">
      <div className="flex items-start gap-2">
        {/* Drag handle (hidden for divider) */}
        {block.type !== 'divider' && (
          <button
            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-opacity mt-1"
            onClick={(e) => onShowToolbar(block.id, e)}
          >
            <div className="w-1 h-4 bg-current rounded-full" />
            <div className="w-1 h-4 bg-current rounded-full ml-0.5" />
          </button>
        )}
        
        {/* Block content */}
        <div className="flex-1 min-w-0">
          {renderBlock()}
        </div>
      </div>
    </div>
  )
}

function getPlaceholder(type: BlockType): string {
  switch (type) {
    case 'heading1': return 'Heading 1'
    case 'heading2': return 'Heading 2'
    case 'heading3': return 'Heading 3'
    case 'bulletList': return 'List item'
    case 'numberedList': return 'List item'
    case 'quote': return 'Quote'
    case 'code': return 'Enter code'
    case 'paragraph':
    default: return 'Type \'/\' for commands'
  }
}