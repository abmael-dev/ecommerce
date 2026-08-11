import React, { useState, useRef } from 'react'
import { Upload, X, AlertTriangle } from 'lucide-react'

interface ImageUploaderProps {
  onImagesSelected?: (files: File[], previews: string[]) => void
  maxFiles?: number
  maxSizeMB?: number
  label?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesSelected,
  maxFiles = 5,
  maxSizeMB = 5,
  label = 'Upload de Imagens',
}) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    setError(null)

    const validFiles: File[] = []
    const newPreviews: string[] = []

    if (files.length + previews.length > maxFiles) {
      setError(`Você pode enviar no máximo ${maxFiles} imagens.`)
      return
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!allowedTypes.includes(file.type)) {
        setError(`Formato de imagem não suportado: ${file.name}. Use JPG, PNG ou WEBP.`)
        return
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`A imagem ${file.name} excede o tamanho máximo de ${maxSizeMB}MB.`)
        return
      }

      validFiles.push(file)
      newPreviews.push(URL.createObjectURL(file))
    }

    const updatedPreviews = [...previews, ...newPreviews]
    setPreviews(updatedPreviews)
    if (onImagesSelected) {
      onImagesSelected(validFiles, updatedPreviews)
    }
  }

  const removeImage = (index: number) => {
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {label && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </span>
      )}

      {/* Drag and Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Clique ou arraste imagens aqui
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Formate JPG, PNG ou WEBP até {maxSizeMB}MB (Máx. {maxFiles} arquivos)
        </p>
      </div>

      {/* Client Non-Trust Disclaimer */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          A validação acima é prévia para pré-visualização. A validação e sanitização final dos arquivos ocorrem obrigatoriamente no servidor.
        </span>
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(idx)
                }}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
