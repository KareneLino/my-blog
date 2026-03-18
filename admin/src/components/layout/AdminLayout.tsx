import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../ThemeProvider';

/**
 * AdminLayout - 后台管理主布局
 * 
 * 响应式设计：
 * - 桌面端 (>=lg): 固定 Sidebar (100px/300px) + 主内容区自适应
 * - 移动端 (<lg): Sidebar 隐藏，使用 MobileDrawer 抽屉导航
 * 
 * 布局结构：
 * [Sidebar/Desktop] + [Header + Outlet]
 * [MobileDrawer] (仅在移动端通过汉堡菜单触发)
 */
export function AdminLayout() {
  const { isSidebarCollapsed } = useApp();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme === 'dark';
    };
    setIsDark(checkDark());
  }, [theme]);

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden">
      {/* 全局背景图层 */}
      <div className="fixed inset-0 z-0 bg-zinc-100 dark:bg-zinc-950 transition-colors duration-700">
        <img
          src="https://picsum.photos/seed/brightworkspace/1920/1080?blur=10"
          alt="Day background"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isDark ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src="https://picsum.photos/seed/darknightscape/1920/1080?blur=10"
          alt="Night background"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-zinc-50/60 dark:bg-zinc-950/80 backdrop-blur-[100px] transition-colors duration-700" />
      </div>

      <div className="relative z-10">
        {/* 桌面端侧边栏 - lg 以下隐藏 */}
        <Sidebar />

        {/* 移动端抽屉导航 */}
        <MobileDrawer />

        {/* 主内容区 */}
        <motion.main
          initial={false}
          animate={{ 
            // 移动端: paddingLeft = 0 (Sidebar 隐藏)
            // 桌面端: 根据 Sidebar 折叠状态
            paddingLeft: isSidebarCollapsed ? 100 : 300,
          }}
          // 在移动端 (小于 lg) 时，强制 paddingLeft 为 0
          className="flex flex-col min-h-screen lg:transition-[padding] lg:duration-300"
          style={{
            paddingLeft: typeof window !== 'undefined' && window.innerWidth < 1024 
              ? 0 
              : undefined
          }}
        >
          <Header />
          
          <div className="flex-1 p-4 sm:p-6 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="h-full w-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
