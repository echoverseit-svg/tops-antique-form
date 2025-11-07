// Vercel Serverless Function: /api/delete-application
// Expects POST { id }
const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'id is required' })

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Server missing Supabase env vars' })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch the application row
    const { data: apps, error: appError } = await supabase
      .from('tops_applications')
      .select('*')
      .eq('id', id)
      .limit(1)

    if (appError) {
      console.error('Error fetching application:', appError)
      return res.status(500).json({ error: 'Database error' })
    }
    if (!apps || apps.length === 0) return res.status(404).json({ error: 'Not found' })

    const app = apps[0]

    // Collect file names from known fields and claims
    const filesToDelete = []
    const collectFromUrl = (url) => {
      if (!url) return
      try {
        const u = new URL(url)
        const seg = u.pathname.split('/').pop()
        if (seg) filesToDelete.push(decodeURIComponent(seg))
      } catch (e) {
        const seg = url.split('/').pop()
        if (seg) filesToDelete.push(seg)
      }
    }

    collectFromUrl(app.nomination_letter_url)
    collectFromUrl(app.academic_records_url)
    collectFromUrl(app.certificate_truthfulness_url)
    collectFromUrl(app.photo_2x2_url)

    const parseClaims = (c) => {
      if (!c) return []
      if (typeof c === 'string') {
        try { return JSON.parse(c) } catch { return [] }
      }
      return c
    }

    const academicClaims = parseClaims(app.academic_claims)
    const leadershipClaims = parseClaims(app.leadership_claims)
    const communityClaims = parseClaims(app.community_service_claims)

    ;[...academicClaims, ...leadershipClaims, ...communityClaims].forEach(claim => collectFromUrl(claim?.file_url))

    // Remove files from storage (best-effort)
    if (filesToDelete.length > 0) {
      const { error: rmError } = await supabase.storage.from('tops-uploads').remove(filesToDelete)
      if (rmError) console.warn('Some storage files could not be removed:', rmError)
    }

    // Delete related comments and reviews first
    await supabase.from('application_comments').delete().eq('application_id', id)
    await supabase.from('application_reviews').delete().eq('application_id', id)

    // Delete the application
    const { error: delError } = await supabase.from('tops_applications').delete().eq('id', id)
    if (delError) {
      console.error('Error deleting application:', delError)
      return res.status(500).json({ error: 'Failed to delete application', details: delError })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unexpected server error in /api/delete-application:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
