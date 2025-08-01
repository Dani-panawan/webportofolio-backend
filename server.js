import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Gunakan connection pool untuk kestabilan
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Cek koneksi saat start
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err.message);
  } else {
    console.log('✅ Berhasil konek ke database');
    connection.release();
  }
});

// Route GET data
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Route POST data
app.post('/users', (req, res) => {
  const { nama, email, alamat, nim, prodi, komentar } = req.body;
  const sql = 'INSERT INTO users (nama, email, alamat, nim, prodi, komentar) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nama, email, alamat, nim, prodi, komentar];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User berhasil ditambahkan', id: result.insertId });
  });
});

// DELETE data
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json({ message: 'User berhasil dihapus' });
  });
});

// UPDATE data
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { nama, email, alamat, nim, prodi, komentar } = req.body;
  const sql = `
    UPDATE users SET nama=?, email=?, alamat=?, nim=?, prodi=?, komentar=? WHERE id=?`;

  db.query(sql, [nama, email, alamat, nim, prodi, komentar, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User berhasil diperbarui' });
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend API Web Portofolio berjalan 🚀");
});

// Jalankan server
app.listen(5000, () => {
  console.log('Server berjalan di http://localhost:5000');
});
