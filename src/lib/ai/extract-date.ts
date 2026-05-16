import { addDays, format, nextFriday, nextMonday, nextSaturday, nextSunday, nextThursday, nextTuesday, nextWednesday } from 'date-fns'

export function extractDate(input: string): string | null {
  const now = new Date()
  
  if (input.includes('hoje')) return format(now, 'yyyy-MM-dd')
  if (input.includes('amanha')) return format(addDays(now, 1), 'yyyy-MM-dd')
  
  if (input.includes('segunda')) return format(nextMonday(now), 'yyyy-MM-dd')
  if (input.includes('terca')) return format(nextTuesday(now), 'yyyy-MM-dd')
  if (input.includes('quarta')) return format(nextWednesday(now), 'yyyy-MM-dd')
  if (input.includes('quinta')) return format(nextThursday(now), 'yyyy-MM-dd')
  if (input.includes('sexta')) return format(nextFriday(now), 'yyyy-MM-dd')
  if (input.includes('sabado')) return format(nextSaturday(now), 'yyyy-MM-dd')
  if (input.includes('domingo')) return format(nextSunday(now), 'yyyy-MM-dd')

  const dateMatch = input.match(/(\d{1,2})\/(\d{1,2})/)
  if (dateMatch) {
    const day = parseInt(dateMatch[1])
    const month = parseInt(dateMatch[2]) - 1
    const year = now.getFullYear()
    return format(new Date(year, month, day), 'yyyy-MM-dd')
  }

  return null
}
