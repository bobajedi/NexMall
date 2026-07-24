import pool from './db.js';

const createTables = async () => {
  const queryText = `
    -- 1. Kullanıcılar Tablosu (Müşteri veya Satıcı)
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'seller')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Mağazalar Tablosu (Sadece Satıcılar İçin)
    CREATE TABLE IF NOT EXISTS shops (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      shop_name VARCHAR(100) UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Ürünler Tablosu (Hangi dükkana ait olduğu ilişkisiyle)
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
      name VARCHAR(150) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      icon VARCHAR(10) DEFAULT '📦',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log('⏳ Tablolar oluşturuluyor...');
    await pool.query(queryText);
    console.log('✅ Bütün tablolar (users, shops, products) başarıyla oluşturuldu ve birbirine bağlandı!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Tablolar oluşturulurken bir hata meydana geldi:', err);
    process.exit(1);
  }
};

createTables();