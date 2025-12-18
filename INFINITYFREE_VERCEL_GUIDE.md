# Hybrid Hosting Guide: InfinityFree + Vercel

This guide is specifically tailored for hosting the **Backend on InfinityFree** and **Frontend on Vercel**.

> [!WARNING]
> **Important Note about InfinityFree**: Free hosting providers like InfinityFree often have a "Security System" (browser check) that blocks automated API requests from external sites (like Vercel).
> If your React app gets `403 Forbidden` or HTML errors instead of JSON, it means InfinityFree is blocking the connection.
> **Solution**: If this happens, you might need to upgrade to premium hosting (Hostinger/Namecheap) or deploy the backend to a cloud platform like Render/Railway instead.

---

## Part 1: InfinityFree (Backend)

### 1. Database Setup
1.  Login to **InfinityFree Client Area** -> Control Panel.
2.  Click on **MySQL Databases**.
3.  Create a new database (e.g., `epiz_12345_northscale`).
4.  **Important**: Note down the specific **MySQL Hostname** (e.g., `sql200.infinityfree.com`). It is NOT localhost.
5.  Open **phpMyAdmin** (from the Control Panel).
6.  Select your new database and **Import** the `northscale_db_export.sql` file.

### 2. Prepare API Files
1.  Open your local `northscale/api/config/database.php` file.
2.  Update it with your InfinityFree credentials:
    ```php
    private $host = "sql200.infinityfree.com"; // CHECK YOUR PANEL FOR THIS!
    private $db_name = "epiz_3456789_northscale"; // Your DB Name
    private $username = "epiz_3456789"; // Your Username
    private $password = "YourPanelPassword"; // Your VPanel Password
    ```

### 3. Upload Files
1.  Open **Online File Manager** (or use FileZilla).
2.  Navigate to the `htdocs` folder.
3.  Create a new folder inside `htdocs` named `api`.
4.  Upload all files from your local `northscale/api` folder into `htdocs/api`.
    *   Structure should be: `htdocs/api/index.php`, `htdocs/api/controllers/...`

### 4. Test the Backend
1.  Visit `http://your-domain.infinityfreeapp.com/api/`.
2.  You should see the JSON welcome message. If you see a "Javascript Required" or "Security Check" page, the API will NOT work with Vercel.

---

## Part 2: Vercel (Frontend)

### 1. Git Config
Push your code to GitHub if you haven't already.

### 2. Vercel Import
1.  Go to Vercel Dashboard -> **Add New Project**.
2.  Import your `northscale` repository.
3.  **Framework Preset**: Vite.
4.  **Root Directory**: `./` (default).

### 3. Environment Environment Config
Expand the **Environment Variables** section:
*   **Key**: `VITE_API_BASE_URL`
*   **Value**: `http://your-domain.infinityfreeapp.com/api` (Use HTTP, InfinityFree SSL is sometimes tricky on free tier).

### 4. Deploy
Click **Deploy**.

---

## Common Issues with InfinityFree

### 1. "Mixed Content" Error
Vercel runs on **HTTPS** (Secure). InfinityFree often runs on **HTTP** (Insecure).
Browser blocks HTTPS sites from calling HTTP APIs.
*   **Fix**: You MUST enable SSL (Cloudflare) on InfinityFree so your API URL is `https://...`.

### 2. CORS Errors
If you see CORS errors:
1.  Ensure `api/index.php` has `header("Access-Control-Allow-Origin: *");`.
2.  It might be the "Security System" blocking the `OPTIONS` request. There is no fix for this on the free tier other than upgrading.
