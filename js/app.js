document.addEventListener('DOMContentLoaded', () => {
    // بناء القوائم المنسدلة من الـ Config
    populateDropdowns();
    buildTable();
    setupEventListeners();
    mainUpdate();
});

function populateDropdowns() {
    const fill = (id, data) => {
        const el = document.getElementById(id);
        data.forEach(item => el.add(new Option(item, item)));
        el.add(new Option("- فارغ -", ""));
    };
    fill('dept-name', APP_CONFIG.departments);
    fill('academic-year', APP_CONFIG.academicYears);
    fill('stage-name', APP_CONFIG.stages);
    fill('semester-name', APP_CONFIG.semesters);
}

function buildTable() {
    const tbody = document.getElementById('subjects-body');
    APP_CONFIG.defaultSubjects.forEach(sub => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" id="${sub.id}_name" class="name-input" value="${sub.name}" readonly></td>
            <td><input type="number" id="${sub.id}_ects" class="ects-input" value="${sub.ects}" min="2" max="8" readonly></td>
            <td><input type="number" id="${sub.id}_saei" placeholder="-" min="0" max="50" oninput="validate(this)"></td>
            <td><input type="number" id="${sub.id}_final" placeholder="-" min="0" max="50" oninput="validate(this)"></td>
            <td id="${sub.id}_grade_cell">
                <span id="${sub.id}_grade_text">--</span>
                <select id="${sub.id}_grade_select" style="display:none;" onchange="mainUpdate()">
                    <option value="50">مقبول</option><option value="60">متوسط</option>
                    <option value="70">جيد</option><option value="80">جيد جداً</option><option value="90">امتياز</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function setupEventListeners() {
    document.getElementById('btn-toggle-save').addEventListener('click', toggleSaveWindow);
    document.getElementById('btn-gpa-info').addEventListener('click', () => document.getElementById('gpa-modal').classList.add('show'));
    document.getElementById('btn-close-modal').addEventListener('click', () => document.getElementById('gpa-modal').classList.remove('show'));
    document.querySelectorAll('input').forEach(i => i.addEventListener('input', mainUpdate));
    document.getElementById('predict-mode').addEventListener('change', mainUpdate);
}

function validate(el) {
    if (el.value > 50) el.value = 50;
    if (el.value < 0) el.value = 0;
}

function mainUpdate() {
    const isPredict = document.getElementById('predict-mode').checked;
    let totalScore = 0;
    
    APP_CONFIG.defaultSubjects.forEach(sub => {
        const saei = parseFloat(document.getElementById(`${sub.id}_saei`).value) || 0;
        const finalInput = document.getElementById(`${sub.id}_final`);
        const gradeCell = document.getElementById(`${sub.id}_grade_cell`);
        
        if (isPredict) {
            finalInput.readOnly = true;
            const target = parseInt(document.getElementById(`${sub.id}_grade_select`).value);
            const req = Math.max(0, target - saei);
            finalInput.value = req;
            totalScore += (target * sub.ects);
        } else {
            finalInput.readOnly = false;
            const final = parseFloat(finalInput.value) || 0;
            totalScore += ((saei + final) * sub.ects);
        }
    });

    const gpa = (totalScore / 30).toFixed(2);
    document.getElementById('final-gpa-word').innerText = gpa > 0 ? getWord(gpa) : "--";
}

function getWord(g) {
    if (g >= 90) return "امتياز";
    if (g >= 80) return "جيد جداً";
    if (g >= 70) return "جيد";
    if (g >= 60) return "متوسط";
    if (g >= 50) return "مقبول";
    return "ضعيف";
}

function toggleSaveWindow() {
    const content = document.getElementById('save-window-content');
    content.classList.toggle('show');
}