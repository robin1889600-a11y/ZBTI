import { useState, useCallback, useMemo, useRef } from 'react';
import { questions } from '../data/questions';
import { personalityMap } from '../data/personalities';
import { DIMENSION_CONFIG } from '../types';
import type { Dimension } from '../types';
import type { DimensionScore, Screen, PersonalityResult } from '../types';

const QUESTIONS_PER_PAGE = 4;
const TOTAL_PAGES = 12;
const MAX_SCORE = 36;

// ============================================================
// 核心题列表 (Core Questions)
// ============================================================
const CORE_QUESTIONS: Record<Dimension, number[]> = {
  order:   [1, 6, 10],
  energy:  [13, 17, 22],
  pace:    [25, 29, 35],
  emotion: [37, 41, 45],
};

// 计算单题对该维度的贡献分数
function getQuestionScore(
  q: (typeof questions)[number],
  answerValue: number
): number {
  const config = DIMENSION_CONFIG[q.dimension];
  const isPositiveDirection = q.positiveType === config.positiveType;
  return isPositiveDirection ? answerValue : -answerValue;
}

// ============================================================
// URL 参数持久化工具
// ============================================================

function saveStateToUrl(scores: Record<Dimension, number>, resultCode: string) {
  const params = new URLSearchParams({
    order: String(scores.order),
    energy: String(scores.energy),
    pace: String(scores.pace),
    emotion: String(scores.emotion),
    result: resultCode,
  });
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

function loadStateFromUrl(): { scores: Record<Dimension, number>; resultCode: string } | null {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('order')) return null;
  return {
    scores: {
      order: parseInt(params.get('order') || '0'),
      energy: parseInt(params.get('energy') || '0'),
      pace: parseInt(params.get('pace') || '0'),
      emotion: parseInt(params.get('emotion') || '0'),
    },
    resultCode: params.get('result') || '',
  };
}

function buildResultsFromScores(
  scores: Record<Dimension, number>
): { personality: PersonalityResult; dimensionResults: DimensionScore[] } {
  const dimensionResults: DimensionScore[] = [];
  const dimensionLabels: string[] = [];

  for (const dim of Object.keys(DIMENSION_CONFIG) as Dimension[]) {
    const config = DIMENSION_CONFIG[dim];
    const score = scores[dim];
    const isPositive = score >= 0;
    const displayLabel = isPositive ? config.positiveType : config.negativeType;
    dimensionLabels.push(displayLabel);
    const displayPercent = Math.round(50 + (Math.abs(score) / MAX_SCORE) * 50);

    dimensionResults.push({
      dimension: dim,
      score,
      positiveLabel: config.positiveType,
      negativeLabel: config.negativeType,
      displayLabel,
      displayPercent,
      color: config.color,
    });
  }

  const key = dimensionLabels.join('|');
  const personality = personalityMap[key];

  return { personality, dimensionResults };
}

// ============================================================
// 微信浏览器检测
// ============================================================
export function isWechatBrowser(): boolean {
  return /MicroMessenger/i.test(navigator.userAgent);
}

// ============================================================
// Main Hook
// ============================================================
export function useQuizState() {
  // Check URL params on init
  const urlState = useMemo(() => loadStateFromUrl(), []);
  const urlResultRef = useRef<{ personality: PersonalityResult; dimensionResults: DimensionScore[] } | null>(
    urlState ? buildResultsFromScores(urlState.scores) : null
  );

  const [screen, setScreen] = useState<Screen>(urlState ? 'result' : 'home');
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const progress = ((currentPage + 1) / TOTAL_PAGES) * 100;

  const isPageComplete = currentQuestions.every((q) => answers[q.id] !== undefined);
  const isLastPage = currentPage === TOTAL_PAGES - 1;
  const isFirstPage = currentPage === 0;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const setAnswer = useCallback((questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // ============================================================
  // 结果计算
  // ============================================================
  const calculateResult = useCallback(() => {
    // 优先使用URL恢复的结果
    if (urlResultRef.current) {
      return urlResultRef.current;
    }

    const rawScores: Record<Dimension, number> = {
      order: 0, energy: 0, pace: 0, emotion: 0,
    };

    for (const q of questions) {
      const answerValue = answers[q.id];
      if (answerValue === undefined) continue;
      rawScores[q.dimension] += getQuestionScore(q, answerValue);
    }

    const dimensionResults: DimensionScore[] = [];
    const dimensionLabels: string[] = [];

    for (const dim of Object.keys(DIMENSION_CONFIG) as Dimension[]) {
      const config = DIMENSION_CONFIG[dim];
      const score = rawScores[dim];
      let direction: 'positive' | 'negative';
      if (score > 0) direction = 'positive';
      else if (score < 0) direction = 'negative';
      else direction = resolveTieBreaker(dim, answers);

      const displayLabel = direction === 'positive'
        ? config.positiveType : config.negativeType;
      dimensionLabels.push(displayLabel);
      const displayPercent = Math.round(50 + (Math.abs(score) / MAX_SCORE) * 50);

      dimensionResults.push({
        dimension: dim,
        score,
        positiveLabel: config.positiveType,
        negativeLabel: config.negativeType,
        displayLabel,
        displayPercent,
        color: config.color,
      });
    }

    const key = dimensionLabels.join('|');
    const personality = personalityMap[key];
    return { personality, dimensionResults };
  }, [answers]);

  // 提交测试：保存分数到URL
  const submitTest = useCallback(() => {
    const result = calculateResult();
    if (result.personality) {
      const scores = result.dimensionResults.reduce((acc, d) => {
        acc[d.dimension] = d.score;
        return acc;
      }, {} as Record<Dimension, number>);
      saveStateToUrl(scores, result.personality.code);
      // Clear cached URL result so subsequent calculateResult uses real answers
      urlResultRef.current = null;
    }
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [calculateResult]);

  const startTest = useCallback(() => {
    setAnswers({});
    setCurrentPage(0);
    setScreen('quiz');
  }, []);

  const restartTest = useCallback(() => {
    // 清除URL参数
    window.history.replaceState({}, '', window.location.pathname);
    urlResultRef.current = null;
    setAnswers({});
    setCurrentPage(0);
    setScreen('home');
  }, []);

  return {
    screen,
    currentPage,
    currentQuestions,
    progress,
    answers,
    isPageComplete,
    isLastPage,
    isFirstPage,
    allAnswered,
    totalPages: TOTAL_PAGES,
    setAnswer,
    nextPage,
    prevPage,
    submitTest,
    startTest,
    restartTest,
    calculateResult,
  };
}

// ============================================================
// 0分兜底逻辑 (Tie-Breaker)
// ============================================================
function resolveTieBreaker(
  dim: Dimension,
  answers: Record<number, number>
): 'positive' | 'negative' {
  const coreIds = CORE_QUESTIONS[dim];
  let coreScore = 0;
  for (const qId of coreIds) {
    const q = questions.find((q) => q.id === qId);
    if (!q) continue;
    const answerValue = answers[qId];
    if (answerValue === undefined) continue;
    coreScore += getQuestionScore(q, answerValue);
  }
  if (coreScore > 0) return 'positive';
  if (coreScore < 0) return 'negative';
  const firstQ = questions.find((q) => q.id === coreIds[0]);
  if (firstQ) {
    const firstAnswer = answers[firstQ.id];
    if (firstAnswer !== undefined) {
      return getQuestionScore(firstQ, firstAnswer) >= 0 ? 'positive' : 'negative';
    }
  }
  return 'positive';
}
