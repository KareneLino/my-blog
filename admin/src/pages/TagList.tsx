import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3,
  Feather,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn, getTagColor } from '../lib/utils';
import { ManagementLayout } from '../components/layout/ManagementLayout';
import { TagSettings } from '../components/TagSettings';
import { TagRelatedArticles } from '../components/ui/TagRelatedArticles';
import { toast } from 'sonner';
import { discoverBrand } from '../lib/brand-utils';

// 初始模拟数据
const INITIAL_TAGS = [
  { id: '1', name: 'React', color: '', effect: 'glow', articleCount: 156, isTech: true },
  { id: '2', name: 'TypeScript', color: '', effect: 'none', articleCount: 89, isTech: true },
  { id: '3', name: 'Node.js', color: '', effect: 'pulse', articleCount: 42, isTech: true },
  { id: '4', name: 'Rust', color: '', effect: 'none', articleCount: 12, isTech: true },
  { id: '5', name: 'TailwindCSS', color: '', effect: 'none', articleCount: 234, isTech: true },
  { id: '6', name: 'OpenAI', color: '', effect: 'glow', articleCount: 312, isTech: true },
  { id: '7', name: 'Photography', color: '', effect: 'none', articleCount: 7, isTech: false },
  { id: '12', name: 'Design', color: '', effect: 'none', articleCount: 19, isTech: false },
];

/**
 * TagTile - 标签卡片组件
 * 
 * 响应式设计：
 * - 高度: h-[120px] sm:h-[140px]
 * - 内边距: p-4 sm:p-6
 * - 触控: 按钮最小 44px
 */
function TagTile({ tag, onClick, onEdit, onDelete }: { tag: any, onClick: () => void, onEdit: () => void, onDelete: () => void }) {
  const brand = useMemo(() => tag.isTech ? discoverBrand(tag.name) : null, [tag.name, tag.isTech]);
  const activeColor = tag.color || brand?.color || getTagColor(tag.name);

  const glowStyle = tag.effect === 'glow' ? {
    boxShadow: `0 10px 30px -8px ${activeColor}${activeColor.length === 7 ? '44' : ''}`,
  } : {};

  return (
    <div className="group relative">
      <div 
        onClick={onClick}
        style={{ ...glowStyle }}
        className={cn(
          "h-[120px] sm:h-[140px] p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden",
          "bg-white/80 dark:bg-zinc-900/80 border-white/40 dark:border-zinc-800 shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-zinc-800 active:scale-[0.98]"
        )}
      >
        {/* 左侧色条 */}
        <div style={{ backgroundColor: activeColor }} className="absolute left-0 top-6 bottom-6 sm:top-8 sm:bottom-8 w-1 sm:w-1.5 rounded-r-full opacity-40 group-hover:opacity-100 transition-opacity" />
        
        {/* 顶部：图标 + 名称 */}
        <div className="flex justify-between items-start pl-2 sm:pl-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/10 dark:border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
              {brand ? (
                <svg 
                  role="img" 
                  viewBox="0 0 24 24" 
                  className="h-5 w-5 sm:h-6 sm:w-6 fill-current" 
                  style={{ color: activeColor }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={brand.path} />
                </svg>
              ) : (
                <Feather style={{ color: activeColor }} className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">{tag.name}</span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider opacity-60">{tag.isTech ? 'System Tech' : 'Humanity'}</span>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
        </div>

        {/* 底部：计数 + 操作 */}
        <div className="flex justify-between items-end pl-2 sm:pl-3">
          <div style={{ backgroundColor: `${activeColor}1A`, color: activeColor }} className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black font-mono flex items-center gap-1.5 sm:gap-2 border border-current/10">
            <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-current animate-pulse" />
            {tag.articleCount} <span className="hidden sm:inline">Articles</span>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all translate-y-0 sm:translate-y-1 sm:group-hover:translate-y-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }} 
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
              aria-label="编辑标签"
            >
              <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }} 
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-red-500 text-white shadow-md flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
              aria-label="删除标签"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TagList - 标签管理页面
 * 
 * 响应式设计：
 * - 网格: grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4
 * - 间距: gap-4 sm:gap-6 lg:gap-8
 * 
 * 层级：第一层级（导航页）
 */
export function TagList() {
  const { confirm } = useApp();
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<any>(null);

  const filteredTags = useMemo(() => tags.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' ? true : activeTab === 'TECH' ? t.isTech : !t.isTech;
    return matchesSearch && matchesTab;
  }), [tags, searchQuery, activeTab]);

  const handleNew = () => {
    setSelectedTag({ name: '', effect: 'none', isTech: true, description: '', color: '', articleCount: 0 });
    setIsSettingsOpen(true);
  };

  const handleEdit = (tag: any) => {
    setSelectedTag({ ...tag });
    setIsSettingsOpen(true);
  };

  const handleSave = () => {
    if (!selectedTag.name.trim()) {
      toast.error('标签名称不能为空');
      return;
    }

    if (selectedTag.id) {
      setTags(tags.map(t => t.id === selectedTag.id ? selectedTag : t));
      toast.success(`标签 "${selectedTag.name}" 已保存`);
    } else {
      const newTag = { ...selectedTag, id: Math.random().toString(36).substr(2, 9) };
      setTags([newTag, ...tags]);
      toast.success(`新标签 "${selectedTag.name}" 熔炼成功`);
    }
    setIsSettingsOpen(false);
  };

  const handleDelete = (tag: any) => {
    confirm({
      title: '彻底销毁标签？',
      content: `确定要永久移除标签 "${tag.name}" 吗？`,
      confirmText: '立即销毁',
      variant: 'danger',
      onConfirm: () => {
        setTags(tags.filter(t => t.id !== tag.id));
        toast.success(`标签 "${tag.name}" 已移除`);
      }
    });
  };

  return (
    <ManagementLayout
      title="标签云"
      subtitle="通过多维度的标签系统，为你的内容赋予灵魂。"
      primaryAction={{ label: "新建标签", icon: Plus, onClick: handleNew }}
      tabs={[{ label: '全部', value: 'ALL' }, { label: '科技', value: 'TECH' }, { label: '非科技', value: 'NO_TECH' }]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchPlaceholder="快速检索标签..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      accentColor="amber"
    >
      {/* 响应式网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 py-2 sm:py-4">
        <AnimatePresence mode="popLayout">
          {filteredTags.map(tag => (
            <TagTile 
              key={tag.id} 
              tag={tag} 
              onClick={() => { setSelectedTag(tag); setIsArticlesOpen(true); }} 
              onEdit={() => handleEdit(tag)} 
              onDelete={() => handleDelete(tag)} 
            />
          ))}
        </AnimatePresence>
      </div>

      <TagSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSave}
        data={selectedTag} 
        onChange={(key, val) => setSelectedTag({ ...selectedTag, [key]: val })} 
      />

      <TagRelatedArticles 
        isOpen={isArticlesOpen} 
        onClose={() => setIsArticlesOpen(false)} 
        tagName={selectedTag?.name || ""} 
        articles={[
          { id: '1', title: '深度探索 React 19 的 Concurrent 模式', slug: 'react-19', date: '2026-03-12', views: 1240 },
        ]}
      />
    </ManagementLayout>
  );
}
