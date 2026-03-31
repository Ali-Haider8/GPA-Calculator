// === EXPORT FUNCTIONALITY ===

/**
 * Collect all results data from the form
 * @returns {Object} Results data object
 */
function collectResultsData() {
    const studentName = getVal('student-name');
    const academicYearDisplay = document.getElementById('academic-year-select').value;

    const subjects = APP_CONFIG.defaultSubjects.map(sub => {
        const ects = document.getElementById(`${sub.id}_ects`).value;
        const currentName = document.getElementById(`${sub.id}_name`).value;
        const saei = document.getElementById(`${sub.id}_saei`).value || "-";
        const gradeKey = document.getElementById(`${sub.id}_final_grade`).value;
        const examSelectValue = document.getElementById(`${sub.id}_predicted_exam`).value;

        let gradeLabel = "--";
        let totalScoreDisplay = "-";
        let predictedExamDisplay = "-";

        if (saei !== "-") {
            const saeiNum = parseFloat(saei);
            if (saeiNum < 14) {
                gradeLabel = "راسب (السعي أقل من 14)";
                totalScoreDisplay = saei;
            } else if (gradeKey && examSelectValue !== "") {
                gradeLabel = GRADES_MAP[gradeKey].label;
                const predictedExamNum = parseFloat(examSelectValue);
                const totalScore = saeiNum + predictedExamNum;

                totalScoreDisplay = totalScore.toFixed(0);
                predictedExamDisplay = predictedExamNum.toFixed(0);
            }
        }

        return {
            name: currentName,
            ects,
            saei,
            gradeLabel,
            predictedExam: predictedExamDisplay,
            totalScore: totalScoreDisplay
        };
    });

    const finalGpaText = document.getElementById('final-gpa-word').innerText;

    return {
        studentName,
        university: getVal('uni-name'),
        college: getVal('college-name'),
        department: getVal('dept-name'),
        academicYear: academicYearDisplay,
        stage: getVal('stage-name'),
        semester: getVal('semester-name'),
        subjects,
        finalGpa: finalGpaText
    };
}

/**
 * Format results data as plain text
 * @param {Object} data - Results data object
 * @returns {string} Formatted text content
 */
function formatAsText(data) {
    let content = `اسم الطالب: ${data.studentName}\r\n`;
    content += `الجامعة: ${data.university}\r\n`;
    content += `الكلية: ${data.college}\r\n`;
    content += `القسم: ${data.department}\r\n`;
    content += `السنة الدراسية: ${data.academicYear} | المرحلة: ${data.stage} | الفصل: ${data.semester}\r\n`;
    content += `--------------------------------------------------\r\n\r\n`;

    data.subjects.forEach(sub => {
        content += `${sub.name}\r\n`;
        content += `عدد الوحدات: ${sub.ects}\r\n`;
        content += `السعي: ${sub.saei}\r\n`;
        content += `التقدير المحرز: ${sub.gradeLabel}\r\n`;
        content += `درجة الفاينل المتوقعة: ${sub.predictedExam}\r\n`;
        content += `الدرجة النهائية: ${sub.totalScore}\r\n\r\n`;
    });

    content += `--------------------------------------------------\r\n`;
    content += `المعدل الفصلي العام (GPA) المتوقع: ${data.finalGpa}\r\n`;

    return content;
}

/**
 * Download text file to user's device
 * @param {string} content - File content
 * @param {string} filename - Desired filename
 */
function downloadFile(content, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Main export function - generates and downloads results file
 */
function generateTextFile() {
    const data = collectResultsData();
    const content = formatAsText(data);
    
    const filename = data.studentName !== "-" 
        ? `نتيجة_${data.studentName.replace(/\s+/g, '_')}.txt` 
        : `نتيجة_طالب.txt`;
    
    downloadFile(content, filename);
}
