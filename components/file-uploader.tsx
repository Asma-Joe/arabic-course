"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileUp, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // в мегабайтах
  label?: string
  buttonText?: string
}

export function FileUploader({
  onFileSelect,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 10, // 10 МБ по умолчанию
  label = "Перетащите файл сюда или нажмите для выбора",
  buttonText = "Выбрать файл",
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Проверка размера файла
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Ошибка",
          description: `Файл слишком большой. Максимальный размер: ${maxSize} МБ`,
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className="border-2 border-dashed border-[#e9e2dc] rounded-lg p-6 text-center">
      {selectedFile ? (
        <div className="flex items-center justify-between bg-[#f8f5f2] p-3 rounded-md">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-[#8a6552] rounded-md flex items-center justify-center text-white mr-3">
              <FileUp className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-[#4a4a4a]">{selectedFile.name}</p>
              <p className="text-xs text-[#6b6b6b]">
                {selectedFile.size < 1024 * 1024
                  ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                  : `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            className="text-[#6b6b6b] hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <>
          <FileUp className="h-8 w-8 text-[#8a6552] mx-auto mb-2" />
          <p className="text-sm text-[#6b6b6b] mb-4">{label}</p>
          <input type="file" id="file-upload" className="hidden" accept={accept} onChange={handleFileChange} />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
            className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
          >
            {buttonText}
          </Button>
        </>
      )}
    </div>
  )
}
