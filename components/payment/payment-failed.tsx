import { motion } from "framer-motion"
import { X } from "lucide-react"

interface PaymentFailedProps {
  onRetry: () => void
}

export function PaymentFailed({ onRetry }: PaymentFailedProps) {
  return (
    <div className=" bg-[#FFFDE7] flex flex-col">
    
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Failed Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="w-32 h-32 rounded-full bg-[#EF4444] flex items-center justify-center mb-6"
        >
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <X className="w-16 h-16 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-semibold text-gray-800 text-center mb-8"
        >
          Failed
        </motion.h2>

        {/* Retry Button */}
        {/* <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="w-48 py-3 border border-gray-300 rounded-full text-gray-800 font-medium hover:bg-gray-50 transition-colors"
        >
          Try again
        </motion.button> */}
      </div>
    </div>
  )
}
