import { AnimatePresence } from 'framer-motion';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useQuizState } from './hooks/useQuizState';
import { QuizContext } from './hooks/useQuizContext';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import GalleryPage from './pages/GalleryPage';
import GalleryDetailPage from './pages/GalleryDetailPage';

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const startQuiz = () => {
    startTest();
    navigate('/');
  };

  return (
    <QuizContext.Provider value={{ startQuiz }}>
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            screen === 'home' ? (
              <HomePage key="home" onStart={startTest} />
            ) : screen === 'quiz' ? (
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
            ) : (
              <ResultPage
                key="result"
                personality={calculateResult().personality}
                dimensionResults={calculateResult().dimensionResults}
                onRestart={restartTest}
              />
            )
          }
        />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:code" element={<GalleryDetailPage />} />
      </Routes>
    </AnimatePresence>
    </QuizContext.Provider>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
