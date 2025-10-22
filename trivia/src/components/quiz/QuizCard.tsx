import { BarChart3, CalendarClock, User, Layers } from 'lucide-react';
import type { Quiz } from '../../types/quiz';

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <div className='rounded-xl border border-[#1e4a3a] bg-[#122d24] p-4 flex flex-col gap-3 hover:bg-[#153429] transition'>
      <div className='flex items-start justify-between gap-3'>
        <h3 className='text-emerald-100 font-semibold leading-tight'>
          {quiz.title}
        </h3>
        <span className='text-xs px-2 py-0.5 rounded bg-[#1a4a3a] border border-[#2a6a54] text-emerald-50 uppercase'>
          {quiz.difficulty}
        </span>
      </div>

      <div className='text-sm text-emerald-200/80 flex flex-wrap gap-x-4 gap-y-1'>
        <span className='inline-flex items-center gap-1.5'>
          <Layers className='h-4 w-4' />
          {quiz.categoryName}
        </span>
        <span className='inline-flex items-center gap-1.5'>
          <BarChart3 className='h-4 w-4' />
          {quiz.amount} questions
        </span>
        <span className='inline-flex items-center gap-1.5'>
          <User className='h-4 w-4' />
          {quiz.createdBy.id === 'seed' ? 'Seed' : quiz.createdBy.name}
        </span>
        <span className='inline-flex items-center gap-1.5'>
          <CalendarClock className='h-4 w-4' />
          {new Date(quiz.createdAt).toLocaleDateString()}
        </span>
      </div>

      <button
        className='mt-1 inline-flex justify-center items-center h-9 rounded-md px-3
                   bg-[#1f6f54] hover:bg-[#1a5a45] text-emerald-50 border border-[#2a6a54] transition'
        disabled
        title='Coming soon'
      >
        Start
      </button>
    </div>
  );
}
