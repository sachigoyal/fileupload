"use client"

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadContent,
  FileUploadPreview,
} from "@/components/fileupload"

export default function Home() {
  return (
    <div className="p-8">
      <FileUpload accept="image/*" onChange={(f) => console.log(f)}>
        <FileUploadDropzone>
          <FileUploadPreview />
          <FileUploadContent>
            <p className="text-sm text-muted-foreground">
              Drop file here or <span className="text-primary underline">browse</span>
            </p>
          </FileUploadContent>
        </FileUploadDropzone>
      </FileUpload>
    </div>
  )
}
