import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash-es';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { injectFormat, FormatType } from '../lib/editor-utils';

export interface ArticleMetadata {
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: string;
}

/**
 * useArticleEditor 自定义 Hook
 * 维护文章全量状态，包含内容与元数据
 */
export function useArticleEditor() {
  const { id } = useParams();
  const { setIsSidebarCollapsed } = useApp();
  
  // 内容状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // 元数据状态聚合
  const [metadata, setMetadata] = useState<ArticleMetadata>({
    slug: '',
    summary: '',
    category: '',
    tags: [],
    coverImage: ''
  });
  
  // UI 状态
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 提供给外部的通用元数据更新方法
  const updateMetadata = useCallback(<K extends keyof ArticleMetadata>(key: K, value: ArticleMetadata[K]) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  }, []);

  // 初始化加载
  useEffect(() => {
    setIsSidebarCollapsed(true);
    if (id) {
      // 模拟加载真实数据结构
      setTitle('深度探索 React 19 的 Concurrent 模式');
      setContent('# 序言\n\nReact 19 带来了许多令人兴奋的特性...');
      setMetadata({
        slug: 'react-19-concurrent',
        summary: '本文将带你深入了解 React 19 的核心改进，包括编译器架构、动作 API 以及改进的并发渲染能力。',
        category: '技术',
        tags: ['React', 'Frontend', 'Next.js'],
        coverImage: ''
      });
    }
  }, [id, setIsSidebarCollapsed]);

  // 防抖保存
  const saveDraft = useCallback(
    debounce((data: any) => {
      setIsSaving(true);
      // TODO: 调用后端 AuthorArticleController 更新接口
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 1000);
    }, 2000),
    []
  );

  useEffect(() => {
    if (title || content || metadata.slug) {
      saveDraft({ title, content, ...metadata });
    }
  }, [title, content, metadata, saveDraft]);

  const applyFormat = (type: FormatType) => {
    const el = textareaRef.current;
    if (!el) return;
    const { newContent, newCursorPos } = injectFormat(el, content, type);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return {
    title, setTitle,
    content, setContent,
    metadata, updateMetadata,
    isPreviewMode, setIsPreviewMode,
    isSettingsOpen, setIsSettingsOpen,
    isSaving, lastSaved,
    textareaRef, applyFormat,
  };
}
