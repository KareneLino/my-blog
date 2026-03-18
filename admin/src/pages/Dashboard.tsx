import React from 'react';
import { 
  Users, 
  Eye, 
  FileText, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { PageAction } from '../components/ui/PageAction';
import { cn } from '../lib/utils';
import { ManagementLayout } from '../components/layout/ManagementLayout';

// 模拟趋势数据
const trendData = [
  { name: '03-07', views: 400 },
  { name: '03-08', views: 300 },
  { name: '03-09', views: 600 },
  { name: '03-10', views: 278 },
  { name: '03-11', views: 189 },
  { name: '03-12', views: 539 },
  { name: '03-13', views: 349 },
];

// 统计数据配置
const statsConfig = [
  { 
    label: '浏览量', 
    value: '24,512', 
    trend: '+12.5%', 
    isUp: true, 
    icon: Eye,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500'
  },
  { 
    label: '访客数', 
    value: '3,842', 
    trend: '+5.2%', 
    isUp: true, 
    icon: Users,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500'
  },
  { 
    label: '文章数', 
    value: '128', 
    trend: '-2', 
    isUp: false, 
    icon: FileText,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500'
  },
  { 
    label: '新评论', 
    value: '85', 
    trend: '+18.2%', 
    isUp: true, 
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500'
  },
];

/**
 * Dashboard - 工作台页面
 * 
 * 响应式设计：
 * - 移动端 (< 1280px): 包括 iPad Pro，仅查看权限
 * - 桌面端 (≥ 1280px): 完整权限，显示操作按钮
 */
export function Dashboard() {
  const navigate = useNavigate();

  return (
    <ManagementLayout
      title="工作台"
      subtitle="欢迎回来，Karene。这是你最近 7 天的创作概览。"
      showFilterBar={false}
      accentColor="blue"
      // 操作按钮组 - 使用 PageAction 组件，仅桌面端显示
      headerActions={
        <div className="hidden xl:flex items-center gap-3">
          <PageAction 
            icon={Download} 
            variant="secondary"
            onClick={() => {}}
          >
            下载报告
          </PageAction>
          <PageAction 
            icon={Plus}
            onClick={() => navigate('/articles/new')}
          >
            撰写新文章
          </PageAction>
        </div>
      }
    >
      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
        {statsConfig.map((stat) => (
          <Card 
            key={stat.label} 
            hoverable 
            animated={false}
            className="group relative overflow-hidden"
          >
            {/* 背景装饰 */}
            <div className={cn(
              "absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-110",
              stat.bgColor
            )} />
            
            {/* 统一布局 */}
            <div className="p-1">
              {/* 顶部：标签 + 图标 */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-zinc-500">
                  {stat.label}
                </span>
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  "bg-zinc-100 dark:bg-zinc-800/50 group-hover:scale-110 transition-transform"
                )}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
              
              {/* 中部：大数字 */}
              <div className="text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-50 mb-2">
                {stat.value}
              </div>
              
              {/* 底部：趋势 */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                  stat.isUp ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                )}>
                  {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.trend}
                </div>
                <span className="text-xs text-zinc-400">较上周</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <Card animated={false} className="mt-6 md:mt-8 p-4 sm:p-6 xl:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div>
            <h3 className="text-lg sm:text-xl xl:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              访问趋势
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              过去 7 天的全站浏览量分布
            </p>
          </div>
          {/* 时间筛选 */}
          <div className="hidden sm:flex items-center gap-2">
            {['7天', '30天', '90天'].map((period, i) => (
              <button
                key={period}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  i === 0 
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" 
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        {/* 图表容器 */}
        <div className="h-[220px] sm:h-[300px] xl:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={trendData} 
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#e4e4e7" 
                opacity={0.3} 
              />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#a1a1aa', fontSize: 11}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#a1a1aa', fontSize: 11}} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)', 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  backdropFilter: 'blur(10px)',
                  padding: '12px 16px'
                }}
                labelStyle={{ color: '#71717a', fontSize: '12px', marginBottom: '4px' }}
                itemStyle={{ color: '#18181b', fontSize: '14px', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#18181b" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#chartGradient)" 
                animationDuration={1500}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#18181b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </ManagementLayout>
  );
}
