// نظام التقديرات والدرجات المقابلة
const GRADES_MAP = {
    excellence: { label: 'امتياز', min: 90, max: 100 },
    vGood: { label: 'جيد جداً', min: 80, max: 90 },
    good: { label: 'جيد', min: 70, max: 80 },
    avg: { label: 'متوسط', min: 60, max: 70 },
    acceptable: { label: 'مقبول', min: 50, max: 60 }
};

document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    buildTable();
    setupEventListeners();
    mainUpdate();
});

function populateDropdowns() {
    const fill = (id, data) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = "";
        data.forEach(item => el.add(new Option(item, item)));
    };
    fill('stage-name', APP_CONFIG.stages);
    fill('semester-name', APP_CONFIG.semesters);
}

function validateYear(input, min, max) {
    let val = parseInt(input.value);
    if (isNaN(val)) return;
    if (val < min) input.value = min;
    if (val > max) input.value = max;
}

function updateAcademicYear() {
    const startInput = document.getElementById('academic-year-start');
    const endInput = document.getElementById('academic-year-end');
    const startVal = startInput.value;
    const endVal = endInput.value;
    
    if (startVal && endVal) {
        // يمكن استخدام هذه الدالة لتحديث قيمة مخفية أو للتحقق
        console.log(`السنة الدراسية: ${startVal}-${endVal}`);
    }
}

function buildTable() {
    const tbody = document.getElementById('subjects-body');
    tbody.innerHTML = "";
    
    APP_CONFIG.defaultSubjects.forEach((sub, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" id="${sub.id}_name" class="name-input" value="${sub.name}" readonly></td>
            <td><input type="number" inputmode="numeric" id="${sub.id}_ects" class="ects-input" value="${sub.ects}" min="2" max="8" readonly></td>
            <td><input type="number" inputmode="numeric" id="${sub.id}_saei" placeholder="أدخل السعي أولاً" min="0" max="50" required oninput="validate(this, 50); enableGradeSelect('${sub.id}'); mainUpdate();"></td>
            <td>
                <select id="${sub.id}_final_grade" onchange="mainUpdate()" disabled>
                    <option value="">-- أدخل السعي أولاً --</option>
                    <option value="excellence">امتياز (90-100)</option>
                    <option value="vGood">جيد جداً (80-90)</option>
                    <option value="good">جيد (70-80)</option>
                    <option value="avg">متوسط (60-70)</option>
                    <option value="acceptable">مقبول (50-60)</option>
                </select>
            </td>
            <td id="${sub.id}_gpa_cell">
                <span id="${sub.id}_gpa_text">--</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function validate(el, max) {
    if (el.value === "") return;
    let val = parseInt(el.value);
    if (val > max) el.value = max;
    if (val < 0) el.value = 0;
}

function enableGradeSelect(subjectId) {
    const saeiInput = document.getElementById(`${subjectId}_saei`);
    const gradeSelect = document.getElementById(`${subjectId}_final_grade`);
    
    if (saeiInput.value && parseFloat(saeiInput.value) > 0) {
        gradeSelect.disabled = false;
        gradeSelect.options[0].text = "-- اختر التقدير --";
    } else {
        gradeSelect.disabled = true;
        gradeSelect.value = "";
        gradeSelect.options[0].text = "-- أدخل السعي أولاً --";
        document.getElementById(`${subjectId}_gpa_text`).innerText = "--";
        document.getElementById(`${subjectId}_gpa_cell`).className = "";
    }
}

function setupEventListeners() {
    document.getElementById('btn-toggle-save').addEventListener('click', toggleSaveWindow);
    document.getElementById('btn-gpa-info').addEventListener('click', () => 
        document.getElementById('gpa-modal').classList.add('show'));
    document.getElementById('btn-close-modal').addEventListener('click', () => 
        document.getElementById('gpa-modal').classList.remove('show'));
    document.getElementById('btn-export').addEventListener('click', generateTextFile);

    document.getElementById('edit-ects-mode').addEventListener('change', toggleEctsEdit);
    document.getElementById('edit-names-mode').addEventListener('change', toggleNamesEdit);
}

function mainUpdate() {
    let totalWeightedScore = 0;
    let sumEcts = 0;
    let isEctsValid = true;
    
    APP_CONFIG.defaultSubjects.forEach(sub => {
        const ectsInput = document.getElementById(`${sub.id}_ects`);
        const saeiInput = document.getElementById(`${sub.id}_saei`);
        const gradeSelect = document.getElementById(`${sub.id}_final_grade`);
        const textGrade = document.getElementById(`${sub.id}_gpa_text`);
        const gpaCell = document.getElementById(`${sub.id}_gpa_cell`);
        
        // التحقق من الوحدات
        let ectsVal = parseInt(ectsInput.value) || 0;
        if (ectsVal < 2 || ectsVal > 8) {
            ectsInput.style.border = "2px solid red";
            isEctsValid = false;
        } else {
            ectsInput.style.border = "none";
        }
        sumEcts += ectsVal;

        // معالجة التقديرات
        const saei = parseFloat(saeiInput.value) || 0;
        
        // إذا لم يتم إدخال السعي، لا تعرض شيئاً
        if (!saeiInput.value || saei === 0) {
            textGrade.innerText = "--";
            gpaCell.className = "";
            return;
        }
        
        gpaCell.className = "";
        
        if (gradeSelect.value === "") {
            textGrade.innerText = "--";
            return;
        }

        const selectedGrade = GRADES_MAP[gradeSelect.value];
        
        // حساب الدرجة الدقيقة في الامتحان النهائي بناءً على السعي
        // كلما كان السعي أعلى، كانت درجة الامتحان أقرب للحد الأقصى للتقدير
        // المعادلة: درجة الامتحان = الحد الأدنى + (نسبة السعي من 50 * مدى الـ 10 درجات)
        const saeRatio = saei / 50; // نسبة السعي من 50
        const examScore = selectedGrade.min + (saeRatio * 10);
        
        // الدرجة النهائية = السعي + درجة الامتحان المحسوبة
        const totalScore = saei + examScore;

        // عرض المعدل الرقمي للمادة (GPA للمادة)
        textGrade.innerText = totalScore.toFixed(2);
        applyColorToCell(gpaCell, totalScore);
        totalWeightedScore += (totalScore * ectsVal);
    });

    // التنبيهات واحتساب الـ GPA
    const warningDiv = document.getElementById('ects-warning');
    const finalGpaElement = document.getElementById('final-gpa-word');
    const gpaScreen = document.getElementById('screen-container');
    
    // التحقق مما إذا كانت جميع المواد قد أدخلت درجاتها
    let allSubjectsCompleted = true;
    APP_CONFIG.defaultSubjects.forEach(sub => {
        const saeiInput = document.getElementById(`${sub.id}_saei`);
        const gradeSelect = document.getElementById(`${sub.id}_final_grade`);
        if (!saeiInput.value || !gradeSelect.value) {
            allSubjectsCompleted = false;
        }
    });
    
    // إظهار شاشة GPA فقط بعد إدخال جميع الدرجات
    if (allSubjectsCompleted && sumEcts === 30 && isEctsValid) {
        gpaScreen.style.display = 'block';
    } else {
        gpaScreen.style.display = 'none';
    }
    
    if (sumEcts !== 30 || !isEctsValid) {
        warningDiv.style.display = 'block';
        document.getElementById('current-ects-sum').innerText = sumEcts;
        finalGpaElement.innerText = "خطأ في الوحدات";
        finalGpaElement.style.color = "#d32f2f";
    } else {
        warningDiv.style.display = 'none';
        
        if (totalWeightedScore > 0) {
            const gpa = parseFloat((totalWeightedScore / 30).toFixed(2));
            finalGpaElement.innerText = gpa.toFixed(2);
            
            // تطبيق الألوان حسب المعدل
            if (gpa >= 90) finalGpaElement.style.color = "#1b5e20";
            else if (gpa >= 80) finalGpaElement.style.color = "#2e7d32";
            else if (gpa >= 70) finalGpaElement.style.color = "#333";
            else if (gpa >= 60) finalGpaElement.style.color = "#555";
            else if (gpa >= 50) finalGpaElement.style.color = "#777";
            else finalGpaElement.style.color = "#d32f2f";
        } else {
            finalGpaElement.innerText = "--";
            finalGpaElement.style.color = "#2e7d32";
        }
    }
}

function applyColorToCell(cell, score) {
    if (score >= 90) cell.classList.add("grade-excellent");
    else if (score >= 80) cell.classList.add("grade-vgood");
    else if (score >= 70) cell.classList.add("grade-good");
    else if (score >= 60) cell.classList.add("grade-avg");
    else if (score >= 50) cell.classList.add("grade-acceptable");
    else cell.classList.add("grade-fail");
}

function toggleEctsEdit() {
    const isEditMode = document.getElementById('edit-ects-mode').checked;
    document.querySelectorAll('.ects-input').forEach(input => {
        input.readOnly = !isEditMode;
        isEditMode ? input.classList.add('editable') : input.classList.remove('editable');
    });
}

function toggleNamesEdit() {
    const isEditMode = document.getElementById('edit-names-mode').checked;
    document.querySelectorAll('.name-input').forEach(input => {
        input.readOnly = !isEditMode;
        isEditMode ? input.classList.add('editable') : input.classList.remove('editable');
    });
}

function toggleSaveWindow() {
    const content = document.getElementById('save-window-content');
    content.classList.toggle('show');
    const icon = document.getElementById('tab-icon');
    icon.innerText = content.classList.contains('show') ? '▲' : '▼';
}

function generateTextFile() {
    const getVal = id => document.getElementById(id).value.trim() || "-";
    const studentName = getVal('student-name');
    
    // الحصول على السنة الدراسية من الحقلين الجديدين
    const yearStart = document.getElementById('academic-year-start').value || "----";
    const yearEnd = document.getElementById('academic-year-end').value || "----";
    const academicYearDisplay = `${yearStart}-${yearEnd}`;

    let content = `اسم الطالب: ${studentName}\r\nالجامعة: ${getVal('uni-name')}\r\nالكلية: ${getVal('college-name')}\r\nالقسم: ${getVal('dept-name')}\r\nالسنة الدراسية: ${academicYearDisplay} | المرحلة: ${getVal('stage-name')} | الفصل: ${getVal('semester-name')}\r\n`;
    content += `--------------------------------------------------\r\n\r\n`;

    APP_CONFIG.defaultSubjects.forEach(sub => {
        const ects = document.getElementById(`${sub.id}_ects`).value;
        const currentName = document.getElementById(`${sub.id}_name`).value;
        const saei = document.getElementById(`${sub.id}_saei`).value || "-";
        const gradeKey = document.getElementById(`${sub.id}_final_grade`).value;
        const gradeLabel = gradeKey ? GRADES_MAP[gradeKey].label : "--";
        
        // حساب الدرجة الدقيقة للامتحان والنهائية للتصدير
        let examScore = "-";
        let totalScoreDisplay = "-";
        if (gradeKey && saei !== "-") {
            const saeiNum = parseFloat(saei);
            const selectedGrade = GRADES_MAP[gradeKey];
            const saeRatio = saeiNum / 50;
            examScore = (selectedGrade.min + (saeRatio * 10)).toFixed(1);
            totalScoreDisplay = (saeiNum + parseFloat(examScore)).toFixed(1);
        }
        
        content += `${currentName}\r\nعدد الوحدات: ${ects}\r\nالسعي (من 50): ${saei}\r\nالتقدير النهائي: ${gradeLabel}\r\nدرجة الامتحان المحسوبة: ${examScore}\r\nالدرجة النهائية (السعي+الامتحان): ${totalScoreDisplay}\r\n\r\n`;
    });

    content += `--------------------------------------------------\r\nالمعدل الفصلي العام: ${document.getElementById('final-gpa-word').innerText}\r\n`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    link.download = studentName !== "-" ? `نتيجة_${studentName.replace(/\s+/g, '_')}.txt` : `نتيجة_طالب.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}