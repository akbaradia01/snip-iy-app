import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        // UBAH DI SINI: Arahkan ke /dashboard
        navigate('/dashboard'); 
        
        window.location.reload(); 
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Gagal terhubung ke server backend.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-950 mb-6 text-center">Buat Akun Baru</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 rounded-lg">{error}</p>}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition mt-2">
            Daftar Sekarang
          </button>
        </form>
        
        <p className="text-sm text-center text-slate-500 mt-6">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}