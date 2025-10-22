import React from 'react';

export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className='rounded-xl border border-[#1e4a3a] bg-[#122d24] p-4 flex items-center gap-3'>
      <div className='shrink-0'>{icon}</div>
      <div>
        <div className='text-sm text-emerald-200/80'>{label}</div>
        <div className='text-xl font-semibold text-emerald-100'>{value}</div>
      </div>
    </div>
  );
}
