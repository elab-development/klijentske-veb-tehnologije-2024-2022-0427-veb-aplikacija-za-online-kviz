import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen grid place-items-center bg-[#0b1f19] text-emerald-100'>
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to='/login' replace />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
