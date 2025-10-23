import { useState, useEffect } from 'react'
import TOPSMultiStepForm from './components/TOPSMultiStepForm'
import AdminDashboard from './pages/AdminDashboard'
import { CheckCircle, Shield, Lock, Key } from 'lucide-react'

function App() {
  const [submitted, setSubmitted] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [accessCode, setAccessCode] = useState('')
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
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-gray-50 hover:bg-white text-center text-lg font-semibold tracking-wider"
                placeholder="ENTER CODE"
                required
              />
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
            
            {/* Admin Access Button */}
            <button
              onClick={() => setShowAdmin(true)}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl transition-all duration-200 font-medium border border-white/30 text-sm"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </button>
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
            <button
              onClick={() => setSubmitted(false)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3.5 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <TOPSMultiStepForm onSuccess={() => setSubmitted(true)} />
        )}
      </div>
    </div>
  )
}

export default App
