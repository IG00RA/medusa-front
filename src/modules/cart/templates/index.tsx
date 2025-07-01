"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  HttpTypes,
  StoreCalculatedPrice,
  StoreCartShippingOption,
  StorePrice,
} from "@medusajs/types"
import { Heading, Text, Button } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { validateEmail, validatePhone } from "@/utils/validation"
import { sendOrderToTelegram } from "@/lib/telegramBot"
import {
  updateCart,
  updateLineItem,
  setShippingMethod,
  initiatePaymentSession,
  placeOrder,
  listCartOptions,
} from "@lib/data/cart"
import {
  PrimaryButton,
  SecondaryButton,
} from "@/modules/layout/components/buttons"

interface CountryOption {
  code: string
  name: string
  phoneCode: string
}

const countries: CountryOption[] = [
  { code: "UA", name: "Україна", phoneCode: "+380" },
  { code: "PL", name: "Polska", phoneCode: "+48" },
  { code: "SK", name: "Slovensko", phoneCode: "+421" },
  { code: "CZ", name: "Česká republika", phoneCode: "+420" },
]

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [name, setName] = useState(customer?.first_name || "")
  const [email, setEmail] = useState(customer?.email || "")
  const [phoneNumber, setPhoneNumber] = useState(countries[0].phoneCode)
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [countryMenuOpen, setCountryMenuOpen] = useState(false)
  const [messenger, setMessenger] = useState<
    "Telegram" | "Viber" | "WhatsApp" | null
  >("Telegram")
  const [comment, setComment] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [termsError, setTermsError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orderStatus, setOrderStatus] = useState<{
    success?: boolean
    message?: string
  } | null>(null)
  const [cartItems, setCartItems] = useState(cart?.items || [])

  // Calculate total price
  const totalPrice =
    cartItems?.reduce(
      (total, item) => total + (item.unit_price || 0) * (item.quantity || 0),
      0
    ) || 0

  // Update cart items when cart prop changes
  useEffect(() => {
    if (cart?.items) {
      setCartItems(cart.items)
    }
  }, [cart])

  // Handle quantity change
  const handleQuantityChange = async (itemId: string, value: number) => {
    if (value < 1 || !cart?.id) return

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: value } : item
      )
    )

    try {
      await updateLineItem({
        lineId: itemId,
        quantity: value,
      })
      router.refresh()
    } catch (error) {
      console.error("Error updating quantity:", error)
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity } : item
        )
      )
    }
  }

  // Handle phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value.startsWith(selectedCountry.phoneCode)) {
      setPhoneNumber(selectedCountry.phoneCode)
    } else {
      const phoneCode = selectedCountry.phoneCode
      const remainingPart = value.slice(phoneCode.length)
      const filteredRemaining = remainingPart.replace(/\D/g, "")
      setPhoneNumber(phoneCode + filteredRemaining)
    }
  }

  // Handle country selection
  const handleCountryChange = (country: CountryOption) => {
    setSelectedCountry(country)
    setPhoneNumber(country.phoneCode)
    setCountryMenuOpen(false)
  }

  const getLocaleFromPath = (pathname: string): string => {
    const pathSegments = pathname.split("/")
    return pathSegments[1] || "ua"
  }

  const locale = getLocaleFromPath(pathname || "")

  const handleSubmit = async () => {
    setNameError("")
    setEmailError("")
    setPhoneError("")
    setTermsError(false)
    setOrderStatus(null)

    let formValid = true

    if (name.trim() === "") {
      setNameError("Введіть ваше ім'я")
      formValid = false
    }

    if (!validateEmail(email)) {
      setEmailError("Введіть коректну електронну адресу")
      formValid = false
    }

    if (!validatePhone(phoneNumber, selectedCountry)) {
      setPhoneError(
        `Введіть коректний номер телефону для ${selectedCountry.name}`
      )
      formValid = false
    }

    if (!termsAccepted) {
      setTermsError(true)
      formValid = false
    }

    if (formValid && cart) {
      setLoading(true)

      const defaultAddress = {
        address_1: selectedCountry.name,
        city: `Comment: ${comment}`,
        postal_code: `Messenger: ${messenger}`,
        country_code: selectedCountry.code.toLowerCase(),
        first_name: name.split(" ")[0] || "Customer",
        last_name: name.split(" ")[1] || "",
        phone: phoneNumber,
      }

      const orderData = {
        items:
          cartItems?.map((item) => ({
            photo: item.thumbnail || "",
            name: item.title || "",
            color: item.variant?.title || "",
            price: item.unit_price || 0,
            quantity: item.quantity || 0,
          })) || [],
        totalPrice,
        customerInfo: {
          name,
          email,
          phoneNumber,
          country: selectedCountry.name,
          messenger,
          comment,
        },
      }

      try {
        // Optionally send to Telegram
        const telegramResult = await sendOrderToTelegram(orderData)
        if (!telegramResult.success) {
          throw new Error(
            telegramResult.message || "Помилка відправки замовлення в Telegram."
          )
        }

        // Update cart with email and addresses
        await updateCart({
          email,
          shipping_address: defaultAddress,
          billing_address: defaultAddress,
        })

        // Fetch and set default shipping method
        const { shipping_options } = await listCartOptions()
        if (!shipping_options || shipping_options.length === 0) {
          throw new Error("Немає доступних методів доставки.")
        }
        const selectedShippingMethod = shipping_options.find(
          (option) => !option.insufficient_inventory
        )
        if (!selectedShippingMethod) {
          throw new Error("Немає доступних методів доставки.")
        }
        await setShippingMethod({
          cartId: cart.id,
          shippingMethodId: selectedShippingMethod.id,
        })

        // Initiate payment session with pp_system_default
        await initiatePaymentSession(cart, {
          provider_id: "pp_system_default",
        })

        // Place the order
        await placeOrder(cart.id)

        setOrderStatus({
          success: true,
          message:
            "Замовлення успішно відправлено! Перенаправлення на сторінку підтвердження...",
        })

        setTimeout(() => {
          router.push(`/${locale}/checkout/success`)
        }, 2000)
      } catch (error) {
        console.error("Order submission error:", error)
        setOrderStatus({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Виникла помилка при відправці замовлення.",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  if (!cart) {
    return <div className="text-center py-12">No cart data available</div>
  }
  return (
    <div className="py-12 max-w-6xl mx-auto text-gray-600">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
        Оформлення замовлення
      </h1>
      <p className="text-center text-lg mb-6">
        Заповніть контактні дані для завершення замовлення
      </p>
      <div className="bg-blue-500 h-1 w-24 mx-auto mb-12"></div>

      {orderStatus && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            orderStatus.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          data-testid="order-status-message"
        >
          {orderStatus.message}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-10">
        {/* Cart Items */}
        <div className="bg-[var(--color-lighter-blue)] rounded-2xl py-[32px] px-[40px] mb-[40px]">
          <div className="flex justify-between">
            <h2 className="text-[18px] font-bold text-blue-900 mb-4">
              Деталі замовлення:
            </h2>
            <div className="flex justify-end">
              <p className="text-xl font-bold text-blue-900">
                Загальна вартість:{" "}
                <span className="text-blue-500">
                  {convertToLocale({
                    amount: totalPrice,
                    currency_code: cart.currency_code,
                  })}
                </span>
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {cartItems?.length ? (
              cartItems
                .sort((a, b) =>
                  (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                )
                .map((item, index) => (
                  <li
                    key={item.id}
                    className="flex gap-3 justify-between border border-gray-300 rounded-xl py-3 px-2 bg-white w-[400px]"
                  >
                    <div className="flex gap-3">
                      <Image
                        src={item.thumbnail || ""}
                        alt={item.title || ""}
                        width={75}
                        height={75}
                        className="mb-[-1px] mr-[-1px]"
                      />
                      <div className="flex flex-col gap-[8px] justify-between w-[150px]">
                        <h3 className="font-bold text-blue-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.variant?.title}</p>
                        <p className="font-bold text-blue-500">
                          {convertToLocale({
                            amount: item.unit_price || 0,
                            currency_code: cart.currency_code,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 self-end justify-end ml-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuantityChange(item.id, item.quantity - 1)
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-500 bg-white hover:bg-gray-100 transition"
                        >
                          <span className="text-xl leading-none text-blue-500">
                            −
                          </span>
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }}
                          className="w-12 h-8 text-center border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuantityChange(item.id, item.quantity + 1)
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-500 bg-white hover:bg-gray-100 transition"
                        >
                          <span className="text-xl leading-none text-blue-500">
                            +
                          </span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))
            ) : (
              <div>No items in cart</div>
            )}
          </ul>
        </div>

        {/* Customer Details */}
        <div className="mb-10">
          <Heading className="text-xl text-blue-900 mb-6">
            Контактні дані
          </Heading>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 font-medium text-blue-900"
              >
                Ім'я та прізвище*
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть ваше ім'я та прізвище"
                className={`w-full border ${
                  nameError ? "border-red-500" : "border-gray-300"
                } rounded-xl p-3 outline-none`}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-blue-900"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введіть вашу електронну адресу"
                className={`w-full border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded-xl p-3 outline-none`}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 font-medium text-blue-900"
              >
                Телефон*
              </label>
              <div className="flex">
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-2 border border-gray-300 rounded-l-xl px-3 py-3 bg-white"
                    onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                  >
                    <span>{selectedCountry.code}</span>
                    <Image
                      src="/header/arrow.svg"
                      alt="arrow"
                      width={10}
                      height={10}
                      className={`transition-transform ${
                        countryMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {countryMenuOpen && (
                    <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-xl shadow-lg">
                      <ul>
                        {countries.map((country) => (
                          <li
                            key={country.code}
                            className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                              selectedCountry.code === country.code
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() => handleCountryChange(country)}
                          >
                            {country.name} ({country.phoneCode})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`flex-1 border-y border-r ${
                    phoneError ? "border-red-500" : "border-gray-300"
                  } rounded-r-xl p-3 outline-none`}
                />
              </div>
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="country"
                className="block mb-2 font-medium text-blue-900"
              >
                Країна доставки*
              </label>
              <div className="relative">
                <select
                  id="country"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = countries.find(
                      (c) => c.code === e.target.value
                    )
                    if (country) handleCountryChange(country)
                  }}
                  className="w-full appearance-none border border-gray-300 rounded-xl p-3 pr-8 outline-none bg-white"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <Image
                    src="/header/arrow.svg"
                    alt="arrow"
                    width={10}
                    height={10}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="mb-2 font-medium text-blue-900">
              Messenger для зв'язку
            </p>
            <div className="flex flex-wrap gap-2">
              {["Telegram", "Viber", "WhatsApp"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() =>
                    setMessenger(m as "Telegram" | "Viber" | "WhatsApp")
                  }
                  className={`px-4 py-2 rounded-full border ${
                    messenger === m
                      ? "bg-blue-100 border-blue-500 text-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <label
              htmlFor="comment"
              className="block mb-2 font-medium text-blue-900"
            >
              Коментар до замовлення
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введіть додаткові побажання або запитання..."
              className="w-full border border-gray-300 rounded-xl p-3 outline-none min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div
          className={`mt-6 flex items-start gap-2 mb-10 ${
            termsError ? "animate-shake" : ""
          }`}
        >
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={() => {
              setTermsAccepted(!termsAccepted)
              if (termsError) setTermsError(false)
            }}
            className={`h-4 w-4 rounded text-main-blue focus:ring-main-blue ${
              termsError ? "ring-2 ring-red-500 " : ""
            }`}
          />
          <label
            htmlFor="terms"
            className="transform-none translate-x-0 translate-y-0"
          >
            <p
              className={`text-sm ${
                termsError ? "text-red-500" : "text-neutral-600"
              }`}
            >
              Я погоджуюсь з умовами обробки персональних даних та політикою
              конфіденційності
            </p>
          </label>
        </div>

        <div className="mt-8 flex gap-[24px] justify-end">
          <LocalizedClientLink href="/">
            <SecondaryButton
              text="Назад"
              styles="px-[54px] py-[16px] text-[18px]"
            />
          </LocalizedClientLink>
          <PrimaryButton
            text={loading ? "Відправка..." : "Підтвердити замовлення"}
            onClick={handleSubmit}
            disabled={loading}
            styles={
              loading
                ? "opacity-70 cursor-not-allowed"
                : "px-[54px] py-[16px] text-[18px]"
            }
          />
        </div>
      </div>
    </div>
  )
}

export default CartTemplate
