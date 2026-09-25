"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  UploadCloud,
  Check,
  Copy,
  Loader2,
  FolderOpen,
  X,
  FileCheck,
} from "lucide-react"
import { uploadMediaAsset } from "@/lib/actions/media-browser-actions"
import { type MediaFolder, MEDIA_FOLDERS } from "@/lib/media-types"

interface MediaUploadZoneProps {
  currentFolder: MediaFolder
  onUploadComplete?: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function MediaUploadZone({
  currentFolder,
  onUploadComplete,
}: MediaUploadZoneProps) {
  const [targetFolder, setTargetFolder] = useState<string>(
    currentFolder === "all" ? "general" : currentFolder
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelected(file: File) {
    setErrorMsg(null)
    setUploadedUrl(null)
    setSelectedFile(file)

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0])
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleClear() {
    setSelectedFile(null)
    setFilePreview(null)
    setErrorMsg(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleUpload() {
    if (!selectedFile) return

    setIsUploading(true)
    setErrorMsg(null)
    setUploadedUrl(null)

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("folder", targetFolder)

    try {
      const res = await uploadMediaAsset(formData)
      if (res.error) {
        setErrorMsg(res.error)
      } else if (res.url) {
        setUploadedUrl(res.url)
        handleClear()
        if (onUploadComplete) onUploadComplete()
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal mengunggah berkas ke penyimpanan."
      )
    } finally {
      setIsUploading(false)
    }
  }

  function handleCopy() {
    if (!uploadedUrl) return
    navigator.clipboard.writeText(uploadedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Unggah Berkas Baru
          </h3>
          <p className="text-xs text-muted-foreground">
            Tarik dan lepas gambar atau dokumen ke area berikut, atau pilih secara manual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Folder Target:</span>
          <select
            value={targetFolder}
            onChange={(e) => setTargetFolder(e.target.value)}
            className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none"
          >
            {MEDIA_FOLDERS.map((fld) => (
              <option key={fld} value={fld}>
                {fld}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          {errorMsg}
        </div>
      )}

      {uploadedUrl && (
        <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            <span>Berkas Berhasil Diunggah ke Supabase CDN!</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-2">
            <span className="truncate font-mono text-[11px] text-foreground">
              {uploadedUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin CDN URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-border/80 hover:bg-muted/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelected(e.target.files[0])
            }
          }}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">
                Tarik berkas ke sini, atau{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline font-semibold"
                >
                  telusuri dari komputer
                </button>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Mendukung format PNG, JPG, WEBP, GIF, SVG, AVIF, dan PDF (Maks. 50 MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 shadow-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              {filePreview ? (
                <Image
                  src={filePreview}
                  alt="Preview"
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 rounded-lg object-cover border border-border shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                  <FileCheck className="h-6 w-6" />
                </div>
              )}
              <div className="overflow-hidden space-y-0.5">
                <p className="truncate text-xs font-semibold text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • Folder: {targetFolder}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClear}
                disabled={isUploading}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Unggah</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
