# 🎓 Bologna Process GPA Calculator

A professional, responsive web application designed for Iraqi university students (specifically those at the **University of Kufa**) to calculate and predict their semester GPA according to the "Bologna Process" standards.



---

## 🌟 Key Features
* **Predictive Mode:** A smart feature that allows students to select a target grade (e.g., Excellent, Very Good). [cite_start]The app automatically calculates the specific score required in the final exam to achieve that goal[cite: 1, 6].
* [cite_start]**Smart Input Validation:** Implements strict logic to prevent impossible entries, such as final exam scores exceeding 50 or ECTS units outside the 2-8 range[cite: 1, 5].
* **Dynamic ECTS Handling:** Alerts the user if the total ECTS for the semester does not equal 30, ensuring calculations align with official university requirements.
* [cite_start]**Export to Text (.txt):** Users can export their results, including personal details and subject-specific breakdowns, into a formatted text file[cite: 6].
* [cite_start]**Fully Responsive Design:** Optimized for a seamless experience across iPhones, Android devices, tablets, and desktops[cite: 1].

## 🛠️ Tech Stack
* [cite_start]**Frontend:** Vanilla HTML5, CSS3, and JavaScript (ES6+) for high performance and zero dependencies[cite: 2].
* **Backend/Hosting:** **Google Apps Script (GAS)**, providing a serverless environment for web app deployment.
* **Tooling:** **CLASP (Command Line Apps Script Projects)** for managing the project locally and syncing with GitHub.
* **Mathematics:** **MathJax** integration for rendering professional-grade mathematical formulas.

## 📂 Project Architecture
[cite_start]The project follows the **Separation of Concerns** principle to ensure maintainability and scalability[cite: 2, 7]:

* `index.html`: The structural layer of the application.
* [cite_start]`css/style.css`: The presentation layer, featuring a 3D-styled UI and responsive grid layouts[cite: 2].
* [cite_start]`js/config.js`: The data layer containing default subjects and configuration constants[cite: 2].
* [cite_start]`js/app.js`: The business logic layer handling GPA calculations, validation, and UI interactions[cite: 2, 3].

## 🚀 How to Run
You can access the live version of the application here:
**[Live Demo Link](https://script.google.com/macros/s/AKfycbyfEIsX76e4A8hWn3w-66SIsS5U961e05p2G8S_B1W_WpUe86E7896Ue/exec)**
*(Note: Replace with your actual .exec URL)*

## 📐 Calculation Logic
The application calculates the GPA based on the official weighted average formula:
$$GPA = \frac{\sum (ECTS \times Grade)}{Total \ ECTS}$$



---

## 👤 Author
**Ali Haider**
*Undergraduate Student at the University of Kufa*
*Member of the Google Developer Group (GDG)*

---
⭐ If you find this tool helpful, please give it a **Star** on GitHub!
