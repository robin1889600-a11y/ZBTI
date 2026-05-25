import { AnimatePresence } from 'framer-motion';
import { useQuizState } from './hooks/useQuizState';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';

export default function App() {
  const {
    screen,
    currentPage,
    currentQuestions,
    progress,
    answers,
    isPageComplete,
    isLastPage,
    isFirstPage,
    allAnswered,
    totalPages,
    setAnswer,
    nextPage,
    prevPage,
    submitTest,
    startTest,
    restartTest,
    calculateResult,
  } = useQuizState();

  return (
    <AnimatePresence mode="wait">
      {screen === 'home' && (
        <HomePage key="home" onStart={startTest} />
      )}

      {screen === 'quiz' && (
        <QuizPage
          key="quiz"
          currentPage={currentPage}
          totalPages={totalPages}
          progress={progress}
          currentQuestions={currentQuestions}
          answers={answers}
          isPageComplete={isPageComplete}
          isLastPage={isLastPage}
          isFirstPage={isFirstPage}
          allAnswered={allAnswered}
          onAnswer={setAnswer}
          onNext={nextPage}
          onPrev={prevPage}
          onSubmit={submitTest}
        />
      )}

      {screen === 'result' && (
        <ResultPage
          key="result"
          personality={calculateResult().personality}
          dimensionResults={calculateResult().dimensionResults}
          onRestart={restartTest}
        />
      )}
    </AnimatePresence>
  );
}
