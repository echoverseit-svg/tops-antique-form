import { School } from 'lucide-react'
import { TOPSFormData, SCHOOL_LEVELS } from '../../types'

interface SchoolDetailsSectionProps {
  formData: TOPSFormData
  setFormData: (data: TOPSFormData) => void
}

export default function SchoolDetailsSection({ formData, setFormData }: SchoolDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <School className="w-6 h-6 text-amber-600" />
          School Details
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School level: *
          </label>
          <div className="space-y-2">
            {SCHOOL_LEVELS.map((level, index) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="school_level"
                  required
                  value={level}
                  checked={formData.school_level === level}
                  onChange={(e) => setFormData({...formData, school_level: e.target.value})}
                  className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">{index + 1}. {level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name of School: *
          </label>
          <input
            type="text"
            required
            value={formData.school_name}
            onChange={(e) => setFormData({...formData, school_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address of School: *
          </label>
          <input
            type="text"
            required
            value={formData.school_address}
            onChange={(e) => setFormData({...formData, school_address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h3 className="font-semibold text-gray-700 mb-3">School Head Information</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name of School Head: *
          </label>
          <input
            type="text"
            required
            value={formData.school_head_name}
            onChange={(e) => setFormData({...formData, school_head_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address: *
          </label>
          <input
            type="email"
            required
            value={formData.school_head_email}
            onChange={(e) => setFormData({...formData, school_head_email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile number: *
          </label>
          <input
            type="tel"
            required
            value={formData.school_head_mobile}
            onChange={(e) => setFormData({...formData, school_head_mobile: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h3 className="font-semibold text-gray-700 mb-3">Class Advisor Information</h3>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name of Class Advisor: *
          </label>
          <textarea
            required
            rows={3}
            value={formData.class_advisor_name}
            onChange={(e) => setFormData({...formData, class_advisor_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Long answer text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address: *
          </label>
          <input
            type="email"
            required
            value={formData.class_advisor_email}
            onChange={(e) => setFormData({...formData, class_advisor_email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile number: *
          </label>
          <input
            type="tel"
            required
            value={formData.class_advisor_mobile}
            onChange={(e) => setFormData({...formData, class_advisor_mobile: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}
