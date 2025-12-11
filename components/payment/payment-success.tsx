"use client"

import { motion } from "framer-motion"
import { getCloudinaryUrl } from "@/utils/cloudinary"
import Image from "next/image"

interface PaymentSuccessProps {
  amount: number
  currency: string
  onClose: () => void
}

export function PaymentSuccess({ amount, currency, onClose }: PaymentSuccessProps) {
 
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "NGN":
        return "₦";
      case "GBP":
        return "£";
      case "EUR": 
        return "€";
      case "GHS":
        return "₵";
      default:
        return currency;
    }
  }
  return (
  
    
    <div className=" bg-[#FFFDE7] flex flex-col">
      

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Success Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="relative mb-6"
        >
          <div
        className="size-[10rem] mx-auto relative cursor-pointer"
      >
        {" "}
        <Image
          src={getCloudinaryUrl("image_40_k764si")}
          className=""
          alt={`success`}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
        />
      </div>
        </motion.div>

        {/* Text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-semibold text-gray-800 mb-2"
        >
          Successful
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-8 text-center"
        >
          Your {getCurrencySymbol(currency)} {Number(amount).toLocaleString()} payment was sent successfully
        </motion.p>

        {/* Close Button */}
        {/* <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-48 py-3 border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-50 transition-colors"
        >
          Close
        </motion.button> */}
      </div>
    </div>
  )
}
