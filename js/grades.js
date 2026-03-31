// === GRADE LOGIC AND COLOR MAPPING ===

/**
 * Get grade color class based on score
 * @param {number} score - The total score
 * @returns {string} CSS class name for the grade color
 */
function getGradeColorClass(score) {
    if (score >= 90) return "grade-excellent";
    if (score >= 80) return "grade-vgood";
    if (score >= 70) return "grade-good";
    if (score >= 60) return "grade-avg";
    if (score >= 50) return "grade-acceptable";
    return "grade-fail";
}

/**
 * Apply color class to a cell based on score
 * @param {HTMLElement} cell - The table cell element
 * @param {number} score - The total score
 */
function applyColorToCell(cell, score) {
    cell.className = ""; // Reset
    cell.classList.add(getGradeColorClass(score));
}

/**
 * Get GPA color based on final GPA value
 * @param {number} gpa - The final GPA value
 * @returns {string} CSS color value
 */
function getGpaColor(gpa) {
    if (gpa >= 90) return "#1b5e20";
    if (gpa >= 80) return "#2e7d32";
    if (gpa >= 70) return "#333";
    if (gpa >= 60) return "#555";
    if (gpa >= 50) return "#777";
    return "#d32f2f";
}

/**
 * Check if a saei (continuous assessment) value is passing
 * @param {number} saei - The saei score
 * @returns {boolean} True if passing threshold met
 */
function isSaeiPassing(saei) {
    return saei >= 14;
}

/**
 * Validate a numeric input within bounds
 * @param {HTMLInputElement} el - The input element
 * @param {number} max - Maximum allowed value
 */
function validateInput(el, max, min = 0) {
    if (el.value === "") return;
    let val = parseInt(el.value);
    if (val > max) el.value = max;
    if (val < min) el.value = min;
}
