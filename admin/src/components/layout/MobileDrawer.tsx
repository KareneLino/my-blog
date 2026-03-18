import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Tag, 
  Settings, 
  Users,
  LogOut,
  Feather,
  X
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
 * MobileDrawer - 移动端抽屉导航
 * 
 * 从左侧滑出的全屏导航抽屉，用于替代桌面端的 Sidebar
 * 仅在 < lg 屏幕显示，由 Header 的汉堡菜单触发
 */
export function MobileDrawer() {
  const { isMobileMenuOpen, setIsMobileMenuOpen, confirm } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // 路由切换时自动关闭抽屉
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

  // ESC 键关闭抽屉
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
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
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* 抽屉主体 */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-[280px] z-50 lg:hidden"
          >
            <div className="h-full glass-sidebar flex flex-col overflow-hidden relative border-r border-white/30 dark:border-zinc-700/50 shadow-2xl">
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-zinc-200/20 dark:border-zinc-700/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg">
                    <Feather className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    字里行间
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 flex flex-col px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      'group relative flex items-center gap-4 rounded-2xl transition-all duration-300 h-14 px-4',
                      isActive 
                        ? 'bg-white dark:bg-zinc-800 shadow-md text-zinc-900 dark:text-white' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={cn(
                          "h-6 w-6 shrink-0 transition-transform duration-300",
                          isActive ? item.color : "text-zinc-400 dark:text-zinc-500",
                          "group-hover:scale-110"
                        )} />
                        <span className="text-base font-bold">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active-indicator"
                            className="absolute left-0 w-1 h-6 bg-zinc-900 dark:bg-white rounded-r-full"
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-200/20 dark:border-zinc-700/20 shrink-0">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 rounded-2xl h-14 px-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="text-base font-bold">退出登录</span>
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
