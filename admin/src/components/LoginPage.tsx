import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Lock, Feather, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { SegmentedControl } from "./ui/SegmentedControl";

const roleOptions = [
  { label: '创作者', value: 'author' },
  { label: '管理员', value: 'admin' },
];

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'author' | 'admin'>('author');
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkDark = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme === 'dark';
    };
    setIsDark(checkDark());
  }, [theme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟登录逻辑
    setTimeout(() => {
      setIsLoading(false);
      toast.success("欢迎回来", {
        description: "正在为您准备创作工作台...",
      });
      setTimeout(() => navigate('/'), 1000);
    }, 1500);
  };

  return (
    <div className="h-[100dvh] w-full relative font-sans overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 bg-zinc-100 dark:bg-zinc-950 transition-colors duration-700">
        <img
          src="https://picsum.photos/seed/brightworkspace/1920/1080?blur=4"
          alt="Day background"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ${isDark ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src="https://picsum.photos/seed/darknightscape/1920/1080?blur=4"
          alt="Night background"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Day/Night Overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/70 backdrop-blur-md transition-colors duration-700" />
      </div>

      {/* Theme Toggle at Top Right */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Scrollable Content Wrapper */}
      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col sm:p-8">
        {/* Main Glassmorphism Card */}
        <Card
          padding="none"
          className="w-full sm:max-w-[440px] flex-1 sm:flex-none flex flex-col justify-center m-auto px-6 py-12 sm:p-10 rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-none sm:border"
        >
          {/* Header Section */}
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex h-14 w-16 items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 mb-4 shadow-xl"
          >
            <Feather className="h-6 w-6" />
          </motion.div>
          
          <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-2 tracking-wide">
            字里行间
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            登录以继续您的创作之旅
          </p>
        </div>

        {/* Role Selector - 使用全局滑块组件 */}
        <div className="mb-6">
          <SegmentedControl
            options={roleOptions}
            value={role}
            onChange={(val) => setRole(val as 'author' | 'admin')}
            fullWidth
            className="w-full"
          />
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="identifier"
            label="账号"
            type="text"
            placeholder="邮箱或用户名"
            required
            leftIcon={<User className="h-4 w-4" />}
          />

          <div className="space-y-2">
            <Input
              id="password"
              label="密码"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="h-4 w-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="flex justify-end pr-1">
              <a 
                href="#" 
                className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 cursor-pointer flex items-center group/link"
              >
                忘记密码？
                <motion.span
                  className="inline-block ml-0.5"
                  initial={{ x: 0 }}
                  whileHover={{ x: 2 }}
                >
                  →
                </motion.span>
              </a>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            size="lg"
            className="w-full !mt-6"
          >
            进入工作台
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        {/* Social Logins */}
        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-300 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
              <span className="bg-transparent px-4 text-zinc-500 dark:text-zinc-400">
                快捷登录
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
            {/* WeChat */}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-12 !text-[#07C160]"
              aria-label="使用微信登录"
            >
              <svg className="h-6 w-6" viewBox="0 0 1024 1024" fill="currentColor">
                <path d="M682.667 341.333c-119.467 0-213.334 85.334-213.334 192s85.334 192 213.334 192c25.6 0 51.2-4.267 76.8-12.8 34.133 25.6 76.8 34.133 119.466 34.134-12.8-29.867-17.066-64-12.8-93.867 34.134-34.133 51.2-76.8 51.2-119.467 0-106.666-106.666-192-234.666-192z m-59.734 106.667c17.067 0 34.134 12.8 34.134 29.867s-17.067 29.866-34.134 29.866-34.133-12.8-34.133-29.866 17.066-29.867 34.133-29.867z m119.467 0c17.066 0 34.133 12.8 34.133 29.867s-17.067 29.866-34.133 29.866-34.134-12.8-34.134-29.866 17.067-29.867 34.134-29.867zM341.333 170.667c-170.666 0-315.733 119.466-315.733 273.066 0 85.334 42.667 157.867 110.933 213.334-8.533 42.666-25.6 93.866-25.6 93.866 0 0 68.267-21.333 145.067-64 25.6 8.534 55.467 12.8 85.333 12.8 17.067 0 34.134-4.266 51.2-4.266-12.8-25.6-21.333-55.467-21.333-85.334 0-140.8 132.266-256 298.666-256 12.8 0 25.6 0 38.4 4.267C674.133 243.2 520.533 170.667 341.333 170.667z m-85.333 149.333c25.6 0 42.667 17.067 42.667 42.667s-17.067 42.666-42.667 42.666-42.667-17.066-42.667-42.666 17.067-42.667 42.667-42.667z m170.667 0c25.6 0 42.666 17.067 42.666 42.667s-17.066 42.666-42.666 42.666-42.667-17.066-42.667-42.666 17.067-42.667 42.667-42.667z"/>
              </svg>
            </Button>
            {/* QQ */}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-12 !text-[#12B7F5]"
              aria-label="使用 QQ 登录"
            >
              <svg className="h-6 w-6" viewBox="0 0 1024 1024" fill="currentColor">
                <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"/>
              </svg>
            </Button>
            {/* GitHub */}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-12 text-zinc-900 dark:text-white"
              aria-label="使用 GitHub 登录"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </Button>
            {/* Google */}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-12 text-zinc-700 dark:text-zinc-300"
              aria-label="使用 Google 登录"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
          还没有账号？{" "}
          <a href="#" className="font-bold text-zinc-900 dark:text-white hover:underline underline-offset-4 transition-all cursor-pointer">
            申请入驻
          </a>
        </p>
      </Card>
      </div>
    </div>
  );
}
