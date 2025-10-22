export default function Footer() {
  return (
    <footer className='border-t border-[#1e4a3a] bg-[#0f2f24]'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-emerald-300'>
        © {new Date().getFullYear()} TriviaQuest. All rights reserved.
      </div>
    </footer>
  );
}
