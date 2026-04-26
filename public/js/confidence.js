// ============================================
// AI CONFIDENCE METER MODULE
// Asks AI to rate its own confidence in analysis
// ============================================

class ConfidenceMeter {
    constructor(geminiAPI) {
        this.gemini = geminiAPI;
    }

    /**
     * Ask AI to rate its confidence for a given analysis
     */
    async getConfidenceScore(reportText, analysisData) {
        console.log('🎯 Getting AI Confidence Score...');

        const prompt = `You are an AI transparency system reviewing an NGO report analysis.

ORIGINAL REPORT:
${reportText.substring(0, 400)}

ANALYSIS PERFORMED:
Location: ${analysisData.location || 'Not specified'}
Affected Count: ${analysisData.affected_count || 0}
Need Type: ${analysisData.need_type || 'Unknown'}
Priority Level: ${analysisData.priority_level || 'Unknown'}

EVALUATE YOUR CONFIDENCE based on these factors:
1. Report Clarity (0-25): How clear and detailed was the original report?
2. Data Completeness (0-25): Were all key fields extractable?
3. Specificity (0-25): Are numbers and details precise or vague?
4. Ambiguity Level (0-25): How many assumptions did you have to make?

ALSO IDENTIFY: What additional information, if provided, would improve confidence?

CRITICAL: Return ONLY JSON. Start with { and end with }

{
  "report_clarity": number (0-25),
  "data_completeness": number (0-25),
  "specificity": number (0-25),
  "low_ambiguity": number (0-25),
  "overall_confidence": number (0-100),
  "confidence_label": "High" or "Medium" or "Low",
  "missing_info": ["list of what would help"],
  "confidence_explanation": "1-2 sentence explanation"
}`;

        try {
            const response = await this.gemini.generateContent(prompt, {
                temperature: 0.3,
                maxOutputTokens: 1024
            });

            const confidenceData = this.gemini.extractJSON(response);

            if (!confidenceData) {
                throw new Error('Could not parse confidence score');
            }

            // Fill defaults if missing
            const completeData = {
                report_clarity: confidenceData.report_clarity || 15,
                data_completeness: confidenceData.data_completeness || 15,
                specificity: confidenceData.specificity || 15,
                low_ambiguity: confidenceData.low_ambiguity || 15,
                overall_confidence: confidenceData.overall_confidence ||
                    (confidenceData.report_clarity + confidenceData.data_completeness +
                    confidenceData.specificity + confidenceData.low_ambiguity) || 60,
                confidence_label: confidenceData.confidence_label || 'Medium',
                missing_info: Array.isArray(confidenceData.missing_info)
                    ? confidenceData.missing_info
                    : ['More specific location details', 'Exact population count'],
                confidence_explanation: confidenceData.confidence_explanation ||
                    'Confidence based on available report information.'
            };

            // Validate confidence label matches score
            if (completeData.overall_confidence >= 75) {
                completeData.confidence_label = 'High';
            } else if (completeData.overall_confidence >= 50) {
                completeData.confidence_label = 'Medium';
            } else {
                completeData.confidence_label = 'Low';
            }

            console.log('✅ Confidence Score:', completeData.overall_confidence);
            return { success: true, data: completeData };

        } catch (error) {
            console.error('❌ Confidence Error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get color for confidence level
     */
    getConfidenceColor(score) {
        if (score >= 75) return { bg: 'green', hex: '#10b981' };
        if (score >= 50) return { bg: 'yellow', hex: '#f59e0b' };
        return { bg: 'red', hex: '#ef4444' };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfidenceMeter;
}