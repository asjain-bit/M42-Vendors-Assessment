'use client'

import React, { useState } from 'react'
import { ArrowUp, ArrowDown, Trash2, ArrowLeft } from 'lucide-react'
import { Checkbox } from '@/components/atoms/Checkbox'

export interface QuestionItem {
  id: number
  section: string
  question: string
  responseCue: string
  researchNeeded: boolean
  attachmentRequired: boolean
}

export interface QuestionnaireDetailData {
  id: string
  title: string
  status: string
  questionsCount: number
}

interface QuestionnaireDetailScreenProps {
  questionnaire: QuestionnaireDetailData
  onBack: () => void
}

export const QuestionnaireDetailScreen: React.FC<QuestionnaireDetailScreenProps> = ({
  questionnaire,
  onBack,
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 1,
      section: 'SECTION 1: PATIENT SAFETY & CLINICAL RISK',
      question: 'Describe the primary clinical or operational use cases supported by your solution.',
      responseCue: 'Specify whether workflows are clinical, decision-support, operational, or administrative. State whether outputs influence patient care directly or indirectly.',
      researchNeeded: true,
      attachmentRequired: true,
    },
    {
      id: 2,
      section: 'SECTION 1: PATIENT SAFETY & CLINICAL RISK',
      question: 'Has your organization performed a patient safety or clinical risk assessment for this product?',
      responseCue: 'Provide documentation or summary of hazard analysis, risk register, or failure-mode analysis related to patient harm.',
      researchNeeded: false,
      attachmentRequired: true,
    },
    {
      id: 3,
      section: 'SECTION 2: INFORMATION SECURITY & ENCRYPTION',
      question: 'Describe how customer data is encrypted in transit and at rest across cloud tenants.',
      responseCue: 'Specify encryption algorithms (e.g. AES-256, TLS 1.3), key rotation policies, and HSM backing.',
      researchNeeded: true,
      attachmentRequired: true,
    },
    {
      id: 4,
      section: 'SECTION 2: INFORMATION SECURITY & ENCRYPTION',
      question: 'Provide proof of SOC 2 Type II or ISO/IEC 27001 certification compliance.',
      responseCue: 'Attach executive summary or auditor attestation statement covering the last 12 months.',
      researchNeeded: false,
      attachmentRequired: true,
    },
    {
      id: 5,
      section: 'SECTION 3: DATA PRIVACY & RESIDENCY',
      question: 'Can customer data be strictly isolated within United Arab Emirates cloud regions?',
      responseCue: 'Detail tenant deployment architecture, backup locations, and compliance with UAE Health Data Law.',
      researchNeeded: true,
      attachmentRequired: false,
    },
    {
      id: 6,
      section: 'SECTION 3: DATA PRIVACY & RESIDENCY',
      question: 'Outline your incident response SLA for reporting data breaches to affected healthcare entities.',
      responseCue: 'Provide notification timeline (e.g., within 24 hours), triage workflows, and root cause analysis format.',
      researchNeeded: true,
      attachmentRequired: true,
    },
  ])

  // Handle Question field edits
  const handleQuestionChange = (id: number, field: keyof QuestionItem, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    )
  }

  // Delete Question
  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  // Move Question Up / Down
  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...questions]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return

    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[targetIndex]
    newQuestions[targetIndex] = temp
    setQuestions(newQuestions)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0d212c] pb-16 font-sans w-full">
      {/* Breadcrumb Header */}
      <div className="w-full px-6 lg:px-10 pt-4 pb-2 text-xs font-semibold flex items-center gap-1.5 text-[#64748b]">
        <button onClick={onBack} className="hover:text-[#36c0c9] cursor-pointer flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Questionnaires</span>
        </button>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">{questionnaire.title}</span>
      </div>

      {/* Header Bar */}
      <div className="w-full px-6 lg:px-10 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
            QUESTIONNAIRE
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-[#0d212c]">
              {questionnaire.title}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">
              ready
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e2e8f0] text-[#0d212c]">
            Published
          </span>
        </div>
      </div>

      {/* All Questions List */}
      <div className="w-full px-6 lg:px-10 mt-6 flex flex-col gap-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-4 hover:border-[#36c0c9]/40 transition"
          >
            {/* Question Header: #Index - Section Title | Controls */}
            <div className="flex items-center justify-between gap-4 border-b border-[#e2e8f0]/60 pb-3">
              <span className="text-xs font-extrabold text-[#64748b] tracking-wider uppercase">
                #{idx + 1} - {q.section}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMoveQuestion(idx, 'up')}
                  className="p-1 text-[#64748b] hover:text-[#0d212c] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move question up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  disabled={idx === questions.length - 1}
                  onClick={() => handleMoveQuestion(idx, 'down')}
                  className="p-1 text-[#64748b] hover:text-[#0d212c] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move question down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                {/* Delete button: Red icon color */}
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1 text-red-600 hover:text-red-700 transition cursor-pointer ml-1"
                  title="Delete question"
                  aria-label="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* QUESTION Input Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">
                QUESTION
              </label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(q.id, 'question', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#36c0c9] focus:ring-1 focus:ring-[#36c0c9] text-xs font-medium text-[#0d212c] bg-white outline-none"
              />
            </div>

            {/* RESPONSE CUE Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">
                RESPONSE CUE
              </label>
              <textarea
                value={q.responseCue}
                onChange={(e) => handleQuestionChange(q.id, 'responseCue', e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#36c0c9] focus:ring-1 focus:ring-[#36c0c9] text-xs font-medium text-[#0d212c] bg-white outline-none resize-y"
              />
            </div>

            {/* Checkboxes: Research needed | Attachment required */}
            <div className="flex items-center gap-6 pt-1">
              <Checkbox
                label="Research needed"
                checked={q.researchNeeded}
                onChange={(e) => handleQuestionChange(q.id, 'researchNeeded', e.target.checked)}
              />
              <Checkbox
                label="Attachment required"
                checked={q.attachmentRequired}
                onChange={(e) => handleQuestionChange(q.id, 'attachmentRequired', e.target.checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
