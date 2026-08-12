import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeImportedRow, buildProductDraftsFromPdfText } from './productImport.js'

test('normalizeImportedRow handles Albanian and English column names', () => {
  const row = {
    Emri: 'T-Shirt',
    Fiyat: '12.50',
    Stoku: '5',
    Kategoria: 'Fashion',
    Përshkrimi: 'Soft cotton',
    Foto: 'https://example.com/tshirt.jpg'
  }

  const result = normalizeImportedRow(row)

  assert.equal(result.name, 'T-Shirt')
  assert.equal(result.price, 12.5)
  assert.equal(result.stock, 5)
  assert.equal(result.category, 'Fashion')
  assert.equal(result.description, 'Soft cotton')
  assert.deepEqual(result.images, ['https://example.com/tshirt.jpg'])
})

test('buildProductDraftsFromPdfText extracts product names from lines', () => {
  const text = 'Product Catalog\n\nT-Shirt\nJeans\nShoes'
  const drafts = buildProductDraftsFromPdfText(text, 'Demo Shop')

  assert.deepEqual(drafts.map((item) => item.name), ['T-SHIRT', 'JEANS', 'SHOES'])
  assert.equal(drafts[0].shopName, 'Demo Shop')
  assert.equal(drafts[0].category, 'TË GJITHA')
})
