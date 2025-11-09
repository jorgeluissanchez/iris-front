"use client"
import { ImageCrop, ImageCropApply, ImageCropContent, ImageCropReset } from "@/components/ui/shadcn-io/image-crop"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { type ChangeEvent, useState } from "react"
import { Trash2 } from "lucide-react"

type LogoUploadProps = {
  value: string | null
  onChange: (croppedImage: string | null) => void
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onChange(null)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    onChange(null)
  }

  const handleCrop = (croppedImageUrl: string) => {
    onChange(croppedImageUrl)
  }

  if (!selectedFile && !value) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Logo del Proyecto <span className="text-default-400"></span>
          <span className="text-danger">*</span>
        </label>
        <input
          accept="image/*"
          className="block w-full text-sm text-default-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
          onChange={handleFileChange}
          type="file"
        />
        <p className="text-xs text-default-400">Suba una imagen cuadrada para el logo de su proyecto</p>
      </div>
    )
  }

  if (value) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Logo del Proyecto</label>
        <div className="flex items-center gap-4">
          <Image
            alt="Logo del proyecto"
            height={100}
            src={value || "/placeholder.svg"}
            unoptimized
            width={100}
            className="rounded-lg border-2 border-default-200"
          />
          <Button isIconOnly variant="light" color="danger" onPress={handleReset} size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedFile && (
        <ImageCrop
          aspect={1}
          file={selectedFile}
          maxImageSize={1024 * 1024} // 1MB
          onChange={console.log}
          onComplete={console.log}
          onCrop={handleCrop}
        >
          <ImageCropContent className="max-w-md" />
          <div className="flex items-center gap-2 mt-4">
            <ImageCropApply asChild>
              <Button size="sm" color="primary">
                Aplicar
              </Button>
            </ImageCropApply>
            <ImageCropReset asChild>
              <Button size="sm" variant="bordered">
                Restablecer
              </Button>
            </ImageCropReset>
            <Button onPress={handleReset} size="sm" variant="light">
              Cancelar
            </Button>
          </div>
        </ImageCrop>
      )}
    </div>
  )
}
