const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();

// Wajib ditambahkan agar Express bisa membaca protokol (http/https) dengan benar di balik proxy Railway
app.set('trust proxy', 1);

// --- KONFIGURASI CORS YANG SUDAH DIPERBAIKI ---
const corsOptions = {
  // Daftarkan URL Frontend Railway kamu, dan localhost untuk testing lokal
  origin: [
    'https://truthful-joy-production-94784455.up.railway.app', 
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Sekarang aman karena origin-nya spesifik, bukan '*'
};
app.use(cors(corsOptions));
// ----------------------------------------------

app.use(express.json());

// ================= MIDDLEWARE (SATPAM) =================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak. Silakan login terlebih dahulu.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Sesi login telah berakhir. Silakan login ulang.' });
    }
    req.user = user;
    next();
  });
};

// ================= AUTHENTICATION =================

// 1. Endpoint REGISTER
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username sudah terdaftar' });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const newUserId = result.insertId;
        const token = jwt.sign({ id: newUserId, username: username }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ 
          message: 'Registrasi berhasil!',
          token: token,
          username: username,
          id: newUserId
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// 2. Endpoint LOGIN
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(400).json({ error: 'Username atau password salah' });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username, id: user.id });
  });
});

// ================= URL SHORTENER =================

// 1. Membuat URL Pendek
app.post('/api/shorten', authenticateToken, (req, res) => {
  const { originalUrl, customCode } = req.body; 
  const userId = req.user.id; 

  if (!originalUrl) {
    return res.status(400).json({ error: 'URL tidak boleh kosong' });
  }

  const shortCode = customCode ? customCode : Math.random().toString(36).substring(2, 8);
  
  const query = 'INSERT INTO urls (original_url, short_code, user_id, clicks) VALUES (?, ?, ?, 0)';
  db.query(query, [originalUrl, shortCode, userId], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'URL kustom sudah digunakan, coba yang lain.' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    // OTOMATISASI URL: Mendeteksi URL Railway/Frontend secara dinamis
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({ shortUrl: `${baseUrl}/${shortCode}` });
  });
});

// 2. Ambil Riwayat Link (Untuk Home)
app.get('/api/links', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const query = `
    SELECT id, original_url AS originalUrl, CONCAT('${baseUrl}/', short_code) AS shortUrl, 
           clicks, DATE_FORMAT(created_at, '%d/%m/%Y') AS createdAt 
    FROM urls WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. Ambil SEMUA Link milik User (Untuk Dashboard)
app.get('/api/my-links', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const query = `
    SELECT urls.id, urls.original_url as originalUrl, CONCAT('${baseUrl}/', urls.short_code) as shortUrl, 
           urls.clicks, DATE_FORMAT(urls.created_at, "%d/%m/%Y") as createdAt 
    FROM urls 
    WHERE urls.user_id = ?
    ORDER BY urls.created_at DESC
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================= STATISTIK DASHBOARD =================
app.get('/api/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // 1. Total Link
  db.query('SELECT COUNT(*) as total FROM urls WHERE user_id = ?', [userId], (err, totalResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const totalLinks = totalResult[0].total;

    // 2. Link Minggu Ini
    db.query(
      "SELECT COUNT(*) as weekly FROM urls WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      [userId],
      (err, weeklyResult) => {
        if (err) return res.status(500).json({ error: err.message });
        const weeklyLinks = weeklyResult[0].weekly;

        // 3. Link Tahun Ini
        db.query(
          "SELECT COUNT(*) as yearly FROM urls WHERE user_id = ? AND YEAR(created_at) = YEAR(NOW())",
          [userId],
          (err, yearlyResult) => {
            if (err) return res.status(500).json({ error: err.message });
            const yearlyLinks = yearlyResult[0].yearly;

            // 4. Data Grafik per Bulan
            db.query(
              `SELECT DATE_FORMAT(created_at, '%b') as name, COUNT(*) as total 
               FROM urls WHERE user_id = ? 
               GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b') 
               ORDER BY created_at ASC`,
              [userId],
              (err, chartResult) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                  totalLinks,
                  weeklyLinks,
                  yearlyLinks,
                  chartData: chartResult || []
                });
              }
            );
          }
        );
      }
    );
  });
});

// ================= REDIRECT & TAMBAH KLIK =================
app.get('/:code', (req, res) => {
  const { code } = req.params;
  const query = 'SELECT original_url FROM urls WHERE short_code = ?';
  
  db.query(query, [code], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).send('URL tidak ditemukan');
    }
    
    // MENAMBAH JUMLAH KLIK (+1)
    const updateQuery = 'UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?';
    db.query(updateQuery, [code], (updateErr) => {
      if (updateErr) console.error("Gagal update clicks:", updateErr);
      
      // Redirect pengunjung ke URL asli
      res.redirect(results[0].original_url);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));