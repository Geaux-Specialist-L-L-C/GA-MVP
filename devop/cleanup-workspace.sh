#!/bin/bash

# Remove duplicate/legacy files
echo "Removing duplicate and legacy files..."
rm components/Header.jsx
rm components/ParentDashboardLegacy.tsx
rm components/Sidebar.jsx
rm components/auth/LoginForm.jsx
rm components/layout/Header.jsx
rm components/layout/Layout.jsx
rm components/layout/Navbar.jsx
rm components/layout/Navigation.jsx
rm components/layout/Sidebar.jsx
rm components/layout/styles/Header.jsx
rm components/shared/Button.jsx
rm components/shared/LoadingSpinner.jsx
rm config/firebase.js
rm firebase/config.js
rm pages/*Legacy.jsx

# Move files to their new locations
echo "Moving files to new locations..."
mv components/ParentProfile/ParentProfile.tsx components/profile/
mv components/StudentProfileForm.tsx components/profile/
mv styles/* components/layout/styles/
rmdir styles

# Move component-specific styles to their folders
echo "Moving component styles..."
for cssfile in components/layout/styles/*.css; do
  component_name=$(basename "$cssfile" .css)
  target_dir="components/layout/"
  if [ -d "$target_dir" ]; then
    mv "$cssfile" "$target_dir"
  fi
done

echo "Cleanup complete!"
