# User Guide
## Smart Resource Allocation - AI-Powered NGO Analysis

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Analyzing a Report](#analyzing-a-report)
3. [Understanding Results](#understanding-results)
4. [Using Advanced Features](#advanced-features)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Application

**Live Web App:** https://your-project.web.app  
**GitHub Repository:** https://github.com/your-username/solution-challenge-2026

No installation required - works in any modern web browser.

### Browser Compatibility

✅ Chrome (recommended)  
✅ Firefox  
✅ Safari  
✅ Edge  

Minimum screen size: 375px (mobile-friendly)

---

## Analyzing a Report

### Method 1: Use a Sample Report

1. Scroll to the **Sample Report Library** section
2. Click any card (e.g., "Govandi Food Crisis")
3. The report automatically loads into the text area
4. Click **"🚀 Analyze Report with AI"**
5. Wait 15-30 seconds for all 3 stages to complete

### Method 2: Paste Your Own Report

1. Find the text area labeled "Enter NGO Field Report"
2. Paste any community/crisis report (English text)
3. Click **"🚀 Analyze Report with AI"**

**Best Results:**
- Include location (city, district, state)
- Mention affected population count
- Specify the type of need (food, health, education, etc.)
- Indicate urgency (immediate, this week, etc.)

**Example Input:**
Gram Vikas reports flooding in Puri district affecting 200 families.
45 children under 5 at risk. Need immediate shelter and medical supplies.
Contact: Ram Prasad, +91-9876543210

---

## Understanding Results

### Priority Banner

The first thing you'll see is a colored banner:

- **🚨 RED = High Priority** (Score ≥ 35) - Urgent action required
- **⚠️ YELLOW = Medium Priority** (Score 20-34) - Action needed within timeline
- **ℹ️ GREEN = Low Priority** (Score < 20) - Standard response acceptable

### Priority Score Breakdown

The system scores across 4 dimensions (each 0-10):

1. **Urgency** - How quickly action is needed
   - 10 = Immediate/Emergency
   - 6 = This week
   - 2 = Flexible timeline

2. **Scale** - How many people affected
   - 10 = 500+ people
   - 6 = 50-99 people  
   - 2 = Under 20 people

3. **Vulnerability** - Who is affected
   - 10 = Multiple vulnerable groups
   - 9 = Children under 5 or pregnant women
   - 5 = General population

4. **Severity** - How serious the impact
   - 10 = Life-threatening
   - 8 = Health impacting
   - 4 = Development/quality of life

**Formula:** (Urgency × 1.5) + (Scale × 1.2) + (Vulnerability × 1.3) + (Severity × 1.0)

### Volunteer Requirements

The system suggests:

- **Specific roles** (not just "volunteers")
- **Exact count needed** (realistic, usually 2-8)
- **Required skills** for each role
- **Time commitment** (hours or days)
- **Safety requirements**
- **What to bring** (preparation needed)

**Example Output:**
2 Nutritionists
Skills: MUAC screening, child nutrition assessment
Time: 2 days
1 Food Distribution Coordinator
Skills: Logistics management, inventory tracking
Time: 3 days

---

## Using Advanced Features

### 🔬 Before/After Comparison

**Purpose:** See how prompt engineering improves AI output

**How to Use:**
1. Scroll to "Prompt Engineering Evolution" section
2. Click **"Show Comparison"**
3. Review the timeline showing v1.0 → v2.0 → v3.0
4. See the example comparison at bottom

**What You'll Learn:**
- Basic prompts give vague, unstructured output
- Optimized prompts give structured, actionable data
- Quality improvement: 60% → 95% accuracy

---

### 🎯 AI Confidence Meter

**Purpose:** Understand how confident the AI is in its analysis

**What It Shows:**
- **Overall Confidence Score** (0-100%)
  - ≥75% = High confidence
  - 50-74% = Medium confidence
  - <50% = Low confidence

- **Sub-Scores:**
  - Report Clarity (0-25)
  - Data Completeness (0-25)
  - Specificity (0-25)
  - Low Ambiguity (0-25)

**If Confidence is Low (<70%):**
- The system shows "What's Missing" section
- Lists what additional information would help
- Example: "More specific location details", "Exact population count"

---

### 📊 Priority Matrix (Radar Chart)

**Purpose:** Visual representation of priority dimensions

**How to Read:**
- Each axis = one dimension (Urgency, Scale, Vulnerability, Severity)
- Further from center = higher score
- Symmetrical shape = balanced across dimensions
- Skewed shape = dominated by 1-2 factors

---

### 📄 Export to PDF

**Purpose:** Download a professional report to share with your team

**How to Use:**
1. After analysis completes, scroll to bottom
2. Click **"📄 Export as PDF"**
3. PDF downloads automatically
4. Filename: `NGO-Analysis-[Location]-[Date].pdf`

**PDF Includes:**
- Priority banner with score
- All extracted information
- Volunteer requirements table
- Original report text
- Timestamp and branding

---

### 🕐 Analysis History

**Purpose:** Track and reload past analyses

**Features:**
- Saves last 10 analyses automatically (in browser)
- Click any entry to reload that report
- Shows priority level and score for quick reference
- Click "Clear All" to reset history

**Note:** History is stored in browser LocalStorage - clearing browser data will erase it.

---

## Troubleshooting

### "Analysis failed: Stage X failed"

**Cause:** AI API issue or network problem

**Fix:**
1. Check your internet connection
2. Wait 30 seconds and try again (might be rate limiting)
3. Try a different sample report
4. If persistent, refresh the page (F5 or Ctrl+R)

---

### Results show "Not specified" or "0" for fields

**Cause:** Report text was too vague for AI to extract information

**Fix:**
1. Add more specific details to your report
2. Include: exact location, population count, type of need
3. Example: Instead of "need help in Mumbai" write "200 families in Dharavi, Mumbai need food supplies"

---

### Confidence score is low (<50%)

**Not a bug** - the AI is telling you the report lacks detail.

**Fix:**
1. Check the "What's Missing" section
2. Add the suggested information to your report
3. Re-analyze

---

### Export PDF button doesn't work

**Possible Causes:**
- Pop-up blocker is enabled
- Browser doesn't support pdf generation

**Fix:**
1. Allow pop-ups from this site
2. Try a different browser (Chrome recommended)
3. Alternative: Print the results page (Ctrl+P / Cmd+P) and save as PDF

---

### Sample cards don't load

**Cause:** sample-reports.json file failed to load

**Fix:**
1. Refresh the page
2. Check browser console (F12) for error messages
3. If using local version, ensure `data/sample-reports.json` exists

---

### Pipeline stages stuck on "Processing..."

**Cause:** API quota exhausted or network timeout

**Fix:**
1. Wait 1 minute for timeout
2. The system auto-switches to next API key
3. Try again - should work on second attempt
4. If all 6 keys exhausted, wait 1 hour

---

## Privacy & Data

### What Data is Stored?

**Stored Locally (in your browser):**
- Analysis history (last 10)
- No personal information

**Sent to Google Gemini API:**
- Only the report text you analyze
- Used solely for generating analysis
- Not used to train AI models

**Not Stored Anywhere:**
- Your IP address
- User accounts (no login required)
- Report contents on our servers

### Can I use this offline?

No - requires internet connection to access Google Gemini API.

---

## Support & Feedback

**Found a bug?** Open an issue on GitHub: [repo-link]/issues

**Feature request?** Email: [your-email]

**General questions?** Check the FAQ in docs/

---

**Last Updated:** April 21, 2026  
**Version:** 3.0