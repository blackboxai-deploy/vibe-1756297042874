'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Workspace, Page, Block, createDefaultPage, createPage } from './types'
import { saveToStorage, loadFromStorage } from './storage'

interface WorkspaceContextType {
  workspace: Workspace
  currentPage: Page | null
  updatePage: (pageId: string, updates: Partial<Page>) => void
  addBlock: (pageId: string, block: Block, index?: number) => void
  updateBlock: (pageId: string, blockId: string, updates: Partial<Block>) => void
  deleteBlock: (pageId: string, blockId: string) => void
  reorderBlocks: (pageId: string, fromIndex: number, toIndex: number) => void
  createNewPage: (title: string, parentId?: string) => Page
  deletePage: (pageId: string) => void
  getPageById: (pageId: string) => Page | null
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null)

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspace, setWorkspace] = useState<Workspace>(() => {
    const saved = loadFromStorage()
    if (saved) {
      return saved
    }
    
    const defaultPage = createDefaultPage()
    return {
      pages: { [defaultPage.id]: defaultPage },
      pageOrder: [defaultPage.id]
    }
  })

  const [currentPage] = useState<Page | null>(null)

  // Auto-save workspace changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(workspace)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [workspace])

  const getPageById = (pageId: string): Page | null => {
    return workspace.pages[pageId] || null
  }

  const updatePage = (pageId: string, updates: Partial<Page>) => {
    setWorkspace(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageId]: {
          ...prev.pages[pageId],
          ...updates,
          updatedAt: new Date()
        }
      }
    }))
  }

  const addBlock = (pageId: string, block: Block, index?: number) => {
    const page = workspace.pages[pageId]
    if (!page) return

    const newBlocks = [...page.blocks]
    if (index !== undefined) {
      newBlocks.splice(index, 0, block)
    } else {
      newBlocks.push(block)
    }

    updatePage(pageId, { blocks: newBlocks })
  }

  const updateBlock = (pageId: string, blockId: string, updates: Partial<Block>) => {
    const page = workspace.pages[pageId]
    if (!page) return

    const blockIndex = page.blocks.findIndex(b => b.id === blockId)
    if (blockIndex === -1) return

    const updatedBlocks = [...page.blocks]
    updatedBlocks[blockIndex] = {
      ...updatedBlocks[blockIndex],
      ...updates,
      updatedAt: new Date()
    }

    updatePage(pageId, { blocks: updatedBlocks })
  }

  const deleteBlock = (pageId: string, blockId: string) => {
    const page = workspace.pages[pageId]
    if (!page) return

    const newBlocks = page.blocks.filter(b => b.id !== blockId)
    updatePage(pageId, { blocks: newBlocks })
  }

  const reorderBlocks = (pageId: string, fromIndex: number, toIndex: number) => {
    const page = workspace.pages[pageId]
    if (!page) return

    const newBlocks = [...page.blocks]
    const [movedBlock] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, movedBlock)

    updatePage(pageId, { blocks: newBlocks })
  }

  const createNewPage = (title: string, parentId?: string): Page => {
    const newPage = createPage(title, parentId)
    
    setWorkspace(prev => ({
      pages: {
        ...prev.pages,
        [newPage.id]: newPage
      },
      pageOrder: [...prev.pageOrder, newPage.id]
    }))

    // Update parent's children if applicable
    if (parentId && workspace.pages[parentId]) {
      updatePage(parentId, {
        children: [...workspace.pages[parentId].children, newPage.id]
      })
    }

    return newPage
  }

  const deletePage = (pageId: string) => {
    const page = workspace.pages[pageId]
    if (!page) return

    setWorkspace(prev => {
      const newPages = { ...prev.pages }
      delete newPages[pageId]

      return {
        pages: newPages,
        pageOrder: prev.pageOrder.filter(id => id !== pageId)
      }
    })

    // Update parent's children if applicable
    if (page.parentId && workspace.pages[page.parentId]) {
      updatePage(page.parentId, {
        children: workspace.pages[page.parentId].children.filter(id => id !== pageId)
      })
    }
  }

  const value = {
    workspace,
    currentPage,
    updatePage,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    createNewPage,
    deletePage,
    getPageById
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}