// ============================================
// GEMINI API INTEGRATION MODULE
// WITH:
// ✅ Retry for 503 (high demand)
// ✅ Smart API key rotation (only for quota)
// ✅ Proper error handling (no false quota)
// ============================================
const MAX_RETRIES = 3;
const MAX_KEY_ROTATIONS = CONFIG.GEMINI_API_KEYS.length;
class GeminiAPI {
    constructor() {
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.model = 'gemini-flash-latest';
        this.fallbackModel = 'gemini-1.5-pro-latest';
        this.requestCount = 0;
    }

    getCurrentApiKey() {
        return CONFIG.GEMINI_API_KEY;
    }

    async generateContent(prompt, options = {}, retryCount = 0, keyRotationCount = 0) {
        this.requestCount++;

        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxOutputTokens || 2048,
            }
        };

        const keyNumber = CONFIG.CURRENT_KEY_INDEX + 1;

        try {
            console.log(`🚀 Request #${this.requestCount} | Key #${keyNumber} | Model: ${this.model}`);

            const startTime = Date.now();

            const response = await fetch(
                `${this.baseURL}/${this.model}:generateContent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-goog-api-key': this.getCurrentApiKey()
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            const duration = Date.now() - startTime;

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = errorData.error.message;

                console.error(`❌ API Error: ${errorMsg}`);

                // =========================
                // 🔥 HANDLE 503 (HIGH DEMAND)
                // =========================
                if (
                    response.status === 503 ||
                    errorMsg.includes("high demand")
                ) {
                    if (retryCount < MAX_RETRIES) {
                        console.log(`⏳ Retry ${retryCount + 1}/${MAX_RETRIES} after delay...`);
                        
                        await new Promise(res => setTimeout(res, 2000 * (retryCount + 1)));
                        
                        return this.generateContent(prompt, options, retryCount + 1, keyRotationCount);
                    }

                    console.warn("⚠️ Switching to fallback model...");
                    const originalModel = this.model;
                    await new Promise(res => setTimeout(res, 1500));
                    this.model = this.fallbackModel;

                    const result = await this.generateContent(prompt, options, retryCount + 1, keyRotationCount);

                    // restore model after fallback
                    this.model = originalModel;

                    return result;
                }

                // =========================
                // 🔄 HANDLE QUOTA (KEY ROTATION)
                // =========================
                if (
                    response.status === 429 ||
                    errorMsg.includes("quota") ||
                    errorMsg.includes("rate limit") ||
                    errorMsg.includes("RESOURCE_EXHAUSTED")
                ) {
                    console.warn(`⚠️ Quota exhausted on Key #${keyNumber}`);

                    await new Promise(res => setTimeout(res, 1500));
                    this.markKeyAsExhausted(CONFIG.CURRENT_KEY_INDEX);
                    CONFIG.switchToNextKey();

                    if (keyRotationCount < MAX_KEY_ROTATIONS) {
                        return this.generateContent(prompt, options, retryCount, keyRotationCount + 1);
                    } else {
                    throw new Error("❌ All API keys exhausted");
                    }
                }

                // =========================
                // ❌ HANDLE MODEL ERROR
                // =========================
                if (errorMsg.includes("not found")) {
                    throw new Error("❌ Invalid model name. Fix model configuration.");
                }

                throw new Error(`API Error: ${errorMsg}`);
            }

            const data = await response.json();

            console.log(`✅ Success (${duration}ms)`);
            this.documentResponse(prompt, data, duration, keyNumber);

            return data;

        } catch (error) {
            console.error("❌ Gemini Error:", error);
            throw error;
        }
    }

    /**
     * Mark a key as exhausted (save to localStorage)
     */
    markKeyAsExhausted(keyIndex) {
    let exhaustedKeys = JSON.parse(localStorage.getItem('exhausted_keys') || '[]');
    const now = new Date();

    // 🔥 AUTO-CLEAN OLD KEYS (ADD THIS HERE)
    const ONE_HOUR = 60 * 60 * 1000;

    exhaustedKeys = exhaustedKeys.filter(k => {
        return (now - new Date(k.exhaustedAt)) < ONE_HOUR;
    });

    // Save cleaned list
    localStorage.setItem('exhausted_keys', JSON.stringify(exhaustedKeys));

    // ✅ Correct duplicate check
    const alreadyExists = exhaustedKeys.some(k => k.keyIndex === keyIndex);

    if (!alreadyExists) {
        exhaustedKeys.push({
            keyIndex: keyIndex,
            exhaustedAt: now.toISOString()
        });

        localStorage.setItem('exhausted_keys', JSON.stringify(exhaustedKeys));

        console.log(`📝 Marked Key #${keyIndex + 1} as exhausted at ${now.toISOString()}`);
    }
}

    /**
     * Extract text from Gemini response
     */
    extractText(response) {
        try {
            if (!response || !response.candidates || !response.candidates[0]) {
                console.error('Invalid response structure:', response);
                return '';
            }
            
            const candidate = response.candidates[0];
            if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
                console.error('Invalid candidate structure:', candidate);
                return '';
            }
            
            const text = candidate.content.parts[0].text;
            
            // CRITICAL: Don't truncate here! Return full text
            return text;
            
        } catch (error) {
            console.error('Error extracting text:', error);
            return '';
        }
    }

    /**
     * Extract JSON from response - BULLETPROOF VERSION
     */
    extractJSON(response) {
        // Get FULL text (no truncation)
        let text = this.extractText(response);
        
        if (!text) {
            console.error('❌ No text in response');
            return null;
        }
        
        // Log first 300 chars for debugging (but parse the FULL text)
        console.log('📄 Response preview:', text);
        console.log('📊 Full response length:', text.length, 'characters');
        
        // Step 1: Remove markdown code blocks if present
        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        
        // Step 2: Remove any text before first { and after last }
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            console.error('❌ No JSON object found in response');
            console.error('Full text:', text);
            return null;
        }
        
        // Extract ONLY the JSON part
        const jsonText = text.substring(firstBrace, lastBrace + 1);
        
        console.log('🔍 Extracted JSON length:', jsonText.length, 'characters');
        
        // Step 3: Try to parse
        try {
            const parsed = JSON.parse(jsonText);
            console.log('✅ Successfully parsed JSON');
            console.log('📦 Parsed object keys:', Object.keys(parsed));
            return parsed;
            
        } catch (error) {
            console.error('❌ JSON parsing failed');
            console.error('📝 Attempted to parse:', jsonText);
            console.error('🔴 Parse error:', error.message);
            
            // Try to fix common JSON issues
            let fixedText = jsonText;
            
            // Fix 1: Remove trailing commas
            fixedText = fixedText.replace(/,(\s*[}\]])/g, '$1');
            
            // Fix 2: Ensure proper quotes
            fixedText = fixedText.replace(/'/g, '"');
            
            // Try parsing again
            try {
                const parsed = JSON.parse(fixedText);
                console.log('✅ Successfully parsed JSON (after fixes)');
                return parsed;
            } catch (secondError) {
                console.error('❌ Second parse attempt failed');
                console.error('🔴 Error:', secondError.message);
                return null;
            }
        }
    }

    /**
     * Document API response for testing/debugging
     */
    documentResponse(prompt, response, duration, keyNumber) {
        const doc = {
            timestamp: new Date().toISOString(),
            requestNumber: this.requestCount,
            keyUsed: keyNumber,
            prompt: prompt.substring(0, 200),
            duration: `${duration}ms`,
            responseLength: JSON.stringify(response).length,
            success: response.candidates ? true : false
        };

        console.table(doc);

        // Store in localStorage for documentation
        const existingDocs = JSON.parse(localStorage.getItem('gemini_api_logs') || '[]');
        existingDocs.push(doc);
        
        // Keep only last 50 logs
        if (existingDocs.length > 50) {
            existingDocs.shift();
        }
        
        localStorage.setItem('gemini_api_logs', JSON.stringify(existingDocs));
    }

    /**
     * Get all logged API calls
     */
    getAPILogs() {
        return JSON.parse(localStorage.getItem('gemini_api_logs') || '[]');
    }

    /**
     * Clear API logs
     */
    clearLogs() {
        localStorage.removeItem('gemini_api_logs');
        this.requestCount = 0;
        console.log('✅ API logs cleared');
    }

    /**
     * Get status of all API keys
     */
    getKeyStatus() {
        const exhaustedKeys = JSON.parse(localStorage.getItem('exhausted_keys') || '[]');
        const status = CONFIG.GEMINI_API_KEYS.map((key, index) => {
            const exhaustedInfo = exhaustedKeys.find(k => k.keyIndex === index);
            return {
                keyNumber: index + 1,
                status: exhaustedInfo ? '❌ Exhausted' : '✅ Available',
                exhaustedAt: exhaustedInfo ? exhaustedInfo.exhaustedAt : 'N/A'
            };
        });
        
        console.table(status);
        return status;
    }

    /**
     * Reset all exhausted keys (use after waiting period)
     */
    resetExhaustedKeys() {
        localStorage.removeItem('exhausted_keys');
        CONFIG.CURRENT_KEY_INDEX = 0;
        console.log('✅ Reset all exhausted keys. Starting fresh with Key #1');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiAPI;
}