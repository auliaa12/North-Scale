import re

print("Fixing SQL Syntax in northscale_clean.sql...")

filepath = 'northscale_clean.sql'

if not os.path.exists(filepath):
    # If not found, try to recreate from source
    if os.path.exists('northscale_result.sql'):
         filepath = 'northscale_result.sql'
    elif os.path.exists('northscale_database_fixed.sql'):
         filepath = 'northscale_database_fixed.sql'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Masalah: `updated_at` datetime DEFAULT NULL), PRIMARY KEY
# Seharusnya: `updated_at` datetime DEFAULT NULL, PRIMARY KEY
# Kita harus hapus tanda kurung ")" jika itu bukan akhir table.

# Regex to fix: replace "), PRIMARY" with ", PRIMARY"
content = re.sub(r'DEFAULT NULL\s*\),\s*PRIMARY KEY', 'DEFAULT NULL, PRIMARY KEY', content, flags=re.IGNORECASE)

# Juga fix untuk case constraints lain
content = re.sub(r'DEFAULT NULL\s*\),\s*KEY', 'DEFAULT NULL, KEY', content, flags=re.IGNORECASE)
content = re.sub(r'DEFAULT NULL\s*\),\s*CONSTRAINT', 'DEFAULT NULL, CONSTRAINT', content, flags=re.IGNORECASE)

# Fix general updated_at closing parenthesis issue
# Replace "updated_at datetime DEFAULT NULL)" with "updated_at datetime DEFAULT NULL" if followed by comma
content = re.sub(r'(`updated_at` datetime DEFAULT NULL)\s*\)(,)', r'\1\2', content)

# Remove any renaming artifacts if present (e.g. current_timestamp())
content = re.sub(r'current_timestamp\(\)', 'CURRENT_TIMESTAMP', content, flags=re.IGNORECASE)

with open('northscale_final_fixed.sql', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Saved fixed file to: northscale_final_fixed.sql")
