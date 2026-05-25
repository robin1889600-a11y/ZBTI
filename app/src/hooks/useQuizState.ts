import { useState, useCallback } from 'react';
import { questions } from '../data/questions';
import { personalityMap } from '../data/personalities';
import { DIMENSION_CONFIG } from '../types';
import type { Dimension } from '../types';
import type { DimensionScore, Screen } from '../types';

const QUESTIONS_PER_PAGE = 4;
const TOTAL_PAGES = 12;
const MAX_SCORE = 36;

// ============================================================
// 六级量表分值映射 (6-Level Scale)
// 非常不同意 = -3
// 比较不同意 = -2
// 略微不同意 = -1
// 略微同意   = +1
// 比较同意   = +2
// 非常同意   = +3
// 无中立，无0分
// ============================================================

// ============================================================
// 核心题列表 (Core Questions)
// 当某维度总分 === 0 时，用核心题判定人格方向
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
  // positiveType 是正分方向 → 同意 = +answerValue
  // positiveType 是负分方向 → 同意 = -answerValue
  return isPositiveDirection ? answerValue : -answerValue;
}

export function useQuizState() {
  const [screen, setScreen] = useState<Screen>('home');
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

  const setAnswer = useCallback((questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Check if all 48 questions are answered (for last page submit)
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // ============================================================
  // 结果计算 (Result Calculation)
  // ============================================================
  const calculateResult = useCallback(() => {
    // Step 1: Accumulate raw scores per dimension
    const rawScores: Record<Dimension, number> = {
      order: 0,
      energy: 0,
      pace: 0,
      emotion: 0,
    };

    for (const q of questions) {
      const answerValue = answers[q.id];
      if (answerValue === undefined) continue;
      rawScores[q.dimension] += getQuestionScore(q, answerValue);
    }

    // Step 2: Determine direction for each dimension
    const dimensionResults: DimensionScore[] = [];
    const dimensionLabels: string[] = [];

    for (const dim of Object.keys(DIMENSION_CONFIG) as Dimension[]) {
      const config = DIMENSION_CONFIG[dim];
      const score = rawScores[dim];

      let direction: 'positive' | 'negative';

      if (score > 0) {
        direction = 'positive';
      } else if (score < 0) {
        direction = 'negative';
      } else {
        // score === 0: use core question tie-breaker
        direction = resolveTieBreaker(dim, answers);
      }

      const displayLabel = direction === 'positive'
        ? config.positiveType
        : config.negativeType;
      dimensionLabels.push(displayLabel);

      // Percentage: 50 + (abs(score) / 36) * 50 → 50%~100%
      // With 6-level scale (no neutral), scores will be more polarized naturally
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

    // Step 3: Map 4 dimension labels to 1 of 16 personalities
    const key = dimensionLabels.join('|');
    const personality = personalityMap[key];

    return { personality, dimensionResults };
  }, [answers]);

  const submitTest = useCallback(() => {
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const startTest = useCallback(() => {
    setAnswers({});
    setCurrentPage(0);
    setScreen('quiz');
  }, []);

  const restartTest = useCallback(() => {
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
// 当维度总分 === 0 时：
// 1. 统计该维度3道核心题的分数
// 2. coreScore > 0 → 正方向
// 3. coreScore < 0 → 负方向
// 4. coreScore === 0 → 使用第一核心题的方向
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

  // coreScore === 0: use first core question's direction
  const firstQ = questions.find((q) => q.id === coreIds[0]);
  if (firstQ) {
    const firstAnswer = answers[firstQ.id];
    if (firstAnswer !== undefined) {
      const firstScore = getQuestionScore(firstQ, firstAnswer);
      return firstScore >= 0 ? 'positive' : 'negative';
    }
  }

  // Ultimate fallback: positive direction
  return 'positive';
}
