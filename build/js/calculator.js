// === GPA CALCULATION LOGIC ===

/**
 * Main update function - computes GPA and updates UI
 */
function mainUpdate() {
    let totalWeightedScore = 0;
    let sumEcts = 0;
    let isEctsValid = true;
    let allSubjectsCompleted = true;

    APP_CONFIG.defaultSubjects.forEach(sub => {
        const ectsInput = document.getElementById(`${sub.id}_ects`);
        const saeiInput = document.getElementById(`${sub.id}_saei`);
        const gradeSelect = document.getElementById(`${sub.id}_final_grade`);
        const examSelect = document.getElementById(`${sub.id}_predicted_exam`);
        const textGrade = document.getElementById(`${sub.id}_gpa_text`);
        const gpaCell = document.getElementById(`${sub.id}_gpa_cell`);

        let ectsVal = parseInt(ectsInput.value) || 0;
        
        // Validate ECTS range
        if (ectsVal < ECTS_MIN || ectsVal > ECTS_MAX) {
            ectsInput.style.border = "2px solid red";
            isEctsValid = false;
        } else {
            ectsInput.style.border = "1px solid #ccc";
        }
        sumEcts += ectsVal;

        const saei = parseFloat(saeiInput.value);
        const predictedExam = parseFloat(examSelect.value);

        // Handle missing or invalid saei
        if (isNaN(saei) || saei < 0) {
            textGrade.innerText = "--";
            gpaCell.className = "";
            allSubjectsCompleted = false;
            return;
        }

        // Automatic fail if saei below passing threshold
        if (saei < SAEI_MIN_PASSING) {
            textGrade.innerText = "راسب";
            applyColorToCell(gpaCell, saei);
            totalWeightedScore += (saei * ectsVal);
            return;
        }

        // Handle missing grade selection or exam score
        if (gradeSelect.value === "" || isNaN(predictedExam)) {
            textGrade.innerText = "--";
            gpaCell.className = "";
            allSubjectsCompleted = false;
            return;
        }

        // Calculate total score based on selected exam grade
        const totalScore = saei + predictedExam;

        textGrade.innerText = totalScore.toFixed(2);
        applyColorToCell(gpaCell, totalScore);
        totalWeightedScore += (totalScore * ectsVal);
    });

    const warningDiv = document.getElementById('ects-warning');
    const finalGpaElement = document.getElementById('final-gpa-word');

    // Calculate and display GPA if all conditions met
    if (allSubjectsCompleted && sumEcts === TOTAL_ECTS_TARGET && isEctsValid) {
        const gpa = parseFloat((totalWeightedScore / sumEcts).toFixed(2));
        finalGpaElement.innerText = gpa.toFixed(2);
        finalGpaElement.style.color = getGpaColor(gpa);
    } else {
        finalGpaElement.innerText = "--";
        finalGpaElement.style.color = "#2e7d32";
    }

    // Show/hide ECTS warning
    if (sumEcts !== TOTAL_ECTS_TARGET || !isEctsValid) {
        warningDiv.style.display = 'block';
        document.getElementById('current-ects-sum').innerText = sumEcts;
    } else {
        warningDiv.style.display = 'none';
    }
}
