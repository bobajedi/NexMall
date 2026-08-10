import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeEmail, validateEmail, validatePassword, sanitizeUser } from '../auth.js'

test('normalizeEmail lowercases and trims values', () => {
  assert.equal(normalizeEmail('  EDI@GMAIL.COM  '), 'edi@gmail.com')
})

test('validateEmail accepts common email formats', () => {
  assert.equal(validateEmail('user@example.com'), true)
  assert.equal(validateEmail('bad-email'), false)
})

test('validatePassword requires at least six characters', () => {
  assert.equal(validatePassword('12345'), false)
  assert.equal(validatePassword('123456'), true)
})

test('sanitizeUser removes password from returned user payloads', () => {
  const user = sanitizeUser({ id: 1, email: 'edi@gmail.com', password: 'super-secret' })
  assert.deepEqual(user, { id: 1, email: 'edi@gmail.com' })
})
