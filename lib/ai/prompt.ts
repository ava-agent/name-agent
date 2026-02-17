import { UserContext } from "@/lib/types";

export function buildPrompt(context: Partial<UserContext>): string {
  const genderMap = { boy: "男孩", girl: "女孩", neutral: "不限" };
  const nameLengthMap = { two: "两字名", three: "三字名", any: "不限" };

  return `你是一位精通中国传统文化和现代命名艺术的起名大师。请根据以下信息为宝宝起名。

## 基本信息
- 姓氏：${context.surname || "未提供"}
- 性别：${context.gender ? genderMap[context.gender] : "未提供"}
- 出生日期：${context.birthDate || "未提供"}${context.birthTime ? ` ${context.birthTime}` : ""}

## 家族信息
- 父亲名字：${context.fatherName || "未提供"}
- 母亲名字：${context.motherName || "未提供"}
- 辈分字要求：${context.generationChar || "无"}
- 避讳用字：${context.avoidChars || "无"}

## 期望与偏好
- 性格期望：${context.traits?.length ? context.traits.join("、") : "未指定"}
- 人生愿景：${context.wishes?.length ? context.wishes.join("、") : "未指定"}
- 风格偏好：${context.style ?? 5}（1=古典诗词风，10=现代简约风）
- 字数偏好：${context.nameLength ? nameLengthMap[context.nameLength] : "不限"}
- 发音偏好：${context.pronunciation ?? 5}（1=响亮开口音，10=柔和闭口音）

## 文化偏好
- 五行偏好：${context.wuxing?.length && !context.wuxing.includes("不限") ? context.wuxing.join("、") : "不限"}

## 生活背景
- 家庭爱好：${context.hobbies?.length ? context.hobbies.join("、") : "未指定"}
- 居住地：${context.location || "未提供"}
- 已有兄弟姐妹/宠物名字：${context.existingNames || "无"}

## 用户补充
${context.freeText || "无"}

## 输出要求
请生成 5 个名字。每个名字必须包含以下字段，以 JSON 数组格式输出，不要输出任何其他内容：

\`\`\`json
[
  {
    "givenName": "名字（不含姓氏）",
    "pinyin": "完整拼音（含声调，姓+名）",
    "meaning": "含义解释（100字以内，说明每个字的含义和整体寓意）",
    "source": "诗词典故出处（如无则写"原创"）",
    "wuxingAnalysis": "五行分析（每个字的五行属性及组合关系）",
    "personalConnection": "个人关联（如何与用户上下文关联，50字以内）"
  }
]
\`\`\`

要求：
1. 5 个名字风格各异，涵盖不同意境
2. 避开用户指定的避讳字
3. 如有辈分字要求，至少 2 个名字包含辈分字
4. 充分利用用户提供的上下文信息，让名字与家庭背景产生关联
5. 仅输出 JSON，不要输出其他文字`;
}
