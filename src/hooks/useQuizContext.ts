import { createContext, useContext } from 'react';

interface QuizContextType {
  startQuiz: () => void;
}

export const QuizContext = createContext<QuizContextType>({
  startQuiz: () => {},
});

export const useQuizContext = () => useContext(QuizContext);
