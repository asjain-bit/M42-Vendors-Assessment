'use client'

import React, { useState, useMemo } from 'react'
import {
  MoreVertical,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  X,
  Info,
  Loader2,
  Check,
} from 'lucide-react'

import { StatusChip } from '@/components/atoms/StatusChip'
import { ConfigureVendorCallScreen, VendorDispatchData } from './ConfigureVendorCallScreen'

interface VendorRow {
  id: string
  name: string
  legalName: string
  email: string
  domain: string
  country: string
  flag: string
  status: string
  score: string
  website?: string
  recipients?: string[]
}

interface SearchVendorResult {
  id: string
  name: string
  domain: string
  confidence: 'High confidence' | 'Medium confidence' | 'Low confidence'
  confidenceType: 'success' | 'warning' | 'error'
}

export const VendorsScreen: React.FC = () => {
  const [activeDispatchVendor, setActiveDispatchVendor] = useState<VendorRow | null>(null)
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null)

  // Onboarding Modal state: Default mode is 'find'
  const [showAddVendorModal, setShowAddVendorModal] = useState(false)
  const [onboardingMode, setOnboardingMode] = useState<'find' | 'manual'>('find')

  // Find vendor search & spinner state
  const [findSearchQuery, setFindSearchQuery] = useState('')
  const [isSearchingVendor, setIsSearchingVendor] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchVendorResult | null>(null)

  // Find vendor manual fields (NO auto-population)
  const [findCountry, setFindCountry] = useState('United Arab Emirates')
  const [findWebsite, setFindWebsite] = useState('')

  // Find vendor recipients tag-input state
  const [findRecipientInput, setFindRecipientInput] = useState('')
  const [findRecipients, setFindRecipients] = useState<string[]>([])
  const [findRecipientError, setFindRecipientError] = useState<string | null>(null)

  // Manual vendor tab inputs
  const [manualDisplayName, setManualDisplayName] = useState('')
  const [manualLegalName, setManualLegalName] = useState('')
  const [manualCountry, setManualCountry] = useState('United Arab Emirates')
  const [manualWebsite, setManualWebsite] = useState('')

  // Manual vendor recipients tag-input state
  const [manualRecipientInput, setManualRecipientInput] = useState('')
  const [manualRecipients, setManualRecipients] = useState<string[]>([])
  const [manualRecipientError, setManualRecipientError] = useState<string | null>(null)

  // Edit Vendor modal state
  const [editingVendor, setEditingVendor] = useState<VendorRow | null>(null)
  const [deletingVendor, setDeletingVendor] = useState<VendorRow | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Edit vendor recipients tag input state
  const [editRecipientInput, setEditRecipientInput] = useState('')
  const [editRecipientError, setEditRecipientError] = useState<string | null>(null)

  const worldCountryOptions = [
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'Saudi Arabia', flag: '🇸🇦' },
  ]

  // Mock search results list
  const searchVendorResults: SearchVendorResult[] = [
    {
      id: 'sr-1',
      name: 'Presight AI Holding PLC',
      domain: 'presight.ai',
      confidence: 'High confidence',
      confidenceType: 'success',
    },
    {
      id: 'sr-2',
      name: 'Directus Open Source Ltd',
      domain: 'directus.io',
      confidence: 'High confidence',
      confidenceType: 'success',
    },
    {
      id: 'sr-3',
      name: 'Pango Cybersecurity Global',
      domain: 'pango.com',
      confidence: 'Medium confidence',
      confidenceType: 'warning',
    },
    {
      id: 'sr-4',
      name: 'Apex Healthcare Advisory',
      domain: 'apexhealth.co',
      confidence: 'Medium confidence',
      confidenceType: 'warning',
    },
    {
      id: 'sr-5',
      name: 'Delphi Intelligence Systems',
      domain: 'delphiai.de',
      confidence: 'Low confidence',
      confidenceType: 'error',
    },
  ]

  const [vendors, setVendors] = useState<VendorRow[]>([
    {
      id: 'v-1',
      name: 'Presight AI | See the Future Today',
      legalName: 'Presight AI Holding PLC',
      email: 'compliance@presight.ai',
      domain: 'presight.ai',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      status: 'Active',
      score: '94.0',
    },
    {
      id: 'v-2',
      name: 'Directus Inc.',
      legalName: 'Directus Open Source Ltd',
      email: 'security@directus.io',
      domain: 'directus.io',
      country: 'United States',
      flag: '🇺🇸',
      status: 'Active',
      score: '88.5',
    },
    {
      id: 'v-3',
      name: 'Pango Group LLC',
      legalName: 'Pango Cybersecurity Global',
      email: 'legal@pango.com',
      domain: 'pango.com',
      country: 'United States',
      flag: '🇺🇸',
      status: 'Active',
      score: '91.2',
    },
    {
      id: 'v-4',
      name: 'Apex Systems Advisory',
      legalName: 'Apex Healthcare Solutions Inc.',
      email: 'contact@apexsystems.com',
      domain: 'apexsystems.com',
      country: 'United Kingdom',
      flag: '🇬🇧',
      status: 'Active',
      score: '76.0',
    },
    {
      id: 'v-5',
      name: 'Delphi AI Technologies',
      legalName: 'Delphi Intelligence Systems',
      email: 'audit@delphiai.com',
      domain: 'delphiai.com',
      country: 'Germany',
      flag: '🇩🇪',
      status: 'Active',
      score: '95.8',
    },
    {
      id: 'v-6',
      name: 'BioHealth Analytics',
      legalName: 'BioHealth Data Group GMBH',
      email: 'info@biohealth.de',
      domain: 'biohealth.de',
      country: 'Germany',
      flag: '🇩🇪',
      status: 'Active',
      score: '64.0',
    },
    {
      id: 'v-7',
      name: 'CloudScale AI Systems',
      legalName: 'CloudScale Technologies B.V.',
      email: 'ops@cloudscale.nl',
      domain: 'cloudscale.nl',
      country: 'Netherlands',
      flag: '🇳🇱',
      status: 'Active',
      score: '92.0',
    },
    {
      id: 'v-8',
      name: 'CyberGuard Solutions',
      legalName: 'CyberGuard Security Systems SAS',
      email: 'trust@cyberguard.fr',
      domain: 'cyberguard.fr',
      country: 'France',
      flag: '🇫🇷',
      status: 'Active',
      score: '90.4',
    },
    {
      id: 'v-9',
      name: 'HealthCloud Telemetry',
      legalName: 'HealthCloud Global Pte. Ltd.',
      email: 'support@healthcloud.sg',
      domain: 'healthcloud.sg',
      country: 'Singapore',
      flag: '🇸🇬',
      status: 'Active',
      score: '87.1',
    },
    {
      id: 'v-10',
      name: 'PharmaTech Analytics',
      legalName: 'PharmaTech Clinical Systems KSA',
      email: 'regulatory@pharmatech.sa',
      domain: 'pharmatech.sa',
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      status: 'Active',
      score: '82.3',
    },
    {
      id: 'v-11',
      name: 'MedSec Audit Co',
      legalName: 'MedSec Compliance Services UAE',
      email: 'audits@medsec.ae',
      domain: 'medsec.ae',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      status: 'Active',
      score: '69.5',
    },
    {
      id: 'v-12',
      name: 'Global Diagnostics IT',
      legalName: 'Global Diagnostics Technology Corp',
      email: 'info@globaldiag.com',
      domain: 'globaldiag.com',
      country: 'United States',
      flag: '🇺🇸',
      status: 'Active',
      score: '93.7',
    },
  ])

  // Filtered suppliers
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const query = searchTerm.toLowerCase()
      return (
        v.name.toLowerCase().includes(query) ||
        v.legalName.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query) ||
        v.domain.toLowerCase().includes(query) ||
        v.country.toLowerCase().includes(query)
      )
    })
  }, [vendors, searchTerm])

  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Trigger search on Enter key press in Find Vendor modal
  const handleFindVendorSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!findSearchQuery.trim()) return

      setIsSearchingVendor(true)
      setHasSearched(false)
      setSelectedSearchResult(null)

      setTimeout(() => {
        setIsSearchingVendor(false)
        setHasSearched(true)
      }, 700)
    }
  }

  // Email validation helper for recipient tag inputs
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleKeyDownFindRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmed = findRecipientInput.trim().replace(/,/g, '')
      if (!trimmed) return
      if (!emailRegex.test(trimmed)) {
        setFindRecipientError('Please enter a valid email address.')
        return
      }
      if (findRecipients.includes(trimmed)) {
        setFindRecipientError('Already added.')
        return
      }
      setFindRecipients([...findRecipients, trimmed])
      setFindRecipientInput('')
      setFindRecipientError(null)
    }
  }

  const handleKeyDownManualRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmed = manualRecipientInput.trim().replace(/,/g, '')
      if (!trimmed) return
      if (!emailRegex.test(trimmed)) {
        setManualRecipientError('Please enter a valid email address.')
        return
      }
      if (manualRecipients.includes(trimmed)) {
        setManualRecipientError('Already added.')
        return
      }
      setManualRecipients([...manualRecipients, trimmed])
      setManualRecipientInput('')
      setManualRecipientError(null)
    }
  }

  // Handle Add Vendor from Find Flow (NO auto-population)
  const handleAddVendorFromFind = () => {
    const vendorTitle =
      findSearchQuery.trim() || (selectedSearchResult ? selectedSearchResult.name : '')
    if (!vendorTitle) return

    const countryObj = worldCountryOptions.find((c) => c.name === findCountry)
    const domainStr =
      findWebsite.replace('https://', '').replace('http://', '').split('/')[0] ||
      (selectedSearchResult ? selectedSearchResult.domain : 'vendor.com')

    const newVendor: VendorRow = {
      id: `v-${Date.now()}`,
      name: vendorTitle,
      legalName: vendorTitle,
      email: findRecipients[0] || `compliance@${domainStr}`,
      domain: domainStr,
      country: findCountry,
      flag: countryObj ? countryObj.flag : '🌐',
      status: 'Active',
      score: '88.0',
    }

    setVendors([newVendor, ...vendors])
    setFindSearchQuery('')
    setFindWebsite('')
    setFindRecipients([])
    setFindRecipientInput('')
    setHasSearched(false)
    setSelectedSearchResult(null)
    setShowAddVendorModal(false)
    showToast(`Added ${newVendor.name} via public lookup.`)
  }

  // Handle Manual vendor tab add
  const handleAddVendorManually = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualDisplayName.trim()) return
    const countryObj = worldCountryOptions.find((c) => c.name === manualCountry)
    const newVendor: VendorRow = {
      id: `v-${Date.now()}`,
      name: manualDisplayName.trim(),
      legalName: manualLegalName.trim() || manualDisplayName.trim(),
      email:
        manualRecipients[0] ||
        `contact@${manualWebsite.replace('https://', '').split('/')[0] || 'vendor.com'}`,
      domain: manualWebsite.replace('https://', '').split('/')[0] || 'vendor.com',
      country: manualCountry,
      flag: countryObj ? countryObj.flag : '🌐',
      status: 'Active',
      score: '80.0',
    }

    setVendors([newVendor, ...vendors])
    setManualDisplayName('')
    setManualLegalName('')
    setManualRecipients([])
    setManualRecipientInput('')
    setManualWebsite('')
    setShowAddVendorModal(false)
    showToast(`Added ${newVendor.name} manually.`)
  }

  // Handle Save Edited Vendor
  const handleSaveEditedVendor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVendor) return

    setVendors(vendors.map((v) => (v.id === editingVendor.id ? editingVendor : v)))
    showToast(`Updated details for ${editingVendor.name}.`)
    setEditingVendor(null)
  }

  // Handle Delete Vendor
  const handleDeleteVendorConfirm = () => {
    if (!deletingVendor) return
    setVendors(vendors.filter((v) => v.id !== deletingVendor.id))
    showToast(`Deleted vendor ${deletingVendor.name}.`)
    setDeletingVendor(null)
  }

  const handleLaunchCall = () => {
    const vendorName = activeDispatchVendor ? activeDispatchVendor.name : 'Vendor'
    setActiveDispatchVendor(null)
    setDispatchSuccessToast(`Voice agent call successfully dispatched to ${vendorName}!`)
    setTimeout(() => {
      setDispatchSuccessToast(null)
    }, 4500)
  }

  if (activeDispatchVendor) {
    const dispatchData: VendorDispatchData = {
      id: activeDispatchVendor.id,
      name: activeDispatchVendor.name,
      sublabel: activeDispatchVendor.legalName,
      domain: activeDispatchVendor.domain,
      country: activeDispatchVendor.country,
      flag: activeDispatchVendor.flag,
      email: activeDispatchVendor.email,
    }

    return (
      <ConfigureVendorCallScreen
        vendor={dispatchData}
        onBack={() => setActiveDispatchVendor(null)}
        onComplete={handleLaunchCall}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5 w-full px-6 lg:px-10 py-4 text-[#0d212c]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d212c] text-white px-4 py-3 rounded-xl shadow-xl border border-[#36c0c9]/50 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#36c0c9]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Dispatch Success Banner Toast */}
      {dispatchSuccessToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0d212c] text-white text-xs font-bold px-5 py-3.5 rounded-xl shadow-2xl border border-[#36c0c9] flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-7 h-7 rounded-full bg-[#137333] flex items-center justify-center shrink-0">
            <PhoneCall className="w-3.5 h-3.5 text-white" />
          </div>
          <span>{dispatchSuccessToast}</span>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
        <span>M42 admin</span>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">Vendors</span>
      </div>

      {/* Header Bar with Search Bar placed on the LEFT side of the Add Vendor CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-extrabold text-[#0d212c]">Vendors</h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor name, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs font-medium text-[#0d212c] outline-none focus:border-[#cbd5e1] shadow-xs"
            />
          </div>

          <button
            onClick={() => {
              setOnboardingMode('find')
              setShowAddVendorModal(true)
            }}
            className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer border-0 shrink-0"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Vendors Directory Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden w-full flex flex-col mt-1">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-xs font-bold">
                <th className="py-3.5 px-5">Vendor Name</th>
                <th className="py-3.5 px-5">Domain</th>
                <th className="py-3.5 px-5">Email</th>
                <th className="py-3.5 px-5">Country</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]/60">
              {paginatedVendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#64748b] text-sm">
                    No vendors matching search criteria.
                  </td>
                </tr>
              ) : (
                paginatedVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-[#f8fafc] transition cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0d212c] text-sm group-hover:text-[#36c0c9] transition">
                          {vendor.name}
                        </span>
                        <span className="text-xs text-[#64748b]">{vendor.legalName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-xs">
                      {vendor.domain ? (
                        <a
                          href={`https://${vendor.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0d212c] font-medium underline hover:text-[#36c0c9] transition"
                        >
                          {vendor.domain}
                        </a>
                      ) : (
                        <span className="text-[#64748b] font-medium">-</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-xs font-medium text-[#64748b]">{vendor.email}</td>
                    <td className="py-4 px-5 text-xs text-[#0d212c] font-medium">
                      {vendor.flag} {vendor.country}
                    </td>

                    <td className="py-4 px-5 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          onClick={() =>
                            setOpenActionMenuId(openActionMenuId === vendor.id ? null : vendor.id)
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0d212c] hover:bg-slate-100 transition cursor-pointer border-0"
                          title="Actions menu"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openActionMenuId === vendor.id && (
                          <div className="absolute right-5 top-12 z-40 bg-white rounded-xl border border-[#e2e8f0] shadow-xl w-44 py-1 animate-in fade-in zoom-in-95 duration-150">
                            <button
                              onClick={() => {
                                setOpenActionMenuId(null)
                                setActiveDispatchVendor(vendor)
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#334155] hover:text-[#0d212c] hover:bg-slate-50 cursor-pointer transition border-0 bg-transparent"
                            >
                              Dispatch Call
                            </button>

                            <button
                              onClick={() => {
                                setOpenActionMenuId(null)
                                setEditingVendor(vendor)
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#334155] hover:text-[#0d212c] hover:bg-slate-50 cursor-pointer transition border-0 bg-transparent"
                            >
                              Edit Details
                            </button>

                            <button
                              onClick={() => {
                                setOpenActionMenuId(null)
                                setDeletingVendor(vendor)
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition border-t border-slate-100 bg-transparent"
                            >
                              Delete Vendor
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredVendors.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
            <div className="text-xs text-[#64748b] font-medium">
              Showing page <span className="font-semibold text-[#0d212c]">{currentPage}</span> of{' '}
              <span className="font-semibold text-[#0d212c]">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#cbd5e1] text-xs font-semibold text-[#0d212c] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer flex items-center justify-center"
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer border-0 ${
                      currentPage === pageNum
                        ? 'bg-[#36c0c9] text-white'
                        : 'text-[#64748b] hover:bg-slate-200/60 bg-transparent'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#cbd5e1] text-xs font-semibold text-[#0d212c] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer flex items-center justify-center"
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Vendor Details Popup Modal */}
      {editingVendor && (
        <div className="fixed inset-0 z-50 bg-[#0d212c]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] mb-5">
              <h3 className="text-lg font-bold text-[#0d212c]">Edit vendor details</h3>
              <button
                onClick={() => {
                  setEditingVendor(null)
                  setEditRecipientInput('')
                  setEditRecipientError(null)
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0d212c] transition cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedVendor} className="flex flex-col gap-4">
              {/* Vendor name */}
              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                  Vendor name <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={editingVendor.name}
                  onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1]"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-1.5">Country</label>
                <select
                  value={editingVendor.country}
                  onChange={(e) => {
                    const cObj = worldCountryOptions.find((c) => c.name === e.target.value)
                    setEditingVendor({
                      ...editingVendor,
                      country: e.target.value,
                      flag: cObj ? cObj.flag : '🌐',
                    })
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] bg-white"
                >
                  {worldCountryOptions.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold text-[#0d212c] mb-1.5">Website URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={editingVendor.website || ''}
                  onChange={(e) => setEditingVendor({ ...editingVendor, website: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1]"
                />
              </div>

              {/* Recipients tag input */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-[#0d212c]">Recipients</label>
                <input
                  type="text"
                  placeholder="Type email and press Enter"
                  value={editRecipientInput}
                  onChange={(e) => {
                    setEditRecipientInput(e.target.value)
                    setEditRecipientError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      const trimmed = editRecipientInput.trim().replace(/,/g, '')
                      if (!trimmed) return
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                      if (!emailRegex.test(trimmed)) {
                        setEditRecipientError('Please enter a valid email address.')
                        return
                      }
                      const existingRecipients = editingVendor.recipients || []
                      if (existingRecipients.includes(trimmed)) {
                        setEditRecipientError('This email has already been added.')
                        return
                      }
                      setEditingVendor({
                        ...editingVendor,
                        recipients: [...existingRecipients, trimmed],
                      })
                      setEditRecipientInput('')
                      setEditRecipientError(null)
                    }
                  }}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] ${
                    editRecipientError ? 'border-red-500' : 'border-[#e2e8f0]'
                  }`}
                />
                {editRecipientError && (
                  <span className="text-xs text-red-600">{editRecipientError}</span>
                )}
                {(editingVendor.recipients || []).length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {(editingVendor.recipients || []).map((rec) => (
                      <span
                        key={rec}
                        className="inline-flex items-center gap-1.5 bg-[#f1f5f9] text-[#0d212c] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#cbd5e1]"
                      >
                        {rec}
                        <button
                          type="button"
                          onClick={() =>
                            setEditingVendor({
                              ...editingVendor,
                              recipients: (editingVendor.recipients || []).filter((r) => r !== rec),
                            })
                          }
                          className="p-0.5 hover:bg-slate-200 rounded-full text-slate-500 hover:text-red-600 transition cursor-pointer border-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVendor(null)
                    setEditRecipientInput('')
                    setEditRecipientError(null)
                  }}
                  className="px-4 py-2 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0d212c] hover:bg-slate-50 cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer border-0"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Vendor Confirmation Popup Modal (Center Aligned) */}
      {deletingVendor && (
        <div className="fixed inset-0 z-50 bg-[#0d212c]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#e2e8f0] text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-[#0d212c] mb-2">Confirm deletion</h3>
            <p className="text-xs text-[#64748b] mb-6">
              Are you sure you want to delete{' '}
              <span className="font-bold text-[#0d212c]">{deletingVendor.name}</span>? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={() => setDeletingVendor(null)}
                className="px-4 py-2 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#0d212c] hover:bg-slate-50 cursor-pointer flex-1 bg-transparent"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVendorConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer flex-1 border-0"
              >
                Delete vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Flow Popup Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 bg-[#0d212c]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-[#0d212c]">Add Vendor</h3>
                <p className="text-xs text-[#64748b] mt-0.5 font-medium">
                  {onboardingMode === 'find'
                    ? 'Search public registry for vendor metadata or enter details manually.'
                    : 'Manually register supplier profile for risk due diligence.'}
                </p>
              </div>

              <button
                onClick={() => setShowAddVendorModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#0d212c] transition cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {onboardingMode === 'find' ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 relative">
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="block text-xs font-bold text-[#0d212c]">
                        Vendor legal name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group cursor-pointer">
                        <Info className="w-3.5 h-3.5 text-[#64748b]" />
                        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 bottom-6 z-50 w-64 bg-[#0d212c] text-white text-xs p-2.5 rounded-xl shadow-xl border border-white/10 text-center">
                          Search will start when you press Enter.
                        </div>
                      </div>
                    </div>

                    {/* Input with Enter key trigger & circular progress spinner on right */}
                    <div className="relative flex items-center w-full">
                      <input
                        type="text"
                        placeholder="Type vendor name & press Enter..."
                        value={findSearchQuery}
                        onChange={(e) => setFindSearchQuery(e.target.value)}
                        onKeyDown={handleFindVendorSearchKeyDown}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1]"
                      />
                      {isSearchingVendor && (
                        <Loader2 className="animate-spin w-4 h-4 text-[#36c0c9] absolute right-3 pointer-events-none" />
                      )}
                    </div>

                    {/* Floating Custom Dropdown List (does not increase modal height) */}
                    {hasSearched && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1.5 flex flex-col gap-1.5 bg-white p-3 rounded-2xl border border-[#e2e8f0] shadow-2xl max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                        <span className="text-[10px] font-extrabold uppercase text-[#64748b] tracking-wider mb-1">
                          SELECT MATCHING VENDOR RESULT (
                          {searchVendorResults.filter(
                            (r) =>
                              !findSearchQuery.trim() ||
                              r.name.toLowerCase().includes(findSearchQuery.toLowerCase()) ||
                              r.domain.toLowerCase().includes(findSearchQuery.toLowerCase())
                          ).length || 1}{' '}
                          FOUND)
                        </span>
                        {(searchVendorResults.filter(
                          (r) =>
                            !findSearchQuery.trim() ||
                            r.name.toLowerCase().includes(findSearchQuery.toLowerCase()) ||
                            r.domain.toLowerCase().includes(findSearchQuery.toLowerCase())
                        ).length > 0
                          ? searchVendorResults.filter(
                              (r) =>
                                !findSearchQuery.trim() ||
                                r.name.toLowerCase().includes(findSearchQuery.toLowerCase()) ||
                                r.domain.toLowerCase().includes(findSearchQuery.toLowerCase())
                            )
                          : [
                              {
                                id: `sr-dynamic-${findSearchQuery}`,
                                name: findSearchQuery.trim(),
                                domain: `${findSearchQuery
                                  .trim()
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]/g, '')}.com`,
                                confidence: 'High confidence' as const,
                                confidenceType: 'success' as const,
                              },
                              ...searchVendorResults.slice(0, 2),
                            ]
                        ).map((res) => {
                          const isSelected =
                            selectedSearchResult?.id === res.id || findSearchQuery === res.name
                          return (
                            <div
                              key={res.id}
                              onClick={() => {
                                setSelectedSearchResult(res)
                                setFindSearchQuery(res.name) // Adds vendor name to input field
                                setHasSearched(false) // Closes the search results list
                                if (res.domain) {
                                  setFindWebsite(`https://${res.domain}`)
                                }
                              }}
                              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? 'bg-[#f1f5f9] border-transparent'
                                  : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
                              }`}
                            >
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-[#0d212c] truncate">
                                    {res.name}
                                  </span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                                  )}
                                </div>
                                <span className="text-[11px] text-[#64748b] truncate">
                                  {res.domain}
                                </span>
                              </div>

                              <StatusChip
                                label={res.confidence}
                                status={res.confidenceType}
                                dot={false}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Manual input fields: Country + Website URL on same row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                        Country
                      </label>
                      <select
                        value={findCountry}
                        onChange={(e) => setFindCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] bg-white"
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
                        Website URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://"
                        value={findWebsite}
                        onChange={(e) => setFindWebsite(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1]"
                      />
                    </div>
                  </div>

                  {/* Recipients tag-input (find flow) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="block text-xs font-bold text-[#0d212c] mb-0.5">
                      Recipients
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email and press Enter..."
                      value={findRecipientInput}
                      onChange={(e) => {
                        setFindRecipientInput(e.target.value)
                        if (findRecipientError) setFindRecipientError(null)
                      }}
                      onKeyDown={handleKeyDownFindRecipient}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#0d212c] outline-none transition ${
                        findRecipientError
                          ? 'border-red-500'
                          : 'border-[#e2e8f0] focus:border-[#cbd5e1]'
                      }`}
                    />
                    {findRecipientError && (
                      <span className="text-xs text-red-600">{findRecipientError}</span>
                    )}
                    {findRecipients.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {findRecipients.map((rec) => (
                          <span
                            key={rec}
                            className="inline-flex items-center gap-1.5 bg-[#f1f5f9] text-[#0d212c] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#cbd5e1]"
                          >
                            {rec}
                            <button
                              type="button"
                              onClick={() =>
                                setFindRecipients(findRecipients.filter((r) => r !== rec))
                              }
                              className="p-0.5 hover:bg-slate-200 rounded-full text-slate-500 hover:text-red-600 transition cursor-pointer border-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* "Can't find vendor?" — centered, no separator */}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setOnboardingMode('manual')}
                    className="text-xs cursor-pointer transition bg-transparent border-0 self-center p-0 flex items-center gap-1"
                  >
                    <span className="text-[#64748b]">Can&apos;t find vendor?</span>
                    <span className="text-[#36c0c9] font-bold hover:underline">
                      Add vendor manually
                    </span>
                  </button>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddVendorModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0d212c] hover:bg-slate-50 cursor-pointer bg-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!findSearchQuery.trim() && !selectedSearchResult}
                      onClick={handleAddVendorFromFind}
                      className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed border-0"
                    >
                      Add vendor
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Manual Vendor Flow — stacked layout so height matches Find Vendor */
              <form onSubmit={handleAddVendorManually} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  {/* Display name */}
                  <div>
                    <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                      Display name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter display name"
                      value={manualDisplayName}
                      onChange={(e) => setManualDisplayName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1]"
                    />
                  </div>

                  {/* Legal name */}
                  <div>
                    <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                      Legal name
                    </label>
                    <input
                      type="text"
                      placeholder="Defaults to display name"
                      value={manualLegalName}
                      onChange={(e) => setManualLegalName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1]"
                    />
                  </div>

                  {/* Country + Website on same row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                        Country
                      </label>
                      <select
                        value={manualCountry}
                        onChange={(e) => setManualCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] bg-white"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1]"
                      />
                    </div>
                  </div>

                  {/* Recipients tag-input (manual flow) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="block text-xs font-bold text-[#0d212c] mb-0.5">
                      Recipients
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email and press Enter..."
                      value={manualRecipientInput}
                      onChange={(e) => {
                        setManualRecipientInput(e.target.value)
                        if (manualRecipientError) setManualRecipientError(null)
                      }}
                      onKeyDown={handleKeyDownManualRecipient}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#0d212c] outline-none transition ${
                        manualRecipientError
                          ? 'border-red-500'
                          : 'border-[#e2e8f0] focus:border-[#cbd5e1]'
                      }`}
                    />
                    {manualRecipientError && (
                      <span className="text-xs text-red-600">{manualRecipientError}</span>
                    )}
                    {manualRecipients.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {manualRecipients.map((rec) => (
                          <span
                            key={rec}
                            className="inline-flex items-center gap-1.5 bg-[#f1f5f9] text-[#0d212c] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#cbd5e1]"
                          >
                            {rec}
                            <button
                              type="button"
                              onClick={() =>
                                setManualRecipients(manualRecipients.filter((r) => r !== rec))
                              }
                              className="p-0.5 hover:bg-slate-200 rounded-full text-slate-500 hover:text-red-600 transition cursor-pointer border-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setOnboardingMode('find')}
                    className="text-[#64748b] hover:text-[#0d212c] font-semibold text-xs transition cursor-pointer bg-transparent border-0 p-0"
                  >
                    ← Back to find vendor
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddVendorModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0d212c] hover:bg-slate-50 cursor-pointer bg-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!manualDisplayName.trim()}
                      className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed border-0"
                    >
                      Add vendor
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
