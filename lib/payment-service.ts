"use client"

import type { CardDetails, PaymentDetails, PaymentMethod, UpiDetails, WalletDetails } from "./types"

// Simulate payment processing
export async function processPayment(
  amount: number,
  method: PaymentMethod,
  details?: CardDetails | UpiDetails | WalletDetails,
): Promise<PaymentDetails> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate a random payment ID
  const paymentId = Math.random().toString(36).substring(2, 15)

  // Simulate payment success (90% success rate)
  const isSuccess = Math.random() < 0.9

  if (!isSuccess) {
    throw new Error("Payment failed. Please try again.")
  }

  // Create payment details based on method
  const paymentDetails: PaymentDetails = {
    id: paymentId,
    method,
    amount,
    timestamp: Date.now(),
  }

  // Add method-specific details
  if (method === "card" && details) {
    const cardDetails = details as CardDetails
    paymentDetails.cardDetails = {
      last4: cardDetails.number.slice(-4),
      brand: getCardBrand(cardDetails.number),
    }
    paymentDetails.receiptUrl = `/receipts/${paymentId}`
  } else if (method === "upi" && details) {
    const upiDetails = details as UpiDetails
    paymentDetails.upiDetails = {
      id: upiDetails.id,
    }
    paymentDetails.receiptUrl = `/receipts/${paymentId}`
  } else if (method === "wallet" && details) {
    const walletDetails = details as WalletDetails
    paymentDetails.walletDetails = {
      provider: walletDetails.provider,
      transactionId: `${walletDetails.provider}-${Math.random().toString(36).substring(2, 10)}`,
    }
    paymentDetails.receiptUrl = `/receipts/${paymentId}`
  }

  return paymentDetails
}

// Helper function to determine card brand based on number
function getCardBrand(cardNumber: string): string {
  // Remove spaces and non-numeric characters
  const number = cardNumber.replace(/\D/g, "")

  // Check card type based on first digits
  if (/^4/.test(number)) return "Visa"
  if (/^5[1-5]/.test(number)) return "Mastercard"
  if (/^3[47]/.test(number)) return "American Express"
  if (/^6(?:011|5)/.test(number)) return "Discover"
  return "Unknown"
}

// Validate card number using Luhn algorithm
export function validateCardNumber(cardNumber: string): boolean {
  const number = cardNumber.replace(/\D/g, "")

  if (!number || number.length < 13 || number.length > 19) {
    return false
  }

  // Luhn algorithm
  let sum = 0
  let shouldDouble = false

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(number.charAt(i))

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

// Validate card expiry date (MM/YY format)
export function validateCardExpiry(expiry: string): boolean {
  const [monthStr, yearStr] = expiry.split("/")

  if (!monthStr || !yearStr) {
    return false
  }

  const month = Number.parseInt(monthStr.trim())
  const year = Number.parseInt(`20${yearStr.trim()}`)

  const now = new Date()
  const currentMonth = now.getMonth() + 1 // getMonth() returns 0-11
  const currentYear = now.getFullYear()

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
    return false
  }

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }

  return true
}

// Validate CVC code
export function validateCVC(cvc: string): boolean {
  const cvcNumber = cvc.replace(/\D/g, "")
  return /^\d{3,4}$/.test(cvcNumber)
}

// Validate UPI ID
export function validateUpiId(upiId: string): boolean {
  // Basic UPI ID validation (username@provider)
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)
}

// Format card number with spaces
export function formatCardNumber(cardNumber: string): string {
  const number = cardNumber.replace(/\D/g, "")
  const parts = []

  for (let i = 0; i < number.length; i += 4) {
    parts.push(number.substring(i, i + 4))
  }

  return parts.join(" ")
}
