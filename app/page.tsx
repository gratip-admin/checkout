"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { PaymentForm } from "@/components/payment/payment-form"
import { PaymentSuccess } from "@/components/payment/payment-success"
import { PaymentFailed } from "@/components/payment/payment-failed"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { verifyToken, finalizeCardPayment, submitCardDetails } from "@/services"
import NotFound from "@/components/ui/not-found"
import { ClipLoader } from "react-spinners"
import { useQuery, useMutation } from "@tanstack/react-query"
import TopNav from "@/components/layout/top-nav"
import { useToast } from "@/context/ToastContext"

const queryClient = new QueryClient()

export type PaymentState = "form" | "success" | "failed" | "pending"

function PageContent() {
  const searchParams = useSearchParams()
  const transactionReference = searchParams.get("TransactionReference")
  const token = searchParams.get("token")
  const { showToast } = useToast()
  const [paymentState, setPaymentState] = useState<PaymentState>("form")
  const [paidAmount, setPaidAmount] = useState<number>(0)
  const [currency, setCurrency] = useState<string>("USD")

  const handlePaymentSuccess = (data: any) => {
    setPaidAmount(data.amount)
    setCurrency(data.currency)
    setPaymentState("success")
  }

  const handlePaymentFailed = () => {
    setPaymentState("failed")
  }

  const handleRetry = () => {
    setPaymentState("form")
  }

  const handleClose = () => {
    setPaymentState("form")
  }



  const { data, isLoading, error } = useQuery({
    queryFn: () => verifyToken(token ?? ""),
    queryKey: ["verify token", token],
    enabled: !!token,
  });

  const {mutate: _finalizeCardPayment, isPending: isPendingFinalizeCardPayment} = useMutation({
    mutationFn: (payload: any) => finalizeCardPayment(payload),
    onSuccess: (data: any) => {
        if(data?.data?.status === "pending"){
          setPaymentState("pending")
          setTimeout(() => {
            _finalizeCardPayment({transactionReference: transactionReference})
          }, 5000)
          return
        }
        if(data?.data?.status === "success"){
          handlePaymentSuccess(data.data)
          return
        }
        setPaymentState("failed")
        
    },
    onError: (error: any) => {
        setPaymentState("failed")
    //    showToast(
    //     `${
    //       error?.response?.data?.error?.message ??
    //       error?.response?.data?.error ??
    //       "An error occurred"
    //     }`,
    //     "error"
    //   );
    },
  })

  useEffect(() => {
    if (transactionReference) {
      setPaymentState("pending")
      _finalizeCardPayment({transactionReference: transactionReference})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionReference])

  if (isLoading || (paymentState === "pending" && transactionReference)) {
    return (
      <div className="min-h-screen bg-[#FFFEEA]">
        <div className="w-fit mx-auto pt-8">
          <ClipLoader
            color={"#000"}
            loading={true}
            size={25}
            cssOverride={{ marginTop: "5px" }}
            aria-label="Loading Spinner"
          />
        </div>
        <p className="text-center text-sm text-[#696D71] mt-2">
          A moment please...
        </p>
      </div>
    );
  }

  if (error || (!token && !transactionReference)) {
    return <NotFound />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className=" ">
      {paymentState !== "form" && <TopNav />}
      <div className="min-h-screen bg-[#FFFDE7]  p-4">
        {/* <div className="w-fit mx-auto"> */}
        <AnimatePresence mode="wait">
          {paymentState === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentForm paymentState={paymentState} isPendingFinalizeCardPayment={isPendingFinalizeCardPayment} finalizeCardPayment={_finalizeCardPayment} token={token} userDetails={data?.data} />
            </motion.div>
          )}
          {paymentState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentSuccess amount={paidAmount} currency={currency} onClose={handleClose} />
            </motion.div>
          )}
          {paymentState === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentFailed onRetry={handleRetry} />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
      {/* </div> */}
    </QueryClientProvider>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFEEA]">
          <div className="w-fit mx-auto pt-8">
            <ClipLoader
              color={"#000"}
              loading={true}
              size={25}
              cssOverride={{ marginTop: "5px" }}
              aria-label="Loading Spinner"
            />
          </div>
          <p className="text-center text-sm text-[#696D71] mt-2">
            A moment please...
          </p>
        </div>
      }
    >
      <PageContent />
    </Suspense>
  )
}
