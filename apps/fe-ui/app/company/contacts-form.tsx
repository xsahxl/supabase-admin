"use client"
import { useForm, useFieldArray } from 'react-hook-form'

type Contact = {
  name: string
  position: string
  phone: string
  email: string
}

type ContactsFormType = {
  contacts: Contact[]
}

const ContactsForm = () => {
  const { control, register, handleSubmit, formState: { errors } } = useForm<ContactsFormType>({
    defaultValues: { contacts: [{ name: '', position: '', phone: '', email: '' }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'contacts' })

  const onSubmit = async (data: ContactsFormType) => {
    // 这里调用API保存
    alert('保存成功')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field, idx) => (
        <div key={field.id} className="flex flex-col md:flex-row md:space-x-2 items-center border-b pb-2 mb-2">
          <input
            {...register(`contacts.${idx}.name` as const, { required: '姓名必填' })}
            placeholder="姓名"
            className="border rounded px-2 py-1 mb-2 md:mb-0"
            aria-label="联系人姓名"
          />
          <input
            {...register(`contacts.${idx}.position` as const)}
            placeholder="职位"
            className="border rounded px-2 py-1 mb-2 md:mb-0"
            aria-label="联系人职位"
          />
          <input
            {...register(`contacts.${idx}.phone` as const, {
              required: '手机号必填',
              pattern: { value: /^1\d{10}$/, message: '手机号格式错误' }
            })}
            placeholder="手机号"
            className="border rounded px-2 py-1 mb-2 md:mb-0"
            aria-label="联系人手机号"
          />
          <input
            {...register(`contacts.${idx}.email` as const, {
              required: '邮箱必填',
              pattern: { value: /^[\w-]+@[\w-]+\.[\w-]+$/, message: '邮箱格式错误' }
            })}
            placeholder="邮箱"
            className="border rounded px-2 py-1 mb-2 md:mb-0"
            aria-label="联系人邮箱"
          />
          <button
            type="button"
            className="bg-red-500 text-white px-2 py-1 rounded ml-2"
            onClick={() => remove(idx)}
            tabIndex={0}
            aria-label="删除联系人"
            onKeyDown={e => e.key === 'Enter' && remove(idx)}
            disabled={fields.length === 1}
          >
            删除
          </button>
        </div>
      ))}
      <div className="flex space-x-2">
        <button
          type="button"
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => append({ name: '', position: '', phone: '', email: '' })}
        >
          添加联系人
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          保存
        </button>
      </div>
    </form>
  )
}

export default ContactsForm 