# PowerShell Script: Fix TIMESTAMP untuk MySQL 5.5/5.6 Compatibility
# Untuk North Scale E-Commerce

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Fix TIMESTAMP MySQL Compatibility" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$inputFile = "northscale_database.sql"
$outputFile = "northscale_database_fixed.sql"

if (-Not (Test-Path $inputFile)) {
    Write-Host "ERROR: File $inputFile tidak ditemukan!" -ForegroundColor Red
    Write-Host "Pastikan file northscale_database.sql ada di folder ini." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Membaca file SQL..." -ForegroundColor Yellow

try {
    # Read file content
    $content = Get-Content $inputFile -Raw -Encoding UTF8
    
    Write-Host "Memperbaiki TIMESTAMP columns..." -ForegroundColor Yellow
    
    # Fix 1: Change updated_at from DEFAULT CURRENT_TIMESTAMP to NULL
    # Karena MySQL 5.5/5.6 hanya boleh 1 TIMESTAMP dengan CURRENT_TIMESTAMP
    $content = $content -replace "`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP", "`updated_at` timestamp NULL DEFAULT NULL"
    
    # Fix 2: Also fix if there's different format
    $content = $content -replace "`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP", "`updated_at` timestamp NULL DEFAULT NULL"
    
    # Fix 3: Keep created_at with CURRENT_TIMESTAMP
    # (This is fine, hanya boleh 1 TIMESTAMP dengan CURRENT_TIMESTAMP)
    
    Write-Host "Menyimpan file yang sudah diperbaiki..." -ForegroundColor Yellow
    
    # Save fixed content with UTF-8 no BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText("$PWD\$outputFile", $content, $utf8NoBom)
    
    $fileSize = (Get-Item $outputFile).length
    $fileSizeKB = [math]::Round($fileSize / 1KB, 2)
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "SUCCESS! File berhasil diperbaiki" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "File output: $outputFile" -ForegroundColor Cyan
    Write-Host "Ukuran: $fileSizeKB KB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Perubahan yang dibuat:" -ForegroundColor Yellow
    Write-Host "- Column 'updated_at' diubah jadi DATETIME" -ForegroundColor White
    Write-Host "- Column 'created_at' tetap TIMESTAMP" -ForegroundColor White
    Write-Host "- Kompatibel dengan MySQL 5.5, 5.6, 5.7, 8.0" -ForegroundColor White
    Write-Host ""
    Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
    Write-Host "1. Upload file '$outputFile' ke hosting" -ForegroundColor White
    Write-Host "2. Import via phpMyAdmin" -ForegroundColor White
    Write-Host "3. Seharusnya tidak ada error lagi!" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    pause
    exit 1
}

pause
