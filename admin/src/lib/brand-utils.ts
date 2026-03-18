import * as si from 'simple-icons';

/**
 * 智能品牌识别引擎
 * 自动匹配名称、官方色与图标路径
 */
export function discoverBrand(name: string) {
  if (!name) return null;

  // 1. 标准化 Slug 处理 (Simple Icons 标准)
  const normalize = (str: string) => 
    str.toLowerCase()
       .replace(/\+/g, 'plus')
       .replace(/\./g, 'dot')
       .replace(/[^a-z0-9]/g, '');

  const slug = normalize(name);
  
  // 2. 尝试获取图标数据
  try {
    // 尝试直接获取 (如 'react', 'javascript', 'nodedotjs')
    let icon = (si as any)[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];
    
    // 如果直接获取失败，尝试在库中搜索最接近的 key
    if (!icon) {
      const allIcons = si as any;
      const targetKey = `si${slug}`;
      // 遍历寻找匹配项
      for (const key in allIcons) {
        if (key.toLowerCase() === targetKey) {
          icon = allIcons[key];
          break;
        }
      }
    }

    if (icon) {
      return {
        name: icon.title,
        color: `#${icon.hex}`,
        path: icon.path,
        slug: icon.slug
      };
    }
  } catch (e) {
    console.error('Brand discovery error:', e);
  }

  return null;
}
