@echo off
echo ====================================
echo Export Database North Scale
echo ====================================
echo.
echo Exporting database untuk hosting...
echo.

REM Ganti dengan path ke mysqldump Anda (biasanya di XAMPP/mysql/bin)
set MYSQL_PATH=C:\xampp\mysql\bin

REM Database credentials (sesuaikan jika berbeda)
set DB_HOST=localhost
set DB_USER=root
set DB_PASS=
set DB_NAME=northscale

REM Output file
set OUTPUT_FILE=northscale_database.sql

echo Eksporting database %DB_NAME%...
"%MYSQL_PATH%\mysqldump.exe" -h %DB_HOST% -u %DB_USER% %DB_NAME% > %OUTPUT_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo SUCCESS! Database berhasil di-export
    echo ====================================
    echo File: %OUTPUT_FILE%
    echo.
    echo Langkah selanjutnya:
    echo 1. Upload file ini ke hosting (InfinityFree phpMyAdmin)
    echo 2. Import di database yang sudah dibuat
    echo.
) else (
    echo.
    echo ====================================
    echo ERROR! Gagal export database
    echo ====================================
    echo.
    echo Troubleshooting:
    echo 1. Pastikan MySQL sudah running (Start dari XAMPP)
    echo 2. Periksa username/password di script ini
    echo 3. Periksa nama database benar (default: northscale)
    echo.
)

pause
