import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResultsService } from '../lib/quiz/ResultsService';
import type { QuizAttempt } from '../types/results';
import { Trophy, Percent, History } from 'lucide-react';
import StatCard from '../components/stats/StatCard';
import ResultsTable from '../components/stats/ResultsTable';

export default function Stats() {
  const { user } = useAuth();
  const [rows, setRows] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    if (!user) return;
    setRows(ResultsService.getByUser(user.id));
  }, [user]);

  const totals = useMemo(() => {
    if (rows.length === 0) {
      return { played: 0, avgPercent: 0, bestPercent: 0 };
    }
    const played = rows.length;
    const sum = rows.reduce((acc, r) => acc + r.percent, 0);
    const avgPercent = Math.round(sum / played);
    const bestPercent = rows.reduce((b, r) => Math.max(b, r.percent), 0);
    return { played, avgPercent, bestPercent };
  }, [rows]);

  return (
    <section className='flex flex-col gap-8'>
      <header className='max-w-3xl'>
        <h1 className='text-3xl font-bold tracking-tight text-emerald-100'>
          Stats
        </h1>
        <p className='mt-2 text-emerald-200/80'>
          Your personal performance across played quizzes.
        </p>
      </header>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <StatCard
          icon={<History className='h-6 w-6 text-emerald-300' />}
          label='Quizzes played'
          value={totals.played}
        />
        <StatCard
          icon={<Percent className='h-6 w-6 text-emerald-300' />}
          label='Average score'
          value={`${totals.avgPercent}%`}
        />
        <StatCard
          icon={<Trophy className='h-6 w-6 text-emerald-300' />}
          label='Best score'
          value={`${totals.bestPercent}%`}
        />
      </div>

      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-emerald-100'>Your quizzes</h2>
        <p className='text-sm text-emerald-200/70'>{rows.length} total</p>
      </div>
      <ResultsTable rows={rows} />
    </section>
  );
}
