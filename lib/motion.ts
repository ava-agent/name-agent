/**
 * Apple-Style Motion Design System
 *
 * 设计理念：
 * 1. 物理真实感 - 基于弹簧动画，模拟真实物理运动
 * 2. 层次分明 - 页面元素按优先级依次入场
 * 3. 即时反馈 - 点击/触摸立即响应，无感知延迟
 * 4. 含蓄优雅 - 动画服务于功能，不喧宾夺主
 */

// ═══════════════════════════════════════════════════════════════
// 缓动曲线 (Easing Curves)
// ═══════════════════════════════════════════════════════════════

export const easing = {
  // iOS 标准缓动 - 用于大多数 UI 元素
  // 起步快，收尾慢，给人轻快敏捷的感觉
  iOS: [0.25, 0.1, 0.25, 1],

  // 入场缓动 - 元素进入视口时使用
  // 起步慢，中间快，收尾慢
  easeOut: [0.22, 1, 0.36, 1],

  // 退场缓动 - 元素离开视口时使用
  // 起步快，直接退出
  easeIn: [0.4, 0, 1, 1],

  // 双向缓动 - 用于来回切换的状态
  easeInOut: [0.42, 0, 0.58, 1],

  // 弹性缓动 - 用于强调性动画
  bouncy: [0.34, 1.56, 0.64, 1],
} as const;

// ═══════════════════════════════════════════════════════════════
// 持续时间 (Durations) - 单位：毫秒
// ═══════════════════════════════════════════════════════════════

export const duration = {
  // 即时反馈 - 按钮点击、开关切换
  instant: 100,

  // 微交互 - 图标变换、颜色过渡
  micro: 200,

  // 标准过渡 - 卡片展开、模态框出现
  standard: 300,

  // 强调动画 - 页面入场、重要元素
  emphasis: 400,

  // 沉浸过渡 - 全屏切换、加载完成
  immersive: 500,

  // 品牌动画 - Logo 动画、首次加载
  brand: 800,
} as const;

// ═══════════════════════════════════════════════════════════════
// 弹簧配置 (Spring Configurations)
// ═══════════════════════════════════════════════════════════════

export const spring = {
  // 轻快 - 用于小型 UI 元素（按钮、图标）
  snappy: { stiffness: 400, damping: 30 },

  // 标准 - 用于中型元素（卡片、列表项）
  standard: { stiffness: 300, damping: 25 },

  // 柔和 - 用于大型元素（页面、面板）
  gentle: { stiffness: 200, damping: 25 },

  // 弹跳 - 用于强调性反馈（成功状态、点赞）
  bouncy: { stiffness: 400, damping: 15 },

  // 缓慢 - 用于背景元素（装饰、氛围）
  slow: { stiffness: 100, damping: 20 },
} as const;

// ═══════════════════════════════════════════════════════════════
// 交错延迟 (Stagger Delays) - 单位：秒
// ═══════════════════════════════════════════════════════════════

export const stagger = {
  // 快速交错 - 列表项、选项按钮
  fast: 0.05,

  // 标准交错 - 卡片、模块
  standard: 0.08,

  // 慢速交错 - 页面区块、大段落
  slow: 0.12,
} as const;

// ═══════════════════════════════════════════════════════════════
// 预设动画配置 (Animation Presets)
// ═══════════════════════════════════════════════════════════════

export const presets = {
  // 页面入场 - 从下往上淡入
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.standard, ease: easing.easeOut },
  },

  // 元素入场 - 从透明度 0 淡入
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: duration.micro, ease: easing.easeOut },
  },

  // 弹出 - 带缩放的淡入
  popIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", ...spring.snappy },
  },

  // 滑入 - 从右侧滑入
  slideIn: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: duration.standard, ease: easing.easeOut },
  },

  // 卡片入场 - 3D 透视效果
  cardEnter: {
    initial: { opacity: 0, y: 30, rotateX: -5 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    transition: { duration: duration.emphasis, ease: easing.easeOut },
  },

  // 按钮点击 - 轻微缩小
  buttonPress: {
    scale: 0.97,
    transition: { duration: duration.instant, ease: easing.iOS },
  },

  // 按钮释放
  buttonRelease: {
    scale: 1,
    transition: { type: "spring", ...spring.snappy },
  },

  // 卡片滑动退出
  swipeOut: {
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? 400 : -400,
      opacity: 0,
      transition: { duration: duration.standard, ease: easing.easeIn },
    }),
  },

  // 悬停抬起
  hoverLift: {
    y: -2,
    transition: { duration: duration.micro, ease: easing.iOS },
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// 手势配置 (Gesture Configurations)
// ═══════════════════════════════════════════════════════════════

export const gesture = {
  // 滑动触发阈值 - 滑动距离超过此值触发动作
  swipeThreshold: 80,

  // 速度阈值 - 快速滑动即使距离不够也触发
  velocityThreshold: 400,

  // 拖拽弹性 - 拖拽超出边界的弹性系数
  dragElastic: 0.8,

  // 点击最大移动距离 - 超过此距离不算点击
  tapTolerance: 10,

  // 长按触发时间
  longPressDelay: 500,
} as const;

// ═══════════════════════════════════════════════════════════════
// 视差配置 (Parallax Configurations)
// ═══════════════════════════════════════════════════════════════

export const parallax = {
  // 背景层视差系数
  background: 0.3,

  // 中景层视差系数
  midground: 0.5,

  // 前景层视差系数
  foreground: 0.8,
} as const;
