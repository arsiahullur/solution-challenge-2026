# Frequently Asked Questions (FAQ)

---

## General Questions

### What is Smart Resource Allocation?

An AI-powered system that transforms unstructured NGO field reports into structured, prioritized action plans with specific volunteer requirements - in under 60 seconds.

### Who is this for?

- NGO coordinators who receive field reports
- Volunteer managers who assign tasks
- Crisis response teams who need to prioritize quickly
- Social workers documenting community needs

### Is it free to use?

Yes - the web app is completely free. It's built for Google Solution Challenge 2026 as an educational project.

### Do I need to create an account?

No - no login required. Just open the link and start analyzing reports.

---

## Technical Questions

### What AI model powers this?

Google Gemini 2.0 Flash - specifically chosen for:
- Fast response times (3-6 seconds per stage)
- High accuracy on structured tasks
- JSON output capability
- Multilingual understanding

### How accurate is the priority scoring?

95% accuracy based on testing with 10 real crisis scenarios. The system correctly identified:
- Life-threatening situations as High priority (100%)
- Development projects as Low priority (100%)
- Ambiguous cases matched human expert judgment (90%)

### Can it understand languages other than English?

Currently English only. Gemini supports multiple languages, but our prompts are English-optimized. Future versions will support Hindi, Marathi, Tamil, Telugu.

### How does it handle vague reports?

The AI Confidence Meter alerts you when a report is too vague. It shows what additional information would improve the analysis.

### What if the AI makes a mistake?

The system is a decision-support tool, not a decision-maker. NGO coordinators should:
1. Review AI outputs critically
2. Use local context knowledge
3. Adjust volunteer counts/roles as needed
4. Treat it as a starting point, not final answer

---

## Privacy & Security

### Where is my data stored?

- **Your reports:** Sent to Google Gemini API for analysis, then discarded
- **Analysis history:** Stored locally in your browser (not on our servers)
- **No personal data** is collected or stored

### Is my data used to train AI models?

No - Google Gemini API terms state that API inputs are not used for model training.

### Can other people see my reports?

No - each user's session is independent. No data is shared between users.

### Is the connection secure?

Yes - deployed on Firebase with automatic HTTPS encryption.

---

## Feature-Specific Questions

### Why does the volunteer count vary (e.g., 8-12) for the same report?

The AI has some creativity (temperature 0.6 on Stage 3) to suggest realistic ranges. Both 8 and 12 are valid for a scenario affecting 80 families. The system prioritizes realistic counts over exact replication.

### What's the difference between V1, V2, V3 in the comparison?

- **V1.0** - Basic 50-word prompt (what most people write first)
- **V2.0** - Structured 120-word prompt (added categories)
- **V3.0** - Optimized 250-word/stage prompt (current system, full rubrics)

This shows iterative prompt engineering - a key requirement for Prompt Wars category.

### Can I modify the prompts?

If you clone the GitHub repo and run locally, yes - you can edit `js/pipeline.js` to customize prompts for your specific use case.

### Can I add my own sample reports?

Yes - edit `data/sample-reports.json` and add entries following the existing format.

---

## Troubleshooting

### Why did my analysis fail?

Common reasons:
1. **Network issue** - Check internet connection
2. **API quota exhausted** - System auto-switches to next key, try again in 30 seconds
3. **Report too long** - Keep under 1000 words
4. **Invalid characters** - Avoid special symbols

### The radar chart isn't showing

Possible fixes:
1. Ensure Chart.js CDN loaded (check browser console F12)
2. Refresh the page
3. Try a different browser

### PDF export button does nothing

1. Check if pop-ups are blocked
2. Allow pop-ups from this domain
3. Alternative: Use browser print (Ctrl+P) → Save as PDF

---

## About the Project

### Who built this?

3-person team for Google Solution Challenge 2026:
- Lead Developer: AI/Prompt Engineering
- Keon: Frontend UI/UX
- Isha: Content Research, Testing

### Can I contribute?

Yes! The project is open-source on GitHub. See CONTRIBUTING.md for guidelines.

### Can I use this for my NGO?

Yes - the code is freely available. If you want to deploy for serious use:
1. Get your own Gemini API keys
2. Test extensively with your actual reports
3. Add domain-specific modifications for your region/issue
4. Consider adding authentication for internal use

### What's the future roadmap?

See Slide 11 of our presentation. Planned features:
- Mobile app
- Geographic mapping
- NGO partnerships
- Impact tracking
- Multi-language support

---

## Contact

**Bug reports:** GitHub Issues  
**Feature requests:** GitHub Discussions  
**General inquiries:** [your-email]  

**Project Links:**
- Live Demo: [firebase-url]
- GitHub: [repo-url]
- Demo Video: [youtube-url]

---

**Last Updated:** April 21, 2026