import React, { useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

type Props = {
  onFileChange?: (file: File) => void
}

export default function InputFile({ onFileChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal) {
      if (fileFromLocal.size >= config.maxSizeUploadAvatar) {
        toast.error('file size is too large')
      } else if (!fileFromLocal.type.includes('image')) {
        toast.error('file format is incorrect')
      } else {
        onFileChange?.(fileFromLocal)
      }
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={handleChangeFile}
        onClick={() => {
          // fix bug onChange on the same file
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }}
      />

      <button
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        type='button'
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </>
  )
}
