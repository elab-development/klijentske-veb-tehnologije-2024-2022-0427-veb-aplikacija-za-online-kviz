import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    console.log('Logout clicked');
    navigate('/login');
  }

  const baseItem =
    'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition';
  const itemHover = 'hover:bg-[#134737]';
  const itemActive = 'bg-[#134737]';

  return (
    <header className='border-b border-[#1e4a3a] bg-[#0f2f24]/95 backdrop-blur'>
      <nav className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='h-16 flex items-center justify-between'>
          {/* Brand */}
          <Link
            to='/'
            className='font-semibold tracking-tight text-lg text-emerald-100 hover:text-emerald-300'
          >
            TriviaQuest
          </Link>

          {/* Desktop nav */}
          <div className='hidden md:flex items-center gap-3'>
            <NavLink
              to='/stats'
              className={({ isActive }) =>
                [
                  baseItem,
                  isActive ? itemActive : itemHover,
                  'text-emerald-100',
                ].join(' ')
              }
            >
              <BarChart3 className='h-4 w-4' />
              Stats
            </NavLink>

            <button
              onClick={handleLogout}
              className={[
                baseItem,
                'border border-[#2a6a54] text-emerald-100',
                'bg-[#1a4a3a] hover:bg-[#18503e] focus:outline-none focus:ring-2 focus:ring-emerald-400/40',
              ].join(' ')}
            >
              <LogOut className='h-4 w-4' />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className='md:hidden inline-flex items-center justify-center p-2 rounded-md border border-[#2a6a54] text-emerald-100 bg-[#1a4a3a] hover:bg-[#18503e] focus:outline-none focus:ring-2 focus:ring-emerald-400/40'
            aria-label='Toggle menu'
          >
            {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className='md:hidden pb-3 border-t border-[#1e4a3a]'>
            <div className='flex flex-col gap-2 pt-3'>
              <NavLink
                to='/stats'
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    baseItem,
                    isActive ? itemActive : itemHover,
                    'text-emerald-100',
                  ].join(' ')
                }
              >
                <BarChart3 className='h-4 w-4' />
                Stats
              </NavLink>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className='inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-[#2a6a54] text-emerald-100 bg-[#1a4a3a] hover:bg-[#18503e] focus:outline-none focus:ring-2 focus:ring-emerald-400/40'
              >
                <LogOut className='h-4 w-4' />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
