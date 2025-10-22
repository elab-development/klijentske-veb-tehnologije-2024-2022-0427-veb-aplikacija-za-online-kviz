import { useEffect, useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import { QuizService } from '../lib/quiz/QuizService';
import { ensureSeededRobust } from '../lib/quiz/Seed';
import QuizCard from '../components/quiz/QuizCard';
import CreateQuiz from '../components/quiz/CreateQuiz';
import type { Difficulty, Quiz } from '../types/quiz';
import { OPEN_TDB_CATEGORIES } from '../lib/quiz/opentdb';

const PER_PAGE = 6;

type CatFilter = number | 'all';
type DiffFilter = Difficulty | 'all';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<CatFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DiffFilter>('all');

  // Pagination
  const [page, setPage] = useState(1);

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

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const byCat =
        categoryFilter === 'all' ? true : q.categoryId === categoryFilter;
      const byDiff =
        difficultyFilter === 'all' ? true : q.difficulty === difficultyFilter;
      return byCat && byDiff;
    });
  }, [quizzes, categoryFilter, difficultyFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, difficultyFilter]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const visible = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  function refreshList() {
    setQuizzes(QuizService.getAll());
    setPage(1);
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

      {/* Filters */}
      <div className='rounded-xl border border-[#1e4a3a] bg-[#122d24] p-4'>
        <div className='flex items-center gap-2 text-emerald-200 mb-3'>
          <Filter className='h-4 w-4' />
          <span className='text-sm font-medium'>Filters</span>
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className='grid gap-1'>
            <label className='text-sm text-emerald-100'>Category</label>
            <select
              className='rounded-md bg-[#0f2f24] border border-[#1e4a3a] text-emerald-100 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400/40'
              value={categoryFilter === 'all' ? 'all' : String(categoryFilter)}
              onChange={(e) => {
                const v =
                  e.target.value === 'all' ? 'all' : Number(e.target.value);
                setCategoryFilter(v as CatFilter);
              }}
            >
              <option value='all'>All categories</option>
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
              value={difficultyFilter}
              onChange={(e) =>
                setDifficultyFilter(e.target.value as DiffFilter)
              }
            >
              <option value='all'>All difficulties</option>
              <option value='easy'>easy</option>
              <option value='medium'>medium</option>
              <option value='hard'>hard</option>
            </select>
          </div>

          <div className='grid gap-1'>
            <label className='text-sm text-emerald-100'>Results</label>
            <div className='h-10 rounded-md bg-[#0f2f24] border border-[#1e4a3a] px-3 flex items-center text-emerald-200/80 text-sm'>
              {filtered.length} match{filtered.length === 1 ? '' : 'es'}
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes grid */}
      <div>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-lg font-semibold text-emerald-100'>
            All quizzes
          </h2>
          <p className='text-sm text-emerald-200/70'>
            Page {page} of {pageCount}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className='text-emerald-200/80'>
            No quizzes match current filters.
          </p>
        ) : (
          <>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {visible.map((q) => (
                <QuizCard key={q.id} quiz={q} />
              ))}
            </div>

            {/* Pagination */}
            <div className='mt-4 flex items-center justify-center gap-1 flex-wrap'>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={[
                    'h-9 min-w-9 px-3 rounded-md border',
                    n === page
                      ? 'border-[#2a6a54] bg-[#1f6f54] text-emerald-50'
                      : 'border-[#2a6a54] bg-[#1a4a3a] text-emerald-50 hover:bg-[#18503e]',
                  ].join(' ')}
                >
                  {n}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Create Quiz  */}
        <CreateQuiz onCreated={refreshList} />
      </div>
    </section>
  );
}
