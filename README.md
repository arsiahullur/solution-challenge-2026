# Smart Resource Allocation 🧠
### AI-Powered NGO Volunteer Coordination System

> **Google Solution Challenge 2026 — Prompt Wars Category**

---

## The Problem
Local NGOs collect critical community data through field reports, but this information is:
- Unstructured and hard to compare
- Difficult to prioritize objectively  
- Time-consuming to act on
- Inaccessible to volunteers who need clear guidance

## Our Solution
An AI pipeline that transforms any NGO field report into a structured, prioritized, volunteer-matched action plan in under 60 seconds.

**Live Demo:** [link after deployment]  
**Video Demo:** [YouTube link]  
**Presentation:** [Slides link]

---

## Key Features

| Feature | Description |
|---------|-------------|
| **3-Stage AI Pipeline** | Extract → Prioritize → Match |
| **Multi-Dimensional Scoring** | Urgency × Scale × Vulnerability × Severity |
| **Prompt Engineering Showcase** | Live Before/After comparison (V1 vs V3) |
| **AI Confidence Meter** | AI rates its own analysis quality |
| **Priority Matrix** | Radar chart visualizing 4 dimensions |
| **PDF Export** | Downloadable, branded report |
| **Sample Library** | 10 curated real-world NGO reports |
| **Report History** | LocalStorage — track past analyses |

---

## Prompt Engineering Approach

Our 3-stage pipeline uses **iterative prompt engineering** across 3 versions:

| Version | Words | Accuracy | Key Change |
|---------|-------|----------|------------|
| V1.0 Basic | 50 | 60% | Initial attempt |
| V2.0 Structured | 120 | 75% | Added JSON schema |
| V3.0 Optimized | 250/stage | 95% | Rubrics + multi-stage |

Full prompt evolution documented in `docs/prompt-versions.md`

---

## Tech Stack

- **AI:** Google Gemini 2.0 Flash
- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
- **Charts:** Chart.js 4.4.0
- **PDF:** html2pdf.js
- **Hosting:** Firebase
- **Fonts:** DM Sans + DM Mono

---

## Setup Instructions

1. Clone this repository
2. Copy `js/config.example.js` to `js/config.js`
3. Get Gemini API keys from https://aistudio.google.com/app/apikey
4. Replace `YOUR_API_KEY_X_HERE` with your actual keys
5. Open `index.html` in a browser

```bash
# Firebase deployment
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Team

| Name | Role |
|------|------|
| [Your Name] | AI/Prompt Engineering, Integration |
| Keon | Frontend Development, UI/UX |
| Isha | Content, Testing, Documentation |

---
# Smart Resource Allocation 🧠

**Live Demo:** https://solution-challenge-2026-a8a54.web.app  
**Video Demo:** https://youtu.be/your-video-id  
**GitHub Repo:** https://github.com/your-username/solution-challenge-2026  
**Presentation:** [Will add on Day 7]  

## Documentation

- [User Guide](docs/user-guide.md)
- [FAQ](docs/FAQ.md)
- [Technical Architecture](docs/architecture.md)
- [Prompt Version History](docs/prompt-versions.md)
- [Test Cases](docs/test-cases.md)
- [Contributing Guidelines](CONTRIBUTING.md)

**Last Updated:** April 26, 2026
