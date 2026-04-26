// ============================================
// Configuration Template
// Copy this to config.js and add your API keys
// ============================================

const CONFIG = {
    // Get API keys from: https://aistudio.google.com/app/apikey
    GEMINI_API_KEYS: [
        'YOUR_API_KEY_1_HERE',
        'YOUR_API_KEY_2_HERE',
        'YOUR_API_KEY_3_HERE',
        'YOUR_API_KEY_4_HERE',
        'YOUR_API_KEY_5_HERE',
        'YOUR_API_KEY_6_HERE',
    ],
    
    CURRENT_KEY_INDEX: 0,
    
    get GEMINI_API_KEY() {
        return this.GEMINI_API_KEYS[this.CURRENT_KEY_INDEX];
    },
    
    switchToNextKey() {
        this.CURRENT_KEY_INDEX = (this.CURRENT_KEY_INDEX + 1) % this.GEMINI_API_KEYS.length;
        console.log('🔄 Switched to API key #' + (this.CURRENT_KEY_INDEX + 1));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}