"use client"

import type React from "react"

import { CreditCard } from "lucide-react"
import { motion } from "framer-motion"
import { formatCardNumber, getCardType } from "@/lib/validation/card-validation"

interface CardInputProps {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvc: string
  onCardNumberChange: (value: string) => void
  onExpiryMonthChange: (value: string) => void
  onExpiryYearChange: (value: string) => void
  onCvcChange: (value: string) => void
  errors: {
    cardNumber?: string
    expiryMonth?: string
    expiryYear?: string
    cvc?: string
  }
  touched: {
    cardNumber?: boolean
    expiryMonth?: boolean
    expiryYear?: boolean
    cvc?: boolean
  }
}

export function CardInput({
  cardNumber,
  expiryMonth,
  expiryYear,
  cvc,
  onCardNumberChange,
  onExpiryMonthChange,
  onExpiryYearChange,
  onCvcChange,
  errors,
  touched,
}: CardInputProps) {
  const cardType = getCardType(cardNumber)

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    onCardNumberChange(formatted)
  }

  const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2)
    onExpiryMonthChange(value)
  }

  const handleExpiryYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2)
    onExpiryYearChange(value)
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    onCvcChange(value)
  }

  const hasErrors =
    (touched.cardNumber && errors.cardNumber) ||
    (touched.expiryMonth && errors.expiryMonth) ||
    (touched.expiryYear && errors.expiryYear) ||
    (touched.cvc && errors.cvc)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Card details</label>
      <div className={`flex items-center border-b py-2 ${hasErrors ? "border-red-500" : "border-gray-300"}`}>
        <CreditCard className={`w-4 h-4 mr-2 ${hasErrors ? "text-red-500" : "text-gray-400"}`} />
        <input
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="Card number"
          maxLength={19}
          className="flex-1 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <input
            type="text"
            value={expiryMonth}
            onChange={handleExpiryMonthChange}
            placeholder="MM"
            maxLength={2}
            className={`w-8 text-center focus:outline-none bg-transparent placeholder-gray-400 ${
              touched.expiryMonth && errors.expiryMonth ? "text-red-500" : "text-gray-800"
            }`}
          />
          <span>/</span>
          <input
            type="text"
            value={expiryYear}
            onChange={handleExpiryYearChange}
            placeholder="YY"
            maxLength={2}
            className={`w-8 text-center focus:outline-none bg-transparent placeholder-gray-400 ${
              touched.expiryYear && errors.expiryYear ? "text-red-500" : "text-gray-800"
            }`}
          />
          <span>/</span>
          <input
            type="password"
            value={cvc}
            onChange={handleCvcChange}
            placeholder="CVC"
            maxLength={4}
            className={`w-10 text-center focus:outline-none bg-transparent placeholder-gray-400 ${
              touched.cvc && errors.cvc ? "text-red-500" : "text-gray-800"
            }`}
          />
        </div>
      </div>

      {/* Validation errors */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: hasErrors ? "auto" : 0, opacity: hasErrors ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {touched.cardNumber && errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
          {touched.expiryMonth && errors.expiryMonth && <p className="text-red-500 text-xs">{errors.expiryMonth}</p>}
          {touched.expiryYear && errors.expiryYear && <p className="text-red-500 text-xs">{errors.expiryYear}</p>}
          {touched.cvc && errors.cvc && <p className="text-red-500 text-xs">{errors.cvc}</p>}
        </div>
      </motion.div>
    </div>
  )
}
