module.exports = async (req, res) => {
  res.status(200).json({ ok: true, env: !!process.env.SUPABASE_SERVICE_ROLE_KEY })
}
