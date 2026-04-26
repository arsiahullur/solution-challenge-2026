# Test Cases Document
## Smart Resource Allocation — Solution Challenge 2026

---

## Test Suite 1: Sample Report Analysis (10 tests)

For each test:
1. Select the report from the library
2. Click "Analyze Report with AI"  
3. Wait for all 3 stages to complete
4. Record results below

---

### Test 1: Govandi Food Crisis
**Input:** Report #1 (Food Security)  
**Expected Priority:** High  
**Expected Category:** Food Security  
**Expected Volunteers:** 3–6

| Field    | Expected | Actual | Pass/Fail |
|-------   |----------|--------|-----------|
| Priority Level | High | | |
| Category | Food Security | | |
| Location | Govandi / Mumbai | | |
| Affected Count | ~80 | | |
| Stage 1 ✅ | Completes | | |
| Stage 2 ✅ | Completes | | |
| Stage 3 ✅ | Completes | | |
| PDF Export | Downloads | | |

**Notes:**
[Fill after testing]

---

### Test 2: Khardi Medical Camp
**Input:** Report #2 (Healthcare)  
**Expected Priority:** Medium  

| Field | Expected | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Priority Level | Medium | | |
| Category | Healthcare | | |
| Stage 1 ✅ | Completes | | |
| Stage 2 ✅ | Completes | | |
| Stage 3 ✅ | Completes | | |

---

### Test 3: Palghar Education
**Input:** Report #3 (Education)  
**Expected Priority:** Medium  

| Field | Expected | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Priority Level | Medium/Low | | |
| Category | Education | | |
| All stages ✅ | Complete | | |

---

### Tests 4–10
[Repeat for all 10 reports — same table format]

---

## Test Suite 2: Before/After Comparison (3 tests)

### Comparison Test 1
**Report Used:** Report #1 (Food Crisis)  

| Check | Pass/Fail |
|-------|-----------|
| Basic prompt runs | |
| Optimized prompt runs | |
| Quality improvement shows > 0% | |
| Metrics grid displays | |
| Basic output is unstructured text | |
| Optimized output is JSON | |

---

### Comparison Tests 2 & 3
[Repeat for Reports #4 and #8]

---

## Test Suite 3: Confidence Meter (3 tests)

### Confidence Test 1: High Confidence Report
**Use:** Report #1 (very detailed)  
**Expected confidence:** > 75

| Check | Pass/Fail |
|-------|-----------|
| Confidence card appears | |
| Score > 75 | |
| Circle animates | |
| All 4 sub-scores show | |
| Label says "High Confidence" | |

### Confidence Test 2: Low Confidence Report
**Use:** Type this vague text in the textarea:  
`"People need help somewhere in India. Food problems. Send volunteers."`

**Expected confidence:** < 50

| Check | Pass/Fail |
|-------|-----------|
| Confidence score < 50 | |
| "Missing info" section appears | |
| Missing info list is populated | |

---

## Test Suite 4: PDF Export (2 tests)

### Export Test 1
1. Run analysis on Report #1
2. Click "Export PDF" button
3. Verify download starts

| Check | Pass/Fail |
|-------|-----------|
| PDF download starts | |
| File opens correctly | |
| Priority shown in PDF | |
| Volunteer table in PDF | |
| Footer with team name | |

---

## Test Suite 5: Report History (2 tests)

### History Test 1
1. Run 3 different analyses
2. Check History section

| Check | Pass/Fail |
|-------|-----------|
| 3 entries appear in history | |
| Priority badges show correct color | |
| Clicking entry loads report | |
| Clear All removes entries | |

---

## Test Suite 6: Sample Library (2 tests)

| Check | Pass/Fail |
|-------|-----------|
| All 10 cards render | |
| Category filter works | |
| Click loads report into textarea | |
| "All" filter shows all 10 | |

---

## Test Suite 7: Error Handling (2 tests)

### Error Test 1: Empty Input
1. Clear the textarea
2. Click "Analyze Report"
3. Should show alert, NOT crash

### Error Test 2: API Key Exhausted
1. Simulate by temporarily putting wrong key in config.js
2. Should show a clear error message, not a blank screen

---

## Summary Table

| Test Suite | Total Tests | Passed | Failed | Pass Rate |
|-----------|-------------|--------|--------|-----------|
| Suite 1: Sample Reports | 10 | | | |
| Suite 2: Comparison | 3 | | | |
| Suite 3: Confidence | 3 | | | |
| Suite 4: PDF Export | 2 | | | |
| Suite 5: History | 2 | | | |
| Suite 6: Library | 2 | | | |
| Suite 7: Error Handling | 2 | | | |
| **TOTAL** | **24** | | | |

---

## Bugs Found

| Bug # | Description | Steps to Reproduce | Severity | Fixed? |
|-------|-------------|-------------------|----------|--------|
| 1 | | | | |

---

**Tester:** [Your Name]  
**Date:** April 20, 2026  
**Browser:** Chrome [version]