import Faq from './pages/Faq';
import Layanan from './pages/Layanan';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function MainLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#f0f7ff]">
      
      {/* Ornamen Latar Belakang (Disembunyikan di Dashboard) */}
      {!isDashboard && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </>
      )}

      {/* Navbar Global (Disembunyikan di Dashboard) */}
      {!isDashboard && (
        <nav className="w-full px-8 py-6 flex justify-between items-center relative z-10 max-w-6xl mx-auto">
          {/* Logo Kiri dengan Font Tulisan Tangan & Ukuran 40 (text-4xl) */}
          <Link 
            to="/" 
            style={{ fontFamily: '"Comic Neue", cursive' }}
            className="text-4xl font-black text-blue-950 tracking-wide"
          >
            Snip<span className="text-cyan-500">.ly</span>
          </Link>
          
          {/* Menu Tengah */}
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition">BERANDA</Link>
            <Link to="/layanan" className="hover:text-blue-600 transition">LAYANAN KAMI</Link>
            <Link to="/faq" className="hover:text-blue-600 transition">FAQ</Link>
          </div>

          {/* Menu Kanan (Berdasarkan Login/Logout) */}
          <div className="flex gap-4 items-center">
            {token ? (
              <>
                <Link to="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">Dashboard</Link>
                <span className="text-sm font-semibold text-blue-900 border-l border-blue-200 pl-4">Halo, {username}!</span>
                <button onClick={handleLogout} className="text-sm font-semibold text-red-500 bg-red-50 px-4 py-2 rounded-full hover:bg-red-100 transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-white bg-[#1e3a8a] px-6 py-2.5 rounded-full hover:bg-blue-900 transition shadow-lg shadow-blue-900/20">MASUK</Link>
              </>
            )}
          </div>
        </nav>
      )}

      {/* Konten Halaman (Routing) */}
      <Routes>
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter 
      future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}
    >
      <MainLayout />
    </BrowserRouter>
  );
}