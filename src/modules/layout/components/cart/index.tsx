"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { convertToLocale } from "@lib/util/money"
import DeleteButton from "@modules/common/components/delete-button"
import { updateLineItem } from "@lib/data/cart"
import { useTranslations } from "@/lib/localization"
import { PrimaryButton, SecondaryButton } from "../buttons"

export default function Cart({ cart }: { cart: HttpTypes.StoreCart | null }) {
  const [menu, setMenu] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const t = useTranslations().header.cart
  const [cartItems, setCartItems] = useState(cart?.items || [])

  const totalPrice =
    cartItems?.reduce(
      (total, item) => total + (item.unit_price || 0) * (item.quantity || 0),
      0
    ) || 0

  useEffect(() => {
    if (cart?.items) {
      setCartItems(cart.items)
    }
  }, [cart])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cart?.subtotal ?? 0

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity < 1 || !cart?.id) return
    setUpdating(itemId)

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
    try {
      await updateLineItem({
        lineId: itemId,
        quantity,
      })
      router.refresh()
    } catch (error) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity } : item
        )
      )
      console.error("Error updating quantity:", error)
    } finally {
      setUpdating(null)
    }
  }

  const handleCheckout = () => {
    router.push("/cart")
    setMenu(false)
  }

  return (
    <div className="relative" ref={cartRef}>
      <div
        className="bg-white h-10 text-lg max-lg:px-3 lg:aspect-square rounded-xl border border-main-blue lg:border-neutral-300 flex items-center justify-center gap-10 cursor-pointer"
        onClick={() => setMenu((prev) => !prev)}
      >
        🛒
      </div>

      {menu && (
        <div className="absolute mt-2 right-0 w-max flex flex-col rounded-2xl border border-neutral-300 shadow-2xl transition-all duration-250 ease-in-out z-10">
          <h2 className="bg-lighter-blue font-bold text-dark-blue rounded-t-2xl p-4 w-full text-center text-xl">
            {t.header} ({totalItems})
          </h2>
          <ul className="bg-white px-6 py-4 w-full flex flex-col gap-3">
            {cartItems && cartItems.length > 0 ? (
              cartItems
                .sort((a, b) =>
                  (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                )
                .map((item, index) => (
                  <li
                    key={item.id}
                    className="flex gap-3 justify-between border border-neutral-300 rounded-xl py-3 px-2"
                  >
                    <div className="flex gap-3">
                      <LocalizedClientLink
                        href={`/products/${item.product_handle}`}
                      >
                        <Thumbnail
                          thumbnail={item.thumbnail}
                          images={item.variant?.product?.images}
                          size="square"
                          className="w-[75px] h-[75px]"
                        />
                      </LocalizedClientLink>
                      <div className="flex flex-col justify-between">
                        <h3 className="font-bold text-dark-blue">
                          {item.title}
                        </h3>
                        <p className="text-neutral-600">
                          {item.variant?.title || "N/A"}
                        </p>
                        <p className="font-bold text-main-blue">
                          {convertToLocale({
                            amount: item.unit_price || 0,
                            currency_code: cart?.currency_code || "ua",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-between">
                      <DeleteButton
                        id={item.id}
                        className="inline-flex self-end items-center justify-center border border-neutral-300 rounded-full w-6 h-6 hover:bg-neutral-100 transition"
                        onSuccess={() => router.refresh()}
                      ></DeleteButton>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={updating === item.id}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-main-blue bg-white hover:bg-neutral-100 transition disabled:opacity-50"
                        >
                          <span className="text-xl leading-none text-main-blue">
                            −
                          </span>
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-12 h-8 text-center border border-main-blue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-main-blue"
                          disabled={updating === item.id}
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={updating === item.id}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-main-blue bg-white hover:bg-neutral-100 transition disabled:opacity-50"
                        >
                          <span className="text-xl leading-none text-main-blue">
                            +
                          </span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))
            ) : (
              <p>{t.empty}</p>
            )}
          </ul>
          {cart?.items && cart?.items?.length > 0 && (
            <>
              <hr className="border-neutral-300" />
              <div className="bg-white px-6 py-4 w-full rounded-b-2xl flex flex-col gap-3 text-md">
                <div className="flex justify-between">
                  <p className="text-neutral-600">{t.total}:</p>
                  <span className="font-bold text-dark-blue text-2xl">
                    {convertToLocale({
                      amount: totalPrice,
                      currency_code: cart.currency_code,
                    })}
                  </span>
                </div>
                <div className="flex justify-between gap-5">
                  <SecondaryButton
                    text={t.watch}
                    styles="flex-1 rounded-full"
                    onClick={() => {
                      router.push("/cart")
                      setMenu(false)
                    }}
                  />
                  <PrimaryButton
                    text={t.continue}
                    styles="flex-1 rounded-full"
                    onClick={handleCheckout}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
