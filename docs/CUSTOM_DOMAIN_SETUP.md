# Custom Domain Setup: antigravity-quota.com

This guide explains how to configure a custom domain for your Antigravity Quota deployment.

---

## Overview

Your app is currently deployed at:
- **Vercel URL**: https://antigravity-tracker-sage.vercel.app

You'll want to set up **antigravity-quota.com** (or your preferred domain).

---

## Step 1: Purchase a Domain

If you don't own the domain yet:

1. **Buy from any registrar**:
   - [Namecheap](https://namecheap.com) - Budget-friendly
   - [GoDaddy](https://godaddy.com) - Popular option
   - [Google Domains](https://domains.google) - Simple setup
   - [Cloudflare Registrar](https://cloudflare.com/domains) - Privacy-focused

2. **Price**: Usually $10-15/year for .com domains

3. **Recommended**: Look for deals on Black Friday or through your registrar

---

## Step 2: Add Domain to Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select your project**
   - Click on "antigravity-tracker" (or your project name)

3. **Navigate to Settings**
   - Click the **Settings** tab
   - Scroll down to **Domains**

4. **Add your domain**
   - Click **Add** next to Domains
   - Enter: `antigravity-quota.com`
   - Click **Add Domain**

5. **Wait for verification**
   - Vercel will show you DNS records to add
   - Keep this page open

---

## Step 3: Configure DNS Records

Add these DNS records at your domain registrar:

### Option A: Cloudflare (Recommended)

1. Log into [Cloudflare](https://dash.cloudflare.com)
2. Select your domain
3. Go to **DNS** → **Records**
4. Click **Add record**

**Record 1 (Main domain):**
- Type: `A`
- Name: `@` (or leave blank)
- IPv4 address: `76.76.21.21`
- Proxy status: **DNS only** (orange cloud) initially
- TTL: Auto

**Record 2 (WWW subdomain - optional):**
- Type: `CNAME`
- Name: `www`
- Target: `cname.vercel-dns.com`
- Proxy status: **DNS only**
- TTL: Auto

**Record 3 (for verification):**
- Vercel will provide a specific CNAME record
- Copy it exactly as shown

5. **Wait 5-10 minutes** for DNS to propagate
6. Return to Vercel and click **Check**
7. Once verified, switch Cloudflare proxy to **Proxied** (gray cloud)

### Option B: GoDaddy

1. Log into [GoDaddy](https://godaddy.com)
2. Go to **My Products** → **DNS**
3. Click **Add Record**

**A Record:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`
- TTL: 1 Hour

**CNAME Record:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: 1 Hour

### Option C: Namecheap

1. Log into [Namecheap](https://namecheap.com)
2. Go to **Dashboard** → **Domain List**
3. Click **Manage** → **Advanced DNS**

**A Record:**
- Type: `A`
- Host: `@`
- Value: `76.76.21.21`
- TTL: Automatic

**CNAME Record:**
- Type: `CNAME`
- Host: `www`
- Value: `cname.vercel-dns.com`
- TTL: Automatic

---

## Step 4: Verify Domain in Vercel

1. Go back to Vercel Dashboard → Settings → Domains
2. You should see your domain with status **Valid** or **Pending**
3. Click **Refresh** if status doesn't update
4. DNS changes can take **up to 48 hours** (usually much faster)

---

## Step 5: Set as Primary Domain (Optional)

Once verified:

1. In Vercel Domains settings
2. Click the **⋮** menu next to your domain
3. Select **Set as Primary**

This makes antigravity-quota.com the main URL.

---

## DNS Configuration Reference

| Record Type | Name | Value | Purpose |
|------------|------|-------|---------|
| A | @ | 76.76.21.21 | Main domain → Vercel |
| CNAME | www | cname.vercel-dns.com | WWW subdomain |
| TXT | (verification) | (Vercel provided) | Domain verification |

### Vercel IP Addresses
- IPv4: `76.76.21.21`
- IPv6: `76.76.21.0` (if supported)

---

## SSL/TLS Certificate

**Good news**: Vercel automatically provisions and renews SSL certificates!

- No action needed on your part
- Certificate is issued within minutes of DNS verification
- HTTPS is enforced automatically

---

## Troubleshooting

### Domain shows "Invalid Configuration"

1. Check DNS records are correct
2. Wait for propagation (up to 48 hours)
3. Use [dnschecker.org](https://dnschecker.org) to verify records
4. Contact Vercel support if issues persist

### SSL Certificate not issued

1. Ensure DNS records are correct
2. Wait 5-10 minutes after DNS update
3. Check Vercel Domains page for certificate status
4. Click **Recreate** if stuck

### www subdomain not working

1. Add www CNAME record pointing to `cname.vercel-dns.com`
2. Wait for propagation
3. Verify in Vercel Domains settings

### Redirect www to non-www

Add to `next.config.js`:
```javascript
async redirects() {
  return [
    {
      source: '/(.*)',
      destination: 'https://antigravity-quota.com/$1',
      permanent: true,
    },
  ]
},
```

---

## Custom Domain Checklist

- [ ] Purchased domain (antigravity-quota.com)
- [ ] Added domain in Vercel Dashboard
- [ ] Added DNS A record (@ → 76.76.21.21)
- [ ] Added DNS CNAME record (www → cname.vercel-dns.com)
- [ ] Waited for DNS propagation
- [ ] Verified domain in Vercel
- [ ] Enabled Cloudflare proxy (if using Cloudflare)
- [ ] SSL certificate issued
- [ ] Tested HTTPS access

---

## Production URL After Setup

After configuration, your app will be available at:
- **https://antigravity-quota.com**
- **https://www.antigravity-quota.com** (if configured)

Old Vercel URL will redirect to your custom domain.

---

## Support

- **Vercel Docs**: https://vercel.com/docs/concepts/dns
- **Vercel Support**: https://vercel.com/help
- **DNS Checker**: https://dnschecker.org
