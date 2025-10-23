import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Download, FileText, Users, Calendar, Search, Filter } from 'lucide-react'

interface Application {
  id: string
  full_name: string
  email: string
  phone_number: string
  municipality: string
  school_name: string
  school_level: string
  academic_claims: any[]
  leadership_claims: any[]
  community_service_claims: any[]
  created_at: string
  [key: string]: any
}

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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-amber-600 mb-2">Admin Login</h1>
            <p className="text-gray-600">21st TOPS Antique Awards</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Login
            </button>
          </form>
          
          <p className="text-xs text-gray-500 text-center mt-6">
            Contact administrator if you forgot your password
          </p>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Users className="w-8 h-8 text-amber-600" />
                TOPS Applications Dashboard
              </h1>
              <p className="text-gray-600 mt-1">21st Ten Outstanding Pupils and Students - Antique</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <button
                onClick={() => {
                  sessionStorage.removeItem('admin_authenticated')
                  setIsAuthenticated(false)
                }}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Logout
              </button>
              <div>
                <p className="text-2xl font-bold text-amber-600">{applications.length}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Basic CSV
            </button>
            <button
              onClick={downloadExpandedCSV}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              All Claims CSV (Excel)
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>
            <button
              onClick={downloadDetailedReport}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Detailed JSON Report
            </button>
            <button
              onClick={() => setShowFiles(!showFiles)}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {showFiles ? 'Hide' : 'View'} Uploaded Files ({uploadedFiles.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
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
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(app.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(app.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
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
