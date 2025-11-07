# 📧 Email Notifications - Quick Start

## ✅ What's Already Done

✅ Email templates created (HTML + Plain Text)  
✅ Supabase Edge Function created  
✅ Admin dashboard UI updated  
✅ Status update functionality added  

---

## 🚀 3-Minute Setup

### 1. Get Resend API Key
```
1. Go to resend.com and sign up
2. Get API key from dashboard
3. Copy it (starts with "re_...")
```

### 2. Deploy to Supabase
```bash
# Login to Supabase CLI
supabase login

# Link project
supabase link

# Set secrets
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set FROM_EMAIL="TOPS Antique <noreply@resend.dev>"

# Deploy function
supabase functions deploy send-status-email
```

### 3. Test It!
```
1. Start dev server: npm run dev
2. Go to /admin
3. Select an application
4. Change status dropdown
5. Add optional comments
6. Click "Email Status to [email]"
7. ✅ Done!
```

---

## 📊 How It Works in Admin Dashboard

Each application now has:

```
┌────────────────────────────────┐
│ [Review] [Download] [Delete]   │ ← Existing buttons
├────────────────────────────────┤
│ Status: [Under Review ▼]       │ ← Change status
│                                │
│ ┌────────────────────────────┐ │
│ │ Add comments for email...  │ │ ← Optional message
│ └────────────────────────────┘ │
│                                │
│ [📧 Email Status to john...]   │ ← Send email
└────────────────────────────────┘
```

---

## 🎨 Email Features

**4 Status Types:**
- 🟡 **Pending** - Application received
- 🔵 **Under Review** - Being evaluated
- 🟢 **Approved** - Congratulations!
- 🔴 **Rejected** - Status update

**What Applicants Get:**
- Beautiful HTML email with status badge
- Their unique status token (e.g., ABCD-EFGH-JKLM)
- Your custom comments (if added)
- Direct link to check status page
- Contact information

---

## ⚡ Usage Tips

### Update Status Only (No Email)
Just change the dropdown - saves automatically

### Send Email Notification
1. **Select status** from dropdown
2. **Add comments** (optional but recommended)
3. **Click email button**
4. Wait for ✅ confirmation

### Best Practices
- ✅ Add helpful comments when sending emails
- ✅ Double-check status before sending
- ✅ Use test email addresses during testing
- ❌ Don't spam applicants with multiple emails

---

## 🔧 Troubleshooting

| Error | Fix |
|-------|-----|
| "Email service not configured" | Set `RESEND_API_KEY` in Supabase secrets |
| "Failed to send email" | Redeploy function: `supabase functions deploy send-status-email` |
| Email not received | Check spam folder, verify email address |
| "Domain not verified" | Use `onboarding@resend.dev` or verify domain in Resend |

---

## 📝 Files Created

```
src/lib/emailTemplates.ts              ← Email HTML/text templates
supabase/functions/send-status-email/  ← Edge function
  └── index.ts
EMAIL_SETUP_GUIDE.md                   ← Full documentation
EMAIL_QUICK_START.md                   ← This file
```

---

## 🎯 Next Steps

1. **Test locally** - Send yourself a test email
2. **Review templates** - Customize if needed
3. **Deploy to production** - Follow setup guide
4. **Monitor delivery** - Check Resend dashboard

**Full documentation:** See `EMAIL_SETUP_GUIDE.md`

---

**Ready to go!** 🚀

Just complete the 3-minute setup above and you're ready to send emails!
