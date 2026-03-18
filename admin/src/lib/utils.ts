import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind 类名，解决类名冲突并支持条件渲染
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 根据字符串生成确定性的 HSL 颜色
 * 确保同一个名字在任何地方显示的颜色都一致，且符合我们的 Glass 审美（高饱和度、中等亮度）
 */
export function getTagColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // 映射到色相 (0-360)
  const h = Math.abs(hash) % 360;
  // 保持较高的饱和度和适中的亮度，确保在玻璃背景下好看
  return `hsl(${h}, 70%, 60%)`;
}
