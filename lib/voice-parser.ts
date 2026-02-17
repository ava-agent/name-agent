/**
 * 将语音识别文本匹配到选项列表
 */
export function matchVoiceToOption(
  transcript: string,
  options: { label: string; value: string }[]
): string | null {
  const text = transcript.trim();
  // 精确匹配 label 或 value
  for (const opt of options) {
    if (text.includes(opt.label) || text.includes(opt.value)) {
      return opt.value;
    }
  }
  return null;
}

/**
 * 将语音识别文本匹配到多个选项
 */
export function matchVoiceToMultiOptions(
  transcript: string,
  options: { label: string; value: string }[]
): string[] {
  const text = transcript.trim();
  const matched: string[] = [];
  for (const opt of options) {
    if (text.includes(opt.label) || text.includes(opt.value)) {
      matched.push(opt.value);
    }
  }
  return matched.slice(0, 3); // 最多 3 个
}

/**
 * 将语音文本解析为滑块值
 * 支持: 数字、"偏左/偏右"、"古典/现代"、"响亮/柔和"等关键词
 */
export function matchVoiceToSlider(
  transcript: string,
  min: number,
  max: number
): number | null {
  const text = transcript.trim();

  // 尝试匹配数字
  const numMatch = text.match(/(\d+)/);
  if (numMatch) {
    const n = parseInt(numMatch[1]);
    if (n >= min && n <= max) return n;
  }

  // 关键词映射
  const lowKeywords = ["古典", "传统", "诗词", "响亮", "开口", "偏左", "小", "低"];
  const highKeywords = ["现代", "简约", "时尚", "柔和", "闭口", "偏右", "大", "高"];
  const midKeywords = ["中间", "适中", "一般", "都行", "中等"];

  for (const kw of lowKeywords) {
    if (text.includes(kw)) return Math.round(min + (max - min) * 0.2);
  }
  for (const highKw of highKeywords) {
    if (text.includes(highKw)) return Math.round(min + (max - min) * 0.8);
  }
  for (const midKw of midKeywords) {
    if (text.includes(midKw)) return Math.round((min + max) / 2);
  }

  return null;
}
