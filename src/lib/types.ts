export type BlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'code'
  | 'divider'
  | 'image'

export interface Block {
  id: string
  type: BlockType
  content: string
  properties?: {
    language?: string // for code blocks
    level?: number // for lists
    url?: string // for images
    caption?: string // for images
  }
  createdAt: Date
  updatedAt: Date
}

export interface Page {
  id: string
  title: string
  icon?: string
  blocks: Block[]
  parentId?: string
  children: string[]
  createdAt: Date
  updatedAt: Date
  isExpanded?: boolean
}

export interface Workspace {
  pages: Record<string, Page>
  pageOrder: string[]
}

// Helper functions
export function createBlock(type: BlockType, content: string = ''): Block {
  return {
    id: generateId(),
    type,
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export function createPage(title: string, parentId?: string): Page {
  return {
    id: generateId(),
    title,
    blocks: [createBlock('paragraph', '')],
    parentId,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isExpanded: false
  }
}

export function createDefaultPage(): Page {
  return {
    id: 'welcome',
    title: 'Welcome to NotionClone',
    icon: '👋',
    blocks: [
      createBlock('heading1', 'Welcome to NotionClone'),
      createBlock('paragraph', 'This is your new productivity workspace. Start by creating pages, adding content blocks, and organizing your thoughts.'),
      createBlock('heading2', 'Getting Started'),
      createBlock('bulletList', 'Click the + button to add new blocks'),
      createBlock('bulletList', 'Use the sidebar to create and navigate pages'),
      createBlock('bulletList', 'Drag and drop blocks to reorder them'),
      createBlock('heading2', 'Block Types'),
      createBlock('paragraph', 'You can create different types of content:'),
      createBlock('bulletList', 'Text paragraphs for regular content'),
      createBlock('bulletList', 'Headings for structure'),
      createBlock('bulletList', 'Lists for organization'),
      createBlock('bulletList', 'Code blocks for snippets'),
      createBlock('bulletList', 'Quotes for emphasis'),
      createBlock('quote', 'This is what a quote block looks like!'),
      createBlock('divider'),
      createBlock('paragraph', 'Happy writing! 🚀')
    ],
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isExpanded: true
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}