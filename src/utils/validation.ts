export interface CountryOption {
  code: string
  name: string
  phoneCode: string
}

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (
  phone: string,
  country: CountryOption
): boolean => {
  let regex
  const digitCount = phone.replace(/\D/g, "").length

  switch (country.code) {
    case "UA": // Україна
      regex = /^\+380\d{9}$/
      return regex.test(phone) && digitCount === 12
    case "PL": // Польща
      regex = /^\+48\d{9}$/
      return regex.test(phone) && digitCount === 11
    case "SK": // Словаччина
      regex = /^\+421\d{9}$/
      return regex.test(phone) && digitCount === 12
    case "CZ": // Чехія
      regex = /^\+420\d{9}$/
      return regex.test(phone) && digitCount === 12
    default:
      return false
  }
}
