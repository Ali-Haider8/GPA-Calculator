# GPA Calculator - Bologna Pathway

A semester GPA calculator for Iraqi universities following the Bologna Process pathway. This application helps students calculate their expected semester GPA based on continuous assessment (سعي) scores and predicted final exam grades.

## Features

- **Real-time GPA Calculation**: Automatically calculates GPA as you enter scores
- **Smart Grade Selection**: Dynamically filters available grade options based on your continuous assessment score
- **Exam Score Predictor**: Shows valid final exam scores needed to achieve each grade
- **Export Results**: Save and export your results as a text file
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Capable**: No internet required after initial load (except for MathJax formula display)

## File Structure

```
gpa-calculator/
├── index.html              # Main HTML file (semantic structure only)
├── css/
│   ├── base.css           # CSS variables, reset, body styles
│   ├── layout.css         # Container layouts, grid, responsive design
│   ├── components.css     # Tables, inputs, buttons, modal components
│   └── themes.css         # Grade colors, animations
├── js/
│   ├── config.js          # APP_CONFIG, GRADES_MAP, constants (pure data)
│   ├── dom.js             # DOM element references and helpers
│   ├── grades.js          # Grade logic, color mapping functions
│   ├── table.js           # Table building, row generation, dropdown updates
│   ├── calculator.js      # Main GPA calculation logic
│   ├── export.js          # Text file generation and download
│   └── main.js            # Entry point, event wiring, initialization
└── README.md              # This file
```

## How to Run Locally

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser
3. **No build tools required** - the app runs directly in the browser

### Using a Local Server (Recommended)

For the best experience, serve the files using a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Configuration

### Adding/Removing Subjects

Edit the `defaultSubjects` array in `js/config.js`:

```javascript
const APP_CONFIG = {
    // ... other config
    defaultSubjects: [
        { id: 'prog', name: 'اساسيات البرمجة', ects: 7 },
        { id: 'arch', name: 'تركيب الحاسوب', ects: 5 },
        // Add new subjects here
        { id: 'new_subject', name: 'اسم المادة', ects: 6 }
    ]
};
```

Each subject requires:
- `id`: Unique identifier (lowercase, no spaces)
- `name`: Display name in Arabic
- `ects`: Credit hours (between 2-8)

### Changing Grade Boundaries

Edit the `GRADES_MAP` object in `js/config.js`:

```javascript
const GRADES_MAP = {
    excellence: { label: 'امتياز (90-100)', minTarget: 90, maxTarget: 100 },
    vGood: { label: 'جيد جداً (80-89)', minTarget: 80, maxTarget: 89 },
    // ... modify ranges as needed
};
```

Each grade entry requires:
- `label`: Display text shown in dropdowns
- `minTarget`: Minimum total score for this grade
- `maxTarget`: Maximum total score for this grade

### Modifying Constants

Key constants are defined at the bottom of `js/config.js`:

```javascript
const ECTS_MIN = 2;           // Minimum credits per subject
const ECTS_MAX = 8;           // Maximum credits per subject
const SAEI_MAX = 50;          // Maximum continuous assessment score
const SAEI_MIN_PASSING = 14;  // Minimum saei to pass
const EXAM_MIN = 0;           // Minimum exam score
const EXAM_MAX = 50;          // Maximum exam score
const TOTAL_ECTS_TARGET = 30; // Required total credits
```

## GPA Formula

The application uses the standard Bologna GPA formula:

$$GPA = \frac{\sum (ECTS \times Grade)}{Total \ ECTS}$$

Where:
- `ECTS` = Credit hours for each subject
- `Grade` = Total score (continuous assessment + final exam)
- `Total ECTS` = Sum of all credit hours (must equal 30)

## Grade Scale

| Grade | Range | Color |
|-------|-------|-------|
| امتياز (Excellence) | 90-100 | Dark Green |
| جيد جداً (Very Good) | 80-89 | Green |
| جيد (Good) | 70-79 | Light Green |
| متوسط (Average) | 60-69 | Yellow |
| مقبول (Acceptable) | 50-59 | Orange |
| راسب (Fail) | 0-49 | Red |

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6 support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in multiple browsers
5. Submit a pull request

### Code Style Guidelines

- **JavaScript**: Use JSDoc comments for functions, follow consistent naming conventions
- **CSS**: Use CSS variables from `base.css`, follow BEM-like naming
- **HTML**: Semantic elements, proper ARIA labels for accessibility

## License

This project is provided as-is for educational purposes.

## Credits

Developed for Iraqi university students following the Bologna Process pathway.
