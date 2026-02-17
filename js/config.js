// js/config.js

const APP_CONFIG = {
    universityDefault: "جامعة الكوفة",
    collegeDefault: "كلية علوم الحاسوب والرياضيات",
    
    // مصفوفات قابلة للتعديل بسهولة لأي إضافات مستقبلية
    departments: ["علوم الحاسوب", "الذكاء الاصطناعي", "تكنولوجيا المعلومات", "شبكات الحاسوب", "الرياضيات"],
    academicYears: ["2025-2026", "2024-2025", "2023-2024"],
    stages: ["الأولى", "الثانية", "الثالثة", "الرابعة"],
    semesters: ["الأول", "الثاني"],
    
    // المواد الافتراضية لقسم علوم الحاسوب
    defaultSubjects: [
        { id: 'prog', name: 'اساسيات البرمجة', ects: 7 },
        { id: 'arch', name: 'تركيب الحاسوب', ects: 5 },
        { id: 'math', name: 'الرياضيات', ects: 6 },
        { id: 'arabic', name: 'لغة عربية', ects: 3 },
        { id: 'english', name: 'أساسيات اللغة الإنجليزية', ects: 4 },
        { id: 'skills', name: 'مهارات الحاسوب', ects: 5 }
    ],

    // قيود النظام (Validation Rules)
    limits: {
        maxScore: 50,
        minScore: 0,
        maxEcts: 8,
        minEcts: 2,
        totalRequiredEcts: 30
    }
};