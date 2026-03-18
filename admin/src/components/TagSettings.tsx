import React, { useMemo } from 'react';
import { 
  FileText, 
  Type,
  Palette,
  Zap,
  LayoutGrid,
  Sparkles,
  Feather
} from 'lucide-react';
import { 
  SiReact, 
  SiTypescript, 
  SiNodedotjs, 
  SiRust, 
  SiTailwindcss, 
  SiNextdotjs, 
  SiDocker, 
  SiDatabricks, 
  SiOpenai, 
  SiWeb3Dotjs,
  SiJavascript,
  SiVuedotjs,
  SiPython,
  SiGo,
  SiMongodb
} from 'react-icons/si';
import { SegmentedControl } from './ui/SegmentedControl';
import { SettingsDrawer, SettingField } from './ui/SettingsDrawer';
import { getTagColor } from '../lib/utils';

interface TagSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  data: any; 
  onChange: (key: string, value: any) => void;
}

const ICON_MAP: Record<string, any> = {
  'react': { Icon: SiReact, color: '#61DAFB' },
  'typescript': { Icon: SiTypescript, color: '#3178C6' },
  'javascript': { Icon: SiJavascript, color: '#F7DF1E' },
  'js': { Icon: SiJavascript, color: '#F7DF1E' },
  'vue': { Icon: SiVuedotjs, color: '#4FC08D' },
  'node.js': { Icon: SiNodedotjs, color: '#339933' },
  'rust': { Icon: SiRust, color: '#DEA584' },
  'python': { Icon: SiPython, color: '#3776AB' },
  'go': { Icon: SiGo, color: '#00ADD8' },
  'tailwindcss': { Icon: SiTailwindcss, color: '#06B6D4' },
  'next.js': { Icon: SiNextdotjs, color: '#000000' },
  'docker': { Icon: SiDocker, color: '#2496ED' },
  'mongodb': { Icon: SiMongodb, color: '#47A248' },
  'database': { Icon: SiDatabricks, color: '#FF3621' },
  'ai': { Icon: SiOpenai, color: '#412991' },
  'web3': { Icon: SiWeb3Dotjs, color: '#F16822' }
};

export function TagSettings({ isOpen, onClose, onSave, data, onChange }: TagSettingsProps) {
  if (!data) return null;

  const brand = useMemo(() => {
    return ICON_MAP[data.name?.toLowerCase()] || null;
  }, [data.name]);

  const previewColor = data.color || brand?.color || getTagColor(data.name || 'New Tag');

  return (
    <SettingsDrawer
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      title={data.id ? "标签炼金" : "熔炼新标签"}
      icon={Sparkles}
      underlineColor="bg-amber-500"
      saveText={data.id ? "完成熔炼" : "开始注入"}
    >
      <div className="space-y-8">
        {/* 1. 实时预览区 */}
        <div className="p-8 rounded-[3rem] bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-white/5 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10 blur-3xl transition-colors duration-1000"
            style={{ backgroundColor: previewColor }}
          />
          <div className="relative z-10 h-24 w-24 rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl flex items-center justify-center border border-white/20">
            {brand ? (
              <brand.Icon style={{ color: previewColor }} className="h-12 w-12 transition-all duration-500 scale-110" />
            ) : data.isTech ? (
              <div style={{ borderColor: previewColor }} className="h-10 w-10 rounded-full border-4 animate-pulse" />
            ) : (
              <Feather style={{ color: previewColor }} className="h-10 w-10" />
            )}
          </div>
          <div className="relative z-10 text-center">
            <h4 className="text-2xl font-black tracking-tight" style={{ color: previewColor }}>
              {data.name || '熔炼中...'}
            </h4>
            <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mt-1">
              {brand ? 'Official Brand Match' : 'System Derived'}
            </p>
          </div>
        </div>

        {/* 2. 核心标识 */}
        <SettingField icon={Type} label="核心标识" activeColorClass="group-focus-within:text-amber-500">
          <input 
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="标签名称 (如 React, JavaScript)..."
            className="w-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl px-6 py-5 text-xl font-bold text-zinc-900 dark:text-white focus:ring-4 ring-amber-500/5 transition-all outline-none"
          />
        </SettingField>

        {/* 3. 领域与效果 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField icon={LayoutGrid} label="领域属性" activeColorClass="group-focus-within:text-amber-500">
            <SegmentedControl 
              id="field-selector"
              fullWidth
              size="sm"
              options={[
                { label: '科技', value: true },
                { label: '人文', value: false },
              ]}
              value={data.isTech}
              onChange={(val) => onChange('isTech', val)}
            />
          </SettingField>

          <SettingField icon={Zap} label="视觉灵魂" activeColorClass="group-focus-within:text-amber-500">
            <SegmentedControl 
              id="effect-selector"
              fullWidth
              size="sm"
              options={[
                { label: '朴素', value: 'none' },
                { label: '发光', value: 'glow' },
                { label: '呼吸', value: 'pulse' },
              ]}
              value={data.effect}
              onChange={(val) => onChange('effect', val)}
            />
          </SettingField>
        </div>

        {/* 4. 品牌色彩 */}
        <SettingField icon={Palette} label="专属色彩" activeColorClass="group-focus-within:text-amber-500">
          <div className="flex items-center gap-4">
            <div 
              className="h-14 w-14 rounded-2xl shadow-inner border border-white/10 flex-shrink-0 transition-colors duration-500"
              style={{ backgroundColor: previewColor }}
            />
            <div className="flex-1 relative">
              <input 
                type="text"
                value={data.color}
                onChange={(e) => onChange('color', e.target.value)}
                placeholder={brand ? `官方色: ${brand.color}` : "HEX 色值"}
                className="w-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm font-mono text-zinc-900 dark:text-zinc-100 outline-none"
              />
              {data.color && (
                <button 
                  onClick={() => onChange('color', '')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  RESET
                </button>
              )}
            </div>
          </div>
        </SettingField>

        {/* 5. 描述 */}
        <SettingField icon={FileText} label="熔炼笔记" activeColorClass="group-focus-within:text-amber-500">
          <textarea 
            value={data.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="记录下这个标签背后的核心定义..."
            className="w-full bg-zinc-900/5 dark:bg-white/5 rounded-[2rem] p-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800 focus:border-amber-500/50 transition-all outline-none resize-none h-32 scrollbar-hidden"
          />
        </SettingField>
      </div>
    </SettingsDrawer>
  );
}
