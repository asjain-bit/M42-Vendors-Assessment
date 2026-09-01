'use client'

import React, { useState } from 'react'
import { Upload, Trash2, FileText, X } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { StatusChip } from '@/components/atoms/StatusChip'
import { QuestionnaireDetailScreen, QuestionnaireDetailData } from './QuestionnaireDetailScreen'

interface Questionnaire {
  id: string
  title: string
  description: string
  fileType: 'PDF' | 'DOCX' | 'MD'
  questionsCount: number
  status: 'Ready' | 'Processing'
}

export const QuestionnairesScreen: React.FC = () => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireDetailData | null>(null)

  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: 'q-1',
      title: 'Technical Questionnaire',
      description: 'Core architectural, clinical risk, and technical data pipeline compliance questionnaire.',
      fileType: 'PDF',
      questionsCount: 62,
      status: 'Ready',
    },
    {
      id: 'q-2',
      title: 'Data Protection & Privacy',
      description: 'Comprehensive 45-question audit covering ISMS policies, encryption controls, access management, and incident response.',
      fileType: 'PDF',
      questionsCount: 45,
      status: 'Ready',
    },
    {
      id: 'q-3',
      title: 'Presight Technical & Compliance',
      description: 'Presight AI platform-specific integration safety, API authorization, and model governance audit.',
      fileType: 'DOCX',
      questionsCount: 50,
      status: 'Ready',
    },
    {
      id: 'q-4',
      title: 'Information Security & Compliance',
      description: 'Trust Services Criteria evaluation for security, availability, processing integrity, confidentiality, and privacy.',
      fileType: 'DOCX',
      questionsCount: 38,
      status: 'Ready',
    },
    {
      id: 'q-5',
      title: 'SOC 2 Type II Vendor Risk Assessment',
      description: 'SOC 2 Type II controls auditing third-party hosting, access controls, and data residency.',
      fileType: 'PDF',
      questionsCount: 32,
      status: 'Ready',
    },
    {
      id: 'q-6',
      title: 'HIPAA & Healthcare Data Compliance Checklist',
      description: 'PHI safeguarding, EHR system integrations, BAA agreements, and UAE DOH data residency verification.',
      fileType: 'PDF',
      questionsCount: 29,
      status: 'Ready',
    },
    {
      id: 'q-7',
      title: 'Third-Party Software Supply Chain Security',
      description: 'SaaS dependency scanning, SBOM verification, open-source license compliance, and vulnerability disclosure policies.',
      fileType: 'MD',
      questionsCount: 20,
      status: 'Ready',
    },
    {
      id: 'q-8',
      title: 'ISO 27001 ISMS Security Checklist',
      description: 'Information Security Management System policies and annual audit verification checklist.',
      fileType: 'PDF',
      questionsCount: 40,
      status: 'Ready',
    },
  ])

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Single document file selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !uploadedFile) return

    setIsUploading(true)

    setTimeout(() => {
      const extension = uploadedFile.name.split('.').pop()?.toUpperCase() as 'PDF' | 'DOCX' | 'MD'
      const newQuestionnaire: Questionnaire = {
        id: `q-${Date.now()}`,
        title,
        description: description || `Custom vendor compliance checklist parsed from ${uploadedFile.name}.`,
        fileType: extension || 'PDF',
        questionsCount: Math.floor(Math.random() * 20) + 15,
        status: 'Ready',
      }

      setQuestionnaires([newQuestionnaire, ...questionnaires])
      setTitle('')
      setDescription('')
      setUploadedFile(null)
      setIsUploading(false)
      showToast(`Questionnaire "${newQuestionnaire.title}" successfully uploaded & structured!`)
    }, 1200)
  }

  const handleDelete = () => {
    if (!deletingId) return
    const target = questionnaires.find((q) => q.id === deletingId)
    setQuestionnaires(questionnaires.filter((q) => q.id !== deletingId))
    setDeletingId(null)
    if (target) {
      showToast(`Removed "${target.title}" template.`)
    }
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // If a row is clicked, open QuestionnaireDetailScreen
  if (selectedQuestionnaire) {
    return (
      <QuestionnaireDetailScreen
        questionnaire={selectedQuestionnaire}
        onBack={() => setSelectedQuestionnaire(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full px-6 lg:px-10 py-4 text-[#0d212c]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d212c] text-white px-4 py-3 rounded-xl shadow-xl border border-[#36c0c9]/50 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <FileText className="w-4 h-4 text-[#36c0c9]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Menu */}
      <div className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
        <span>M42 admin</span>
        <span>/</span>
        <span className="text-[#36c0c9] font-bold">Questionnaires</span>
      </div>

      {/* SECTION 1: Upload Questionnaire */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-[#0d212c]">Upload new questionnaire</h3>

        <div className="w-full bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                Questionnaire title
              </label>
              <Input
                placeholder="e.g. Technical Questionnaire"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                Description
              </label>
              <Textarea
                placeholder="Brief summary of what this questionnaire covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-xs"
              />
            </div>

            {/* Single Document Drag & Drop Uploader Dropzone */}
            <div>
              <label className="block text-xs font-bold text-[#0d212c] mb-1.5">
                Document upload (PDF, DOCX, MD - Max 1 file)
              </label>

              {!uploadedFile ? (
                <label className="border-2 border-dashed border-[#e2e8f0] hover:border-[#36c0c9] bg-[#f8fafc] hover:bg-[#f1f5f9] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center">
                  <Upload className="w-6 h-6 text-[#36c0c9]" />
                  <span className="text-xs font-bold text-[#0d212c]">
                    Click to choose file or drag and drop
                  </span>
                  <span className="text-[11px] text-[#64748b]">
                    Supported formats: PDF, DOCX, MD (Max 1 file allowed)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.md"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="p-4 rounded-xl border border-[#36c0c9]/40 bg-[#ddf7f9]/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-[#36c0c9] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0d212c] truncate">
                        {uploadedFile.name}
                      </p>
                      <span className="text-[10px] text-[#64748b]">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isUploading || !title.trim() || !uploadedFile}
                className="bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#0d212c] font-bold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isUploading ? 'Parsing & structuring document...' : 'Upload & structure'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 2: Questionnaires Directory Table */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0d212c]">Questionnaires</h3>
          <span className="text-xs text-[#64748b]">
            Showing {questionnaires.length} templates
          </span>
        </div>

        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-xs font-bold">
                  <th className="py-3.5 px-5">Title</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Total questions</th>
                  <th className="py-3.5 px-5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]/60">
                {questionnaires.map((q) => (
                  <tr
                    key={q.id}
                    onClick={() => setSelectedQuestionnaire(q)}
                    className="hover:bg-[#f8fafc] transition cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0d212c] group-hover:text-[#36c0c9] text-sm">
                          {q.title}
                        </span>
                        <span className="text-xs text-[#64748b] mt-0.5 line-clamp-1">
                          {q.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <StatusChip label="Ready" status="success" dot={false} />
                    </td>
                    <td className="py-4 px-5 text-xs text-[#0d212c] font-medium">
                      {q.questionsCount} questions
                    </td>
                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDeletingId(q.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:text-red-700 transition cursor-pointer"
                        title="Delete questionnaire"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-[#0d212c]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#e2e8f0]">
            <h3 className="text-lg font-bold text-[#0d212c] mb-2">
              Confirm deletion
            </h3>
            <p className="text-xs text-[#64748b] mb-6">
              Are you sure you want to remove this questionnaire template? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3.5 py-2 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#0d212c]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Delete template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
