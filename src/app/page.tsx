"use client"

import {
  FileUpload,
} from "@/components/fileupload"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 py-16 px-4 w-full relative">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">File Upload</h1>
        <p className="text-muted-foreground">A simple file upload component for React.</p>
      </div>
      <div className="flex flex-col items-center gap-2">
      <FileUpload accept="image/*" onChange={(f) => console.log(f)} className="">
        <p className="text-sm text-muted-foreground">
          Drop file here or <span className="text-primary underline">browse</span>
        </p>
      </FileUpload>
      </div>
    </div>
  )
}
