// ============================================
// PRIORITY MATRIX RADAR CHART
// Visual representation of priority dimensions
// ============================================

class PriorityChart {
    constructor() {
        this.chart = null;
        this.chartCanvas = null;
    }

    /**
     * Initialize or update radar chart
     */
    renderRadarChart(priorityData, canvasId = 'priorityRadarChart') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error('Canvas element not found:', canvasId);
            return;
        }

        // Destroy existing chart if any
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = canvas.getContext('2d');

        const urgency = priorityData.urgency_score || 0;
        const scale = priorityData.scale_score || 0;
        const vulnerability = priorityData.vulnerability_score || 0;
        const severity = priorityData.severity_score || 0;
        const total = priorityData.total_score || 0;
        const normalized = Math.min(10, total / 5); // normalize total to 0-10

        // Choose color based on priority
        const priorityColors = {
            'High': { border: 'rgba(239, 68, 68, 1)', bg: 'rgba(239, 68, 68, 0.2)' },
            'Medium': { border: 'rgba(245, 158, 11, 1)', bg: 'rgba(245, 158, 11, 0.2)' },
            'Low': { border: 'rgba(16, 185, 129, 1)', bg: 'rgba(16, 185, 129, 0.2)' }
        };

        const colors = priorityColors[priorityData.priority_level] || priorityColors['Medium'];

        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Urgency', 'Scale', 'Vulnerability', 'Severity', 'Overall'],
                datasets: [{
                    label: `${priorityData.priority_level} Priority`,
                    data: [urgency, scale, vulnerability, severity, normalized],
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    borderWidth: 2,
                    pointBackgroundColor: colors.border,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colors.border,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        min: 0,
                        max: 10,
                        beginAtZero: true,
                        ticks: {
                            stepSize: 2,
                            font: { size: 11 },
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.08)'
                        },
                        pointLabels: {
                            font: { size: 13, weight: 'bold' },
                            color: '#374151'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 13 },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw}/10`;
                            }
                        }
                    }
                }
            }
        });

        console.log('✅ Radar chart rendered');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PriorityChart;
}