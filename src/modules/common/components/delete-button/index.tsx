import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  onSuccess,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  onSuccess?: () => void
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch((err) => {
      setIsDeleting(false)
      onSuccess?.()
    })
  }

  return (
    <div
      onClick={() => handleDelete(id)}
      className={clx(
        "flex items-center justify-between text-small-regular cursor-pointer",
        className
      )}
    >
      <button className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base items-center justify-center ">
        {isDeleting ? (
          <Spinner className="animate-spin" />
        ) : (
          <span className="text-[#E0E0E0]">×</span>
        )}
        {children}
      </button>
    </div>
  )
}

export default DeleteButton
