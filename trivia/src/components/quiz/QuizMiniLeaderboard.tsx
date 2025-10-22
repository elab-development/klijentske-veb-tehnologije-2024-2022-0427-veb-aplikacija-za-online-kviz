import { useEffect, useState } from 'react';
import { Medal } from 'lucide-react';
import { ResultsService } from '../../lib/quiz/ResultsService';
import type { QuizAttempt } from '../../types/results';

type Props = {
  quizId: string;
};

export default function QuizMiniLeaderboard({ quizId }: Props) {
  const [rows, setRows] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    const all = ResultsService.getAll().filter((r) => r.quizId === quizId);
    all.sort(
      (a, b) =>
        b.percent - a.percent ||
        new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime()
    );
    setRows(all.slice(0, 3));
  }, [quizId]);

  if (rows.length === 0) {
    return (
      <div className='rounded-lg border border-[#1e4a3a] bg-[#0f2f24] px-3 py-2 text-emerald-200/75 text-sm'>
        No results yet.
      </div>
    );
  }

  const medalClass = (idx: number) =>
    idx === 0
      ? 'text-yellow-300'
      : idx === 1
      ? 'text-gray-300'
      : 'text-amber-500';

  return (
    <div className='rounded-lg border border-[#1e4a3a] bg-[#0f2f24] px-3 py-2'>
      <div className='text-xs uppercase tracking-wide text-emerald-200/60 mb-2'>
        Top results
      </div>
      <ul className='grid gap-2'>
        {rows.map((r, idx) => (
          <li key={r.id} className='flex items-center justify-between'>
            <div className='flex items-center gap-2 min-w-0'>
              <Medal className={`h-4 w-4 ${medalClass(idx)}`} />
              <span className='text-sm text-emerald-100 truncate'>
                {r.userName}
              </span>
            </div>
            <span className='text-sm text-emerald-100'>{r.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
