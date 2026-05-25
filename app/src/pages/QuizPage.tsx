import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '../components/QuestionCard';
import type { Question } from '../types';

interface QuizPageProps {
  currentPage: number;
  totalPages: number;
  progress: number;
  currentQuestions: Question[];
  answers: Record<number, number>;
  isPageComplete: boolean;
  isLastPage: boolean;
  isFirstPage: boolean;
  allAnswered: boolean;
  onAnswer: (questionId: number, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export default function QuizPage({
  currentPage,
  totalPages,
  progress,
  currentQuestions,
  answers,
  isPageComplete,
  isLastPage,
  isFirstPage,
  allAnswered,
  onAnswer,
  onNext,
  onPrev,
  onSubmit,
}: QuizPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[100dvh] pb-32"
      style={{ backgroundColor: '#F7F5F2' }}
    >
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-[#F7F5F2]/95 backdrop-blur-sm">
        {/* Nav Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#1E3A5F]">
              <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 9.5C7 9.5 8.5 7 12 7C15.5 7 17 9.5 17 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 14.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-base font-bold text-[#1E3A5F]">肇BTI</span>
          </div>
          <span className="text-sm text-[#6B7280] font-medium">
            Page {currentPage + 1} / {totalPages}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 max-w-2xl mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(to right, #C53030, #6B8AC9)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </div>

      </div>

      {/* Questions — 4 per page */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4"
          >
            {currentQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                selectedValue={answers[question.id]}
                onSelect={onAnswer}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F7F5F2]/95 backdrop-blur-sm border-t border-gray-100">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-2xl mx-auto">
          <button
            onClick={onPrev}
            disabled={isFirstPage}
            className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
              isFirstPage
                ? 'text-[#C9CED6] cursor-not-allowed'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
            }`}
          >
            上一页
          </button>

          {isLastPage ? (
            <button
              onClick={onSubmit}
              disabled={!allAnswered}
              className={`text-sm font-semibold px-8 py-3 rounded-full transition-all duration-200 ${
                allAnswered
                  ? 'bg-[#C53030] text-white hover:bg-[#A02828] shadow-md active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {allAnswered ? '查看结果' : '还有题目未答'}
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!isPageComplete}
              className={`text-sm font-semibold px-8 py-3 rounded-full transition-all duration-200 ${
                isPageComplete
                  ? 'bg-[#1E3A5F] text-white hover:bg-[#C53030] shadow-md active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              下一页
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
