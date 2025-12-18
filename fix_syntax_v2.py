import re
import os

print("Fixing SQL Syntax in northscale_clean.sql...")

filepath = 'northscale_clean.sql'

# Fallback check
if not os.path.exists(filepath):
    print("Warning: clean file not found, checking alternatives...")
    if os.path.exists('northscale_database_fixed.sql'):
         filepath = 'northscale_database_fixed.sql'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Read {len(content)} chars from {filepath}")

# FIX 1: Fix `updated_at` definition
# Ensure we define it simply as DATETIME DEFAULT NULL
# And remove any artifacts like ON UPDATE 
content = re.sub(r'`updated_at`\s+timestamp[^,)]*', '`updated_at` datetime DEFAULT NULL', content, flags=re.IGNORECASE)

# FIX 2: Syntax Error "Unexpected closing parenthesis"
# The error was likely: `updated_at` datetime DEFAULT NULL), PRIMARY KEY
# We look for: DEFAULT NULL), [KEYWORD] and change to DEFAULT NULL, [KEYWORD]
content = re.sub(r'(DEFAULT\s+NULL)\s*\)\s*,\s*(PRIMARY\s+KEY|KEY|CONSTRAINT|UNIQUE)', r'\1, \2', content, flags=re.IGNORECASE)

# FIX 3: Clean up current_timestamp() -> CURRENT_TIMESTAMP
content = re.sub(r'current_timestamp\(\)', 'CURRENT_TIMESTAMP', content, flags=re.IGNORECASE)

# FIX 4: Safety cleanup for any lingering ON UPDATE clauses
content = re.sub(r'ON\s+UPDATE\s+CURRENT_TIMESTAMP', '', content, flags=re.IGNORECASE)

output_file = 'northscale_final_fixed.sql'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Saved fixed file to: {output_file}")
