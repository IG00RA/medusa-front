interface QueryParams {
  [key: string]: string | null | undefined
  refId?: string | null | undefined
  sub1?: string | null | undefined
  sub2?: string | null | undefined
  sub3?: string | null | undefined
  sub4?: string | null | undefined
  sub5?: string | null | undefined
  sub6?: string | null | undefined
  sub7?: string | null | undefined
  sub8?: string | null | undefined
  fbp?: string | null | undefined
}

interface CartItem {
  photo: string
  name: string
  color: string
  price: number
  quantity: number
}

interface CustomerInfo {
  name: string
  email: string
  phoneNumber: string
  country: string
  messenger: "Telegram" | "Viber" | "WhatsApp" | null
  comment?: string
}

interface OrderData {
  items: CartItem[]
  totalPrice: number
  customerInfo: CustomerInfo
}

const getDefaultUrl = (): string =>
  typeof window !== "undefined"
    ? document.referrer || "Не вказано"
    : "Не вказано"

const getQueryParams = (): QueryParams => {
  if (typeof window === "undefined") {
    return {}
  }
  const searchParams = new URLSearchParams(window.location.search)
  return {
    refId: searchParams.get("ref_id"),
    sub1: searchParams.get("sub1"),
    sub2: searchParams.get("sub2"),
    sub3: searchParams.get("sub3"),
    sub4: searchParams.get("sub4"),
    sub5: searchParams.get("sub5"),
    sub6: searchParams.get("sub6"),
    sub7: searchParams.get("sub7"),
    sub8: searchParams.get("sub8"),
    fbp: searchParams.get("fbp"),
  }
}

function getParamString(queryParams: QueryParams): string {
  let message = ""
  for (const key in queryParams) {
    if (queryParams[key]) {
      message += `${key}: <b>${queryParams[key]}</b>\n`
    }
  }
  return message
}

export function formatOrderMessage(orderData: OrderData): string {
  const { items, totalPrice, customerInfo } = orderData
  const { name, email, phoneNumber, country, messenger, comment } = customerInfo
  const params = getQueryParams()
  const stringParams = getParamString(params)
  const itemsList = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} (${item.color}) - ${item.price} грн x ${
          item.quantity
        } = ${item.price * item.quantity} грн`
    )
    .join("\n")

  return `🛒 *НОВЕ ЗАМОВЛЕННЯ FlexiHUB*\n
*Клієнт:* ${name}
*Email:* ${email}
*Телефон:* ${phoneNumber}
*Країна:* ${country}
*Месенджер:* ${messenger || "Не вказано"}
${comment ? `*Коментар:* ${comment}\n` : ""}
*Товари:*
${itemsList}
*Загальна сума:* ${totalPrice} грн
*Params:*\n${stringParams}
*Referrer:* ${getDefaultUrl()}
`
}

export async function sendOrderToTelegram(
  orderData: OrderData
): Promise<{ success: boolean; message?: string }> {
  try {
    const message = formatOrderMessage(orderData)
    const response = await fetch("/api/sendToTg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    console.log("Telegram API response:", response)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send data to API: ${errorText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending data to API: ", error)
    return {
      success: false,
      message:
        "Error sending data to API: " +
        (error instanceof Error ? error.message : String(error)),
    }
  }
}
