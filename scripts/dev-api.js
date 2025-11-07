import express from 'express'
import bodyParser from 'body-parser'
import { createClient } from '@supabase/supabase-js'

const app = express()
const PORT = process.env.PORT || 3001
app.use(bodyParser.json())

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Endpoints will return 500 until set.')
}

const supabaseAdmin = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '')

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Local dev API running' })
})

app.post('/api/delete-file', async (req, res) => {
  try {
    const { fileName } = req.body
    if (!fileName) return res.status(400).json({ error: 'fileName is required' })
    if (!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' })

    const { error } = await supabaseAdmin.storage.from('tops-uploads').remove([fileName])
    if (error) {
      console.error('Supabase storage remove error:', error)
      return res.status(500).json({ error: error.message || error })
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
})

app.post('/api/delete-application', async (req, res) => {
  try {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'id is required' })
    if (!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' })
    if (!SUPABASE_URL) return res.status(500).json({ error: 'SUPABASE_URL not configured' })

    // Fetch application to know linked files
    const { data: appRow, error: fetchErr } = await supabaseAdmin
      .from('tops_applications')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (fetchErr) {
      console.error('Error fetching application:', fetchErr)
      return res.status(500).json({ error: fetchErr.message || fetchErr })
    }
    if (!appRow) return res.status(404).json({ error: 'Application not found' })

    const filesToDelete = new Set()
    const collectFileName = (url) => {
      if (!url) return
      try {
        const u = new URL(url)
        const parts = u.pathname.split('/')
        const name = parts.pop() || parts.pop()
        if (name) filesToDelete.add(decodeURIComponent(name))
      } catch (_) {
        const parts = String(url).split('/')
        const name = parts.pop()
        if (name) filesToDelete.add(name)
      }
    }

    collectFileName(appRow.nomination_letter_url)
    collectFileName(appRow.academic_records_url)
    collectFileName(appRow.certificate_truthfulness_url)
    collectFileName(appRow.photo_2x2_url)

    // Claims may be stored as arrays or JSON
    const academicClaims = Array.isArray(appRow.academic_claims) ? appRow.academic_claims : (appRow.academic_claims ? JSON.parse(appRow.academic_claims) : [])
    const leadershipClaims = Array.isArray(appRow.leadership_claims) ? appRow.leadership_claims : (appRow.leadership_claims ? JSON.parse(appRow.leadership_claims) : [])
    const communityClaims = Array.isArray(appRow.community_service_claims) ? appRow.community_service_claims : (appRow.community_service_claims ? JSON.parse(appRow.community_service_claims) : [])

    ;[...academicClaims, ...leadershipClaims, ...communityClaims].forEach(c => collectFileName(c?.file_url))

    // Attempt to delete files (best-effort)
    const files = Array.from(filesToDelete)
    if (files.length > 0) {
      const { error: remErr } = await supabaseAdmin.storage.from('tops-uploads').remove(files)
      if (remErr) console.warn('Some files could not be deleted:', remErr)
    }

    // Delete related rows
    const { error: commentErr } = await supabaseAdmin.from('application_comments').delete().eq('application_id', id)
    if (commentErr) console.warn('Error deleting comments:', commentErr)

    const { error: reviewErr } = await supabaseAdmin.from('application_reviews').delete().eq('application_id', id)
    if (reviewErr) console.warn('Error deleting reviews:', reviewErr)

    const { error: appDelErr } = await supabaseAdmin.from('tops_applications').delete().eq('id', id)
    if (appDelErr) {
      console.error('Error deleting application row:', appDelErr)
      return res.status(500).json({ error: appDelErr.message || appDelErr })
    }

    return res.json({ ok: true, deleted_files: files })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
})

// List applications (admin view)
app.get('/api/applications', async (req, res) => {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' })
    const { data, error } = await supabaseAdmin
      .from('tops_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return res.status(500).json({ error: error.message || error })
    }
    return res.json({ data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
})

// List storage files
app.get('/api/files', async (req, res) => {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' })
    const { data, error } = await supabaseAdmin.storage.from('tops-uploads').list('', { limit: 1000 })
    if (error) {
      console.error('Error listing files:', error)
      return res.status(500).json({ error: error.message || error })
    }
    // compute total bytes
    const total = (data || []).reduce((sum, f) => {
      const size = (f && (f.metadata?.size || f.size)) || 0
      return sum + Number(size)
    }, 0)
    return res.json({ data, total })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
})

// Table count helper
app.get('/api/table-count', async (req, res) => {
  try {
    const table = String(req.query.table || '')
    if (!table) return res.status(400).json({ error: 'table query parameter required' })
    const { count, error } = await supabaseAdmin.from(table).select('id', { count: 'exact', head: true })
    if (error) {
      console.error('Error counting table', table, error)
      return res.status(500).json({ error: error.message || error })
    }
    return res.json({ count: count || 0 })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
})

// Data overview: counts + storage total
app.get('/api/overview', async (req, res) => {
  try {
    const tables = ['tops_applications', 'application_reviews', 'application_comments', 'achievement_categories', 'reviewers']
    const counts = {}
    for (const t of tables) {
      const { count, error } = await supabaseAdmin.from(t).select('id', { count: 'exact', head: true })
      if (error) {
        console.warn('Error counting', t, error)
        counts[t] = null
      } else {
        counts[t] = count || 0
      }
    }
    // storage total
    const { data: files } = await supabaseAdmin.storage.from('tops-uploads').list('', { limit: 1000 })
    const total = (files || []).reduce((sum, f) => sum + Number((f && (f.metadata?.size || f.size)) || 0), 0)
    return res.json({ counts, storageTotalBytes: total, files: files || [] })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
})

app.listen(PORT, () => {
  console.log(`Dev API listening on http://localhost:${PORT}`)
  console.log('Ensure environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set before using admin delete endpoints')
})
