# Contributing to Smart Resource Allocation

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

---

## Ways to Contribute

### 1. Report Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and version info

### 2. Suggest Features

Feature requests are welcome! Please include:
- Use case / problem it solves
- Proposed solution
- Alternatives you've considered

### 3. Improve Documentation

Help us improve:
- User guide clarity
- Code comments
- README instructions
- FAQ entries

### 4. Add Sample Reports

Contribute realistic NGO reports (anonymized):
- Add to `data/sample-reports.json`
- Include category, location, priority
- Ensure no personally identifiable information

### 5. Code Contributions

See "Development Setup" below.

---

## Development Setup

### Prerequisites

- Node.js 14+ (for Firebase CLI)
- Git
- Google Gemini API key

### Local Setup

```bash
# Clone the repo
git clone https://github.com/your-username/solution-challenge-2026
cd solution-challenge-2026

# Copy config template
cp js/config.example.js js/config.js

# Add your API keys to js/config.js

# Open index.html in browser
# OR use a local server:
npx http-server -p 8080
```

### Testing Changes

1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Test with at least 3 sample reports
3. Check browser console for errors (F12)
4. Verify mobile responsiveness (resize to 375px)

---

## Code Style Guidelines

### JavaScript

- Use meaningful variable names
- Add comments for complex logic
- Keep functions under 50 lines when possible
- Use async/await (not .then() chains)

### HTML

- Semantic tags (section, article, nav)
- Accessibility: alt text, ARIA labels
- Tailwind CSS classes for styling

### Prompts (Critical!)

If modifying AI prompts in `pipeline.js`:

- Test changes thoroughly (at least 5 reports)
- Document what changed and why
- Measure accuracy before/after
- Never remove "JSON ONLY" instructions

---

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** for your feature (`git checkout -b feature/amazing-feature`)
3. **Make changes** following style guidelines
4. **Test thoroughly** (see Testing Changes above)
5. **Commit** with clear message (`git commit -m 'Add amazing feature'`)
6. **Push** to your fork (`git push origin feature/amazing-feature`)
7. **Open PR** with description of changes

### PR Description Template
What does this PR do?
[Brief description]
What problem does it solve?
[Issue # or user need]
How was it tested?
[Your testing process]
Screenshots (if applicable)
[Before/after images]
Checklist

 Code follows style guidelines
 Tested on Chrome, Firefox, Safari
 No console errors
 Mobile responsive
 Documentation updated if needed
 ---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Welcome newcomers
- Assume good intentions

---

## Questions?

Open a Discussion on GitHub or email [your-email].

---

**Thank you for contributing!** 🎉