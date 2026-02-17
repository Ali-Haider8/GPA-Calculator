// js/app.js

// 1. التهيئة (Initialization)
document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    buildTable();
    setupEventListeners();
    loadFromLocalStorage(); // استرجاع البيانات المحفوظة إن وجدت 
    mainUpdate();
});

// 2. بناء القوائم المنسدلة من ملف config.js 
function populateDropdowns() {
    const createOptions = (array, selectId) => {
        const select = document.getElementById(selectId);
        array.forEach(item => {
            select.add(new Option(item, item));
        });
        select.add(new Option("- فارغ -", ""));
    };

    createOptions(APP_CONFIG.departments, 'dept-name');
    createOptions(APP_CONFIG.academicYears, 'academic-year');
    createOptions(APP_CONFIG.stages, 'stage-name');
    createOptions(APP_CONFIG.semesters, 'semester-name');
}

// 3. بناء الجدول ديناميكياً
function buildTable() {
    const tbody = document.getElementById('subjects-body');
    tbody.innerHTML = ''; 

    APP_CONFIG.defaultSubjects.forEach((sub, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" id="${sub.id}_name" class="name-input" data-index="${index}" value="${sub.name}" readonly></td>
            <td><input type="number" id="${sub.id}_ects" class="ects-input" value="${sub.ects}" min="${APP_CONFIG.limits.minEcts}" max="${APP_CONFIG.limits.maxEcts}" readonly></td>
            <td><input type="number" id="${sub.id}_saei" class="score-input" placeholder="-" min="${APP_CONFIG.limits.minScore}" max="${APP_CONFIG.limits.maxScore}"></td>
            <td><input type="number" id="${sub.id}_final" class="score-input" placeholder="-" min="${APP_CONFIG.limits.minScore}" max="${APP_CONFIG.limits.maxScore}"></td>
            <td id="${sub.id}_grade_cell" class="grade-cell">
                <span id="${sub.id}_grade_text">--</span>
                <select id="${sub.id}_grade_select" class="predict-select" style="display:none;">
                    <option value="50">مقبول</option>
                    <option value="60">متوسط</option>
                    <option value="70">جيد</option>
                    <option value="80">جيد جداً</option>
                    <option value="90">امتياز</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 4. إدارة الأحداث (Event Delegation) 
function setupEventListeners() {
    // مراقبة أي تغيير في الجدول بأكمله بدلاً من كل حقل على حدة
    document.getElementById('subjects-body').addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            enforceLimits(e.target);
            mainUpdate();
            saveToLocalStorage();
        }
    });

    document.getElementById('subjects-body').addEventListener('change', (e) => {
        if (e.target.tagName === 'SELECT') { mainUpdate(); saveToLocalStorage(); }
    });

    // أحداث أزرار التحكم
    document.getElementById('predict-mode').addEventListener('change', mainUpdate);
    document.getElementById('edit-ects-mode').addEventListener('change', toggleEctsEdit);
    document.getElementById('edit-names-mode').addEventListener('change', toggleNamesEdit);
    
    // أحداث القوائم السفلية
    document.getElementById('dept-name').addEventListener('change', autoUpdateSubjectNames);
    document.getElementById('semester-name').addEventListener('change', autoUpdateSubjectNames);
    document.getElementById('btn-toggle-save').addEventListener('click', toggleSaveWindow);
    document.getElementById('btn-export').addEventListener('click', generateTextFile);
}

// 5. حماية المدخلات (Validation) [cite: 3]
function enforceLimits(inputElement) {
    if (inputElement.value === "") return;
    let val = parseInt(inputElement.value);
    let max = parseInt(inputElement.max);
    let min = parseInt(inputElement.min);

    if (val > max) inputElement.value = max;
    if (val < min) inputElement.value = min;
}

// 6. المنطق الرئيسي للحساب
function mainUpdate() {
    const isPredictMode = document.getElementById('predict-mode').checked;
    const finalHeader = document.getElementById('final-header');
    
    let totalWeightedScore = 0;
    let sumEcts = 0;
    let isEctsValid = true;

    finalHeader.innerText = isPredictMode ? "المطلوب بالفاينل" : "النهائي (50)";
    isPredictMode ? finalHeader.classList.add("predict-active") : finalHeader.classList.remove("predict-active");

    APP_CONFIG.defaultSubjects.forEach(sub => {
        const ectsInput = document.getElementById(`${sub.id}_ects`);
        const saeiInput = document.getElementById(`${sub.id}_saei`);
        const finalInput = document.getElementById(`${sub.id}_final`);
        const textGrade = document.getElementById(`${sub.id}_grade_text`);
        const selectGrade = document.getElementById(`${sub.id}_grade_select`);
        const gradeCell = document.getElementById(`${sub.id}_grade_cell`);

        let ectsVal = parseInt(ectsInput.value) || 0;
        if (ectsVal < APP_CONFIG.limits.minEcts || ectsVal > APP_CONFIG.limits.maxEcts) {
            ectsInput.classList.add('error'); isEctsValid = false;
        } else {
            ectsInput.classList.remove('error');
        }
        sumEcts += ectsVal;

        let saei = parseFloat(saeiInput.value) || 0;
        let final = 0, total = 0;
        gradeCell.className = "grade-cell"; 

        if (isPredictMode) {
            textGrade.style.display = 'none';
            selectGrade.style.display = 'inline-block';
            finalInput.readOnly = true;
            finalInput.classList.add('predict-readonly');

            const targetTotal = parseInt(selectGrade.value);
            let requiredFinal = Math.max(0, targetTotal - saei);
            finalInput.value = requiredFinal;
            final = requiredFinal;
            total = saei + final;

            if (requiredFinal > APP_CONFIG.limits.maxScore) finalInput.classList.add('impossible-score');
            else finalInput.classList.remove('impossible-score');
            
            applyColorToCell(gradeCell, targetTotal);
            sub.currentGradeText = selectGrade.options[selectGrade.selectedIndex].text;
        } else {
            textGrade.style.display = 'inline-block';
            selectGrade.style.display = 'none';
            finalInput.readOnly = false;
            finalInput.classList.remove('predict-readonly', 'impossible-score');

            final = parseFloat(finalInput.value) || 0;
            total = saei + final;

            if (saeiInput.value || finalInput.value) {
                let gradeText = getGradeWord(total);
                applyColorToCell(gradeCell, total);
                textGrade.innerText = gradeText;
                sub.currentGradeText = gradeText;
            } else {
                textGrade.innerText = "--";
                sub.currentGradeText = "--";
            }
        }
        
        sub.currentSaei = saeiInput.value !== "" ? saei : "-";
        sub.currentFinal = finalInput.value !== "" ? final : "-";
        totalWeightedScore += (total * ectsVal);
    });

    updateFinalScreen(sumEcts, isEctsValid, totalWeightedScore);
}

// دوال مساعدة للحساب والألوان
function getGradeWord(score) {
    if (score >= 90) return "امتياز";
    if (score >= 80) return "جيد جداً";
    if (score >= 70) return "جيد";
    if (score >= 60) return "متوسط";
    if (score >= 50) return "مقبول";
    if (score >= 45) return "مقبول بقرار";
    return "ضعيف";
}

function applyColorToCell(cell, score) {
    if (score >= 90) cell.classList.add("grade-excellent");
    else if (score >= 80) cell.classList.add("grade-vgood");
    else if (score >= 45 && score < 50) cell.classList.add("grade-fx");
    else if (score < 45) cell.classList.add("grade-fail");
}

function updateFinalScreen(sumEcts, isEctsValid, totalWeightedScore) {
    const warningDiv = document.getElementById('ects-warning');
    const finalGpaElement = document.getElementById('final-gpa-word');
    
    if (sumEcts !== APP_CONFIG.limits.totalRequiredEcts || !isEctsValid) {
        warningDiv.style.display = 'block';
        document.getElementById('current-ects-sum').innerText = sumEcts;
        finalGpaElement.innerText = "خطأ في الوحدات";
        finalGpaElement.className = "gpa-value error-gpa";
        window.globalGpaNumber = 0; window.globalGpaWord = "خطأ";
    } else {
        warningDiv.style.display = 'none';
        window.globalGpaNumber = (totalWeightedScore / APP_CONFIG.limits.totalRequiredEcts).toFixed(2);
        
        if (totalWeightedScore > 0) {
            window.globalGpaWord = getGradeWord(window.globalGpaNumber);
            finalGpaElement.innerText = window.globalGpaWord;
            finalGpaElement.className = `gpa-value color-${window.globalGpaWord}`;
        } else {
            window.globalGpaWord = "--";
            finalGpaElement.innerText = "--";
            finalGpaElement.className = "gpa-value";
        }
    }
}

// التبديل وتغيير الأسماء
function toggleEctsEdit() {
    const isEditMode = document.getElementById('edit-ects-mode').checked;
    document.querySelectorAll('.ects-input').forEach(input => {
        input.readOnly = !isEditMode;
        isEditMode ? input.classList.add('editable') : input.classList.remove('editable');
    });
    mainUpdate();
}

function toggleNamesEdit() {
    const isEditMode = document.getElementById('edit-names-mode').checked;
    document.querySelectorAll('.name-input').forEach(input => {
        input.readOnly = !isEditMode;
        isEditMode ? input.classList.add('editable') : input.classList.remove('editable');
    });
}

function autoUpdateSubjectNames() {
    const dept = document.getElementById('dept-name').value;
    const semester = document.getElementById('semester-name').value;
    
    APP_CONFIG.defaultSubjects.forEach((sub, index) => {
        const nameInput = document.getElementById(`${sub.id}_name`);
        if (dept === 'علوم الحاسوب' && semester === 'الأول') {
            nameInput.value = sub.name;
        } else {
            nameInput.value = `مادة ${index + 1}`;
        }
    });
}

function toggleSaveWindow() {
    const content = document.getElementById('save-window-content');
    const icon = document.getElementById('tab-icon');
    content.classList.toggle('show');
    icon.innerText = content.classList.contains('show') ? '▲' : '▼';
    if(content.classList.contains('show')) content.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// 7. التصدير والتخزين (Export & Storage) 
function saveToLocalStorage() {
    const data = {};
    APP_CONFIG.defaultSubjects.forEach(sub => {
        data[sub.id] = {
            saei: document.getElementById(`${sub.id}_saei`).value,
            final: document.getElementById(`${sub.id}_final`).value,
            ects: document.getElementById(`${sub.id}_ects`).value,
            name: document.getElementById(`${sub.id}_name`).value
        };
    });
    localStorage.setItem('gpaData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('gpaData'));
    if (!data) return;
    APP_CONFIG.defaultSubjects.forEach(sub => {
        if(data[sub.id]) {
            document.getElementById(`${sub.id}_saei`).value = data[sub.id].saei;
            document.getElementById(`${sub.id}_final`).value = data[sub.id].final;
            document.getElementById(`${sub.id}_ects`).value = data[sub.id].ects;
            document.getElementById(`${sub.id}_name`).value = data[sub.id].name;
        }
    });
}

function generateTextFile() {
    const getVal = id => document.getElementById(id).value.trim() || "-";
    const studentName = getVal('student-name');
    const isPredict = document.getElementById('predict-mode').checked;

    let content = `اسم الطالب: ${studentName}\r\nالجامعة: ${getVal('uni-name')}\r\nالكلية: ${getVal('college-name')}\r\nالقسم: ${getVal('dept-name')}\r\nالسنة الدراسية: ${getVal('academic-year')} | المرحلة: ${getVal('stage-name')} | الفصل: ${getVal('semester-name')}\r\n`;
    if (isPredict) content += `(ملاحظة: هذه النتيجة مبنية على وضع التنبؤ والتخطيط)\r\n`;
    content += `--------------------------------------------------\r\n\r\n`;

    APP_CONFIG.defaultSubjects.forEach(sub => {
        content += `${document.getElementById(`${sub.id}_name`).value}\r\nعدد الوحدات: ${document.getElementById(`${sub.id}_ects`).value}\r\nالسعي: ${sub.currentSaei}\r\nالنهائي: ${sub.currentFinal}\r\nالتقدير: ${sub.currentGradeText}\r\n\r\n`;
    });

    content += `--------------------------------------------------\r\nالتقدير العام: ${window.globalGpaWord}\r\nمعدل الفصل (GPA): ${window.globalGpaNumber}\r\n`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    link.download = studentName !== "-" ? `نتيجة_${studentName.replace(/\s+/g, '_')}.txt` : `نتيجة_طالب.txt`; 
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}