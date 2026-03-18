import React, { useState } from 'react';
import { 
  UserPlus, 
  Shield, 
  UserX, 
  Settings2,
  Mail,
  Calendar,
  ShieldCheck,
  Ban,
  Clock
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { ManagementLayout } from '../components/layout/ManagementLayout';
import { UserSettings } from '../components/UserSettings';

// 模拟用户数据
const mockUsers = [
  { 
    id: '1', 
    username: 'admin', 
    email: 'admin@multiterm.com', 
    role: 'admin', 
    status: 'ACTIVE', 
    createdAt: '2025-01-01', 
    lastLogin: '2026-03-15 10:30',
    remark: '系统初始化管理员，负责全站架构维护。',
    tags: ['Core', 'Superuser']
  },
  { 
    id: '2', 
    username: 'karene', 
    email: 'karene@example.com', 
    role: 'author', 
    status: 'ACTIVE', 
    createdAt: '2025-12-20', 
    lastLogin: '2026-03-14 22:15',
    remark: '首席专栏作家，专注于技术深度解析。',
    tags: ['Premium', 'Writer']
  },
  { 
    id: '3', 
    username: 'tester_01', 
    email: 'test@dev.local', 
    role: 'author', 
    status: 'BANNED', 
    createdAt: '2026-02-10', 
    lastLogin: '2026-02-11 09:00',
    remark: '测试账号，因违反创作公约已封禁。',
    tags: ['Test']
  },
  { 
    id: '4', 
    username: 'obsolete_user', 
    email: 'old@archive.org', 
    role: 'author', 
    status: 'PENDING_DELETE', 
    createdAt: '2025-05-15', 
    lastLogin: '2025-11-30 14:20',
    remark: '用户已申请注销，数据保留期中。',
    tags: ['Inactive']
  },
];

const statusMap = {
  ACTIVE: { label: '活跃', variant: 'success' as const },
  BANNED: { label: '已禁用', variant: 'warning' as const },
  PENDING_DELETE: { label: '待注销', variant: 'danger' as const },
};

const roleConfig = {
  admin: { 
    label: '管理员', 
    icon: ShieldCheck, 
    color: 'from-purple-500/20 to-indigo-500/20',
    iconColor: 'text-purple-500'
  },
  author: { 
    label: '创作者', 
    icon: Shield, 
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500'
  },
};

/**
 * UserList - 用户管理页面
 * 
 * 响应式设计：
 * - 网格: grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
 * - 触控: 按钮最小 44px，底部操作区始终可见
 * 
 * 层级：第一层级（导航页）
 */
export function UserList() {
  const { confirm } = useApp();
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenSettings = (user: any) => {
    setSelectedUser(user);
    setIsSettingsOpen(true);
  };

  const handleBanUser = (user: any) => {
    confirm({
      title: user.status === 'BANNED' ? '恢复成员权限' : '限制成员权限',
      content: user.status === 'BANNED' 
        ? `确定要恢复用户 ${user.username} 的访问权限吗？` 
        : `禁用后，用户 ${user.username} 将被阻断所有后台访问行为。`,
      confirmText: user.status === 'BANNED' ? '确认恢复' : '执行限制',
      variant: user.status === 'BANNED' ? 'success' : 'warning',
      onConfirm: () => {}
    });
  };

  return (
    <ManagementLayout
      title="成员管理"
      subtitle="连接每一位创作者，构建充满活力的内容社区。"
      primaryAction={{
        label: "邀请新成员",
        icon: UserPlus,
        onClick: () => {}
      }}
      tabs={[
        { label: '全部', value: 'ALL' },
        { label: '活跃', value: 'ACTIVE' },
        { label: '已封禁', value: 'BANNED' },
        { label: '注销中', value: 'PENDING_DELETE' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchPlaceholder="搜索成员姓名或身份..."
      accentColor="purple"
    >
      {/* 响应式网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {mockUsers.map((user) => {
          const role = roleConfig[user.role as keyof typeof roleConfig];
          const isBanned = user.status === 'BANNED';
          const isPendingDelete = user.status === 'PENDING_DELETE';

          return (
            <Card 
              key={user.id}
              padding="none" 
              hoverable 
              animated={false}
              className={cn(
                "h-full overflow-hidden flex flex-col border-white/20 dark:border-zinc-800/50 shadow-lg sm:shadow-xl",
                isBanned && "opacity-75 grayscale-[0.5] hover:grayscale-0 transition-[filter,opacity] duration-500",
                isPendingDelete && "border-red-500/20"
              )}
            >
              {/* 顶部渐变背景 */}
              <div className={cn("h-20 sm:h-24 w-full bg-gradient-to-br relative shrink-0", role.color)}>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <Badge dot variant={statusMap[user.status].variant} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-[10px] sm:text-xs">
                    {statusMap[user.status].label}
                  </Badge>
                </div>
              </div>

              {/* 内容区 */}
              <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-0 flex-1 flex flex-col">
                {/* 头像 + 标签 */}
                <div className="relative -mt-8 sm:-mt-10 mb-4 sm:mb-6 flex items-end justify-between">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-zinc-800 p-1 sm:p-1.5 shadow-xl">
                    <div className="h-full w-full rounded-[1.2rem] sm:rounded-[1.6rem] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-xl sm:text-2xl font-serif font-bold text-zinc-400">
                      {user.username[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="flex gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                    {user.tags.map(tag => (
                      <span key={tag} className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded tracking-wider uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 用户信息 */}
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        {user.username}
                      </h3>
                      <role.icon className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", role.iconColor)} />
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-zinc-400 text-xs sm:text-sm">
                      <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="font-sans truncate">{user.email}</span>
                    </div>
                  </div>

                  {/* 备注 */}
                  <div className="py-3 sm:py-4 border-y border-zinc-100 dark:border-zinc-800/50">
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 italic">
                      "{user.remark}"
                    </p>
                  </div>

                  {/* 统计 */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-0.5 sm:space-y-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-tighter flex items-center gap-1">
                        <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5" /> 最后活跃
                      </span>
                      <p className="text-[10px] sm:text-xs font-medium text-zinc-700 dark:text-zinc-300">{user.lastLogin.split(' ')[0]}</p>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-tighter flex items-center gap-1">
                        <Calendar className="h-2 w-2 sm:h-2.5 sm:w-2.5" /> 加入时间
                      </span>
                      <p className="text-[10px] sm:text-xs font-medium text-zinc-700 dark:text-zinc-300">{user.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 - 触控友好 */}
                <div className="mt-4 sm:mt-8 flex items-center gap-2 pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                  <Button 
                    variant="secondary" 
                    className="flex-1 h-9 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold gap-1.5 sm:gap-2" 
                    onClick={() => handleOpenSettings(user)}
                  >
                    <Settings2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> 详情
                  </Button>
                  <div className="flex gap-1.5 sm:gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleBanUser(user); }} 
                      className={cn(
                        "h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all active:scale-95",
                        isBanned ? "text-emerald-500 bg-emerald-500/5" : "text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-white"
                      )}
                      aria-label={isBanned ? "恢复用户" : "禁用用户"}
                    >
                      {isBanned ? <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" /> : <Ban className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
                    </button>
                    <button 
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                      aria-label="删除用户"
                    >
                      <UserX className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <UserSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        data={selectedUser} 
        onChange={(key, val) => setSelectedUser({ ...selectedUser, [key]: val })} 
      />
    </ManagementLayout>
  );
}
