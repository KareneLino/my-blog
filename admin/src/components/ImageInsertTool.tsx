import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageIcon, UploadCloud, Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { SegmentedControl } from './ui/SegmentedControl';

interface ImageInsertToolProps {
  onInsert: (markdown: string) => void;
}

/**
 * 独立的图片插入工具组件
 * 支持本地上传与外链嵌入双轨制，附带悬浮面板交互
 */
export function ImageInsertTool({ onInsert }: ImageInsertToolProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [linkUrl, setLinkUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭弹窗
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setLinkUrl('');
        setAltText('');
        setActiveTab('upload');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleLinkInsert = () => {
    if (!linkUrl.trim()) {
      toast.error('请输入图片链接');
      return;
    }
    onInsert(`\n![${altText.trim() || 'image'}](${linkUrl})\n`);
    setIsOpen(false);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }

    setIsUploading(true);
    // 1. 先插入占位符
    const placeholderId = `uploading-${Date.now()}`;
    const displayAlt = altText.trim() || file.name || 'image';
    onInsert(`\n![${displayAlt} 上传中...](${placeholderId})\n`);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'misc');

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json();
      if (!response.ok || (resData.code !== 200 && resData.code !== 201)) {
        throw new Error(resData.message || '图片上传失败');
      }

      // TODO: 真实工程中应基于 content 替换占位符
      
      toast.success('图片上传成功');
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="插入图片"
        className={cn(
          "p-2.5 rounded-xl transition-all cursor-pointer group flex items-center justify-center",
          isOpen ? "bg-zinc-900/10 dark:bg-white/20" : "hover:bg-zinc-900/10 dark:hover:bg-white/20"
        )}
      >
        <ImageIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-[calc(100%+1.25rem)] left-1/2 -translate-x-1/2 w-[340px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl border border-zinc-200/50 dark:border-zinc-700/50 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] z-50 py-3 flex flex-col gap-4"
          >
            {/* 顶部 Tab - 增加 px-3 确保宽度对齐 */}
            <div className="px-3">
              <SegmentedControl 
                options={[
                  { label: '本地上传', value: 'upload' },
                  { label: '嵌入外链', value: 'link' }
                ]}
                value={activeTab}
                onChange={setActiveTab}
                fullWidth
                className="w-full"
              />
            </div>

            {/* 公共 Alt 属性填写 */}
            <div className="px-3">
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Alt: 对图片的简短描述 (可选)"
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-inner rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 ring-zinc-900/10 dark:ring-white/10 outline-none transition-all"
              />
            </div>

            <div className="px-3 pb-3">
              {activeTab === 'upload' ? (
                <div 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className="w-full h-32 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group relative overflow-hidden"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-xs font-bold uppercase tracking-widest">Uploading</span>
                    </div>
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center text-zinc-500 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <span className="text-xs text-zinc-500 font-medium">点击选择图片文件</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLinkInsert()}
                    placeholder="https://example.com/image.png"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-inner rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 ring-zinc-900/10 dark:ring-white/10 outline-none transition-all"
                  />
                  <Button variant="primary" className="w-full h-10 rounded-xl font-bold shadow-md" onClick={handleLinkInsert}>
                    确认插入
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
