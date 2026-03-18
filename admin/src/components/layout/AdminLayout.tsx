import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../ThemeProvider';

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
      {/* 全局背景图层 (同步 LoginPage 逻辑) */}
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
        {/* 全局毛玻璃遮罩 - 弱化明度 */}
        <div className="absolute inset-0 bg-zinc-50/60 dark:bg-zinc-950/80 backdrop-blur-[100px] transition-colors duration-700" />
      </div>

      <div className="relative z-10">
        <Sidebar />

        <motion.main
          initial={false}
          animate={{ 
            paddingLeft: isSidebarCollapsed ? 100 : 300,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          className="flex flex-col min-h-screen"
        >
          <Header />
          
          <div className="flex-1 p-6 lg:p-10">
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
