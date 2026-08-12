import * as XLSX from 'xlsx';

const findColumnValue = (row, searchKeywords) => {
  const keys = Object.keys(row);
  for (const key of keys) {
    const normalizedKey = key.trim().toLowerCase().replace(/ç/g, 'c');
    if (searchKeywords.some(kw => normalizedKey.includes(kw))) {
      return row[key];
    }
  }
  return '';
};

export const parsePrice = (rawValue) => {
  if (rawValue === null || rawValue === undefined || rawValue === '') return 0;
  if (typeof rawValue === 'number') return rawValue;

  let str = String(rawValue).replace(/[^0-9.,]/g, '').trim();
  if (str.includes(',') && !str.includes('.')) {
    str = str.replace(',', '.');
  }
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

export const processExcelFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

  return rawRows.map((row, index) => {
    // Sütunları yakala
    const nameVal = findColumnValue(row, ['emri', 'name', 'urun', 'title']);
    const priceVal = findColumnValue(row, ['mimi', 'fiyat', 'price']);
    const stockVal = findColumnValue(row, ['stoku', 'stock', 'stok', 'sasia', 'quantity']);
    const categoryVal = findColumnValue(row, ['kategoria', 'category', 'kategori']);
    const descVal = findColumnValue(row, ['shkrimi', 'description', 'aciklama']);
    const imageVal = findColumnValue(row, ['foto', 'image', 'gorsel', 'img', 'url']);

    const parsedStock = parseInt(String(stockVal).replace(/[^0-9]/g, ''), 10) || 0;
    const parsedImage = String(imageVal).trim();

    return {
      id: index + 1,
      name: String(nameVal).trim(),
      price: parsePrice(priceVal),
      
      // Stok için tüm olası anahtar isimleri
      stock: parsedStock,
      stok: parsedStock,
      countInStock: parsedStock,
      quantity: parsedStock,

      // Görsel URL'si için tüm olası anahtar isimleri
      image: parsedImage,
      imageUrl: parsedImage,
      image_url: parsedImage,
      foto: parsedImage,

      category: String(categoryVal).trim(),
      description: String(descVal).trim()
    };
  });
};