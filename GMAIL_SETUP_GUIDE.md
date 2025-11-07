# 📧 Gmail Setup Guide for Email Notifications

## ✅ Use Your Gmail Account to Send Emails!

Instead of Resend, you can use your existing Gmail account for free.

---

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Enable App Password in Gmail**

1. **Enable 2-Factor Authentication** (required for app passwords)
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select:
     - App: **Mail**
     - Device: **Other (Custom name)**
   - Enter name: `TOPS Antique Notifications`
   - Click **Generate**
   - **Copy the 16-character password** (format: xxxx xxxx xxxx xxxx)
   - ⚠️ Save it securely - you can't see it again!

### **Step 2: Deploy Gmail Function to Supabase**

```bash
# Login to Supabase (if not already)
supabase login

# Link your project (if not already)
supabase link

# Set Gmail credentials
supabase secrets set GMAIL_USER=your-email@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=your-16-char-app-password

# Deploy the Gmail function
supabase functions deploy send-status-email-gmail
```

### **Step 3: Update Admin Dashboard**

Update the function name in `AdminDashboard.tsx`:

**Find this line (around line 385):**
```typescript
const { error } = await supabase.functions.invoke('send-status-email', {
```

**Change to:**
```typescript
const { error } = await supabase.functions.invoke('send-status-email-gmail', {
```

### **Step 4: Test It!**

```bash
npm run dev
```

Go to admin dashboard and send a test email! ✅

---

## 📊 Gmail vs Resend Comparison

| Feature | Gmail (Free) | Resend (Free Tier) |
|---------|-------------|-------------------|
| **Cost** | 100% Free | Free (100/day) |
| **Daily Limit** | 500 emails/day | 100 emails/day |
| **Monthly Limit** | ~15,000/month | 3,000/month |
| **Setup** | App password | API key |
| **From Email** | Your Gmail | Custom domain or test |
| **Deliverability** | Good | Excellent |
| **Best For** | Small-medium use | Professional use |

---

## ⚙️ Gmail Configuration Details

### **SMTP Settings (Already configured in function):**
```
Host: smtp.gmail.com
Port: 465 (SSL)
Security: TLS/SSL
Auth: Your Gmail + App Password
```

### **Sending Limits:**
- **Personal Gmail:** 500 emails/day
- **Google Workspace:** 2,000 emails/day

### **Important Notes:**
✅ **Free forever** - No credit card needed  
✅ **Reliable** - Gmail's infrastructure  
✅ **Your email** - Sent from your address  
⚠️ **Daily limit** - 500 emails max  
⚠️ **App password required** - Can't use regular password  

---

## 🔧 Troubleshooting

### **Error: "Username and Password not accepted"**

**Cause:** Using regular Gmail password instead of App Password

**Fix:**
1. Generate new App Password (see Step 1 above)
2. Use the 16-character app password
3. Format: Remove spaces (xxxxxxxxxxxxxxxx)

### **Error: "Less secure app access"**

**Cause:** 2-Factor Authentication not enabled

**Fix:**
1. Enable 2FA on your Google Account
2. Then generate App Password

### **Error: "Daily sending quota exceeded"**

**Cause:** Sent more than 500 emails in 24 hours

**Fix:**
- Wait 24 hours for quota to reset
- Upgrade to Google Workspace for 2,000/day
- Or switch to Resend for higher limits

### **Emails going to spam**

**Fix:**
- Add SPF record to your domain
- Send test emails to yourself first
- Ask recipients to mark as "Not Spam"

---

## 🔒 Security Best Practices

### **App Password Safety:**
- ✅ Store only in Supabase secrets
- ✅ Never commit to git
- ✅ Regenerate if exposed
- ✅ Use unique password per app

### **Gmail Account Security:**
- ✅ Enable 2-Factor Authentication
- ✅ Use strong account password
- ✅ Monitor account activity
- ✅ Review app passwords regularly

---

## 📝 Email Examples

### **Sent from Gmail:**
```
From: TOPS Antique <your-email@gmail.com>
To: applicant@example.com
Subject: TOPS Antique - Application Approved! 🎉

[Beautiful HTML email with status update]
```

### **Gmail Advantages:**
- Trusted sender (Gmail domain)
- Better inbox delivery
- Familiar to recipients
- No cost

---

## 🎯 When to Use Gmail vs Resend

### **Use Gmail if:**
- ✅ Sending < 500 emails/day
- ✅ Want zero cost
- ✅ Need quick setup
- ✅ Prefer familiar email address

### **Use Resend if:**
- ✅ Sending > 500 emails/day
- ✅ Want custom domain (noreply@yoursite.com)
- ✅ Need delivery analytics
- ✅ Want professional setup

---

## 🔄 Switching Between Services

You can easily switch anytime by changing the function name in `AdminDashboard.tsx`:

**Gmail:**
```typescript
supabase.functions.invoke('send-status-email-gmail', { ... })
```

**Resend:**
```typescript
supabase.functions.invoke('send-status-email', { ... })
```

Keep both functions deployed and switch as needed!

---

## 📞 Support

### **Gmail Issues:**
- Google Account Help: https://support.google.com/accounts
- App Passwords: https://support.google.com/accounts/answer/185833

### **Supabase Edge Functions:**
- Docs: https://supabase.com/docs/guides/functions
- Discord: supabase.com/discord

---

## ✅ Checklist

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated and saved
- [ ] Secrets set in Supabase (`GMAIL_USER`, `GMAIL_APP_PASSWORD`)
- [ ] Edge Function deployed (`send-status-email-gmail`)
- [ ] Admin Dashboard updated to use Gmail function
- [ ] Test email sent successfully
- [ ] Verified email not in spam

---

## 🎉 You're All Set!

Your Gmail account is now configured to send beautiful email notifications to applicants!

**Daily capacity:** 500 emails  
**Cost:** $0 forever  
**Deliverability:** Excellent  

Send your first email from the admin dashboard! 📧✨

---

**Last Updated:** November 7, 2025  
**Version:** Gmail Edition
