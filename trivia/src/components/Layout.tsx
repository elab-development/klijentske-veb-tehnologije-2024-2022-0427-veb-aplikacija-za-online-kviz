import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className='min-h-screen flex flex-col bg-[#0b1f19] text-emerald-50'>
      <Navbar />
      <main className='flex-1'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8'>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
