import { useState, useEffect } from 'react';
import { FiZap, FiShield, FiTrendingUp, FiExternalLink } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [recentLinks, setRecentLinks] = useState([]);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeQrUrl, setActiveQrUrl] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const rawUsername = localStorage.getItem('username') || 'Pengguna';

  const displayName = rawUsername.includes('@') 
    ? rawUsername.split('@')[0] 
    : rawUsername.split(' ')[0];

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    
    fetch('https://snip-iy-app-production.up.railway.app/api/links', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRecentLinks(data);
      })
      .catch((err) => console.log('Gagal memuat riwayat:', err));
  }, [token]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setShortUrl('');
    setError('');
    setCopied(false);

    try {
      const response = await fetch('https://snip-iy-app-production.up.railway.app/api/shorten', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ originalUrl: url, customCode }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setShortUrl(data.shortUrl);
        setRecentLinks((prev) => [
          { id: Date.now(), originalUrl: url, shortUrl: data.shortUrl, clicks: 0, createdAt: new Date().toLocaleDateString('id-ID') },
          ...prev,
        ]);
        setUrl('');
        setCustomCode('');
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openQrModal = (link) => {
    setActiveQrUrl(link);
    setShowQrModal(true);
  };

  if (!token) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-6 max-w-4xl mx-auto w-full relative">
      
      {/* Sambutan Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
          Selamat Datang, <br />
          <span 
            style={{ fontFamily: '"Comic Neue", cursive' }}
            className="text-blue-600 capitalize tracking-wider drop-shadow-sm text-5xl md:text-7xl font-bold inline-block mt-2"
          >
            {displayName} 👋
          </span>
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
          Pangkas tautan panjang Anda menjadi ringkas, profesional, dan mudah dibagikan.
        </p>
      </div>

      {/* Kartu Fitur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
        <div className="bg-white/80 backdrop-blur border border-blue-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><FiZap size={24} /></div>
          <div>
            <h3 className="font-bold text-blue-950 text-base">Super Cepat</h3>
            <p className="text-xs text-slate-500">Buat tautan instan.</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur border border-blue-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-2xl"><FiShield size={24} /></div>
          <div>
            <h3 className="font-bold text-blue-950 text-base">Aman & Terpercaya</h3>
            <p className="text-xs text-slate-500">Dilindungi otentikasi JWT.</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur border border-blue-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl"><FiTrendingUp size={24} /></div>
          <div>
            <h3 className="font-bold text-blue-950 text-base">Statistik & QR</h3>
            <p className="text-xs text-slate-500">Dilengkapi analitik klik & QR.</p>
          </div>
        </div>
      </div>

      {/* Form Pemendek */}
      <div className="w-full bg-white border border-blue-100 p-8 md:p-10 rounded-3xl shadow-xl mb-10">
        <h2 className="text-2xl font-black text-blue-950 mb-6">Buat Tautan Pendek</h2>
        
        <form onSubmit={handleShorten} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Masukkan Original URL</label>
            <input
              type="url"
              placeholder="https://contoh-link-panjang.com/artikel/123"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">Customize URL (Opsional)</label>
            <div className="flex shadow-sm rounded-2xl overflow-hidden border border-slate-200">
              {/* BAGIAN INI YANG DIUBAH MENJADI snip.iy/ */}
              <span className="inline-flex items-center px-4 bg-slate-100 text-slate-500 text-sm font-semibold border-r border-slate-200">
                snip.iy/
              </span>
              <input
                type="text"
                placeholder="url-pilihanmu"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                className="flex-1 px-5 py-3.5 bg-white focus:outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-blue-800 hover:bg-blue-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 text-base"
          >
            {loading ? 'Memproses...' : 'Create Shortlink'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm text-center bg-red-50 py-3 rounded-xl font-medium">{error}</p>}

        {shortUrl && (
          <div className="mt-6 p-5 bg-blue-50/80 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-700 font-bold hover:underline truncate text-base">
              {shortUrl}
            </a>
            <div className="flex gap-2">
              <button onClick={() => openQrModal(shortUrl)} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow">
                <BsQrCode /> QR Code
              </button>
              <button onClick={() => copyToClipboard(shortUrl)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow">
                {copied ? 'Tersalin ✓' : 'Salin'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabel Riwayat */}
      <div className="w-full">
        <h2 className="text-xl font-bold text-blue-950 mb-4 px-2">My URL (Riwayat Terakhir)</h2>
        {recentLinks.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b">
                  <th className="py-4 px-6 font-bold">URL Asli</th>
                  <th className="py-4 px-6 font-bold">URL Pendek</th>
                  <th className="py-4 px-6 font-bold text-center">Total Klik</th>
                  <th className="py-4 px-6 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-slate-600">
                {recentLinks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 max-w-xs truncate font-medium text-slate-700">{item.originalUrl}</td>
                    <td className="py-4 px-6 text-blue-600 font-bold">
                      <a href={item.shortUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5">
                        {item.shortUrl} <FiExternalLink size={14} />
                      </a>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-blue-950">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                        {item.clicks || 0} klik
                      </span>
                    </td>
                    <td className="py-4 px-6 flex gap-2">
                      <button onClick={() => openQrModal(item.shortUrl)} className="text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1">
                        <BsQrCode /> QR
                      </button>
                      <button onClick={() => copyToClipboard(item.shortUrl)} className="text-xs bg-slate-100 hover:bg-slate-200 font-semibold px-3.5 py-2 rounded-xl transition">
                        Salin
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-10 bg-white border border-dashed border-slate-200 rounded-3xl text-slate-400 font-medium">
            Belum ada link yang dibuat.
          </div>
        )}
      </div>

      {/* Modal QR Code */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-950 mb-2">QR Code Tautan</h3>
            <p className="text-xs text-slate-500 mb-6 truncate max-w-xs">{activeQrUrl}</p>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 shadow-inner">
              <QRCodeCanvas value={activeQrUrl} size={180} />
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowQrModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}