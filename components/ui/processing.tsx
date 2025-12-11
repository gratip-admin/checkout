import { FadeLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";

export default function Processing({
  setIsProcessing,
  reset,
}: {
  reset: any;
  setIsProcessing: any;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <div className="max-w-[500px] mx-auto">
      <FadeLoader
        color={"#00000091"}
        loading={true}
        height={30}
        width={10}
        radius={20}
        margin={20}
        cssOverride={{ display: "block", margin: "0 auto" }}
        aria-label="Loading Spinner"
      />
      <h2 className="text-[#1E1E1E] mt-10 text-center font-[600] text-[1.3rem] lg:text-[1.5rem] leading-tight">
        Processing Payment
      </h2>
      <p className="text-[#4A4D50] mx-auto mt-1 text-[.87rem] text-center lg:text-[1rem] mb-6">
        Please wait while we process your payment...
      </p>

      <button
        // onClick={() => setShowQrCode(true)}
        onClick={() => {
          setIsProcessing(false);

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
        className="mt-6 max-w-[200px]  font-[500] text-[.95rem] mx-auto flex justify-center items-center gap-2 cursor-pointer py-3 w-full rounded-full bg-white text-[#000000] border border-[#CCCCCC4D]"
      >
        Cancel
      </button>
    </div>
  );
}
