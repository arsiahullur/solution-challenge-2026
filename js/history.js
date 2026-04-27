// ============================================
// REPORT HISTORY MODULE - FIXED
// Saves and displays past analyses
// ============================================

class ReportHistory {
    constructor() {
        this.storageKey = 'ngo_report_history';
        this.maxItems = 10;
    }

    /**
     * Save analysis to history
     */
    save(reportText, analysisResults) {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            reportPreview: reportText.substring(0, 100) + '...',
            reportFull: reportText,
            location: analysisResults.stage1.data.location,
            category: analysisResults.stage1.data.need_type,
            priority: analysisResults.stage2.data.priority_level,
            score: analysisResults.stage2.data.total_score,
            fullResults: analysisResults
        };

        let history = this.getAll();
        history.unshift(entry);

        if (history.length > this.maxItems) {
            history = history.slice(0, this.maxItems);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(history));
        console.log('✅ Saved to history');
        this.render();
    }

    /**
     * Get all history
     */
    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Load history entry - FIXED to show full analysis
     */
    load(id) {
        const history = this.getAll();
        const entry = history.find(h => h.id === id);
        
        if (!entry) return;

        // Load report text
        document.getElementById('reportInput').value = entry.reportFull;

        // Display the full analysis results
        if (entry.fullResults && window.displayResults) {
            window.displayResults(entry.fullResults);
            
            // Scroll to results
            document.getElementById('resultsContainer').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    /**
     * Clear all history
     */
    clear() {
        if (confirm('Clear all analysis history?')) {
            localStorage.removeItem(this.storageKey);
            this.render();
        }
    }

    /**
     * Render history list
     */
    render() {
        const container = document.getElementById('historyList');
        if (!container) return;

        const history = this.getAll();

        if (history.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--txd);font-size:0.85rem;padding:20px;">No past analyses</p>';
            return;
        }

        const priorityColors = {
            'High': 'red',
            'Medium': 'amber',
            'Low': 'green'
        };

        container.innerHTML = history.map(entry => `
            <div class="history-item" onclick="reportHistory.load(${entry.id})">
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                        <span class="priority-badge-${entry.priority}">${entry.priority}</span>
                        <span class="category-badge category-${entry.category.toLowerCase().replace(/\s+/g,'')}">${entry.category}</span>
                    </div>
                    <p style="font-size:0.82rem;color:var(--tx);margin:0;font-weight:500;">${entry.location}</p>
                    <p style="font-size:0.74rem;color:var(--txs);margin:4px 0 0;line-height:1.5;">${entry.reportPreview}</p>
                    <p style="font-size:0.68rem;color:var(--txd);margin:6px 0 0;">
                        ${new Date(entry.timestamp).toLocaleString('en-IN')}
                    </p>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                    <div style="font-size:1.5rem;font-weight:800;color:var(--ac);">
                        ${typeof entry.score === 'number' ? entry.score.toFixed(0) : entry.score}
                    </div>
                    <div style="font-size:0.65rem;color:var(--txd);margin-top:2px;">score</div>
                </div>
            </div>
        `).join('');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportHistory;
}