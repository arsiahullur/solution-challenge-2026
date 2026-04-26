// ============================================
// BEFORE/AFTER PROMPT COMPARISON MODULE
// Shows difference between Basic vs Optimized prompts
// ============================================

class PromptComparison {
    constructor(geminiAPI) {
        this.gemini = geminiAPI;
    }

    /**
     * BASIC PROMPT (Version 1.0) - Simple, vague
     * This is what most people would write
     */
    async runBasicPrompt(reportText) {
        console.log('📝 Running Basic Prompt (V1.0)...');

        const basicPrompt = `Analyze this NGO report and categorize it.

Report: ${reportText}

Give me:
- Category
- Priority
- How many volunteers
- What help is needed`;

        try {
            const startTime = Date.now();

            const response = await this.gemini.generateContent(basicPrompt, {
                temperature: 0.7,
                maxOutputTokens: 512
            });

            const endTime = Date.now();
            const duration = endTime - startTime;
            const rawText = this.gemini.extractText(response);

            console.log('✅ Basic prompt complete in', duration, 'ms');

            return {
                success: true,
                version: 'v1.0 - Basic',
                prompt: basicPrompt,
                rawOutput: rawText,
                duration: duration,
                tokenCount: rawText.length,
                isStructured: false,
                hasJSON: false,
                hasPriorityScore: false,
                hasVolunteerRoles: false,
                hasLocationData: false
            };

        } catch (error) {
            console.error('Basic prompt error:', error);
            return {
                success: false,
                version: 'v1.0 - Basic',
                error: error.message
            };
        }
    }

    /**
     * OPTIMIZED PROMPT (Version 3.0) - Detailed, structured
     * This is YOUR engineered prompt
     */
    async runOptimizedPrompt(reportText) {
        console.log('⭐ Running Optimized Prompt (V3.0)...');

        const optimizedPrompt = `You are an expert NGO data analyst and crisis coordinator for India.

Analyze this community report with precision and provide a structured assessment.

REPORT:
${reportText}

YOUR ANALYSIS MUST INCLUDE:

1. INFORMATION EXTRACTION:
   - Exact location (city/district/state)
   - Affected population count
   - Demographics (children/elderly/pregnant/families/general)
   - Primary need type: Food Security / Healthcare / Education / Disaster Relief / Water & Sanitation / Infrastructure

2. MULTI-DIMENSIONAL PRIORITY SCORING:
   - Urgency Score (0-10): Based on timeline keywords
   - Scale Score (0-10): Based on population affected
   - Vulnerability Score (0-10): Based on demographics
   - Severity Score (0-10): Based on life impact
   - Total Score = (Urgency×1.5) + (Scale×1.2) + (Vulnerability×1.3) + (Severity×1.0)
   - Priority Level: High (≥35) / Medium (20-34) / Low (<20)

3. VOLUNTEER REQUIREMENTS:
   - Specific roles with required skills
   - Exact count needed per role
   - Time commitment
   - Safety requirements

4. REASONING: 2-3 sentences explaining the priority decision

CRITICAL: Return ONLY valid JSON. Start with { and end with }

{
  "location": "string",
  "affected_count": number,
  "demographics": "string",
  "need_type": "string",
  "urgency_score": number,
  "scale_score": number,
  "vulnerability_score": number,
  "severity_score": number,
  "total_score": number,
  "priority_level": "High/Medium/Low",
  "reasoning": "string",
  "volunteer_roles": [
    {"role": "string", "count": number, "skills": "string"}
  ],
  "specific_requirements": ["array"],
  "timeline": "string"
}`;

        try {
            const startTime = Date.now();

            const response = await this.gemini.generateContent(optimizedPrompt, {
                temperature: 0.3,
                maxOutputTokens: 2048
            });

            const endTime = Date.now();
            const duration = endTime - startTime;
            const parsedData = this.gemini.extractJSON(response);
            const rawText = this.gemini.extractText(response);

            console.log('✅ Optimized prompt complete in', duration, 'ms');

            return {
                success: true,
                version: 'v3.0 - Optimized',
                prompt: optimizedPrompt,
                rawOutput: rawText,
                parsedData: parsedData,
                duration: duration,
                tokenCount: rawText.length,
                isStructured: true,
                hasJSON: parsedData !== null,
                hasPriorityScore: parsedData && parsedData.total_score !== undefined,
                hasVolunteerRoles: parsedData && Array.isArray(parsedData.volunteer_roles),
                hasLocationData: parsedData && parsedData.location !== undefined
            };

        } catch (error) {
            console.error('Optimized prompt error:', error);
            return {
                success: false,
                version: 'v3.0 - Optimized',
                error: error.message
            };
        }
    }

    /**
     * Run both prompts and return comparison data
     */
    async runComparison(reportText) {
        console.log('🔄 Starting Before/After Comparison...');

        const basic = await this.runBasicPrompt(reportText);

        // Wait 3 seconds between calls to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 3000));

        const optimized = await this.runOptimizedPrompt(reportText);

        // Calculate quality metrics
        const metrics = this.calculateMetrics(basic, optimized);

        return {
            basic,
            optimized,
            metrics,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Calculate improvement metrics between basic and optimized
     */
    calculateMetrics(basic, optimized) {
        return {
            speedDiff: basic.duration && optimized.duration
                ? Math.round(((optimized.duration - basic.duration) / basic.duration) * 100)
                : 0,
            structureImprovement: optimized.isStructured && !basic.isStructured,
            jsonAvailable: optimized.hasJSON,
            priorityScoreAdded: optimized.hasPriorityScore,
            volunteerRolesAdded: optimized.hasVolunteerRoles,
            locationDataAdded: optimized.hasLocationData,
            outputLengthRatio: basic.tokenCount && optimized.tokenCount
                ? Math.round((optimized.tokenCount / basic.tokenCount) * 100)
                : 0,
            qualityScore: this.calculateQualityScore(optimized),
            basicQualityScore: this.calculateQualityScore(basic)
        };
    }

    /**
     * Calculate a quality score (0-100) for an output
     */
    calculateQualityScore(result) {
        if (!result.success) return 0;
        let score = 20; // Base score for getting a response
        if (result.isStructured) score += 20;
        if (result.hasJSON) score += 20;
        if (result.hasPriorityScore) score += 15;
        if (result.hasVolunteerRoles) score += 15;
        if (result.hasLocationData) score += 10;
        return score;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptComparison;
}