export type GreetingKey = 'greetingNight' | 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening'

export function getGreetingKey(date: Date): GreetingKey {
  const hour = date.getHours()
  if (hour < 5) return 'greetingNight'
  if (hour < 12) return 'greetingMorning'
  if (hour < 18) return 'greetingAfternoon'
  return 'greetingEvening'
}
