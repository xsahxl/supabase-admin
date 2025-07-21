"use client"
import { useState } from 'react'

type Certificate = {
  url: string
  name: string
  type: string
}

const CertificateManager = () => {
  const [certs, setCerts] = useState<Certificate[]>([])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newCerts: Certificate[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // 这里只做本地预览，实际应上传到 Supabase Storage 并获取 url
      const url = URL.createObjectURL(file)
      newCerts.push({ url, name: file.name, type: file.type })
    }
    setCerts((prev) => [...prev, ...newCerts])
  }

  const handleDelete = (idx: number) => {
    setCerts((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={handleUpload}
        className="mb-4"
        aria-label="上传证件"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {certs.map((cert, idx) => (
          <div key={idx} className="border rounded p-2 flex flex-col items-center">
            {cert.type.startsWith('image') ? (
              <img src={cert.url} alt={cert.name} className="w-32 h-32 object-contain mb-2" />
            ) : (
              <span className="text-gray-500 mb-2">PDF: {cert.name}</span>
            )}
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleDelete(idx)}
              tabIndex={0}
              aria-label="删除证件"
              onKeyDown={e => e.key === 'Enter' && handleDelete(idx)}
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CertificateManager 