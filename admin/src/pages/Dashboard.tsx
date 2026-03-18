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
import { Label } from '../components/ui/Typography';
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

/**
 * Dashboard - 工作台页面
 * 
 * 响应式设计：
 * - 统计卡片: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
 * - 图表高度: h-[250px] sm:h-[300px] lg:h-[350px]
 * 
 * 层级：第一层级（导航页）
 */
export function Dashboard() {
  const navigate = useNavigate();

  return (
    <ManagementLayout
      title="工作台"
      subtitle="欢迎回来，Karene。这是你最近 7 天的创作概览。"
      showFilterBar={false}
      accentColor="blue"
      primaryAction={{
        label: "撰写新文章",
        icon: Plus,
        onClick: () => navigate('/articles/new')
      }}
      headerActions={
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <Download className="h-4 w-4" />
          下载报告
        </button>
      }
    >
      {/* 统计卡片网格 - 响应式列数 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Views', value: '24,512', trend: '+12.5%', isUp: true, icon: Eye },
          { label: 'Unique Visitors', value: '3,842', trend: '+5.2%', isUp: true, icon: Users },
          { label: 'Total Articles', value: '128', trend: '-2', isUp: false, icon: FileText },
          { label: 'New Comments', value: '85', trend: '+18.2%', isUp: true, icon: MessageSquare },
        ].map((stat) => (
          <Card 
            key={stat.label} 
            hoverable 
            animated={false}
            className="h-full flex flex-col justify-between group"
          >
            <div className="flex justify-between items-start">
              <Label className="text-xs sm:text-sm">{stat.label}</Label>
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </div>
            <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold",
                  stat.isUp ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                )}>
                  {stat.isUp ? <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" /> : <ArrowDownRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />}
                  {stat.trend}
                </div>
                <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">较上周</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 图表区域 - 响应式高度 */}
      <Card animated={false} className="p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">访问趋势</h3>
            <p className="text-xs sm:text-sm text-zinc-500">过去 7 天的全站浏览量分布</p>
          </div>
        </div>
        <div className="h-[200px] sm:h-[280px] lg:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#a1a1aa', fontSize: 10}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#a1a1aa', fontSize: 10}} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
                  backgroundColor: 'rgba(255,255,255,0.9)', 
                  backdropFilter: 'blur(10px)' 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#18181b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#chartGradient)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </ManagementLayout>
  );
}
