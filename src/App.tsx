import { useState } from 'react'
import TOPSMultiStepForm from './components/TOPSMultiStepForm'
import AdminDashboard from './pages/AdminDashboard'
import { CheckCircle, Shield } from 'lucide-react'

function App() {
  const [submitted, setSubmitted] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  // Check if URL has /admin
  if (window.location.pathname === '/admin' || showAdmin) {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            21st TOPS Antique Search
          </h1>
          <p className="text-lg text-amber-700">Ten Outstanding Pupils and Students - Application Form</p>
          <p className="text-sm text-amber-600 mt-2">Complete all 7 sections to submit your application</p>
          
          {/* Admin Access Button */}
          <button
            onClick={() => setShowAdmin(true)}
            className="mt-4 text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1 mx-auto"
          >
            <Shield className="w-4 h-4" />
            Admin Dashboard
          </button>
        </header>

        {submitted ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your submission. We will review your application and contact you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
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
