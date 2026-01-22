"use client"

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type DragEvent,
  type ChangeEvent,
  type ReactNode,
  type HTMLAttributes,
} from "react"
import { Upload, X, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadContextValue {
  file: File | null
  preview: string | null
  isDragging: boolean
  clear: () => void
  openLightbox: () => void
}

const FileUploadContext = createContext<FileUploadContextValue | null>(null)

interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  accept?: string
  onChange?: (file: File | null) => void
}

function FileUpload({ accept = "*", onChange, className, children, ...props }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File | null) => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview)
    setFile(f)
    onChange?.(f)
    if (!f) return setPreview(null)
    if (f.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(f)
    } else if (f.type === "application/pdf") {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }

  const clear = () => {
    handleFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <FileUploadContext.Provider
      value={{ file, preview, isDragging, clear, openLightbox: () => setLightbox(true) }}
    >
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e: DragEvent) => {
          e.preventDefault()
          setIsDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        onDragOver={(e: DragEvent) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "relative flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragging ? "border-blue-500 bg-blue-500/10" : "border-muted-foreground/25 hover:border-primary/50",
          className
        )}
        {...props}
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
        {children}
      </div>

      {lightbox && preview && (
        <Lightbox src={preview} isPdf={file?.type === "application/pdf"} onClose={() => setLightbox(false)} />
      )}
    </FileUploadContext.Provider>
  )
}

function FileUploadContent({ children }: { children?: ReactNode }) {
  const ctx = useContext(FileUploadContext)
  if (!ctx) throw new Error("FileUploadContent must be used within FileUpload")

  const { file, preview, clear, openLightbox } = ctx

  if (!file) {
    return (
      children ?? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="size-8" />
          <span className="text-sm">Click or drag file to upload</span>
        </div>
      )
    )
  }

  const isImage = file.type.startsWith("image/")
  const isPdf = file.type === "application/pdf"

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {isImage && preview ? (
        <img
          src={preview}
          alt="Preview"
          className="max-h-40 cursor-zoom-in rounded-md object-contain"
          onClick={openLightbox}
        />
      ) : isPdf && preview ? (
        <div className="relative h-40 w-64 cursor-zoom-in" onClick={openLightbox}>
          <iframe src={preview} title="PDF Preview" className="pointer-events-none h-full w-full rounded-md border" />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileIcon className="size-4" />
          <span>{file.name}</span>
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          clear()
        }}
        className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}

function Lightbox({ src, isPdf, onClose }: { src: string; isPdf?: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      {isPdf ? (
        <iframe
          src={src}
          title="PDF Preview"
          className="h-[90vh] w-[90vw] rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <img src={src} alt="Full preview" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
      )}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
    </div>
  )
}

export { FileUpload, FileUploadContent }
