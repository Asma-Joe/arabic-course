"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileUp, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // в мегабайтах
  maxFiles?: number
  label?: string
  buttonText?: string
  allowedExtensions?: string[]
}

export default function SecureFileUpload({
  onFileSelect,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 5, // 5 МБ по умолчанию
  maxFiles = 1,
  label = "Перетащите файл сюда или нажмите для выбора",
  buttonText = "Выбрать файл",
  allowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
}: SecureFileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateFile = (file: File): boolean => {
    // Проверка размера файла
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: `Файл слишком большой. Максимальный размер: ${maxSize} МБ`,
        variant: "destructive",
      })
      return false
    }

    // Проверка расширения файла
    const fileName = file.name.toLowerCase()
    const isValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext))
    if (!isValidExtension) {
      toast({
        title: "Ошибка",
        description: `Недопустимый тип файла. Разрешены только: ${allowedExtensions.join(", ")}`,
        variant: "destructive",
      })
      return false
    }

    // Проверка MIME-типа
    const validMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ]
    if (!validMimeTypes.includes(file.type)) {
      toast({
        title: "Ошибка",
        description: "Недопустимый тип файла",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)

      // Проверка количества файлов
      if (files.length > maxFiles) {
        toast({
          title: "Ошибка",
          description: `Вы можете загрузить не более ${maxFiles} файлов`,
          variant: "destructive",
        })
        return
      }

      // Проверка каждого файла
      const validFiles = files.filter(validateFile)

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles)
        onFileSelect(validFiles[0]) // Передаем первый файл, если нужен только один
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)

      // Проверка количества файлов
      if (files.length > maxFiles) {
        toast({
          title: "Ошибка",
          description: `Вы можете загрузить не более ${maxFiles} файлов`,
          variant: "destructive",
        })
        return
      }

      // Проверка каждого файла
      const validFiles = files.filter(validateFile)

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles)
        onFileSelect(validFiles[0]) // Передаем первый файл, если нужен только один
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)

    if (newFiles.length > 0) {
      onFileSelect(newFiles[0])
    } else {
      // Если файлов не осталось, сбрасываем input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div
      className="border-2 border-dashed border-[#e9e2dc] rounded-lg p-6 text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {selectedFiles.length > 0 ? (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-[#f8f5f2] p-3 rounded-md">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-[#8a6552] rounded-md flex items-center justify-center text-white mr-3">
                  <FileUp className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#4a4a4a]">{file.name}</p>
                  <p className="text-xs text-[#6b6b6b]">
                    {file.size < 1024 * 1024
                      ? `${(file.size / 1024).toFixed(2)} KB`
                      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFile(index)}
                className="text-[#6b6b6b] hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <FileUp className="h-8 w-8 text-[#8a6552] mx-auto mb-2" />
          <p className="text-sm text-[#6b6b6b] mb-4">{label}</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            multiple={maxFiles > 1}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-[#8a6552] text-[#8a6552] hover:bg-[#8a6552] hover:text-white"
          >
            {buttonText}
          </Button>
        </>
      )}
    </div>
  )
}
