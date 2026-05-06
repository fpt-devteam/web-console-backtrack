export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** VN-style: starts with 0 and exactly 10 digits total. */
export function isValidPhone10StartingWith0(phone: string): boolean {
  return /^0\d{9}$/.test(phone.trim())
}

