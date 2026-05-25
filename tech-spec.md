# 肇BTI 技术规格

## 依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| react | ^19.0.0 | UI 框架 |
| react-dom | ^19.0.0 | DOM 渲染 |
| vite | ^6.3.0 | 构建工具 |
| @vitejs/plugin-react | ^4.4.0 | Vite React 插件 |
| tailwindcss | ^4.1.0 | 样式方案 |
| @tailwindcss/vite | ^4.1.0 | Tailwind Vite 集成 |
| typescript | ^5.7.0 | 类型系统 |
| @types/react | ^19.0.0 | React 类型 |
| @types/react-dom | ^19.0.0 | ReactDOM 类型 |
| @types/three | ^0.172.0 | Three.js 类型 |
| three | ^0.172.0 | WebGL 3D 渲染 |
| @react-three/fiber | ^9.0.0 | React Three.js 渲染器 |
| @react-three/drei | ^10.0.0 | Three.js 辅助组件 |
| framer-motion | ^12.0.0 | 页面过渡动画 |
| lenis | ^1.2.0 | 平滑滚动 |

## 组件清单

### 布局组件

| 组件 | 来源 | 复用 |
|------|------|------|
| AppLayout | 自建 | 否 — 路由状态外壳 |

### 页面组件

| 组件 | 来源 | 说明 |
|------|------|------|
| HomePage | 自建 | 首屏：WebGL 几何背景 + 居中内容 |
| QuizPage | 自建 | 答题页：导航栏 + 进度条 + 4 题卡片组 + 底部按钮 |
| ResultPage | 自建 | 结果页：人格封面 + 3D 文字动效 + 人格介绍 + 四维轨道 |

### 可复用组件

| 组件 | 来源 | 复用位置 |
|------|------|----------|
| WebGLBackground | 自建 (R3F) | HomePage — 4 个几何体悬浮场景 |
| DimensionScatter | 自建 (R3F) | ResultPage — 4 个 3D 字母飞散动效 |
| SevenLevelScale | 自建 | QuizPage — 7 级李克特量表 |
| ProgressBar | 自建 | QuizPage — 渐变色进度条 |
| QuestionCard | 自建 | QuizPage — 单题卡片容器 |
| PersonalitySlider | 自建 | ResultPage — 单维度百分比轨道 |

### Hooks

| Hook | 说明 |
|------|------|
| useQuizState | 答题状态管理：当前页码、答案记录、维度分数计算、人格匹配 |
| useLenisScroll | Lenis 平滑滚动实例管理 |

## 动画实现

| 动画 | 库 | 实现方式 | 复杂度 |
|------|------|----------|--------|
| WebGL 几何体悬浮与鼠标视差 | @react-three/fiber | useFrame 内逐帧更新：sin 时间函数驱动 Y 轴浮动 + lerp 插值鼠标位置驱动整体倾斜 | 高 |
| 4 个 3D 字母飞散 | @react-three/fiber + lenis | useLenis 获取滚动进度(0→1)，每帧 lerp 插值计算各字母 position/rotation/scale | 高 |
| 页面切换过渡 | framer-motion | AnimatePresence + motion.div，opacity/y 组合过渡 | 中 |
| 答题翻页动画 | framer-motion | AnimatePresence 包裹题目容器，exit 上滑淡出 + enter 从下滑入 | 中 |
| 量表 Hover 交互 | CSS/Tailwind | hover:scale-110 + hover:bg 配合 transition-all duration-200 | 低 |
| 按钮 Hover 变色 | CSS/Tailwind | hover:bg-[#C53030] transition-colors duration-200 | 低 |

## 状态与逻辑

### 答题状态机 (useQuizState)

```
Screen: 'home' → 'quiz' → 'result'

Quiz State:
  currentPage: number (0-11, 共 12 页)
  answers: Record<number, number> — 题目ID → 选择值(-3 到 +3)
  dimensionScores: { order, energy, pace, emotion } — 各维度累计分

Transitions:
  home → quiz: 点击"开始测试"
  quiz → result: 第 12 页点击"提交测试"
  result → home: 可添加"重新测试"按钮
```

### 计分逻辑

1. 每题选择映射：非常同意=3, 比较同意=2, 略微同意=1, 中立=0, 略微不同意=-1, 比较不同意=-2, 非常不同意=-3
2. 每题有 positiveType（正向倾向）。如果 positiveType 等于该维度的正分方向（顺应秩序型/外放回血型/高速推进型/外泄释放型），则 `score += answerValue`；否则 `score -= answerValue`
3. 四个维度累计得分，范围 -36 到 +36
4. score >= 0 取正分方向，score < 0 取负分方向；score === 0 按默认值处理（顺应秩序型/外放回血型/高速推进型/外泄释放型）
5. 四维方向组合映射到 16 种人格

### 百分比计算

`displayPercent = Math.round(50 + (Math.abs(score) / 36) * 50)`，范围 50%-100%

## 其他关键决策

- **3D 字体文件**：`helvetiker_bold.typeface.json` 需放置于 `public/` 目录，通过 `@react-three/drei` 的 `Text3D` 加载。体积较大，使用 React `Suspense` + 过渡屏处理加载。
- **移动端降级**：结果页 3D 文字飞散动效在移动端（屏幕宽度 < 768px）自动降级为 CSS 淡入+滑动动画，避免无滚动交互驱动的问题。
- **WebGL 性能**：移动端降低材质光泽度（metalness/roughness）并关闭阴影，确保 60fps。
- **粘性滚动区块**：结果页 DimensionScatter 容器使用 `position: sticky; top: 0; height: 100vh`，用户滚动到此区块时被"粘住"，强制观看字母飞散过程后再解锁继续滚动。
