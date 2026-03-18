import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Database, 
  Save, 
  ChevronRight,
  LucideIcon,
  Sparkles,
  Type,
  Palette,
  Zap,
  Layout,
  Cloud,
  Layers,
  Terminal,
  Cpu,
  Share2,
  MessageSquare,
  Search as SearchIcon,
  ShieldCheck,
  User,
  Clock,
  History,
  Link2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageAction } from '../components/ui/PageAction';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { cn } from '../lib/utils';

function ConfigField({ icon: Icon, label, description, children, className }: { icon: LucideIcon, label: string, description?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("group space-y-4 py-8 first:pt-0 border-b border-zinc-200/5 dark:border-white/5 last:border-none", className)}>
      <div className="flex items-start justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/10 dark:border-white/10 flex items-center justify-center text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors shadow-inner">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">{label}</span>
            {description && <p className="text-xs text-zinc-500 font-sans opacity-80">{description}</p>}
          </div>
        </div>
      </div>
      <div className="relative pl-12 w-full">{children}</div>
    </div>
  );
}

function PremiumToggle({ enabled, onToggle }: { enabled: boolean, onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={cn("relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 outline-none cursor-pointer", enabled ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800")}>
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className={cn("inline-block h-5 w-5 rounded-full shadow-lg transform", enabled ? "bg-white dark:bg-zinc-900 translate-x-6" : "bg-zinc-400 dark:bg-zinc-500 translate-x-1")} />
    </button>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<'admin' | 'aesthetics' | 'social' | 'oss'>('admin');
  const [config, setConfig] = useState({ siteName: 'MultiTerm Blog', adminTitle: 'MultiTerm Admin', systemId: 'MT-CORE-X1', maintenanceMode: false, enableAi: true, autoSaveInterval: 120, recycleBinDays: 30, themeMode: 'select', defaultTheme: 'dracula-soft', seasonEffect: 'snow', intensity: 0.8, fontFace: 'JetBrains Mono', authorName: 'Karene Pitayas', github: 'https://github.com/karenepitaya', twitter: '@karene', giscusRepo: 'karene/my-blog', enableAuthorCard: true, ossProvider: 'oss', ossBucket: 'mt-blog-assets', ossEndpoint: 'oss-cn-shanghai.aliyuncs.com' });

  const tabs = [{ id: 'admin', label: '系统内核', icon: Terminal, color: 'text-blue-500' }, { id: 'aesthetics', label: '视觉灵魂', icon: Palette, color: 'text-emerald-500' }, { id: 'social', label: '内容交互', icon: Share2, color: 'text-amber-500' }, { id: 'oss', label: '基础设施', icon: Cpu, color: 'text-zinc-900 dark:text-white' }] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="max-w-[1400px] mx-auto space-y-12 pb-32"
    >
      <PageHeader title="系统设置" subtitle="全局架构与运行参数的高级控制中心。" actions={<PageAction icon={Save}>保存全部设置</PageAction>} />
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-64 shrink-0 sticky top-8 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/5 rounded-[2.5rem] p-3 shadow-xl">
          <div className="flex flex-col gap-1.5">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("group flex items-center gap-3 px-5 py-4 rounded-[1.8rem] transition-all duration-500 text-left relative overflow-hidden cursor-pointer", activeTab === tab.id ? "bg-white dark:bg-zinc-800 shadow-lg text-zinc-900 dark:text-white scale-[1.02]" : "hover:bg-white/40 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300")}>
                <tab.icon className={cn("h-5 w-5 transition-all duration-500", activeTab === tab.id ? cn(tab.color, "scale-110 drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]") : "opacity-50")} />
                <span className="text-base font-bold font-sans">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white/20 dark:border-zinc-800/50 rounded-[3.5rem] p-10 lg:p-14 shadow-2xl">
              {activeTab === 'admin' && (<div className="space-y-2"><div className="mb-12"><h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-2 italic">System Kernel</h3><div className="w-12 h-1 bg-blue-500 rounded-full" /></div><ConfigField icon={Type} label="站点基础标识"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-bold text-zinc-400 uppercase pl-2">Site Name</label><input value={config.siteName} onChange={e=>setConfig({...config, siteName: e.target.value})} className="w-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 ring-zinc-900/5" /></div><div className="space-y-2"><label className="text-[10px] font-bold text-zinc-400 uppercase pl-2">System ID</label><input value={config.systemId} readOnly className="w-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm font-mono text-zinc-400 outline-none" /></div></div></ConfigField></div>)}
              {activeTab === 'aesthetics' && (<div className="space-y-2"><div className="mb-12"><h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-2 italic">Aesthetic Soul</h3><div className="w-12 h-1 bg-emerald-500 rounded-full" /></div></div>)}
              {activeTab === 'social' && (<div className="space-y-2"><div className="mb-12"><h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-2 italic">Engagement</h3><div className="w-12 h-1 bg-amber-500 rounded-full" /></div></div>)}
              {activeTab === 'oss' && (<div className="space-y-2"><div className="mb-12"><h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-2 italic">Infrastructure</h3><div className="w-12 h-1 bg-zinc-900 dark:bg-white rounded-full" /></div></div>)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
