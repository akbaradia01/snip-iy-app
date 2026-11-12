import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://snip-iy-app-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        navigate('/dashboard'); 
        window.location.reload(); 
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      
      {!showForm ? (
        <div className="text-center animate-fade-in-up w-full max-w-4xl relative">
          
          <div className="border border-blue-800/30 p-10 md:p-16 pt-14 rounded-2xl bg-white/40 backdrop-blur-sm relative shadow-xl">
            
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full shadow-lg border border-slate-100 flex items-center gap-2 z-10 hover:scale-105 transition-transform cursor-default">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">🔗</div>
              <span className="text-sm font-bold text-slate-700 tracking-wide">snip.ly/start</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Kelola Tautan, <br /> 
              <span className="text-blue-700">Perluas Jangkauan.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 font-medium max-w-2xl mx-auto">
              Satu Link, Multi Akses: Solusi Cepat Menuju Informasi Tepat!
            </p>

            <button 
              onClick={() => setShowForm(true)}
              className="bg-[#1e3a8a] text-white font-bold px-12 py-4 rounded-full hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/30 flex items-center gap-3 mx-auto hover:-translate-y-1"
            >
              Mulai Sekarang <FiArrowRight />
            </button>
          </div>
          
          <p className="text-sm text-slate-500 mt-8 font-mono tracking-wide">
            © 2026 <span className="font-bold text-slate-700">AIA</span>. Built with React & Node.js.
          </p>
        </div>
      ) : (
        
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-blue-50 animate-fade-in-up">
          <h2 className="text-3xl font-extrabold text-blue-950 mb-2 text-center">Selamat Datang Kembali</h2>
          <p className="text-sm text-center text-slate-500 mb-6">Silakan masuk untuk mengelola tautan Anda</p>
          
          {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 rounded-lg">{error}</p>}
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <button 
              type="submit" 
              className="bg-[#1e3a8a] text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition mt-2 shadow-lg shadow-blue-900/20"
            >
              Masuk
            </button>
          </form>
          
          <p className="text-sm text-center text-slate-500 mt-6">
            Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
          </p>
          
          <button 
            onClick={() => setShowForm(false)}
            className="mt-4 text-xs text-slate-400 w-full text-center hover:text-slate-600 transition"
          >
            ← Kembali ke halaman utama
          </button>
        </div>
      )}
    </div>
  );
}