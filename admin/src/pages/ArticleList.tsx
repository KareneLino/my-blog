import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { ManagementLayout } from '../components/layout/ManagementLayout';

// 模拟文章数据
const articles = [
  { id: '1', title: '深度探索 React 19 的 Concurrent 模式', slug: 'react-19-concurrent', status: 'PUBLISHED', date: '2026-03-12', category: '技术' },
  { id: '2', title: '关于未来博客形态的思考：沉浸与极简', slug: 'future-of-blogging', status: 'DRAFT', date: '2026-03-10', category: '随笔' },
  { id: '3', title: '2026 年摄影器材选购指南', slug: 'photography-gear-2026', status: 'PUBLISHED', date: '2026-03-05', category: '摄影' },
  { id: '4', title: '使用 Rust 构建高性能 Web 服务的实践', slug: 'rust-web-service', status: 'PENDING_DELETE', date: '2026-02-28', category: '技术' },
  { id: '5', title: '春日大理：在苍山洱海间寻找宁静', slug: 'dali-spring-trip', status: 'PUBLISHED', date: '2026-02-20', category: '旅行' },
];

const statusMap = {
  PUBLISHED: { label: '已发布', variant: 'success' },
  DRAFT: { label: '草稿', variant: 'default' },
  EDITING: { label: '编辑中', variant: 'info' },
  PENDING_DELETE: { label: '待回收', variant: 'danger' },
} as const;

/**
 * ArticleList - 文章管理页面
 * 
 * 层级：第一层级（导航页）
 * 布局：使用 ManagementLayout（已内置动画）
 */
export function ArticleList() {
  const navigate = useNavigate();
  const { confirm } = useApp();
  const [activeTab, setActiveTab] = useState('ALL');

  const handleDelete = (id: string) => {
    confirm({
      title: '确认移至回收站？',
      content: '该文章将被标记为待删除状态，您可以在 7 天内随时恢复。',
      confirmText: '确认移至回收站',
      variant: 'danger',
      onConfirm: () => {}
    });
  };

  return (
    <ManagementLayout
      title="内容管理"
      subtitle="管理、编辑和发布你的所有创作。"
      primaryAction={{
        label: "撰写文章",
        icon: Plus,
        onClick: () => navigate('/articles/new')
      }}
      tabs={[
        { label: '全部', value: 'ALL' },
        { label: '已发布', value: 'PUBLISHED' },
        { label: '编辑中', value: 'EDITING' },
        { label: '草稿', value: 'DRAFT' },
        { label: '待回收', value: 'PENDING_DELETE' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchPlaceholder="搜索文章标题或 Slug..."
      accentColor="blue"
    >
      <Card padding="none" animated={false} className="overflow-hidden shadow-xl">
        <div className="w-full overflow-x-auto scrollbar-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/10 dark:border-zinc-700/20 bg-zinc-900/[0.01] dark:bg-white/[0.01]">
                <th className="px-8 py-5 text-base font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">文章标题</th>
                <th className="px-8 py-5 text-base font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">状态</th>
                <th className="px-8 py-5 text-base font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">分类</th>
                <th className="px-8 py-5 text-base font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">发布日期</th>
                <th className="px-8 py-5 text-right text-base font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/5 dark:divide-zinc-700/10 text-base">
              {articles.map((article) => (
                <tr key={article.id} className="group hover:bg-zinc-900/[0.03] dark:hover:bg-white/[0.03] transition-colors duration-200">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-500 transition-colors cursor-pointer">
                        {article.title}
                      </span>
                      <span className="font-mono text-sm text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">/{article.slug}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge dot variant={statusMap[article.status as keyof typeof statusMap].variant} className="py-1.5 px-4 text-sm font-bold">
                      {statusMap[article.status as keyof typeof statusMap].label}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 font-bold text-zinc-600 dark:text-zinc-400">{article.category}</td>
                  <td className="px-8 py-6 font-medium text-zinc-500 dark:text-zinc-400">{article.date}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="relative h-12 w-full flex justify-end items-center">
                      <div className="flex justify-end items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-blue-500">
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-zinc-900 dark:hover:text-white" onClick={() => navigate(`/articles/edit/${article.id}`)}>
                          <Edit3 className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-red-500" onClick={() => handleDelete(article.id)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="absolute right-0 opacity-100 group-hover:opacity-0 transition-opacity duration-200">
                        <MoreHorizontal className="h-6 w-6 text-zinc-300" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 flex items-center justify-between border-t border-zinc-200/10 dark:border-zinc-700/20 bg-zinc-900/[0.02] dark:bg-white/[0.02]">
          <span className="text-base font-medium text-zinc-500">共 {articles.length} 篇文章</span>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="px-6 h-10 text-base font-sans" disabled>上一页</Button>
            <Button variant="secondary" className="px-6 h-10 text-base font-sans">下一页</Button>
          </div>
        </div>
      </Card>
    </ManagementLayout>
  );
}
