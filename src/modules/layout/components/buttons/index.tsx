export function PrimaryButton({
  text,
  styles,
  onClick,
}: {
  text: string
  styles?: string
  onClick?: () => void
}) {
  return (
    <button
      className={`bg-main-blue text-white rounded-xl px-6 py-3 cursor-pointer ${styles}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export function SecondaryButton({
  text,
  styles,
  onClick,
}: {
  text: string
  styles?: string
  onClick?: () => void
}) {
  return (
    <button
      className={`border border-main-blue text-main-blue rounded-xl px-6 py-3 cursor-pointer ${styles}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export function Input({
  type = "text",
  placeholder,
  styles,
}: {
  type: string
  placeholder: string
  styles?: string
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`border border-neutral-300 rounded-xl p-3 outline-none ${styles}`}
    />
  )
}
