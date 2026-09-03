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
  score: 'Low' | 'Medium' | 'High' | '-'
  createdDate: string
}

export const DashboardScreen: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentDetailData | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'awaiting_evidence' | 'completed' | 'scheduled'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const allAssessments: AssessmentRow[] = [
    {
      id: 'ast-1',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'Technical Questionnaire',
      round: 'Round 1',
      status: 'awaiting_evidence',
      score: 'Medium',
      createdDate: '25 Aug 2026, 18:42',
    },
    {
      id: 'ast-2',
      vendor: 'Presight AI',
      questionnaire: 'Data Protection & Privacy',
      round: 'round 3',
      status: 'completed',
      score: 'High',
      createdDate: '29 Aug 2026, 17:15',
    },
    {
      id: 'ast-3',
      vendor: 'Presight AI',
      questionnaire: 'Information Security & Compliance',
      round: '2',
      status: 'completed',
      score: 'High',
      createdDate: '27 Aug 2026, 12:30',
    },
    {
      id: 'ast-4',
      vendor: 'Presight AI',
      questionnaire: 'SOC 2 Security Assessment',
      round: 'round 2',
      status: 'completed',
      score: 'High',
      createdDate: '27 Aug 2026, 10:45',
    },
    {
      id: 'ast-5',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'ISO 27001 Checklist',
      round: 'round 3',
      status: 'completed',
      score: 'High',
      createdDate: '25 Aug 2026, 13:20',
    },
    {
      id: 'ast-6',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'HIPAA & Healthcare Data Compliance',
      round: 'round 1',
      status: 'completed',
      score: 'Medium',
      createdDate: '24 Aug 2026, 17:10',
    },
    {
      id: 'ast-7',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'Software Supply Chain Security',
      round: 'round 3',
      status: 'completed',
      score: 'Low',
      createdDate: '24 Aug 2026, 16:05',
    },
    {
      id: 'ast-8',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'Technical Questionnaire',
      round: 'Live Re-test',
      status: 'scheduled',
      score: '-',
      createdDate: '18 Aug 2026, 22:10',
    },
    {
      id: 'ast-9',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'Data Protection & Privacy',
      round: 'ctx',
      status: 'scheduled',
      score: '-',
      createdDate: '18 Aug 2026, 20:45',
    },
    {
      id: 'ast-10',
      vendor: 'Presight AI | See the Future Today',
      questionnaire: 'Technical Questionnaire',
      round: 'Live Onboarding',
      status: 'scheduled',
      score: '-',
      createdDate: '18 Aug 2026, 20:30',
    },
    {
      id: 'ast-11',
      vendor: 'Directus Inc.',
      questionnaire: 'SOC 2 Security Assessment',
      round: 'Round 1',
      status: 'completed',
      score: 'High',
      createdDate: '15 Aug 2026, 09:15',
    },
    {
      id: 'ast-12',
      vendor: 'Pango Group',
      questionnaire: 'ISO 27001 Checklist',
      round: 'Round 2',
      status: 'completed',
      score: 'High',
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

      {/* KPI Cards Grid (Very very subtle hover stroke per user instructions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between hover:border-[#cbd5e1]/40 hover:shadow-xs transition min-h-[96px]">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total assessments</span>
          <span className="text-3xl font-extrabold text-[#0d212c] mt-2">{allAssessments.length}</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between hover:border-[#cbd5e1]/40 hover:shadow-xs transition min-h-[96px]">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Awaiting evidence</span>
          <span className="text-3xl font-extrabold text-amber-600 mt-2">
            {allAssessments.filter((a) => a.status === 'awaiting_evidence').length}
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between hover:border-[#cbd5e1]/40 hover:shadow-xs transition min-h-[96px]">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Completed</span>
          <span className="text-3xl font-extrabold text-[#137333] mt-2">
            {allAssessments.filter((a) => a.status === 'completed').length}
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between hover:border-[#cbd5e1]/40 hover:shadow-xs transition min-h-[96px]">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Scheduled</span>
          <span className="text-3xl font-extrabold text-[#1a73e8] mt-2">
            {allAssessments.filter((a) => a.status === 'scheduled').length}
          </span>
        </div>
      </div>

      {/* Filter Chips & Search Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer select-none border-0 outline-none ${
              activeFilter === 'all'
                ? 'bg-[#36c0c9] text-white shadow-xs'
                : 'text-[#64748b] bg-transparent hover:text-[#0d212c] hover:bg-[#e2e8f0]'
            }`}
          >
            All assessments ({allAssessments.length})
          </button>

          <button
            onClick={() => setActiveFilter('awaiting_evidence')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer select-none border-0 outline-none ${
              activeFilter === 'awaiting_evidence'
                ? 'bg-[#36c0c9] text-white shadow-xs'
                : 'text-[#64748b] bg-transparent hover:text-[#0d212c] hover:bg-[#e2e8f0]'
            }`}
          >
            Awaiting evidence ({allAssessments.filter((a) => a.status === 'awaiting_evidence').length})
          </button>

          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer select-none border-0 outline-none ${
              activeFilter === 'completed'
                ? 'bg-[#36c0c9] text-white shadow-xs'
                : 'text-[#64748b] bg-transparent hover:text-[#0d212c] hover:bg-[#e2e8f0]'
            }`}
          >
            Completed ({allAssessments.filter((a) => a.status === 'completed').length})
          </button>

          <button
            onClick={() => setActiveFilter('scheduled')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer select-none border-0 outline-none ${
              activeFilter === 'scheduled'
                ? 'bg-[#36c0c9] text-white shadow-xs'
                : 'text-[#64748b] bg-transparent hover:text-[#0d212c] hover:bg-[#e2e8f0]'
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
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748b] text-sm">
                    No assessments matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() =>
                      setSelectedAssessment({
                        ...row,
                        score: row.score === 'High' ? '94.0' : row.score === 'Medium' ? '72.0' : '0.0',
                      })
                    }
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
                      {row.score === '-' ? (
                        <span className="text-[#64748b] font-semibold text-xs pl-2.5">-</span>
                      ) : (
                        <StatusChip
                          label={row.score}
                          status={
                            row.score === 'High'
                              ? 'success'
                              : row.score === 'Medium'
                              ? 'warning'
                              : 'error'
                          }
                          dot={false}
                        />
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
      </div>
    </div>
  )
}
