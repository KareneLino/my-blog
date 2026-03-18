import React from 'react';
import { AnimatePresence } from 'motion/react';
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
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { EditorToolbar, ToolbarButton } from '../components/ui/EditorToolbar';
import { useArticleEditor } from '../hooks/useArticleEditor';
import { ArticleSettings } from '../components/ArticleSettings';
import { ImageInsertTool } from '../components/ImageInsertTool';

/**
 * ArticleEditor - 文章编辑页面
 * 
 * 层级：第三层级（功能页）
 * 布局：全屏沉浸式编辑器
 * 特点：无 ManagementLayout，直接使用页面级容器
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

  return (
    <div className="w-full flex flex-col h-[calc(100vh-80px)] relative overflow-hidden bg-transparent">
      {/* 沉浸式悬浮 Dock */}
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
            <ToolbarButton icon={Bold} onClick={() => applyFormat('bold')} label="加粗" />
            <ToolbarButton icon={Italic} onClick={() => applyFormat('italic')} label="斜体" />
            <ToolbarButton icon={Strikethrough} onClick={() => applyFormat('strikethrough')} label="删除线" />
            <div className="w-px h-4 bg-zinc-200/20 mx-1" />
            <ToolbarButton icon={Heading1} onClick={() => applyFormat('h1')} label="一级标题" />
            <ToolbarButton icon={Heading2} onClick={() => applyFormat('h2')} label="二级标题" />
            <ToolbarButton icon={Heading3} onClick={() => applyFormat('h3')} label="三级标题" />
            <div className="w-px h-4 bg-zinc-200/20 mx-1" />
            <ToolbarButton icon={Quote} onClick={() => applyFormat('quote')} label="引用" />
            <ToolbarButton icon={Code} onClick={() => applyFormat('code')} label="行内代码" />
            <ToolbarButton icon={Terminal} onClick={() => applyFormat('codeblock')} label="代码块" />
            <div className="w-px h-4 bg-zinc-200/20 mx-1" />
            <ToolbarButton icon={List} onClick={() => applyFormat('list')} label="无序列表" />
            <ToolbarButton icon={ListOrdered} onClick={() => applyFormat('orderedList')} label="有序列表" />
            <ToolbarButton icon={ListTodo} onClick={() => applyFormat('task')} label="待办任务" />
            <div className="w-px h-4 bg-zinc-200/20 mx-1" />
            <ToolbarButton icon={LinkIcon} onClick={() => applyFormat('link')} label="链接" />
            <ToolbarButton icon={Minus} onClick={() => applyFormat('hr')} label="分割线" />
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
            <Button variant="primary" className="h-11 px-8 rounded-full shadow-xl shadow-zinc-900/10 font-bold ml-2">
              发布
            </Button>
          </div>
        }
      />

      {/* 写作主战场 */}
      <main className={cn(
        "flex-1 w-full flex flex-col pt-12 pb-16 px-10 mx-auto overflow-hidden transition-all duration-700",
        isPreviewMode ? "max-w-[1600px]" : "max-w-5xl"
      )}>
        {/* 固定标题区 */}
        <div className="mb-10 shrink-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="文章标题"
            className="w-full bg-transparent border-none p-0 text-6xl font-serif font-bold text-zinc-900 dark:text-zinc-50 focus:ring-0 outline-none placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
          />
        </div>

        {/* 滚动正文区 */}
        <div 
          className={cn(
            "flex-1 flex gap-16 min-h-0", 
            isPreviewMode ? "grid grid-cols-2" : "flex-col"
          )}
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 2rem, black calc(100% - 2rem), transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 2rem, black calc(100% - 2rem), transparent 100%)'
          }}
        >
          {/* 正文输入 */}
          <div className="flex-1 h-full flex flex-col">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此开始你的创作..."
              className="flex-1 w-full bg-transparent border-none p-0 text-xl font-sans leading-[2.1] text-zinc-700 dark:text-zinc-300 focus:ring-0 outline-none resize-none scrollbar-hidden py-4"
            />
          </div>

          {/* 预览区 */}
          <AnimatePresence>
            {isPreviewMode && (
              <div className="flex-1 border-l border-zinc-200/10 dark:border-zinc-700/20 pl-16 overflow-y-auto scrollbar-hidden py-4">
                <div className="prose dark:prose-invert prose-zinc max-w-none prose-headings:font-serif prose-p:text-lg prose-p:leading-[2.1]">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            )}
          </AnimatePresence>
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
