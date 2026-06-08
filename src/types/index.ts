export type Dimension = 'order' | 'energy' | 'pace' | 'emotion';

export interface Question {
  id: number;
  dimension: Dimension;
  positiveType: string;
  negativeType?: string;
  text: string;
}

export interface PersonalityResult {
  code: string;
  name: string;
  summary: string;        // 一句话灵性总结（结果页顶部展示）
  desc: string;           // 官方人格介绍正文
  traits: string[];
  dimensionLabels: [string, string, string, string];
}

export type Screen = 'home' | 'quiz' | 'result';

export interface DimensionScore {
  dimension: Dimension;
  score: number;
  positiveLabel: string;
  negativeLabel: string;
  displayLabel: string;
  displayPercent: number;
  color: string;
}

export const DIMENSION_CONFIG: Record<Dimension, {
  name: string;
  positiveType: string;
  negativeType: string;
  color: string;
}> = {
  order:   { name: '秩序应对方式', positiveType: '顺应秩序型', negativeType: '偷藏自由型', color: '#C53030' },
  energy:  { name: '能量恢复方式', positiveType: '外放回血型', negativeType: '内向回血型', color: '#1E3A5F' },
  pace:    { name: '行动节奏方式', positiveType: '高速推进型', negativeType: '慢热沉浸型', color: '#4F6FCB' },
  // Note: pace color changed from #6B8AC9 to #4F6FCB for deeper visibility
  emotion: { name: '情绪处理方式', positiveType: '外泄释放型', negativeType: '内化消化型', color: '#8A94A6' },
};
