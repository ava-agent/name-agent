// 用户上下文数据类型
export interface UserContext {
  // 第 1 组：基本信息
  surname: string;
  gender: "boy" | "girl" | "neutral";
  birthDate?: string;
  birthTime?: string;

  // 第 2 组：期望与寓意
  traits: string[];
  wishes: string[];
  style: number; // 1-10, 1=古典诗词风, 10=现代简约风

  // 第 3 组：家族信息
  fatherName?: string;
  motherName?: string;
  generationChar?: string;
  avoidChars?: string;

  // 第 4 组：文化偏好
  wuxing?: string[];
  nameLength: "two" | "three" | "any";
  pronunciation: number; // 1-10, 1=开口音（响亮）, 10=闭口音（柔和）

  // 第 5 组：生活背景
  hobbies: string[];
  location?: string;
  existingNames?: string;

  // 第 6 组：自由补充
  freeText?: string;
}

// AI 生成的名字
export interface GeneratedName {
  id: string;
  surname: string;
  givenName: string;
  pinyin: string;
  meaning: string;
  source: string;
  wuxingAnalysis: string;
  personalConnection: string;
}

// 卡片类型
export type CardType =
  | "text-input"
  | "select"
  | "multi-select"
  | "slider"
  | "date-picker"
  | "voice-input";

// 卡片配置
export interface CardConfig {
  id: string;
  group: number;
  groupName: string;
  type: CardType;
  title: string;
  description?: string;
  field: keyof UserContext;
  options?: { label: string; value: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  required?: boolean;
}
