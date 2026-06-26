const PAYMOB_API = "https://accept.paymob.com/api"

interface PaymobAuthResponse {
  token: string
}

interface PaymobOrderResponse {
  id: number
}

interface PaymobPaymentKeyResponse {
  token: string
}

async function getAuthToken(): Promise<string> {
  const res = await fetch(`${PAYMOB_API}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
  })
  if (!res.ok) throw new Error("Paymob auth failed")
  const data: PaymobAuthResponse = await res.json()
  return data.token
}

export async function createPaymobOrder(
  amountCents: number,
  merchantOrderId: string
): Promise<{ orderId: number; paymentKey: string }> {
  const token = await getAuthToken()

  const orderRes = await fetch(`${PAYMOB_API}/ecommerce/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      auth_token: token,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: merchantOrderId,
      items: [],
    }),
  })
  if (!orderRes.ok) throw new Error("Paymob order creation failed")
  const orderData: PaymobOrderResponse = await orderRes.json()

  const paymentRes = await fetch(`${PAYMOB_API}/acceptance/payment_keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      auth_token: token,
      amount_cents: amountCents,
      expiration: 36000,
      order_id: orderData.id,
      billing_data: {
        apartment: "NA",
        email: "NA",
        floor: "NA",
        first_name: "NA",
        street: "NA",
        building: "NA",
        phone_number: "NA",
        shipping_method: "PKG",
        postal_code: "NA",
        city: "NA",
        country: "EG",
        last_name: "NA",
        state: "NA",
      },
      currency: "EGP",
      integration_id: parseInt(process.env.PAYMOB_INTEGRATION_ID!),
      lock_order_when_paid: true,
    }),
  })
  if (!paymentRes.ok) throw new Error("Paymob payment key creation failed")
  const paymentData: PaymobPaymentKeyResponse = await paymentRes.json()

  return { orderId: orderData.id, paymentKey: paymentData.token }
}

export function verifyPaymobHmac(data: Record<string, string | number>): boolean {
  const hmac = data.hmac as string
  if (!hmac) return false
  const { hmac: _, ...rest } = data
  const keys = Object.keys(rest).sort()
  const concatenated = keys.map((k) => rest[k]).join("")
  const { createHmac } = require("crypto")
  const computed = createHmac("sha512", process.env.PAYMOB_HMAC_SECRET!)
    .update(concatenated)
    .digest("hex")
  return computed === hmac
}
