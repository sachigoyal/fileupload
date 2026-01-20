"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload, X, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept?: string
  onChange?: (file: File | null) => void
  className?: string
  children?: React.ReactNode
}

function FileUpload({ accept = "*", onChange, className, children }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File | null) => {
    setFile(f)
    onChange?.(f)

    if (f?.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  const clear = () => {
    handleFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "relative flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          className
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
          className="hidden"
        />

        {file ? (
          <FilePreview
            file={file}
            preview={preview}
            onClear={clear}
            onImageClick={() => setLightbox(true)}
          />
        ) : (
          children ?? <DefaultPlaceholder />
        )}
      </div>

      {lightbox && preview && (
        <Lightbox src={preview} onClose={() => setLightbox(false)} />
      )}
    </>
  )
}

function FilePreview({
  file,
  preview,
  onClear,
  onImageClick,
}: {
  file: File
  preview: string | null
  onClear: () => void
  onImageClick: () => void
}) {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="max-h-40 cursor-zoom-in rounded-md object-contain"
          onClick={onImageClick}
        />
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileIcon className="size-4" />
          <span>{file.name}</span>
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClear()
        }}
        className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}

function DefaultPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <Upload className="size-8" />
      <span className="text-sm">Click or drag file to upload</span>
    </div>
  )
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <img
        src={src}
        alt="Full preview"
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
      />
      <button
        onClick={onClose}
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
    </div>
  )
}

export { FileUpload }
