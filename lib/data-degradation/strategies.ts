import { faker } from '@faker-js/faker'

export function shouldApplyDegradation(probability: number): boolean {
  return Math.random() < probability
}

export function makeMissing(value: any): null | undefined | string {
  const options = [null, undefined, '', 'NULL', 'N/A', 'null']
  return faker.helpers.arrayElement(options)
}

export function corruptEmail(email: string | null): string | null {
  if (!email) return email
  
  const corruptions = [
    () => email.replace('@', ''),
    () => email.replace('@', '@@'),
    () => email.replace('.com', ''),
    () => email.replace('.', ''),
    () => 'invalid_email',
    () => email + email, // duplicate
    () => email.split('@')[0], // no domain
  ]
  
  return faker.helpers.arrayElement(corruptions)()
}

export function corruptPhoneNumber(phone: string | null): string | null {
  if (!phone) return phone
  
  const corruptions = [
    () => phone.replace(/\D/g, ''), // only digits
    () => phone.replace(/\d/g, 'x'), // replace with x
    () => 'N/A',
    () => phone.substring(0, 5), // partial
    () => phone + phone, // duplicate
    () => faker.lorem.word(), // random word
  ]
  
  return faker.helpers.arrayElement(corruptions)()
}

export function corruptDate(date: Date | null): string | Date | null {
  if (!date) return date
  
  const corruptions = [
    () => 'TBD',
    () => 'not available',
    () => '01/01/1900',
    () => '99/99/9999',
    () => date.toISOString().split('T')[0].replace(/-/g, ''), // YYYYMMDD
    () => new Date(date.getTime() + 1000 * 60 * 60 * 24 * 365 * 100), // far future
    () => 'Invalid Date',
  ]
  
  return faker.helpers.arrayElement(corruptions)() as any
}

export function corruptNumber(value: number | null): string | number | null {
  if (value === null) return value
  
  const corruptions = [
    () => value.toString() + '.00.00', // double decimal
    () => value.toLocaleString(), // with commas: "1,234.56"
    () => -Math.abs(value), // negative when should be positive
    () => 0,
    () => NaN,
    () => Infinity,
    () => 'N/A',
    () => value * 1000000, // way out of range
  ]
  
  return faker.helpers.arrayElement(corruptions)() as any
}

export function corruptString(value: string | null): string | null {
  if (!value) return value
  
  const corruptions = [
    () => value + value, // duplicate
    () => value.toUpperCase(),
    () => value.toLowerCase(),
    () => value.split('').reverse().join(''),
    () => faker.lorem.word(),
    () => value.substring(0, value.length / 2), // truncated
    () => value + ' ' + value, // duplicated with space
  ]
  
  return faker.helpers.arrayElement(corruptions)()
}

export function corruptBoolean(value: boolean | null): any {
  if (value === null) return value
  
  const corruptions = [
    () => value ? 'yes' : 'no',
    () => value ? 'true' : 'false',
    () => value ? 1 : 0,
    () => 'maybe',
    () => null,
  ]
  
  return faker.helpers.arrayElement(corruptions)()
}

export function makeOutOfRange(fieldName: string, value: any): any {
  // Apply field-specific out-of-range errors
  if (fieldName.includes('amount') || fieldName.includes('price') || fieldName.includes('cost')) {
    return -Math.abs(value) // negative money
  }
  
  if (fieldName.includes('quantity') || fieldName.includes('count')) {
    return faker.helpers.arrayElement([0, -1, 999999999])
  }
  
  if (fieldName.includes('percentage') || fieldName.includes('rate')) {
    return faker.helpers.arrayElement([-10, 150, 999])
  }
  
  if (fieldName.includes('date')) {
    return new Date('2099-12-31') // far future
  }
  
  return value
}

export function introduceDuplicate(record: any, allRecords: any[]): any {
  // Return a slightly modified duplicate of an existing record
  if (allRecords.length === 0) return record
  
  const duplicate = { ...faker.helpers.arrayElement(allRecords) }
  // Change ID but keep other fields similar
  duplicate.id = record.id
  
  // Maybe change one field slightly
  const keys = Object.keys(duplicate).filter(k => k !== 'id')
  if (keys.length > 0) {
    const keyToChange = faker.helpers.arrayElement(keys)
    if (typeof duplicate[keyToChange] === 'string') {
      duplicate[keyToChange] = duplicate[keyToChange] + ' (copy)'
    }
  }
  
  return duplicate
}

