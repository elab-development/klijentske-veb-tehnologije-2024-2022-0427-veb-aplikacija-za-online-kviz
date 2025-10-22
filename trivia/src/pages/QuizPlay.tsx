import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QuizService } from '../lib/quiz/QuizService';
import type { Quiz } from '../types/quiz';
import QuestionItem from '../components/quiz/QuestionItem';
import ResultModal from '../components/quiz/ResultModal';
import { ResultsService } from '../lib/quiz/ResultsService';
import type { QuizAnswerMap } from '../types/results';
import { ArrowLeft, CheckSquare } from 'lucide-react';

export default function QuizPlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  useEffect(() => {
    const q = id ? QuizService.getById(id) : undefined;
    setQuiz(q ?? null);
  }, [id]);

  const total = quiz?.questions.length ?? 0;
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const allAnswered = total > 0 && answeredCount === total;

  function handleSelect(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    if (!quiz || !user || !allAnswered || submitting) return;
    setSubmitting(true);

    const correct = quiz.questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    setResult({ correct, total: quiz.questions.length });

    // Snimi rezultat
    ResultsService.add({
      quizId: quiz.id,
      quizTitle: quiz.title,
      userId: user.id,
      userName: user.name,
      total: quiz.questions.length,
      correct,
      percent: Math.round((correct / quiz.questions.length) * 100),
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
    });

    setShowResult(true);
    setSubmitting(false);
  }

  function closeResultAndGo() {
    setShowResult(false);
    navigate('/stats');
  }

  if (!quiz) {
    return (
      <div className='max-w-3xl'>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-emerald-300 hover:underline'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Home
        </Link>
        <p className='mt-4 text-emerald-200/85'>Quiz not found.</p>
      </div>
    );
  }

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-emerald-300 hover:underline'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </Link>
        <div className='text-sm text-emerald-200/80'>
          Answered: {answeredCount} / {quiz.questions.length}
        </div>
      </div>

      <header className='max-w-3xl'>
        <h1 className='text-2xl font-bold tracking-tight text-emerald-100'>
          {quiz.title}
        </h1>
        <p className='mt-1 text-emerald-200/80'>
          Category: {quiz.categoryName} • Difficulty: {quiz.difficulty} •{' '}
          {quiz.amount} questions
        </p>
      </header>

      {/* Sva pitanja */}
      <div className='grid gap-4'>
        {quiz.questions.map((q, idx) => (
          <QuestionItem
            key={q.id}
            index={idx}
            questionId={q.id}
            question={q.question}
            answers={q.allAnswers}
            selected={answers[q.id]}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Submit Bar */}
      <div className='sticky bottom-4 z-10'>
        <div className='mx-auto max-w-3xl'>
          <div className='rounded-xl border border-[#2a6a54] bg-[#0f2f24]/95 backdrop-blur px-4 py-3 flex items-center justify-between'>
            <div className='text-sm text-emerald-200/80'>
              {allAnswered
                ? 'All questions answered.'
                : 'Please answer all questions to submit.'}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className={[
                'inline-flex items-center gap-2 h-10 rounded-md px-4',
                'bg-[#1f6f54] hover:bg-[#1a5a45] text-emerald-50 border border-[#2a6a54] transition',
                !allAnswered || submitting
                  ? 'opacity-60 cursor-not-allowed'
                  : '',
              ].join(' ')}
            >
              <CheckSquare className='h-4 w-4' />
              Submit
            </button>
          </div>
        </div>
      </div>

      <ResultModal
        open={showResult}
        correct={result.correct}
        total={result.total}
        onClose={closeResultAndGo}
      />
    </section>
  );
}
