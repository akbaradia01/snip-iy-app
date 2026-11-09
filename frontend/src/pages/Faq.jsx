import { useState } from 'react';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Bagaimana cara membuat tautan pendek di Snip.ly?",
      answer: "Sangat mudah! Setelah login ke akun Anda, masuk ke halaman Beranda, masukkan tautan panjang Anda pada kolom 'Masukkan Original URL', lalu klik tombol 'Create Shortlink'."
    },
    {
      question: "Apakah saya bisa membuat kustomisasi pada URL pendek saya?",
      answer: "Ya, tentu saja. Saat membuat tautan pendek, Anda dapat mengisi bagian 'Customize URL (Opsional)' dengan kata kunci atau nama unik pilihan Anda agar lebih mudah diingat."
    },
    {
      question: "Apakah tautan pendek saya akan kedaluwarsa?",
      answer: "Tidak. Semua tautan pendek yang Anda buat akan aktif selamanya selama akun Anda tetap terdaftar di dalam sistem database Snip.ly."
    },
    {
      question: "Bagaimana cara melihat statistik dan riwayat tautan saya?",
      answer: "Anda dapat melihat daftar seluruh tautan yang pernah Anda buat beserta grafik statistik bulanan, mingguan, dan tahunan dengan mengunjungi menu 'Dashboard' di bagian atas navigasi."
    },
    {
      question: "Apakah data dan tautan saya aman?",
      answer: "Sangat aman. Snip.ly menggunakan sistem autentikasi berbasis JWT (JSON Web Token) dan enkripsi kata sandi dengan bcrypt, sehingga hanya Anda yang memiliki akses penuh ke riwayat tautan akun Anda."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto w-full min-h-[80vh]">
      
      {/* Header FAQ */}
      <div className="text-center mb-10">
        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3 shadow-sm">
          <FiHelpCircle size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-blue-950 mb-2">
          Pertanyaan yang Sering Diajukan (<span className="text-blue-600">FAQ</span>)
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto">
          Temukan jawaban atas pertanyaan seputar fitur, cara penggunaan, dan keamanan platform Snip.ly.
        </p>
      </div>

      {/* Daftar Accordion FAQ */}
      <div className="w-full flex flex-col gap-4 mb-10">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
              >
                <span className="font-bold text-blue-950 text-base md:text-lg">{faq.question}</span>
                <span className={`p-2 rounded-xl bg-slate-50 text-blue-600 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-50' : ''}`}>
                  <FiChevronDown size={20} />
                </span>
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Kartu Bantuan Tambahan */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold mb-1">Masih punya pertanyaan lain?</h3>
          <p className="text-blue-200 text-sm">Tim dukungan kami siap membantu Anda kapan saja.</p>
        </div>
        <Link 
          to="/" 
          className="bg-cyan-500 hover:bg-cyan-600 text-blue-950 font-bold px-6 py-3 rounded-xl transition shadow-lg whitespace-nowrap"
        >
          Mulai Buat Tautan
        </Link>
      </div>

    </div>
  );
}