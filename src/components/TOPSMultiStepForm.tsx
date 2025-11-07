import { useState, FormEvent, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { TOPSFormData } from '../types'
import { Loader2, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import GeneralInfoSection from './sections/GeneralInfoSection'
import SchoolDetailsSection from './sections/SchoolDetailsSection'
import RequirementsSection from './sections/RequirementsSection'
import AcademicProfileSection from './sections/AcademicProfileSection'
import LeadershipProfileSection from './sections/LeadershipProfileSection'
import CommunityServiceSection from './sections/CommunityServiceSection'
import DataPrivacySection from './sections/DataPrivacySection'
import { AutofillButton } from './AutofillButton'

interface TOPSMultiStepFormProps {
  // onSuccess receives the public token generated for the applicant so the
  // parent can show a "View Status" button or save it for later.
  onSuccess: (publicToken?: string) => void
}

export default function TOPSMultiStepForm({ onSuccess }: TOPSMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [tempUploadedFiles, setTempUploadedFiles] = useState<string[]>([])

  // Cleanup temporary files when component unmounts or page is closed/refreshed
  useEffect(() => {
    const cleanup = async () => {
      for (const filePath of tempUploadedFiles) {
        try {
          const fileName = filePath.split('/').pop() // Get filename from URL
          if (fileName) {
            await supabase.storage.from('tops-uploads').remove([fileName])
          }
        } catch (err) {
          console.error('Error cleaning up file:', err)
        }
      }
    }

    // Add cleanup for page unload
    window.addEventListener('beforeunload', cleanup)
    
    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', cleanup)
      cleanup()
    }
  }, [tempUploadedFiles])

  const [formData, setFormData] = useState<TOPSFormData>({
    full_name: '',
    complete_address: '',
    municipality: '',
    phone_number: '',
    email: '',
    birthday: '',
    age: 0,
    sex: '',
    school_level: '',
    school_name: '',
    school_address: '',
    school_head_name: '',
    school_head_email: '',
    school_head_mobile: '',
    class_advisor_name: '',
    class_advisor_email: '',
    class_advisor_mobile: '',
    academic_claims: [],
    leadership_claims: [],
    community_service_claims: [],
    data_privacy_accepted: false
  })

  const totalSteps = 7

  const stepTitles = [
    'General Information',
    'School Details',
    'Requirements',
    'Academic Profile',
    'Leadership Profile',
    'Community Service',
    'Data Privacy & Submit'
  ]

  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return

    // File size validation (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setError(`File "${file.name}" is too large. Maximum file size is 5MB.`)
      return
    }

    // File type validation
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`File type "${file.type}" is not allowed. Please upload PDF, JPG, or PNG files only.`)
      return
    }

    setUploadingFile(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      // Remove previous file for this field if exists
      const previousUrl = formData[fieldName as keyof TOPSFormData] as string
      if (previousUrl) {
        const previousFileName = previousUrl.split('/').pop()
        if (previousFileName) {
          await supabase.storage.from('tops-uploads').remove([previousFileName])
          setTempUploadedFiles(files => files.filter(f => !f.includes(previousFileName)))
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('tops-uploads')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tops-uploads')
        .getPublicUrl(filePath)

      // Add to temp uploads tracking
      setTempUploadedFiles(files => [...files, publicUrl])

      setFormData(prev => ({
        ...prev,
        [fieldName]: publicUrl
      }))
    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload file. Please try again.')
    } finally {
      setUploadingFile(false)
    }
  }

  const handleClaimFileUpload = async (file: File, claimType: 'academic' | 'leadership' | 'community') => {
    if (!file) return null

    // File size validation (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setError(`File "${file.name}" is too large. Maximum file size is 5MB.`)
      return null
    }

    // File type validation
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`File type "${file.type}" is not allowed. Please upload PDF, JPG, or PNG files only.`)
      return null
    }

    setUploadingFile(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${claimType}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('tops-uploads')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('tops-uploads')
        .getPublicUrl(filePath)

      // Add to temp uploads tracking
      setTempUploadedFiles(files => [...files, publicUrl])

      return publicUrl
    } catch (err) {
      console.error('Error uploading claim file:', err)
      setError('Failed to upload file. Please try again.')
      return null
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.data_privacy_accepted) {
      setError('Please accept the data privacy terms to continue')
      return
    }

    // Confirmation dialog
    const confirmed = window.confirm(
      '⚠️ IMPORTANT NOTICE\n\n' +
      'Once submitted, no further edits can be made to your application.\n\n' +
      'Please review all information carefully before submitting.\n\n' +
      'Are you sure you want to submit your application?'
    )

    if (!confirmed) {
      return // User cancelled
    }

    setLoading(true)
    setError(null)

    try {
      // Generate a shorter, user-friendly public token (12 characters)
      // Format: XXXX-XXXX-XXXX (easier to read and share)
      const generateToken = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed similar chars (I,O,0,1)
        const segments = 3
        const segmentLength = 4
        
        return Array.from({ length: segments }, () => 
          Array.from({ length: segmentLength }, () => 
            chars[Math.floor(Math.random() * chars.length)]
          ).join('')
        ).join('-')
      }
      
      const publicToken = generateToken()

      // Ensure JSON/JSONB columns are passed as native arrays/objects (not stringified)
      const payload = {
        ...formData,
        academic_claims: formData.academic_claims,
        leadership_claims: formData.leadership_claims,
        community_service_claims: formData.community_service_claims,
        public_status_token: publicToken
      }

      const { data: insertData, error: insertError } = await supabase
        .from('tops_applications')
        .insert([payload])
        .select()

      console.debug('Insert result:', { data: insertData, error: insertError })
      
      if (insertError) {
        const msg = insertError?.message || 'Failed to submit application'
        throw new Error(msg)
      }

      // Clear temporary files tracking since they're now permanent
      setTempUploadedFiles([])

      // Success alert with status-check link
      const statusUrl = `${window.location.origin}/status?token=${publicToken}`
      alert(
        '✅ APPLICATION SUBMITTED SUCCESSFULLY!\n\n' +
        'Thank you for submitting your application for the 21st TOPS Antique Awards.\n\n' +
        'You can check your application status at the link below:\n' +
        `${statusUrl}\n\n` +
        'Please save this link or the token. Anyone with this link can view your public status.\n\n' +
        'Good luck!'
      )

      // Let parent know and pass the token so it can show a dedicated View Status button
      onSuccess(publicToken)
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the form')
      alert('❌ SUBMISSION FAILED\n\nThere was an error submitting your application. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // General Information
        if (!formData.full_name || !formData.complete_address || !formData.municipality || 
            !formData.phone_number || !formData.email || !formData.birthday || 
            !formData.age || !formData.sex) {
          alert('Please fill in all required fields in General Information before proceeding.')
          return false
        }
        break
      case 2: // School Details
        if (!formData.school_level || !formData.school_name || !formData.school_address ||
            !formData.school_head_name || !formData.school_head_email || !formData.school_head_mobile ||
            !formData.class_advisor_name || !formData.class_advisor_email || !formData.class_advisor_mobile) {
          alert('Please fill in all required fields in School Details before proceeding.')
          return false
        }
        break
      case 3: // Requirements
        if (!formData.nomination_letter_url || !formData.academic_records_url || 
            !formData.certificate_truthfulness_url || !formData.photo_2x2_url) {
          alert('Please upload all required documents before proceeding.')
          return false
        }
        break
    }
    return true
  }

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <GeneralInfoSection formData={formData} setFormData={setFormData} />
      case 2:
        return <SchoolDetailsSection formData={formData} setFormData={setFormData} />
      case 3:
        return (
          <RequirementsSection
            formData={formData}
            setFormData={setFormData}
            onFileUpload={handleFileUpload}
            uploadingFile={uploadingFile}
          />
        )
      case 4:
        return (
          <AcademicProfileSection
            formData={formData}
            setFormData={setFormData}
            onClaimFileUpload={handleClaimFileUpload}
          />
        )
      case 5:
        return (
          <LeadershipProfileSection
            formData={formData}
            setFormData={setFormData}
            onClaimFileUpload={handleClaimFileUpload}
          />
        )
      case 6:
        return (
          <CommunityServiceSection
            formData={formData}
            setFormData={setFormData}
            onClaimFileUpload={handleClaimFileUpload}
          />
        )
      case 7:
        return <DataPrivacySection formData={formData} setFormData={setFormData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-600">{stepTitles[currentStep - 1]}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-amber-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index + 1 === currentStep
                  ? 'text-amber-600'
                  : index + 1 < currentStep
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 ${
                  index + 1 === currentStep
                    ? 'bg-amber-600 text-white'
                    : index + 1 < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs text-center hidden md:block">{title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={(e) => {
        e.preventDefault()
        if (currentStep < totalSteps) {
          // Validate and move to next step
          if (validateCurrentStep()) {
            nextStep()
          }
        } else {
          // Final submit
          handleSubmit(e)
        }
      }}>
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <AutofillButton onFill={(data) => setFormData({ ...formData, ...data })} />
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center bg-white rounded-lg shadow-xl p-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !formData.data_privacy_accepted}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
