#!/usr/bin/env python3
with open('components/clip/ClipForm.tsx', 'r') as f:
    content = f.read()

# Remove the entire Linked Patient view block
# Pattern: starts with "<View style={{ marginTop: 12 }}>" followed by "Linked Patient" text
# and ends with closing "</View>"
import re
pattern = r'(\s+)<View style=\{\{ marginTop: 12 \}\}>\s+<Text style=\{\{ fontWeight: \'bold\', color:.*?\}\}>Linked Patient</Text>.*?</View>\s+'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('components/clip/ClipForm.tsx', 'w') as f:
    f.write(content)

print("Removed Linked Patient section from ClipForm")
