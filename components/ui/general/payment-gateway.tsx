import Image from "next/image";
import { getCloudinaryUrl } from "@/utils/cloudinary";
import Input from "@/components/ui/general/input-validated";
import SelectValidated from "@/components/ui/general/select-validated";
import { Form } from "formik";
import FormikWrapper from "@/context/FormikWrapper";
import * as Yup from "yup";
import { initiateTip, finalizeTip, getRates } from "@/services/dashboard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import { ClipLoader } from "react-spinners";
import { useState, useEffect, useRef } from "react";
import Processing from "../processing";
import Failed from "../failed";
import Success from "../success";
import useGetCountryCode from "@/hooks/useGetCountryCode";
import {
  EnvelopeIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  CurrencyPoundIcon,
} from "@heroicons/react/24/outline";
import dateFormat from "dateformat";

export default function PaymentGateway({
  merchantId,
  clientId,
  currency,
  clientName,
  transactionReference,
}: {
  merchantId: string;
  clientId: string;
  currency?: string;
  clientName?: string;
  transactionReference?: string;
}) {
  const [value, setValue] = useState<any>("");
  const { showToast } = useToast();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentWindowRef = useRef<Window | null>(null);
  const { countryCode } = useGetCountryCode();

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const stopPollingRef = useRef(false);

  const { data: usdRates } = useQuery({
    queryFn: () => getRates("USD"),
    queryKey: ["get usd rates"],
    refetchInterval: 300000,
  });

  const { data: eurRates } = useQuery({
    queryFn: () => getRates("EUR"),
    queryKey: ["get eur rates"],
    refetchInterval: 300000,
  });

  const {
    mutate: _finalizeTip,
    isPending: isPendingFinalizeTip,
    data: finalizeData,
    error: finalizeError,
    reset,
  }: any = useMutation({
    mutationFn: (payload: any) => finalizeTip(payload),
    onSuccess: async (data: any) => {
      if (data?.data?.status === "pending") {
        setIsProcessing(true);
        setTimeout(() => {
          _finalizeTip({
            transactionReference: transactionReference,
            client_uuid: clientId,
          });
        }, 5000);
      }
    },
    onError: (error: any) => {
      setFailed(true);
      showToast(
        `${
          error?.response?.data?.message ??
          error?.response?.data?.error?.message ??
          "An error occurred"
        }`,
        "error"
      );
    },
  });

  const { mutate: _initiateTip, isPending: isPendingInitiateTip }: any =
    useMutation({
      mutationFn: (payload: any) => initiateTip(payload),
      onSuccess: async (data: any) => {
        window.location.href = data.data.payment_url;
      },
      onError: (error: any) => {
        showToast(
          `${
            error?.response?.data?.message ??
            error?.response?.data?.error?.message ??
            "An error occurred"
          }`,
          "error"
        );
      },
    });

  useEffect(() => {
    if (transactionReference && clientId) {
      _finalizeTip({
        transactionReference: transactionReference,
        client_uuid: clientId,
      });
    }
  }, [transactionReference, clientId]);

  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
    amount: 0,
    description: "",
    currency: currency || "USD",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be a positive number")
      .min(5, "Amount must be at least $5"),
    description: Yup.string(),
    currency: Yup.string().required("Currency is required"),
  });

  const onSubmit = (values: {
    email: string;
    firstName: string;
    lastName: string;
    description?: string;
    amount: number;
    currency: string;
  }) => {
    // if (!countryCode) {
    //   showToast("Failed to fetch country code", "error");
    //   return;
    // }

    setValue(values.amount);

    _initiateTip({
      amount: Number(values.amount),
      currency: values.currency,
      merchant_id: merchantId ?? "",
      method: activePaymentMethod,
      countryCode: countryCode || "NG",
      redirectUrl: window.location.href,
      description:
        values.description || dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss"),
      client_uuid: clientId,
      customer_info: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      },
    });
  };

  if (success || finalizeData?.data?.status === "success") {
    return (
      <Success
        setSuccess={setSuccess}
        paymentData={finalizeData}
        reset={reset}
      />
    );
  }

  if (failed || finalizeError) {
    return <Failed setFailed={setFailed} reset={reset} />;
  }

  if (isProcessing || isPendingFinalizeTip) {
    return <Processing reset={reset} setIsProcessing={setIsProcessing} />;
  }

  return (
    <FormikWrapper
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }: any) => (
        <Form>
          <div className="w-full sm:bg-white max-w-[600px] mx-auto !rounded-3xl sm:p-8 lg:px-12 sm:py-12 sm:border border-[#DDDDDD66]">
            <div className="mb-12">
              {" "}
              <h4 className="text-[#1E1E1E] text-center text-[1.2rem] lg:text-[1.5rem] font-[600]">
                GRATS ORCHESTRATOR SERVICE
              </h4>
              <p className="text-[#2c2b2b] text-sm lg:text-[1rem] text-center font-[400] capitalize">
                {clientName?.toLowerCase()}
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[#000] text-sm block font-[500]">
                  First Name
                </label>
                <Input
                  name="firstName"
                  className="h-10"
                  type="text"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="text-[#000] text-sm block font-[500]">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  className="h-10"
                  type="text"
                  placeholder="Last Name"
                />
              </div>

              <div>
                <label className="text-[#000] text-sm block font-[500]">
                  Email Address
                </label>
                <Input
                  name="email"
                  className="h-10"
                  type="text"
                  placeholder="Email Address"
                  Icon={EnvelopeIcon}
                />
              </div>

              <div>
                <label className="text-[#000] text-sm block font-[500]">
                  Narration (Optional)
                </label>
                <Input
                  name="description"
                  className="h-10"
                  type="text"
                  placeholder="Narration"
                />
              </div>

              <div className="grid grid-cols-[90px_1fr] gap-6">
                <div>
                  <label className="text-[#000] text-sm block font-[500]">
                    Currency
                  </label>
                  <SelectValidated
                    name="currency"
                    h="h-10"
                    className="border-b px-0 rounded-none shadow-none"
                    placeholder="Currency"
                    options={[
                      { name: "USD", value: "USD" },
                      { name: "GBP", value: "GBP" },
                      { name: "EUR", value: "EUR" },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-[#000] text-sm block font-[500]">
                    Amount
                  </label>
                  <Input
                    name="amount"
                    className="h-10"
                    type="number"
                    placeholder="Amount"
                    Icon={
                      values?.currency === "USD"
                        ? CurrencyDollarIcon
                        : values?.currency === "EUR"
                        ? CurrencyEuroIcon
                        : CurrencyPoundIcon
                    }
                  />
                </div>
              </div>
            </div>
            {values?.currency !== "GBP" && (
              <p className="text-[.87rem] mt-[8px] font-[400] text-[#1A1B1C]">
                Payments are processed in GBP at
                {values?.currency === "USD" ? " $" : " €"}1 ≈ £
                {Number(
                  values?.currency === "USD"
                    ? usdRates?.data?.quotes?.USDGBP
                    : eurRates?.data?.quotes?.EURGBP
                ) || 0}
              </p>
            )}

            <button
              onClick={() => {
                setActivePaymentMethod("Apple Pay");
              }}
              type="submit"
              className="flex justify-center mt-12  items-center gap-1 cursor-pointer py-3 w-full rounded-full border border-[#CCCCCC4D]"
            >
              <div className="w-[1.2rem] h-[1.2rem] relative">
                <Image
                  src={getCloudinaryUrl("image_3_caat07")}
                  className=""
                  alt={`apple logo`}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                />
              </div>
              <p className="text-[1rem] mt-[2px] font-[400] text-[#000000]">
                Pay
              </p>
              {isPendingInitiateTip && activePaymentMethod === "Apple Pay" && (
                <ClipLoader
                  color={"#00000091"}
                  loading={true}
                  size={17}
                  cssOverride={{ marginLeft: "20px", marginTop: "3px" }}
                  aria-label="Loading Spinner"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActivePaymentMethod("Google Pay");
              }}
              type="submit"
              className="flex justify-center items-center gap-1 mt-2  cursor-pointer py-3 w-full rounded-full border border-[#CCCCCC4D]"
            >
              <div className="w-[1.2rem] h-[1.2rem] relative">
                <Image
                  src={getCloudinaryUrl("image_4_3_xwsxcs")}
                  className=""
                  alt={`google logo`}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                />
              </div>
              <p className="text-[1rem] font-[400] text-[#00000091]">Pay</p>
              {isPendingInitiateTip && activePaymentMethod === "Google Pay" && (
                <ClipLoader
                  color={"#00000091"}
                  loading={true}
                  size={17}
                  cssOverride={{ marginLeft: "20px", marginTop: "3px" }}
                  aria-label="Loading Spinner"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActivePaymentMethod("Card Pay");
              }}
              type="submit"
              className="flex justify-center mt-2 mb-12 lg:mb-0 cursor-pointer items-center gap-1 py-3 w-full rounded-full border border-[#CCCCCC4D]"
            >
              <p className="text-[1rem] mt-[0px] font-[400] text-[#000000] ">
                Pay With Card
              </p>
              {isPendingInitiateTip && activePaymentMethod === "Card Pay" && (
                <ClipLoader
                  color={"#00000091"}
                  loading={true}
                  size={17}
                  cssOverride={{ marginLeft: "20px", marginTop: "3px" }}
                  aria-label="Loading Spinner"
                />
              )}
            </button> 
          </div>
        </Form>
      )}
    </FormikWrapper>
  );
}
