'use client'

import React, { useState } from 'react'
import { StatusChip } from '@/components/atoms/StatusChip'
import { SearchBar } from '@/components/molecules/SearchBar'
import { AssessmentDetailScreen, AssessmentDetailData } from './AssessmentDetailScreen'

interface AssessmentRow {
  id: string
  vendor: string
  questionnaire: string
  round: string
  status: 'awaiting_evidence' | 'completed' | 'scheduled'
  score: string
  createdDate: string
}

export const DashboardScreen: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentDetailData | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'awaiting_evidence' | 'completed' | 'scheduled'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Lazy Loading state: visible count
  const [visibleCount, setVisibleCount] = useState(8)

  const allAssessments: AssessmentRow[] = [
    {
      id: 'ast-1',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'Technical Questionnaire',
      round: 'Round 1',
      status: 'awaiting_evidence',
      score: '0.0',
      createdDate: '25 Aug 2026, 18:42',
    },
    {
      id: 'ast-2',
      vendor: 'Presight AI',
      questionnaire: '—',
      round: 'round 3',
      status: 'completed',
      score: '0.0',
      createdDate: '29 Aug 2026, 17:15',
    },
    {
      id: 'ast-3',
      vendor: 'Presight AI',
      questionnaire: '—',
      round: '2',
      status: 'completed',
      score: '0.0',
      createdDate: '27 Aug 2026, 12:30',
    },
    {
      id: 'ast-4',
      vendor: 'Presight AI',
      questionnaire: '—',
      round: 'round 2',
      status: 'completed',
      score: '0.0',
      createdDate: '27 Aug 2026, 10:45',
    },
    {
      id: 'ast-5',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: '—',
      round: 'round 3',
      status: 'completed',
      score: '0.0',
      createdDate: '25 Aug 2026, 13:20',
    },
    {
      id: 'ast-6',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: '—',
      round: 'round 1',
      status: 'completed',
      score: '0.0',
      createdDate: '24 Aug 2026, 17:10',
    },
    {
      id: 'ast-7',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: '—',
      round: 'round 3',
      status: 'completed',
      score: '0.0',
      createdDate: '24 Aug 2026, 16:05',
    },
    {
      id: 'ast-8',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: '—',
      round: 'Live Re-test',
      status: 'scheduled',
      score: '—',
      createdDate: '18 Aug 2026, 22:10',
    },
    {
      id: 'ast-9',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: '—',
      round: 'ctx',
      status: 'scheduled',
      score: '—',
      createdDate: '18 Aug 2026, 20:45',
    },
    {
      id: 'ast-10',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: '—',
      round: 'Live Onboarding',
      status: 'scheduled',
      score: '—',
      createdDate: '18 Aug 2026, 20:30',
    },
    {
      id: 'ast-11',
      vendor: 'Directus Inc.',
      questionnaire: 'SOC 2 Security Assessment',
      round: 'Round 1',
      status: 'completed',
      score: '94.0',
      createdDate: '15 Aug 2026, 09:15',
    },
    {
      id: 'ast-12',
      vendor: 'Pango Group',
      questionnaire: 'ISO 27001 Checklist',
      round: 'Round 2',
      status: 'completed',
      score: '88.5',
      createdDate: '12 Aug 2026, 14:00',
    },
  ]

  const filteredAssessments = allAssessments.filter((row) => {
    const matchesFilter = activeFilter === 'all' || row.status === activeFilter
    const matchesSearch =
      row.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.questionnaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.round.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const visibleAssessments = filteredAssessments.slice(0, visibleCount)

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  // If row clicked, open AssessmentDetailScreen
  if (selectedAssessment) {
    return (
      <AssessmentDetailScreen
        assessment={selectedAssessment}
        onBack={() => setSelectedAssessment(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full px-6 lg:px-10 py-4 text-[#0d212c]">
      {/* Breadcrumb Menu */}
      <div className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
        <span>M42 admin</span>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">Dashboard</span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-1 hover:border-[#36c0c9]/50 transition">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total assessments</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-extrabold text-[#0d212c]">{allAssessments.length}</span>
            <span className="text-xs font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-md">+2 this week</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-1 hover:border-[#36c0c9]/50 transition">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Awaiting evidence</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-extrabold text-amber-600">
              {allAssessments.filter((a) => a.status === 'awaiting_evidence').length}
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">Action required</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-1 hover:border-[#36c0c9]/50 transition">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Completed</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-extrabold text-[#137333]">
              {allAssessments.filter((a) => a.status === 'completed').length}
            </span>
            <span className="text-xs font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-md">92% pass rate</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-1 hover:border-[#36c0c9]/50 transition">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Scheduled</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-extrabold text-[#1a73e8]">
              {allAssessments.filter((a) => a.status === 'scheduled').length}
            </span>
            <span className="text-xs font-bold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-md">Next on 18 Aug</span>
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Chips (Active filter chip in subtle grey state per user instructions) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setActiveFilter('all')
              setVisibleCount(8)
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer select-none ${
              activeFilter === 'all'
                ? 'bg-[#e2e8f0] text-[#0d212c] shadow-xs'
                : 'text-[#64748b] hover:text-[#0d212c] hover:bg-[#f1f5f9]'
            }`}
          >
            All assessments ({allAssessments.length})
          </button>

          <button
            onClick={() => {
              setActiveFilter('awaiting_evidence')
              setVisibleCount(8)
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer select-none ${
              activeFilter === 'awaiting_evidence'
                ? 'bg-[#e2e8f0] text-[#0d212c] shadow-xs'
                : 'text-[#64748b] hover:text-[#0d212c] hover:bg-[#f1f5f9]'
            }`}
          >
            Awaiting evidence ({allAssessments.filter((a) => a.status === 'awaiting_evidence').length})
          </button>

          <button
            onClick={() => {
              setActiveFilter('completed')
              setVisibleCount(8)
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer select-none ${
              activeFilter === 'completed'
                ? 'bg-[#e2e8f0] text-[#0d212c] shadow-xs'
                : 'text-[#64748b] hover:text-[#0d212c] hover:bg-[#f1f5f9]'
            }`}
          >
            Completed ({allAssessments.filter((a) => a.status === 'completed').length})
          </button>

          <button
            onClick={() => {
              setActiveFilter('scheduled')
              setVisibleCount(8)
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer select-none ${
              activeFilter === 'scheduled'
                ? 'bg-[#e2e8f0] text-[#0d212c] shadow-xs'
                : 'text-[#64748b] hover:text-[#0d212c] hover:bg-[#f1f5f9]'
            }`}
          >
            Scheduled ({allAssessments.filter((a) => a.status === 'scheduled').length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72 shrink-0">
          <SearchBar
            placeholder="Search vendor or questionnaire..."
            onSearch={(q) => setSearchTerm(q)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden w-full transition-all duration-300">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-xs font-bold">
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Questionnaire</th>
                <th className="py-3.5 px-4">Round</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Overall score</th>
                <th className="py-3.5 px-4">Created date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]/60">
              {visibleAssessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748b] text-sm">
                    No assessments matching search criteria.
                  </td>
                </tr>
              ) : (
                visibleAssessments.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedAssessment(row)}
                    className="hover:bg-[#f8fafc] transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#0d212c] group-hover:text-[#36c0c9]">
                      {row.vendor}
                    </td>
                    <td className="py-3.5 px-4 text-[#0d212c]">
                      {row.questionnaire}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748b] text-xs">
                      {row.round}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusChip
                        label={
                          row.status === 'awaiting_evidence'
                            ? 'Awaiting evidence'
                            : row.status === 'scheduled'
                            ? 'Scheduled'
                            : 'Completed'
                        }
                        status={
                          row.status === 'awaiting_evidence'
                            ? 'warning'
                            : row.status === 'scheduled'
                            ? 'info'
                            : 'success'
                        }
                        dot={false}
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      {row.status === 'awaiting_evidence' ? (
                        <StatusChip label="0.0" status="warning" dot={false} />
                      ) : row.status === 'scheduled' ? (
                        <StatusChip label="—" status="neutral" dot={false} />
                      ) : (
                        <StatusChip label={row.score} status="success" dot={false} />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748b] text-xs">
                      {row.createdDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Text-Only Load More Button */}
        {visibleCount < filteredAssessments.length && (
          <div className="p-4 border-t border-[#e2e8f0] bg-white flex items-center justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-transparent text-[#0d212c] hover:text-[#36c0c9] font-bold text-sm hover:underline cursor-pointer transition"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
