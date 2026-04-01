// === DOM ELEMENT REFERENCES ===

const elements = {
    // GPA Display
    finalGpaWord: document.getElementById('final-gpa-word'),
    
    // Warning
    ectsWarning: document.getElementById('ects-warning'),
    currentEctsSum: document.getElementById('current-ects-sum'),
    
    // Table
    subjectsBody: document.getElementById('subjects-body'),
    finalHeader: document.getElementById('final-header'),
    
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
