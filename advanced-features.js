// ملف إضافي: advanced-features.js
// ميزات متقدمة للتطبيق

// 1️⃣ نظام التنبيهات الذكية
class SmartAlerts {
    static check(gpa) {
        if (gpa < 50) return { type: 'danger', msg: '⚠️ تحتاج مراجعة فورية' };
        if (gpa < 60) return { type: 'warning', msg: '⚠️ حاول تحسين أدائك' };
        if (gpa < 70) return { type: 'info', msg: 'ℹ️ أداء جيد، استمر!' };
        if (gpa < 80) return { type: 'success', msg: '✅ ممتاز!' };
        return { type: 'excellent', msg: '🌟 متفوق!' };
    }
}

// 2️⃣ نظام الإحصائيات
class Statistics {
    static calculate(subjects) {
        const scores = subjects.map(s => {
            const saei = parseFloat(document.getElementById(`${s.id}_saei`).value) || 0;
            const gradeKey = document.getElementById(`${s.id}_final_grade`).value;
            if (!gradeKey) return 0;
            const gradeValue = GRADES_MAP[gradeKey].value;
            return saei + gradeValue;
        });

        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const max = Math.max(...scores);
        const min = Math.min(...scores.filter(s => s > 0));
        const median = this.getMedian(scores.sort((a, b) => a - b));

        return { average: average.toFixed(2), max, min, median };
    }

    static getMedian(arr) {
        const mid = Math.floor(arr.length / 2);
        return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    }
}

// 3️⃣ نظام المقارنة مع الفصول السابقة
class PerformanceTracker {
    static saveResult(studentName, gpa, semester, year) {
        const key = `gpa_${studentName}_${year}_${semester}`;
        const data = {
            gpa: parseFloat(gpa),
            date: new Date().toISOString(),
            semester,
            year
        };
        localStorage.setItem(key, JSON.stringify(data));
    }

    static getHistory(studentName) {
        const results = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`gpa_${studentName}`)) {
                const data = JSON.parse(localStorage.getItem(key));
                results.push(data);
            }
        }
        return results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    static calculateTrend(history) {
        if (history.length < 2) return null;
        const first = history[0].gpa;
        const last = history[history.length - 1].gpa;
        const change = last - first;
        const percentage = ((change / first) * 100).toFixed(2);
        return { change: change.toFixed(2), percentage };
    }
}

// 4️⃣ نظام الألوان الديناميكي
class DynamicTheme {
    static applyTheme(gpa) {
        const container = document.querySelector('.app-container');
        
        if (gpa >= 90) {
            container.style.borderColor = '#1b5e20';
            container.style.backgroundColor = '#f1f8e9';
        } else if (gpa >= 80) {
            container.style.borderColor = '#2e7d32';
            container.style.backgroundColor = '#f4fdf4';
        } else if (gpa >= 70) {
            container.style.borderColor = '#558b2f';
            container.style.backgroundColor = '#f9f9f9';
        } else if (gpa >= 60) {
            container.style.borderColor = '#f57f17';
            container.style.backgroundColor = '#fff8f3';
        } else {
            container.style.borderColor = '#d32f2f';
            container.style.backgroundColor = '#ffebee';
        }
    }
}

// 5️⃣ نظام التصدير المتقدم
class AdvancedExport {
    static exportAsJSON(subjects, studentInfo) {
        const data = {
            student: studentInfo,
            subjects: subjects.map(sub => ({
                name: document.getElementById(`${sub.id}_name`).value,
                ects: parseInt(document.getElementById(`${sub.id}_ects`).value),
                saei: parseFloat(document.getElementById(`${sub.id}_saei`).value) || 0,
                grade: document.getElementById(`${sub.id}_final_grade`).value,
                gradeLabel: GRADES_MAP[document.getElementById(`${sub.id}_final_grade`).value]?.label || '--'
            })),
            gpa: parseFloat(document.getElementById('final-gpa-word').innerText) || 0,
            exportDate: new Date().toISOString()
        };

        this.downloadFile(JSON.stringify(data, null, 2), 'results.json');
    }

    static exportAsCSV(subjects) {
        const rows = [
            ['المادة', 'الوحدات', 'السعي', 'التقدير', 'المتوسط'],
            ...subjects.map(sub => [
                document.getElementById(`${sub.id}_name`).value,
                document.getElementById(`${sub.id}_ects`).value,
                document.getElementById(`${sub.id}_saei`).value || '-',
                GRADES_MAP[document.getElementById(`${sub.id}_final_grade`).value]?.label || '--',
                document.getElementById(`${sub.id}_grade_text`).innerText
            ])
        ];

        const csv = rows.map(row => row.join(',')).join('\n');
        this.downloadFile(csv, 'results.csv');
    }

    static downloadFile(content, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// 6️⃣ نظام التحسينات المقترحة
class ImprovementSuggestions {
    static getSuggestions(gpa) {
        const suggestions = [];

        if (gpa < 50) {
            suggestions.push('🎯 ركز على المواد الضعيفة أولاً');
            suggestions.push('📚 اطلب مساعدة من المدرسين');
            suggestions.push('👥 كوّن مجموعة دراسية');
        } else if (gpa < 60) {
            suggestions.push('📖 زد ساعات الدراسة');
            suggestions.push('✏️ حل التمارين بانتظام');
            suggestions.push('🔄 راجع الدروس الضعيفة');
        } else if (gpa < 70) {
            suggestions.push('⭐ أنت على الطريق الصحيح');
            suggestions.push('🎯 ركز على المواد الصعبة');
            suggestions.push('💪 استمر في المجهود الحالي');
        } else if (gpa < 80) {
            suggestions.push('🌟 أداء ممتاز، حافظ عليه');
            suggestions.push('🚀 حاول الوصول لـ 80+');
            suggestions.push('💯 استهدف الأداء الأفضل');
        } else {
            suggestions.push('🏆 أداء متفوق جداً');
            suggestions.push('👏 افتخر بنفسك!');
            suggestions.push('🎓 أنت بالطريق الصحيح للتميز');
        }

        return suggestions;
    }

    static displaySuggestions(gpa) {
        const suggestions = this.getSuggestions(gpa);
        const container = document.createElement('div');
        container.className = 'suggestions-container';
        container.innerHTML = suggestions.map(s => `<p>${s}</p>`).join('');
        return container;
    }
}

// 7️⃣ نظام حماية البيانات
class DataProtection {
    static encryptData(data) {
        // تشفير بسيط (يمكن تحسينه)
        return btoa(JSON.stringify(data));
    }

    static decryptData(encrypted) {
        try {
            return JSON.parse(atob(encrypted));
        } catch (e) {
            return null;
        }
    }

    static backupToCloud() {
        // يمكن إضافة Backup إلى Google Drive
        console.log('Backup feature coming soon');
    }
}

// 8️⃣ نظام لغات متعددة
const LANGUAGES = {
    ar: {
        gpa: 'المعدل الفصلي',
        excellent: 'امتياز',
        vGood: 'جيد جداً',
        good: 'جيد',
        avg: 'متوسط',
        acceptable: 'مقبول',
        fail: 'ضعيف'
    },
    en: {
        gpa: 'Semester GPA',
        excellent: 'Excellent',
        vGood: 'Very Good',
        good: 'Good',
        avg: 'Average',
        acceptable: 'Acceptable',
        fail: 'Fail'
    }
};

// 9️⃣ نظام الإشعارات
class NotificationSystem {
    static show(message, type = 'info', duration = 3000) {
        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${this.getColor(type)};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, duration);
    }

    static getColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }
}

// 🔟 نظام تصدير PDF
class PDFExport {
    static async exportPDF(studentName, gpa) {
        // يتطلب مكتبة jsPDF
        console.log('PDF export coming soon');
        NotificationSystem.show('PDF export feature coming soon', 'info');
    }
}

// تصدير جميع الفئات
export {
    SmartAlerts,
    Statistics,
    PerformanceTracker,
    DynamicTheme,
    AdvancedExport,
    ImprovementSuggestions,
    DataProtection,
    NotificationSystem,
    PDFExport
};
