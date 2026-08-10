import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { openDb, initDb } from './db.js';
import { normalizeEmail, sanitizeUser, validateEmail, validatePassword } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nexmall_gizli_anahtar_123';
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla giriş denemesi yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' }
});

const demoProducts = [
  {
    id: 1,
    name: 'T-SHIRT ARMANI',
    price: 34.99,
    stock: 2,
    shopName: 'BUTIQUE NADI',
    category: 'T-SHIRT',
    description: '%100 pambuk, i prodhuar nga pëlhurë e cilësisë së lartë.',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500']
  },
  {
    id: 2,
    name: 'LED PENDANT LIGHT',
    price: 89.99,
    stock: 12,
    shopName: 'HOME LIGHTING',
    category: 'ELEKTRONIKE',
    description: 'Llambë vënëse moderne për sallon dhe kuzhinë.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500']
  },
  {
    id: 3,
    name: 'CLASSIC RUNNER SHOES',
    price: 59.99,
    stock: 7,
    shopName: 'SPORT STYLE',
    category: 'KËPUCË',
    description: 'Këpucë sportive të rehatshme me komoditet të lartë.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500']
  }
];

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Sunucu başlarken veritabanı tablosunu otomatik oluştur
initDb().catch(err => console.error('Veritabanı başlatılamadı:', err));

// Test Rotası
app.get('/', (req, res) => {
  res.json({ message: 'NexMall API sıfırdan başarıyla ayağa kalktı! 🚀' });
});

app.get('/api/products', (req, res) => {
  res.json({ products: demoProducts });
});

app.get('/api/products/:id', (req, res) => {
  const product = demoProducts.find(item => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Produkti nuk u gjet.' });
  }

  res.json({ product });
});

// 1. KAYIT OLMA (REGISTER) ROTASI
app.post('/api/register', authLimiter, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email ve şifre zorunludur.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Geçerli bir email adresi girin.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır.' });
  }

  try {
    const db = await openDb();

    // Kullanıcının daha önce kayıt olup olmadığını kontrol et
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Bu email adresi zaten kullanımda.' });
    }

    // Şifreyi güvenli bir şekilde hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kullanıcıyı veritabanına kaydet
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.status(201).json({
      message: 'Kayıt başarıyla oluşturuldu!',
      user: { id: result.lastID, email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
});

// 2. GİRİŞ YAPMA (LOGIN) ROTASI
app.post('/api/login', authLimiter, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email ve şifre zorunludur.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Geçerli bir email adresi girin.' });
  }

  try {
    const db = await openDb();

    // Kullanıcıyı bul
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Geçersiz email veya şifre.' });
    }

    // Şifreleri karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Geçersiz email veya şifre.' });
    }

    // JWT Token üret
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Giriş başarılı!',
      token: token,
      user: sanitizeUser({ id: user.id, email: user.email })
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});