import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Tag, 
  Settings, 
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Feather
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';

const menuItems = [
  { icon: LayoutDashboard, label: '工作台', path: '/', color: 'text-indigo-500' },
  { icon: FileText, label: '内容管理', path: '/articles', color: 'text-blue-500' },
  { icon: FolderTree, label: '分类', path: '/categories', color: 'text-emerald-500' },
  { icon: Tag, label: '标签', path: '/tags', color: 'text-amber-500' },
  { icon: Users, label: '用户管理', path: '/users', color: 'text-purple-500' },
  { icon: Settings, label: '系统设置', path: '/settings', color: 'text-zinc-900 dark:text-white' },
];

/**
 * Sidebar 侧边栏组件
 * 采用 Glass-Primer Fusion 规范：大气字号、同步动效、工业级对齐
 */
export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar, confirm } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    confirm({
      title: '退出登录',
      content: '确定要结束当前的创作会话吗？未保存的更改可能会丢失。',
      confirmText: '退出',
      variant: 'danger',
      onConfirm: () => {
        toast.info('已安全退出');
        navigate('/login');
      }
    });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isSidebarCollapsed ? 100 : 300,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      className="fixed left-0 top-0 h-full z-40 p-4 hidden lg:block"
    >
      <div className="h-full glass-sidebar flex flex-col overflow-hidden relative border-white/30 dark:border-zinc-700/50 shadow-2xl">
        {/* Logo Section */}
        <div className="h-24 flex items-center justify-center shrink-0">
          <div className={cn(
            "flex items-center transition-all duration-500",
            isSidebarCollapsed ? "justify-center" : "px-6 w-full gap-4"
          )}>
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-xl">
              <Feather className="h-6 w-6" />
            </div>
            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0, x: -10 }}
                  animate={{ opacity: 1, width: 'auto', x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -10 }}
                  className="text-2xl font-serif font-bold text-zinc-900 dark:text-white whitespace-nowrap overflow-hidden"
                >
                  字里行间
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 flex flex-col items-center px-3 space-y-3 overflow-y-auto overflow-x-hidden scrollbar-hidden">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'group relative flex items-center rounded-2xl transition-all duration-300 h-14',
                isSidebarCollapsed ? 'w-14 justify-center' : 'w-full px-5 gap-4',
                isActive 
                  ? 'text-zinc-900 dark:text-white' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-white/50 dark:border-zinc-700/50 z-0"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <item.icon className={cn(
                    "h-6 w-6 z-10 shrink-0 transition-transform duration-300 group-hover:scale-110",
                    isActive ? item.color : "text-zinc-400 dark:text-zinc-500"
                  )} />
                  <AnimatePresence>
                    {!isSidebarCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-base font-bold z-10 whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="px-3 pb-6 mt-auto shrink-0">
          <div className="mb-4 h-px bg-zinc-200/20 dark:bg-zinc-700/30 w-full" />
          
          <div className={cn(
            "flex transition-all duration-500 gap-2",
            isSidebarCollapsed ? "flex-col items-center" : "flex-row justify-between px-1"
          )}>
            <button
              onClick={toggleSidebar}
              title={isSidebarCollapsed ? "展开边栏" : "收起边栏"}
              className="h-12 w-12 flex items-center justify-center rounded-2xl text-zinc-500 hover:bg-white/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer group"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <PanelLeftClose className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>

            <button 
              onClick={handleLogout}
              title="退出登录"
              className="h-12 w-12 flex items-center justify-center rounded-2xl text-zinc-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all cursor-pointer group"
            >
              <LogOut className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
