




import { Http } from "@/utils/http";

export const verifyToken = (token: string) =>
  Http.get(`/users/tips/checkout/verify-token?token=${token}`);

export const submitCardDetails = (payload: any) =>
  Http.post(`/users/tips/checkout/submit`, payload);

export const finalizeCardPayment = (payload: any) =>
  Http.post(`/users/tips/card-payment/finalize`, payload);