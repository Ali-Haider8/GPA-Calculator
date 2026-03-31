// نظام التقديرات والدرجات المقابلة
const GRADES_MAP = {
    excellence: { label: 'امتياز (90-100)', value: 95, range: '90-100' },
    vGood: { label: 'جيد جداً (80-90)', value: 85, range: '80-90' },
    good: { label: 'جيد (70-80)', value: 75, range: '70-80' },
    avg: { label: 'متوسط (60-70)', value: 65, range: '60-70' },
    acceptable: { label: 'مقبول (50-60)', value: 55, range: '50-60' }
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
        el.innerHTML = "";
        data.forEach(item => el.add(new Option(item, item)));
    };
    fill('dept-name', APP_CONFIG.departments);
    fill('academic-year', APP_CONFIG.academicYears);
    fill('stage-name', APP_CONFIG.stages);
    fill('semester-name', APP_CONFIG.semesters);
}

function buildTable() {
    const tbody = document.getElementById('subjects-body');
    tbody.innerHTML = "";
    
    APP_CONFIG.defaultSubjects.forEach((sub, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" id="${sub.id}_name" class="name-input" value="${sub.name}" readonly></td>
            <td><input type="number" inputmode="numeric" id="${sub.id}_ects" class="ects-input" value="${sub.ects}" min="2" max="8" readonly></td>
            <td><input type="number" inputmode="numeric" id="${sub.id}_saei" placeholder="-" min="0" max="50" oninput="validate(this, 50); mainUpdate();"></td>
            <td>
                <select id="${sub.id}_final_grade" onchange="mainUpdate()">
                    <option value="">-- اختر التقدير --</option>
                    <option value="excellence">امتياز (90-100)</option>
                    <option value="vGood">جيد جداً (80-90)</option>
                    <option value="good">جيد (70-80)</option>
                    <option value="avg">متوسط (60-70)</option>
                    <option value="acceptable">مقبول (50-60)</option>
                </select>
            </td>
            <td id="${sub.id}_grade_cell">
                <span id="${sub.id}_grade_text">--</span>
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

function setupEventListeners() {
    document.getElementById('btn-toggle-save').addEventListener('click', toggleSaveWindow);
    document.getElementById('btn-gpa-info').addEventListener('click', () => 
        document.getElementById('gpa-modal').classList.add('show'));
    document.getElementById('btn-close-modal').addEventListener('click', () => 
        document.getElementById('gpa-modal').classList.remove('show'));
    document.getElementById('btn-export').addEventListener('click', generateTextFile);

    document.getElementById('predict-mode').addEventListener('change', mainUpdate);
    document.getElementById('edit-ects-mode').addEventListener('change', toggleEctsEdit);
    document.getElementById('edit-names-mode').addEventListener('change', toggleNamesEdit);
}

function mainUpdate() {
    const isPredict = document.getElementById('predict-mode').checked;
    let totalWeightedScore = 0;
    let sumEcts = 0;
    let isEctsValid = true;
    
    APP_CONFIG.defaultSubjects.forEach(sub => {
        const ectsInput = document.getElementById(`${sub.id}_ects`);
        const saeiInput = document.getElementById(`${sub.id}_saei`);
        const gradeSelect = document.getElementById(`${sub.id}_final_grade`);
        const textGrade = document.getElementById(`${sub.id}_grade_text`);
        const gradeCell = document.getElementById(`${sub.id}_grade_cell`);
        
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
        gradeCell.className = "";
        
        if (gradeSelect.value === "") {
            textGrade.innerText = "--";
            return;
        }

        const selectedGrade = GRADES_MAP[gradeSelect.value];
        const finalScore = selectedGrade.value;
        const totalScore = saei + finalScore;

        // عرض متوسط التقدير
        textGrade.innerText = `${finalScore}`;
        applyColorToCell(gradeCell, totalScore);
        totalWeightedScore += (totalScore * ectsVal);
    });

    // التنبيهات واحتساب الـ GPA
    const warningDiv = document.getElementById('ects-warning');
    const finalGpaElement = document.getElementById('final-gpa-word');
    
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

    let content = `اسم الطالب: ${studentName}\r\nالجامعة: ${getVal('uni-name')}\r\nالكلية: ${getVal('college-name')}\r\nالقسم: ${getVal('dept-name')}\r\nالسنة الدراسية: ${getVal('academic-year')} | المرحلة: ${getVal('stage-name')} | الفصل: ${getVal('semester-name')}\r\n`;
    content += `--------------------------------------------------\r\n\r\n`;

    APP_CONFIG.defaultSubjects.forEach(sub => {
        const ects = document.getElementById(`${sub.id}_ects`).value;
        const currentName = document.getElementById(`${sub.id}_name`).value;
        const saei = document.getElementById(`${sub.id}_saei`).value || "-";
        const gradeKey = document.getElementById(`${sub.id}_final_grade`).value;
        const gradeLabel = gradeKey ? GRADES_MAP[gradeKey].label : "--";
        const gradeValue = gradeKey ? GRADES_MAP[gradeKey].value : "-";
        const avgScore = document.getElementById(`${sub.id}_grade_text`).innerText;
        
        content += `${currentName}\r\nعدد الوحدات: ${ects}\r\nالسعي (من 50): ${saei}\r\nالتقدير النهائي: ${gradeLabel}\r\nمتوسط التقدير: ${avgScore}\r\n\r\n`;
    });

    content += `--------------------------------------------------\r\nالمعدل الفصلي العام: ${document.getElementById('final-gpa-word').innerText}\r\n`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    link.download = studentName !== "-" ? `نتيجة_${studentName.replace(/\s+/g, '_')}.txt` : `نتيجة_طالب.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}