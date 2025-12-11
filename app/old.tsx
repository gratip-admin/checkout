"use client";
import NotFound from "@/components/ui/not-found";
import { Suspense } from "react";
import TopNav from "@/components/layout/top-nav";
import { HashLoader, ClipLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getClientDetails } from "@/services/dashboard";
import PaymentGateway from "@/components/ui/general/payment-gateway";

function PageContent() {
  const searchParams = useSearchParams();
  const client = searchParams.get("client");
  const merchantId = searchParams.get("merchant_id");
  const currency = searchParams.get("currency");
  const transactionReference = searchParams.get("TransactionReference");

  const { data, isLoading, error } = useQuery({
    queryFn: () => getClientDetails(client ?? ""),
    queryKey: ["get client details", client],
  });

  if (isLoading) {
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

  if (error || !client) {
    return <NotFound />;
  }

  return (
    <div className="font-inter min-h-screen bg-[#FFFEEA]">
      <TopNav />
      <div className="mt-12 px-6 pb-12">
        <PaymentGateway
          merchantId={merchantId ?? ""}
          clientId={data?.data?.client_uuid ?? ""}
          clientName={data?.data?.client_name ?? ""}
          currency={currency ?? "USD"}
          transactionReference={transactionReference ?? ""}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="font-inter min-h-screen bg-white">
          <TopNav />
          <div className="w-fit mx-auto mt-8">
            <HashLoader
              color={"#000"}
              loading={true}
              size={20}
              cssOverride={{ marginTop: "5px" }}
              aria-label="Loading Spinner"
            />
          </div>
        </div>
      }
    >
      <PageContent />
    </Suspense>
  );
}
