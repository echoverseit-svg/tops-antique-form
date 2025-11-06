/**
 * Example Node server endpoint to retrieve application status by token.
 * Usage: deploy as a secure server (Vercel/Netlify function, Heroku, etc.)
 * Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in server environment (do NOT expose to client).
 */
const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(express.json())

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app.get('/api/status', async (req, res) => {
  const token = req.query.token
  if (!token) return res.status(400).json({ error: 'token required' })

  try {
    // Fetch application by token
    const { data: apps, error: appError } = await supabase
      .from('tops_applications')
      .select('id, full_name, email, municipality, status, created_at')
      .eq('public_status_token', token)
      .limit(1)

    if (appError) throw appError
    if (!apps || apps.length === 0) return res.status(404).json({ error: 'Not found' })

    const appRow = apps[0]

    // Fetch public (non-internal) comments for this application
    const { data: comments, error: commentsError } = await supabase
      .from('application_comments')
      .select('id, comment_text, created_at')
      .eq('application_id', appRow.id)
      .eq('is_internal', false)
      .order('created_at', { ascending: true })

    if (commentsError) throw commentsError

    return res.json({ ...appRow, comments })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Status server listening on', port))
