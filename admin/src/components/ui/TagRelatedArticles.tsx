import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Calendar, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface TagRelatedArticlesProps {
  isOpen: boolean;
  onClose: () => void;
  tagName: string;
  articles: any[];
}

export function TagRelatedArticles({ isOpen, onClose, tagName, articles }: TagRelatedArticlesProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] shadow-2xl z-[110] overflow-hidden"
          >
            {/* Header */}
            <div className="px-10 py-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white font-sans">
                  关联文章：<span className="text-blue-500">{tagName}</span>
                </h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer">
                <X className="h-6 w-6 text-zinc-400" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-3 scrollbar-hidden font-sans">
              {articles.length > 0 ? articles.map((article) => (
                <div 
                  key={article.id}
                  className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views} 阅读</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" onClick={() => window.open(`/${article.slug}`, '_blank')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )) : (
                <div className="py-20 text-center text-zinc-400 italic">
                  该标签下暂无收录文章
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-zinc-50/50 dark:bg-zinc-950/20 text-center">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
                Total {articles.length} matched creations
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
