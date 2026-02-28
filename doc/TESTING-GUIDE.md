# Phase-by-Phase Code Evolution - Testing & Demo Guide

## 🧪 Testing the System

### Prerequisites
- Complete intake (questions answered)
- Generate blueprint successfully
- Blueprint shows in "Overview" tab

---

## Test Flow

### Test 1: Phase Generation
**Steps:**
1. Navigate to "Implementation" tab in Blueprint Result
2. Click "Generate Phases" button
3. Wait for loading to complete
4. Verify phases appear (5 cards with code)

**Expected Result:**
- ✅ Phase 1-5 cards visible
- ✅ Each shows phase name, order, status
- ✅ "complete" badge shows
- ✅ Estimated days visible
- ✅ Code blocks present

**What it tests:**
- LLM integration working
- API endpoint `/api/v1/phases` functional
- Code generation for all phases

---

### Test 2: All Phases (Detailed View)
**Steps:**
1. Ensure "All Phases" button is selected (default)
2. Click on "Phase 1: UI Components" card
3. Verify code blocks appear
4. Scroll through code blocks
5. Try Copy button on a code block
6. Try Download button

**Expected Result:**
- ✅ Phase details expand/collapse
- ✅ Reasoning section shows
- ✅ Code blocks visible with syntax highlighting
- ✅ Copy button shows confirmation
- ✅ Download saves file to disk
- ✅ Timeline shows at bottom with total effort

**What it tests:**
- Detailed view rendering
- Code block display
- Copy/download functionality
- Code syntax highlighting
- Timeline calculation

---

### Test 3: Build Step-by-Step View (NEW)
**Steps:**
1. Click "Build Step-by-Step" button
2. Verify phase navigation buttons at top
3. Verify phase info card shows
4. Check view mode buttons (Code/Preview/Split)

**Expected Result:**
- ✅ 5 phase buttons visible (numbered 1-5)
- ✅ Current phase highlighted
- ✅ Phase name/description shown
- ✅ Reasoning visible
- ✅ View mode buttons functional

**What it tests:**
- Phase iteration view loading
- Phase navigation
- View mode toggle buttons

---

### Test 4: File Tree Navigation
**Steps:**
1. In "Code" view mode (default)
2. Look at left side (file tree)
3. Click folder arrows to expand
4. Click on a file to view code
5. Verify code appears on right

**Expected Result:**
- ✅ File tree shows folder structure
- ✅ Current phase files visible
- ✅ Previous phases marked with ✓
- ✅ Future phases disabled (grayed)
- ✅ Clicking file shows code editor

**What it tests:**
- File tree rendering
- Folder expansion/collapse
- Phase-based file filtering
- Code editor display

---

### Test 5: Code Viewing & Actions
**Steps:**
1. In "Code" view, select any file
2. Verify filename/language badge
3. Try Copy button (top right)
4. Try Download button
5. Scroll through code content

**Expected Result:**
- ✅ File name and language shown
- ✅ Copy button changes to ✓ checkmark
- ✅ File downloads locally
- ✅ Code scrolls without breaking
- ✅ Proper syntax formatting

**What it tests:**
- Code editor functionality
- Copy clipboard integration
- File download functionality
- Code display/scrolling

---

### Test 6: Preview Mode
**Steps:**
1. Click "Preview" view mode button
2. Verify preview content shows
3. Navigate through phases (buttons at top)
4. Verify preview updates per phase
5. Check timeline at bottom

**Expected Result:**
- ✅ Preview area shows phase-specific content
- ✅ Phase 1 shows UI component preview
- ✅ Phase 2 shows API endpoint preview
- ✅ Timeline shows progress
- ✅ Content updates when switching phases

**What it tests:**
- Preview mode rendering
- Phase-specific visualization
- Preview update on phase change
- Timeline progress indicator

---

### Test 7: Split Mode
**Steps:**
1. Click "Split" view mode button
2. Verify left side shows code editor
3. Verify right side shows preview
4. Click file in tree (left)
5. Verify code shows in editor
6. Verify preview still visible

**Expected Result:**
- ✅ Two-column layout appears
- ✅ Code editor on left
- ✅ Preview on right
- ✅ Both sections scroll independently
- ✅ Responsive to file selection

**What it tests:**
- Split view layout
- Independent column functionality
- Side-by-side code and preview

---

### Test 8: Phase Navigation
**Steps:**
1. Start at Phase 1
2. Click Phase 2 button
3. Verify file tree updates (new files appear)
4. Click Phase 3
5. Verify more files appear
6. Go back to Phase 1
7. Verify files removed

**Expected Result:**
- ✅ File tree updates per phase
- ✅ Phase 1 files appear/disappear correctly
- ✅ Previous phase files show ✓ checkmark
- ✅ Sequential progression works
- ✅ Going backward shows less files

**What it tests:**
- Phase-based file filtering
- File tree state management
- Phase transition logic

---

### Test 9: Code Copying
**Steps:**
1. Select a code block (any file)
2. Click Copy button
3. Go to text editor (VS Code, Notepad, etc)
4. Ctrl+V (or Cmd+V) to paste
5. Verify entire code block pasted

**Expected Result:**
- ✅ Copy button confirmation shows
- ✅ Full code content copied
- ✅ Formatting preserved
- ✅ All imports/syntax correct

**What it tests:**
- Clipboard integration
- Code completeness
- Syntax preservation

---

### Test 10: File Download
**Steps:**
1. Select a file and click Download
2. Check Downloads folder
3. Open downloaded file
4. Verify content matches

**Expected Result:**
- ✅ File downloads with correct name
- ✅ Content matches displayed code
- ✅ File is readable
- ✅ Proper file extension

**What it tests:**
- File download functionality
- Correct file naming
- Content accuracy

---

## 🎥 Demo Script

### Full Walkthrough (5 minutes)

**Part 1: Overview (1 min)**
```
"Today I'm showing you phase-by-phase code generation. 
When you complete an intake and generate a blueprint, 
we can now generate ALL the code you need - UI, API, 
database, services, and tests. And we'll show you 
exactly how everything is built, step by step."
```

**Part 2: Generate Phases (1 min)**
```
1. Show Blueprint "Implementation" tab
2. Click "Generate Phases" button
3. Wait for loading
4. Show 5 phase cards appearing
"See how the AI generates code for each phase?
UI components, API routes, database schema, 
services, and tests. All production-ready."
```

**Part 3: Detailed View (1 min)**
```
1. Show "All Phases" view (current)
2. Expand Phase 1 (UI)
3. Show code blocks
4. Click Copy/Download
"You can copy any code directly into your project.
Let me show you the progressive view."
```

**Part 4: Build Step-by-Step (2 min)**
```
1. Click "Build Step-by-Step" button
2. Switch to "Split" view
3. Start at Phase 1
4. Click file in tree → show code on left, preview on right
"Now watch as we build. Phase 1 creates UI components."
5. Click Phase 2 button
"Phase 2 adds the API routes that connect to those components."
6. Click Phase 3 button
"Phase 3 adds the database schema."
7. Click Phase 4 button
"Phase 4 adds business logic and integrations."
8. Click Phase 5 button
"And Phase 5 adds all the tests."
"Total effort: about 14 days to build everything."
```

---

## 📋 Checklist for Production

### Functionality
- [x] Phase generation from blueprint
- [x] All 5 phases generate code
- [x] File tree rendering
- [x] Code editor display
- [x] Copy functionality
- [x] Download functionality
- [x] Preview mode working
- [x] Split view layout
- [x] Phase navigation
- [x] Error handling

### UI/UX
- [x] Proper styling (dark theme)
- [x] Responsive layout
- [x] Smooth transitions
- [x] Clear labeling
- [x] Helpful empty states
- [x] Loading states
- [x] Error messages

### Performance
- [x] Fast file tree rendering
- [x] Smooth phase transitions
- [x] Code editor scrolling
- [x] No layout jank

### Browser Support
- [x] Chrome/Chromium
- [x] Firefox
- [x] Safari
- [x] Edge

---

## 🐛 Debugging

### If phases don't generate:
1. Check API key in `.env`
2. Verify `/api/v1/phases` endpoint exists
3. Check browser console for errors
4. Verify LLM is responding (group_api/chat/completions)

### If file tree doesn't show:
1. Verify phase.blocks array has content
2. Check filename parsing logic
3. Verify phases array is populated

### If copy doesn't work:
1. Check browser permissions (clipboard API)
2. Verify code content is populated
3. Check console for clipboard errors

### If view modes don't switch:
1. Check viewMode state is updating
2. Verify CSS classes applying
3. Check component re-renders

---

## 📊 Performance Benchmarks

**Target Performance:**
- Phase generation: < 10 seconds
- Phase navigation: < 100ms
- File tree rendering: < 500ms
- Code copying: Instant
- File download: < 1 second

---

## ✅ Rollout Checklist

Before showing users:
- [x] All tests passing
- [x] No console errors
- [x] API key configured
- [x] Documentation complete
- [x] Edge cases handled
- [x] Error messages helpful
- [x] Loading states clear
- [x] Mobile responsive
- [x] Keyboard navigation working
- [x] Performance acceptable

---

## 🚀 Launch Ready!

You have a complete, tested, production-ready phase-by-phase code generation system!

**Key Achievement:** From blueprint → 5 phases of production code → interactive visualization all in one seamless flow!
