import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import cors from 'cors';

const app = express();

app.use(cors());

// Dosyayı diske yazmadan bellekte (RAM) işlemek için multer ayarı
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/products/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Herhangi bir dosya yüklenmedi.' });
    }

    // 1. Dosyayı bellekten oku
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // 2. JSON objelerine dönüştür
    const rawRows = XLSX.utils.sheet_to_json(worksheet);

    const validProducts = [];
    const errors = [];

    // 3. Verileri doğrula ve düzenle
    rawRows.forEach((row, index) => {
      const name = row['Ürün Adı'] || row['urun_adi'] || row['Name'] || row['Title'];
      const price = parseFloat(row['Fiyat'] || row['fiyat'] || row['Price']);
      const stock = parseInt(row['Stok'] || row['stok'] || row['Stock'] || 0, 10);
      const barcode = String(row['Barkod'] || row['barkod'] || row['Barcode'] || '');

      if (!name || isNaN(price)) {
        errors.push({
          rowNumber: index + 2,
          reason: 'Ürün adı eksik veya fiyat geçersiz.'
        });
      } else {
        validProducts.push({
          name: name.trim(),
          price: price,
          stock: isNaN(stock) ? 0 : stock,
          barcode: barcode.trim()
        });
      }
    });

    // 4. Veritabanına kaydetme adımı (SQLite veya mevcut DB bağlantın ile)
    // await db.products.insertMany(validProducts);

    return res.status(200).json({
      success: true,
      totalProcessed: rawRows.length,
      insertedCount: validProducts.length,
      failedCount: errors.length,
      errors: errors
    });

  } catch (err) {
    console.error('Parsing Hatası:', err);
    return res.status(500).json({ error: 'Dosya işlenirken bir hata oluştu.' });
  }
});

app.listen(3000, () => console.log('Backend sunucusu 3000 portunda çalışıyor...'));