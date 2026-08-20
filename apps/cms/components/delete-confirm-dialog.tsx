"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"

export interface DeleteConfirmDialogProps {
  onConfirm: () => Promise<void>
  itemName?: string
}

export function DeleteButton({ onConfirm, itemName = "item ini" }: DeleteConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await onConfirm()
      setIsOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
        title="Hapus"
      >
        <Trash2 className="size-3.5" />
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 p-1 text-xs">
      <span className="text-[11px] text-destructive px-1">Yakin hapus?</span>
      <button
        type="button"
        disabled={isDeleting}
        onClick={handleDelete}
        className="rounded bg-destructive px-2 py-0.5 text-[11px] font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="size-3 animate-spin" /> : "Ya"}
      </button>
      <button
        type="button"
        disabled={isDeleting}
        onClick={() => setIsOpen(false)}
        className="rounded border border-border bg-card px-2 py-0.5 text-[11px] text-foreground hover:bg-muted"
      >
        Batal
      </button>
    </div>
  )
}
