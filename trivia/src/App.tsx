import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Home from './pages/Login';
import Stats from './pages/Stats';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/stats' element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
