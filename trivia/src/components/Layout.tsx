import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col bg-[#0b1f19] text-emerald-50'>
      <Navbar />
      <main className='flex-1'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8'>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
