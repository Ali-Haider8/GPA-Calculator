// === MAIN ENTRY POINT ===

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    buildTable();
    setupEventListeners();
    mainUpdate();
});

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
    // Modal open/close
    document.getElementById('btn-gpa-info').addEventListener('click', () =>
        document.getElementById('gpa-modal').classList.add('show'));
    document.getElementById('btn-close-modal').addEventListener('click', () =>
        document.getElementById('gpa-modal').classList.remove('show'));

    // Quick save button
    document.getElementById('btn-quick-save').addEventListener('click', quickSave);
    
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

window.handleSaeiChange = handleSaeiChange;
window.handleGradeChange = handleGradeChange;
