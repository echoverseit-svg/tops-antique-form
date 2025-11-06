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

  const isImageUrl = (url?: string) => {
    if (!url) return false
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  }

  const filenameFromUrl = (url?: string) => {
    if (!url) return ''
    try {
      const parts = url.split('/')
      return decodeURIComponent(parts[parts.length - 1].split('?')[0])
    } catch {
      return url
    }
  }

  const removeFile = (fieldName: keyof TOPSFormData) => {
    setFormData({ ...formData, [fieldName]: undefined } as unknown as TOPSFormData)
  }
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
            <div className="mt-3 flex items-start gap-3">
              {isImageUrl(formData.nomination_letter_url) ? (
                <img src={formData.nomination_letter_url} alt="nomination" className="w-28 h-20 object-cover rounded-md border" />
              ) : (
                <div className="w-28 h-20 flex items-center justify-center rounded-md border bg-gray-50 text-xs text-gray-600">Document</div>
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{filenameFromUrl(formData.nomination_letter_url)}</div>
                <div className="flex items-center gap-3 mt-2">
                  <a href={formData.nomination_letter_url} target="_blank" rel="noreferrer" className="text-xs text-amber-600">View</a>
                  <button type="button" onClick={() => removeFile('nomination_letter_url' as keyof TOPSFormData)} className="text-xs text-red-600">Remove</button>
                </div>
              </div>
            </div>
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
            <div className="mt-3 flex items-start gap-3">
              {isImageUrl(formData.academic_records_url) ? (
                <img src={formData.academic_records_url} alt="academic" className="w-28 h-20 object-cover rounded-md border" />
              ) : (
                <div className="w-28 h-20 flex items-center justify-center rounded-md border bg-gray-50 text-xs text-gray-600">Document</div>
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{filenameFromUrl(formData.academic_records_url)}</div>
                <div className="flex items-center gap-3 mt-2">
                  <a href={formData.academic_records_url} target="_blank" rel="noreferrer" className="text-xs text-amber-600">View</a>
                  <button type="button" onClick={() => removeFile('academic_records_url' as keyof TOPSFormData)} className="text-xs text-red-600">Remove</button>
                </div>
              </div>
            </div>
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
            <div className="mt-3 flex items-start gap-3">
              {isImageUrl(formData.certificate_truthfulness_url) ? (
                <img src={formData.certificate_truthfulness_url} alt="truthfulness" className="w-28 h-20 object-cover rounded-md border" />
              ) : (
                <div className="w-28 h-20 flex items-center justify-center rounded-md border bg-gray-50 text-xs text-gray-600">Document</div>
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{filenameFromUrl(formData.certificate_truthfulness_url)}</div>
                <div className="flex items-center gap-3 mt-2">
                  <a href={formData.certificate_truthfulness_url} target="_blank" rel="noreferrer" className="text-xs text-amber-600">View</a>
                  <button type="button" onClick={() => removeFile('certificate_truthfulness_url' as keyof TOPSFormData)} className="text-xs text-red-600">Remove</button>
                </div>
              </div>
            </div>
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
            <div className="mt-3 flex items-start gap-3">
              {isImageUrl(formData.photo_2x2_url) ? (
                <img src={formData.photo_2x2_url} alt="2x2" className="w-28 h-28 object-cover rounded-md border" />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center rounded-md border bg-gray-50 text-xs text-gray-600">Preview not available</div>
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{filenameFromUrl(formData.photo_2x2_url)}</div>
                <div className="flex items-center gap-3 mt-2">
                  <a href={formData.photo_2x2_url} target="_blank" rel="noreferrer" className="text-xs text-amber-600">View</a>
                  <button type="button" onClick={() => removeFile('photo_2x2_url' as keyof TOPSFormData)} className="text-xs text-red-600">Remove</button>
                </div>
              </div>
            </div>
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
