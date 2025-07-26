'use client'
import { Button } from "@/components/ui/button"
import { useState } from "react"

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")

  const handleCreateTable = async () => {
    setLoading(true)
    setResult("")

    try {
      const response = await fetch('/api/news/create-table-public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ ${data.message}`)
      } else {
        setResult(`❌ ${data.error}: ${data.message}`)
      }
    } catch (error) {
      setResult(`❌ 请求失败: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">News表管理</h1>

      <Button
        onClick={handleCreateTable}
        disabled={loading}
        className="w-full max-w-md"
      >
        {loading ? "处理中..." : "测试创建news表"}
      </Button>

      {result && (
        <div className={`p-4 rounded-md ${result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {result}
        </div>
      )}
    </div>
  )
}

export default Page