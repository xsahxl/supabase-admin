"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'

const baseInfoSchema = z.object({
  name: z.string().min(1, '企业名称必填'),
  creditCode: z.string().min(1, '统一社会信用代码必填'),
  address: z.string().min(1, '注册地址必填'),
  legalPerson: z.string().min(1, '法人代表必填'),
  foundedAt: z.string().min(1, '成立日期必填'),
  capital: z.string().min(1, '注册资本必填'),
})

type BaseInfoType = z.infer<typeof baseInfoSchema>

const BaseInfoForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<BaseInfoType>({
    resolver: zodResolver(baseInfoSchema),
    defaultValues: {
      name: '',
      creditCode: '',
      address: '',
      legalPerson: '',
      foundedAt: '',
      capital: '',
    },
    mode: 'onChange',
  })

  // 自动保存草稿
  useEffect(() => {
    const subscription = watch((data) => {
      // 这里可以调用API保存草稿
      // saveDraft(data)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit = async (data: BaseInfoType) => {
    // 这里调用API保存
    // await saveCompanyInfo(data)
    alert('保存成功')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('name')}
          placeholder="企业名称"
          className="w-full border rounded px-3 py-2"
          aria-label="企业名称"
        />
        {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
      </div>
      <div>
        <input
          {...register('creditCode')}
          placeholder="统一社会信用代码"
          className="w-full border rounded px-3 py-2"
          aria-label="统一社会信用代码"
        />
        {errors.creditCode && <div className="text-red-500 text-sm">{errors.creditCode.message}</div>}
      </div>
      <div>
        <input
          {...register('address')}
          placeholder="注册地址"
          className="w-full border rounded px-3 py-2"
          aria-label="注册地址"
        />
        {errors.address && <div className="text-red-500 text-sm">{errors.address.message}</div>}
      </div>
      <div>
        <input
          {...register('legalPerson')}
          placeholder="法人代表"
          className="w-full border rounded px-3 py-2"
          aria-label="法人代表"
        />
        {errors.legalPerson && <div className="text-red-500 text-sm">{errors.legalPerson.message}</div>}
      </div>
      <div>
        <input
          {...register('foundedAt')}
          placeholder="成立日期"
          type="date"
          className="w-full border rounded px-3 py-2"
          aria-label="成立日期"
        />
        {errors.foundedAt && <div className="text-red-500 text-sm">{errors.foundedAt.message}</div>}
      </div>
      <div>
        <input
          {...register('capital')}
          placeholder="注册资本"
          className="w-full border rounded px-3 py-2"
          aria-label="注册资本"
        />
        {errors.capital && <div className="text-red-500 text-sm">{errors.capital.message}</div>}
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          保存
        </button>
        <button
          type="button"
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => reset()}
        >
          重置
        </button>
      </div>
    </form>
  )
}

export default BaseInfoForm 