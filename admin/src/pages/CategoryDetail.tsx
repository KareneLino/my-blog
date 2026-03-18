import React from 'react';
import { 
  Settings, 
  Search,
  Edit3,
  Trash2,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCategoryDetail } from '../hooks/useCategoryDetail';
import { CategorySettings } from '../components/CategorySettings';
import { DetailLayout } from '../components/layout/DetailLayout';

/**
 * 分类海报侧栏组件 (Left Sidebar)
 */
function CategoryHero({ data }: { data: any }) {
  return (
    <div className="w-full lg:w-[400px] xl:w-[480px] shrink-0 lg:sticky lg:top-8 h-auto lg:h-[calc(100vh-64px)] flex flex-col gap-6">
      {/* 封面与核心信息卡片 */}
      <div className="relative w-full flex-1 rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-900/10 dark:shadow-zinc-950/50 group transform-gpu">
        <div className="absolute inset-0 z-0 bg-zinc-100 dark:bg-zinc-900">
          <img 
            src={data.coverImage} 
            alt={data.name} 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-transparent" />
        </div>

        {/* 核心文案区 */}
        <div className="absolute bottom-0 left-0 w-full p-10 md:p-12 z-10 flex flex-col justify-end text-left">
          <Badge variant="default" className="w-fit bg-white/20 text-white border-white/30 backdrop-blur-md px-4 py-1.5 font-mono tracking-widest uppercase shadow-sm mb-8">
            /{data.slug}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg leading-[1.1] mb-6">
            {data.name}
          </h1>
          <div className="w-16 h-1 bg-blue-500/60 rounded-full mb-8" />
          <p className="text-white/80 font-sans font-medium leading-relaxed drop-shadow-sm line-clamp-4">
            {data.description}
          </p>
          
          <div className="mt-10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/60">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-sans font-bold text-white/40 uppercase tracking-widest">最后更新时间</span>
              <span className="text-sm font-sans font-medium text-white/70">{data.stats.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部数据面板 */}
      <div className="h-36 shrink-0 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex items-center justify-evenly p-6">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold font-serif text-zinc-900 dark:text-white">{data.stats.articles}</span>
          <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-widest mt-2">收录文章</span>
        </div>
        <div className="w-px h-16 bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold font-serif text-zinc-900 dark:text-white">{data.stats.views}</span>
          <span className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-widest mt-2">总阅读量</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 文章列表项组件 (Right List Items)
 */
function ArticleCard({ 
  article, 
  index, 
  onOpen, 
  onEdit, 
  onDelete 
}: { 
  article: any; 
  index: number; 
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div 
      onClick={onOpen}
      className="group bg-white dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-zinc-900/5 dark:hover:shadow-black/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6"
    >
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Badge 
            dot 
            variant={article.status === 'PUBLISHED' ? 'success' : 'default'} 
            className="px-2.5 py-1 text-xs"
          >
            {article.status === 'PUBLISHED' ? '已发布' : '草稿'}
          </Badge>
          <span className="text-sm font-mono text-zinc-400">/{article.slug}</span>
        </div>
        <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-500 transition-colors duration-300">
          {article.title}
        </h4>
        <div className="flex items-center gap-5 text-sm text-zinc-500 font-sans font-medium pt-2">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-zinc-400" /> {article.date}</span>
          <span className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-zinc-400" /> {article.views.toLocaleString()} 阅读</span>
        </div>
      </div>

      <div className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 sm:-translate-x-4 sm:group-hover:translate-x-0">
        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-2xl shadow-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
          <Edit3 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

/**
 * CategoryDetail - 分类详情页面
 * 
 * 层级：第二层级（详情页）
 * 布局：使用 DetailLayout
 * 特点：左侧 Hero + 右侧列表的双栏布局
 */
export function CategoryDetail() {
  const {
    categoryData,
    updateMetadata,
    filteredArticles,
    searchQuery,
    setSearchQuery,
    isSettingsOpen,
    setIsSettingsOpen,
    handleDeleteArticle,
    openOriginalLink,
    navigate
  } = useCategoryDetail();

  return (
    <DetailLayout
      title=""
      backPath="/categories"
      actions={
        <Button 
          variant="secondary" 
          onClick={() => setIsSettingsOpen(true)}
          className="rounded-2xl px-6 h-11 font-bold shadow-sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          配置此分类
        </Button>
      }
    >
      <div className="flex flex-col lg:flex-row min-h-screen gap-8 lg:gap-12">
        {/* 左侧：分类海报 */}
        <CategoryHero data={categoryData} />

        {/* 右侧：文章时间线与管理区 */}
        <div className="flex-1 w-full pt-2 lg:pt-0 pb-32 max-w-4xl mx-auto lg:mx-0 lg:pl-10 flex flex-col">
          
          {/* 工具栏 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white pl-1 font-sans">全部收录文章</h3>
              <p className="text-sm text-zinc-500 mt-1 pl-1 font-sans">按最后修改时间排序</p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章..."
                className="w-full bg-zinc-100 dark:bg-zinc-900/50 border-none rounded-full pl-12 pr-4 py-3.5 text-sm focus:ring-2 ring-zinc-900/10 dark:ring-white/10 transition-all outline-none font-sans"
              />
            </div>
          </div>

          {/* 文章列表 */}
          <div className="space-y-6">
            {filteredArticles.map((article, index) => (
              <ArticleCard 
                key={article.id}
                article={article}
                index={index}
                onOpen={() => openOriginalLink(article.slug)}
                onEdit={() => navigate(`/articles/edit/${article.id}`)}
                onDelete={() => handleDeleteArticle(article.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 分类元数据配置抽屉 */}
      <CategorySettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        data={categoryData}
        onChange={updateMetadata}
      />
    </DetailLayout>
  );
}
