'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, Clock, ShieldCheck, ArrowRight, ArrowLeft, Volume2, Copy, SlidersHorizontal, ChevronUp } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

export interface VendorDispatchData {
  id: string
  name: string
  sublabel: string
  domain: string
  country: string
  flag: string
  email: string
}

interface ConfigureVendorCallScreenProps {
  vendor: VendorDispatchData
  onBack: () => void
  onComplete: () => void
}

export const ConfigureVendorCallScreen: React.FC<ConfigureVendorCallScreenProps> = ({
  vendor,
  onBack,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [isDispatched, setIsDispatched] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Step 1 states
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(
    'Technical Questionnaire'
  )
  const [roundLabel, setRoundLabel] = useState('Round 1')
  const [estimatedDuration, setEstimatedDuration] = useState('135–205 min')

  // Step 2 states (Configure Sam)
  const [selectedVoice, setSelectedVoice] = useState('Marin')
  const [showAllVoices, setShowAllVoices] = useState(false)
  const [timing, setTiming] = useState<'now' | 'later'>('now')
  const [scheduleDate, setScheduleDate] = useState('2026-09-02')
  const [startTime, setStartTime] = useState('10:00 AM')
  const [endTime, setEndTime] = useState('11:00 AM')
  const [timezone, setTimezone] = useState('Asia/Calcutta - GMT+5:30')

  // Advanced settings state (Snapshot 1)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(true)
  const [nudgeWaitSeconds, setNudgeWaitSeconds] = useState('30')

  const questionnaireOptions = [
    'Technical Questionnaire',
    'Data Protection & Privacy',
    'Presight Technical & Compliance',
    'Information Security & Compliance',
  ]

  const voiceOptions = [
    { id: 'Marin', label: 'Marin', recommended: true, desc: 'Warm and steady. Keeps vendor teams at ease through long sessions.' },
    { id: 'Ash', label: 'Ash', recommended: false, desc: 'Crisp and direct. Suits fast-moving technical walkthroughs.' },
    { id: 'Coral', label: 'Coral', recommended: false, desc: 'Bright and encouraging. A good fit for first onboarding sessions.' },
  ]

  const extraVoices = ['Alloy', 'Ballad', 'Cedar', 'Echo', 'Sage', 'Shimmer', 'Verse']

  const callJoinLink = 'https://tech-due-diligence.delphiprojects.app/call/E0exXCogAvq0Owdr3qbYhU0vt1CQdBuIFIJN18D6wZM'

  const handleCopyLink = () => {
    navigator.clipboard.writeText(callJoinLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  // SCREEN 2: Assessment Dispatched / Call Scheduled View (Copy Icon inside link input box per user request)
  if (isDispatched) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#0d212c] pb-16 font-sans w-full flex flex-col items-center">
        {/* Breadcrumb Header */}
        <div className="w-full px-6 lg:px-10 pt-4 pb-2 text-xs font-semibold flex items-center gap-1.5 text-[#64748b]">
          <button onClick={onBack} className="hover:text-[#36c0c9] cursor-pointer flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vendors</span>
          </button>
          <span>/</span>
          <span>{vendor.name}</span>
          <span>/</span>
          <span className="text-[#36c0c9] font-bold">Call scheduled</span>
        </div>

        {/* Dispatch Screen Container */}
        <div className="w-full max-w-2xl px-6 mt-8 flex flex-col gap-6">
          {/* Top Status Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ddf7f9] text-[#36c0c9] flex items-center justify-center shrink-0">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-extrabold tracking-wider text-[#64748b] uppercase">
                ASSESSMENT DISPATCHED
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0d212c]">
                Call scheduled
              </h1>
              <p className="text-xs text-[#64748b] mt-0.5 font-medium">
                {vendor.name} • {vendor.domain}
              </p>
            </div>
          </div>

          {/* Main White Card Container */}
          <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-xs flex flex-col gap-6">
            {/* JOIN LINK Section (Copy Icon directly inside right side of link input field per user request) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  JOIN LINK
                </span>
                <span className="text-[11px] text-[#64748b]">
                  The call is open now. Share the link and join.
                </span>
              </div>

              {/* Link Input Box with COPY ICON on right side */}
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  readOnly
                  value={callJoinLink}
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] font-mono text-xs text-[#0d212c] outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-[#0d212c] hover:bg-[#e2e8f0] transition cursor-pointer"
                  title="Copy join link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#137333]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Open call room primary button */}
              <div className="mt-2">
                <button
                  onClick={() => alert(`Opening call room for ${vendor.name}...`)}
                  className="w-full bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs py-3.5 px-6 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Open call room
                </button>
              </div>
            </div>

            {/* Grid Summary Details */}
            <div className="border-t border-b border-[#e2e8f0]/80 py-4 grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider block mb-1">
                  ROUND
                </span>
                <span className="font-bold text-[#0d212c]">{roundLabel.replace('Round ', '') || '1'}</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider block mb-1">
                  QUESTIONNAIRE
                </span>
                <span className="font-bold text-[#0d212c]">{selectedQuestionnaire}</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider block mb-1">
                  VOICE
                </span>
                <span className="font-bold text-[#0d212c]">{selectedVoice}</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider block mb-1">
                  OPENS
                </span>
                <span className="font-bold text-[#0d212c]">{timing === 'now' ? 'Now' : startTime}</span>
              </div>
            </div>

            {/* WHAT HAPPENS NEXT */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                WHAT HAPPENS NEXT
              </span>

              <div className="flex flex-col gap-3 text-xs text-[#0d212c]">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#cbd5e1] bg-[#f8fafc] text-[#64748b] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="leading-relaxed text-[#64748b]">
                    Share the link with the vendor team. No account needed, they join with their name.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#cbd5e1] bg-[#f8fafc] text-[#64748b] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="leading-relaxed text-[#64748b]">
                    Open the link yourself. You enter the room as the M42 moderator.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#cbd5e1] bg-[#f8fafc] text-[#64748b] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="leading-relaxed text-[#64748b]">
                    Press Start assessment once everyone is in. Sam runs the questionnaire from there.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule another call link */}
          <div className="text-center pt-2">
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#64748b] hover:text-[#0d212c] transition cursor-pointer"
            >
              Schedule another call
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0d212c] pb-16 font-sans w-full">
      {/* Breadcrumb Header */}
      <div className="w-full px-6 lg:px-10 pt-4 pb-2 text-xs font-semibold flex items-center gap-1.5 text-[#64748b]">
        <button onClick={onBack} className="hover:text-[#36c0c9] cursor-pointer flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Vendors</span>
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-[#36c0c9] cursor-pointer">
          {vendor.name}
        </button>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">New call</span>
      </div>

      {/* Main Page Title Header */}
      <div className="w-full px-6 lg:px-10 py-3 flex flex-col gap-1">
        <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-[#0d212c]">
          Configure vendor call
        </h1>
        <p className="text-xs text-[#64748b]">
          Set up the session, configure Sam, then review before launch.
        </p>
      </div>

      {/* TOP FULL WIDTH HORIZONTAL STEP INDICATORS BAR */}
      <div className="w-full px-6 lg:px-10 mt-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-3">
          <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
            CALL SETUP
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 Indicator */}
            <div
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                currentStep === 1
                  ? 'border-[#36c0c9] bg-[#ddf7f9]/20'
                  : currentStep > 1
                  ? 'border-[#e2e8f0] bg-[#f8fafc]'
                  : 'border-[#e2e8f0] bg-white opacity-60'
              }`}
              onClick={() => setCurrentStep(1)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentStep === 1
                    ? 'bg-[#36c0c9] text-[#0d212c]'
                    : currentStep > 1
                    ? 'bg-[#137333] text-white'
                    : 'bg-[#e2e8f0] text-[#64748b]'
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '01'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0d212c]">01 Setup</span>
                <span className="text-[11px] text-[#64748b]">Session details</span>
              </div>
            </div>

            {/* Step 2 Indicator */}
            <div
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                currentStep === 2
                  ? 'border-[#36c0c9] bg-[#ddf7f9]/20'
                  : currentStep > 2
                  ? 'border-[#e2e8f0] bg-[#f8fafc]'
                  : 'border-[#e2e8f0] bg-white opacity-60'
              }`}
              onClick={() => setCurrentStep(2)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentStep === 2
                    ? 'bg-[#36c0c9] text-[#0d212c]'
                    : currentStep > 2
                    ? 'bg-[#137333] text-white'
                    : 'bg-[#e2e8f0] text-[#64748b]'
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '02'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0d212c]">02 Configure Sam</span>
                <span className="text-[11px] text-[#64748b]">Sam&apos;s voice & timing</span>
              </div>
            </div>

            {/* Step 3 Indicator */}
            <div
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                currentStep === 3
                  ? 'border-[#36c0c9] bg-[#ddf7f9]/20'
                  : 'border-[#e2e8f0] bg-white opacity-60'
              }`}
              onClick={() => setCurrentStep(3)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentStep === 3
                    ? 'bg-[#36c0c9] text-[#0d212c]'
                    : 'bg-[#e2e8f0] text-[#64748b]'
                }`}
              >
                03
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0d212c]">03 Review & launch</span>
                <span className="text-[11px] text-[#64748b]">Confirm and start</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="w-full px-6 lg:px-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: STEP CONTENT (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-6">
              {/* Back Arrow button aligned vertically centered with title text */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="p-1 rounded-lg hover:bg-[#f1f5f9] transition text-[#0d212c] cursor-pointer"
                  title="Back to vendors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-base font-extrabold text-[#0d212c]">
                    Session setup
                  </h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Choose the session type and source material.
                  </p>
                </div>
              </div>

              {/* CALL TYPE: Radio button active / filled for Assessment Round */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  CALL TYPE
                </span>
                <div className="p-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#0d212c] shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-[#0d212c]">
                        Assessment round
                      </span>
                      <span className="text-[11px] text-[#64748b] mt-0.5">
                        Structured due-diligence interview using an approved questionnaire.
                      </span>
                    </div>
                  </div>
                  {/* Radio button active / filled per user request */}
                  <div className="w-4 h-4 rounded-full border-4 border-[#0d212c] bg-white shrink-0 mt-0.5" />
                </div>
              </div>

              {/* QUESTIONNAIRE SELECT DROPDOWN */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  QUESTIONNAIRE
                </span>
                <div className="relative">
                  <select
                    value={selectedQuestionnaire}
                    onChange={(e) => setSelectedQuestionnaire(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-xs font-semibold text-[#0d212c] appearance-none outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                  >
                    {questionnaireOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#64748b] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[11px] text-[#64748b] pl-1">
                  62 questions
                </span>
              </div>

              {/* ESTIMATED DURATION Input Field (Title: ESTIMATED DURATION, Input: 135–205 min) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  ESTIMATED DURATION
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-xs font-bold text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                  />
                  <Clock className="w-4 h-4 text-[#36c0c9] absolute left-3.5 pointer-events-none" />
                </div>
              </div>

              {/* ROUND LABEL */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  ROUND LABEL
                </span>
                <input
                  type="text"
                  value={roundLabel}
                  onChange={(e) => setRoundLabel(e.target.value)}
                  placeholder="e.g. Round 1"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-4">
                <button
                  onClick={onBack}
                  className="text-xs font-semibold text-[#64748b] hover:text-[#0d212c] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <span>Continue to configure Sam</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-6">
              {/* Back Arrow button aligned vertically centered with title text */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="p-1 rounded-lg hover:bg-[#f1f5f9] transition text-[#0d212c] cursor-pointer"
                  title="Back to setup"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-base font-extrabold text-[#0d212c]">
                    Configure Sam
                  </h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Choose Sam&apos;s voice and when the session should begin.
                  </p>
                </div>
              </div>

              {/* SAM'S VOICE */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  SAM&apos;S VOICE
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {voiceOptions.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVoice(v.id)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between gap-3 ${
                        selectedVoice === v.id
                          ? 'border-[#36c0c9] bg-[#ddf7f9]/20'
                          : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-full bg-[#ddf7f9] text-[#36c0c9] flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        {v.recommended && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#ddf7f9] text-[#0f766e]">
                            RECOMMENDED
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-[#0d212c]">
                          {v.label}
                        </h4>
                        <p className="text-[10px] text-[#64748b] mt-1 line-clamp-2">
                          {v.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllVoices(!showAllVoices)}
                  className="text-xs font-bold text-[#36c0c9] hover:underline text-left cursor-pointer"
                >
                  {showAllVoices ? 'Hide extra voices' : 'View all 10 voices'}
                </button>

                {showAllVoices && (
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
                    {extraVoices.map((ev) => (
                      <button
                        key={ev}
                        type="button"
                        onClick={() => setSelectedVoice(ev)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                          selectedVoice === ev
                            ? 'bg-[#e2e8f0] border-[#0d212c] text-[#0d212c]'
                            : 'bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]'
                        }`}
                      >
                        {ev}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* WHEN */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  WHEN
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setTiming('now')}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col gap-1 ${
                      timing === 'now'
                        ? 'border-[#36c0c9] bg-[#ddf7f9]/20'
                        : 'border-[#e2e8f0] bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#0d212c]">
                      Start now
                    </span>
                    <span className="text-[10px] text-[#64748b]">
                      Open the call room as soon as setup is complete.
                    </span>
                  </div>

                  <div
                    onClick={() => setTiming('later')}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col gap-1 ${
                      timing === 'later'
                        ? 'border-[#36c0c9] bg-[#ddf7f9]/20'
                        : 'border-[#e2e8f0] bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#0d212c]">
                      Schedule for later
                    </span>
                    <span className="text-[10px] text-[#64748b]">
                      Choose a date and time for this session.
                    </span>
                  </div>
                </div>

                {timing === 'later' && (
                  <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-4 mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0d212c] mb-1">
                          Meeting date
                        </label>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0d212c] mb-1">
                          Start time
                        </label>
                        <select
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0d212c] mb-1">
                          End time
                        </label>
                        <select
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs text-[#0d212c] outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                        >
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TIMEZONE */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                  TIMEZONE
                </span>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-xs text-[#0d212c] appearance-none outline-none focus:border-[#cbd5e1] focus:ring-1 focus:ring-[#cbd5e1]"
                  >
                    <option value="Asia/Calcutta - GMT+5:30">
                      Asia/Calcutta - GMT+5:30
                    </option>
                    <option value="Asia/Dubai - GMT+4:00">
                      Asia/Dubai - GMT+4:00
                    </option>
                    <option value="UTC - GMT+0:00">UTC - GMT+0:00</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#64748b] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* ADVANCED SETTINGS SECTION (Snapshot 1 implementation) */}
              <div className="border border-[#e2e8f0] rounded-2xl bg-white overflow-hidden shadow-xs">
                <div
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition"
                >
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-4 h-4 text-[#64748b]" />
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-[#0d212c]">
                        Advanced settings
                      </span>
                      <span className="text-[11px] text-[#64748b]">
                        Document reminders and room behaviour
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b]">
                    <span>{nudgeWaitSeconds}s reminder</span>
                    <ChevronUp className={`w-4 h-4 transition-transform ${showAdvancedSettings ? '' : 'rotate-180'}`} />
                  </div>
                </div>

                {showAdvancedSettings && (
                  <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider">
                      UPLOAD WAIT BEFORE NUDGE (SECONDS)
                    </label>
                    <input
                      type="number"
                      value={nudgeWaitSeconds}
                      onChange={(e) => setNudgeWaitSeconds(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs font-bold text-[#0d212c] outline-none focus:border-[#cbd5e1]"
                    />
                    <p className="text-[11px] text-[#64748b] mt-0.5">
                      How long Sam waits after asking for a document before nudging the room.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-[#64748b] hover:text-[#0d212c]"
                >
                  Back to setup
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <span>Continue to review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-6">
              {/* Back Arrow button aligned vertically centered with title text */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="p-1 rounded-lg hover:bg-[#f1f5f9] transition text-[#0d212c] cursor-pointer"
                  title="Back to voice config"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-base font-extrabold text-[#0d212c]">
                    Review & launch
                  </h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Confirm configuration and initiate automated vendor assessment call.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Target vendor:</span>
                  <span className="font-bold text-[#0d212c]">{vendor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Vendor email:</span>
                  <span className="font-bold text-[#0d212c]">{vendor.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Selected questionnaire:</span>
                  <span className="font-bold text-[#0d212c]">{selectedQuestionnaire}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">AI Voice:</span>
                  <span className="font-bold text-[#0d212c]">{selectedVoice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Timing:</span>
                  <span className="font-bold text-[#0d212c]">
                    {timing === 'now' ? 'Start now' : `${scheduleDate} (${startTime} - ${endTime})`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-[#64748b] hover:text-[#0d212c]"
                >
                  Back to voice config
                </button>
                <Button
                  onClick={() => setIsDispatched(true)}
                  className="bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer"
                >
                  Launch assessment call
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: CALL SUMMARY BOX (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-4 text-xs">
            <span className="font-bold text-[#0d212c]">Call summary</span>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
              <div className="w-9 h-9 rounded-xl bg-[#ddf7f9] text-[#36c0c9] font-bold flex items-center justify-center shrink-0">
                {vendor.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[#0d212c] truncate">
                  {vendor.name}
                </span>
                <span className="text-[11px] text-[#64748b] truncate">
                  {vendor.flag} {vendor.country} • {vendor.domain}
                </span>
              </div>
            </div>

            <div className="divide-y divide-[#e2e8f0]/60 flex flex-col">
              <div className="py-2 flex justify-between">
                <span className="text-[#64748b]">CALL TYPE</span>
                <span className="font-bold text-[#0d212c]">Assessment round</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#64748b]">SOURCE</span>
                <span className="font-bold text-[#0d212c] truncate max-w-[140px]">
                  {selectedQuestionnaire}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#64748b]">QUESTIONS</span>
                <span className="font-bold text-[#0d212c]">62</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#64748b]">VOICE</span>
                <span className="font-bold text-[#0d212c]">{selectedVoice}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#64748b]">TIMING</span>
                <span className="font-bold text-[#0d212c]">
                  {timing === 'now' ? 'Start now' : `${startTime} - ${endTime}`}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#64748b]">TIMEZONE</span>
                <span className="font-bold text-[#0d212c] truncate max-w-[140px]">
                  {timezone}
                </span>
              </div>
            </div>

            {/* READINESS PROGRESS */}
            <div className="border-t border-[#e2e8f0] pt-3 flex flex-col gap-2">
              <div className="flex justify-between text-[11px]">
                <span className="font-bold text-[#64748b]">READINESS</span>
                <span className="font-bold text-[#0d212c]">
                  {currentStep - 1} of 3 complete
                </span>
              </div>
              <div className="flex flex-col gap-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Setup</span>
                  <span className={currentStep > 1 ? 'text-[#137333] font-bold' : 'text-[#64748b]'}>
                    {currentStep > 1 ? 'Complete' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Configure Sam</span>
                  <span className={currentStep > 2 ? 'text-[#137333] font-bold' : 'text-[#64748b]'}>
                    {currentStep > 2 ? 'Complete' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Review & launch</span>
                  <span className="text-[#64748b]">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
