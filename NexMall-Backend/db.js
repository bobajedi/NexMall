import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Veritabanına bağlanırken hata oluştu:', err.stack);
  }
  console.log('⚡ PostgreSQL bulut veritabanına başarıyla bağlanıldı!');
  release();
});

export default pool;