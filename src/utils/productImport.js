const normalizeImportedRow = (row) => {
  const lowerKeys = Object.keys(row || {}).reduce((acc, key) => {
    acc[key.toString().trim().toLowerCase()] = row[key]
    return acc
  }, {})

  const findValue = (keywords) => {
    for (const key of Object.keys(lowerKeys)) {
      const normalizedKey = key
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9çğıöşüæœ]/g, '')
      if (keywords.some((keyword) => normalizedKey.includes(keyword))) {
        return lowerKeys[key]
      }
    }
    return undefined
  }

  const name = findValue(['name', 'productname', 'title', 'emri', 'urunadi', 'ad']) || ''
  const rawPrice = findValue(['price', 'productprice', 'fiyat', 'çmim', 'cost', 'preis']) || 0
  const rawStock = findValue(['stock', 'quantity', 'adet', 'stoku', 'qty']) || 0
  const category = findValue(['category', 'kategori', 'kategoria', 'group', 'type']) || 'TË GJITHA'
  const description = findValue(['description', 'açıklama', 'përshkrimi', 'detail', 'desc']) || ''
  const normalizeNumber = (value) => {
    if (typeof value === 'number') return value
    if (typeof value !== 'string') return Number(value) || 0
    let text = value.toString().trim()
    if (text === '') return 0
    if (/\d+[.](?=\d{3}[,])/.test(text)) {
      text = text.replace(/\./g, '')
    }
    if (/,\d{1,2}$/.test(text)) {
      text = text.replace(/,/g, '.')
    }
    text = text.replace(/\s+/g, '')
    return Number(text) || 0
  }

  const price = normalizeNumber(rawPrice)
  const stock = normalizeNumber(rawStock)
  const imageValue = findValue(['image', 'images', 'imageurl', 'resim', 'foto', 'url']) || ''
  const images = typeof imageValue === 'string' && imageValue.trim() !== ''
    ? imageValue.split(',').map(src => src.trim()).filter(Boolean)
    : []

  return {
    name: String(name || '').trim(),
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    category: String(category || 'TË GJITHA').trim() || 'TË GJITHA',
    description: String(description || '').trim(),
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500']
  }
}

const buildProductDraftsFromPdfText = (text, shopName) => {
  const normalizedText = String(text || '').replace(/\r/g, '\n').trim()
  const lines = normalizedText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const candidates = lines
    .filter((line) => line.length > 2 && !/^\d+(\.\d+)?$/.test(line))
    .filter((line) => !/catalog|product|items|page|pdf/i.test(line))
    .map((line) => line.replace(/[•]+/g, '').trim())
    .filter(Boolean)

  return candidates.slice(0, 20).map((name, index) => ({
    id: Date.now() + index,
    name: name.toUpperCase(),
    price: 0,
    stock: 0,
    shopName,
    category: 'TË GJITHA',
    description: 'Imported from PDF',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500']
  }))
}

export { normalizeImportedRow, buildProductDraftsFromPdfText }
