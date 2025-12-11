"use client";
import { getCloudinaryUrl } from "@/utils/cloudinary";
import Image from "next/image";
import Link from "next/link";
import { LinkIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

export default function Success({
  setSuccess,
  reset,
  paymentData,
}: {
  setSuccess: (value: boolean) => void;
  reset: any;
  paymentData: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
      default:
        return currency;
    }
  };

  return (
    <div className="max-w-[350px] mx-auto">
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
      <h2 className="text-[#1E1E1E] mt-10 text-center font-[600] text-[1.3rem] lg:text-[1.5rem] leading-tight">
        Payment Successful
      </h2>
      <p className="text-[#4A4D50] mx-auto mt-1 text-[.87rem] text-center lg:text-[1rem] mb-6">
        Your {getCurrencySymbol(paymentData?.data?.currency || "USD")}
        {Number(paymentData?.data?.amount || 0)} payment has been sent
        successfully.{" "}
      </p>

      <button
        // onClick={() => setShowQrCode(true)}
        onClick={() => {
          setSuccess(false);

          const params = new URLSearchParams(searchParams.toString());
          params.delete("TransactionReference");
          const newQuery = params.toString();
          const newUrl = newQuery ? `?${newQuery}` : "";
          router.replace(`${window.location.pathname}${newUrl}`);
          reset();
        }}
        type="submit"
        className="mt-6 max-w-[200px] mx-auto flex justify-center items-center gap-2 cursor-pointer py-3 w-full rounded-full bg-[#1AB837] text-white"
      >
        Send Again
      </button>
    </div>
  );
}
