/**
 * Expected schema across the three data categories the platform accepts.
 * `key` should match the (normalized) CSV header. `type` drives generic
 * integrity checks in fieldValidator.js. Unrecognized extra columns are
 * preserved and passed through untouched in the cleaned output.
 */
export const FIELD_SCHEMA = {
  order: [
    {
      key: "order_id",
      label: "Order ID",
      type: "string",
      required: true,
      unique: true,
    },
    { key: "order_date", label: "Order Date", type: "date", required: true },
    {
      key: "customer_name",
      label: "Customer Name",
      type: "string",
      required: true,
    },
    {
      key: "customer_phone",
      label: "Customer Phone",
      type: "phone",
      required: true,
    },
    {
      key: "country_code",
      label: "Country Code",
      type: "string",
      required: true,
    },
    {
      key: "shipping_address",
      label: "Shipping Address",
      type: "string",
      required: false,
    },
    {
      key: "order_status",
      label: "Order Status",
      type: "enum",
      required: false,
      allowed: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
    },
  ],
  product: [
    { key: "order_id", label: "Order ID", type: "string", required: true },
    { key: "product_id", label: "Product ID", type: "string", required: true },
    {
      key: "product_name",
      label: "Product Name",
      type: "string",
      required: true,
    },
    {
      key: "quantity",
      label: "Quantity",
      type: "integer",
      required: true,
      min: 1,
    },
    {
      key: "unit_price",
      label: "Unit Price",
      type: "decimal",
      required: true,
      min: 0,
    },
    { key: "currency", label: "Currency", type: "currency", required: true },
  ],
  payment: [
    { key: "order_id", label: "Order ID", type: "string", required: true },
    {
      key: "payment_mode",
      label: "Payment Mode",
      type: "enum",
      required: true,
      allowed: [
        "card",
        "upi",
        "wallet",
        "cod",
        "bank_transfer",
        "paypal",
        "crypto",
      ],
    },
    {
      key: "payment_status",
      label: "Payment Status",
      type: "enum",
      required: true,
      allowed: ["paid", "pending", "failed", "refunded"],
    },
    {
      key: "transaction_time",
      label: "Transaction Time",
      type: "time",
      required: false,
    },
    { key: "amount", label: "Amount", type: "decimal", required: true, min: 0 },
  ],
};

export const ALL_FIELDS = [
  ...FIELD_SCHEMA.order,
  ...FIELD_SCHEMA.product,
  ...FIELD_SCHEMA.payment,
];

export const CURRENCY_CODES = [
  "USD",
  "SGD",
  "INR",
  "GBP",
  "EUR",
  "AUD",
  "MYR",
  "IDR",
  "PHP",
  "THB",
  "VND",
  "CNY",
  "JPY",
  "KRW",
  "AED",
  "SAR",
  "NZD",
  "BRL",
  "CAD",
];

export function normalizeHeader(header) {
  return String(header)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}
