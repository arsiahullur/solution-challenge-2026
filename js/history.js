// ============================================
// REPORT HISTORY MODULE
// Saves past analyses to localStorage
// ============================================

class ReportHistory {
    constructor() {
        this.storageKey = 'ngo_report_history';
        this.maxItems = 10;
    }

    /**
     * Save an analysis to history
     */
    save(reportText, analysisResults) {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            reportPreview: reportText.substring(0, 80) + '...',
            location: analysisResults.stage1.data.location,
            category: analysisResults.stage1.data.need_type,
            priority: analysisResults.stage2.data.priority_level,
            score: analysisResults.stage2.data.total_score,
            fullReport: reportText,
            fullResults: analysisResults
        };

        const history = this.getAll();
        history.unshift(entry); // Add to front

        // Keep only last 10
        if (history.length > this.maxItems) {
            history.pop();
        }

        localStorage.setItem(this.storageKey, JSON.stringify(history));
        console.log('✅ Analysis saved to history');
        this.renderHistory();
    }

    /**
     * Get all history entries
     */
    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Load a history entry into the main input
     */
    load(id) {
        const history = this.getAll();
        const entry = history.find(h => h.id === id);
        if (entry) {
            document.getElementById('reportInput').value = entry.fullReport;
            document.getElementById('reportInput').scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Clear all history
     */
    clear() {
        localStorage.removeItem(this.storageKey);
        this.renderHistory();
    }

    /**
     * Render history in UI
     */
    renderHistory() {
        const container = document.getElementById('historyList');
        if (!container) return;

        const history = this.getAll();

        if (history.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">No analyses yet. Run your first analysis above!</p>';
            return;
        }

        const priorityColors = { High: 'red', Medium: 'yellow', Low: 'green' };

        container.innerHTML = history.map(entry => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-2 hover:bg-gray-100 transition cursor-pointer"
                 onclick="reportHistory.load(${entry.id})">
                <div class="flex-1 min-w-0 mr-3">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs px-2 py-0.5 rounded-full bg-${priorityColors[entry.priority] || 'gray'}-100 text-${priorityColors[entry.priority] || 'gray'}-800 font-bold">${entry.priority}</span>
                        <span class="text-xs text-gray-500">${entry.category}</span>
                    </div>
                    <p class="text-sm text-gray-700 truncate">${entry.location} — ${entry.reportPreview}</p>
                    <p class="text-xs text-gray-400 mt-1">${new Date(entry.timestamp).toLocaleString('en-IN')}</p>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold text-blue-600">${typeof entry.score === 'number' ? entry.score.toFixed(0) : entry.score}</div>
                    <div class="text-xs text-gray-400">score</div>
                </div>
            </div>
        `).join('');
    }
}
