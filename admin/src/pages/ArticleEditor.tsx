import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Settings,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  ListTodo,
  Link as LinkIcon,
  Code,
  Terminal,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Loader2,
  FileEdit,
  ChevronDown,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { EditorToolbar, ToolbarButton } from '../components/ui/EditorToolbar';
import { useArticleEditor } from '../hooks/useArticleEditor';
import { ArticleSettings } from '../components/ArticleSettings';
import { ImageInsertTool } from '../components/ImageInsertTool';

type MobileViewMode = 'edit' | 'preview';

/**
 * ArticleEditor - 文章编辑页面
 * 
 * 响应式设计：
 * - 桌面端: 左右分栏编辑+预览
 * - 移动端 (<lg): 底部 Tab 切换编辑/预览，工具栏可折叠
 * - 工具栏: 桌面完整显示，移动端横向滚动 + 常用工具快捷访问
 * 
 * 层级：第三层级（功能页）
 */
export function ArticleEditor() {
  const navigate = useNavigate();
  const {
    title, setTitle,
    content, setContent,
    metadata, updateMetadata,
    isPreviewMode, setIsPreviewMode,
    isSettingsOpen, setIsSettingsOpen,
    isSaving, lastSaved,
    textareaRef, applyFormat
  } = useArticleEditor();

  // 移动端视图切换
  const [mobileView, setMobileView] = useState<MobileViewMode>('edit');
  // 移动端工具栏展开状态
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);

  // 常用工具（移动端快捷显示）
  const commonTools = [
    { icon: Bold, action: () => applyFormat('bold'), label: '加粗' },
    { icon: Italic, action: () => applyFormat('italic'), label: '斜体' },
    { icon: Heading2, action: () => applyFormat('h2'), label: '标题' },
    { icon: List, action: () => applyFormat('list'), label: '列表' },
  ];

  // 所有工具
  const allTools = [
    { icon: Bold, action: () => applyFormat('bold'), label: '加粗' },
    { icon: Italic, action: () => applyFormat('italic'), label: '斜体' },
    { icon: Strikethrough, action: () => applyFormat('strikethrough'), label: '删除线' },
    { icon: Heading1, action: () => applyFormat('h1'), label: 'H1' },
    { icon: Heading2, action: () => applyFormat('h2'), label: 'H2' },
    { icon: Heading3, action: () => applyFormat('h3'), label: 'H3' },
    { icon: Quote, action: () => applyFormat('quote'), label: '引用' },
    { icon: Code, action: () => applyFormat('code'), label: '代码' },
    { icon: Terminal, action: () => applyFormat('codeblock'), label: '代码块' },
    { icon: List, action: () => applyFormat('list'), label: '无序列表' },
    { icon: ListOrdered, action: () => applyFormat('orderedList'), label: '有序列表' },
    { icon: ListTodo, action: () => applyFormat('task'), label: '任务' },
    { icon: LinkIcon, action: () => applyFormat('link'), label: '链接' },
    { icon: Minus, action: () => applyFormat('hr'), label: '分割线' },
  ];

  return (
    <div className="w-full flex flex-col h-[calc(100vh-64px)] relative overflow-hidden bg-transparent">
      {/* 工具栏 - 桌面端完整显示 */}
      <div className="hidden lg:block">
        <EditorToolbar
          leftContent={
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/articles')}
                className="h-11 w-11 flex items-center justify-center rounded-full bg-zinc-900/5 dark:bg-white/5 border border-white/20 dark:border-zinc-700/30 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer group"
              >
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </button>
              <div className="flex flex-col ml-1">
                <AnimatePresence mode="wait">
                  {isSaving ? (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Saving</span>
                    </div>
                  ) : lastSaved && (
                    <div className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">
                      Stored
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          }
          centerContent={
            <div className="flex items-center px-2 py-1 bg-zinc-900/5 dark:bg-white/5 rounded-2xl gap-0.5 border border-white/10 dark:border-zinc-800/20">
              {allTools.map((tool, idx) => (
                <React.Fragment key={tool.label}>
                  <ToolbarButton icon={tool.icon} onClick={tool.action} label={tool.label} />
                  {(idx === 2 || idx === 5 || idx === 8 || idx === 11) && (
                    <div className="w-px h-4 bg-zinc-200/20 mx-1" />
                  )}
                </React.Fragment>
              ))}
              <ImageInsertTool onInsert={(md) => {
                const el = textareaRef.current;
                if (!el) return;
                const start = el.selectionStart;
                const end = el.selectionEnd;
                const newContent = content.substring(0, start) + md + content.substring(end);
                setContent(newContent);
                setTimeout(() => {
                  el.focus();
                  el.setSelectionRange(start + md.length, start + md.length);
                }, 0);
              }} />
            </div>
          }
          rightContent={
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSettingsOpen(true)} 
                className="h-11 w-11 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPreviewMode(!isPreviewMode)} 
                className="h-11 w-11 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                {isPreviewMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
              <Button variant="primary" className="h-11 px-6 sm:px-8 rounded-full shadow-xl shadow-zinc-900/10 font-bold ml-2">
                发布
              </Button>
            </div>
          }
        />
      </div>

      {/* 移动端工具栏 - 简化版 + 可展开 */}
      <div className="lg:hidden flex items-center justify-between px-3 sm:px-4 py-2 border-b border-zinc-200/10 dark:border-zinc-700/20 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/articles')}
            className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-900/5 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          {/* 常用工具 */}
          <div className="flex items-center gap-1 ml-1">
            {commonTools.map((tool) => (
              <button
                key={tool.label}
                onClick={tool.action}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                <tool.icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>

          {/* 展开更多工具 */}
          <button
            onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
            className={cn(
              "h-8 px-2 flex items-center gap-1 rounded-lg text-xs font-medium transition-colors",
              isToolbarExpanded 
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" 
                : "bg-zinc-900/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400"
            )}
          >
            更多
            <ChevronDown className={cn("h-3 w-3 transition-transform", isToolbarExpanded && "rotate-180")} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSettingsOpen(true)} 
            className="h-9 w-9 rounded-full"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="primary" className="h-9 px-4 rounded-full text-sm font-bold">
            发布
          </Button>
        </div>
      </div>

      {/* 移动端展开的工具栏 */}
      <AnimatePresence>
        {isToolbarExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-b border-zinc-200/10 dark:border-zinc-700/20 bg-white/50 dark:bg-zinc-900/50"
          >
            <div className="p-3 grid grid-cols-7 gap-2">
              {allTools.map((tool) => (
                <button
                  key={tool.label}
                  onClick={() => {
                    tool.action();
                    setIsToolbarExpanded(false);
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <tool.icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  <span className="text-[10px] text-zinc-500">{tool.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主编辑区 */}
      <main className="flex-1 w-full flex flex-col overflow-hidden">
        {/* 标题输入 - 响应式字号 */}
        <div className="shrink-0 px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-12 pb-4 sm:pb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="文章标题"
            className="w-full bg-transparent border-none p-0 text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-zinc-900 dark:text-zinc-50 focus:ring-0 outline-none placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
          />
        </div>

        {/* 桌面端：左右分栏 */}
        <div className="hidden lg:flex flex-1 gap-8 min-h-0 px-6 lg:px-10 pb-10">
          {/* 编辑区 */}
          <div className={cn(
            "flex-1 h-full transition-all duration-500",
            isPreviewMode ? "max-w-1/2" : "max-w-5xl mx-auto w-full"
          )}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此开始你的创作..."
              className="w-full h-full bg-transparent border-none p-0 text-lg lg:text-xl font-sans leading-relaxed lg:leading-[2.1] text-zinc-700 dark:text-zinc-300 focus:ring-0 outline-none resize-none scrollbar-hidden"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 1rem, black calc(100% - 1rem), transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 1rem, black calc(100% - 1rem), transparent 100%)'
              }}
            />
          </div>

          {/* 预览区 */}
          <AnimatePresence>
            {isPreviewMode && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="flex-1 border-l border-zinc-200/10 dark:border-zinc-700/20 pl-8 overflow-y-auto scrollbar-hidden"
              >
                <div className="prose dark:prose-invert prose-zinc max-w-none prose-headings:font-serif prose-p:text-lg prose-p:leading-[2.1]">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 移动端：Tab 切换 */}
        <div className="lg:hidden flex-1 flex flex-col min-h-0 px-4 pb-20">
          {/* 内容区 */}
          <div className="flex-1 overflow-hidden relative">
            {/* 编辑视图 */}
            <div className={cn(
              "absolute inset-0 transition-all duration-300",
              mobileView === 'edit' ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在此开始你的创作..."
                className="w-full h-full bg-transparent border-none p-0 text-base font-sans leading-relaxed text-zinc-700 dark:text-zinc-300 focus:ring-0 outline-none resize-none"
              />
            </div>

            {/* 预览视图 */}
            <div className={cn(
              "absolute inset-0 overflow-y-auto transition-all duration-300",
              mobileView === 'preview' ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
            )}>
              <div className="prose dark:prose-invert prose-zinc max-w-none prose-sm sm:prose-base">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端底部 Tab 切换栏 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-200/20 dark:border-zinc-700/20 px-4 py-2 safe-area-pb">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setMobileView('edit')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                mobileView === 'edit'
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <FileEdit className="h-4 w-4" />
              编辑
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                mobileView === 'preview'
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <Eye className="h-4 w-4" />
              预览
            </button>
          </div>
        </div>
      </main>

      {/* 文章元数据配置抽屉 */}
      <ArticleSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        data={metadata}
        onChange={updateMetadata}
      />
    </div>
  );
}
