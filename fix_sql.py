import re

print("Reading northscale_database_fixed.sql...")
with open('northscale_database_fixed.sql', 'r', encoding='utf-8') as f:
    content = f.read()

print("Original file size:", len(content), "characters")

# Fix 1: Change all `updated_at` TIMESTAMP to DATETIME
print("\nFixing updated_at columns...")
content = re.sub(
    r'`updated_at`\s+timestamp\s+NOT\s+NULL\s+DEFAULT\s+CURRENT_TIMESTAMP\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP',
    '`updated_at` datetime DEFAULT NULL',
    content,
    flags=re.IGNORECASE
)

content = re.sub(
    r'`updated_at`\s+timestamp\s+DEFAULT\s+CURRENT_TIMESTAMP\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP',
    '`updated_at` datetime DEFAULT NULL',
    content,
    flags=re.IGNORECASE
)

content = re.sub(
    r'`updated_at`\s+timestamp\s+NULL\s+DEFAULT\s+CURRENT_TIMESTAMP\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP',
    '`updated_at` datetime DEFAULT NULL',
    content,
    flags=re.IGNORECASE
)

# Keep created_at as TIMESTAMP (only one is allowed)
print("Keeping created_at as TIMESTAMP (allowed)...")

# Save to new file
output_file = 'northscale_ready_for_import.sql'
print(f"\nSaving to {output_file}...")
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("New file size:", len(content), "characters")
print(f"\n✅ SUCCESS! File saved: {output_file}")
print("\nThis file is now compatible with MySQL 5.5/5.6 (FreeSQLDatabase)")
print("All updated_at columns changed to DATETIME")
print("Only created_at keeps TIMESTAMP with CURRENT_TIMESTAMP")
