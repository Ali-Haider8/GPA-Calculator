// === CONFIG ===
const APP_CONFIG = {
    academicYears: ["2025-2026", "2024-2025", "2023-2024", "2022-2023"],
    stages: ["الأولى", "الثانية", "الثالثة", "الرابعة"],
    semesters: ["الأول", "الثاني"],
    defaultSubjects: [
        { id: 'prog', name: 'اساسيات البرمجة', ects: 7 },
        { id: 'arch', name: 'تركيب الحاسوب', ects: 5 },
        { id: 'math', name: 'الرياضيات', ects: 6 },
        { id: 'arabic', name: 'لغة عربية', ects: 3 },
        { id: 'english', name: 'أساسيات اللغة الإنجليزية', ects: 4 },
        { id: 'skills', name: 'مهارات الحاسوب', ects: 5 }
    ]
};

// === GRADES MAP (Updated Limits) ===
const GRADES_MAP = {
    excellence: { label: 'امتياز (90-100)', minTarget: 90, maxTarget: 100 },
    vGood: { label: 'جيد جداً (80-89)', minTarget: 80, maxTarget: 89 },
    good: { label: 'جيد (70-79)', minTarget: 70, maxTarget: 79 },
    avg: { label: 'متوسط (60-69)', minTarget: 60, maxTarget: 69 },
    acceptable: { label: 'مقبول (50-59)', minTarget: 50, maxTarget: 59 },
    fail_fx: { label: 'راسب قيد المعالجة (45-49)', minTarget: 45, maxTarget: 49 },
    fail_f: { label: 'راسب (0-44)', minTarget: 0, maxTarget: 44 }
};

// === CONSTANTS ===
const ECTS_MIN = 2;
const ECTS_MAX = 8;
const SAEI_MAX = 50;
const SAEI_MIN_PASSING = 14;
const EXAM_MIN = 0;
const EXAM_MAX = 50;
const TOTAL_ECTS_TARGET = 30;
