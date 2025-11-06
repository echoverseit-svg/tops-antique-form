import { useState, useEffect } from 'react'
import TOPSMultiStepForm from './components/TOPSMultiStepForm'
import AdminDashboard from './pages/AdminDashboard'
import StatusPage from './pages/StatusPage'
import { CheckCircle, Shield, Lock, Key, Search } from 'lucide-react'

function App() {
  const [submitted, setSubmitted] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [lastToken, setLastToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [accessCode, setAccessCode] = useState('')
    const [showCode, setShowCode] = useState(false)
  const [accessError, setAccessError] = useState('')

  // Access code - Change this to your desired code
  const VALID_ACCESS_CODE = 'TOPS2025'

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessCode === VALID_ACCESS_CODE) {
      setIsAuthorized(true)
      setAccessError('')
      sessionStorage.setItem('form_authorized', 'true')
    } else {
      setAccessError('Invalid access code. Please contact the administrator.')
      setAccessCode('')
    }
  }

  useEffect(() => {
    // Check for reset parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('reset') === 'true') {
      sessionStorage.removeItem('form_authorized')
      sessionStorage.removeItem('admin_authenticated')
      window.history.replaceState({}, '', window.location.pathname)
      return
    }
    
    // Check if already authorized in this session
    const authorized = sessionStorage.getItem('form_authorized')
    if (authorized === 'true') {
      setIsAuthorized(true)
    }
  }, [])

  // Check if URL has /admin
  if (window.location.pathname === '/admin' || showAdmin) {
    return <AdminDashboard />
  }

  // If visiting /status show the public status page
  if (window.location.pathname === '/status') {
    return <StatusPage />
  }

  // Show access code screen if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full backdrop-blur-sm border border-white/20 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">Access Required</h1>
            <p className="text-gray-600 font-medium">21st TOPS Antique Awards</p>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-3 rounded-full"></div>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
            <p className="text-sm text-amber-800">
              <strong>📋 For Authorized Applicants Only</strong><br/>
              Please enter the access code provided by your school or the TOPS committee.
            </p>
          </div>
          
          <form onSubmit={handleAccessSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-600" />
                Access Code
              </label>
                  <div className="relative">
                    <input
                      type={showCode ? "text" : "password"}
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white text-center text-lg font-semibold tracking-wider"
                      placeholder="ENTER CODE"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors"
                    >
                      {showCode ? (
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
            
            {accessError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-shake">
                <span className="text-lg">⚠️</span>
                {accessError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3.5 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              🚀 Access Application Form
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
              <span>🔒</span>
              Don't have an access code? Contact your school coordinator
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
                <p className="text-sm font-semibold">🏆 Official Application Portal</p>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              21st TOPS Antique Awards
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 mb-3 font-medium">
              Ten Outstanding Pupils and Students
            </p>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Complete all 7 sections to submit your application. Showcase your academic excellence, leadership, and community service achievements.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-amber-100">Sections</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                <p className="text-2xl font-bold">64</p>
                <p className="text-sm text-amber-100">Fields</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                <p className="text-2xl font-bold">~15</p>
                <p className="text-sm text-amber-100">Minutes</p>
              </div>
            </div>
            
            {/* Admin Access & Status Buttons */}
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setShowAdmin(true)}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl transition-all duration-200 font-medium border border-white/30 text-sm"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </button>

              <a
                href="/status"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl transition-all duration-200 font-medium border border-white/20 text-sm text-white/90"
              >
                <Search className="w-4 h-4" />
                View Status
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {submitted ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-10 text-center border border-gray-100 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-2 text-lg">
              Thank you for your submission! 🎉
            </p>
            <p className="text-gray-500 mb-8 text-sm">
              We will review your application and contact you soon via email.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-left">
              <p className="text-sm text-green-800">
                <strong>✓ What's Next?</strong><br/>
                • Check your email for confirmation<br/>
                • Keep your documents ready<br/>
                • Wait for our review team to contact you
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              {lastToken && (
                <div className="w-full max-w-md bg-gray-50 border border-gray-100 rounded-lg p-4 text-left">
                  <label className="text-sm font-medium text-gray-700">Your status token</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      readOnly
                      value={lastToken}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md bg-white text-sm font-mono"
                    />
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(lastToken)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        } catch (err) {
                          // fallback
                          const el = document.createElement('textarea')
                          el.value = lastToken
                          document.body.appendChild(el)
                          el.select()
                          document.execCommand('copy')
                          document.body.removeChild(el)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }
                      }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm"
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Save this token or the link to check your application status later. Anyone with this token can view the public status.</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                {lastToken && (
                  <a
                    href={`/status?token=${encodeURIComponent(lastToken)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-amber-600 px-6 py-3 rounded-xl font-semibold border border-amber-600 hover:bg-amber-50"
                  >
                    🔎 View Status
                  </a>
                )}

                <button
                  onClick={() => {
                    setSubmitted(false)
                    setLastToken(null)
                  }}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3.5 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          </div>
        ) : (
          <TOPSMultiStepForm onSuccess={(token) => {
            setSubmitted(true)
            if (token) setLastToken(token)
          }} />
        )}
      </div>
    </div>
  )
}

export default App
