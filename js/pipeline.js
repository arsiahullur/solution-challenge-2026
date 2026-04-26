// ============================================
// pipeline.js  —  3-Stage AI Pipeline
// Stage 1: Information Extraction
// Stage 2: Priority Analysis
// Stage 3: Volunteer Matching
// ============================================

class AnalysisPipeline {
    constructor(geminiAPI) {
        this.gemini          = geminiAPI;
        this.currentAnalysis = null;
    }

    // ==========================================
    // STAGE 1: INFORMATION EXTRACTION
    // ==========================================
    async stage1_extract(reportText) {
        console.log('🔍 STAGE 1: Starting extraction...');

        const prompt = `You are an expert data analyst for NGOs in India.

Your task: Extract structured information from this community report.

REPORT:
${reportText}

EXTRACT THE FOLLOWING:

1. Location: City, area, district, or region mentioned
2. Affected Population: Exact number or estimate
3. Demographics: Who is affected (children/elderly/pregnant/families/general)
4. Need Type: ONE of these: Food Security, Healthcare, Education, Disaster Relief, Water & Sanitation, Infrastructure, Other
5. Urgency Keywords: Words like urgent, emergency, immediate, critical
6. Specific Requirements: Concrete items/services needed
7. Timeline: immediate/this week/this month/flexible
8. Contact: Any organization or person mentioned

CRITICAL INSTRUCTIONS:
- Your response must be ONLY the JSON object
- Start with { and end with }
- No markdown code blocks
- No explanations
- No other text

RETURN THIS EXACT STRUCTURE:
{
  "location": "string",
  "affected_count": number,
  "demographics": "string",
  "need_type": "string",
  "urgency_keywords": ["array"],
  "specific_requirements": ["array"],
  "timeline": "string",
  "contact_info": "string"
}`;

        try {
            const response = await this.gemini.generateContent(prompt, {
                temperature: 0.3,
                maxOutputTokens: 2048
            });

            const extractedData = this.gemini.extractJSON(response);

            if (!extractedData || typeof extractedData !== 'object') {
                throw new Error('Could not parse JSON response from AI');
            }

            const completeData = {
                location:             extractedData.location             || 'Not specified',
                affected_count:       extractedData.affected_count       || 0,
                demographics:         extractedData.demographics         || 'general population',
                need_type:            extractedData.need_type            || 'Other',
                urgency_keywords:     Array.isArray(extractedData.urgency_keywords)     ? extractedData.urgency_keywords     : [],
                specific_requirements:Array.isArray(extractedData.specific_requirements)? extractedData.specific_requirements: [],
                timeline:             extractedData.timeline             || 'flexible',
                contact_info:         extractedData.contact_info         || 'Not specified'
            };

            console.log('✅ STAGE 1 complete:', completeData);
            return { success: true, data: completeData, stage: 1 };

        } catch (error) {
            console.error('❌ STAGE 1 Error:', error);
            return { success: false, error: error.message, stage: 1 };
        }
    }

    // ==========================================
    // STAGE 2: PRIORITY ANALYSIS
    // ==========================================
    async stage2_prioritize(extractedData, originalReport) {
        console.log('📊 STAGE 2: Starting priority analysis...');

        const prompt = `You are a crisis management expert for social organizations in India.

Based on this extracted data, calculate a priority score.

EXTRACTED DATA:
${JSON.stringify(extractedData, null, 2)}

ORIGINAL REPORT CONTEXT:
${originalReport.substring(0, 500)}

PRIORITY SCORING RULES:

1. Urgency Score (0-10):
   - Immediate/Emergency/Critical keywords = 10
   - Within 24-48 hours = 8
   - This week = 6
   - This month = 4
   - Flexible = 2

2. Scale Score (0-10):
   - 500+ people = 10
   - 100-499 people = 8
   - 50-99 people = 6
   - 20-49 people = 4
   - Under 20 people = 2

3. Vulnerability Score (0-10):
   - Multiple vulnerable groups = 10
   - Children under 5 OR pregnant women = 9
   - Children OR elderly = 8
   - Families = 6
   - General population = 5

4. Severity Score (0-10):
   - Life-threatening (malnutrition, maternal emergency) = 10
   - Health impacting = 8
   - Quality of life = 6
   - Development = 4

CALCULATE:
Total Score = (Urgency × 1.5) + (Scale × 1.2) + (Vulnerability × 1.3) + (Severity × 1.0)

Priority Level:
- High   = Total Score ≥ 35
- Medium = Total Score 20-34
- Low    = Total Score < 20

CRITICAL INSTRUCTIONS:
- Your response must be ONLY the JSON object
- Start with { and end with }
- No markdown code blocks
- No explanations
- No other text

RETURN THIS EXACT STRUCTURE:
{
  "urgency_score": number,
  "scale_score": number,
  "vulnerability_score": number,
  "severity_score": number,
  "total_score": number,
  "priority_level": "High" or "Medium" or "Low",
  "reasoning": "2-3 sentence explanation",
  "estimated_response_time": "string like 24 hours or 1 week"
}`;

        try {
            const response = await this.gemini.generateContent(prompt, {
                temperature: 0.4,
                maxOutputTokens: 2048
            });

            const priorityData = this.gemini.extractJSON(response);

            if (!priorityData || typeof priorityData !== 'object') {
                throw new Error('Could not parse JSON response from AI');
            }

            const completeData = {
                urgency_score:          priorityData.urgency_score          || 5,
                scale_score:            priorityData.scale_score            || 5,
                vulnerability_score:    priorityData.vulnerability_score    || 5,
                severity_score:         priorityData.severity_score         || 5,
                total_score:            priorityData.total_score            || 25,
                priority_level:         priorityData.priority_level         || 'Medium',
                reasoning:              priorityData.reasoning              || 'Priority determined based on available information.',
                estimated_response_time:priorityData.estimated_response_time|| '1 week'
            };

            // Validate priority level
            if (!['High','Medium','Low'].includes(completeData.priority_level)) {
                completeData.priority_level = 'Medium';
            }

            // Recalculate score if AI math is off
            const calc = (completeData.urgency_score * 1.5)
                       + (completeData.scale_score * 1.2)
                       + (completeData.vulnerability_score * 1.3)
                       + (completeData.severity_score * 1.0);
            if (Math.abs(completeData.total_score - calc) > 5) {
                console.warn('⚠️ Recalculating total_score');
                completeData.total_score = calc;
            }

            // Ensure level matches score
            if      (completeData.total_score >= 35) completeData.priority_level = 'High';
            else if (completeData.total_score < 20)  completeData.priority_level = 'Low';
            else                                     completeData.priority_level = 'Medium';

            console.log('✅ STAGE 2 complete:', completeData);
            return { success: true, data: completeData, stage: 2 };

        } catch (error) {
            console.error('❌ STAGE 2 Error:', error);
            return { success: false, error: error.message, stage: 2 };
        }
    }

    // ==========================================
    // STAGE 3: VOLUNTEER MATCHING
    // ==========================================
    async stage3_matchVolunteers(extractedData, priorityData, originalReport) {
        console.log('👥 STAGE 3: Starting volunteer matching...');

        const prompt = `You are a volunteer coordination specialist for Indian NGOs.

Based on this community need, suggest specific volunteer requirements.

NEED DETAILS:
${JSON.stringify(extractedData, null, 2)}

PRIORITY ANALYSIS:
Priority Level: ${priorityData.priority_level}
Total Score: ${priorityData.total_score}

TASK:
Create a volunteer requirement plan.

VOLUNTEER ROLE EXAMPLES by category:
- Food Security: Food Distribution Coordinator, Ration Kit Packer, Nutritionist
- Healthcare: General Physician, Nurse/Midwife, ASHA Worker
- Education: Primary Teacher, Child Psychologist
- Disaster: Disaster Response Coordinator, Shelter Setup Volunteer
- Water: WASH Engineer, Water Quality Tester

IMPORTANT GUIDELINES:
- Be REALISTIC with numbers (most needs require 2-8 volunteers total)
- Don't suggest more than 10 volunteers unless it's large-scale disaster
- Match skills to actual need type
- Consider the priority level and scale

CRITICAL INSTRUCTIONS:
- Your response must be ONLY the JSON object
- Start with { and end with }
- No markdown code blocks
- No explanations
- No other text

RETURN THIS EXACT STRUCTURE:
{
  "volunteer_roles": [
    {
      "role": "specific role name",
      "count": number,
      "skills_required": ["skill1", "skill2"],
      "time_commitment": "X hours or Y days"
    }
  ],
  "total_volunteers_needed": number,
  "safety_requirements": ["safety note 1", "safety note 2"],
  "action_summary": "2-3 sentence description of what volunteers will do",
  "preparation_needed": ["item1", "item2"]
}`;

        try {
            const response = await this.gemini.generateContent(prompt, {
                temperature: 0.6,
                maxOutputTokens: 3072
            });

            const volunteerData = this.gemini.extractJSON(response);

            if (!volunteerData || typeof volunteerData !== 'object') {
                throw new Error('Could not parse JSON response from AI');
            }

            if (!Array.isArray(volunteerData.volunteer_roles)) {
                volunteerData.volunteer_roles = [{
                    role: 'General Volunteer',
                    count: 3,
                    skills_required: ['Basic communication', 'Willingness to help'],
                    time_commitment: '4-6 hours'
                }];
            }

            let total = volunteerData.total_volunteers_needed
                || volunteerData.volunteer_roles.reduce((s, r) => s + (r.count || 0), 0);
            if (total > 20) total = 20;

            const completeData = {
                volunteer_roles: volunteerData.volunteer_roles.map(r => ({
                    role:             r.role             || 'Volunteer',
                    count:            r.count            || 1,
                    skills_required:  Array.isArray(r.skills_required) ? r.skills_required : ['Basic skills'],
                    time_commitment:  r.time_commitment  || '4-6 hours'
                })),
                total_volunteers_needed: total,
                safety_requirements: Array.isArray(volunteerData.safety_requirements)
                    ? volunteerData.safety_requirements
                    : ['Follow standard safety protocols'],
                action_summary: volunteerData.action_summary
                    || 'Volunteers will assist with the identified community need through coordinated action.',
                preparation_needed: Array.isArray(volunteerData.preparation_needed)
                    ? volunteerData.preparation_needed
                    : ['Personal water bottle', 'Comfortable clothing', 'Valid ID']
            };

            console.log('✅ STAGE 3 complete:', completeData);
            return { success: true, data: completeData, stage: 3 };

        } catch (error) {
            console.error('❌ STAGE 3 Error:', error);
            return { success: false, error: error.message, stage: 3 };
        }
    }

    // ==========================================
    // RUN FULL PIPELINE
    // ==========================================
    async runFullPipeline(reportText, onStageComplete = null) {
        console.log('🚀 Starting Full 3-Stage Pipeline...');

        const results = { stage1: null, stage2: null, stage3: null, complete: false, error: null };

        try {
            // ── Stage 1 ──
            results.stage1 = await this.stage1_extract(reportText);
            if (!results.stage1.success) throw new Error('Stage 1 failed: ' + results.stage1.error);
            if (onStageComplete) onStageComplete(1, results.stage1);
            await new Promise(resolve => setTimeout(resolve, 2000));

            // ── Stage 2 ──
            results.stage2 = await this.stage2_prioritize(results.stage1.data, reportText);
            if (!results.stage2.success) throw new Error('Stage 2 failed: ' + results.stage2.error);
            if (onStageComplete) onStageComplete(2, results.stage2);
            await new Promise(resolve => setTimeout(resolve, 2000));

            // ── Stage 3 ──
            results.stage3 = await this.stage3_matchVolunteers(results.stage1.data, results.stage2.data, reportText);
            if (!results.stage3.success) throw new Error('Stage 3 failed: ' + results.stage3.error);
            if (onStageComplete) onStageComplete(3, results.stage3);  // ← FIX: was missing, stage 3 UI never updated

            results.complete      = true;
            this.currentAnalysis  = results;
            console.log('🎉 Pipeline Complete!');
            return results;

        } catch (error) {
            console.error('❌ Pipeline Error:', error);
            results.error = error.message;
            return results;
        }
    }
}