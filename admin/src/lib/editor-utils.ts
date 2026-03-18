/**
 * 编辑器纯工具函数
 * 专注于字符串处理与光标计算，不依赖 React 状态
 */
export const MARKDOWN_FORMATS = {
  bold: (s: string) => `**${s || '加粗文字'}**`,
  italic: (s: string) => `*${s || '斜体文字'}*`,
  strikethrough: (s: string) => `~~${s || '删除文字'}~~`,
  link: (s: string) => `[${s || '链接文字'}](https://)`,
  quote: (s: string) => `\n> ${s || '引用文字'}\n`,
  code: (s: string) => `\`${s || '代码'}\``,
  codeblock: (s: string) => `\n\`\`\`javascript\n${s || '在此输入代码'}\n\`\`\`\n`,
  h1: (s: string) => `\n# ${s || '一级标题'}\n`,
  h2: (s: string) => `\n## ${s || '二级标题'}\n`,
  h3: (s: string) => `\n### ${s || '三级标题'}\n`,
  list: (s: string) => `\n- ${s || '列表项'}`,
  orderedList: (s: string) => `\n1. ${s || '有序列表项'}`,
  task: (s: string) => `\n- [ ] ${s || '待办任务'}`,
  hr: () => `\n---\n`,
};

export type FormatType = keyof typeof MARKDOWN_FORMATS;

/**
 * 在 textarea 中应用格式
 */
export function injectFormat(
  el: HTMLTextAreaElement,
  content: string,
  type: FormatType
): { newContent: string; newCursorPos: number } {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selection = content.substring(start, end);
  const before = content.substring(0, start);
  const after = content.substring(end);

  const replacement = MARKDOWN_FORMATS[type](selection);
  const newContent = before + replacement + after;
  const newCursorPos = start + replacement.length;

  return { newContent, newCursorPos };
}
