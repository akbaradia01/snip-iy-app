import { FiGithub, FiLinkedin, FiGlobe } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-20 border-t border-blue-100 bg-white/40 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        
        {/* Teks Copyright & Teknologi */}
        <div className="text-sm text-slate-500">
          <p className="font-semibold text-blue-950">© 2026 Snip.ly — Aditia Ihsan Akbar</p>
          <p className="text-xs text-slate-400 mt-0.5">Built with React, Tailwind CSS & Node.js.</p>
        </div>

        {/* Tautan Sosial Media (GitHub & LinkedIn) */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com" 
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-2.5 bg-white border border-blue-100 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all"
          >
            <FiGithub className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com" 
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="p-2.5 bg-white border border-blue-100 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all"
          >
            <FiLinkedin className="w-4 h-4" />
          </a>
          <a
            href="https://portfolio-website" 
            target="_blank"
            rel="noreferrer"
            aria-label="Portfolio"
            className="p-2.5 bg-white border border-blue-100 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all"
          >
            <FiGlobe className="w-4 h-4" />
          </a>
        </div>

      </div>
    </footer>
  );
}