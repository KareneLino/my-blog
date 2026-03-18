import React from 'react';
import { 
  FileText, 
  ImageIcon, 
  Compass,
  Type
} from 'lucide-react';
import { CategoryDetailData } from '../hooks/useCategoryDetail';
import { ImageUploadZone } from './ui/ImageUploadZone';
import { SettingsDrawer, SettingField } from './ui/SettingsDrawer';

interface CategorySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  data: CategoryDetailData;
  onChange: <K extends keyof CategoryDetailData>(key: K, value: CategoryDetailData[K]) => void;
}

export function CategorySettings({ isOpen, onClose, data, onChange }: CategorySettingsProps) {
  if (!data) return null;

  return (
    <SettingsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="分类配置"
      underlineColor="bg-emerald-500"
      saveText="保存分类设置"
    >
      {/* 分类名称 */}
      <SettingField icon={Type} label="分类名称">
        <input 
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="请输入分类名称..."
          className="w-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl px-5 py-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 focus:ring-4 ring-zinc-900/5 dark:ring-white/5 focus:border-zinc-900 dark:focus:border-white transition-all outline-none"
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
            /category/
          </div>
        </div>
      </SettingField>

      {/* 分类描述 */}
      <SettingField icon={FileText} label="分类描述">
        <textarea 
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="为这个分类写一段动人的描述..."
          className="w-full bg-zinc-900/5 dark:bg-white/5 rounded-[2rem] p-6 text-base leading-relaxed text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white transition-all outline-none resize-none h-44 scrollbar-hidden"
        />
      </SettingField>

      {/* 封面图 */}
      <SettingField icon={ImageIcon} label="封面图像">
        <ImageUploadZone 
          value={data.coverImage}
          onChange={(url) => onChange('coverImage', url)}
          purpose="category_cover"
          recommendedSize="1920 × 1080"
        />
      </SettingField>
    </SettingsDrawer>
  );
}
