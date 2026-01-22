"use client"

import { FileUpload, FileUploadContent } from "@/components/fileupload"
import Installation from "@/components/installation"
import ModeToggle from "@/components/theme/toggler"
import { siteConfig } from "@/lib/config"
import { Github } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="top-2 right-4 gap-2 absolute flex items-center">
        <a
          href={siteConfig.socials.github}
          target="_blank"
        >
          <Github className="size-4" />
        </a>
        <ModeToggle />
      </header>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">{siteConfig.name}</h1>
          <p className="text-muted-foreground">{siteConfig.description}</p>
        </div>
        <FileUpload onChange={(f) => console.log(f)} className="w-full max-w-md  mt-10">
          <FileUploadContent />
        </FileUpload>
        <div className="w-full max-w-md mt-10 flex flex-col gap-3">
          <h2 className="text-sm font-medium">Installation</h2>
          <Installation />
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Built by{" "}
        <Link href={siteConfig.creator.url} target="_blank" className="hover:underline">
          {siteConfig.creator.name}
        </Link>
      </footer>
    </main>
  )
}
