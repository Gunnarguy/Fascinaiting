#!/bin/bash
echo "=== Checking for Google Analytics in HTML files ==="
for file in *.html; do
  echo -e "\n--- $file ---"
  if grep -i "google.*analytics\|gtag\|googletagmanager" "$file"; then
    echo "❌ Found Google tracking code in $file"
  else
    echo "✅ No Google tracking code found in $file"
  fi
done
