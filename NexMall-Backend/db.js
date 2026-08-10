import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// SQLite veritabanı dosyasını projenin içinde otomatik oluşturur
export async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

// Veritabanını ve kullanıcılar tablosunu otomatik başlatan fonksiyon
export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('⚡ SQLite veritabanı ve users tablosu başarıyla hazırlandı!');
}