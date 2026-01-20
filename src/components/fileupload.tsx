"use client"

import {
  createContext,
  useContext,
  useState,
  useRef,
  type DragEvent,
  type ChangeEvent,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

type FileUploadContextValue = {
  file: File | null
  preview: string | null
  isDragging: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  handleFile: (file: File | null) => void
  clear: () => void
  openFilePicker: () => void
  setIsDragging: (v: boolean) => void
}

const FileUploadContext = createContext<FileUploadContextValue | null>(null)

function useFileUpload() {
  const ctx = useContext(FileUploadContext)
  if (!ctx) throw new Error("useFileUpload must be used within FileUpload")
  return ctx
}

// Root
interface FileUploadProps {
  children: ReactNode
  accept?: string
  onChange?: (file: File | null) => void
  className?: string
}

function FileUpload({ children, accept = "*", onChange, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
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

  const openFilePicker = () => inputRef.current?.click()

  return (
    <FileUploadContext.Provider
      value={{ file, preview, isDragging, inputRef, handleFile, clear, openFilePicker, setIsDragging }}
    >
      <div className={className}>
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
    </FileUploadContext.Provider>
  )
}

// Dropzone
interface FileUploadDropzoneProps {
  children: ReactNode
  className?: string
}

function FileUploadDropzone({ children, className }: FileUploadDropzoneProps) {
  const { handleFile, openFilePicker, isDragging, setIsDragging } = useFileUpload()

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  return (
    <div
      onClick={openFilePicker}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      className={cn(
        "relative flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        className
      )}
    >
      {children}
    </div>
  )
}

// Content (shown when no file)
function FileUploadContent({ children, className }: { children: ReactNode; className?: string }) {
  const { file } = useFileUpload()
  if (file) return null
  return <div className={cn("text-center", className)}>{children}</div>
}

// Preview (shown when file exists)
function FileUploadPreview({ className }: { className?: string }) {
  const { file, preview, clear } = useFileUpload()
  if (!file) return null

  return (
    <div className={cn("relative", className)}>
      {preview ? (
        <img src={preview} alt="Preview" className="max-h-40 rounded-md object-contain" />
      ) : (
        <span className="text-sm text-muted-foreground">{file.name}</span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); clear() }}
        className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground"
      >
        ✕
      </button>
    </div>
  )
}

// Clear button standalone
function FileUploadClear({ children, className }: { children?: ReactNode; className?: string }) {
  const { file, clear } = useFileUpload()
  if (!file) return null
  return (
    <button onClick={(e) => { e.stopPropagation(); clear() }} className={className}>
      {children ?? "Remove"}
    </button>
  )
}

export {
  FileUpload,
  FileUploadDropzone,
  FileUploadContent,
  FileUploadPreview,
  FileUploadClear,
  useFileUpload,
}
