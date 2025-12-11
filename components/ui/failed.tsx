"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getCloudinaryUrl } from "@/utils/cloudinary";
import Link from "next/link";
import { LinkIcon } from "@heroicons/react/24/outline";

export default function Failed({
  setFailed,
  reset,
}: {
  setFailed: (value: boolean) => void;
  reset: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="max-w-[500px] mx-auto">
      <div
        onClick={() => router.push("/")}
        className="size-[10rem] mx-auto relative cursor-pointer"
      >
        {" "}
        <Image
          src={getCloudinaryUrl("image_40_1_cp5otm")}
          className=""
          alt={`success`}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
        />
      </div>
      <h2 className="text-[#1E1E1E] mt-6 text-center font-[600] text-[1.3rem] lg:text-[1.5rem] leading-tight">
        Failed
      </h2>

      <button
        // onClick={() => setShowQrCode(true)}
        onClick={() => {
          setFailed(false);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("TransactionReference");
          const newQuery = params.toString();
          const newUrl = newQuery ? `?${newQuery}` : "";
          router.replace(`${window.location.pathname}${newUrl}`);

          if (reset) {
            reset();
          }
        }}
        type="submit"
        className="mt-6 text-[.95rem] font-[500] max-w-[200px] mx-auto flex justify-center items-center gap-2 cursor-pointer py-3 w-full rounded-full bg-white text-[#000000] border border-[#CCCCCC4D]"
      >
        Try again
      </button>
    </div>
  );
}
