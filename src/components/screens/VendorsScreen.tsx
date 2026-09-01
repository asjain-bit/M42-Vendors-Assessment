'use client'

import React, { useState } from 'react'
import { StatusChip } from '@/components/atoms/StatusChip'
import { ConfigureVendorCallScreen, VendorDispatchData } from './ConfigureVendorCallScreen'

interface Vendor {
  id: string
  name: string
  sublabel: string
  domain: string
  country: string
  flag: string
  email: string
  status: 'Active' | 'Pending'
}

interface PublicVendorRecord {
  name: string
  sublabel: string
  domain: string
  country: string
  flag: string
  email: string
}

export const VendorsScreen: React.FC = () => {
  const worldCountryOptions = [
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Saudi Arabia', flag: '🇸🇦' },
    { name: 'Qatar', flag: '🇶🇦' },
    { name: 'Oman', flag: '🇴🇲' },
    { name: 'Kuwait', flag: '🇰🇼' },
    { name: 'Bahrain', flag: '🇧🇭' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Egypt', flag: '🇪🇬' },
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'Switzerland', flag: '🇨🇭' },
    { name: 'Spain', flag: '🇪🇸' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'Sweden', flag: '🇸🇪' },
  ]

  const publicRecords: PublicVendorRecord[] = [
    {
      name: 'Delphi AI Technologies',
      sublabel: 'Delphi | Data, AI, Cloud & Security Experts',
      domain: 'delphixai.com',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      email: 'contact@delphixai.com',
    },
    {
      name: 'Presight AI Holding PLC',
      sublabel: 'Big data analytics powered by AI',
      domain: 'presight.ai',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      email: 'compliance@presight.ai',
    },
    {
      name: 'Directus Inc.',
      sublabel: 'Open-source data platform & API middleware',
      domain: 'directus.io',
      country: 'United States',
      flag: '🇺🇸',
      email: 'security@directus.io',
    },
    {
      name: 'Pango Group LLC',
      sublabel: 'Enterprise cybersecurity & VPN infrastructure',
      domain: 'pango.co',
      country: 'United States',
      flag: '🇺🇸',
      email: 'privacy@pango.co',
    },
    {
      name: 'Apex Systems Advisory',
      sublabel: 'Healthcare IT staffing & regulatory consulting',
      domain: 'apexsystems.com',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      email: 'info@apexsystems.com',
    },
  ]

  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: 'v-1',
      name: 'Directus Inc.',
      sublabel: 'Open-source data platform & API middleware',
      domain: 'directus.io',
      country: 'United States',
      flag: '🇺🇸',
      email: 'contact@directus.io',
      status: 'Active',
    },
    {
      id: 'v-2',
      name: 'Pango Group',
      sublabel: 'Enterprise security & VPN solutions provider',
      domain: 'pango.co',
      country: 'United States',
      flag: '🇺🇸',
      email: 'security@pango.co',
      status: 'Active',
    },
    {
      id: 'v-3',
      name: 'Apex Systems LLC',
      sublabel: 'Healthcare IT staffing & compliance advisory',
      domain: 'apexsystems.com',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      email: 'info@apexsystems.com',
      status: 'Active',
    },
    {
      id: 'v-4',
      name: 'BioHealth Tech',
      sublabel: 'Genomics data analysis & clinical storage',
      domain: '—',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      email: 'support@biohealth.ae',
      status: 'Active',
    },
    {
      id: 'v-5',
      name: 'CloudScale AI',
      sublabel: 'Clinical NLP models & AI inference engines',
      domain: 'cloudscale.ai',
      country: 'United Kingdom',
      flag: '🇬🇧',
      email: 'contact@cloudscale.ai',
      status: 'Active',
    },
  ])

  const [activeDispatchVendor, setActiveDispatchVendor] = useState<VendorDispatchData | null>(null)

  // Find Vendor form states
  const [findLegalName, setFindLegalName] = useState('')
  const [findVendorEmail, setFindVendorEmail] = useState('')
  const [findCountry, setFindCountry] = useState('United Arab Emirates')
  const [findWebsite, setFindWebsite] = useState('')
  const [showFindDropdown, setShowFindDropdown] = useState(false)

  // Manual Vendor form states
  const [manualDisplayName, setManualDisplayName] = useState('')
  const [manualLegalName, setManualLegalName] = useState('')
  const [manualVendorEmail, setManualVendorEmail] = useState('')
  const [manualCountry, setManualCountry] = useState('United Arab Emirates')
  const [manualWebsite, setManualWebsite] = useState('')

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const matchingPublicRecords = publicRecords.filter(
    (r) =>
      findLegalName.trim() !== '' &&
      (r.name.toLowerCase().includes(findLegalName.toLowerCase()) ||
        r.domain.toLowerCase().includes(findLegalName.toLowerCase()))
  )

  const handleSelectPublicRecord = (record: PublicVendorRecord) => {
    setFindLegalName(record.name)
    setFindVendorEmail(record.email)
    setFindCountry(record.country)
    setFindWebsite(`https://${record.domain}`)
    setShowFindDropdown(false)
  }

  const handleAddVendorFromFind = () => {
    if (!findLegalName.trim()) return
    const matchedCountry = worldCountryOptions.find((c) => c.name === findCountry) || worldCountryOptions[0]
    const newVendor: Vendor = {
      id: `v-${Date.now()}`,
      name: findLegalName,
      sublabel: 'Registered public entity',
      domain: findWebsite ? findWebsite.replace(/^https?:\/\//, '') : '—',
      country: findCountry,
      flag: matchedCountry.flag,
      email: findVendorEmail || `info@${findLegalName.toLowerCase().replace(/\s+/g, '')}.com`,
      status: 'Active',
    }

    setVendors([...vendors, newVendor])
    setFindLegalName('')
    setFindVendorEmail('')
    setFindWebsite('')
    showToast(`Vendor "${newVendor.name}" successfully added!`)
  }

  const handleAddVendorManually = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualDisplayName.trim() || !manualVendorEmail.trim()) return

    const matchedCountry = worldCountryOptions.find((c) => c.name === manualCountry) || worldCountryOptions[0]

    const newVendor: Vendor = {
      id: `v-${Date.now()}`,
      name: manualDisplayName,
      sublabel: manualLegalName || 'Registered vendor partner',
      domain: manualWebsite ? manualWebsite.replace(/^https?:\/\//, '') : '—',
      country: manualCountry,
      flag: matchedCountry.flag,
      email: manualVendorEmail,
      status: 'Active',
    }

    setVendors([...vendors, newVendor])
    setManualDisplayName('')
    setManualLegalName('')
    setManualVendorEmail('')
    setManualWebsite('')
    showToast(`Vendor "${newVendor.name}" successfully registered!`)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  if (activeDispatchVendor) {
    return (
      <ConfigureVendorCallScreen
        vendor={activeDispatchVendor}
        onBack={() => setActiveDispatchVendor(null)}
        onComplete={() => {
          showToast(`Assessment call dispatched for ${activeDispatchVendor.name}!`)
          setActiveDispatchVendor(null)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full px-6 lg:px-10 py-4 text-[#0d212c]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d212c] text-white px-4 py-3 rounded-xl shadow-xl border border-[#36c0c9]/50 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Menu */}
      <div className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
        <span>M42 admin</span>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">Vendors</span>
      </div>

      {/* SECTION 1: Registered Vendors Directory Table */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0d212c]">Registered vendors directory</h3>
          <span className="text-xs text-[#64748b]">{vendors.length} vendors found</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-xs font-bold">
                  <th className="py-3.5 px-5">Vendor</th>
                  <th className="py-3.5 px-5">URL</th>
                  <th className="py-3.5 px-5">Vendor email</th>
                  <th className="py-3.5 px-5">Country</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]/60">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-[#f8fafc] transition">
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0d212c] text-sm">
                          {vendor.name}
                        </span>
                        <span className="text-xs text-[#64748b] mt-0.5">
                          {vendor.sublabel}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-xs">
                      {vendor.domain !== '—' ? (
                        <a
                          href={`https://${vendor.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0d212c] font-medium underline hover:text-[#36c0c9] transition"
                        >
                          {vendor.domain}
                        </a>
                      ) : (
                        <span className="text-[#64748b] font-medium">—</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-xs font-medium text-[#64748b]">
                      {vendor.email}
                    </td>
                    <td className="py-4 px-5 text-xs text-[#0d212c] font-medium">
                      {vendor.flag} {vendor.country}
                    </td>
                    <td className="py-4 px-5">
                      <StatusChip label={vendor.status} status="success" dot={false} />
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setActiveDispatchVendor(vendor)}
                        className="text-[#36c0c9] hover:text-[#0f766e] hover:underline font-bold text-xs bg-transparent cursor-pointer transition px-1 py-1"
                      >
                        Dispatch call
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: Onboarding - Add a Vendor */}
      <div className="flex flex-col gap-4 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-1">
            ONBOARDING
          </span>
          <h2 className="text-xl font-bold text-[#0d212c]">
            Add a vendor
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Search by legal name to match the right public entity, or enter the details yourself if the vendor is not publicly listed.
          </p>
        </div>

        {/* Card 1: FIND VENDOR (Add vendor button in dark primary color, disabled until mandatory legal name is filled) */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-[#64748b] tracking-wider block">
              FIND VENDOR
            </span>
            <p className="text-xs text-[#64748b] mt-0.5">
              Searches public records and returns matching entities to pick from.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                Legal name *
              </label>
              <input
                type="text"
                placeholder="Search legal name or entity..."
                value={findLegalName}
                onChange={(e) => {
                  setFindLegalName(e.target.value)
                  setShowFindDropdown(true)
                }}
                onFocus={() => setShowFindDropdown(true)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
              />

              {showFindDropdown && matchingPublicRecords.length > 0 && (
                <div className="absolute left-0 right-0 top-16 z-30 bg-white rounded-xl border border-[#e2e8f0] shadow-xl max-h-48 overflow-y-auto">
                  {matchingPublicRecords.map((rec) => (
                    <div
                      key={rec.name}
                      onClick={() => handleSelectPublicRecord(rec)}
                      className="p-3 hover:bg-[#f8fafc] transition cursor-pointer border-b border-[#e2e8f0] last:border-b-0 flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0d212c]">
                          {rec.name}
                        </span>
                        <span className="text-[10px] text-[#64748b]">{rec.flag}</span>
                      </div>
                      <span className="text-[11px] text-[#64748b] truncate">
                        {rec.sublabel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                Vendor email
              </label>
              <input
                type="email"
                placeholder="vendor@company.com"
                value={findVendorEmail}
                onChange={(e) => setFindVendorEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                Country
              </label>
              <select
                value={findCountry}
                onChange={(e) => setFindCountry(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1] bg-white"
              >
                {worldCountryOptions.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                Website (optional)
              </label>
              <input
                type="text"
                placeholder="https://"
                value={findWebsite}
                onChange={(e) => setFindWebsite(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              disabled={!findLegalName.trim()}
              onClick={handleAddVendorFromFind}
              className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add vendor
            </button>
          </div>
        </div>

        {/* Card 2: ADD VENDOR MANUALLY (Add vendor button in dark primary color, disabled until mandatory display name and email are filled) */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-[#64748b] tracking-wider block">
              ADD VENDOR MANUALLY
            </span>
            <p className="text-xs text-[#64748b] mt-0.5">
              For vendors without a public footprint. Only the display name and email are required.
            </p>
          </div>

          <form onSubmit={handleAddVendorManually} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                  Display name *
                </label>
                <input
                  type="text"
                  placeholder="Enter display name"
                  value={manualDisplayName}
                  onChange={(e) => setManualDisplayName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                  Legal name
                </label>
                <input
                  type="text"
                  placeholder="Defaults to display name"
                  value={manualLegalName}
                  onChange={(e) => setManualLegalName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                  Vendor email *
                </label>
                <input
                  type="email"
                  placeholder="vendor@company.com"
                  value={manualVendorEmail}
                  onChange={(e) => setManualVendorEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                  Country
                </label>
                <select
                  value={manualCountry}
                  onChange={(e) => setManualCountry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1] bg-white"
                >
                  {worldCountryOptions.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                  Website
                </label>
                <input
                  type="text"
                  placeholder="https://"
                  value={manualWebsite}
                  onChange={(e) => setManualWebsite(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!manualDisplayName.trim() || !manualVendorEmail.trim()}
                className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
