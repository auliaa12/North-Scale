import re

print("="*50)
print("FIXING ALL TIMESTAMP ISSUES - AGGRESSIVE MODE")
print("="*50)

# Read file
with open('northscale_ready_for_import.sql', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"\nOriginal file size: {len(content)} chars")

# Strategy: Replace ANY updated_at with timestamp to datetime
# This is more aggressive and catches all variations

# Pattern 1: Any updated_at timestamp (any variation)
pattern1 = r"`updated_at`\s+timestamp[^,;)]*"
matches1 = re.findall(pattern1, content, re.IGNORECASE)
print(f"\nFound {len(matches1)} 'updated_at timestamp' patterns")

content = re.sub(
    pattern1,
    "`updated_at` datetime DEFAULT NULL",
    content,
    flags=re.IGNORECASE
)

# Also check for created_at - keep only as timestamp DEFAULT CURRENT_TIMESTAMP
# Remove any ON UPDATE from created_at
pattern2 = r"`created_at`\s+timestamp\s+[^,;)]*ON\s+UPDATE\s+CURRENT_TIMESTAMP[^,;)]*"
matches2 = re.findall(pattern2, content, re.IGNORECASE)
if matches2:
    print(f"Found {len(matches2)} 'created_at' with ON UPDATE - fixing...")
    content = re.sub(
        pattern2,
        "`created_at` timestamp DEFAULT CURRENT_TIMESTAMP",
        content,
        flags=re.IGNORECASE
    )

# Final verification
final_timestamps = re.findall(r'`.+?`\s+timestamp[^,;]+CURRENT_TIMESTAMP', content, re.IGNORECASE)
updated_at_timestamps = [t for t in final_timestamps if 'updated_at' in t.lower()]
created_at_timestamps = [t for t in final_timestamps if 'created_at' in t.lower()]

print(f"\n--- VERIFICATION ---")
print(f"updated_at with CURRENT_TIMESTAMP: {len(updated_at_timestamps)} (should be 0)")
print(f"created_at with CURRENT_TIMESTAMP: {len(created_at_timestamps)} (OK)")

if updated_at_timestamps:
    print("\n⚠️ WARNING: Still found updated_at with CURRENT_TIMESTAMP:")
    for ts in updated_at_timestamps[:3]:
        print(f"  - {ts[:80]}...")

# Save
output_file = 'northscale_final.sql'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✅ Saved to: {output_file}")
print(f"New file size: {len(content)} chars")
print("\n" + "="*50)
print("DONE! Use file: northscale_final.sql")
print("="*50)
