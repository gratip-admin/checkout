export function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "")
  if (!/^\d{13,19}$/.test(digits)) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ""
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(" ")
  } else {
    return v
  }
}

export function getCardType(cardNumber: string): string {
  const number = cardNumber.replace(/\s/g, "")

  if (/^4/.test(number)) return "visa"
  if (/^5[1-5]/.test(number)) return "mastercard"
  if (/^3[47]/.test(number)) return "amex"
  if (/^6(?:011|5)/.test(number)) return "discover"

  return "unknown"
}
