import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search } from "lucide-react"
import { countryCodes, type CountryCode } from "@/lib/data/country-codes"

interface PhoneInputProps {
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (value: string) => void
  onPhoneNumberChange: (value: string) => void
  phoneError?: string
  phoneTouched?: boolean
}

export function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  phoneError,
  phoneTouched,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0]

  const filteredCountries = countryCodes.filter(
    (c) => c.country.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search),
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (country: CountryCode) => {
    onCountryCodeChange(country.code)
    setIsOpen(false)
    setSearch("")
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    onPhoneNumberChange(value)
  }

  const hasError = phoneTouched && phoneError

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <span className="mr-11">Code</span>
        <span>Phone number</span>
      </label>
      <div className={`flex items-center border-b py-2 gap-2 ${hasError ? "border-red-500" : "border-gray-300"}`}>
        {/* Country Code Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-gray-800 hover:text-gray-600 focus:outline-none min-w-[70px]"
          >
            <span>{selectedCountry.flag}</span>
            <span className="text-sm">{selectedCountry.code}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
              >
                {/* Search */}
                <div className="p-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search country..."
                      className="flex-1 text-sm bg-transparent focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Country List */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country, index) => (
                      <button
                        key={`${country.code}-${country.country}-${index}`}
                        type="button"
                        onClick={() => handleSelect(country)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          country.code === countryCode ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <span>{country.flag}</span>
                        <span className="flex-1 text-left">{country.country}</span>
                        <span className="text-gray-500">{country.code}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">No countries found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Phone number"
          className={`flex-1 focus:outline-none bg-transparent placeholder-gray-400 ${
            hasError ? "text-red-500" : "text-gray-800"
          }`}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs mt-1"
          >
            {phoneError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
