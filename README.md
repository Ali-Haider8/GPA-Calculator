# 📊 GPA Calculator - Bologna System

> A smart, real-time GPA calculator for university students following the Bologna Process framework.

![GPA Calculator Demo](hnuqnn.png)
![Results Export](iInmVX.png)

---

## 🎯 Overview

**GPA Calculator** is a modern web-based tool designed specifically for students in the **Bologna educational system** (ECTS-based). It provides instant calculations of semester GPA with visual feedback, intelligent grade predictions, and professional result exports.

Perfect for students who need to plan their academic performance and understand how different exam scores impact their final grades.

---

## ⚡ Key Features

### Core Functionality
- ✅ **Real-time GPA Calculation** - Instant updates as you enter scores
- 📈 **ECTS-Weighted Scoring** - Accurate Bologna system calculations
- 🎓 **6-Subject Support** - Pre-configured with common CS courses (customizable)
- 🔴 **Smart Grade Validation** - Auto-disables impossible grade combinations
- 🎨 **Color-Coded Results** - Visual performance indicators (A-F scale)

### Advanced Features
- 🧮 **Predicted Exam Calculator** - Dynamically shows required exam scores for each grade range
- 📋 **Intelligent Constraints** - Prevents invalid input combinations (saei < 14 = auto-fail)
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🌍 **RTL Support** - Built for Arabic-speaking students (full i18n ready)
- 💾 **One-Click Export** - Download results as .txt file with all metadata
- 📝 **Custom Metadata** - Save student info, semester details, university info

### Mathematical Accuracy
```
GPA = Σ(ECTS × Grade) / Total ECTS
```
- Validates all inputs against Bologna framework rules
- Supports fail states (F, FX) with proper handling
- Respects minimum passing thresholds (50/100)

---

## 🚀 Quick Start

### Usage
1. **Open** `gpa-calculator-v2.html` in any modern browser
2. **Enter** your course details:
   - Course name (editable)
   - ECTS credits (2-8 range)
   - Continuous assessment score (Saei: 0-50)
   - Expected final grade tier
3. **View** predicted exam scores needed for each grade
4. **Export** results with one click (includes student info, all courses, final GPA)

### No Installation Required
- Pure HTML/CSS/JavaScript
- Works offline
- Responsive design with MathJax support for formulas

---

## 🛠️ Technology Stack

| Tech | Purpose |
|------|---------|
| **HTML5** | Semantic structure |
| **CSS3** | Advanced styling (Flexbox, Grid, Gradients) |
| **Vanilla JavaScript** | Real-time DOM updates & validation |
| **MathJax 3** | Mathematical formula rendering |

---

## 📐 How It Works

### Grade Range Logic
The calculator intelligently calculates the **predicted final exam score** needed:

| Grade | Range | Formula |
|-------|-------|---------|
| Excellent | 90-100 | Exam = (90-100) - Saei |
| Very Good | 80-89 | Exam = (80-89) - Saei |
| Good | 70-79 | Exam = (70-79) - Saei |
| Average | 60-69 | Exam = (60-69) - Saei |
| Acceptable | 50-59 | Exam = (50-59) - Saei |
| Fail | <50 | Auto-fail if Saei < 14 |

### Smart Validation
- ❌ **Impossible combos** → Hidden from dropdown
- ❌ **Invalid ECTS** → Red border warning
- ❌ **Missing fields** → GPA shows "--"
- ✅ **Only 30 ECTS total** → GPA displays when valid

---

## 📸 Screenshots

| Feature | Description |
|---------|-------------|
| ![Demo 1](hnuqnn.png) | Main calculator interface with live GPA display |
| ![Demo 2](iInmVX.png) | Export modal with metadata and results |

---

## 🎨 UI/UX Highlights

- **Windows 95 Retro Aesthetic** - Nostalgic, accessible design
- **Gradient Headers** - Modern touches with classic vibes
- **Smart Color Coding** - Grades color-mapped for quick scanning
  - 🟢 Green (90+): Excellent
  - 🟡 Yellow (60-69): Average
  - 🔴 Red (<50): Fail
- **Collapsible Export Panel** - Clean interface, advanced options hidden
- **Floating Info Button** - One-tap access to GPA formula explanation

---

## 🔧 Customization

### Change Default Courses
Edit the `APP_CONFIG.defaultSubjects` array:
```javascript
defaultSubjects: [
    { id: 'prog', name: 'Programming Basics', ects: 7 },
    { id: 'arch', name: 'Computer Architecture', ects: 5 },
    // Add more courses...
]
```

### Modify Grade Ranges
Update `GRADES_MAP` constants to match your institution:
```javascript
excellence: { label: 'A (90-100)', minTarget: 90, maxTarget: 100 }
```

### Localization
- Change `lang="ar" dir="rtl"` to `lang="en"` for LTR
- Replace Arabic strings in HTML/JS for your language

---

## 📋 Supported Scenarios

✅ Plan exam scores before sitting finals  
✅ Track semester progress in real-time  
✅ Export official course records  
✅ Compare grade scenarios (what-if analysis)  
✅ Share results with advisors  
✅ Mobile study tool (no server needed)  

---

## 🐛 Browser Support

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full support |
| Safari 14+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| Mobile browsers | ✅ Fully responsive |

---

## 📄 License

MIT License - Free for personal and educational use

---

## 👨‍💻 Contributing

Found a bug? Have a feature idea?
- Create an issue with details
- Submit a PR with improvements
- Suggestions welcome for Bologna system students worldwide

---

## 🎓 Made for Bologna Process Students

This tool is built specifically for universities using the **European Credit Transfer System (ECTS)** framework. Perfect for:
- University of Kufa students
- Arabic-speaking academic programs
- Any institution using ECTS/Bologna system

---

**Last Updated:** March 2026  
**Version:** 2.0 (Refined UI, Smart Validation, Export Features)
