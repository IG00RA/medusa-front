import { HttpTypes } from "@medusajs/types"

interface QuantityControlsProps {
  item: HttpTypes.StoreCartLineItem
  onQuantityChange: (itemId: string, value: number) => void
  currencyCode: string
}

export default function QuantityControls({
  item,
  onQuantityChange,
  currencyCode,
}: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-1 mt-1 self-end justify-end ml-auto">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onQuantityChange(item.id, item.quantity - 1)
        }}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-500 bg-white hover:bg-gray-100 transition"
      >
        <span className="text-xl leading-none text-blue-500">−</span>
      </button>
      <input
        type="number"
        min={1}
        value={item.quantity}
        onChange={(e) => {
          e.stopPropagation()
          onQuantityChange(item.id, parseInt(e.target.value) || 1)
        }}
        className="w-12 h-8 text-center border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-500"
      />
      <button
        onClick={(e) => {
          e.stopPropagation()
          onQuantityChange(item.id, item.quantity + 1)
        }}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-500 bg-white hover:bg-gray-100 transition"
      >
        <span className="text-xl leading-none text-blue-500">+</span>
      </button>
    </div>
  )
}
