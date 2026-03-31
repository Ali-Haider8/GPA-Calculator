// === DOM ELEMENT REFERENCES ===

const elements = {
    // GPA Display
    finalGpaWord: document.getElementById('final-gpa-word'),
    screenContainer: document.getElementById('screen-container'),
    
    // Warning
    ectsWarning: document.getElementById('ects-warning'),
    currentEctsSum: document.getElementById('current-ects-sum'),
    
    // Table
    subjectsBody: document.getElementById('subjects-body'),
    finalHeader: document.getElementById('final-header'),
    
    // Dropdowns
    academicYearSelect: document.getElementById('academic-year-select'),
    stageName: document.getElementById('stage-name'),
    semesterName: document.getElementById('semester-name'),
    
    // Save/Export Section
    btnToggleSave: document.getElementById('btn-toggle-save'),
    saveWindowContent: document.getElementById('save-window-content'),
    tabIcon: document.getElementById('tab-icon'),
    studentName: document.getElementById('student-name'),
    uniName: document.getElementById('uni-name'),
    collegeName: document.getElementById('college-name'),
    deptName: document.getElementById('dept-name'),
    btnExport: document.getElementById('btn-export'),
    
    // Modal
    btnGpaInfo: document.getElementById('btn-gpa-info'),
    gpaModal: document.getElementById('gpa-modal'),
    btnCloseModal: document.getElementById('btn-close-modal')
};

// Helper to get element by ID
function getById(id) {
    return document.getElementById(id);
}

// Helper to get value safely
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}
