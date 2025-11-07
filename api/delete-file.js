// Vercel Serverless Function: /api/delete-file
// Expects POST { fileName }
const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { fileName } = req.body || {}
    if (!fileName) return res.status(400).json({ error: 'fileName is required' })

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Server missing Supabase env vars' })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { error } = await supabase.storage.from('tops-uploads').remove([fileName])
    if (error) {
      console.error('Error deleting storage file:', error)
      return res.status(500).json({ error: 'Failed to delete file', details: error })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unexpected error in /api/delete-file:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
