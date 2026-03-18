import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageIcon, Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface ImageUploadZoneProps {
  value: string;
  onChange: (url: string) => void;
  purpose?: string;
  aspectRatio?: string;
  className?: string;
  recommendedSize?: string;
}

/**
 * ImageUploadZone 原子化组件
 * 封装了从选择、拖拽、本地预览到后端上传的全链路交互
 */
export function ImageUploadZone({
  value,
  onChange,
  purpose = 'misc',
  aspectRatio = 'aspect-[16/9]',
  className,
  recommendedSize = '1600 × 900'
}: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', purpose);

      // 调用后端上传接口
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok || (resData.code !== 200 && resData.code !== 201)) {
        throw new Error(resData.message || '上传失败');
      }

      onChange(resData.data.url);
      toast.success('图片上传成功');
    } catch (error: any) {
      toast.error(error.message);
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleDrag = (e: React.DragEvent, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      onClick={() => !isUploading && fileInputRef.current?.click()}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
      className={cn(
        "group relative w-full rounded-[2.5rem] bg-zinc-900/5 dark:bg-white/5 border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all overflow-hidden cursor-pointer",
        aspectRatio,
        isDragging 
          ? "border-blue-500 bg-blue-500/10 scale-[1.02]" 
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800",
        isUploading && "pointer-events-none",
        className
      )}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      />

      {(localPreview || value) ? (
        <>
          <img 
            src={localPreview || value} 
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              !isUploading && "group-hover:scale-105"
            )} 
            alt="Preview"
          />
          <AnimatePresence>
            {isUploading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md flex flex-col items-center justify-center gap-3 text-white"
              >
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-xs font-bold tracking-widest uppercase">Uploading...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <>
          <div className={cn(
            "h-16 w-16 rounded-full bg-zinc-900/5 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-all duration-500 border border-zinc-200/20",
            isDragging && "scale-110 bg-blue-500 text-white"
          )}>
            {isDragging ? <UploadCloud className="h-8 w-8" /> : <ImageIcon className="h-8 w-8" />}
          </div>
          <div className="text-center space-y-1">
            <p className={cn(
              "text-xs font-bold tracking-wider",
              isDragging ? "text-blue-500" : "text-zinc-500"
            )}>
              {isDragging ? "松开鼠标开始上传" : "点击或拖拽上传图片"}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">推荐尺寸 {recommendedSize}, 最大 5MB</p>
          </div>
        </>
      )}
    </div>
  );
}
