import React from 'react';
import { 
  FileText, 
  Compass,
  Layout,
  LucideIcon,
  Tag as TagIcon,
  ImageIcon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ArticleMetadata } from '../hooks/useArticleEditor';
import { ImageUploadZone } from './ui/ImageUploadZone';
import { SettingsDrawer, SettingField } from './ui/SettingsDrawer';

interface ArticleSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  data: ArticleMetadata;
  onChange: <K extends keyof ArticleMetadata>(key: K, value: ArticleMetadata[K]) => void;
}

export function ArticleSettings({ isOpen, onClose, data, onChange }: ArticleSettingsProps) {
  if (!data) return null;

  return (
    <SettingsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="文章配置"
      underlineColor="bg-blue-500"
      saveText="保存全部设置"
    >
      {/* 封面图 */}
      <SettingField icon={ImageIcon} label="封面图像">
        <ImageUploadZone 
          value={data.coverImage}
          onChange={(url) => onChange('coverImage', url)}
          purpose="article_cover"
          recommendedSize="1600 × 900"
        />
      </SettingField>

      {/* 文章摘要 */}
      <SettingField icon={FileText} label="内容摘要">
        <textarea 
          value={data.summary}
          onChange={(e) => onChange('summary', e.target.value)}
          placeholder="为文章写一段精炼的开场白..."
          className="w-full bg-zinc-900/5 dark:bg-white/5 rounded-[2rem] p-6 text-base leading-relaxed text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white transition-all outline-none resize-none h-44 scrollbar-hidden"
        />
      </SettingField>
      
      {/* 访问路径 */}
      <SettingField icon={Compass} label="访问路径">
        <div className="relative group">
          <input 
            value={data.slug}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="请输入路径标识..."
            className="w-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl px-5 py-4 text-lg font-mono text-zinc-900 dark:text-zinc-100 focus:ring-4 ring-zinc-900/5 dark:ring-white/5 focus:border-zinc-900 dark:focus:border-white transition-all outline-none"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 py-1 px-3 bg-zinc-900/5 dark:bg-white/5 rounded-lg border border-white/10 text-zinc-400 font-mono text-xs">
            .html
          </div>
        </div>
      </SettingField>

      {/* 文章分类 */}
      <SettingField icon={Layout} label="所属分类">
        <div className="grid grid-cols-2 gap-3">
          {['技术', '随笔', '摄影', '设计'].map((cat) => (
            <button
              key={cat}
              onClick={() => onChange('category', cat)}
              className={cn(
                "px-4 py-4 rounded-2xl text-sm font-bold transition-all border cursor-pointer text-center",
                data.category === cat 
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-xl scale-[1.02]" 
                  : "bg-zinc-900/[0.03] dark:bg-white/[0.03] border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </SettingField>

      {/* 文章标签 */}
      <SettingField icon={TagIcon} label="文章标签">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {data.tags.map(tag => (
                <motion.span 
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={tag} 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900/10 dark:bg-white/10 rounded-xl text-sm font-bold text-zinc-800 dark:text-zinc-200"
                >
                  {tag}
                  <button 
                    onClick={() => onChange('tags', data.tags.filter(t => t !== tag))}
                    className="hover:text-red-500 transition-colors ml-1 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <input 
            placeholder="输入标签后按回车添加..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = e.currentTarget.value.trim();
                if (val && !data.tags.includes(val)) {
                  onChange('tags', [...data.tags, val]);
                  e.currentTarget.value = '';
                }
              }
            }}
            className="w-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl px-5 py-4 text-base text-zinc-900 dark:text-zinc-100 focus:ring-4 ring-zinc-900/5 dark:ring-white/5 focus:border-zinc-900 dark:focus:border-white transition-all outline-none"
          />
        </div>
      </SettingField>
    </SettingsDrawer>
  );
}
