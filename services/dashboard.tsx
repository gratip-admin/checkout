import { Http } from "@/utils/http";

export const getClientDetails = (name: string) =>
  Http.get(`/ui/payment-gateway/client/${name}`);

export const initiateTip = (payload: any) =>
  Http.post(`/ui/payment-gateway/collections/initiate`, payload);

export const finalizeTip = (payload: any) =>
  Http.post(`/ui/payment-gateway/collections/finalize`, payload);

export const getRates = (source: string) => Http.get(`/rates?source=${source}`);