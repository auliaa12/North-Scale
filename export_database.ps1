# PowerShell Script untuk Export Database dengan UTF-8 Encoding
# Untuk North Scale E-Commerce

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Export Database North Scale (UTF-8)" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$MYSQL_PATH = "C:\xampp\mysql\bin\mysqldump.exe"
$DB_HOST = "localhost"
$DB_USER = "root"
$DB_PASS = ""
$DB_NAME = "northscale_db"
$OUTPUT_FILE = "northscale_database.sql"

# Check if mysqldump exists
if (-Not (Test-Path $MYSQL_PATH)) {
    Write-Host "ERROR: mysqldump.exe tidak ditemukan!" -ForegroundColor Red
    Write-Host "Path: $MYSQL_PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Solusi:" -ForegroundColor Yellow
    Write-Host "1. Pastikan XAMPP sudah terinstall" -ForegroundColor White
    Write-Host "2. Atau edit path di script ini (line 8)" -ForegroundColor White
    pause
    exit 1
}

Write-Host "Eksporting database '$DB_NAME'..." -ForegroundColor Yellow
Write-Host ""

# Export database dengan UTF-8 encoding yang benar
$arguments = @(
    "-h", $DB_HOST,
    "-u", $DB_USER,
    "--default-character-set=utf8mb4",
    "--single-transaction",
    "--skip-set-charset",
    "--skip-comments",
    $DB_NAME
)

# Add password jika ada
if ($DB_PASS -ne "") {
    $arguments = @("-p$DB_PASS") + $arguments
}

# Run mysqldump dan save output dengan UTF-8 encoding
try {
    $output = & $MYSQL_PATH $arguments 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Gagal export database!" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:" -ForegroundColor Yellow
        Write-Host "1. Pastikan MySQL/XAMPP sudah running" -ForegroundColor White
        Write-Host "2. Periksa nama database benar (default: northscale_db)" -ForegroundColor White
        Write-Host "3. Periksa username/password MySQL" -ForegroundColor White
        pause
        exit 1
    }
    
    # Save dengan UTF-8 encoding (no BOM)
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText("$PWD\$OUTPUT_FILE", $output, $utf8NoBom)
    
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "SUCCESS! Database berhasil di-export" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "File: $OUTPUT_FILE" -ForegroundColor Cyan
    Write-Host "Lokasi: $PWD\$OUTPUT_FILE" -ForegroundColor Cyan
    
    # Get file size
    $fileSize = (Get-Item $OUTPUT_FILE).length
    $fileSizeKB = [math]::Round($fileSize / 1KB, 2)
    Write-Host "Ukuran: $fileSizeKB KB" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
    Write-Host "1. Upload file ini ke hosting (FreeSQLDatabase/InfinityFree)" -ForegroundColor White
    Write-Host "2. Import di phpMyAdmin dengan encoding UTF-8" -ForegroundColor White
    Write-Host "3. File sudah dalam format yang benar (UTF-8, no BOM)" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

pause
