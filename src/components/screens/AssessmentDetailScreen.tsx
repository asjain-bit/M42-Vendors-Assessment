'use client'

import React, { useState } from 'react'
import {
  Send,
  Calendar,
  Users,
  PhoneCall,
  CheckCircle2,
  Eye,
  Download,
  Play,
  Pause,
} from 'lucide-react'
import { StatusChip } from '@/components/atoms/StatusChip'
import { Button } from '@/components/atoms/Button'

export interface AssessmentDetailData {
  id: string
  vendor: string
  questionnaire: string
  round: string
  status: 'awaiting_evidence' | 'completed' | 'scheduled'
  score: string
  createdDate: string
}

interface AssessmentDetailScreenProps {
  assessment: AssessmentDetailData
  onBack: () => void
}

export const AssessmentDetailScreen: React.FC<AssessmentDetailScreenProps> = ({
  assessment,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'audit_trail'>('assessment')
  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const attachments = [
    { name: 'ISO_27001_Readiness_Report_2026.pdf', size: '1.4 MB', type: 'PDF', date: '25 Aug 2026' },
    { name: 'Penetration_Test_Executive_Summary.pdf', size: '2.8 MB', type: 'PDF', date: '24 Aug 2026' },
    { name: 'SOC_2_Type_II_Compliance_Statement.pdf', size: '850 KB', type: 'PDF', date: '20 Aug 2026' },
  ]

  const lifecycleSteps = [
    { title: 'Call dispatched', actor: 'Admin', time: '1 Sept 2026, 13:15', status: 'Done', icon: Send },
    { title: 'Link scheduled', actor: 'System', time: '1 Sept 2026, 13:14', status: 'Done', icon: Calendar },
    { title: 'Participants joined', actor: 'Vendor', time: '1 Sept 2026, 13:15', status: 'Done', icon: Users },
    { title: 'Assessment call', actor: 'AI Agent', time: '1 Sept 2026, 13:15', status: 'Done', icon: PhoneCall },
    { title: 'Call ended', actor: 'System', time: '1 Sept 2026, 13:19', status: 'Done', icon: CheckCircle2 },
  ]

  const questions = [
    {
      id: 1,
      category: 'Corporate',
      question: 'State the city and country of your headquarters and any stock exchange you are listed on.',
      confidence: 'High confidence',
      confidenceType: 'success' as const,
      confidenceTooltip: 'High confidence: Official Abu Dhabi Securities Exchange public registry matched.',
      answer: 'Presight AI Holding PLC is headquartered in Abu Dhabi, United Arab Emirates, and is listed on the Abu Dhabi Securities Exchange (ADX) under the ticker PRESIGHT.',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes: 'The answer explicitly names the HQ city (Abu Dhabi), country (United Arab Emirates), and the exchange (Abu Dhabi Securities Exchange) as required by the cue.',
      research: {
        text: 'Presight AI Holding PLC is headquartered in Abu Dhabi, United Arab Emirates, and is listed on the Abu Dhabi Securities Exchange (ADX) under the ticker PRESIGHT.',
        status: 'PASS',
        links: [
          'Presight AI Holding PLC Stock Quote (Abu Dhabi ...',
          '(PRESIGHT.AD) | Stock Price & Latest News',
          'Presight AI now listed on the Abu Dhabi Securities Exchange',
          'PRESIGHT Stock Price and Chart',
        ],
      },
    },
    {
      id: 2,
      category: 'Security',
      question: 'Describe how you encrypt customer data at rest and in transit.',
      confidence: 'High confidence',
      confidenceType: 'success' as const,
      confidenceTooltip: 'High confidence: Explicit technical match for AES-256 and TLS 1.2+ encryption standards.',
      answer: 'Customer data is encrypted at rest with AES-256 and in transit with TLS 1.2 or higher, with managed key rotation.',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes: 'The answer explicitly names AES-256 for data at rest and TLS 1.2 or higher for data in transit, fully meeting the cue requirements.',
    },
    {
      id: 3,
      category: 'Security',
      question: 'Provide your current ISO/IEC 27001 certificate.',
      confidence: 'Low confidence',
      confidenceType: 'error' as const,
      confidenceTooltip: 'Low confidence: Stage 1 review uploaded; full Stage 2 certificate pending verification.',
      answer: 'The uploaded document states completion of Stage 1 readiness review for ISO/IEC 27001 with Stage 2 certification audit scheduled. Later the certificate was uploaded and received successfully.',
      whyScore: 'No valid, authentic document was provided initially, so this scores low.',
      answerNotes: 'The answer confirms that a certificate was uploaded and received successfully, but initially only mentions completion of Stage 1 readiness review.',
    },
    {
      id: 4,
      category: 'Security',
      question: 'Describe your identity and access management controls (SSO, MFA, least privilege).',
      confidence: 'Medium confidence',
      confidenceType: 'warning' as const,
      confidenceTooltip: 'Medium confidence: Partial response; role-based access described without enforced MFA details.',
      answer: '(not answered)',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes: 'The answer addresses role-based least-privilege access and access controls but fails to explicitly mention SSO or enforced MFA.',
    },
    {
      id: 5,
      category: 'Resilience',
      question: 'Describe your incident-response process and typical time to notify affected customers.',
      confidence: 'Medium confidence',
      confidenceType: 'warning' as const,
      confidenceTooltip: 'Medium confidence: Document confirms IR framework without stated customer SLA window.',
      answer: '(not answered)',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes: 'The answer confirms the existence of a documented incident-response process but fails to provide a stated notification window.',
    },
    {
      id: 6,
      category: 'Assurance',
      question: 'Provide your most recent penetration test summary or SOC 2 Type II report.',
      confidence: 'Low confidence',
      confidenceType: 'error' as const,
      confidenceTooltip: 'Low confidence: Missing mandatory penetration test summary or SOC 2 report attachment.',
      answer: '(not answered)',
      whyScore: 'No valid, authentic document was provided, so this scores low.',
      answerNotes: 'The answer is empty and does not provide any information about a recent pen-test summary or SOC 2 Type II report.',
    },
    {
      id: 7,
      category: 'Data',
      question: 'Where is customer data stored, and can data residency be restricted to a region?',
      confidence: 'Low confidence',
      confidenceType: 'error' as const,
      confidenceTooltip: 'Low confidence: Missing UAE cloud tenant data residency proof.',
      answer: '(not answered)',
      whyScore: 'Scored on the quality of the answer.',
      answerNotes: 'Response lacks specific cloud tenant location proof for UAE residency restrictions.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0d212c] pb-16 font-sans w-full">
      {/* Breadcrumb Menu */}
      <div className="w-full px-6 lg:px-10 pt-4 pb-2 text-xs font-semibold flex items-center gap-1.5 text-[#64748b]">
        <button onClick={onBack} className="hover:text-[#36c0c9] cursor-pointer">
          M42 admin
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-[#36c0c9] cursor-pointer">
          Dashboard
        </button>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">Presight AI | See the Future Today</span>
      </div>

      {/* Header Section */}
      <div className="w-full px-6 lg:px-10 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-[#0d212c]">
            Presight AI | See the Future Today
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] mt-0.5">
            <StatusChip
              label={assessment.status === 'completed' ? 'Completed' : assessment.status === 'scheduled' ? 'Scheduled' : 'Awaiting evidence'}
              status={assessment.status === 'completed' ? 'success' : assessment.status === 'scheduled' ? 'info' : 'warning'}
              dot={false}
            />
            <span className="text-slate-300">|</span>
            <span>Round 1</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => alert(`Downloading PDF report for ${assessment.vendor}...`)}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Download PDF</span>
          </Button>
          {/* Finalize button in subtle grey active state per user instructions */}
          <button
            onClick={() => alert(`Finalizing assessment for ${assessment.vendor}...`)}
            className="bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#0d212c] font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
          >
            Finalize
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full px-6 lg:px-10 mt-6 flex flex-col gap-6">
        {/* Navigation Tabs (Subtle grey clicked state) */}
        <div className="flex items-center gap-3 border-b border-[#e2e8f0] pb-2">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'assessment'
                ? 'bg-[#e2e8f0] text-[#0d212c] shadow-xs'
                : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`}
          >
            Assessment
          </button>
          <button
            onClick={() => setActiveTab('audit_trail')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'audit_trail'
                ? 'bg-[#e2e8f0] text-[#0d212c] shadow-xs'
                : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`}
          >
            Audit trail
          </button>
        </div>

        {activeTab === 'audit_trail' ? (
          <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] shadow-xs text-center py-16">
            <h3 className="text-sm font-bold text-[#0d212c]">Audit trail</h3>
            <p className="text-xs text-[#64748b] mt-1 font-medium">Coming soon</p>
          </div>
        ) : (
          <>
            {/* Section 1: ASSESSMENT LIFECYCLE */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[#0d212c]">ASSESSMENT LIFECYCLE</h3>
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {lifecycleSteps.map((step, idx) => {
                    const StepIcon = step.icon
                    return (
                      <React.Fragment key={step.title}>
                        <div className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex-1 flex flex-col gap-1.5 min-w-0 shadow-xs">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <StepIcon className="w-4 h-4 text-[#0f766e] shrink-0" />
                              <h4 className="font-bold text-[#0d212c] text-xs truncate">{step.title}</h4>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#e6f4ea] text-[#137333] shrink-0">
                              {step.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#64748b] pl-6">{step.actor}</p>
                          <p className="text-[10px] text-[#94a3b8] pl-6">{step.time}</p>
                        </div>

                        {idx < lifecycleSteps.length - 1 && (
                          <span className="hidden lg:block text-slate-300 font-bold px-1 select-none self-center">
                            →
                          </span>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Section 2: Agent confidence evaluation */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0d212c]">Agent confidence evaluation</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] text-xs font-semibold">
                  Draft
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e2e8f0]">
                  {/* Column 1: ANSWERS */}
                  <div className="py-3 md:py-0 md:pr-6 flex flex-col justify-between gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#64748b] tracking-wider">ANSWERS</span>
                      <StatusChip label="Medium confidence" status="warning" dot={false} />
                    </div>
                    <div className="text-2xl font-extrabold text-[#0d212c] mt-1">7/7 answered</div>
                    <p className="text-[11px] text-[#64748b]">Evaluated across technical & operational compliance cues</p>
                  </div>

                  {/* Column 2: DOCUMENTS */}
                  <div className="py-3 md:py-0 md:px-6 flex flex-col justify-between gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#64748b] tracking-wider">DOCUMENTS</span>
                      <StatusChip label="Low confidence" status="error" dot={false} />
                    </div>
                    <div className="text-2xl font-extrabold text-[#0d212c] mt-1">3 files uploaded</div>
                    <p className="text-[11px] text-[#64748b]">ISO Stage 1 readiness report & pen-test summary received</p>
                  </div>

                  {/* Column 3: RESEARCH */}
                  <div className="py-3 md:py-0 md:pl-6 flex flex-col justify-between gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#64748b] tracking-wider">RESEARCH</span>
                      <StatusChip label="High confidence" status="success" dot={false} />
                    </div>
                    <div className="text-2xl font-extrabold text-[#0d212c] mt-1">4 sources verified</div>
                    <p className="text-[11px] text-[#64748b]">Cross-referenced with official Abu Dhabi Securities Exchange records</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Interview audio */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[#0d212c]">Interview audio</h3>
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-4">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-xl bg-[#0d212c] text-white flex items-center justify-center shadow-xs shrink-0 hover:bg-[#08171f] transition cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="h-2 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
                      <div className={`h-full bg-[#36c0c9] ${isPlayingAudio ? 'w-1/3 transition-all duration-1000' : 'w-0'}`} />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#64748b]">
                      <span>0:00</span>
                      <span>3:47</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Summary */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[#0d212c]">Summary</h3>
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Overall evaluation across 7 questions; 2 mandatory evidence items outstanding.
                </p>
              </div>
            </div>

            {/* Section 5: Questions */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0d212c]">Questions</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  className="text-xs cursor-pointer"
                >
                  {showAnswerKey ? 'Hide answer key' : 'Show answer key'}
                </Button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <div className="divide-y divide-[#e2e8f0]/80">
                  {questions.map((q) => (
                    <div key={q.id} className="py-5 first:pt-0 last:pb-0 flex flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-bold text-[#0d212c] text-sm">
                          {q.id}. [{q.category}] {q.question}
                        </h4>

                        <div className="relative group shrink-0">
                          <div className="cursor-help">
                            <StatusChip
                              label={q.confidence}
                              status={q.confidenceType}
                              dot={false}
                            />
                          </div>
                          <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-0 top-7 z-30 w-64 bg-[#0d212c] text-white text-xs p-3 rounded-xl shadow-xl border border-white/10">
                            {q.confidenceTooltip}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-[#0d212c] leading-relaxed">
                        <strong>Answer:</strong> {q.answer}
                      </div>

                      {showAnswerKey && (
                        <>
                          <div className="text-xs text-[#64748b]">
                            <strong>Why this score:</strong> {q.whyScore}
                          </div>

                          <div className="text-xs text-[#64748b]">
                            <strong>Answer notes:</strong> {q.answerNotes}
                          </div>
                        </>
                      )}

                      {q.research && (
                        <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs flex flex-col gap-1.5 mt-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#0d212c]">
                              Research: {q.research.text}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#12b76a] text-white font-bold text-[10px]">
                              {q.research.status}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 text-[#0f766e]">
                            {q.research.links.map((link) => (
                              <a key={link} href="#" className="hover:underline truncate text-[11px]">
                                {link}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 6: Attachments */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0d212c]">Attachments</h3>
                <span className="text-xs font-semibold text-[#36c0c9] bg-[#ddf7f9] px-2.5 py-1 rounded-full">
                  {attachments.length} files attached
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {attachments.map((file) => (
                    <div
                      key={file.name}
                      className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-lg bg-[#e8f0fe] text-[#1a73e8] font-bold text-xs shrink-0">
                          {file.type}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#0d212c] truncate">{file.name}</h4>
                          <span className="text-[11px] text-[#64748b] block">{file.size} • {file.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => alert(`Viewing ${file.name}...`)}
                          className="p-1 text-[#64748b] hover:text-[#0d212c] cursor-pointer"
                          title="View document"
                          aria-label="View document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Downloading ${file.name}...`)}
                          className="p-1 text-[#64748b] hover:text-[#0d212c] cursor-pointer"
                          title="Download document"
                          aria-label="Download document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
