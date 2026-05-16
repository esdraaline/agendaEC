export function extractAmount(input: string): number | null {
  // Regex to find numbers that look like currency (e.g., 150, 150.00, 150,00, R$ 150)
  // We look for patterns like: R$ 150, 150.00, 150,00 or just a plain number
  // For simplicity, we'll look for numbers followed by optional decimals
  
  const match = input.match(/(?:r\$?\s*)?(\d+(?:[.,]\d{2})?)/i)
  
  if (match) {
    const value = match[1].replace(',', '.')
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }
  
  return null
}
