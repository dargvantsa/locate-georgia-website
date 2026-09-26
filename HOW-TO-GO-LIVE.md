# Locate Georgia website: going live and using the admin panel

This site has a built-in admin panel at **locategeorgia.ge/admin**. You can change tours, prices, photos, homepage text, team, services and contact details there, without touching code.

Setup is a one-time job of about 30–40 minutes. You need two free accounts: **GitHub** (stores the website files) and **Netlify** (puts the website online).

---

## Step 1: Put the website files on GitHub

1. Create an account at **github.com**.
2. Click **+** (top right), then **New repository**.
   - Name: `locategeorgia`
   - Choose **Private**
   - Click **Create repository**
3. On the next page, click **uploading an existing file**.
4. Unzip `locategeorgia-website.zip` on your Mac. Open the `locategeorgia` folder, select **everything inside it** and drag it into the GitHub page. Then click **Commit changes**.

## Step 2: Tell the admin panel where the files are

1. On GitHub, open `src/admin/config.yml` and click the pencil icon to edit it.
2. Near the top, change `YOUR-GITHUB-USERNAME` to your GitHub username, for example `repo: gvantsa-lg/locategeorgia`.
3. Click **Commit changes**.

## Step 3: Put the site online with Netlify

1. Create an account at **netlify.com** and choose **Sign up with GitHub**.
2. Click **Add new site**, then **Import an existing project**, then **GitHub**, and pick `locategeorgia`.
3. Leave the settings as they are and click **Deploy**.
4. After about a minute your site is live at an address like `locategeorgia-xyz.netlify.app`. Open it and check it.

## Step 4: Switch on the admin login

1. On GitHub, go to your profile picture → **Settings** → **Developer settings** (at the very bottom) → **OAuth Apps** → **New OAuth App**.
   - Application name: `Locate Georgia admin`
   - Homepage URL: your Netlify address from Step 3
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Click **Register application**.
2. Copy the **Client ID**. Click **Generate a new client secret** and copy the secret too.
3. In Netlify, open your site → **Site configuration** → **Access & security** → **OAuth** → **Install provider** → **GitHub**. Paste the Client ID and the secret, then save.
4. Go to `your-netlify-address/admin` and click **Login with GitHub**. You're in.

## Step 5: Connect locategeorgia.ge (only when all pages are finished)

Doing this replaces the Wix site, so wait until the new site is complete.

1. In Netlify, open **Domain management** → **Add a domain** → `locategeorgia.ge`.
2. Netlify shows the DNS records to set. Change them where you bought the domain (your .ge registrar) or in Wix, if Wix manages the domain.
3. **Important:** your email (info@locategeorgia.ge) depends on the domain's **MX records**. Only change the records Netlify asks for (A / CNAME). Never delete the MX records, or email will stop working.
4. Netlify adds the https security certificate automatically.

---

## Everyday use

- Go to **locategeorgia.ge/admin** and log in with GitHub.
- **Tours**: edit a tour, or click **+ Tour** to add one. Tick **Show on homepage** for the three signature journeys. Untick **Published** to hide a tour without deleting it.
- **Pages → Homepage**: headline, texts and photos.
- **Pages → About us & team** and **Travel services**: content for those pages.
- **Contact & settings**: phone numbers, email, address, social links.
- **Journal**: write blog posts.
- Click **Publish** at the top. The website updates within 1–2 minutes.

### Photo tips

- Use JPG files.
- Top banner photo: at least 2400px wide. Tour photos: at least 1600px wide.
- Keep each file under about 1 MB. Squoosh.app shrinks photos for free.
- Always fill in **Photo description**. It helps Google and visitors who use screen readers.
