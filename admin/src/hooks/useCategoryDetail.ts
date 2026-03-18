import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * 模拟分类详情数据类型
 */
export interface CategoryDetailData {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  stats: {
    articles: number;
    views: string;
    lastUpdated: string;
  };
}

/**
 * 模拟文章项类型
 */
export interface CategoryArticle {
  id: string;
  title: string;
  slug: string;
  status: 'PUBLISHED' | 'DRAFT';
  date: string;
  views: number;
}

/**
 * useCategoryDetail 自定义 Hook
 * 负责分类详情页的数据获取、搜索过滤与操作逻辑
 */
export function useCategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirm } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 初始化分类数据 (模拟)
  const [categoryData, setCategoryData] = useState<CategoryDetailData>({
    id: id || '1',
    name: '技术探索',
    slug: 'tech',
    description: '关于 Web 开发、架构设计与新技术的深度文章。这里记录了从前端工程化到后端分布式架构的点滴思考与实战经验总结。',
    coverImage: 'https://picsum.photos/seed/tech/1920/1080',
    stats: {
      articles: 42,
      views: '124.5K',
      lastUpdated: '2天前'
    }
  });

  // 更新元数据的通用方法
  const updateMetadata = useCallback(<K extends keyof CategoryDetailData>(key: K, value: CategoryDetailData[K]) => {
    setCategoryData(prev => ({ ...prev, [key]: value }));
  }, []);

  const articles: CategoryArticle[] = [
    { id: '101', title: 'Rust 在 Node.js 扩展中的实战应用', slug: 'rust-nodejs-addon', status: 'PUBLISHED', date: '2026-03-12', views: 3420 },
    { id: '102', title: '深入理解 React 19 Concurrent 模式', slug: 'react-19-deep-dive', status: 'PUBLISHED', date: '2026-03-08', views: 8900 },
    { id: '103', title: '2026 前端构建工具横评：Vite vs Turbopack', slug: 'build-tools-2026', status: 'DRAFT', date: '2026-03-01', views: 0 },
    { id: '104', title: '微前端架构在大型企业级项目中的落地', slug: 'micro-frontend-enterprise', status: 'PUBLISHED', date: '2026-02-15', views: 12500 },
  ];

  // 简单的过滤逻辑
  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteArticle = (articleId: string) => {
    confirm({
      title: '删除文章',
      content: '确定要将此文章移至回收站吗？',
      confirmText: '删除',
      variant: 'danger',
      onConfirm: () => {
        console.log('Delete article:', articleId);
      }
    });
  };

  const openOriginalLink = (slug: string) => {
    window.open(`/${slug}`, '_blank');
  };

  return {
    categoryData,
    updateMetadata,
    filteredArticles,
    searchQuery,
    setSearchQuery,
    isLoading,
    isSettingsOpen,
    setIsSettingsOpen,
    handleDeleteArticle,
    openOriginalLink,
    navigate
  };
}
