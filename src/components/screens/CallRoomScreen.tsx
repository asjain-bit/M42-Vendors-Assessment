'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Mic,
  MicOff,
  MonitorUp,
  MessageSquare,
  DoorOpen,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react'
import { VendorDispatchData } from './ConfigureVendorCallScreen'

type CallRoomState = 'join' | 'waiting' | 'left' | 'finalised'

interface TranscriptEntry {
  speaker: 'Sam' | 'Vendor'
  text: string
  time: string
}

interface CallRoomScreenProps {
  vendor: VendorDispatchData
  onBack: () => void
  onExitToVendors?: () => void
}

// Sample questionnaire transcript
const sampleTranscript: TranscriptEntry[] = [
  {
    speaker: 'Sam',
    time: '11:32 AM',
    text: "Welcome. I'm Sam, your AI assessor. Before we begin, I want to confirm you have consented to this session being recorded and transcribed.",
  },
  {
    speaker: 'Vendor',
    time: '11:32 AM',
    text: 'Yes, we confirm and consent to the recording.',
  },
  {
    speaker: 'Sam',
    time: '11:33 AM',
    text: "Thank you. Let's begin with Section 1: Data Protection & Privacy.",
  },
  {
    speaker: 'Sam',
    time: '11:33 AM',
    text: 'Does your organisation maintain a formal data classification policy that categorises data based on sensitivity level — for example, public, internal, confidential, or restricted?',
  },
  {
    speaker: 'Vendor',
    time: '11:35 AM',
    text: 'Yes, we have a formal data classification policy. All data is categorised into four tiers: Public, Internal Use, Confidential, and Restricted. The policy is reviewed annually and enforced through our DLP tooling.',
  },
  {
    speaker: 'Sam',
    time: '11:36 AM',
    text: 'Can you describe how your organisation ensures data subject rights requests — such as access, erasure, or portability — are handled within the regulatory timeframes set by applicable data protection laws?',
  },
]

const currentQuestion =
  'Can you describe how your organisation ensures data subject rights requests — such as access, erasure, or portability — are handled within the regulatory timeframes set by applicable data protection laws?'

export const CallRoomScreen: React.FC<CallRoomScreenProps> = ({
  vendor,
  onBack,
  onExitToVendors,
}) => {
  const [roomState, setRoomState] = useState<CallRoomState>('join')
  const [yourName, setYourName] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [pulseActive, setPulseActive] = useState(true)
  const [wavePhase, setWavePhase] = useState(0)

  // Assessment lifecycle
  const [assessmentStarted, setAssessmentStarted] = useState(false)
  const [agentOnHold, setAgentOnHold] = useState(false)
  const [showHoldTooltip, setShowHoldTooltip] = useState(false)
  const holdTooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Leave confirmation popup
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  // End & Finalise confirmation popup
  const [showFinaliseConfirm, setShowFinaliseConfirm] = useState(false)

  // Live timer (starts when assessment starts)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!assessmentStarted) return
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [assessmentStarted])

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0')
    const ss = (s % 60).toString().padStart(2, '0')
    return `${m}:${ss}`
  }

  // Waveform animation
  useEffect(() => {
    if (roomState !== 'waiting') return
    const interval = setInterval(() => {
      setPulseActive((p) => !p)
      setWavePhase((prev) => (prev + 1) % 5)
    }, 700)
    return () => clearInterval(interval)
  }, [roomState])

  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  const waveBars = [2, 4, 7, 10, 7, 4, 2]

  // Admin initials (current user = admin = M42)
  const adminInitial = yourName.trim() ? yourName.trim()[0].toUpperCase() : 'A'
  // Vendor display name
  const vendorShortName = vendor.name.split(' ').slice(0, 2).join(' ')

  const handleStartAssessment = () => {
    setAssessmentStarted(true)
    setShowTranscript(true)
  }

  const handleHoldToggle = () => {
    if (!assessmentStarted) return
    setAgentOnHold((prev) => !prev)
    setShowHoldTooltip(true)
    if (holdTooltipTimeout.current) clearTimeout(holdTooltipTimeout.current)
    holdTooltipTimeout.current = setTimeout(() => setShowHoldTooltip(false), 3000)
  }

  // ─── JOIN SCREEN ──────────────────────────────────────────────────────────────
  if (roomState === 'join') {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#f8fafc] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-[#ddf7f9]/25 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#e0f2fe]/20 blur-3xl" />
        </div>

        <div className="relative w-full max-w-[420px]">
          <div className="mb-8">
            <Image
              src="/dark-logo.png"
              alt="M42"
              width={72}
              height={28}
              className="object-contain"
            />
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="text-[10px] font-extrabold tracking-[0.18em] text-[#64748b] uppercase">
                Assessment Call
              </span>
              <h1 className="text-2xl font-extrabold text-[#0d212c] leading-tight">
                {vendor.name}
              </h1>
              <p className="text-xs text-[#64748b] font-medium">{vendor.sublabel}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xl p-7 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#36c0c9] animate-pulse inline-block" />
              <span className="text-xs font-semibold text-[#0d212c]">
                {formattedDate}, <span className="text-[#36c0c9]">{formattedTime}</span>{' '}
                <span className="text-[#94a3b8] font-normal">(your local time)</span>
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0d212c]">Your name</label>
              <input
                id="callroom-name-input"
                type="text"
                placeholder="e.g. Priya Shah"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && yourName.trim()) setRoomState('waiting')
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-xs text-[#0d212c] outline-none focus:border-[#36c0c9] transition"
              />
            </div>

            <p className="text-[11px] text-[#64748b] leading-relaxed">
              This call is recorded and transcribed for assessment purposes. By joining you consent
              to recording.
            </p>

            <button
              id="callroom-join-btn"
              disabled={!yourName.trim()}
              onClick={() => setRoomState('waiting')}
              className="w-full bg-[#36c0c9] hover:bg-[#2badb6] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition cursor-pointer border-0 shadow-md"
            >
              Join call
            </button>

            <button
              onClick={onBack}
              className="text-xs text-center text-[#94a3b8] hover:text-[#0d212c] transition cursor-pointer bg-transparent border-0"
            >
              ← Back to vendor
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── FINALISED SCREEN ─────────────────────────────────────────────────────────
  if (roomState === 'finalised') {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#f8fafc] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-[#ddf7f9]/20 blur-3xl" />
        </div>

        <div className="relative bg-white rounded-3xl border border-[#e2e8f0] shadow-xl p-8 max-w-md w-full flex flex-col gap-5">
          <div className="flex flex-col items-center text-center gap-3">
            <Image
              src="/dark-logo.png"
              alt="M42"
              width={72}
              height={28}
              className="object-contain"
            />
            <div className="w-12 h-12 rounded-full bg-[#ddf7f9] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#0d7280]" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-extrabold text-[#0d212c]">Assessment finalised</h2>
              <p className="text-xs text-[#64748b] leading-relaxed">
                The call has ended for all participants. The transcript and audit log have been
                saved.
              </p>
            </div>
          </div>

          {/* Transcript preview */}
          <div className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-4 flex flex-col gap-3 max-h-[260px] overflow-y-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748b]">
              Call Transcript
            </span>
            {sampleTranscript.map((entry, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-extrabold ${entry.speaker === 'Sam' ? 'text-[#0d7280]' : 'text-[#0d212c]'}`}
                  >
                    {entry.speaker}
                  </span>
                  <span className="text-[9px] text-[#94a3b8]">{entry.time}</span>
                </div>
                <p className="text-xs text-[#0d212c] leading-relaxed">{entry.text}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              id="callroom-download-transcript-btn"
              onClick={() => alert('Downloading transcript...')}
              className="w-full bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer border-0 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Download transcript
            </button>
            <button
              onClick={() => {
                if (onExitToVendors) onExitToVendors()
                else onBack()
              }}
              className="w-full bg-transparent hover:bg-slate-100 text-[#64748b] hover:text-[#0d212c] font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer border-0"
            >
              Back to vendors
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── LEFT CALL SCREEN ─────────────────────────────────────────────────────────
  if (roomState === 'left') {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#f8fafc] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-[#ddf7f9]/20 blur-3xl" />
        </div>

        <div className="relative bg-white rounded-3xl border border-[#e2e8f0] shadow-xl p-10 max-w-sm w-full flex flex-col items-center gap-6 text-center">
          <Image src="/dark-logo.png" alt="M42" width={72} height={28} className="object-contain" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold text-[#0d212c]">You have left the meeting</h2>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Do you want to rejoin the assessment session?
            </p>
          </div>

          <div className="w-full flex flex-col gap-2.5 mt-2">
            {/* Rejoin call — primary dark color (#0d212c) with white text */}
            <button
              id="callroom-rejoin-btn"
              onClick={() => {
                setShowLeaveConfirm(false)
                setRoomState('waiting')
              }}
              className="w-full bg-[#0d212c] hover:bg-[#122e3d] text-white border-0 font-bold text-xs py-3 rounded-xl transition cursor-pointer shadow-xs"
            >
              Rejoin call
            </button>

            {/* Back to vendors — tertiary button, navigates to initial vendors directory */}
            <button
              onClick={() => {
                if (onExitToVendors) {
                  onExitToVendors()
                } else {
                  onBack()
                }
              }}
              className="w-full bg-transparent hover:bg-slate-100 text-[#64748b] hover:text-[#0d212c] font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer border-0"
            >
              Back to vendors
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── IN-CALL ROOM ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[9999] bg-[#f8fafc] flex flex-col overflow-hidden">
      {/* Leave Confirmation Popup */}
      {showLeaveConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0d212c]/40 backdrop-blur-xs"
            onClick={() => setShowLeaveConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl border border-[#e2e8f0] shadow-2xl p-8 sm:p-10 max-w-lg w-full flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-150 min-h-[220px] justify-center z-10">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-2xs">
              <DoorOpen className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-extrabold text-[#0d212c]">Leave the call?</h3>
              <p className="text-xs text-[#64748b] leading-relaxed max-w-md">
                You will leave the active audio room session. You can rejoin with the same link
                while the call is live.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={() => {
                  setShowLeaveConfirm(false)
                  setRoomState('left')
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer border-0 shadow-2xs"
              >
                Leave call
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0d212c] font-bold text-xs py-3 rounded-xl transition cursor-pointer border-0"
              >
                Stay in call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End & Finalise Confirmation Popup */}
      {showFinaliseConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0d212c]/40 backdrop-blur-xs"
            onClick={() => setShowFinaliseConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl border border-[#e2e8f0] shadow-2xl p-8 sm:p-10 max-w-lg w-full flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-150 min-h-[240px] justify-center z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#ddf7f9] text-[#0d7280] flex items-center justify-center border border-[#b2ecf2] shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-extrabold text-[#0d212c]">End & Finalise Assessment?</h3>
              <p className="text-xs text-[#64748b] leading-relaxed max-w-md">
                This will end the live call for all participants and mark the assessment as
                complete. The audit log and call transcript will be saved. This action cannot be
                undone.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={() => {
                  setShowFinaliseConfirm(false)
                  setRoomState('finalised')
                }}
                className="flex-1 bg-[#0d212c] hover:bg-[#122e3d] text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer border-0 shadow-2xs"
              >
                End & Finalise
              </button>
              <button
                onClick={() => setShowFinaliseConfirm(false)}
                className="flex-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0d212c] font-bold text-xs py-3 rounded-xl transition cursor-pointer border-0"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP BAR ──────────────────────────────────────────────────────────────── */}
      <div className="h-[52px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-5 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Image src="/dark-logo.png" alt="M42" width={56} height={22} className="object-contain" />
          <div className="w-px h-5 bg-[#e2e8f0]" />
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold text-[#0d212c] truncate max-w-[220px]">
              {vendor.name}
            </span>
            <span className="text-[10px] text-[#64748b] truncate max-w-[220px]">
              {vendor.sublabel}
            </span>
          </div>
        </div>

        {assessmentStarted ? (
          <span className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#15803d] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border border-[#bbf7d0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse inline-block" />
            Live · {formatElapsed(elapsedSeconds)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-[#fef3c7] text-[#92400e] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border border-[#fde68a]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse inline-block" />
            Waiting to start
          </span>
        )}
      </div>

      {/* ── MAIN BODY ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">
        {/* ── STAGE ──────────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 relative bg-[#f8fafc]">
          {/* Background blob */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-[#ddf7f9]/20 blur-3xl" />
          </div>

          {/* ── CENTER STAGE ─────────────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 py-4 relative z-0">
            {/* AI Assessor Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-full border-2 border-[#36c0c9]/25 transition-all duration-700 ${pulseActive ? 'scale-[1.18] opacity-100' : 'scale-100 opacity-0'}`}
                />
                <div
                  className={`absolute inset-0 rounded-full border border-[#36c0c9]/15 transition-all duration-700 delay-200 ${pulseActive ? 'scale-[1.35] opacity-100' : 'scale-105 opacity-0'}`}
                />
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ddf7f9] to-[#b2eff4] border-2 border-[#36c0c9]/40 flex flex-col items-center justify-center gap-1.5 relative z-10 shadow-md">
                  <div className="flex items-end gap-[2.5px] h-5">
                    {waveBars.map((baseH, i) => (
                      <div
                        key={i}
                        className="w-[3px] rounded-full bg-[#36c0c9] transition-all duration-300"
                        style={{
                          height: `${(baseH + ((wavePhase + i) % 5) * 1.5) * (agentOnHold ? 0.6 : 1.5)}px`,
                          transitionDelay: `${i * 60}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-extrabold text-[#0ea5e9] tracking-widest uppercase">
                    AI Assessor
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-extrabold text-[#0d212c]">Sam</span>
                <span className="text-xs text-[#64748b]">
                  {agentOnHold
                    ? 'Sam is on hold'
                    : assessmentStarted
                      ? 'Sam is listening'
                      : 'Sam is here, waiting for M42 to start the assessment'}
                </span>
              </div>
            </div>

            {/* START ASSESSMENT CTA — only before assessment starts */}
            {!assessmentStarted && (
              <button
                id="callroom-start-assessment-btn"
                onClick={handleStartAssessment}
                className="bg-[#36c0c9] hover:bg-[#2badb6] text-white font-bold text-sm px-8 py-3 rounded-xl transition cursor-pointer border-0 shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <PlayCircle className="w-4 h-4" />
                Start Assessment
              </button>
            )}
          </div>

          {/* ── PARTICIPANT TILES — bottom-right, Teams style ────────────────────── */}
          <div className="absolute bottom-4 right-4 flex items-end gap-2 z-10">
            {/* Vendor tile */}
            <div className="w-28 h-20 rounded-xl bg-[#1e293b] border border-white/10 shadow-lg flex flex-col items-center justify-center gap-1 relative overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#334155] flex items-center justify-center text-white font-bold text-base shadow">
                {vendorShortName ? vendorShortName[0].toUpperCase() : 'V'}
              </div>
              <span className="text-[9px] font-bold text-white/70 truncate max-w-[100px] px-1 text-center">
                {vendorShortName}
              </span>
              <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/30 rounded-md px-1 py-0.5">
                <Mic className="w-2 h-2 text-white/70" />
                <span className="text-[8px] text-white/70">Vendor</span>
              </div>
            </div>

            {/* Admin (current user = M42) tile */}
            <div className="w-28 h-20 rounded-xl bg-[#0d212c] border border-[#36c0c9]/20 shadow-lg flex flex-col items-center justify-center gap-1 relative overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#1a3344] border border-[#36c0c9]/30 flex items-center justify-center text-white font-bold text-base shadow">
                {adminInitial}
              </div>
              <span className="text-[9px] font-bold text-white/70 truncate max-w-[100px] px-1 text-center">
                {yourName.trim() || 'Admin'} <span className="text-[#36c0c9]">(you)</span>
              </span>
              {/* Mic badge */}
              <div
                className={`absolute bottom-1 left-1 flex items-center gap-0.5 rounded-md px-1 py-0.5 ${isMuted ? 'bg-red-500/80' : 'bg-black/30'}`}
              >
                {isMuted ? (
                  <MicOff className="w-2 h-2 text-white" />
                ) : (
                  <Mic className="w-2 h-2 text-white/70" />
                )}
                <span className="text-[8px] text-white/70">M42</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── LIVE TRANSCRIPT PANEL — only shown when assessment started ─────────── */}
        {assessmentStarted && showTranscript && (
          <div className="w-[300px] border-l border-[#e2e8f0] bg-white flex flex-col shrink-0 min-h-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0] shrink-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d212c]">
                Live Transcript
              </span>
              <div className="flex items-center gap-2">
                <button className="text-[10px] font-semibold text-[#64748b] hover:text-[#0d212c] transition cursor-pointer bg-transparent border-0">
                  Copy
                </button>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="text-[10px] font-semibold text-[#64748b] hover:text-[#0d212c] transition cursor-pointer bg-transparent border-0"
                >
                  Hide
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
              {sampleTranscript.map((entry, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold ${entry.speaker === 'Sam' ? 'text-[#36c0c9]' : 'text-[#0d212c]'}`}
                    >
                      {entry.speaker === 'Sam' ? 'Sam (AI)' : yourName.trim() || 'Vendor'}
                    </span>
                    <span className="text-[9px] text-[#94a3b8]">{entry.time}</span>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed">{entry.text}</p>
                </div>
              ))}

              {/* Live typing dots */}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#36c0c9]">Sam (AI)</span>
                  <span className="text-[9px] text-[#94a3b8]">now</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#36c0c9] animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM TOOLBAR ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-[#e2e8f0] flex items-center justify-center gap-3 shrink-0 shadow-sm px-6 py-3">
        {/* Mute — always active */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            id="callroom-mute-btn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute' : 'Mute'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer border-0 shadow-sm ${isMuted ? 'bg-[#ddf7f9] text-[#36c0c9] hover:bg-[#b2eff4]' : 'bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0]'}`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <span className="text-[9px] text-[#94a3b8] font-medium">
            {isMuted ? 'Unmute' : 'Mute'}
          </span>
        </div>

        {/* Upload — disabled until assessment starts */}
        <div className="flex flex-col items-center gap-0.5 relative group">
          <button
            id="callroom-upload-btn"
            disabled={!assessmentStarted}
            title={assessmentStarted ? 'Upload document' : 'Available after assessment starts'}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-0 shadow-sm transition ${assessmentStarted ? 'bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0] cursor-pointer' : 'bg-[#f1f5f9] text-[#cbd5e1] cursor-not-allowed opacity-50'}`}
          >
            <MonitorUp className="w-4 h-4" />
          </button>
          <span className="text-[9px] text-[#94a3b8] font-medium">Upload</span>
          {!assessmentStarted && (
            <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0d212c] text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
              Start assessment to upload
            </div>
          )}
        </div>

        {/* Transcript toggle — disabled until assessment starts */}
        <div className="flex flex-col items-center gap-0.5 relative group">
          <button
            id="callroom-transcript-btn"
            onClick={() => assessmentStarted && setShowTranscript(!showTranscript)}
            disabled={!assessmentStarted}
            title={assessmentStarted ? 'Toggle transcript' : 'Available after assessment starts'}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-0 shadow-sm transition ${!assessmentStarted ? 'bg-[#f1f5f9] text-[#cbd5e1] cursor-not-allowed opacity-50' : showTranscript ? 'bg-[#36c0c9] text-white hover:bg-[#2badb6] cursor-pointer' : 'bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0] cursor-pointer'}`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <span className="text-[9px] text-[#94a3b8] font-medium">Transcript</span>
          {!assessmentStarted && (
            <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0d212c] text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
              Start assessment first
            </div>
          )}
        </div>

        {/* Hold Agent — disabled until assessment starts */}
        <div className="flex flex-col items-center gap-0.5 relative group/hold">
          <div className="relative">
            <button
              id="callroom-hold-btn"
              onClick={handleHoldToggle}
              disabled={!assessmentStarted}
              title={agentOnHold ? 'Resume Sam' : 'Hold Agent'}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-0 shadow-sm transition ${!assessmentStarted ? 'bg-[#f1f5f9] text-[#cbd5e1] cursor-not-allowed opacity-50' : agentOnHold ? 'bg-[#ddf7f9] text-[#36c0c9] hover:bg-[#b2eff4] cursor-pointer' : 'bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0] cursor-pointer'}`}
            >
              {agentOnHold ? (
                <PlayCircle className="w-4 h-4" />
              ) : (
                <PauseCircle className="w-4 h-4" />
              )}
            </button>

            {/* Hold active — persistent white tooltip above button */}
            {agentOnHold && (
              <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-white border border-[#e2e8f0] shadow-xl rounded-xl px-3.5 py-2.5 w-56 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse inline-block" />
                  <p className="text-xs font-extrabold text-[#0d212c]">Resume Sam</p>
                </div>
                <p className="text-[10px] text-[#64748b] leading-relaxed">
                  Sam is paused and stopped from speaking. Press to resume.
                </p>
                {/* Tooltip arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-[#e2e8f0] rotate-45" />
              </div>
            )}

            {/* Disabled tooltip */}
            {!assessmentStarted && (
              <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0d212c] text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover/hold:opacity-100 transition-opacity duration-150 z-50">
                Start assessment first
              </div>
            )}
          </div>
          <span className="text-[9px] text-[#94a3b8] font-medium">
            {agentOnHold ? 'Resume Sam' : 'Hold Agent'}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#e2e8f0] mx-1" />

        {/* End & Finalise — disabled until assessment starts */}
        <div className="flex flex-col items-center gap-0.5 relative group">
          <div className="relative">
            <button
              id="callroom-finalise-btn"
              onClick={() => assessmentStarted && setShowFinaliseConfirm(true)}
              disabled={!assessmentStarted}
              title={
                assessmentStarted
                  ? 'End and finalise assessment'
                  : 'Available after assessment starts'
              }
              className={`h-10 px-4 rounded-full flex items-center justify-center gap-1.5 transition border-0 font-bold text-xs shadow-sm ${
                assessmentStarted
                  ? 'bg-[#ddf7f9] hover:bg-[#b2eff4] text-[#0d7280] border border-[#36c0c9]/30 cursor-pointer'
                  : 'bg-[#f1f5f9] text-[#cbd5e1] cursor-not-allowed opacity-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>End &amp; Finalise</span>
            </button>

            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0d212c] text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
              {!assessmentStarted ? 'Start assessment first' : 'This will not be there for vendor'}
            </div>
          </div>
          <span className="text-[9px] text-[#94a3b8] font-medium">Finalise</span>
        </div>

        {/* Leave — no tooltip, visible to vendor too */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            id="callroom-leave-btn"
            onClick={() => setShowLeaveConfirm(true)}
            title="Leave call"
            className="h-10 px-4 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-1.5 transition cursor-pointer border-0 shadow-md font-bold text-xs"
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
          <span className="text-[9px] text-[#94a3b8] font-medium">Leave</span>
        </div>
      </div>

      {/* Recording notice */}
      {assessmentStarted && (
        <div className="bg-white border-t border-[#e2e8f0] flex items-center justify-center py-1 shrink-0">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#94a3b8]">
            Recording and transcription in progress
          </span>
        </div>
      )}
    </div>
  )
}
