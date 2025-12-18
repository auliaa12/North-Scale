import re

print("Fixing Max Key Length Error (utf8mb4 -> utf8)...")

filepath = 'northscale_clean.sql'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original size: {len(content)} chars")

# FIX: Convert utf8mb4 to simple utf8
# This resolves the "key too long" error (767 bytes limit)
# utf8 (3 bytes) * 255 = 765 bytes (fits!)
# utf8mb4 (4 bytes) * 255 = 1020 bytes (error!)

# Replace charset definitions
content = re.sub(r'utf8mb4_general_ci', 'utf8_general_ci', content, flags=re.IGNORECASE)
content = re.sub(r'utf8mb4_unicode_ci', 'utf8_general_ci', content, flags=re.IGNORECASE)
content = re.sub(r'CHARSET=utf8mb4', 'CHARSET=utf8', content, flags=re.IGNORECASE)
content = re.sub(r'CHARACTER SET utf8mb4', 'CHARACTER SET utf8', content, flags=re.IGNORECASE)

# Verify
utf8mb4_count = len(re.findall(r'utf8mb4', content, re.IGNORECASE))
print(f"Remaining utf8mb4: {utf8mb4_count} (should be 0)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Saved fixed file to: {filepath}")
print("File is now compatible with MySQL 5.6 default index limits.")
