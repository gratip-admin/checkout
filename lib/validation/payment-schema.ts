import * as Yup from "yup"
import { isValidCardNumber } from "./card-validation"

export const paymentValidationSchema = Yup.object().shape({
  currency: Yup.string().required("Currency is required"),
  amount: Yup.string()
    .required("Amount is required")
    .test("is-valid-amount", "Amount must be greater than 0", (value) => {
      if (!value) return false
      const numValue = Number.parseFloat(value.replace(/,/g, ""))
      return !isNaN(numValue) && numValue > 0
    }),
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),
  countryCode: Yup.string().required("Country code is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .min(7, "Phone number must be at least 7 digits")
    .matches(/^\d+$/, "Phone number can only contain digits"),
  narration: Yup.string(),
  cardNumber: Yup.string()
    .required("Card number is required")
    .test("is-valid-card", "Invalid card number", (value) => {
      if (!value) return false
      return isValidCardNumber(value)
    }),
  expiryMonth: Yup.string()
    .required("Month is required")
    .matches(/^(0[1-9]|1[0-2])$/, "Invalid month (MM)"),
  expiryYear: Yup.string()
    .required("Year is required")
    .matches(/^\d{2}$/, "Invalid year (YY)")
    .test("is-valid-year", "Card has expired", (value) => {
      if (!value) return false
      const year = Number.parseInt(value, 10) + 2000
      const currentYear = new Date().getFullYear()
      return year >= currentYear && year <= currentYear + 20
    }),
  cvc: Yup.string()
    .required("CVC is required")
    .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
})

export interface PaymentFormValues {
  currency: string
  amount: string
  firstName: string
  lastName: string
  countryCode: string
  phoneNumber: string
  narration: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvc: string
}


