import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  MessageSquare,
  Clock,
  Key
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { SettingsDrawer, SettingField } from './ui/SettingsDrawer';

const statusMap = {
  ACTIVE: { label: '活跃', variant: 'success' },
  BANNED: { label: '已禁用', variant: 'warning' },
  PENDING_DELETE: { label: '待注销', variant: 'danger' },
} as const;

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onChange: (key: string, value: any) => void;
}

export function UserSettings({ isOpen, onClose, data, onChange }: UserSettingsProps) {
  if (!data) return null;

  return (
    <SettingsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="用户档案"
      underlineColor="bg-purple-500"
      saveText="保存档案更新"
    >
      {/* 基础信息只读展示 */}
      <div className="p-6 rounded-[2rem] bg-zinc-900/5 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-500">用户名</span>
          </div>
          <span className="text-sm font-bold font-mono text-zinc-900 dark:text-white">{data.username}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-500">邮箱地址</span>
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-white">{data.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-500">账号状态</span>
          </div>
          <Badge 
            dot 
            variant={statusMap[data.status as keyof typeof statusMap]?.variant || 'default'}
          >
            {statusMap[data.status as keyof typeof statusMap]?.label || data.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-500">系统角色</span>
          </div>
          <Badge variant={data.role === 'admin' ? 'info' : 'default'}>{data.role.toUpperCase()}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-500">最近活跃</span>
          </div>
          <span className="text-xs font-medium text-zinc-500 italic">{data.lastLogin}</span>
        </div>
      </div>

      {/* 管理备注 */}
      <SettingField icon={MessageSquare} label="内部管理备注" activeColorClass="group-focus-within:text-purple-500">
        <textarea 
          value={data.remark || ''}
          onChange={(e) => onChange('remark', e.target.value)}
          placeholder="仅管理员可见的备注信息..."
          className="w-full bg-zinc-900/5 dark:bg-white/5 rounded-[2rem] p-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-800 focus:border-purple-500 transition-all outline-none resize-none h-32 scrollbar-hidden font-sans"
        />
      </SettingField>

      {/* 账号安全操作 */}
      <div className="space-y-4">
        <Button variant="secondary" className="w-full justify-between h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 group">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            <span className="text-sm font-bold">强制重置密码</span>
          </div>
        </Button>
        <p className="px-2 text-[10px] text-zinc-400 italic">重置后将通过系统邮件或临时凭据通知该成员。</p>
      </div>
    </SettingsDrawer>
  );
}
