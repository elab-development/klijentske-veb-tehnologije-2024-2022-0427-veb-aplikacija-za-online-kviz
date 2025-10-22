import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedLayout from './components/auth/ProtectedLayout';
import PublicOnly from './components/auth/PublicOnly';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Stats from './pages/Stats';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path='/register'
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />

        <Route element={<ProtectedLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/stats' element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
