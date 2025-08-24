import { ChangeEvent, useRef } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadButtonProps {
  onFileUpload: (file: File) => void
  disabled?: boolean
}

const FileUploadButton = ({ onFileUpload, disabled }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        Dosya Yükle
      </label>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto"
      >
        <Upload className="w-4 h-4" />
        <span>Belge Yükle</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default FileUploadButton 