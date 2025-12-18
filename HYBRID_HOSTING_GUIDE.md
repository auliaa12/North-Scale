# Hybrid Hosting Guide for North Scale

This guide explains how to host your **Frontend (React)** on Vercel and your **Backend (PHP/MySQL)** on a Shared Hosting provider (like Huffman, InfinityFree, Hostinger, Niagahoster, etc.).

## 1. Prepare the Backend (Shared Hosting)

You need a hosting provider that supports PHP and MySQL.

### A. Upload Files
1.  Login to your hosting Control Panel (cPanel/DirectAdmin).
2.  Go to **File Manager** -> `public_html`.
3.  Create a folder named `api`.
4.  Upload all files from your local `northscale/api` folder into this new `public_html/api` folder.
    *   *Tip: Zip the `api` folder on your computer, upload the zip, and extract it in File Manager for speed.*

### B. Setup Database
1.  Go to **MySQL Databases** in your hosting panel.
2.  Create a new Database (e.g., `u12345_northscale`).
3.  Create a new User and Password, and assign this user to the database with **ALL PRIVILEGES**.
4.  Go to **phpMyAdmin**.
5.  Select your new database and **Import** the `northscale_db_export.sql` file from your project.

### C. Connect PHP to Database
1.  In File Manager, edit `public_html/api/config/database.php`.
2.  Update the credentials to match your live hosting:
    ```php
    private $host = "localhost"; // Usually localhost, but check hosting details
    private $db_name = "u12345_northscale"; // Your REAL hosting DB name
    private $username = "u12345_root"; // Your REAL hosting User
    private $password = "your_strong_password"; // Your REAL hosting Password
    ```

### D. Verify Backend
Visit your website URL: `https://your-domain.com/api/` or `https://your-domain.com/api/products`.
*   If you see JSON data, your backend is working!

---

## 2. Prepare the Frontend (Vercel)

Now we deploy the React app to Vercel, pointing it to your live backend.

### A. Environment Variable
1.  Go to Vercel and import your project from GitHub.
2.  In the **Environment Variables** section (during import or in Settings), add:
    *   **Name**: `VITE_API_BASE_URL`
    *   **Value**: `https://your-domain.com/api` (The URL where you uploaded the PHP files in Step 1).
    *   *Important: Do NOT use localhost here.*

### B. Deploy
1.  Click **Deploy**.
2.  Vercel will build your React app.

---

## 3. Important: CORS Configuration

Since your Frontend (Vercel) and Backend (Hosting) are on different domains, you must ensure your API allows the connection.

We have already configured `api/index.php` to allow all origins:
```php
header("Access-Control-Allow-Origin: *");
```
*   If you face issues (like "CORS error"), change `*` to your specific Vercel URL, e.g., `https://northscale.vercel.app`.

---

## 4. Troubleshooting 404s on Frontend

If refreshing a page (like `/cart`) on Vercel gives a 404 error, you need to tell Vercel to redirect all routes to `index.html`.

Ensure your `vercel.json` in the root folder looks like this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

*Note: Since you are using Hybrid hosting, you do NOT need the rewrite rules pointing to `/api/...` inside `vercel.json` anymore, because the API is hosted elsewhere. The strict `VITE_API_BASE_URL` env var handles the connection.*
