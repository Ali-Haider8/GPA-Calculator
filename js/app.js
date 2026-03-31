// نظام التقديرات والدرجات المقابلة
const GRADES_MAP = {
    excellence: { label: 'امتياز', value: 95, examBase: 40, examScale: 10 },  // Exam = 40 + (ratio × 10)
    vGood: { label: 'جيد جداً', value: 85, examBase: 35, examScale: 15 },     // Exam = 35 + (ratio × 15)
    good: { label: 'جيد', value: 75, examBase: 30, examScale: 20 },           // Exam = 30 + (ratio × 20)
    avg: { label: 'متوسط', value: 65, examBase: 25, examScale: 25 },          // Exam = 25 + (ratio × 25)
    acceptable: { label: 'مقبول', value: 55, examBase: 20, examScale: 30 }    // Exam = 20 + (ratio × 30)
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
                    <option value="vGood">جيد جداً (80-89)</option>
                    <option value="good">جيد (70-79)</option>
                    <option value="avg">متوسط (60-69)</option>
                    <option value="acceptable">مقبول (50-59)</option>
                </select>
            </td>
            <td id="${sub.id}_predicted_exam_cell" style="font-size: 0.85rem; color: #666;">
                <span id="${sub.id}_predicted_exam">-</span>
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
    const gpaText = document.getElementById(`${subjectId}_gpa_text`);
    const gpaCell = document.getElementById(`${subjectId}_gpa_cell`);
    const predictedExamText = document.getElementById(`${subjectId}_predicted_exam`);
    const predictedExamCell = document.getElementById(`${subjectId}_predicted_exam_cell`);

    if (saeiInput.value && parseFloat(saeiInput.value) > 0) {
        gradeSelect.disabled = false;
        gradeSelect.options[0].text = "-- اختر التقدير --";

        // حساب الدرجة النهائية المتوقعة بناءً على السعي
        const saei = parseFloat(saeiInput.value);
        const saeiRatio = saei / 50;
        
        // عرض درجة الامتحان المتوقعة للتقدير "امتياز" كقيمة افتراضية
        const excellenceData = GRADES_MAP.excellence;
        const predictedExam = Math.min(50, excellenceData.examBase + (saeiRatio * excellenceData.examScale));
        predictedExamText.innerText = predictedExam.toFixed(1);
        predictedExamCell.style.display = "";
        
        // تحديث خيارات التقدير بناءً على السعي
        updateGradeOptions(gradeSelect, saei, saeiRatio);
    } else {
        gradeSelect.disabled = true;
        gradeSelect.value = "";
        gradeSelect.options[0].text = "-- أدخل السعي أولاً --";
        gpaText.innerText = "--";
        gpaCell.className = "";
        predictedExamText.innerText = "-";
        predictedExamCell.style.display = "none";
    }
}

function updateGradeOptions(gradeSelect, saei, saeiRatio) {
    // تحديد التقديرات المتاحة بناءً على السعي
    const options = gradeSelect.options;
    
    // إخفاء/إظهار الخيارات بناءً على إمكانية تحقيق التقدير
    for (let i = 1; i < options.length; i++) {
        const opt = options[i];
        const gradeData = GRADES_MAP[opt.value];
        
        if (!gradeData) continue;
        
        // حساب درجة الامتحان المتوقعة باستخدام الصيغة التناسبية
        // Exam = base + (ratio × scale)، مع حد أقصى 50
        const predictedExam = Math.min(50, gradeData.examBase + (saeiRatio * gradeData.examScale));
        const totalScore = saei + predictedExam;
        
        // التحقق من إمكانية تحقيق هذا التقدير
        let min, max;
        switch(opt.value) {
            case 'excellence': min = 90; max = 100; break;
            case 'vGood': min = 80; max = 89; break;
            case 'good': min = 70; max = 79; break;
            case 'avg': min = 60; max = 69; break;
            case 'acceptable': min = 50; max = 59; break;
            default: min = 0; max = 100;
        }
        
        // إظهار الخيار فقط إذا كانت الدرجة المتوقعة ضمن نطاق التقدير
        // أو إذا كان السعي يسمح بالوصول إلى الحد الأدنى للتقدير
        const achievableMin = saei + gradeData.examBase; // أقل درجة ممكنة لهذا التقدير
        const achievableMax = saei + 50; // أعلى درجة ممكنة (امتحان كامل)
        
        if (achievableMax >= min && achievableMin <= max) {
            opt.style.display = '';
            opt.disabled = false;
        } else {
            opt.style.display = 'none';
            opt.disabled = true;
        }
    }
    
    // إعادة تعيين الاختيار
    gradeSelect.value = "";
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
        const predictedExamText = document.getElementById(`${sub.id}_predicted_exam`);
        const predictedExamCell = document.getElementById(`${sub.id}_predicted_exam_cell`);

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
            predictedExamText.innerText = "-";
            predictedExamCell.style.display = "none";
            return;
        }

        gpaCell.className = "";
        predictedExamCell.style.display = "";

        if (gradeSelect.value === "") {
            textGrade.innerText = "--";
            predictedExamText.innerText = "-";
            return;
        }

        const selectedGrade = GRADES_MAP[gradeSelect.value];

        // حساب الدرجة النهائية باستخدام الصيغة التناسبية الديناميكية:
        // مفهوم أساسي: الامتحان النهائي من 50، والسعي من 50، والمجموع من 100
        // العلاقة تناسبية مباشرة: كلما زاد السعي، اقتربت درجة الامتحان من 50/50
        // Exam = base + (saei_ratio × scale)، مع حد أقصى 50
        // المجموع الكلي لا يتجاوز 100 أبداً
        const saeiRatio = saei / 50;
        const predictedExam = Math.min(50, selectedGrade.examBase + (saeiRatio * selectedGrade.examScale));
        const totalScore = Math.min(100, saei + predictedExam);

        // عرض درجة الامتحان المتوقعة
        predictedExamText.innerText = predictedExam.toFixed(1);

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

    // إظهار شاشة GPA دائماً، وتحديث القيمة بشكل فوري
    gpaScreen.style.display = 'block';

    // حساب وعرض المعدل الرقمي (حتى لو لم تكتمل جميع الدرجات)
    if (totalWeightedScore > 0 && sumEcts > 0) {
        const gpa = parseFloat((totalWeightedScore / sumEcts).toFixed(2));
        finalGpaElement.innerText = gpa.toFixed(2);

        // تطبيق الألوان حسب المعدل - Apple Calculator Style
        finalGpaElement.className = 'gpa-value';
        if (gpa >= 90) finalGpaElement.classList.add('excellent');
        else if (gpa >= 80) finalGpaElement.classList.add('vgood');
        else if (gpa >= 70) finalGpaElement.classList.add('good');
        else if (gpa >= 60) finalGpaElement.classList.add('avg');
        else if (gpa >= 50) finalGpaElement.classList.add('acceptable');
        else finalGpaElement.classList.add('fail');
    } else {
        // عرض "--" فقط إذا لم يتم إدخال أي درجات
        finalGpaElement.innerText = "--";
        finalGpaElement.className = 'gpa-value';
    }

    if (sumEcts !== 30 || !isEctsValid) {
        warningDiv.style.display = 'block';
        document.getElementById('current-ects-sum').innerText = sumEcts;
    } else {
        warningDiv.style.display = 'none';
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

        // حساب الدرجة النهائية للتصدير باستخدام الصيغة التناسبية
        let totalScoreDisplay = "-";
        let predictedExamDisplay = "-";
        if (gradeKey && saei !== "-") {
            const saeiNum = parseFloat(saei);
            const saeiRatio = saeiNum / 50;
            const gradeData = GRADES_MAP[gradeKey];
            const predictedExam = Math.min(50, gradeData.examBase + (saeiRatio * gradeData.examScale));
            const totalScore = Math.min(100, saeiNum + predictedExam);
            totalScoreDisplay = totalScore.toFixed(1);
            predictedExamDisplay = predictedExam.toFixed(1);
        }

        content += `${currentName}\r\nعدد الوحدات: ${ects}\r\nالسعي (من 50): ${saei}\r\nالتقدير النهائي: ${gradeLabel}\r\nالدرجة النهائية: ${totalScoreDisplay}\r\nالامتحان المتوقع (من 50): ${predictedExamDisplay}\r\n\r\n`;
    });

    content += `--------------------------------------------------\r\nالمعدل الفصلي العام: ${document.getElementById('final-gpa-word').innerText}\r\n`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    link.download = studentName !== "-" ? `نتيجة_${studentName.replace(/\s+/g, '_')}.txt` : `نتيجة_طالب.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}