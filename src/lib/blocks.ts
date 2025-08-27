// Block utilities and helpers

import { Block, BlockType } from './types';

export const BLOCK_TYPES: { [key in BlockType]: { label: string; shortcut?: string } } = {
  paragraph: { label: 'Text', shortcut: 'p' },
  heading1: { label: 'Heading 1', shortcut: 'h1' },
  heading2: { label: 'Heading 2', shortcut: 'h2' },
  heading3: { label: 'Heading 3', shortcut: 'h3' },
  bulletList: { label: 'Bullet List', shortcut: 'ul' },
  numberedList: { label: 'Numbered List', shortcut: 'ol' },
  code: { label: 'Code', shortcut: 'code' },
  quote: { label: 'Quote', shortcut: 'quote' },
  divider: { label: 'Divider', shortcut: 'div' },
  image: { label: 'Image', shortcut: 'img' },
};

export const createNewBlock = (type: BlockType, content: string = ''): Block => {
  const now = new Date();
  return {
    id: generateId(),
    type,
    content,
    properties: getDefaultMetadata(type),
    createdAt: now,
    updatedAt: now,
  };
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getDefaultMetadata = (type: BlockType) => {
  switch (type) {
    case 'code':
      return { language: 'javascript' };
    case 'bulletList':
    case 'numberedList':
      return { level: 0 };
    case 'image':
      return { 
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b295f1e6-bbc2-441c-8c7a-d44e91523942.png',
        caption: 'Add a caption...' 
      };
    default:
      return {};
  }
};

export const getBlockPlaceholder = (type: BlockType): string => {
  switch (type) {
    case 'paragraph':
      return 'Type something...';
    case 'heading1':
      return 'Heading 1';
    case 'heading2':
      return 'Heading 2';
    case 'heading3':
      return 'Heading 3';
    case 'bulletList':
      return 'List item';
    case 'numberedList':
      return '1. List item';
    case 'code':
      return 'Enter code...';
    case 'quote':
      return 'Enter a quote...';
    case 'divider':
      return '';
    case 'image':
      return 'Add image caption...';
    default:
      return 'Type something...';
  }
};

export const canHaveContent = (type: BlockType): boolean => {
  return type !== 'divider';
};

export const isTextBlock = (type: BlockType): boolean => {
  return ['paragraph', 'heading1', 'heading2', 'heading3', 'bulletList', 'numberedList', 'quote'].includes(type);
};

export const getBlockIcon = (type: BlockType): string => {
  switch (type) {
    case 'paragraph':
      return '📝';
    case 'heading1':
      return '📢';
    case 'heading2':
      return '📋';
    case 'heading3':
      return '📄';
    case 'bulletList':
      return '• ';
    case 'numberedList':
      return '1.';
    case 'code':
      return '💻';
    case 'quote':
      return '💬';
    case 'divider':
      return '➖';
    case 'image':
      return '🖼️';
    default:
      return '📝';
  }
};