import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function StatusPage() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    setData(null)

    try {
      // Try server-side API first if available
      const apiBase = (import.meta.env && import.meta.env.VITE_STATUS_API_URL) ? import.meta.env.VITE_STATUS_API_URL : ''
      
      if (apiBase) {
        // Use server-side API (production/deployed)
        const base = apiBase.replace(/\/$/, '')
        const url = `${base}/api/status?token=${encodeURIComponent(token)}`
        const res = await fetch(url)
        
        if (res.ok) {
          const json = await res.json()
          setData(json)
          return
        }
      }
      
      // Fallback: Query Supabase directly (works in development)
      const { data: apps, error: appError } = await supabase
        .from('tops_applications')
        .select('id, full_name, email, municipality, status, created_at')
        .eq('public_status_token', token)
        .limit(1)
      
      if (appError) {
        throw new Error('Database error: ' + appError.message)
      }
      
      if (!apps || apps.length === 0) {
        throw new Error('No application found with this token. Please check your token and try again.')
      }
      
      const appRow = apps[0]
      
      // Fetch public comments if the table exists
      let comments: any[] = []
      try {
        const { data: commentsData } = await supabase
          .from('application_comments')
          .select('id, comment_text, created_at')
          .eq('application_id', appRow.id)
          .eq('is_internal', false)
          .order('created_at', { ascending: true })
        
        comments = commentsData || []
      } catch (e) {
        // Comments table might not exist, that's okay
        console.log('Comments table not available')
      }
      
      setData({ ...appRow, comments })
    } catch (err: any) {
      const msg = err?.message || 'Error fetching status'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Auto-load token from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (t) {
      setToken(t)
      // delay to allow state to update
      setTimeout(() => fetchStatus(), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Check Application Status</h1>
            <p className="text-sm text-gray-600">Enter the token or open the link you were given after submission.</p>
          </div>
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-100 hover:bg-amber-100 text-sm"
            >
              ← Back to Main Menu
            </a>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your token here"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
          />
          <button onClick={fetchStatus} disabled={loading || !token} className="px-4 py-2 bg-amber-600 text-white rounded-lg">
            {loading ? 'Checking...' : 'Check'}
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {data && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold">{data.full_name}</h2>
              <p className="text-sm text-gray-600">Status: <span className="font-medium">{data.status}</span></p>
              <p className="text-sm text-gray-500">Submitted: {new Date(data.created_at).toLocaleString()}</p>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">Public Comments</h3>
              {data.comments && data.comments.length > 0 ? (
                <div className="space-y-2">
                  {data.comments.map((c: any) => (
                    <div key={c.id} className="p-3 bg-white border rounded">
                      <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
                      <div className="mt-1 text-gray-800">{c.comment_text}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No public comments yet.</p>
              )}
            </div>
          </div>
        )}

        {!data && !error && (
          <div className="text-sm text-gray-500 mt-4">If you don't have a token, contact the administrator and provide your application details.</div>
        )}
      </div>
    </div>
  )
}
