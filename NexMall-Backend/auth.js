export const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '')

export const validateEmail = (value) => {
  const normalized = normalizeEmail(value)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
}

export const validatePassword = (value) => typeof value === 'string' && value.trim().length >= 6

export const sanitizeUser = (user) => {
  if (!user || typeof user !== 'object') return user
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}
