# FileUpload

A composable React file upload component with drag & drop, image/PDF preview, and lightbox.

## Features

- 🎯 Drag & drop or click to upload
- 🖼️ Image preview with lightbox
- 📄 PDF preview with inline viewer
- ⌨️ ESC to close lightbox
- 🎨 Tailwind CSS styling
- ⚛️ React 19 + Next.js 16

## Installation

```bash
bun install
```

## Usage

```tsx
import { FileUpload, FileUploadContent } from "@/components/fileupload"

function Demo() {
  return (
    <FileUpload accept="image/*,application/pdf" onChange={(file) => console.log(file)}>
      <FileUploadContent />
    </FileUpload>
  )
}
```

### Props

#### `FileUpload`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accept` | `string` | `"*"` | File types to accept |
| `onChange` | `(file: File \| null) => void` | - | Callback when file changes |
| `className` | `string` | - | Additional CSS classes |

#### `FileUploadContent`

Renders the upload prompt or file preview. Accepts optional children for custom empty state.

## Development

```bash
bun dev
```

## License

MIT
