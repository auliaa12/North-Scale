import re

print("="*60)
print("ULTIMATE FIX - Remove ALL ON UPDATE CURRENT_TIMESTAMP")
print("="*60)

with open('northscale_database.sql', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original size: {len(content)} chars\n")

# Strategy: Remove ALL "ON UPDATE CURRENT_TIMESTAMP" or "ON UPDATE current_timestamp()"
# This is the most aggressive approach

# Pattern to remove ON UPDATE variations
patterns_to_remove = [
    r'\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP\(\)',
    r'\s+ON\s+UPDATE\s+current_timestamp\(\)',
    r'\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP',
    r'\s+ON\s+UPDATE\s+current_timestamp',
]

for pattern in patterns_to_remove:
    before = len(re.findall(pattern, content, re.IGNORECASE))
    if before > 0:
        print(f"Removing {before} instances of pattern: {pattern}")
        content = re.sub(pattern, '', content, flags=re.IGNORECASE)

# Also change all `updated_at` timestamp to datetime
content = re.sub(
    r'`updated_at`\s+timestamp',
    '`updated_at` datetime',
    content,
    flags=re.IGNORECASE
)

# Verification
remaining_on_update = re.findall(r'ON\s+UPDATE', content, re.IGNORECASE)
print(f"\nRemaining 'ON UPDATE': {len(remaining_on_update)}")

if remaining_on_update:
    print("⚠️ Some ON UPDATE still remain (might be in comments)")
else:
    print("✅ All ON UPDATE removed!") 

# Save
output = 'northscale_clean.sql'
with open(output, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✅ Saved to: {output}")
print(f"New size: {len(content)} chars")
print("=" * 60)
print(f"✅ IMPORT FILE: {output}")
print("="*60)
