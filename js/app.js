// ============================================================
// app.js — Main Application Logic
// Smart Resource Allocation · Google Solution Challenge 2026
// ============================================================

// ── Global state ──
let geminiAPI        = null;
let pipeline         = null;
let sampleReports    = [];
let currentFilter    = 'all';
let radarChart       = null;
let lastResults      = null;
let lastReportText   = '';
let exportManager = null;
let reportHistory = null;

// Error handler for missing files
window.addEventListener('error', function(e) {
    if (e.message.includes('Failed to fetch') || e.message.includes('404')) {
        console.error('Missing file:', e.filename);
        alert('⚠️ App Error: Some files are missing. Check the browser console.');
    }
});

// ── Single init ──
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 Smart Resource Allocation initializing...');

    try {
        geminiAPI = new GeminiAPI(CONFIG.GEMINI_API_KEY);
        pipeline  = new AnalysisPipeline(geminiAPI);
        console.log('✅ Gemini API + Pipeline ready');
    } catch (err) {
        console.error('❌ Init failed:', err);
        alert('Error: Could not initialize AI. Check your API key in js/config.js');
        return;
    }

    await loadSampleReports();
    // Init export manager (from export.js)
    if (window.ExportManager) exportManager = new ExportManager();
    // Render history from localStorage
    renderHistory();
});

// ============================================================
// SAMPLE REPORTS
// ============================================================

async function loadSampleReports() {
    try {
        const res   = await fetch('data/sample-reports.json');
        sampleReports = await res.json();
        renderSampleGrid();
        populateComparisonDropdown();
        console.log('✅ Loaded', sampleReports.length, 'sample reports');
    } catch (err) {
        console.error('Error loading sample reports:', err);
    }
}

function getCategoryClass(category) {
    return 'category-' + (category || '').toLowerCase().replace(/[^a-z]/g, '');
}

function renderSampleGrid(filter) {
    const grid = document.getElementById('sampleGrid');
    if (!grid) return;

    const list = (filter && filter !== 'all')
        ? sampleReports.filter(r => r.category === filter)
        : sampleReports;

    if (list.length === 0) {
        grid.innerHTML = '<p class="text-gray-400 text-sm col-span-3 text-center py-4">No reports in this category.</p>';
        return;
    }

    grid.innerHTML = list.map(report => {
        const idx      = sampleReports.indexOf(report);
        const catClass = getCategoryClass(report.category);
        return `
            <div class="sample-card glass-card rounded-xl p-4" onclick="selectReport(${idx})">
                <div class="flex items-start justify-between mb-2">
                    <div class="text-2xl mr-2">${report.priority_indicator || '📄'}</div>
                    <span class="category-badge ${catClass}">${report.category}</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-1 text-sm">${report.title}</h3>
                <p class="text-xs text-gray-600">📍 ${report.location}</p>
            </div>
        `;
    }).join('');
}

function filterSamples(category, btn) {
    currentFilter = category;
    renderSampleGrid(category);
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

function selectReport(index) {
    const report   = sampleReports[index];
    const textarea = document.getElementById('reportInput');
    textarea.value = report.text;
    document.querySelectorAll('.sample-card').forEach((card, i) => {
        card.classList.toggle('selected', sampleReports.indexOf(sampleReports[i < sampleReports.length ? i : 0]) === index);
    });
    // re-highlight correctly
    document.querySelectorAll('.sample-card').forEach(card => card.classList.remove('selected'));
    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    textarea.focus();
}

function populateComparisonDropdown() {
    const sel = document.getElementById('comparisonSampleSelect');
    if (!sel) return;
    sampleReports.forEach((r, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${i + 1}. ${r.title}`;
        sel.appendChild(opt);
    });
}

// ============================================================
// MAIN ANALYSIS
// ============================================================

async function startAnalysis() {
    const reportText = document.getElementById('reportInput').value.trim();
    if (!reportText) { alert('⚠️ Please enter or select a report first!'); return; }

    const btn     = document.getElementById('analyzeBtn');
    const btnText = document.getElementById('btnText');
    btn.disabled  = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    let dots = 0;
    const ticker = setInterval(() => {
        dots = (dots + 1) % 4;
        btnText.textContent = '⏳ Analyzing' + '.'.repeat(dots);
    }, 500);

    document.getElementById('pipelineSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('confidenceCard').classList.add('hidden');
    document.getElementById('radarChartSection').classList.add('hidden');
    resetStages();

    try {
        const results = await pipeline.runFullPipeline(reportText, updateStageUI);

        if (results.complete) {
            lastResults    = results;
            lastReportText = reportText;
            displayResults(results);
            saveToHistory(reportText, results);
            showNotification('✅ Analysis complete!', 'success');

            // Confidence meter runs async (non-blocking, uses one extra API call)
            runConfidenceMeter(reportText, results.stage1.data, results.stage2.data);
        } else {
            showNotification('❌ Analysis failed: ' + results.error, 'error');
        }
    } catch (err) {
        console.error(err);
        showNotification('❌ Error: ' + err.message, 'error');
    } finally {
        clearInterval(ticker);
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btnText.textContent = '🚀 Analyze Report with AI';
    }
}

function resetStages() {
    for (let i = 1; i <= 3; i++) {
        const card = document.getElementById(`stage${i}Card`);
        card.className = 'stage-card glass-card rounded-xl p-6 border-2 border-gray-200';
        document.getElementById(`stage${i}Icon`).textContent   = '⏳';
        document.getElementById(`stage${i}Icon`).className     = 'text-4xl';
        document.getElementById(`stage${i}Status`).textContent = 'Waiting to start...';
    }
}

function updateStageUI(stageNumber, result) {
    const card   = document.getElementById(`stage${stageNumber}Card`);
    const icon   = document.getElementById(`stage${stageNumber}Icon`);
    const status = document.getElementById(`stage${stageNumber}Status`);
    card.className   = 'stage-card processing glass-card rounded-xl p-6 border-2';
    icon.className   = 'text-4xl processing-icon';
    icon.textContent = '🔄';
    status.textContent = 'Processing...';
    setTimeout(() => {
        if (result.success) {
            card.className     = 'stage-card complete glass-card rounded-xl p-6 border-2';
            icon.className     = 'text-4xl';
            icon.textContent   = '✅';
            status.textContent = 'Complete';
        } else {
            card.classList.add('border-red-500', 'bg-red-50');
            icon.className     = 'text-4xl';
            icon.textContent   = '❌';
            status.textContent = 'Error: ' + result.error;
        }
    }, 900);
}

// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    const section   = document.getElementById('resultsSection');

    const extracted  = results.stage1.data;
    const priority   = results.stage2.data;
    const volunteers = results.stage3.data;

    const lvl      = priority.priority_level || 'Medium';
    const lvlLow   = lvl.toLowerCase();
    const icon     = lvl === 'High' ? '🚨' : lvl === 'Medium' ? '⚠️' : 'ℹ️';

    const html = `
        <!-- Priority Banner -->
        <div class="priority-${lvlLow} glass-card rounded-xl p-6 mb-6">
            <div class="flex items-center">
                <div class="text-5xl mr-4">${icon}</div>
                <div class="flex-1">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">${lvl} Priority</h3>
                    <p class="text-gray-800 leading-relaxed">${priority.reasoning || ''}</p>
                    <div class="mt-3 text-sm font-semibold">⏱️ Recommended Response Time: ${priority.estimated_response_time || 'ASAP'}</div>
                </div>
            </div>
        </div>

        <!-- Two columns -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <!-- Need Details -->
            <div class="glass-card rounded-xl p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center"><span class="text-2xl mr-2">📍</span>Need Details</h3>
                <div class="space-y-4">
                    <div><div class="text-xs font-semibold text-gray-500 uppercase mb-1">Category</div><div class="text-lg font-bold text-gray-900">${extracted.need_type}</div></div>
                    <div><div class="text-xs font-semibold text-gray-500 uppercase mb-1">Location</div><div class="text-gray-900">${extracted.location}</div></div>
                    <div><div class="text-xs font-semibold text-gray-500 uppercase mb-1">People Affected</div><div class="text-4xl font-bold gradient-text">${extracted.affected_count}</div></div>
                    <div><div class="text-xs font-semibold text-gray-500 uppercase mb-1">Demographics</div><div class="text-gray-900">${extracted.demographics}</div></div>
                    <div><div class="text-xs font-semibold text-gray-500 uppercase mb-1">Timeline</div><div class="text-gray-900 font-semibold">${extracted.timeline}</div></div>
                    ${extracted.urgency_keywords && extracted.urgency_keywords.length ? `
                    <div><div class="text-xs font-semibold text-gray-500 uppercase mb-1">Urgency Indicators</div>
                    <div class="flex flex-wrap gap-1">${extracted.urgency_keywords.map(k => `<span class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">${k}</span>`).join('')}</div></div>` : ''}
                    ${extracted.contact_info && extracted.contact_info !== 'Not specified' ? `<div><div class="text-xs font-semibold text-gray-500 uppercase mb-1">Contact</div><div class="text-gray-900 text-sm">${extracted.contact_info}</div></div>` : ''}
                </div>
            </div>

            <!-- Priority Scores -->
            <div class="glass-card rounded-xl p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center"><span class="text-2xl mr-2">📊</span>Priority Analysis</h3>
                <div class="space-y-4">
                    ${createScoreBar('Urgency',       priority.urgency_score,       10)}
                    ${createScoreBar('Scale',         priority.scale_score,         10)}
                    ${createScoreBar('Vulnerability', priority.vulnerability_score, 10)}
                    ${createScoreBar('Severity',      priority.severity_score,      10)}
                    <div class="pt-4 border-t-2 mt-6">
                        <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Total Priority Score</div>
                        <div class="text-5xl font-bold gradient-text mb-2">${(priority.total_score || 0).toFixed(1)}</div>
                        <div class="text-sm text-gray-600">${lvl === 'High' ? 'Immediate action required' : lvl === 'Medium' ? 'Action needed within timeline' : 'Standard response timeline acceptable'}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Volunteers -->
        <div class="glass-card rounded-xl p-6 mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center"><span class="text-2xl mr-2">👥</span>Volunteer Requirements</h3>
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
                <div class="font-semibold text-gray-900 mb-1">Action Summary:</div>
                <p class="text-gray-800">${volunteers.action_summary}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                ${(volunteers.volunteer_roles || []).map(role => `
                    <div class="volunteer-card rounded-lg p-4">
                        <div class="flex items-start justify-between mb-3">
                            <h4 class="font-bold text-gray-900 flex-1">${role.role}</h4>
                            <span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold ml-2">${role.count}</span>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div><span class="font-semibold text-gray-700">Skills:</span>
                            <div class="mt-1">${(role.skills_required || []).map(s => `<span class="requirement-tag">${s}</span>`).join('')}</div></div>
                            <div><span class="font-semibold text-gray-700">Time:</span> <span class="text-gray-600">${role.time_commitment}</span></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="bg-gray-50 rounded-xl p-4 text-center mb-4">
                <div class="text-3xl font-bold gradient-text">${volunteers.total_volunteers_needed}</div>
                <div class="text-sm text-gray-600">Total Volunteers Needed</div>
            </div>
            ${volunteers.preparation_needed && volunteers.preparation_needed.length ? `
            <div class="grid md:grid-cols-2 gap-4 mt-4">
                <div><h4 class="font-semibold text-gray-900 mb-2">🎒 What to Bring</h4><ul class="list-disc list-inside text-sm text-gray-700 space-y-1">${(volunteers.preparation_needed || []).map(i => `<li>${i}</li>`).join('')}</ul></div>
                <div><h4 class="font-semibold text-gray-900 mb-2">⚠️ Safety Notes</h4><ul class="list-disc list-inside text-sm text-gray-700 space-y-1">${(volunteers.safety_requirements || []).map(i => `<li>${i}</li>`).join('')}</ul></div>
            </div>` : ''}
        </div>

        <!-- Specific Requirements -->
        ${extracted.specific_requirements && extracted.specific_requirements.length ? `
        <div class="glass-card rounded-xl p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center"><span class="text-2xl mr-2">📦</span>Specific Requirements</h3>
            <div class="flex flex-wrap gap-2">${extracted.specific_requirements.map(r => `<span class="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200">${r}</span>`).join('')}</div>
        </div>` : ''}
    `;

    container.innerHTML = html;
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Radar chart
    renderRadarChart(priority);

    // Show comparison section
    showComparisonPrompt();

    // Save to export manager so PDF button works
    if (exportManager && pipeline.currentAnalysis) {
        exportManager.setAnalysis(pipeline.currentAnalysis, reportText);
    }
}

function createScoreBar(label, score, max) {
    const pct = ((score || 0) / max) * 100;
    return `
        <div>
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-semibold text-gray-700">${label}</span>
                <span class="text-sm font-bold text-purple-600">${score || 0}/${max}</span>
            </div>
            <div class="score-bar"><div class="score-fill" style="width:${pct}%"></div></div>
        </div>`;
}

// ============================================================
// RADAR CHART
// ============================================================

function renderRadarChart(priorityData) {
    const section = document.getElementById('radarChartSection');
    const canvas  = document.getElementById('priorityRadarChart');
    if (!section || !canvas) return;

    section.classList.remove('hidden');

    if (radarChart) { radarChart.destroy(); radarChart = null; }

    const lvl    = priorityData.priority_level || 'Medium';
    const colors = {
        High:   { border:'rgba(220,38,38,1)',   bg:'rgba(220,38,38,0.15)'   },
        Medium: { border:'rgba(202,138,4,1)',    bg:'rgba(202,138,4,0.15)'   },
        Low:    { border:'rgba(5,150,105,1)',    bg:'rgba(5,150,105,0.15)'   }
    };
    const c = colors[lvl] || colors.Medium;

    const normalized = Math.min(10, (priorityData.total_score || 0) / 5);

    radarChart = new Chart(canvas.getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['Urgency', 'Scale', 'Vulnerability', 'Severity', 'Overall'],
            datasets: [{
                label: lvl + ' Priority',
                data: [
                    priorityData.urgency_score       || 0,
                    priorityData.scale_score         || 0,
                    priorityData.vulnerability_score || 0,
                    priorityData.severity_score      || 0,
                    normalized
                ],
                backgroundColor: c.bg,
                borderColor:     c.border,
                borderWidth: 2,
                pointBackgroundColor: c.border,
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: { r: { min:0, max:10, beginAtZero:true, ticks:{ stepSize:2, font:{size:11}, backdropColor:'transparent' }, grid:{color:'rgba(0,0,0,0.08)'}, pointLabels:{ font:{size:13,weight:'bold'}, color:'#374151' } } },
            plugins: { legend:{ display:true, position:'top', labels:{font:{size:13},color:'#374151'} } }
        }
    });
}

// ============================================================
// CONFIDENCE METER
// ============================================================

async function runConfidenceMeter(reportText, stage1Data, stage2Data) {
    if (!window.ConfidenceMeter) return; // module not loaded
    const meter  = new ConfidenceMeter(geminiAPI);
    const combined = { ...stage1Data, priority_level: stage2Data.priority_level };
    const result   = await meter.getConfidenceScore(reportText, combined);
    if (!result.success) return;

    const d     = result.data;
    const score = d.overall_confidence || 0;
    const color = score >= 75 ? { hex:'#10b981', label:'High Confidence', cls:'bg-green-100 text-green-800' }
                : score >= 50 ? { hex:'#f59e0b', label:'Medium Confidence', cls:'bg-yellow-100 text-yellow-800' }
                :               { hex:'#ef4444', label:'Low Confidence',    cls:'bg-red-100 text-red-800'    };

    document.getElementById('confidenceCard').classList.remove('hidden');

    const circle = document.getElementById('confidenceCircle');
    circle.style.stroke          = color.hex;
    circle.style.strokeDashoffset = 339.3 - (score / 100) * 339.3;

    document.getElementById('confidenceScore').textContent      = score;
    document.getElementById('clarityScore').textContent         = d.report_clarity      || 0;
    document.getElementById('completenessScore').textContent    = d.data_completeness   || 0;
    document.getElementById('specificityScore').textContent     = d.specificity         || 0;
    document.getElementById('ambiguityScore').textContent       = d.low_ambiguity       || 0;
    document.getElementById('confidenceExplanation').textContent = d.confidence_explanation || '';

    const lbl = document.getElementById('confidenceLabel');
    lbl.textContent = color.label;
    lbl.className   = 'px-4 py-1 rounded-full text-sm font-bold ' + color.cls;

    if (score < 75 && d.missing_info && d.missing_info.length) {
        document.getElementById('missingInfoSection').classList.remove('hidden');
        document.getElementById('missingInfoList').innerHTML = d.missing_info.map(i => `<li>${i}</li>`).join('');
    }
}

// ============================================================
// COMPARISON
// ============================================================

function toggleComparison() {
    const content = document.getElementById('comparisonContent');
    const section = document.getElementById('comparisonSection');
    section.classList.remove('hidden');
    content.classList.toggle('hidden');
    if (!content.classList.contains('hidden')) content.classList.add('fade-in');
}

function showComparisonPrompt() {
    document.getElementById('comparisonSection').classList.remove('hidden');
    setTimeout(() => showNotification('💡 Check out our Prompt Engineering Evolution below!', 'info'), 2000);
}

async function runComparison() {
    const sel = document.getElementById('comparisonSampleSelect');
    if (!sel || sel.value === '') { alert('Please select a sample report first!'); return; }

    const report = sampleReports[parseInt(sel.value)];
    const loadEl = document.getElementById('comparisonLoading');
    const resEl  = document.getElementById('comparisonResults');
    const btn    = document.getElementById('runComparisonBtn');

    loadEl.classList.remove('hidden');
    resEl.classList.add('hidden');
    btn.disabled = true;

    if (!window.PromptComparison) { showNotification('❌ comparison.js not loaded', 'error'); loadEl.classList.add('hidden'); btn.disabled = false; return; }
    const comp = new PromptComparison(geminiAPI);

    try {
        document.getElementById('comparisonLoadingText').textContent = 'Running Basic Prompt (V1.0)...';
        const basic = await comp.runBasicPrompt(report.text);

        document.getElementById('comparisonLoadingText').textContent = 'Waiting 3s (rate limit)...';
        await new Promise(r => setTimeout(r, 3000));

        document.getElementById('comparisonLoadingText').textContent = 'Running Optimized Prompt (V3.0)...';
        const optimized = await comp.runOptimizedPrompt(report.text);

        const metrics = comp.calculateMetrics(basic, optimized);
        displayComparisonResults(basic, optimized, metrics);
        showNotification('✅ Comparison complete!', 'success');
    } catch (err) {
        showNotification('❌ Comparison failed: ' + err.message, 'error');
    } finally {
        loadEl.classList.add('hidden');
        btn.disabled = false;
    }
}

function displayComparisonResults(basic, optimized, metrics) {
    document.getElementById('comparisonResults').classList.remove('hidden');

    document.getElementById('basicPromptText').textContent =
        'Analyze this NGO report and categorize it.\n\nGive me:\n- Category\n- Priority\n- What help is needed';
    document.getElementById('basicOutput').textContent     = basic.rawOutput || 'Error getting output';
    document.getElementById('basicQualityScore').textContent = metrics.basicQualityScore;

    document.getElementById('optimizedPromptText').textContent =
        'You are an expert NGO data analyst...\n[structured ~250-word prompt with JSON schema, scoring rubrics, and role constraints]';
    document.getElementById('optimizedOutput').textContent =
        optimized.parsedData ? JSON.stringify(optimized.parsedData, null, 2) : optimized.rawOutput || 'Error';
    document.getElementById('optimizedQualityScore').textContent = metrics.qualityScore;

    const improvement = metrics.qualityScore - metrics.basicQualityScore;
    document.getElementById('metricsGrid').innerHTML = `
        <div class="bg-white rounded-xl p-3 text-center border border-green-200"><div class="text-xl font-bold text-green-600">+${improvement}%</div><div class="text-xs text-gray-500 mt-1">Quality Improvement</div></div>
        <div class="bg-white rounded-xl p-3 text-center border border-blue-200"><div class="text-xl font-bold text-blue-600">${metrics.qualityScore}/100</div><div class="text-xs text-gray-500 mt-1">Optimized Score</div></div>
        <div class="bg-white rounded-xl p-3 text-center border border-red-200"><div class="text-xl font-bold text-red-500">${metrics.basicQualityScore}/100</div><div class="text-xs text-gray-500 mt-1">Basic Score</div></div>
        <div class="bg-white rounded-xl p-3 text-center border border-purple-200"><div class="text-xl font-bold text-purple-600">${metrics.jsonAvailable ? '✓' : '✗'}</div><div class="text-xs text-gray-500 mt-1">Structured Output</div></div>
    `;
    document.getElementById('comparisonResults').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// EXPORT PDF
// ============================================================

function exportToPDF() {
    if (!lastResults) { alert('Please run an analysis first!'); return; }

    if (!window.ExportManager) {
        // Fallback: print page
        window.print();
        return;
    }

    const mgr = new ExportManager();
    mgr.setAnalysis(lastResults, lastReportText);
    mgr.exportToPDF();
}

// ============================================================
// HISTORY
// ============================================================

function saveToHistory(reportText, results) {
    try {
        const entry = {
            id:            Date.now(),
            timestamp:     new Date().toISOString(),
            reportPreview: reportText.substring(0, 80) + '...',
            location:      results.stage1.data.location,
            category:      results.stage1.data.need_type,
            priority:      results.stage2.data.priority_level,
            score:         results.stage2.data.total_score,
            fullReport:    reportText
        };
        const history = getHistory();
        history.unshift(entry);
        if (history.length > 10) history.pop();
        localStorage.setItem('ngo_history', JSON.stringify(history));
        renderHistory();
    } catch (e) { console.warn('History save failed:', e); }
}

function getHistory() {
    try { return JSON.parse(localStorage.getItem('ngo_history') || '[]'); } catch { return []; }
}

function renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    const history = getHistory();
    if (!history.length) {
        container.innerHTML = '<p class="text-gray-400 text-sm text-center py-6">No analyses yet — run your first analysis above!</p>';
        return;
    }
    const priBg = { High:'bg-red-100 text-red-800', Medium:'bg-yellow-100 text-yellow-800', Low:'bg-green-100 text-green-800' };
    container.innerHTML = history.map(entry => `
        <div class="history-item glass-card rounded-xl p-4 mb-3 flex items-center gap-4" onclick="loadFromHistory('${entry.id}')">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded-full text-xs font-bold ${priBg[entry.priority] || 'bg-gray-100 text-gray-700'}">${entry.priority}</span>
                    <span class="text-xs text-gray-500">${entry.category}</span>
                </div>
                <p class="text-sm text-gray-700 truncate">${entry.location} — ${entry.reportPreview}</p>
                <p class="text-xs text-gray-400 mt-1">${new Date(entry.timestamp).toLocaleString('en-IN')}</p>
            </div>
            <div class="text-right flex-shrink-0">
                <div class="text-2xl font-bold gradient-text">${typeof entry.score === 'number' ? entry.score.toFixed(0) : '--'}</div>
                <div class="text-xs text-gray-400">score</div>
            </div>
        </div>
    `).join('');
}

function loadFromHistory(id) {
    const entry = getHistory().find(h => h.id === parseInt(id));
    if (!entry) return;
    const ta = document.getElementById('reportInput');
    ta.value = entry.fullReport;
    ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showNotification('📋 Report loaded from history', 'info');
}

function clearHistory() {
    localStorage.removeItem('ngo_history');
    renderHistory();
}

// ============================================================
// NOTIFICATION TOAST
// ============================================================

function showNotification(message, type = 'info') {
    const colors = { success:'bg-green-500', error:'bg-red-500', info:'bg-blue-500' };
    const toast  = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type] || 'bg-blue-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-500`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}
function exportAnalysis() {
    if (!exportManager) {
        alert('Export module not initialized');
        return;
    }
    exportManager.exportToPDF();
}
/**
 * Render the sample report library
 */
function renderLibrary(filter = 'all') {
    const grid = document.getElementById('libraryGrid');
    if (!grid || sampleReports.length === 0) return;

    const categoryIcons = {
        'Food Security': '🍚',
        'Healthcare': '🏥',
        'Education': '📚',
        'Disaster Relief': '🆘',
        'Water & Sanitation': '💧',
        'Infrastructure': '🏗️',
        'Other': '📋'
    };

    const categoryColors = {
        'Food Security': 'blue',
        'Healthcare': 'green',
        'Education': 'purple',
        'Disaster Relief': 'red',
        'Water & Sanitation': 'cyan',
        'Infrastructure': 'orange',
        'Other': 'gray'
    };

    const filtered = filter === 'all'
        ? sampleReports
        : sampleReports.filter(r => r.category === filter);

    grid.innerHTML = filtered.map((report, idx) => {
        const icon = categoryIcons[report.category] || '📋';
        const color = categoryColors[report.category] || 'gray';
        const realIndex = sampleReports.indexOf(report);

        return `
            <div class="library-card border-2 border-gray-100 hover:border-${color}-300 rounded-xl p-4"
                 onclick="loadReportFromLibrary(${realIndex})">
                <div class="flex items-start justify-between mb-3">
                    <span class="text-2xl">${icon}</span>
                    <span class="text-xs px-2 py-1 rounded-full bg-${color}-50 text-${color}-700 font-medium">${report.category}</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-2 text-sm leading-snug">${report.title}</h3>
                <p class="text-xs text-gray-500 line-clamp-3 mb-3">${report.text.substring(0, 120)}...</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">Expected: <strong class="priority-badge-${report.expected_priority} px-2 py-0.5 rounded text-xs">${report.expected_priority}</strong></span>
                    <span class="text-xs text-blue-600 font-medium">Click to analyze →</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Filter library by category
 */
function filterLibrary(category) {
    renderLibrary(category);

    // Update filter button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active-filter');
    });
    event.target.classList.add('active-filter');
}

/**
 * Load report from library into main input
 */
function loadReportFromLibrary(index) {
    const report = sampleReports[index];
    document.getElementById('reportInput').value = report.text;

    // Scroll to input section and highlight
    const inputSection = document.getElementById('reportInput');
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    inputSection.focus();

    // Flash the textarea
    inputSection.style.borderColor = '#3b82f6';
    inputSection.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.2)';
    setTimeout(() => {
        inputSection.style.borderColor = '';
        inputSection.style.boxShadow = '';
    }, 1500);
}

// Call renderLibrary after sampleReports load
// Add to the end of your loadSampleReports function:
// renderLibrary();