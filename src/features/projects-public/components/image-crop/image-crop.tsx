"use client"
import { ImageCrop, ImageCropApply, ImageCropContent, ImageCropReset } from "@/components/ui/image-crop"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { type ChangeEvent, useState } from "react"
import { Trash2 } from "lucide-react"

const ImageCropComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCroppedImage(null)
    }
  }
  const handleReset = () => {
    setSelectedFile(null)
    setCroppedImage(null)
  }
  if (!selectedFile) {
    return <Input accept="image/*" className="w-fit" onChange={handleFileChange} type="file" />
  }
  if (croppedImage) {
    return (
      <div className="space-y-4">
        <Image alt="Cropped" height={75} src={croppedImage} unoptimized width={75} />
        <Button isIconOnly variant="light" color="danger" onClick={handleReset}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={1}
        file={selectedFile}
        maxImageSize={1024 * 1024} // 1MB
        onChange={console.log}
        onComplete={console.log}
        onCrop={setCroppedImage}
      >
        <ImageCropContent className="max-w-md" />
        <div className="flex items-center gap-2">
          <ImageCropApply asChild>
            <Button size="sm">Aplicar</Button>
          </ImageCropApply>
          <ImageCropReset asChild>
            <Button size="sm">Restablecer</Button>
          </ImageCropReset>
          <Button onClick={handleReset} size="sm" type="button">
            Cancelar
          </Button>
        </div>
      </ImageCrop>
    </div>
  )
}

export default ImageCropComponent
