// Server-only Kashier helpers.
import { createHmac, timingSafeEqual } from "node:crypto";

export function kashierEnv() {
  const merchantId = process.env["KASHIER_MERCHANT_ID"];
  // Kashier's dashboard labels the hashing key differently over time; accept
  // every name the merchant may have stored it under.
  const apiKey =
    process.env["KASHIER_API_KEY"] ??
    process.env["KASHIER_SECRET_KEY"] ??
    process.env["KASHIER_PAYMENT_API_KEY"];
  const mode = process.env["KASHIER_MODE"] ?? "test";
  if (!merchantId || !apiKey) {
    throw new Error(
      "Kashier is not configured yet: KASHIER_MERCHANT_ID and KASHIER_API_KEY are missing.",
    );
  }
  return { merchantId, apiKey, mode };
}

export function kashierOrderHash(params: {
  merchantId: string;
  apiKey: string;
  orderId: string;
  amount: string;
  currency: string;
}) {
  const path = `/?payment=${params.merchantId}.${params.orderId}.${params.amount}.${params.currency}`;
  return createHmac("sha256", params.apiKey).update(path).digest("hex");
}

type WebhookData = Record<string, unknown>;

export function verifyKashierSignature(
  data: WebhookData,
  signature: string | null,
  apiKey: string,
) {
  if (!signature) return false;
  const v = (k: string) => (data[k] === undefined || data[k] === null ? "" : String(data[k]));
  const queryString =
    `&paymentStatus=${v("paymentStatus")}` +
    `&cardDataToken=${v("cardDataToken")}` +
    `&maskedCard=${v("maskedCard")}` +
    `&merchantOrderId=${v("merchantOrderId")}` +
    `&orderId=${v("orderId")}` +
    `&currency=${v("currency")}` +
    `&amount=${v("amount")}` +
    `&transactionId=${v("transactionId")}`;
  const expected = createHmac("sha256", apiKey).update(queryString).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
