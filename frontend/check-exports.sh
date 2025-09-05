#!/bin/bash
# This script checks all component files listed in index.js for default exports

echo "Checking component files for default exports..."

# Parse component filenames from index.js
COMPONENTS=$(grep -o "export { default as [a-zA-Z]* } from './[a-zA-Z]*'" src/components/index.js | awk -F"'" '{print $2}' | sed 's/\\.\\\///')

# Loop through each component
for component in $COMPONENTS; do
  file="src/components/${component}.jsx"
  
  # Check if file exists
  if [ -f "$file" ]; then
    # Check for default export
    if ! grep -q "export default" "$file"; then
      echo "$file: Missing default export"
    fi
  else
    echo "$file: File not found"
  fi
done

echo "Check complete."
