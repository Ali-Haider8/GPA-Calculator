// === EXPORT FUNCTIONALITY ===

/**
 * Collect all results data from the form
 * @returns {Object} Results data object
 */
function collectResultsData() {
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

    const finalGpa = document.getElementById('final-gpa-word').innerText;
    return { subjects, finalGpa };
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
 * Quick save - downloads only subjects + GPA, no extra info
 */
function quickSave() {
    const data = collectResultsData();

    let content = '';
    data.subjects.forEach(sub => {
        content += `${sub.name}\r\n`;
        content += `  وحدات: ${sub.ects} | سعي: ${sub.saei} | تقدير: ${sub.gradeLabel} | فاينل: ${sub.predictedExam} | مجموع: ${sub.totalScore}\r\n\r\n`;
    });
    content += `--------------------------------------------------\r\n`;
    content += `المعدل الفصلي (GPA) المتوقع: ${data.finalGpa}\r\n`;

    downloadFile(content, 'نتائج_سريعة.txt');
}

