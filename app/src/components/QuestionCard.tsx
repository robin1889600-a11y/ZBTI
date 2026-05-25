import { motion } from 'framer-motion';
import SevenLevelScale from './SevenLevelScale';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedValue: number | undefined;
  onSelect: (questionId: number, value: number) => void;
}

export default function QuestionCard({ question, index, selectedValue, onSelect }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
    >
      <p className="text-center text-[#111827] text-base sm:text-lg font-medium leading-relaxed">
        {question.text}
      </p>
      <SevenLevelScale
        questionId={question.id}
        selectedValue={selectedValue}
        onSelect={onSelect}
      />
    </motion.div>
  );
}
