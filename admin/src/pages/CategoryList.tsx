import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Edit3, 
  Trash2, 
  Plus
} from 'lucide-react';
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
 * 
 * 层级：第一层级（导航页）
 * 布局：使用 ManagementLayout（已内置动画）
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Card 
            key={category.id}
            padding="none" 
            hoverable 
            animated={false}
            onClick={() => navigate(`/categories/${category.id}`)}
            className="group h-[320px] relative overflow-hidden flex flex-col border-white/20 dark:border-zinc-800/50 shadow-2xl cursor-pointer"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src={category.coverImage} 
                alt={category.name} 
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="absolute top-6 left-6 z-10">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
                <span className="text-sm font-serif font-bold text-white tracking-widest">
                  {category.articleCount} <span className="text-[10px] uppercase opacity-60 ml-1">Items</span>
                </span>
              </div>
            </div>

            <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
              <button 
                onClick={(e) => { e.stopPropagation(); handleEdit(category); }}
                className="h-11 w-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-zinc-900 transition-all shadow-2xl cursor-pointer"
              >
                <Edit3 className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(category.id, category.name); }}
                className="h-11 w-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-2xl cursor-pointer"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="absolute bottom-8 left-8 right-8 z-10">
              <div className="flex flex-col gap-3">
                <h3 className="text-3xl font-serif font-bold text-white drop-shadow-2xl tracking-tight leading-tight">
                  {category.name}
                </h3>
                
                <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-500 ease-in-out">
                  <div className="space-y-3 pt-1">
                    <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2 italic opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      "{category.description}"
                    </p>
                    <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                      /{category.slug}
                    </p>
                  </div>
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
