import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti jika password MySQL kamu ada
  database: 'react_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database.');
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

// delete
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

// edit

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { nama, email, alamat, nim, prodi, komentar } = req.body;
  const sql = `
    UPDATE users SET nama=?, email=?, alamat=?, nim=?, prodi=?, komentar=?
    WHERE id=?`;

  db.query(sql, [nama, email, alamat, nim, prodi, komentar, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User berhasil diperbarui' });
  });
});

app.listen(5000, () => {
  console.log('Server berjalan di http://localhost:5000');
});
