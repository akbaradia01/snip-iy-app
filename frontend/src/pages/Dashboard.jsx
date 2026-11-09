import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiPlusSquare, FiLink, FiLogOut, FiGrid, FiUser, 
  FiCalendar, FiClock, FiExternalLink, FiCopy, FiCheck, FiInbox 
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalLinks: 0, weeklyLinks: 0, yearlyLinks: 0 });
  const [myLinks, setMyLinks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [copiedId, setCopiedId] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeQrUrl, setActiveQrUrl] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    fetch('http://localhost:5000/api/stats', { headers })
      .then(res => res.json())
      .then(data => {
        setStats({
          totalLinks: data.totalLinks || 0,
          weeklyLinks: data.weeklyLinks || 0,
          yearlyLinks: data.yearlyLinks || 0,
        });
        if (data.chartData) {
          setChartData(data.chartData);
        }
      })
      .catch(err => console.log('Gagal memuat statistik:', err));

    fetch('http://localhost:5000/api/my-links', { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMyLinks(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Gagal memuat link:', err);
        setLoading(false);
      });
  }, [token, navigate]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openQrModal = (url) => {
    setActiveQrUrl(url);
    setShowQrModal(true);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'links':
        return (
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-blue-500/5 border border-blue-100/80 transition-all">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-blue-950 tracking-tight">Daftar Tautan Saya</h2>
              <p className="text-slate-500 text-sm font-medium">Kelola semua tautan pendek yang pernah Anda buat dan pantau performanya secara real-time.</p>
            </div>
            
            {loading ? (
              <div className="text-center py-16 text-slate-400 font-medium animate-pulse">Memuat data tautan...</div>
            ) : myLinks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-50/50 text-slate-600 text-sm border-b border-blue-100">
                      <th className="py-4 px-6 font-bold">URL Asli</th>
                      <th className="py-4 px-6 font-bold">URL Pendek</th>
                      <th className="py-4 px-6 font-bold text-center">Total Klik</th>
                      <th className="py-4 px-6 font-bold">Tanggal</th>
                      <th className="py-4 px-6 font-bold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                    {myLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-6 max-w-xs truncate font-medium text-slate-700" title={link.originalUrl}>
                          {link.originalUrl}
                        </td>
                        <td className="py-4 px-6 text-blue-600 font-bold">
                          <a href={link.shortUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5">
                            {link.shortUrl} <FiExternalLink size={14} />
                          </a>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 font-bold px-3.5 py-1 rounded-full text-xs shadow-sm">
                            {link.clicks || 0} klik
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                          {link.createdAt}
                        </td>
                        <td className="py-4 px-6 flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openQrModal(link.shortUrl)} 
                            className="text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm hover:scale-105 flex items-center gap-1.5"
                            title="Lihat QR Code"
                          >
                            <FiGrid size={14} /> QR
                          </button>
                          
                          <button 
                            onClick={() => copyToClipboard(link.shortUrl, link.id)} 
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:scale-105 flex items-center gap-1.5"
                          >
                            {copiedId === link.id ? (
                              <><FiCheck size={14} className="text-green-600"/> Tersalin</>
                            ) : (
                              <><FiCopy size={14}/> Salin</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-gradient-to-b from-blue-50/30 to-white border border-dashed border-blue-200 rounded-3xl flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100/70 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">
                  <FiInbox />
                </div>
                <h3 className="text-lg font-bold text-blue-950 mb-1">Belum Ada Tautan</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">Anda belum membuat tautan pendek apa pun. Mulai buat tautan pertamamu sekarang!</p>
                <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5">
                  Buat Tautan Sekarang
                </Link>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-blue-500/5 border border-blue-100/80 max-w-2xl transition-all">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-blue-500/20">
                <FiUser />
              </div>
              <div>
                <h2 className="text-2xl font-black text-blue-950">{username}</h2>
                <p className="text-slate-500 font-medium text-sm">Akun Pengguna Profesional</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Username / Email</label>
                <input type="text" disabled value={username} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Status Akun</label>
                <input type="text" disabled value="Aktif & Terverifikasi (JWT Secure)" className="w-full p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-bold text-sm" />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-blue-950 tracking-tight">Ringkasan Statistik</h1>
              <p className="text-slate-500 text-sm font-medium">Pantau performa dan analitik tautan Anda secara menyeluruh.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-blue-500/5 border border-blue-100/80 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm"><FiLink /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tautan</p>
                  <h3 className="text-3xl font-black text-blue-950 mt-0.5">{stats.totalLinks}</h3>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-blue-500/5 border border-blue-100/80 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer">
                <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm"><FiCalendar /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Minggu Ini</p>
                  <h3 className="text-3xl font-black text-blue-950 mt-0.5">{stats.weeklyLinks}</h3>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-blue-500/5 border border-blue-100/80 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm"><FiClock /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tahun Ini</p>
                  <h3 className="text-3xl font-black text-blue-950 mt-0.5">{stats.yearlyLinks}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-blue-500/5 border border-blue-100/80 transition-all">
              <h3 className="font-extrabold text-blue-950 text-lg mb-6">Statistik Tautan Anda Per Bulan</h3>
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLinks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }} />
                      <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3.5} fillOpacity={1} fill="url(#colorLinks)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-b from-blue-50/20 to-transparent border border-dashed border-blue-100 rounded-2xl">
                    <p className="font-semibold text-slate-500">Belum ada data grafik untuk ditampilkan.</p>
                    <span className="text-xs mt-1 text-slate-400">Grafik analitik interaktif akan muncul setelah Anda membuat tautan pertama.</span>
                  </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  const activeClass = "flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/25 w-full text-left transition-all duration-300 scale-[1.02]";
  const inactiveClass = "flex items-center gap-3 text-slate-600 hover:bg-blue-50/60 hover:text-blue-700 px-5 py-3.5 rounded-2xl font-semibold w-full text-left transition-all duration-200";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#e6f2ff] to-[#f8fbff] font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/50 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-200/50 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-blue-100/80 flex-col hidden md:flex sticky top-0 h-screen z-20 shadow-sm">
        <div className="p-8 pb-6 text-3xl font-black text-blue-950 tracking-tighter flex items-center">
          <span style={{ fontFamily: '"Comic Neue", cursive' }} className="text-blue-600 text-4xl">Snip</span>
          <span className="text-cyan-500 text-4xl" style={{ fontFamily: '"Comic Neue", cursive' }}>.ly</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Menu Utama</p>
          
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? activeClass : inactiveClass}>
            <FiGrid size={18} /> Dashboard
          </button>
          
          <Link to="/" className={inactiveClass}>
            <FiPlusSquare size={18} /> Buat Tautan Baru
          </Link>
          
          <button onClick={() => setActiveTab('links')} className={activeTab === 'links' ? activeClass : inactiveClass}>
            <FiLink size={18} /> Tautan Saya
          </button>

          <div className="border-t border-blue-100/60 my-5"></div>
          
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Navigasi Web</p>
          
          <Link to="/" className={inactiveClass}>
            <FiHome size={18} /> Beranda Utama
          </Link>
          
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? activeClass : inactiveClass}>
            <FiUser size={18} /> Profil Akun
          </button>
        </nav>

        <div className="p-4 mb-4">
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="flex items-center gap-3 w-full text-red-500 hover:bg-red-50 px-4 py-3 rounded-2xl font-bold transition-all duration-200 shadow-sm">
            <FiLogOut size={18} /> Logout Akun
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto relative z-10">
        <div className="md:hidden flex justify-between items-center mb-6 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-sm border border-blue-100">
          <div className="text-xl font-black text-blue-700" style={{ fontFamily: '"Comic Neue", cursive' }}>Snip.ly</div>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="text-red-500 font-bold text-sm">Logout</button>
        </div>

        {renderContent()}
      </main>

      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center flex flex-col items-center border border-blue-50">
            <h3 className="text-xl font-black text-blue-950 mb-1">QR Code Tautan</h3>
            <p className="text-xs text-slate-500 mb-6 truncate max-w-xs">{activeQrUrl}</p>
            
            <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl mb-6 shadow-inner">
              <QRCodeCanvas value={activeQrUrl} size={180} />
            </div>

            <button 
              onClick={() => setShowQrModal(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-sm transition-all shadow-sm"
            >
              Tutup Jendela
            </button>
          </div>
        </div>
      )}

    </div>
  );
}