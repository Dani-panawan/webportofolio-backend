import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Ganti kalau usermu beda
  password: '',       // Ganti kalau pakai password
  database: 'react_db' // Pastikan database ini SUDAH ADA
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

export default db;
