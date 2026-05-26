export function buildWaLink(phone: string, message: string): string {
  let clean = phone.replace(/\D/g, '')
  if (!clean.startsWith('55')) {
    clean = '55' + clean
  }
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
