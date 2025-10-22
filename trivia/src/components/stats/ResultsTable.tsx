import type { QuizAttempt } from '../../types/results';

export default function ResultsTable({ rows }: { rows: QuizAttempt[] }) {
  if (rows.length === 0) {
    return (
      <div className='rounded-xl border border-[#1e4a3a] bg-[#122d24] p-6 text-emerald-200/80'>
        No games yet. Play a quiz to see your stats here.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-xl border border-[#1e4a3a] bg-[#122d24]'>
      <table className='min-w-full text-sm'>
        <thead className='text-left bg-[#0f2f24] text-emerald-200/80'>
          <tr>
            <th className='px-4 py-3 border-b border-[#1e4a3a]'>Quiz</th>
            <th className='px-4 py-3 border-b border-[#1e4a3a]'>Score</th>
            <th className='px-4 py-3 border-b border-[#1e4a3a]'>Percent</th>
            <th className='px-4 py-3 border-b border-[#1e4a3a]'>Finished</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className='hover:bg-[#153429]'>
              <td className='px-4 py-3 border-b border-[#1e4a3a] text-emerald-100'>
                {r.quizTitle}
              </td>
              <td className='px-4 py-3 border-b border-[#1e4a3a] text-emerald-100'>
                {r.correct} / {r.total}
              </td>
              <td className='px-4 py-3 border-b border-[#1e4a3a]'>
                <span className='inline-flex items-center h-7 px-2 rounded-md border border-[#2a6a54] bg-[#1a4a3a] text-emerald-50'>
                  {r.percent}%
                </span>
              </td>
              <td className='px-4 py-3 border-b border-[#1e4a3a] text-emerald-200/80'>
                {new Date(r.finishedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
