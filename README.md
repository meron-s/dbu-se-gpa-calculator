# DBU Software Engineering GPA Portal

A production-ready, beautiful, and highly responsive GPA & CGPA Calculator Web Application designed specifically for the **Software Engineering Department at Debre Berhan University (DBU)**. Built with React (Vite), Tailwind CSS, Context API, Framer Motion, and Recharts.

## 🚀 Key Features

- **Chronological Timeline**: Tailored directly to the DBU SE curriculum from **Year 2 Semester I** up to **Year 5 Semester II**.
- **Interactive CGPA Optimizer**: Toggle specific semesters on/off from the cumulative CGPA formula to simulate scenario planning.
- **Academic Progress Audit**: Visualize credit progress against the 121-credit degree requirement, showing passed, failed, and pending courses.
- **Target GPA Predictor**: Enter a target CGPA, and the simulator calculates the required average GPA needed over your remaining credits.
- **Interactive Semester Simulator**: Slide estimated future semester GPAs to preview your ultimate graduation classification standing.
- **Grade Analytics Charts**: Recharts-powered trend curvatures, attempted vs. completed credit comparisons, and grade category frequencies.
- **Global Course Search Overlay**: Press `⌘K` or `Ctrl+K` to search any departmental course and jump directly to its calculator page.
- **Permanent Local Storage & Auto-Save**: All changes are automatically saved locally; works completely offline with zero external database dependencies.
- **JSON Backup Engine**: Export your entire timeline profile as a `.json` backup file or restore it anytime using paste or file uploads.
- **Undo Action Stack**: Press `Ctrl+Z` to reverse the last grade choice instantly.
- **Departmental Badges**: Earn special achievements such as *Academic Titan* (4.0 GPA) or *Discrete Overcomer* (passing SE211 with high standing).
- **Print & PDF Export**: Highly customized `@media print` stylesheets to print clean, professional semester report cards and cumulative summaries directly from your browser.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React 19, TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4, Inter & JetBrains Mono Fonts
- **State Management**: React Context API (with deep undo stack)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Persistence**: LocalStorage

---

## 📂 Folder Structure

```
src/
  ├── components/      # Reusable layout assets (Navbar, Sidebar, Footer, modals)
  ├── context/         # AppContext.tsx for global state, themes, and backups
  ├── data/            # courses.json (curriculum database) & semestersMeta.ts
  ├── pages/           # Main view components (Home, Calculator, Prediction, Stats)
  ├── utils/           # gpaUtils.ts containing all math calculation engines
  ├── types.ts         # Shared TypeScript interfaces and structures
  ├── App.tsx          # Router routing, keyboard shortcuts, and global layout
  └── main.tsx         # Render entrypoint
```

---

## 📈 Grade Point Scale

| Letter Grade | Grade Point Value |
| :---: | :---: |
| **A** | 4.00 |
| **A-** | 3.75 |
| **B+** | 3.50 |
| **B** | 3.00 |
| **B-** | 2.75 |
| **C+** | 2.50 |
| **C** | 2.00 |
| **C-** | 1.75 |
| **D** | 1.00 |
| **F** | 0.00 |
| **I** | *Incomplete (Excluded from GPA)* |
| **NG** | *No Grade (Excluded from GPA)* |

---

## ⌨️ Keyboard Shortcuts

- `⌘K` or `Ctrl+K` : Open Global Course Search Modal
- `Ctrl+Z` : Undo Last Grade Modification
- `Alt+T` : Toggle Dark / Light Theme
- `Esc` : Close Open Modal / Overlays
