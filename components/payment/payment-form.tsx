"use client"
import Image from "next/image"
import Link from "next/link"
import { getCloudinaryUrl } from "@/utils/cloudinary"
import { Formik, Form, Field } from "formik"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ChevronDown, Lock, X } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useState, useEffect, useCallback } from "react"
import { CardInput } from "./card-input"
import { PhoneInput } from "./phone-input"
import { paymentValidationSchema,  type PaymentFormValues } from "@/lib/validation/payment-schema"
import { submitCardDetails } from "@/services"
import { useToast } from "@/context/ToastContext"
import useGetCountryCode from "@/hooks/useGetCountryCode"
import { PaymentState } from "@/app/page"

interface PaymentFormProps {
  paymentState: PaymentState
  userDetails: any
  token: string
  isPendingFinalizeCardPayment: boolean
  finalizeCardPayment: (payload: any) => void
}

// 3D Secure Modal Component
function ThreeDSecureModal({ 
  html, 
  onClose 
}: { 
  html: string
  onClose: () => void 
}) {
  const iframeRef = useCallback((node: HTMLIFrameElement | null) => {
    if (node) {
      const doc = node.contentDocument || node.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(html)
        doc.close()
      }
    }
  }, [html])

  // Listen for messages from the 3DS iframe (some providers post messages on completion)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("event.data", event)
      if (event.data?.type === '3DS_COMPLETE' || event.data?.status) {
        onClose()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Secure Authentication</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* 3DS Iframe Container */}
        <div className="w-full h-[500px] bg-gray-50">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="3D Secure Authentication"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
          />
        </div>
        
        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Complete the verification in the window above to proceed with your payment
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "NGN", symbol: "₦" },
  { code: "GHS", symbol: "₵" },
]

function formatAmountWithCommas(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "")
  const parts = cleaned.split(".")

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2)
  }
  return parts.join(".")
}

function parseAmount(value: string): number {
  return Number.parseFloat(value.replace(/,/g, "")) || 0
}

// Error message component
function ErrorMessage({ error, touched }: { error?: string; touched?: boolean }) {
  return (
    <AnimatePresence>
      {touched && error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export function PaymentForm({ userDetails, paymentState, token, isPendingFinalizeCardPayment, finalizeCardPayment }: PaymentFormProps) {

  const initialPaymentValues: PaymentFormValues = {
    currency: userDetails?.currency || "USD",
    amount: userDetails?.amount?.toString() || "",
    firstName: "",
    lastName: "",
    countryCode: "+234",
    phoneNumber: "",
    narration: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  }

  const [threeDSHtml, setThreeDSHtml] = useState<string | null>(null)
  const [transactionRef, setTransactionRef] = useState<string | null>(null)

  const { showToast } = useToast()
  const { countryCode } = useGetCountryCode()

  // Handle 3DS modal close - finalize payment after authentication
  const handleThreeDSClose = useCallback(() => {
    setThreeDSHtml(null)
    if (transactionRef) {
      finalizeCardPayment({ transactionReference: transactionRef })
      setTransactionRef(null)
    }
  }, [transactionRef, finalizeCardPayment])

  const mutation = useMutation({
    mutationFn: (payload: any) => submitCardDetails(payload),
    onSuccess: (data: any) => {
      // Handle 3D Secure HTML response
      if (data?.data?.three_ds_html || data?.three_ds_html) {
        const html = data?.data?.three_ds_html || data?.three_ds_html
        setThreeDSHtml(html)
        // Store transaction reference for finalization after 3DS
        if (data?.data?.transactionReference) {
          setTransactionRef(data.data.transactionReference)
        }
        return
      }

      if(data?.data?.paymentUrl){
        window.location.href = data.data.paymentUrl
        return
      }
      if(data?.redirectUrl || data?.data?.redirectUrl){
        window.location.href = data?.redirectUrl || data?.data?.redirectUrl
        return
      }
    
      finalizeCardPayment({transactionReference: data.data?.transactionReference})
    },
    onError: (error: any) => {
       showToast(
        `${
          error?.response?.data?.error?.message ??
          error?.response?.data?.error ??
          "An error occurred"
        }`,
        "error"
      );
    },
  })

  const handleSubmit = (values: PaymentFormValues) => {
    mutation.mutate({username: userDetails.username, token: token, countryCode: countryCode, mode: userDetails.mode, card_number: values.cardNumber?.replace(/\s/g, ""), expiry_month: values.expiryMonth, expiry_year: `20${values.expiryYear}`, cvv: values.cvc, currency: values.currency, amount: Number(values.amount?.replace(/,/g, "")), first_name: values.firstName, last_name: values.lastName, phone_number: values.phoneNumber, message: values.narration})
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl  border border-[#DDDDDD66] p-6 sm:p-8 my-12 w-full max-w-lg"
    >
      {/* Logo */}
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-16">
          <div
          className="w-[5rem] h-[4rem] relative cursor-pointer"
        >
          <Image
            src={getCloudinaryUrl("Grats_-_Logo_ug0dub")}
            className=""
            alt={`grats logo`}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
          />
        </div>
      
        <h1 className="text-[1.5rem] font-semibold leading-0 text-gray-800">Payment Gateway</h1>
      </motion.div>
     
     {userDetails?.currency && userDetails?.amount && (
      <div className="bg-[#ffffff] border border-[#00000033] p-4 rounded-lg mb-4">
        <p className="text-xs text-[#696D71]">
          Amount
        </p>
        <h2 className="text-2xl font-normal text-[#0F0F0F] ">{currencies.find((c) => c.code === userDetails?.currency)?.symbol ?? "$"}{formatAmountWithCommas(userDetails?.amount?.toString() ?? "0")}</h2>
      </div>
     )}

      <Formik
        initialValues={initialPaymentValues}
        validationSchema={paymentValidationSchema}
        onSubmit={handleSubmit}
        validateOnBlur={true}
        validateOnChange={true}
      >
        {({ values, errors, touched, setFieldValue, setFieldTouched }) => {
          const selectedCurrency = currencies.find((c) => c.code === values.currency)

          return (
            <Form className="space-y-5">
              {/* Currency and Amount */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div className={`${userDetails?.currency ? "hidden" : "block"}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Currency</label>
                  <div className="relative">
                    <Field
                      as="select"
                      name="currency"
                      className={`w-full appearance-none border-b py-2 pr-8 focus:outline-none bg-transparent text-gray-800 ${
                        touched.currency && errors.currency
                          ? "border-red-500"
                          : "border-gray-300 focus:border-green-500"
                      }`}
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </Field>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <ErrorMessage error={errors.currency} touched={touched.currency} />
                </div>
                <div className={`${userDetails?.amount ? "hidden" : "block"}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div
                    className={`flex items-center border-b py-2 ${
                      touched.amount && errors.amount ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <span className="text-gray-500 mr-1">{selectedCurrency?.symbol}</span>
                    <input
                      type="text"
                      value={values.amount}
                      onChange={(e) => {
                        const formatted = formatAmountWithCommas(e.target.value)
                        setFieldValue("amount", formatted)
                      }}
                      onBlur={() => setFieldTouched("amount", true)}
                      placeholder="0.00"
                      className={`w-full focus:outline-none bg-transparent placeholder-gray-400 ${
                        touched.amount && errors.amount ? "text-red-500" : "text-gray-800"
                      }`}
                    />
                  </div>
                  <ErrorMessage error={errors.amount} touched={touched.amount} />
                </div>
              </motion.div>

              {/* First Name and Last Name */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <Field
                    name="firstName"
                    placeholder="Your first name"
                    className={`w-full border-b py-2 focus:outline-none bg-transparent placeholder-gray-400 ${
                      touched.firstName && errors.firstName
                        ? "border-red-500 text-red-500"
                        : "border-gray-300 focus:border-green-500 text-gray-800"
                    }`}
                  />
                  <ErrorMessage error={errors.firstName} touched={touched.firstName} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <Field
                    name="lastName"
                    placeholder="Your last name"
                    className={`w-full border-b py-2 focus:outline-none bg-transparent placeholder-gray-400 ${
                      touched.lastName && errors.lastName
                        ? "border-red-500 text-red-500"
                        : "border-gray-300 focus:border-green-500 text-gray-800"
                    }`}
                  />
                  <ErrorMessage error={errors.lastName} touched={touched.lastName} />
                </div>
              </motion.div>

              {/* Email and Phone */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div
                    className={`flex items-center border-b py-2 ${
                      touched.email && errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <Mail
                      className={`w-4 h-4 mr-2 ${touched.email && errors.email ? "text-red-500" : "text-gray-400"}`}
                    />
                    <Field
                      type="email"
                      name="email"
                      placeholder="enter email address"
                      className={`w-full focus:outline-none bg-transparent placeholder-gray-400 ${
                        touched.email && errors.email ? "text-red-500" : "text-gray-800"
                      }`}
                    />
                  </div>
                  <ErrorMessage error={errors.email} touched={touched.email} />
                </div> */}
                <PhoneInput
                  countryCode={values.countryCode}
                  phoneNumber={values.phoneNumber}
                  onCountryCodeChange={(value) => setFieldValue("countryCode", value)}
                  onPhoneNumberChange={(value) => {
                    setFieldValue("phoneNumber", value)
                    setFieldTouched("phoneNumber", true)
                  }}
                  phoneError={errors.phoneNumber}
                  phoneTouched={touched.phoneNumber}
                />
              </motion.div>

              {/* Narration */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Narration (optional)</label>
                <Field
                  name="narration"
                  placeholder="describe in detail"
                  className="w-full border-b border-gray-300 py-2 focus:border-green-500 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
              </motion.div>

              {/* Card Details */}
              <motion.div variants={itemVariants}>
                <CardInput
                  cardNumber={values.cardNumber}
                  expiryMonth={values.expiryMonth}
                  expiryYear={values.expiryYear}
                  cvc={values.cvc}
                  onCardNumberChange={(value) => {
                    setFieldValue("cardNumber", value)
                    setFieldTouched("cardNumber", true)
                  }}
                  onExpiryMonthChange={(value) => {
                    setFieldValue("expiryMonth", value)
                    setFieldTouched("expiryMonth", true)
                  }}
                  onExpiryYearChange={(value) => {
                    setFieldValue("expiryYear", value)
                    setFieldTouched("expiryYear", true)
                  }}
                  onCvcChange={(value) => {
                    setFieldValue("cvc", value)
                    setFieldTouched("cvc", true)
                  }}
                  errors={{
                    cardNumber: errors.cardNumber,
                    expiryMonth: errors.expiryMonth,
                    expiryYear: errors.expiryYear,
                    cvc: errors.cvc,
                  }}
                  touched={{
                    cardNumber: touched.cardNumber,
                    expiryMonth: touched.expiryMonth,
                    expiryYear: touched.expiryYear,
                    cvc: touched.cvc,
                  }}
                />
              </motion.div>

              {/* SSL Notice */}
              <motion.div variants={itemVariants} className="flex items-center gap-1 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>This is a secure 128-bit SSL encrypted payment</span>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={mutation.isPending || isPendingFinalizeCardPayment || paymentState === "pending"}
                className="w-full bg-[#34C759] hover:bg-[#2DB84D] text-white font-semibold py-4 rounded-full transition-colors disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
              >
                {mutation.isPending || isPendingFinalizeCardPayment || paymentState === "pending" ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : (
                  "Complete Payment"
                )}
              </motion.button>
            </Form>
          )
        }}
      </Formik>

      {/* 3D Secure Authentication Modal */}
      <AnimatePresence>
        {threeDSHtml && (
          <ThreeDSecureModal 
            html={threeDSHtml} 
            onClose={handleThreeDSClose} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
