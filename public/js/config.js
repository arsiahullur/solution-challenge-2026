// ============================================
// Configuration File
// Contains API keys and app settings
// ⚠️ DO NOT COMMIT THIS FILE TO GITHUB
// ============================================

const CONFIG = {
    // Array of API keys - will rotate automatically
    GEMINI_API_KEYS: [
        'AIzaSyDj6pNo06DtcmDkemHzuBmso_Stvi8In9Q',        // Key 1
        'AIzaSyAn0dMiuxXMIHEMjmm4CJ75EVjymLWGk7U',       // Key 2
        'AIzaSyC8CneNJtZYUFxopF9iDz2Zloi6e7tykTw',      // Key 3
        'AIzaSyCtwo8xrkz8zNUHYGMlkPtqPy5QJjrBnBg',     // Key 4
        'AIzaSyB0x3kGGMtSxXpJCunaFXvCF3F3MMmKrj4',    // Key 5
        'AIzaSyCPJefgEz8XDDT9TUV3mDG7YG9q4rWCrvM',   // Key 6
        'AIzaSyAAyNejuftbimvDwr6epUgxNcWPEPsU9U0'   // Key 7
    ],
    
    CURRENT_KEY_INDEX: 0,
    
    // Helper to get current key
    get GEMINI_API_KEY() {
        return this.GEMINI_API_KEYS[this.CURRENT_KEY_INDEX];
    },
    
    // Helper to switch to next key
    switchToNextKey() {
        this.CURRENT_KEY_INDEX = (this.CURRENT_KEY_INDEX + 1) % this.GEMINI_API_KEYS.length;
        console.log('🔄 Switched to API key #' + (this.CURRENT_KEY_INDEX + 1) + '/' + this.GEMINI_API_KEYS.length);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}