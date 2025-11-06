// Vercel Serverless Function: /api/status
// This function must run on the server and use the SUPABASE_SERVICE_ROLE_KEY env var (server-only).
const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const token = req.query?.token || null
    if (!token) return res.status(400).json({ error: 'token query parameter is required' })

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Missing Supabase environment variables on server' })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch the application by token
    const { data: apps, error: appError } = await supabase
      .from('tops_applications')
      .select('id, full_name, email, municipality, status, created_at')
      .eq('public_status_token', token)
      .limit(1)

    if (appError) {
      console.error('Supabase error fetching application:', appError)
      return res.status(500).json({ error: 'Database error' })
    }

    if (!apps || apps.length === 0) return res.status(404).json({ error: 'Not found' })

    const appRow = apps[0]

    // Fetch public comments (non-internal)
    const { data: comments, error: commentsError } = await supabase
      .from('application_comments')
      .select('id, comment_text, created_at')
      .eq('application_id', appRow.id)
      .eq('is_internal', false)
      .order('created_at', { ascending: true })

    if (commentsError) {
      console.error('Supabase error fetching comments:', commentsError)
      return res.status(500).json({ error: 'Database error' })
    }

    return res.status(200).json({ ...appRow, comments })
  } catch (err) {
    console.error('Unexpected server error in /api/status:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
