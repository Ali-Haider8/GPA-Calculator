// === MAIN ENTRY POINT ===

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    buildTable();
    setupEventListeners();
    mainUpdate();
});

/**
 * Populate dropdown menus with config data
 */
function populateDropdowns() {
    const fill = (id, data) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = "";
        data.forEach(item => el.add(new Option(item, item)));
    };
    fill('academic-year-select', APP_CONFIG.academicYears);
    fill('stage-name', APP_CONFIG.stages);
    fill('semester-name', APP_CONFIG.semesters);
}

/**
 * Toggle save window visibility
 */
function toggleSaveWindow() {
    const content = document.getElementById('save-window-content');
    content.classList.toggle('show');
    const icon = document.getElementById('tab-icon');
    icon.innerText = content.classList.contains('show') ? '▲' : '▼';
}

/**
 * Handle saei input change
 * @param {HTMLInputElement} el - The saei input element
 * @param {string} subjectId - The subject ID
 */
function handleSaeiChange(el, subjectId) {
    validateInput(el, 50);
    enableGradeSelect(subjectId);
    updateExamDropdown(subjectId);
    mainUpdate();
}

/**
 * Handle grade selection change
 * @param {string} subjectId - The subject ID
 */
function handleGradeChange(subjectId) {
    updateExamDropdown(subjectId);
    mainUpdate();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Toggle save window
    document.getElementById('btn-toggle-save').addEventListener('click', toggleSaveWindow);
    
    // Modal open/close
    document.getElementById('btn-gpa-info').addEventListener('click', () =>
        document.getElementById('gpa-modal').classList.add('show'));
    document.getElementById('btn-close-modal').addEventListener('click', () =>
        document.getElementById('gpa-modal').classList.remove('show'));
    
    // Export button
    document.getElementById('btn-export').addEventListener('click', generateTextFile);
    
    // Input event listeners for table cells
    APP_CONFIG.defaultSubjects.forEach(sub => {
        // Name input
        const nameInput = document.getElementById(`${sub.id}_name`);
        if (nameInput) {
            nameInput.addEventListener('input', mainUpdate);
        }
        
        // ECTS input
        const ectsInput = document.getElementById(`${sub.id}_ects`);
        if (ectsInput) {
            ectsInput.addEventListener('input', mainUpdate);
        }
        
        // Saei input
        const saeiInput = document.getElementById(`${sub.id}_saei`);
        if (saeiInput) {
            saeiInput.addEventListener('input', function() {
                handleSaeiChange(this, sub.id);
            });
        }
        
        // Grade select
        const gradeSelect = document.getElementById(`${sub.id}_final_grade`);
        if (gradeSelect) {
            gradeSelect.addEventListener('change', function() {
                handleGradeChange(sub.id);
            });
        }
        
        // Exam select
        const examSelect = document.getElementById(`${sub.id}_predicted_exam`);
        if (examSelect) {
            examSelect.addEventListener('change', mainUpdate);
        }
    });
}

// Expose handlers globally for inline HTML usage (temporary compatibility)
window.handleSaeiChange = handleSaeiChange;
window.handleGradeChange = handleGradeChange;
