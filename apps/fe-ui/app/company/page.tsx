"use client"
import { useState } from 'react'
import BaseInfoForm from '@/app/company/base-info-form'
import CertificateManager from '@/app/company/certificate-manager'
import ContactsForm from '@/app/company/contacts-form'

const CompanyPage = () => {
  const [tab, setTab] = useState<'base' | 'cert' | 'contacts'>('base')

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === 'base' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setTab('base')}
          tabIndex={0}
          aria-label="企业基本信息"
          onKeyDown={e => e.key === 'Enter' && setTab('base')}
        >
          企业基本信息
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'cert' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setTab('cert')}
          tabIndex={0}
          aria-label="企业证件管理"
          onKeyDown={e => e.key === 'Enter' && setTab('cert')}
        >
          企业证件管理
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'contacts' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setTab('contacts')}
          tabIndex={0}
          aria-label="联系人管理"
          onKeyDown={e => e.key === 'Enter' && setTab('contacts')}
        >
          联系人管理
        </button>
      </div>
      {tab === 'base' && <BaseInfoForm />}
      {tab === 'cert' && <CertificateManager />}
      {tab === 'contacts' && <ContactsForm />}
    </div>
  )
}

export default CompanyPage 