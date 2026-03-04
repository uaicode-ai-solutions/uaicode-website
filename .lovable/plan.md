

# Fix Logo Upload in /pms/wizard

## Problem
The LogoStep component shows an "Upload your logo" UI with a dashed border and Upload icon, but there is no `<input type="file">` element — clicking the area does nothing. Only the "Create with AI" button works.

## Solution
Add a hidden file input (`<input type="file" accept="image/*">`) and make the dashed upload area clickable. On file selection, read the file as a Data URL via `FileReader` and pass it to `onChange`.

## Changes — single file: `src/components/pms-lead-wizard/steps/LogoStep.tsx`

1. Add a `useRef` for the hidden file input
2. Add a hidden `<input type="file" accept="image/*" ref={fileInputRef}>` with an `onChange` handler
3. Make the dashed placeholder area clickable (`onClick` triggers `fileInputRef.current.click()`)
4. Add a `handleFileUpload` function:
   - Validate file type (image only) and size (max 2MB)
   - Use `FileReader.readAsDataURL` to convert to base64
   - Call `onChange(dataUrl)` with the result
5. Add an "Upload from device" button below the AI button for when a logo already exists (to allow replacing)

No backend changes needed — the form already stores `saasLogo` as a string and the submission edge function accepts `saas_logo_url` which can be a data URL.

