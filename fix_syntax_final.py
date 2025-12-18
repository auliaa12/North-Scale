import re

print("Final SQL Syntax Fix...")

filename = 'northscale_clean.sql'

with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original size: {len(content)}")

# The Error: `updated_at` datetime DEFAULT NULL), `api_token` ...
# The `)` closes the table prematureley.

# General Fix:
# Find `updated_at` datetime DEFAULT NULL),
# Replace with `updated_at` datetime DEFAULT NULL,

# We use a pattern that matches the specific error context
# Matches: DEFAULT NULL), [whitespace] `[alphanum]`
pattern = r'(DEFAULT\s+NULL)\s*\)\s*,\s*(`[^`]+`)'
matches = re.findall(pattern, content)
print(f"Found {len(matches)} occurrences of 'DEFAULT NULL), `column`'")

content = re.sub(pattern, r'\1, \2', content)

# Check for the PRIMARY KEY case again just to be sure
pattern_pk = r'(DEFAULT\s+NULL)\s*\)\s*,\s*(PRIMARY\s+KEY|UNIQUE\s+KEY|KEY|CONSTRAINT)'
matches_pk = re.findall(pattern_pk, content)
print(f"Found {len(matches_pk)} occurrences of 'DEFAULT NULL), KEY'")
content = re.sub(pattern_pk, r'\1, \2', content)

# General safety net for updated_at specifically knowing it's often the culprit
# Remove ) after updated_at if followed by comma
content = re.sub(r'(`updated_at`\s+datetime\s+DEFAULT\s+NULL)\s*\)\s*,', r'\1,', content)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Fixed file saved to: {filename}")
