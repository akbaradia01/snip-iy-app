import { FiLink, FiEdit3, FiClock, FiShield, FiArrowRight, FiCode } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Layanan() {
  const services = [
    {
      icon: <FiLink className="w-8 h-8 text-blue-600" />,
      title: "Pemendekan URL Instan",
      desc: "Ubah tautan yang sangat panjang dan berantakan menjadi URL pendek dalam hitungan milidetik."
    },
    {
      icon: <FiEdit3 className="w-8 h-8 text-blue-600" />,
      title: "Kustomisasi Tautan",
      desc: "Buat URL pendek yang unik dan mudah diingat sesuai dengan brand atau nama Anda sendiri."
    },
    {
      icon: <FiClock className="w-8 h-8 text-blue-600" />,
      title: "Manajemen Riwayat",
      desc: "Semua tautan yang pernah Anda buat akan tersimpan rapi dan dapat diakses kapan saja."
    },
    {
      icon: <FiShield className="w-8 h-8 text-blue-600" />,
      title: "Keamanan Terjamin",
      desc: "Dilengkapi dengan sistem autentikasi JWT dan enkripsi password untuk melindungi akun Anda."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      
      {/* Header Halaman */}
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          Fitur Unggulan
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Layanan <span className="text-blue-700">Kami</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Berbagai fitur canggih yang dirancang untuk memudahkan Anda mengelola dan membagikan tautan secara profesional.
        </p>
      </div>

      {/* Grid Kartu Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full animate-fade-in-up">
        {services.map((srv, index) => (
          <div 
            key={index} 
            className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {srv.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{srv.title}</h3>
            <p className="text-slate-500 leading-relaxed">{srv.desc}</p>
          </div>
        ))}
      </div>

      {/* Bagian Teknologi (Pengganti Statistik Dummy) */}
      <div className="mt-16 w-full max-w-4xl bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-sm animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-slate-100 rounded-full text-slate-600">
            <FiCode className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Dibangun dengan Teknologi Modern</h3>
        <p className="text-slate-500 mb-6">Aplikasi ini dikembangkan menggunakan *stack* industri terkini untuk performa terbaik.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-sm border border-blue-100">React.js</span>
          <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-sm border border-emerald-100">Node.js</span>
          <span className="px-4 py-2 bg-orange-50 text-orange-700 font-semibold rounded-lg text-sm border border-orange-100">MySQL</span>
          <span className="px-4 py-2 bg-cyan-50 text-cyan-700 font-semibold rounded-lg text-sm border border-cyan-100">Tailwind CSS</span>
          <span className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg text-sm border border-indigo-100">Express.js</span>
        </div>
      </div>

      {/* Call to Action (Banner Bawah) */}
      <div className="mt-12 w-full max-w-4xl bg-gradient-to-r from-[#1e3a8a] to-blue-600 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/20 animate-fade-in-up">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Siap Memulai?</h2>
          <p className="text-blue-100">Bergabunglah dan kelola tautan Anda dengan lebih cerdas hari ini.</p>
        </div>
        <Link 
          to="/login" 
          className="bg-white text-blue-900 font-bold px-8 py-3.5 rounded-full hover:bg-slate-100 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          Coba Gratis <FiArrowRight />
        </Link>
      </div>

    </div>
  );
}