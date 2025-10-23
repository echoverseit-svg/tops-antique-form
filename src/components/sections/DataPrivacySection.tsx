import { CheckCircle2, AlertCircle } from 'lucide-react'
import { TOPSFormData } from '../../types'

interface DataPrivacySectionProps {
  formData: TOPSFormData
  setFormData: (data: TOPSFormData) => void
}

export default function DataPrivacySection({ formData, setFormData }: DataPrivacySectionProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-amber-600" />
          Data Privacy and Confirmation
        </h2>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">IMPORTANT NOTICE</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Once this form has been submitted, no further edits can be made. Please review all information carefully before submitting to ensure accuracy and completeness. Thank you for your understanding!!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          <div className="border-l-4 border-amber-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">1. Data Privacy</h3>
            <p className="text-sm text-gray-700">
              I understand that my personal information, including academic records and supporting documents, will be collected and used solely for the purpose of evaluating my nomination for the Outstanding Pupils and Students of Antique Awards. I consent to the processing and storage of my information in accordance with applicable data privacy laws. I also acknowledge that all information shared in this form will be kept confidential and will only be accessed by authorized personnel.
            </p>
          </div>

          <div className="border-l-4 border-amber-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">2. Truthfulness</h3>
            <p className="text-sm text-gray-700">
              I affirm that all information provided in this nomination form and the supporting documents are accurate, complete, and truthful to the best of my knowledge. I understand that any false or misleading information may result in my disqualification from the nomination process.
            </p>
          </div>

          <div className="border-l-4 border-amber-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">3. Confirmation</h3>
            <p className="text-sm text-gray-700">
              I have read and understood the guidelines and requirements outlined in the nomination process and agree to comply with them.
            </p>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.data_privacy_accepted}
              onChange={(e) => setFormData({...formData, data_privacy_accepted: e.target.checked})}
              className="mt-1 w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700 font-medium">
              I hereby acknowledge and accept the terms outlined above. *
            </span>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Review Your Application</h3>
        <p className="text-sm text-blue-800">
          Before submitting, please review all sections to ensure all information is correct and complete. Once submitted, you will not be able to make changes.
        </p>
      </div>
    </div>
  )
}
