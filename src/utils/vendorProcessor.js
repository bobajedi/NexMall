import * as XLSX from 'xlsx';

/**
 * Sütun ismini esnek şekilde bulur.
 * "Çmimi", "Çmimi ", "cmimi", "PRICE" gibi tüm varyasyonları yakalar.
 */
const findColumnValue = (row, searchKeywords) => {
  const keys = Object.keys(row);
  for (const key of keys) {
    // "Çmimi " -> "cmimi" yapıp temizler
    const normalizedKey = key.trim().toLowerCase().replace(/ç/g, 'c');
    if (searchKeywords.some(kw => normalizedKey.includes(kw))) {
      return row[key];
    }
  }
  return '';
};

/**
 * "1362 €", "818 €", "12,50 €" metinlerini saf sayıya çevirir.
 */
export const parsePrice = (rawValue) => {
  if (rawValue === null || rawValue === undefined || rawValue === '') return 0;
  if (typeof rawValue === 'number') return rawValue;

  // Sadece rakam, nokta ve virgülü tut, gerisini sil ("1362 €" -> "1362")
  let str = String(rawValue).replace(/[^0-9.,]/g, '').trim();

  // Virgüllü ondalıkları noktaya çevir ("12,50" -> "12.50")
  if (str.includes(',') && !str.includes('.')) {
    str = str.replace(',', '.');
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Excel / CSV dosyasını işleyip temiz veriyi döndüren ana fonksiyon
 */
export const processExcelFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

  return rawRows.map((row, index) => {
    // Sütunları dinamik kelimelerle yakala
    const nameVal = findColumnValue(row, ['emri', 'name', 'urun', 'title']);
    const priceVal = findColumnValue(row, ['mimi', 'fiyat', 'price']);
    const stockVal = findColumnValue(row, ['stoku', 'stock', 'stok']);
    const categoryVal = findColumnValue(row, ['kategoria', 'category', 'kategori']);
    const descVal = findColumnValue(row, ['shkrimi', 'description', 'aciklama']);
    const imageVal = findColumnValue(row, ['foto', 'image', 'gorsel', 'img']);

    return {
      id: index + 1,
      name: String(nameVal).trim(),
      price: parsePrice(priceVal), // "1362 €" -> 1362
      stock: parseInt(String(stockVal).replace(/[^0-9]/g, ''), 10) || 0,
      category: String(categoryVal).trim(),
      description: String(descVal).trim(),
      image: String(imageVal).trim()
    };
  });
};