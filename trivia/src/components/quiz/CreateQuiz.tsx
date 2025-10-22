import { useMemo, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Difficulty } from '../../types/quiz';
import { useAuth } from '../../context/AuthContext';
import { QuizService } from '../../lib/quiz/QuizService';
import { OPEN_TDB_CATEGORIES } from '../../lib/quiz/opentdb';

type Props = {
  onCreated?: () => void;
};

export default function CreateQuiz({ onCreated }: Props) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(9);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [amount, setAmount] = useState<number>(10);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canCreate = useMemo(
    () => title.trim().length >= 3 && amount >= 5 && amount <= 50,
    [title, amount]
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !canCreate) return;
    setCreating(true);
    setErrorMsg(null);
    try {
      await QuizService.createFromOpenTDB(
        { title: title.trim(), categoryId, difficulty, amount },
        user
      );
      // reset forme
      setTitle('');
      setAmount(10);
      setDifficulty('easy');
      setCategoryId(9);
      onCreated?.();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create quiz.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <form
      onSubmit={handleCreate}
      className='rounded-xl mt-10 border border-[#1e4a3a] bg-[#122d24] p-4 grid gap-4'
    >
      <h2 className='text-lg font-semibold text-emerald-100'>
        Create a new quiz
      </h2>

      {errorMsg && (
        <div className='rounded-md border border-red-500/50 bg-red-500/10 text-red-200 px-3 py-2 text-sm'>
          {errorMsg}
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-4'>
        <div className='grid gap-1'>
          <label className='text-sm text-emerald-100'>Title</label>
          <input
            className='rounded-md bg-[#0f2f24] border border-[#1e4a3a] text-emerald-100 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400/40'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g., Geography Marathon'
            required
          />
        </div>

        <div className='grid gap-1'>
          <label className='text-sm text-emerald-100'>Category</label>
          <select
            className='rounded-md bg-[#0f2f24] border border-[#1e4a3a] text-emerald-100 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400/40'
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {OPEN_TDB_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className='grid gap-1'>
          <label className='text-sm text-emerald-100'>Difficulty</label>
          <select
            className='rounded-md bg-[#0f2f24] border border-[#1e4a3a] text-emerald-100 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400/40'
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <option value='easy'>easy</option>
            <option value='medium'>medium</option>
            <option value='hard'>hard</option>
          </select>
        </div>

        <div className='grid gap-1'>
          <label className='text-sm text-emerald-100'>
            Number of questions
          </label>
          <input
            type='number'
            min={5}
            max={50}
            className='rounded-md bg-[#0f2f24] border border-[#1e4a3a] text-emerald-100 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400/40'
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <button
          type='submit'
          disabled={!canCreate || creating}
          className={[
            'inline-flex items-center gap-2 h-10 rounded-md px-4',
            'bg-[#1f6f54] hover:bg-[#1a5a45] text-emerald-50 border border-[#2a6a54] transition',
            !canCreate || creating ? 'opacity-60 cursor-not-allowed' : '',
          ].join(' ')}
        >
          <PlusCircle className='h-4 w-4' />
          {creating ? 'Creating…' : 'Create quiz'}
        </button>
      </div>
    </form>
  );
}
