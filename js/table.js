// === TABLE BUILDING AND MANAGEMENT ===

/**
 * Build the subjects table with all rows
 */
function buildTable() {
    const tbody = document.getElementById('subjects-body');
    tbody.innerHTML = "";

    APP_CONFIG.defaultSubjects.forEach((sub) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" id="${sub.id}_name" class="name-input" value="${sub.name}"></td>
            <td><input type="number" inputmode="numeric" id="${sub.id}_ects" class="ects-input" value="${sub.ects}" min="2" max="8"></td>
            <td><input type="number" inputmode="numeric" id="${sub.id}_saei" placeholder="من 50" min="0" max="50"></td>
            <td>
                <select id="${sub.id}_final_grade" disabled>
                    <option value="">-- أدخل السعي أولاً --</option>
                    <option value="excellence">امتياز (90-100)</option>
                    <option value="vGood">جيد جداً (80-89)</option>
                    <option value="good">جيد (70-79)</option>
                    <option value="avg">متوسط (60-69)</option>
                    <option value="acceptable">مقبول (50-59)</option>
                    <option value="fail_fx">راسب قيد المعالجة (45-49)</option>
                    <option value="fail_f">راسب (0-44)</option>
                </select>
            </td>
            <td id="${sub.id}_predicted_exam_cell">
                <select id="${sub.id}_predicted_exam" class="exam-select" disabled>
                    <option value="">-</option>
                </select>
            </td>
            <td id="${sub.id}_gpa_cell">
                <span id="${sub.id}_gpa_text" style="font-weight:bold;">--</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Update grade dropdown options based on saei score
 * @param {HTMLSelectElement} gradeSelect - The grade select element
 * @param {number} saei - The saei score
 */
function updateGradeOptions(gradeSelect, saei) {
    const options = gradeSelect.options;
    let hasValidOption = false;

    for (let i = 1; i < options.length; i++) {
        const opt = options[i];
        const gradeData = GRADES_MAP[opt.value];

        if (!gradeData) continue;

        const maxPossible = saei + EXAM_MAX;
        const minPossibleFinal = gradeData.minTarget >= 50 ? 25 : 0;

        const canReachMin = maxPossible >= gradeData.minTarget;
        const canStayUnderMax = (saei + minPossibleFinal) <= gradeData.maxTarget;

        if (canReachMin && canStayUnderMax) {
            opt.style.display = '';
            opt.disabled = false;
            hasValidOption = true;
        } else {
            opt.style.display = 'none';
            opt.disabled = true;
        }
    }

    if (!hasValidOption) {
        options[0].text = "-- السعي لا يكفي للنجاح --";
    } else {
        options[0].text = "-- اختر التقدير --";
    }

    // Reset selection if current choice is no longer available
    if (gradeSelect.value && GRADES_MAP[gradeSelect.value]) {
        const selectedOpt = Array.from(options).find(opt => opt.value === gradeSelect.value);
        if (selectedOpt && selectedOpt.style.display === 'none') {
            gradeSelect.value = "";
        }
    }
}

/**
 * Update exam dropdown based on saei and selected grade
 * @param {string} subjectId - The subject ID
 */
function updateExamDropdown(subjectId) {
    const saeiInput = document.getElementById(`${subjectId}_saei`);
    const gradeSelect = document.getElementById(`${subjectId}_final_grade`);
    const examSelect = document.getElementById(`${subjectId}_predicted_exam`);

    const saei = parseFloat(saeiInput.value);

    // Reset exam list if saei is invalid or no grade selected
    if (isNaN(saei) || saei < SAEI_MIN_PASSING || !gradeSelect.value) {
        examSelect.innerHTML = '<option value="">-</option>';
        examSelect.disabled = true;
        return;
    }

    const gradeData = GRADES_MAP[gradeSelect.value];

    // Calculate min/max allowed exam scores
    let minExam = gradeData.minTarget - saei;
    let maxExam = gradeData.maxTarget - saei;

    // Apply passing constraints
    if (gradeData.minTarget >= 50 && minExam < 25) minExam = 25;
    if (minExam < EXAM_MIN) minExam = EXAM_MIN;
    if (maxExam > EXAM_MAX) maxExam = EXAM_MAX;

    examSelect.innerHTML = '';

    // Handle mathematical contradiction (should be prevented by hiding impossible grades)
    if (minExam > maxExam) {
        examSelect.innerHTML = '<option value="">-</option>';
        examSelect.disabled = true;
        return;
    }

    // Save previous value to re-select if possible
    let previousValue = parseInt(examSelect.value);

    // Generate allowed exam score options
    for (let i = minExam; i <= maxExam; i++) {
        examSelect.add(new Option(i, i));
    }

    examSelect.disabled = false;

    // Select: previous value if available, otherwise minimum to reach target
    if (!isNaN(previousValue) && previousValue >= minExam && previousValue <= maxExam) {
        examSelect.value = previousValue;
    } else {
        examSelect.value = minExam;
    }
}

/**
 * Enable or disable grade select based on saei input
 * @param {string} subjectId - The subject ID
 */
function enableGradeSelect(subjectId) {
    const saeiInput = document.getElementById(`${subjectId}_saei`);
    const gradeSelect = document.getElementById(`${subjectId}_final_grade`);

    if (saeiInput.value && parseFloat(saeiInput.value) >= 0) {
        const saei = parseFloat(saeiInput.value);

        if (saei < SAEI_MIN_PASSING) {
            gradeSelect.disabled = true;
            gradeSelect.value = "";
            gradeSelect.options[0].text = "-- راسب (السعي < 14) --";
        } else {
            gradeSelect.disabled = false;
            updateGradeOptions(gradeSelect, saei);
        }
    } else {
        gradeSelect.disabled = true;
        gradeSelect.value = "";
        gradeSelect.options[0].text = "-- أدخل السعي أولاً --";
    }
}
