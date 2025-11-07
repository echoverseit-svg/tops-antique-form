# 📁 Import Environment Variables to Vercel

## ✅ File Created: `.env.vercel`

I've created a ready-to-import environment file for you!

---

## 🚀 **How to Import to Vercel**

### **Step 1: Edit the File First**

Open `.env.vercel` and replace:
```
GMAIL_USER=your-email@gmail.com
```

With YOUR actual Gmail:
```
GMAIL_USER=youremail@gmail.com
```

**Keep the password as-is:**
```
GMAIL_APP_PASSWORD=qcbbqgkihwmlkhty
```

---

### **Step 2: Import to Vercel Dashboard**

#### **Option A: Copy & Paste (Easiest)**

1. Open `.env.vercel` file
2. Copy everything (Ctrl+A, Ctrl+C)
3. Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**
4. Paste into the text box
5. Click **"Add"** for each variable
6. Select all environments: ✅ Production ✅ Preview ✅ Development
7. Click **"Save"**

#### **Option B: Manual Entry**

1. Go to: **Vercel Dashboard → Settings → Environment Variables**
2. Click **"Add New"**
3. For each variable:
   - Name: `GMAIL_USER`
   - Value: `your-email@gmail.com`
   - Environments: ✅ All three
   - Click **"Save"**
4. Repeat for `GMAIL_APP_PASSWORD`

---

### **Step 3: Redeploy**

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes ✅

---

## 📋 **Environment Variables Summary**

| Variable | Your Value | Status |
|----------|-----------|--------|
| `GMAIL_USER` | Replace with your Gmail | ⚠️ EDIT THIS |
| `GMAIL_APP_PASSWORD` | `qcbbqgkihwmlkhty` | ✅ Ready |

---

## ⚠️ **IMPORTANT**

1. **Edit** `.env.vercel` with YOUR Gmail before importing
2. **Don't commit** this file to GitHub (it's in .gitignore)
3. **Select all environments** when adding variables
4. **Redeploy** after adding variables

---

## 🎯 **File Location**

```
📁 project/
  └── .env.vercel  ← Import this to Vercel!
```

---

## ✅ **After Import**

Your environment variables will be:

```bash
GMAIL_USER=your-email@gmail.com          # ← Your actual Gmail
GMAIL_APP_PASSWORD=qcbbqgkihwmlkhty      # ← Your app password
```

---

## 🔍 **Verify Import**

After importing and redeploying:
1. Go to admin dashboard
2. Try sending an email
3. Should work! ✅

---

## 📞 **Troubleshooting**

**Variables not showing?**
→ Refresh the Vercel settings page

**Still getting error?**
→ Make sure you redeployed after adding variables

**Email not sending?**
→ Check if `GMAIL_USER` is your actual email address

---

**File is ready! Just edit your email and import to Vercel!** 🚀
