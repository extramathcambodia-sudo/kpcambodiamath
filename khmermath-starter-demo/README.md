# KhmerMath Local Starter Kit & Architecture Demo

កញ្ចប់គំរូគ្រោងឆ្អឹង (Starter Kit) សម្រាប់បើកមើល និងដំណើរការលើកុំព្យូទ័រផ្ទាល់ខ្លួន (Localhost) ដោយមិនបាច់ភ្ជាប់ Internet និងអាចប្រើជាគំរូសម្រាប់បញ្ជា AI ឱ្យបន្តបង្កើតប្រព័ន្ធផ្ទាល់ខ្លួនបាន។

---

## 📁 មាតិកាក្នុងកញ្ចប់ (Files Included)

1. **`index.html`**៖ ទំព័រដើម (Portal Dashboard) ភ្ជាប់ទៅកាន់ផ្នែកគំរូនីមួយៗ។
2. **`lesson-g7-l01.html`**៖ មេរៀនគំរូ ថ្នាក់ទី ៧ (មេរៀនទី ១) ដែលមានរូបមន្តគណិតវិទ្យា (KaTeX) និងប្រអប់តេស្តសាកល្បងសមត្ថភាព (Interactive Quiz) ក្នុងទំព័រ។
3. **`geometry-angle-bisector.html`**៖ សំណង់ធរណីមាត្រគំរូ «សង់កន្លះបន្ទាត់ពុះមុំ» ដោយប្រើបន្ទាត់ និងដែកឈាន (Animation មួយជំហានម្តងៗ លើ SVG)។
4. **`exam-demo.html`**៖ ប្រព័ន្ធប្រឡងគំរូ (Exam Player) ដែលមាននាឡិការាប់ថយក្រោយ ផ្ទាំងជ្រើសរើសសំណួរ និងការកែពិន្ទុស្វ័យប្រវត្តិនឹងអត្រាកំណែលម្អិត។
5. **`static/data/sample_bank.json`**៖ ធនាគារសំណួរគំរូចំនួន ១៥ សំណួរ (MCQ & Calculation) សម្រាប់មើលជាទម្រង់ Data Schema។
6. **`static/`**៖ CSS, JS, Fonts (Kantumruy Pro), និង KaTeX រត់ក្នុង Local ១០០%។

---

## 🚀 របៀបបើកមើល (How to Run)

### វិធីទី ១៖ បើកដោយផ្ទាល់ (Double-Click)
- គ្រាន់តែចុចពីរដង (Double-click) លើ File `index.html` ដើម្បីបើកតាម Google Chrome, Safari, ឬ Microsoft Edge បានភ្លាមៗ។

### វិធីទី ២៖ ប្រើ Local Web Server (ណែនាំ)
បើកកម្មវិធី Terminal ឬ Command Prompt ក្នុង Folder នេះ រួចវាយ៖
```bash
# ប្រើ Python
python3 -m http.server 8000

# ឬប្រើ Node.js npx
npx serve .
```
បន្ទាប់មកបើក Browser ហើយចូលទៅកាន់៖ `http://localhost:8000`

---

## 🤖 របៀបប្រើ AI (ChatGPT / Claude / Gemini) បន្តបង្កើតមុខងារ

### ១. សួរ AI ឱ្យបង្កើតសំណួរប្រឡងថ្មីៗបន្ថែម
ចម្លងទម្រង់ពី `static/data/sample_bank.json` រួចប្រាប់ AI ថា៖
> *"I have an exam platform with this JSON schema (stem, options, answer, hint, sol). Please generate 20 new high-quality math questions for Grade 9 on Quadratic Equations with step-by-step solutions using LaTeX."*

### ២. សួរ AI ឱ្យបង្កើត Backend (API / Database)
> *"I have a frontend exam player in `exam-demo.html`. Please help me build a backend in Express.js (Node.js) or FastAPI (Python) with SQLite to store student answers and results."*

### ៣. សួរ AI ឱ្យបង្កើតសំណង់ធរណីមាត្រថ្មី
> *"Here is my geometry construction template in `geometry-angle-bisector.html` using SVG and step buttons. Please write a step-by-step construction for Inscribed Circle of a Triangle with compass animations and Khmer instructions."*
