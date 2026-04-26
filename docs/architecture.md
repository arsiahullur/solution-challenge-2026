# Technical Architecture
## Smart Resource Allocation — Solution Challenge 2026

---

## System Overview
[User Input] → [3-Stage AI Pipeline] → [Structured Output]
↓
[Gemini 2.0 Flash API]
↓
Stage 1 → Stage 2 → Stage 3
Extract  Priority  Volunteer
Match

## File Structure
solution-challenge-2026/
├── index.html          # Main UI — all sections
├── css/
│   └── styles.css      # All custom styles
├── js/
│   ├── config.js       # API keys (NOT on GitHub)
│   ├── gemini.js       # API wrapper + auto key rotation
│   ├── pipeline.js     # 3-stage AI pipeline
│   ├── comparison.js   # Before/After comparison
│   ├── confidence.js   # AI confidence meter
│   ├── chart-setup.js  # Radar chart (Chart.js)
│   ├── export.js       # PDF export (html2pdf.js)
│   ├── history.js      # LocalStorage history
│   └── app.js          # Main UI logic
├── data/
│   └── sample-reports.json  # 10 curated NGO reports
└── docs/
├── api-responses.md
├── prompt-versions.md
├── test-cases.md
└── architecture.md

## AI Pipeline Detail

### Stage 1 — Information Extraction
- **Model:** Gemini 2.0 Flash
- **Temperature:** 0.3 (factual, low creativity)
- **Max tokens:** 2048
- **Output:** JSON with 8 fields
- **Purpose:** Parse unstructured text into structured data

### Stage 2 — Priority Analysis  
- **Model:** Gemini 2.0 Flash
- **Temperature:** 0.4
- **Max tokens:** 2048
- **Scoring formula:** (U×1.5) + (Sc×1.2) + (V×1.3) + (Sv×1.0)
- **Output:** Priority level + 4 dimension scores + reasoning

### Stage 3 — Volunteer Matching
- **Model:** Gemini 2.0 Flash
- **Temperature:** 0.6 (slightly creative for role suggestions)
- **Max tokens:** 3072
- **Output:** Specific volunteer roles with skills + safety notes

## Unique Features

| Feature | How It Works |
|---------|-------------|
| Multi-stage pipeline | 3 separate prompts, each building on previous output |
| Priority scoring | Mathematical formula, not just "High/Medium/Low" |
| Confidence meter | AI rates its own analysis quality |
| Before/After comparison | Same report through V1 vs V3 prompt |
| Auto key rotation | 6 API keys, auto-switches on quota exhaustion |

## Prompt Engineering Approach

### V1.0 (Basic)
~50 words. No structure. Inconsistent output. Cannot be parsed.

### V2.0 (Structured)  
~120 words. Added JSON requirement. Better categories. Still limited.

### V3.0 (Optimized — Current)
~250 words per stage. Explicit scoring rubrics. Example-driven. 
JSON-only enforcement. Default filling for missing fields.
Result: 95% consistent, parseable, actionable output.

## Rate Limit Handling
- 6 API keys in config
- Auto-rotation on RESOURCE_EXHAUSTED error
- 2-second delays between pipeline stages
- Results cached in localStorage after first run

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | HTML5 + Tailwind CSS + Vanilla JS |
| AI Engine | Google Gemini 2.0 Flash |
| Charts | Chart.js 4.4.0 |
| PDF Export | html2pdf.js 0.10.1 |
| Storage | Firebase Hosting + LocalStorage |
| Fonts | DM Sans + DM Mono |