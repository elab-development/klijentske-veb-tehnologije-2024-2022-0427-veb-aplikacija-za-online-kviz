import { useEffect, useMemo, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QuizService } from '../lib/quiz/QuizService';
import { ensureSeededRobust } from '../lib/quiz/Seed';
import QuizCard from '../components/quiz/QuizCard';
import type { Difficulty, Quiz } from '../types/quiz';
import { OPEN_TDB_CATEGORIES } from '../lib/quiz/opentdb';

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Create form state
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(9);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [amount, setAmount] = useState<number>(10);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await ensureSeededRobust();
      } finally {
        if (!mounted) return;
        setQuizzes(QuizService.getAll());
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
        user // prosleđujemo celog AuthUser (id, name, email)
      );
      // reset forme i refresh liste
      setTitle('');
      setAmount(10);
      setDifficulty('easy');
      setCategoryId(9);
      setQuizzes(QuizService.getAll());
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create quiz.');
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <section className='max-w-3xl'>
        <h1 className='text-3xl font-bold tracking-tight text-emerald-100'>
          Available Quizzes
        </h1>
        <p className='mt-4 text-emerald-200/90'>Loading quizzes…</p>
      </section>
    );
  }

  return (
    <section className='flex flex-col gap-8'>
      <header className='max-w-3xl'>
        <h1 className='text-3xl font-bold tracking-tight text-emerald-100'>
          Available Quizzes
        </h1>
        <p className='mt-2 text-emerald-200/80'>
          Pick from curated (seeded) quizzes or create your own from
          OpenTriviaDB parameters.
        </p>
      </header>

      {/* Create Quiz panel */}
      <form
        onSubmit={handleCreate}
        className='rounded-xl border border-[#1e4a3a] bg-[#122d24] p-4 grid gap-4'
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

      {/* Quizzes grid */}
      <div>
        <h2 className='text-lg font-semibold text-emerald-100 mb-3'>
          All quizzes
        </h2>
        {quizzes.length === 0 ? (
          <p className='text-emerald-200/80'>No quizzes yet.</p>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {quizzes.map((q) => (
              <QuizCard key={q.id} quiz={q} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
