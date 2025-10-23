import { FileText, Loader2 } from 'lucide-react'
import { TOPSFormData } from '../../types'

interface RequirementsSectionProps {
  formData: TOPSFormData
  setFormData: (data: TOPSFormData) => void
  onFileUpload: (file: File, fieldName: string) => Promise<void>
  uploadingFile: boolean
}

export default function RequirementsSection({ 
  formData, 
  setFormData, 
  onFileUpload, 
  uploadingFile 
}: RequirementsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-600" />
          II. Requirements
        </h2>
        <p className="text-sm text-gray-600">Upload the required documents</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomination letter signed by at least three (3) members of the School Screening Committee *
          </label>
          <input
            type="file"
            required={!formData.nomination_letter_url}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) await onFileUpload(file, 'nomination_letter_url')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {formData.nomination_letter_url && (
            <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Academic records (Form 137 for Elementary / SF 10 for Senior High) *
          </label>
          <input
            type="file"
            required={!formData.academic_records_url}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) await onFileUpload(file, 'academic_records_url')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {formData.academic_records_url && (
            <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate of the truthfulness of information *
          </label>
          <input
            type="file"
            required={!formData.certificate_truthfulness_url}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) await onFileUpload(file, 'certificate_truthfulness_url')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {formData.certificate_truthfulness_url && (
            <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            A clear 2x2 picture taken within the last twelve (12) months *
          </label>
          <input
            type="file"
            required={!formData.photo_2x2_url}
            accept=".jpg,.jpeg,.png"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) await onFileUpload(file, 'photo_2x2_url')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {formData.photo_2x2_url && (
            <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>
          )}
        </div>

        {uploadingFile && (
          <div className="flex items-center gap-2 text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Uploading file...</span>
          </div>
        )}
      </div>
    </div>
  )
}
