import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { ManagementLayout } from '../components/layout/ManagementLayout';
import { CategorySettings } from '../components/CategorySettings';

// 模拟分类数据
const categories = [
  { 
    id: '1', name: '技术探索', slug: 'tech', articleCount: 42, 
    description: '关于 Web 开发、架构设计与新技术的深度文章。',
    coverImage: 'https://picsum.photos/seed/tech/800/600'
  },
  { 
    id: '2', name: '生活随笔', slug: 'life', articleCount: 15, 
    description: '记录生活中的点滴思考与感悟。',
    coverImage: 'https://picsum.photos/seed/life/800/600'
  },
  { 
    id: '3', name: '摄影视觉', slug: 'photography', articleCount: 8, 
    description: '镜头下的世界，光影的艺术。',
    coverImage: 'https://picsum.photos/seed/photo/800/600'
  },
  { 
    id: '4', name: '设计思考', slug: 'design', articleCount: 12, 
    description: '关于 UI/UX 设计、排版与审美的研究。',
    coverImage: 'https://picsum.photos/seed/design/800/600'
  },
];

/**
 * CategoryList - 分类管理页面
 */
export function CategoryList() {
  const navigate = useNavigate();
  const { confirm } = useApp();
  const [activeTab, setActiveTab] = useState('ALL');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleEdit = (category?: any) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory({ name: '', slug: '', description: '', coverImage: '' });
    }
    setIsSettingsOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: '删除分类？',
      content: `确定要删除分类 "${name}" 吗？此操作无法撤销。`,
      confirmText: '确认删除',
      variant: 'danger',
      onConfirm: () => {}
    });
  };

  return (
    <ManagementLayout
      title="分类管理"
      subtitle="用画廊的形式，组织你的内容世界。"
      primaryAction={{
        label: "新建分类",
        icon: Plus,
        onClick: () => handleEdit()
      }}
      tabs={[
        { label: '全部', value: 'ALL' },
        { label: '已发布', value: 'PUBLISHED' },
        { label: '待回收', value: 'PENDING_DELETE' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchPlaceholder="搜索分类名称..."
      accentColor="emerald"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {categories.map((category) => (
          <Card 
            key={category.id}
            padding="none" 
            hoverable 
            animated={false}
            onClick={() => navigate(`/categories/${category.id}`)}
            className="group relative overflow-hidden flex flex-col border-white/20 dark:border-zinc-800/50 shadow-2xl cursor-pointer h-[240px] sm:h-[280px] lg:h-[320px]"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src={category.coverImage} 
                alt={category.name} 
                decoding="async"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
            </div>

            <div className="absolute top-4 left-4 z-10">
              <div className="px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <span className="text-xs sm:text-sm font-serif font-bold text-white tracking-wider">
                  {category.articleCount} <span className="text-[10px] uppercase opacity-60 ml-0.5">Items</span>
                </span>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-2 sm:group-hover:translate-x-0">
              <button 
                onClick={(e) => { e.stopPropagation(); handleEdit(category); }}
                className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white hover:text-zinc-900 transition-all shadow-lg active:scale-95"
                aria-label="编辑分类"
              >
                <Edit3 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(category.id, category.name); }}
                className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full bg-red-500/80 backdrop-blur-xl border border-white/30 text-white hover:bg-red-600 transition-all shadow-lg active:scale-95"
                aria-label="删除分类"
              >
                <Trash2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8 z-10">
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white drop-shadow-lg tracking-tight leading-tight">
                  {category.name}
                </h3>
                
                <div className="overflow-hidden transition-all duration-500">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-1 sm:line-clamp-2 sm:group-hover:line-clamp-none italic opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:mt-2 transition-all">
                    {category.description}
                  </p>
                  <p className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mt-1 sm:mt-2 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    /{category.slug}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CategorySettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        data={editingCategory} 
        onChange={(key, val) => setEditingCategory({ ...editingCategory, [key]: val })} 
      />
    </ManagementLayout>
  );
}
