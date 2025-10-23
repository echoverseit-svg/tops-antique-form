import { Heart, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { TOPSFormData, CommunityServiceClaim, COMMUNITY_PARTICIPATION_TYPES, COMMUNITY_RANKS, COMMUNITY_LEVELS, MODALITY_OPTIONS } from '../../types'

interface CommunityServiceSectionProps {
  formData: TOPSFormData
  setFormData: (data: TOPSFormData) => void
  onClaimFileUpload: (file: File, claimType: 'academic' | 'leadership' | 'community') => Promise<string | null>
}

export default function CommunityServiceSection({ formData, setFormData, onClaimFileUpload }: CommunityServiceSectionProps) {
  const [currentClaim, setCurrentClaim] = useState<CommunityServiceClaim>({
    name: '',
    type_of_participation: '',
    rank: '',
    level: '',
    modality: '',
    file_url: ''
  })

  const addClaim = () => {
    if (formData.community_service_claims.length >= 20) {
      alert('Maximum 20 community service claims allowed')
      return
    }
    if (!currentClaim.name || !currentClaim.type_of_participation) {
      alert('Please fill in at least the name and type of participation')
      return
    }
    setFormData({
      ...formData,
      community_service_claims: [...formData.community_service_claims, currentClaim]
    })
    setCurrentClaim({
      name: '',
      type_of_participation: '',
      rank: '',
      level: '',
      modality: '',
      file_url: ''
    })
  }

  const removeClaim = (index: number) => {
    setFormData({
      ...formData,
      community_service_claims: formData.community_service_claims.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Heart className="w-6 h-6 text-amber-600" />
          V. Community Service Profile
        </h2>
        <p className="text-sm text-gray-600">Maximum of 20 claims. Enter "N/A" if none.</p>
      </div>

      {/* Display added claims */}
      {formData.community_service_claims.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            Added Claims ({formData.community_service_claims.length}/20)
          </h3>
          <div className="space-y-2">
            {formData.community_service_claims.map((claim, index) => (
              <div key={index} className="bg-purple-50 border border-purple-200 p-4 rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Claim #{index + 1}: {claim.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {claim.type_of_participation} • {claim.rank} • {claim.level} • {claim.modality}
                  </p>
                  {claim.file_url && (
                    <p className="text-xs text-green-600 mt-1">✓ Certificate uploaded</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeClaim(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Remove claim"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new claim form */}
      {formData.community_service_claims.length < 20 && (
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Community Service Claim #{formData.community_service_claims.length + 1}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of award or certificate: *
              </label>
              <textarea
                rows={3}
                value={currentClaim.name}
                onChange={(e) => setCurrentClaim({...currentClaim, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Long answer text"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Participation: *
              </label>
              <div className="space-y-2">
                {COMMUNITY_PARTICIPATION_TYPES.map((type, index) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="community_type_of_participation"
                      value={type}
                      checked={currentClaim.type_of_participation === type}
                      onChange={(e) => setCurrentClaim({...currentClaim, type_of_participation: e.target.value})}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{index + 1}. {type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rank: *
              </label>
              <div className="space-y-2">
                {COMMUNITY_RANKS.map((rank, index) => (
                  <label key={rank} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="community_rank"
                      value={rank}
                      checked={currentClaim.rank === rank}
                      onChange={(e) => setCurrentClaim({...currentClaim, rank: e.target.value})}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{index + 1}. {rank}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level: *
              </label>
              <div className="space-y-2">
                {COMMUNITY_LEVELS.map((level, index) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="community_level"
                      value={level}
                      checked={currentClaim.level === level}
                      onChange={(e) => setCurrentClaim({...currentClaim, level: e.target.value})}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{index + 1}. {level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modality: *
              </label>
              <div className="space-y-2">
                {MODALITY_OPTIONS.map((modality, index) => (
                  <label key={modality} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="community_modality"
                      value={modality}
                      checked={currentClaim.modality === modality}
                      onChange={(e) => setCurrentClaim({...currentClaim, modality: e.target.value})}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{index + 1}. {modality}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Certificate: *
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = await onClaimFileUpload(file, 'community')
                    if (url) {
                      setCurrentClaim({...currentClaim, file_url: url})
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              {currentClaim.file_url && (
                <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={addClaim}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add This Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {formData.community_service_claims.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No community service claims added yet. Add at least one claim or enter "N/A".</p>
        </div>
      )}
    </div>
  )
}
