import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Download, FileText, Users, Calendar, Search, Filter, MessageCircle, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react'
import { Application, ApplicationStatus, APPLICATION_STATUS_LABELS } from '../types/admin'
import ApplicationDetails from '../components/ApplicationDetails'

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMunicipality, setFilterMunicipality] = useState('')
  const [filterSchoolLevel, setFilterSchoolLevel] = useState('')
  const [showFiles, setShowFiles] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  // Admin password - Change this to your desired password
  const ADMIN_PASSWORD = 'TOPS2025Admin'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError('')
      sessionStorage.setItem('admin_authenticated', 'true')
    } else {
      setLoginError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  useEffect(() => {
    // Check if already authenticated in this session
    const authenticated = sessionStorage.getItem('admin_authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications()
      fetchUploadedFiles()
    }
  }, [isAuthenticated])

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('tops_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      alert('Error loading applications. Make sure you are logged in.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUploadedFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('tops-uploads')
        .list()

      if (error) throw error
      setUploadedFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  const getFileOwner = (fileName: string) => {
    // Search through all applications to find who uploaded this file
    for (const app of applications) {
      // Check requirements
      if (app.nomination_letter_url?.includes(fileName)) return { name: app.full_name, type: 'Nomination Letter' }
      if (app.academic_records_url?.includes(fileName)) return { name: app.full_name, type: 'Academic Records' }
      if (app.certificate_truthfulness_url?.includes(fileName)) return { name: app.full_name, type: 'Certificate of Truthfulness' }
      if (app.photo_2x2_url?.includes(fileName)) return { name: app.full_name, type: 'Photo 2x2' }
      
      // Check claims
      const academicClaims = typeof app.academic_claims === 'string' ? JSON.parse(app.academic_claims) : (app.academic_claims || [])
      const leadershipClaims = typeof app.leadership_claims === 'string' ? JSON.parse(app.leadership_claims) : (app.leadership_claims || [])
      const communityClaims = typeof app.community_service_claims === 'string' ? JSON.parse(app.community_service_claims) : (app.community_service_claims || [])
      
      for (let i = 0; i < academicClaims.length; i++) {
        if (academicClaims[i].file_url?.includes(fileName)) {
          return { name: app.full_name, type: `Academic Claim #${i + 1}` }
        }
      }
      for (let i = 0; i < leadershipClaims.length; i++) {
        if (leadershipClaims[i].file_url?.includes(fileName)) {
          return { name: app.full_name, type: `Leadership Claim #${i + 1}` }
        }
      }
      for (let i = 0; i < communityClaims.length; i++) {
        if (communityClaims[i].file_url?.includes(fileName)) {
          return { name: app.full_name, type: `Community Service Claim #${i + 1}` }
        }
      }
    }
    return null
  }

  const downloadCSV = () => {
    if (applications.length === 0) {
      alert('No data to download')
      return
    }

    // Create CSV with BOM for proper Excel encoding
    const BOM = '\uFEFF'
    
    // Prepare CSV headers
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Municipality',
      'Birthday',
      'Age',
      'Sex',
      'School Level',
      'School Name',
      'School Address',
      'School Head Name',
      'School Head Email',
      'School Head Mobile',
      'Class Advisor Name',
      'Class Advisor Email',
      'Class Advisor Mobile',
      'Nomination Letter URL',
      'Academic Records URL',
      'Certificate Truthfulness URL',
      'Photo 2x2 URL',
      'Academic Claims Count',
      'Leadership Claims Count',
      'Community Service Claims Count',
      'Submitted At'
    ]

    // Prepare CSV rows with proper escaping
    const rows = applications.map(app => [
      app.id || '',
      app.full_name || '',
      app.email || '',
      app.phone_number || '',
      app.municipality || '',
      app.birthday || '',
      app.age || '',
      app.sex || '',
      app.school_level || '',
      app.school_name || '',
      app.school_address || '',
      app.school_head_name || '',
      app.school_head_email || '',
      app.school_head_mobile || '',
      app.class_advisor_name || '',
      app.class_advisor_email || '',
      app.class_advisor_mobile || '',
      app.nomination_letter_url || '',
      app.academic_records_url || '',
      app.certificate_truthfulness_url || '',
      app.photo_2x2_url || '',
      app.academic_claims?.length || 0,
      app.leadership_claims?.length || 0,
      app.community_service_claims?.length || 0,
      new Date(app.created_at).toLocaleString()
    ])

    // Escape function for CSV
    const escapeCSV = (cell: any) => {
      const str = String(cell)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    // Create CSV content with BOM
    const csvContent = BOM + [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `TOPS_Applications_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadJSON = () => {
    if (applications.length === 0) {
      alert('No data to download')
      return
    }

    const jsonContent = JSON.stringify(applications, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `tops_applications_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadDetailedReport = () => {
    if (applications.length === 0) {
      alert('No data to download')
      return
    }

    // Create detailed report with all claims
    const report = applications.map(app => ({
      ...app,
      academic_claims_details: app.academic_claims || [],
      leadership_claims_details: app.leadership_claims || [],
      community_service_claims_details: app.community_service_claims || []
    }))

    const jsonContent = JSON.stringify(report, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `TOPS_Detailed_Report_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadExpandedCSV = () => {
    if (applications.length === 0) {
      alert('No data to download')
      return
    }

    const BOM = '\uFEFF'
    const rows: string[][] = []

    // Add header with shorter names for better Excel display
    rows.push([
      'ID',
      'Name',
      'Email',
      'Phone',
      'Municipality',
      'School',
      'Level',
      'Type',
      'No',
      'Award',
      'Participation',
      'Rank',
      'Competition Level',
      'Modality',
      'Certificate Link',
      'Date'
    ])

    // Expand each application with all claims
    applications.forEach(app => {
      const baseInfo = [
        app.id,
        app.full_name,
        app.email,
        app.phone_number,
        app.municipality,
        app.school_name,
        app.school_level
      ]

      // Parse claims if they're strings
      const academicClaims = typeof app.academic_claims === 'string' 
        ? JSON.parse(app.academic_claims) 
        : (app.academic_claims || [])
      const leadershipClaims = typeof app.leadership_claims === 'string'
        ? JSON.parse(app.leadership_claims)
        : (app.leadership_claims || [])
      const communityClaims = typeof app.community_service_claims === 'string'
        ? JSON.parse(app.community_service_claims)
        : (app.community_service_claims || [])

      // Academic claims
      if (academicClaims && academicClaims.length > 0) {
        academicClaims.forEach((claim: any, index: number) => {
          rows.push([
            ...baseInfo,
            'Academic',
            String(index + 1),
            claim.name || '',
            claim.type_of_participation || '',
            claim.rank || '',
            claim.level || '',
            'N/A',
            claim.file_url || '',
            new Date(app.created_at).toLocaleDateString()
          ])
        })
      }

      // Leadership claims
      if (leadershipClaims && leadershipClaims.length > 0) {
        leadershipClaims.forEach((claim: any, index: number) => {
          rows.push([
            ...baseInfo,
            'Leadership',
            String(index + 1),
            claim.name || '',
            claim.type_of_participation || '',
            claim.rank || '',
            claim.level || '',
            claim.modality || '',
            claim.file_url || '',
            new Date(app.created_at).toLocaleDateString()
          ])
        })
      }

      // Community Service claims
      if (communityClaims && communityClaims.length > 0) {
        communityClaims.forEach((claim: any, index: number) => {
          rows.push([
            ...baseInfo,
            'Community Service',
            String(index + 1),
            claim.name || '',
            claim.type_of_participation || '',
            claim.rank || '',
            claim.level || '',
            claim.modality || '',
            claim.file_url || '',
            new Date(app.created_at).toLocaleDateString()
          ])
        })
      }

      // If no claims, add one row with basic info
      if (academicClaims.length === 0 && leadershipClaims.length === 0 && communityClaims.length === 0) {
        rows.push([
          ...baseInfo,
          'None',
          '0',
          '',
          '',
          '',
          '',
          '',
          '',
          new Date(app.created_at).toLocaleDateString()
        ])
      }
    })

    // Escape function
    const escapeCSV = (cell: any) => {
      const str = String(cell)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    // Create CSV
    const csvContent = BOM + rows.map(row => row.map(escapeCSV).join(',')).join('\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `TOPS_All_Claims_Expanded_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.municipality.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMunicipality = !filterMunicipality || app.municipality === filterMunicipality
    const matchesSchoolLevel = !filterSchoolLevel || app.school_level === filterSchoolLevel

    return matchesSearch && matchesMunicipality && matchesSchoolLevel
  })

  const municipalities = [...new Set(applications.map(app => app.municipality))]
  const schoolLevels = [...new Set(applications.map(app => app.school_level))]

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full backdrop-blur-sm border border-white/20 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">Admin Portal</h1>
            <p className="text-gray-600 font-medium">21st TOPS Antique Awards</p>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-3 rounded-full"></div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Password
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors"
                  aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                >
                  {showAdminPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {loginError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-shake">
                <span className="text-lg">⚠️</span>
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3.5 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              🚀 Access Dashboard
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
              <span>🔒</span>
              Secure admin access • Contact support for assistance
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">TOPS Dashboard</h1>
                    <p className="text-amber-100 text-sm mt-1">21st Ten Outstanding Pupils & Students - Antique</p>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-3">
                <button
                  onClick={() => {
                    sessionStorage.removeItem('admin_authenticated')
                    setIsAuthenticated(false)
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                  <span>🚪</span> Logout
                </button>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                  <p className="text-4xl font-bold">{applications.length}</p>
                  <p className="text-sm text-amber-100">Total Applications</p>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Basic CSV
              </button>
              <button
                onClick={downloadExpandedCSV}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                All Claims CSV
              </button>
              <button
                onClick={downloadJSON}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={downloadDetailedReport}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                Detailed Report
              </button>
              <button
                onClick={() => setShowFiles(!showFiles)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                {showFiles ? 'Hide' : 'View'} Files ({uploadedFiles.length})
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-600" />
            Search & Filter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-600" />
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or municipality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Municipality
              </label>
              <select
                value={filterMunicipality}
                onChange={(e) => setFilterMunicipality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Municipalities</option>
                {municipalities.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                School Level
              </label>
              <select
                value={filterSchoolLevel}
                onChange={(e) => setFilterSchoolLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                {schoolLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>

        {/* Uploaded Files Viewer */}
        {showFiles && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => {
                const fileUrl = `${supabase.storage.from('tops-uploads').getPublicUrl(file.name).data.publicUrl}`
                const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                const isPDF = file.name.match(/\.pdf$/i)
                const owner = getFileOwner(file.name)
                
                return (
                  <div key={file.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {isImage && (
                      <img 
                        src={fileUrl} 
                        alt={file.name}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                    )}
                    {isPDF && (
                      <div className="w-full h-40 bg-red-50 rounded mb-2 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-red-600" />
                      </div>
                    )}
                    {!isImage && !isPDF && (
                      <div className="w-full h-40 bg-gray-50 rounded mb-2 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {owner && (
                      <div className="mb-2 p-2 bg-blue-50 rounded">
                        <p className="text-xs font-semibold text-blue-900">{owner.name}</p>
                        <p className="text-xs text-blue-700">{owner.type}</p>
                      </div>
                    )}
                    <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.metadata?.size / 1024).toFixed(2)} KB
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(file.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        View
                      </a>
                      <a
                        href={fileUrl}
                        download
                        className="flex-1 text-center bg-green-600 text-white text-xs px-3 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
            {uploadedFiles.length === 0 && (
              <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
            )}
          </div>
        )}

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Application Review</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Reviewing application for <span className="font-semibold">{selectedApplication.full_name}</span>
                  </p>
                </div>
              </div>
              <div className="p-6">
                <ApplicationDetails
                  application={selectedApplication}
                  onStatusChange={(newStatus) => {
                    setApplications(apps =>
                      apps.map(app =>
                        app.id === selectedApplication.id
                          ? { ...app, status: newStatus }
                          : app
                      )
                    )
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Municipality</th>
                  <th className="px-4 py-3 text-left">School</th>
                  <th className="px-4 py-3 text-center">Claims</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app, index) => (
                  <tr key={app.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{app.full_name}</div>
                      <div className="text-sm text-gray-500">{app.phone_number}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.municipality}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{app.school_name}</div>
                      <div className="text-xs text-gray-500">{app.school_level}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2 text-xs">
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          A: {(() => {
                            const claims = typeof app.academic_claims === 'string' 
                              ? JSON.parse(app.academic_claims) 
                              : app.academic_claims
                            return claims?.length || 0
                          })()}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          L: {(() => {
                            const claims = typeof app.leadership_claims === 'string'
                              ? JSON.parse(app.leadership_claims)
                              : app.leadership_claims
                            return claims?.length || 0
                          })()}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          C: {(() => {
                            const claims = typeof app.community_service_claims === 'string'
                              ? JSON.parse(app.community_service_claims)
                              : app.community_service_claims
                            return claims?.length || 0
                          })()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium 
                        ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          app.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {app.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                         app.status === 'rejected' ? <AlertCircle className="w-4 h-4" /> :
                         app.status === 'under_review' ? <Loader2 className="w-4 h-4" /> :
                         <Clock className="w-4 h-4" />
                        }
                        {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(app.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(app.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Review
                      </button>
                      <button
                        onClick={() => {
                          // Create individual CSV for this applicant
                          const BOM = '\uFEFF'
                          const rows: string[][] = []
                          
                          // Header
                          rows.push(['Field', 'Value'])
                          
                          // Basic Info
                          rows.push(['Full Name', app.full_name])
                          rows.push(['Email', app.email])
                          rows.push(['Phone', app.phone_number])
                          rows.push(['Municipality', app.municipality])
                          rows.push(['Birthday', app.birthday])
                          rows.push(['Age', String(app.age)])
                          rows.push(['Sex', app.sex])
                          rows.push(['School Level', app.school_level])
                          rows.push(['School Name', app.school_name])
                          rows.push(['School Address', app.school_address])
                          rows.push(['Submitted', new Date(app.created_at).toLocaleString()])
                          rows.push(['', ''])
                          
                          // Requirements
                          rows.push(['REQUIREMENTS', ''])
                          rows.push(['Nomination Letter', app.nomination_letter_url || 'Not uploaded'])
                          rows.push(['Academic Records', app.academic_records_url || 'Not uploaded'])
                          rows.push(['Certificate of Truthfulness', app.certificate_truthfulness_url || 'Not uploaded'])
                          rows.push(['Photo 2x2', app.photo_2x2_url || 'Not uploaded'])
                          rows.push(['', ''])
                          
                          // Parse claims if they're strings
                          const academicClaims = typeof app.academic_claims === 'string' 
                            ? JSON.parse(app.academic_claims) 
                            : (app.academic_claims || [])
                          const leadershipClaims = typeof app.leadership_claims === 'string'
                            ? JSON.parse(app.leadership_claims)
                            : (app.leadership_claims || [])
                          const communityClaims = typeof app.community_service_claims === 'string'
                            ? JSON.parse(app.community_service_claims)
                            : (app.community_service_claims || [])
                          
                          // Academic Claims
                          rows.push(['ACADEMIC CLAIMS', ''])
                          if (academicClaims && academicClaims.length > 0) {
                            academicClaims.forEach((claim: any, i: number) => {
                              rows.push([`Claim ${i + 1}`, claim.name || ''])
                              rows.push(['  Type', claim.type_of_participation || ''])
                              rows.push(['  Rank', claim.rank || ''])
                              rows.push(['  Level', claim.level || ''])
                              rows.push(['  Certificate', claim.file_url || ''])
                              rows.push(['', ''])
                            })
                          } else {
                            rows.push(['No claims', ''])
                          }
                          rows.push(['', ''])
                          
                          // Leadership Claims
                          rows.push(['LEADERSHIP CLAIMS', ''])
                          if (leadershipClaims && leadershipClaims.length > 0) {
                            leadershipClaims.forEach((claim: any, i: number) => {
                              rows.push([`Claim ${i + 1}`, claim.name || ''])
                              rows.push(['  Type', claim.type_of_participation || ''])
                              rows.push(['  Rank', claim.rank || ''])
                              rows.push(['  Level', claim.level || ''])
                              rows.push(['  Modality', claim.modality || ''])
                              rows.push(['  Certificate', claim.file_url || ''])
                              rows.push(['', ''])
                            })
                          } else {
                            rows.push(['No claims', ''])
                          }
                          rows.push(['', ''])
                          
                          // Community Service Claims
                          rows.push(['COMMUNITY SERVICE CLAIMS', ''])
                          if (communityClaims && communityClaims.length > 0) {
                            communityClaims.forEach((claim: any, i: number) => {
                              rows.push([`Claim ${i + 1}`, claim.name || ''])
                              rows.push(['  Type', claim.type_of_participation || ''])
                              rows.push(['  Rank', claim.rank || ''])
                              rows.push(['  Level', claim.level || ''])
                              rows.push(['  Modality', claim.modality || ''])
                              rows.push(['  Certificate', claim.file_url || ''])
                              rows.push(['', ''])
                            })
                          } else {
                            rows.push(['No claims', ''])
                          }
                          
                          const escapeCSV = (cell: any) => {
                            const str = String(cell)
                            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                              return `"${str.replace(/"/g, '""')}"`
                            }
                            return str
                          }
                          
                          const csvContent = BOM + rows.map(row => row.map(escapeCSV).join(',')).join('\n')
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                          const url = URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.href = url
                          link.download = `${app.full_name.replace(/\s+/g, '_')}_Details.csv`
                          link.click()
                        }}
                        className="bg-amber-600 text-white px-3 py-1.5 rounded hover:bg-amber-700 transition-colors text-sm font-medium"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
