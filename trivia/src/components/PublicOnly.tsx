import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className='min-h-screen grid place-items-center bg-[#0b1f19] text-emerald-100'>
        Loading...
      </div>
    );
  }
  if (user) {
    return <Navigate to='/' replace />;
  }
  return <>{children}</>;
}
