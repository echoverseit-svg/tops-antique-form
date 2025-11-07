# 📧 Email Notification Setup Guide

This guide will help you set up email notifications for application status updates.

---

## 🎯 Overview

The email notification system allows administrators to:
- Update application status (Pending → Under Review → Approved/Rejected)
- Send automated email notifications to applicants
- Add custom comments to emails
- Track email sending status

---

## 📋 Prerequisites

1. **Supabase Project** - Already set up ✅
2. **Resend Account** - Free tier available (100 emails/day)
3. **Domain (Optional)** - For custom "from" email address

---

## 🚀 Step-by-Step Setup

### **Step 1: Create Resend Account**

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### **Step 2: Get API Key**

1. In Resend Dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: `TOPS Antique Production`
4. Copy the API key (starts with `re_...`)
5. **Save it securely** - you can only see it once!

### **Step 3: Configure Sending Domain (Optional)**

For production, you should use your own domain:

1. In Resend Dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `topsantique.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually a few minutes)

**OR use Resend's test domain** for development:
- You can send emails to any address
- They'll show as from `onboarding@resend.dev`

### **Step 4: Deploy Supabase Edge Function**

#### Install Supabase CLI (if not installed)
```bash
# Windows (PowerShell)
scoop install supabase

# Or download from: https://github.com/supabase/cli/releases
```

#### Login to Supabase
```bash
supabase login
```

#### Link Your Project
```bash
cd "d:\EchoverseIT\New Version ticket support\Tops Antique form"
supabase link --project-ref YOUR_PROJECT_REF
```

To find your project ref:
- Go to Supabase Dashboard
- Your project URL is: `https://YOUR_PROJECT_REF.supabase.co`

#### Set Environment Variables
```bash
# Set Resend API Key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Set From Email (use your verified domain or resend test)
supabase secrets set FROM_EMAIL="TOPS Antique <noreply@topsantique.com>"
```

#### Deploy the Function
```bash
supabase functions deploy send-status-email
```

You should see:
```
✓ Deployed Function send-status-email
```

### **Step 5: Test the Email System**

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to `/admin` and login

3. You should see in each application row:
   - Status dropdown (Pending, Under Review, Approved, Rejected)
   - Comments textarea
   - "Email Status" button

4. Try sending a test email:
   - Select a status
   - (Optional) Add comments
   - Click "Email Status to [email]"
   - Check if email was received

---

## 🎨 Email Templates

The system includes beautiful HTML email templates with:
- **Color-coded status badges**
  - 🟡 Pending (Amber)
  - 🔵 Under Review (Blue)
  - 🟢 Approved (Green)
  - 🔴 Rejected (Red)
- **Responsive design** for mobile and desktop
- **Status token display** for easy reference
- **Custom comments section** (optional)
- **Direct link** to status check page

### Email Preview

```
┌──────────────────────────────────────┐
│   🎉 TOPS Antique                    │
│   21st Ten Outstanding Pupils...     │
├──────────────────────────────────────┤
│                                      │
│   Dear John Doe,                     │
│                                      │
│   ┌────────────────────────────┐    │
│   │     🎉                      │    │
│   │  Congratulations!           │    │
│   │  Application Approved       │    │
│   └────────────────────────────┘    │
│                                      │
│   We are pleased to inform you...   │
│                                      │
│   📝 Additional Comments:            │
│   Great performance in academics!    │
│                                      │
│   🔍 Check Full Status               │
│                                      │
│   Your Status Token:                 │
│   ABCD-EFGH-JKLM                    │
│                                      │
├──────────────────────────────────────┤
│   Questions? Contact us              │
│   © 2025 TOPS Antique Program        │
└──────────────────────────────────────┘
```

---

## ⚙️ Configuration

### Environment Variables

Add to your `.env` file (for reference only):
```env
# These are set in Supabase, not in .env
# RESEND_API_KEY=re_your_key_here
# FROM_EMAIL=TOPS Antique <noreply@topsantique.com>
```

### Email Sending Limits

**Resend Free Tier:**
- 100 emails/day
- 3,000 emails/month
- Test domain included

**Paid Plans:**
- From $20/month for 10,000 emails
- Custom domain required

---

## 🔍 Troubleshooting

### **Error: "Email service not configured"**

**Cause:** Supabase Edge Function can't find `RESEND_API_KEY`

**Fix:**
```bash
supabase secrets set RESEND_API_KEY=re_your_key_here
```

### **Error: "Failed to send email via Supabase function"**

**Cause:** Edge Function not deployed or failed

**Fix:**
1. Check if function is deployed:
   ```bash
   supabase functions list
   ```
2. Redeploy if needed:
   ```bash
   supabase functions deploy send-status-email
   ```

### **Email not received**

**Check:**
1. ✅ Email address is correct in application
2. ✅ Check spam/junk folder
3. ✅ Resend domain is verified (if using custom domain)
4. ✅ Check Resend Dashboard → Logs for delivery status

### **"Domain not verified" error**

**Cause:** Using custom domain that's not verified

**Fix:**
- Use Resend test domain: `onboarding@resend.dev`
- Or verify your domain in Resend Dashboard

---

## 📊 Usage in Admin Dashboard

### **Update Status Only**
1. Select new status from dropdown
2. Status updates immediately
3. No email sent

### **Update Status + Email**
1. Select new status
2. (Optional) Add comments in textarea
3. Click "Email Status to [email]"
4. Confirms status update + sends email

### **Email Features**
- **Loading state**: Button shows "Sending..." with spinner
- **Disabled state**: If no email address in application
- **Success message**: Alert confirms email sent
- **Error handling**: Shows helpful error messages

---

## 🎯 Best Practices

### When to Send Emails

✅ **DO send emails when:**
- Application moves from Pending → Under Review
- Application is Approved
- Application is Rejected
- Adding important comments/feedback

❌ **DON'T spam applicants:**
- Sending multiple emails for same status
- Sending without meaningful updates
- Testing on real applicant emails

### Comment Guidelines

**Good comments:**
- "Congratulations on your outstanding academic achievements!"
- "Please submit additional documentation for verification."
- "Your interview is scheduled for March 15, 2025."

**Avoid:**
- Generic or empty comments
- Overly critical or negative language
- Personal information or sensitive data

---

## 🔐 Security Notes

### API Key Protection
- ✅ API key stored in Supabase Secrets (secure)
- ✅ Not exposed to client-side code
- ✅ Only Edge Function can access it

### Email Privacy
- ✅ Emails sent individually (not CC/BCC)
- ✅ No email addresses exposed to other applicants
- ✅ Status tokens are unique and private

---

## 🚀 Production Deployment

### Checklist

- [ ] Resend account created
- [ ] API key obtained and set in Supabase
- [ ] Custom domain verified (or using test domain)
- [ ] Edge Function deployed successfully
- [ ] Test email sent and received
- [ ] Email templates reviewed and approved
- [ ] FROM_EMAIL configured with proper name
- [ ] Monitor Resend Dashboard for delivery rates

### Post-Deployment

1. **Monitor email delivery:**
   - Check Resend Dashboard → Logs
   - Track opens and clicks (if enabled)
   - Watch for bounce/spam reports

2. **Upgrade plan if needed:**
   - Free tier: 100 emails/day
   - Track usage in Resend Dashboard
   - Upgrade before hitting limits

3. **Set up alerts:**
   - Resend can notify you of delivery issues
   - Monitor bounce rates
   - Check spam complaint rates

---

## 📞 Support

### Resend Support
- Docs: [resend.com/docs](https://resend.com/docs)
- Support: support@resend.com
- Status: [status.resend.com](https://status.resend.com)

### Supabase Edge Functions
- Docs: [supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)
- Discord: supabase.com/discord

---

## 🎉 You're All Set!

Your email notification system is ready to use! 

**Quick Test:**
1. Go to admin dashboard
2. Select an application
3. Change status to "Under Review"
4. Add comment: "Testing email system"
5. Click "Email Status to [email]"
6. Check inbox ✅

**Need help?** Review this guide or check the troubleshooting section above.

---

**Last Updated:** November 7, 2025  
**Version:** 1.0.0
