import re
import os

input_filename = 'northscale_final.sql'
output_filename = 'northscale_clean.sql'

print(f"Reading {input_filename}...")

if not os.path.exists(input_filename):
    # Fallback to other possible filenames if final doesn't exist
    for f in ['northscale_ready_for_import.sql', 'northscale_database_utf8.sql']:
        if os.path.exists(f):
            input_filename = f
            print(f"Falling back to {input_filename}")
            break

if not os.path.exists(input_filename):
    print("Error: No source SQL file found!")
    exit(1)

with open(input_filename, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original size: {len(content)} chars")

# 1. Remove ALL 'ON UPDATE CURRENT_TIMESTAMP' clauses (case insensitive)
# Matches: ON UPDATE CURRENT_TIMESTAMP, ON UPDATE current_timestamp(), etc.
print("Removing ON UPDATE clauses...")
content = re.sub(r'\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP(?:\(\))?', '', content, flags=re.IGNORECASE)

# 2. Change all `updated_at` TIMESTAMP columns to DATETIME DEFAULT NULL
# This fixes the restricted single TIMESTAMP column issue in older MySQL
print("Converting updated_at TIMESTAMP to DATETIME...")
content = re.sub(r'`updated_at`\s+timestamp(\s+NULL|\s+NOT\s+NULL)?(\s+DEFAULT\s+[^,\n]+)?', 
                 '`updated_at` datetime DEFAULT NULL', 
                 content, 
                 flags=re.IGNORECASE)

# 3. Ensure created_at stays as TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# (We assume checking for created_at isn't strictly necessary to modify if we fixed the dual timestamp issue by changing updated_at, but let's be safe)

# Verification
on_update_count = len(re.findall(r'ON\s+UPDATE\s+CURRENT_TIMESTAMP', content, re.IGNORECASE))
updated_at_ts_count = len(re.findall(r'`updated_at`\s+timestamp', content, re.IGNORECASE))

print(f"Remaining ON UPDATE clauses: {on_update_count}")
print(f"Remaining updated_at TIMESTAMP: {updated_at_ts_count}")

with open(output_filename, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✅ Success! Saved to {output_filename}")
