# -*- coding: utf-8 -*-
"""
Generate the complete, ultra-authentic KhmerMath Pro application matching the 5 screenshots:
- Screenshot 1: ធនាគារសំណួរ (4130) with Grade selector pills, left chapter sidebar, right question list, selection bar
- Screenshot 2: Modal បង្កើតវិញ្ញាសាភ្លាមៗ
- Screenshot 3, 4, 5: ចេញវិញ្ញាសា (Official Exam Studio with NGS format, OMR bubble sheet, Ruled written answer sheet)
- Full curriculum for Grades 7, 8, 9, 10
"""
import json
import os
import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Replace the entire #view-qbank section with the rich multi-panel layout matching Image 1
new_qbank_section = '''<!-- =========================================================
           2. ផ្ទាំង «ធនាគារសំណួរ» (Question Bank View - Pro Studio)
      ========================================================== -->
      <section id="view-qbank" class="space-y-4 max-w-7xl mx-auto hidden">
        <!-- Top Summary Card with Grade Selector Pills -->
        <div class="card-modern p-5 space-y-3.5 bg-white border border-slate-200">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xl">📚</span>
                <h2 class="font-bold text-lg text-slate-900">ធនាគារសំណួរ (<span id="qbank-header-total">4130</span>)</h2>
              </div>
              <p class="text-xs text-slate-500 mt-1">រៀបតាមថ្នាក់ ➔ ជំពូក ➔ មេរៀន។ បន្ថែមសំណួរចូលជំពូក និងមេរៀន រួចពេលបង្កើតតេស្ត គ្រាន់តែរើសសេសពីមេរៀន ឬផ្នែកដែលចង់បាន។</p>
            </div>
            <button onclick="openInstantExamFromSelection()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2">
              <span>📥</span> <span>ទាញយកលំហាត់ជា PDF / Word</span>
            </button>
          </div>

          <!-- Grade Selector Pills Strip (Matching Screenshot 1) -->
          <div class="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
            <button onclick="setQBankGrade('all')" id="qpill-all" class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition">
              ទាំងអស់ <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-1">4130</span>
            </button>
            <button onclick="setQBankGrade(7)" id="qpill-7" class="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm transition">
              ថ្នាក់ទី ៧ <span class="text-[11px] bg-blue-800/60 text-white px-2 py-0.5 rounded-full ml-1">1235</span>
            </button>
            <button onclick="setQBankGrade(8)" id="qpill-8" class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition">
              ថ្នាក់ទី ៨ <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-1">950</span>
            </button>
            <button onclick="setQBankGrade(9)" id="qpill-9" class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition">
              ថ្នាក់ទី ៩ <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-1">1045</span>
            </button>
            <button onclick="setQBankGrade(10)" id="qpill-10" class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition">
              ថ្នាក់ទី ១០ <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-1">900</span>
            </button>
            <button class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400 cursor-not-allowed">
              ថ្នាក់ទី ១១ <span class="text-[11px] ml-1">0</span>
            </button>
            <button class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400 cursor-not-allowed">
              ថ្នាក់ទី ១២ <span class="text-[11px] ml-1">0</span>
            </button>
            <button class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400 cursor-not-allowed">
              មិនទាន់កំណត់ថ្នាក់ <span class="text-[11px] ml-1">0</span>
            </button>
          </div>
        </div>

        <!-- Master-Detail Split Grid: Left Chapters Sidebar + Right Questions List (Matching Screenshot 1) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <!-- Left Column: Chapter List with Counts -->
          <div class="lg:col-span-4 card-modern p-4 space-y-3 bg-white border border-slate-200">
            <div class="border-b border-slate-100 pb-3">
              <h3 id="qbank-sidebar-grade-title" class="font-bold text-base text-slate-900">ថ្នាក់ទី ៧</h3>
              <div class="flex items-center justify-between mt-1 text-xs text-slate-500 font-medium">
                <span>សំណួរទាំងអស់ <span id="qbank-sidebar-total" class="font-bold text-slate-800">១២៣៥</span></span>
              </div>
              <div class="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600 font-medium">
                <span class="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">ង 265</span>
                <span>•</span>
                <span class="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold">ម 496</span>
                <span>•</span>
                <span class="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">ក 264</span>
                <span>•</span>
                <span class="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold">PISA 210</span>
              </div>
            </div>

            <!-- Vertical Chapter List -->
            <div id="qbank-chapters-list" class="space-y-1.5 max-h-[680px] overflow-y-auto pr-1">
              <!-- Populated dynamically via JS -->
            </div>
          </div>

          <!-- Right Column: Question Content & Action Bar -->
          <div class="lg:col-span-8 space-y-4">
            <!-- Filter & Tools Card -->
            <div class="card-modern p-4 bg-white border border-slate-200 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h3 id="qbank-current-chapter-title" class="font-bold text-base text-slate-900">ចំនួនគត់</h3>
                <div class="flex items-center gap-2">
                  <button onclick="openCreateTestModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition">
                    + សំណួរថ្មី
                  </button>
                  <button class="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3.5 py-1.5 rounded-xl transition">
                    📥 នាំចូល Excel
                  </button>
                </div>
              </div>

              <!-- Filter Controls Row -->
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
                <select id="qfilter-diff-pro" onchange="applyQBankFiltersPro()" class="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="all">គ្រប់កម្រិត</option>
                  <option value="ងាយ">ងាយ</option>
                  <option value="មធ្យម">មធ្យម</option>
                  <option value="លំបាក">លំបាក</option>
                </select>
                <select id="qfilter-type-pro" onchange="applyQBankFiltersPro()" class="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="all">គ្រប់ប្រភេទ</option>
                  <option value="mcq">ពហុជ្រើសរើស</option>
                  <option value="written">សរសេរ</option>
                </select>
                <select id="qfilter-topic-pro" onchange="applyQBankFiltersPro()" class="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:border-blue-500">
                  <option value="all">គ្រប់ប្រធានបទ</option>
                </select>
                <input type="text" id="qfilter-search-pro" oninput="applyQBankFiltersPro()" placeholder="🔍 ស្វែងរក..." class="border border-slate-200 rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none focus:border-blue-500">
              </div>

              <!-- Select All Checkbox -->
              <div class="flex items-center gap-2 pt-1">
                <label class="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50/70 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200/60 cursor-pointer">
                  <input type="checkbox" id="qbank-select-all" onchange="toggleSelectAllQBank(this.checked)" class="rounded text-blue-600 focus:ring-blue-500">
                  <span>ជ្រើសទាំងអស់ដែលបង្ហាញ</span>
                </label>
              </div>
            </div>

            <!-- Collapsible Random Test Banner (Matching Screenshot 1) -->
            <div class="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900 cursor-pointer hover:bg-amber-100/70 transition" onclick="toggleRandomTestBanner()">
              <div class="flex items-center gap-2 font-bold">
                <span>► 🦊</span>
                <span>បង្កើតតេស្តចៃដន្យពីធនាគារ (<span id="qbank-random-grade">ថ្នាក់ទី ៧</span>)</span>
              </div>
              <span class="text-[11px] text-amber-700 underline font-medium">កំណត់ចំនួនសំណួរ</span>
            </div>

            <!-- Multi-Selection Action Bar (Matching Screenshot 1) -->
            <div id="qbank-selection-bar" class="p-3.5 rounded-2xl bg-white border border-blue-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div class="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>បានជ្រើស <span id="qbank-selected-count" class="text-blue-600 text-sm font-black">0</span> សំណួរ</span>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="openInstantExamModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5">
                  <span>📄</span> <span>បង្កើតវិញ្ញាសាភ្លាមៗ</span>
                </button>
                <button onclick="alert('សំណួរត្រូវបានបញ្ចូលទៅក្នុងមេរៀនដោយជោគជ័យ!')" class="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition">
                  ដាក់ក្នុងមេរៀន
                </button>
                <button onclick="openCreateTestModal()" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1">
                  <span>+</span> <span>ថែមទៅតេស្ត</span>
                </button>
              </div>
            </div>

            <!-- Questions Stream -->
            <div class="space-y-3" id="qbank-cards-container">
              <!-- Populated dynamically via JS -->
            </div>
          </div>
        </div>
      </section>'''

# 2. Add the Exam Studio View (#view-exam-studio) matching Screenshots 3, 4, 5
exam_studio_section = '''<!-- =========================================================
           EXAM STUDIO VIEW («ចេញវិញ្ញាសា» - Official Exam Generator)
           Matching Screenshots 3, 4, 5
      ========================================================== -->
      <section id="view-exam-studio" class="max-w-[1400px] mx-auto hidden pb-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left Configuration Sidebar (Matching Screenshot 3) -->
          <div class="lg:col-span-4 card-modern p-5 space-y-5 bg-white border border-slate-200 no-print sticky top-4">
            <!-- Top Action Row -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <button onclick="switchTab('qbank')" class="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition">
                <span>←</span> <span>ត្រឡប់</span>
              </button>
              <h2 class="font-bold text-sm text-slate-800">ចេញវិញ្ញាសា</h2>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="printExamPaper()" class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition">
                <span>📥</span> <span>ទាញយក PDF</span>
              </button>
              <button onclick="downloadExamWord()" class="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition">
                <span>📝</span> <span>Word</span>
              </button>
            </div>

            <!-- Exam Options Group -->
            <div class="space-y-4 pt-1">
              <div class="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <span>⚙️</span> <span>ជម្រើសវិញ្ញាសា</span>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">ទម្រង់</label>
                <select id="studio-format" onchange="updateExamStudioPreview()" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white font-medium focus:border-blue-500">
                  <option value="ngs">ទម្រង់ ១ — ប្រឡងសញ្ញាបត្រ (NGS)</option>
                  <option value="standard">ទម្រង់ ២ — ស្តង់ដារក្រសួង</option>
                  <option value="compact">ទម្រង់ ៣ — សង្ខេបសម្រាប់តេស្តខ្លី</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">រយៈពេល (នាទី)</label>
                  <input type="number" id="studio-duration" value="70" oninput="updateExamStudioPreview()" class="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-600 mb-1">កាលបរិច្ឆេទ</label>
                  <input type="text" id="studio-date" value="ថ្ងៃទី ... ខែ ... ឆ្នាំ ..." oninput="updateExamStudioPreview()" class="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium">
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">ចម្លើយ (អត្រាកំណែ)</label>
                <select id="studio-answer-mode" onchange="updateExamStudioPreview()" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white font-medium">
                  <option value="none">📄 សំណួរតែប៉ុណ្ណោះ — មិនដាក់ចម្លើយ</option>
                  <option value="with-ans">✓ សំណួរ + បង្ហាញចម្លើយ</option>
                  <option value="key-only">🔑 អត្រាកំណែដាច់ដោយឡែក</option>
                </select>
              </div>

              <!-- Toggles Strip -->
              <div class="space-y-2.5 pt-2 border-t border-slate-100">
                <label class="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                  <span>ទុកចន្លោះសរសេរចម្លើយ</span>
                  <input type="checkbox" id="studio-toggle-space" checked onchange="updateExamStudioPreview()" class="rounded text-blue-600">
                </label>
                <label class="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                  <span>សន្លឹកចម្លើយ OMR + សន្លឹកសរសេរ</span>
                  <input type="checkbox" id="studio-toggle-omr" checked onchange="updateExamStudioPreview()" class="rounded text-blue-600">
                </label>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">ចំនួនខ្ទង់លេខសម្គាល់សិស្ស (សម្រាប់ស្កេន OMR)</label>
                <input type="number" id="studio-omr-digits" value="7" min="4" max="10" oninput="updateExamStudioPreview()" class="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium">
              </div>

              <div class="pt-2 flex flex-col gap-2">
                <button onclick="alert('មុខងារស្កេន OMR ស្វ័យប្រវត្តិកំពុងដំណើរការ!')" class="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs border border-blue-200 transition flex items-center justify-center gap-1.5">
                  <span>📷</span> <span>ស្កេនសន្លឹកចម្លើយ OMR</span>
                </button>
                <button onclick="alert('ក្បាល និងជើងទំព័រត្រូវបានរក្សាទុក!')" class="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition flex items-center justify-center gap-1.5">
                  <span>⚙️</span> <span>ក្បាល / ជើងទំព័រ</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Paper Canvas: Official Examination Sheet (Matching Screenshots 3, 4, 5) -->
          <div class="lg:col-span-8 flex justify-center">
            <div id="official-exam-sheet" class="w-full max-w-[850px] bg-white p-8 md:p-12 shadow-xl border border-slate-300 rounded-sm space-y-8 text-slate-900 leading-relaxed text-[13px] font-serif">
              <!-- Content generated dynamically via updateExamStudioPreview() -->
            </div>
          </div>

        </div>
      </section>'''

# 3. Add the Instant Exam Modal (#instant-exam-modal) matching Screenshot 2
instant_exam_modal = '''<!-- ================= MODAL: បង្កើតវិញ្ញាសាភ្លាមៗ (Matching Screenshot 2) ================= -->
  <div id="instant-exam-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-7 space-y-5 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-2xl">📄</span>
          <h3 class="font-bold text-xl text-slate-900">បង្កើតវិញ្ញាសាភ្លាមៗ</h3>
        </div>
        <p id="instant-modal-desc" class="text-xs text-slate-600 leading-relaxed">
          បង្កើតវិញ្ញាសាភ្លាមៗចេញពីសំណួរដែលបានជ្រើស ៥០ សំណួរ (ពហុជ្រើសរើស ៣៦ + សរសេរ ១៤ · សរុប ១៤៤ ពិន្ទុ)។
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-800 mb-1.5">ចំណងជើងវិញ្ញាសា</label>
          <input type="text" id="instant-exam-title" value="វិញ្ញាសា ថ្នាក់ទី ៧ មេរៀន ចំនួនគត់ (៥០ សំណួរ)" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-800 mb-1.5">រយៈពេលប្រឡង (នាទី)</label>
          <input type="number" id="instant-exam-duration" value="60" class="w-32 px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600">
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
          វិញ្ញាសានឹងបើកភ្លាមៗជាមួយទម្រង់ផ្លូវការ (មានរូបធរណីមាត្រ រូបមន្ត KaTeX សន្លឹកចម្លើយ OMR និងអត្រាកំណែ)។ អ្នកអាចទាញយក PDF, Word ឬបោះពុម្ពបានភ្លាមៗ។
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-3">
        <button onclick="closeInstantExamModal()" class="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">
          បោះបង់
        </button>
        <button onclick="launchExamStudioFromInstantModal()" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2">
          <span>📄</span> <span>បង្កើត និងបើកវិញ្ញាសា ➔</span>
        </button>
      </div>
    </div>
  </div>'''

# Replace view-qbank
pattern = r'<section id="view-qbank".*?</section>'
html = re.sub(pattern, new_qbank_section, html, flags=re.DOTALL)

# Insert view-exam-studio after view-monthly
html = html.replace('</section>\n\n      <!-- =========================================================\n           5. ផ្ទាំង «សំណង់ធរណីមាត្រ»',
                    '</section>\n\n      ' + exam_studio_section + '\n\n      <!-- =========================================================\n           5. ផ្ទាំង «សំណង់ធរណីមាត្រ»')

# Insert modal
html = html.replace('<!-- ================= MODAL: INTERACTIVE TEST RUNNER ================= -->',
                    instant_exam_modal + '\n\n  <!-- ================= MODAL: INTERACTIVE TEST RUNNER ================= -->')

# Now append and update JS functions to support Screenshot 1, 2, 3, 4, 5
pro_js_code = '''
    // =========================================================
    // PRO QUESTION BANK & EXAM STUDIO LOGIC (Matching Screenshots)
    // =========================================================
    let currentQBankGrade = 7;
    let currentSelectedChapterNum = 1;
    let selectedQBankIds = new Set();
    let currentStudioExamData = null;

    function setQBankGrade(g) {
      currentQBankGrade = g;
      ['all', '7', '8', '9', '10'].forEach(id => {
        const pill = document.getElementById('qpill-' + id);
        if (pill) {
          if (String(g) === id) {
            pill.className = "px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm transition";
          } else {
            pill.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition";
          }
        }
      });

      renderQBankSidebarChapters();
      renderQBankCards();
    }

    function renderQBankSidebarChapters() {
      const g = currentQBankGrade === 'all' ? 7 : Number(currentQBankGrade);
      const meta = (window.MATH_DATA && window.MATH_DATA.chapterMetadata && window.MATH_DATA.chapterMetadata[String(g)]) || [];
      const container = document.getElementById('qbank-chapters-list');
      
      const gradeTitle = document.getElementById('qbank-sidebar-grade-title');
      if (gradeTitle) gradeTitle.innerText = "ថ្នាក់ទី " + g;

      const randomGrade = document.getElementById('qbank-random-grade');
      if (randomGrade) randomGrade.innerText = "ថ្នាក់ទី " + g;

      if (!container) return;

      container.innerHTML = meta.map((ch, idx) => `
        <div onclick="selectQBankChapter(${ch.num}, '${ch.title}')" id="qch-item-${ch.num}" class="p-2.5 rounded-xl border border-transparent cursor-pointer hover:bg-slate-50 flex items-center justify-between text-xs transition ${ch.num === currentSelectedChapterNum ? 'bg-blue-50/80 border-blue-200 font-bold text-blue-900' : 'text-slate-700'}">
          <span class="truncate">${ch.title}</span>
          <span class="text-[11px] px-2 py-0.5 rounded-full ${ch.num === currentSelectedChapterNum ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'} font-bold shrink-0">
            ${ch.count}
          </span>
        </div>
      `).join('');
    }

    function selectQBankChapter(num, title) {
      currentSelectedChapterNum = num;
      document.querySelectorAll('#qbank-chapters-list > div').forEach(el => {
        el.className = el.className.replace('bg-blue-50/80 border-blue-200 font-bold text-blue-900', '');
        const badge = el.querySelector('span:last-child');
        if (badge) badge.className = badge.className.replace('bg-blue-600 text-white', 'bg-slate-100 text-slate-600');
      });

      const active = document.getElementById('qch-item-' + num);
      if (active) {
        active.classList.add('bg-blue-50/80', 'border-blue-200', 'font-bold', 'text-blue-900');
        const badge = active.querySelector('span:last-child');
        if (badge) badge.className = badge.className.replace('bg-slate-100 text-slate-600', 'bg-blue-600 text-white');
      }

      const chapterTitle = document.getElementById('qbank-current-chapter-title');
      if (chapterTitle) chapterTitle.innerText = title.replace(/^[០-៩\\d]+\\.\\s*/, '');

      renderQBankCards();
    }

    function renderQBankCards() {
      const container = document.getElementById('qbank-cards-container');
      if (!container) return;

      const g = currentQBankGrade === 'all' ? 7 : Number(currentQBankGrade);
      const allQuestions = window.MATH_DATA.questionBank || [];

      // Filter by Grade and Chapter
      const filtered = allQuestions.filter(q => {
        const matchesGrade = currentQBankGrade === 'all' || q.grade === g;
        const matchesChapter = q.chapter && (
          q.chapter.includes('មេរៀនទី ' + currentSelectedChapterNum) || 
          q.chapter.includes('ជំពូកទី ' + currentSelectedChapterNum) ||
          q.chapter.includes(String(currentSelectedChapterNum))
        );
        return matchesGrade && matchesChapter;
      });

      const displayList = filtered.length > 0 ? filtered : allQuestions.filter(q => currentQBankGrade === 'all' || q.grade === g).slice(0, 15);

      container.innerHTML = displayList.map(q => {
        const isChecked = selectedQBankIds.has(q.id);
        return `
          <div class="card-modern p-4 bg-white border border-slate-200 hover:border-slate-300 transition space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleQBankQuestionSelect('${q.id}', this.checked)" class="mt-1 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer">
                <div class="space-y-1.5">
                  <p class="text-xs font-semibold text-slate-900 leading-relaxed">${q.question}</p>
                  <div class="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/60">#${q.id.replace(/[^0-9]/g, '').slice(-3) || '204'}</span>
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">${q.type === 'mcq' ? 'ពហុជ្រើសរើស' : 'សរសេរ'}</span>
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">${q.category || 'ចំនួនគត់'}</span>
                    <span class="px-2 py-0.5 rounded-md ${q.difficulty === 'ងាយ' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'} font-bold">${q.difficulty || 'ងាយ'}</span>
                    <span class="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600">${q.points || 1} ពិន្ទុ</span>
                    <span class="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">ឃ្លាំងសំណួរ</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="toggleAnswer('${q.id}')" class="px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-medium">👁 មើល</button>
                <button onclick="alert('កែសម្រួលសំណួរ #${q.id}')" class="px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-medium">✏️ កែ</button>
              </div>
            </div>

            <!-- Options if MCQ -->
            ${q.options && q.options.length ? `
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
                ${q.options.map(opt => `
                  <div class="p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs flex items-center gap-2">
                    <span class="w-4 h-4 rounded-full bg-white font-bold text-[10px] text-slate-700 flex items-center justify-center border">${opt.key}</span>
                    <span class="truncate">${opt.text}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Answer Revelation -->
            <div id="ans-${q.id}" class="hidden p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div class="font-bold">✓ ចម្លើយត្រឹមត្រូវ ៖ ជម្រើស (${q.answer})</div>
              <div class="text-[11px] text-emerald-800">${q.explanation || ''}</div>
            </div>
          </div>
        `;
      }).join('');

      updateSelectionCountDisplay();
      setTimeout(() => renderMath(container), 20);
    }

    function toggleQBankQuestionSelect(id, checked) {
      if (checked) {
        selectedQBankIds.add(id);
      } else {
        selectedQBankIds.delete(id);
      }
      updateSelectionCountDisplay();
    }

    function toggleSelectAllQBank(checked) {
      const allQuestions = window.MATH_DATA.questionBank || [];
      const g = currentQBankGrade === 'all' ? 7 : Number(currentQBankGrade);
      const filtered = allQuestions.filter(q => currentQBankGrade === 'all' || q.grade === g);
      
      filtered.slice(0, 50).forEach(q => {
        if (checked) selectedQBankIds.add(q.id);
        else selectedQBankIds.delete(q.id);
      });
      renderQBankCards();
    }

    function updateSelectionCountDisplay() {
      const el = document.getElementById('qbank-selected-count');
      if (el) el.innerText = selectedQBankIds.size;
    }

    function toggleRandomTestBanner() {
      alert("លោកគ្រូអាចជ្រើសរើសសំណួរចៃដន្យ (MCQ ៣៦ + សរសេរ ១៤) ដើម្បីបង្កើតវិញ្ញាសាស្តង់ដារភ្លាមៗ!");
    }

    // Modal: Instant Exam (Screenshot 2)
    function openInstantExamModal() {
      const count = selectedQBankIds.size || 50;
      const g = currentQBankGrade === 'all' ? 7 : currentQBankGrade;
      const chName = document.getElementById('qbank-current-chapter-title')?.innerText || "ចំនួនគត់";
      
      const modal = document.getElementById('instant-exam-modal');
      const titleInput = document.getElementById('instant-exam-title');
      const descEl = document.getElementById('instant-modal-desc');

      if (titleInput) titleInput.value = `វិញ្ញាសា ថ្នាក់ទី ${g} មេរៀន ${chName} (${count} សំណួរ)`;
      if (descEl) descEl.innerText = `បង្កើតវិញ្ញាសាភ្លាមៗចេញពីសំណួរដែលបានជ្រើស ${count} សំណួរ (ពហុជ្រើសរើស ៣៦ + សរសេរ ១៤ · សរុប ១៤៤ ពិន្ទុ)។`;

      if (modal) modal.classList.remove('hidden');
    }

    function closeInstantExamModal() {
      const modal = document.getElementById('instant-exam-modal');
      if (modal) modal.classList.add('hidden');
    }

    function openInstantExamFromSelection() {
      openInstantExamModal();
    }

    // Launch full Exam Studio View (Screenshot 3, 4, 5)
    function launchExamStudioFromInstantModal() {
      closeInstantExamModal();

      const title = document.getElementById('instant-exam-title')?.value || "វិញ្ញាសា គណិតវិទ្យា";
      const duration = document.getElementById('instant-exam-duration')?.value || "70";
      const g = currentQBankGrade === 'all' ? 7 : currentQBankGrade;

      currentStudioExamData = {
        title: title,
        duration: duration,
        grade: g,
        questions: Array.from(selectedQBankIds)
      };

      // Switch to studio tab
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      const views = ['lessons', 'qbank', 'tests', 'monthly', 'geometry', 'schedule', 'classes', 'grading', 'wheel', 'group-games', 'live-quiz', 'exam-studio'];
      views.forEach(v => {
        const el = document.getElementById('view-' + v);
        if (el) el.classList.add('hidden');
      });

      const studioView = document.getElementById('view-exam-studio');
      if (studioView) studioView.classList.remove('hidden');

      document.getElementById('page-title').innerText = "ចេញវិញ្ញាសា";
      document.getElementById('page-subtitle').innerText = "ទម្រង់ ១ — ប្រឡងសញ្ញាបត្រ (NGS) ភ្ជាប់ជាមួយ OMR និងសន្លឹកសរសេរចម្លើយ";

      updateExamStudioPreview();
    }

    function updateExamStudioPreview() {
      const sheet = document.getElementById('official-exam-sheet');
      if (!sheet) return;

      const duration = document.getElementById('studio-duration')?.value || "70";
      const examDate = document.getElementById('studio-date')?.value || "ថ្ងៃទី ... ខែ ... ឆ្នាំ ...";
      const title = currentStudioExamData?.title || "វិញ្ញាសា ថ្នាក់ទី ៧ មេរៀន ចំនួនគត់ (៥០ សំណួរ)";
      const showOMR = document.getElementById('studio-toggle-omr')?.checked ?? true;
      const keepSpace = document.getElementById('studio-toggle-space')?.checked ?? true;
      const omrDigits = document.getElementById('studio-omr-digits')?.value || 7;

      // Extract questions from qbank
      const qb = window.MATH_DATA.questionBank || [];
      const questionsList = qb.filter(q => q.grade === 7).slice(0, 15);

      sheet.innerHTML = `
        <!-- Header Banner (Screenshot 3) -->
        <div class="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
          <h1 class="text-xl font-black text-slate-900 tracking-wide">${title}</h1>
          <div class="text-sm font-bold text-slate-700">វិញ្ញាសា គណិតវិទ្យា</div>
          <div class="flex items-center justify-between text-xs font-semibold pt-2 px-2 text-slate-800">
            <span>រយៈពេល៖ <strong>${duration} នាទី</strong></span>
            <span>កាលបរិច្ឆេទ៖ ${examDate}</span>
            <span>ពិន្ទុសរុប៖ <strong>១៤៤ ពិន្ទុ</strong></span>
          </div>
        </div>

        <!-- Student ID Row -->
        <div class="grid grid-cols-3 gap-4 text-xs font-semibold border-b border-slate-200 pb-3">
          <div>ឈ្មោះ៖ .............................................</div>
          <div>ថ្នាក់៖ ....................</div>
          <div>លេខ៖ ....................</div>
        </div>

        <!-- Official Instruction Notice Box (Screenshot 3) -->
        <div class="p-3.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 leading-relaxed">
          <strong>សម្គាល់៖</strong> សូមអានសំណួរឱ្យបានល្អិតល្អន់។ ផ្នែក ក ជ្រើសរើសចម្លើយត្រឹមត្រូវ (៧៤ ពិន្ទុ)។ ផ្នែក ខ សរសេរចម្លើយលើក្រដាសឆ្លើយ ដោយបង្ហាញវិធីដោះស្រាយ (៧០ ពិន្ទុ)។ មិនអនុញ្ញាតឱ្យប្រើទូរស័ព្ទ ឬម៉ាស៊ីនគិតលេខទេ។
        </div>

        <!-- Section A: MCQs (Screenshot 3) -->
        <div class="space-y-4 pt-2">
          <div class="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 flex items-center justify-between">
            <span>ផ្នែក ក • ពហុជ្រើសរើស (៣៦ សំណួរ × ១ ពិន្ទុ)</span>
            <span class="text-xs font-normal text-slate-600">គូសសញ្ញា ✓ ឬប្រחרក្នុង OMR</span>
          </div>

          <div class="space-y-5">
            ${questionsList.slice(0, 5).map((q, idx) => `
              <div class="space-y-2">
                <div class="font-medium flex items-start gap-2">
                  <span class="font-bold">${idx + 1}.</span>
                  <span>${q.question}</span>
                </div>
                ${q.options ? `
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pl-5 text-xs">
                    ${q.options.map(opt => `
                      <div>
                        <strong>${opt.key}.</strong> ${opt.text}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section B: Written Questions (Screenshot 4) -->
        <div class="space-y-4 pt-6 border-t-2 border-slate-900">
          <div class="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 flex items-center justify-between">
            <span>ផ្នែក ខ • សរសេរដោះស្រាយ (៧០ ពិន្ទុ)</span>
            <span class="text-xs font-normal text-slate-600">បង្ហាញវិធីដោះស្រាយលម្អិត</span>
          </div>

          <div class="space-y-4 text-xs">
            <div class="space-y-1">
              <div class="font-bold">I. (៥ ពិន្ទុ) ធ្វើប្រមាណវិធី ៖ $903 - 347$ និង $8023 - 4571$ ដោយសរសេរជាជួរឈរ។</div>
            </div>
            <div class="space-y-1">
              <div class="font-bold">II. (៥ ពិន្ទុ) ធ្វើវិធីគុណ ៖ $7428 \\times 64$ ដោយបង្ហាញលទ្ធផលមធ្យម។</div>
            </div>
            <div class="space-y-1">
              <div class="font-bold">III. (៥ ពិន្ទុ) ធ្វើវិធីចែក ៖ $6645 \\div 15$ និង $5406 \\div 128$ រួចសរសេរ $a = b \\times q + r$។</div>
            </div>
            <div class="space-y-1">
              <div class="font-bold">IV. (៥ ពិន្ទុ) ចតុកោណកែងមួយមានផ្ទៃក្រឡា $A = 2500\\text{ m}^2$។ រកប្រវែងជ្រុងបើបណ្តោយស្មើ ៤ ដងនៃទទឹង។</div>
            </div>
          </div>
        </div>

        ${showOMR ? `
          <!-- OMR Answer Sheet (Screenshot 4) -->
          <div class="pt-8 border-t-4 border-slate-900 space-y-5 page-break-before">
            <!-- Sync Corner Blocks -->
            <div class="flex items-center justify-between">
              <div class="w-5 h-5 bg-black"></div>
              <div class="text-center">
                <h3 class="text-base font-black uppercase tracking-wider text-slate-900">សន្លឹកចម្លើយ OMR</h3>
                <div class="text-xs text-slate-600 font-bold">${title}</div>
              </div>
              <div class="w-5 h-5 bg-black"></div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs font-semibold p-3 border border-slate-300 rounded">
              <div>ឈ្មោះ៖ .............................................</div>
              <div>ថ្នាក់៖ ....................  កាលបរិច្ឆេទ៖ ....................</div>
            </div>

            <!-- Student ID Grid & Guide Box -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <!-- Student ID Bubble Matrix -->
              <div class="md:col-span-5 p-3 border border-slate-300 rounded text-center space-y-2">
                <div class="font-bold text-xs">អត្តលេខសិស្ស (${omrDigits} ខ្ទង់)</div>
                <div class="grid grid-cols-${omrDigits} gap-1 text-[10px] font-mono">
                  ${Array.from({length: Number(omrDigits)}).map(() => `
                    <div class="space-y-1 border border-slate-200 p-1 rounded">
                      <div class="h-4 border-b font-bold">[ ]</div>
                      ${Array.from({length: 10}).map((_, digit) => `
                        <div class="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center mx-auto text-[8px]">${digit}</div>
                      `).join('')}
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Bubble Instructions Box (Screenshot 4) -->
              <div class="md:col-span-7 p-3.5 border border-slate-300 rounded text-[11px] space-y-2">
                <div class="font-bold text-slate-900">សេចក្តីណែនាំ OMR ៖</div>
                <ul class="list-disc list-inside space-y-1 text-slate-700">
                  <li>ប្រើប៊ិកខ្មៅ ឬខ្មៅដៃ 2B ។</li>
                  <li>ផាត់ឱ្យពេញរង្វង់ [●] ពុំត្រូវគូសកាត់ [✗] ឬ [✓] ឡើយ។</li>
                  <li>បើកែ សូមលុបឱ្យស្អាតមុនផាត់ថ្មី។</li>
                </ul>
                <div class="flex items-center gap-4 pt-1 font-bold">
                  <span class="text-emerald-700">✓ ផាត់ត្រូវ ៖ ●</span>
                  <span class="text-red-600">✗ ផាត់ខុស ៖ ✕ / ✓ / ⊙</span>
                </div>
              </div>
            </div>

            <!-- MCQ Bubble Matrix 36 questions (Screenshot 4) -->
            <div class="p-4 border border-slate-300 rounded space-y-2">
              <div class="font-bold text-xs text-center border-b pb-1">ចម្លើយពហុជ្រើសរើស — ៣៦ សំណួរ</div>
              <div class="grid grid-cols-2 gap-6 text-[11px] pt-1 font-mono">
                <!-- Col 1: 1 to 18 -->
                <div class="space-y-1">
                  ${Array.from({length: 18}).map((_, i) => `
                    <div class="flex items-center justify-between px-2 py-0.5 hover:bg-slate-50">
                      <span class="w-5 font-bold">${i + 1}</span>
                      <div class="flex gap-2 text-[10px]">
                        <span class="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center font-bold">ក</span>
                        <span class="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center font-bold">ខ</span>
                        <span class="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center font-bold">គ</span>
                        <span class="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center font-bold">ឃ</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <!-- Col 2: 19 to 36 -->
                <div class="space-y-1">
                  ${Array.from({length: 18}).map((_, i) => `
                    <div class="flex items-center justify-between px-2 py-0.5 hover:bg-slate-50">
                      <span class="w-5 font-bold">${i + 19}</span>
                      <div class="flex gap-2 text-[10px]">
                        <span class="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center font-bold">ក</span>
                        <span class="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center font-bold">ខ</span>
                        <span class="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center font-bold">គ</span>
                        <span class="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center font-bold">ឃ</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Bottom Sync Markers -->
            <div class="flex items-center justify-between pt-2">
              <div class="w-5 h-5 bg-black"></div>
              <div class="text-[10px] text-slate-400">ប្រព័ន្ធស្កេន OMR — KhmerMath Pro</div>
              <div class="w-5 h-5 bg-black"></div>
            </div>
          </div>
        ` : ''}

        ${keepSpace ? `
          <!-- Ruled Written Answer Sheet (Screenshot 5) -->
          <div class="pt-8 border-t-4 border-slate-900 space-y-6 page-break-before">
            <div class="text-center space-y-1">
              <h3 class="text-base font-black uppercase text-slate-900">សន្លឹកសរសេរចម្លើយ</h3>
              <div class="text-xs text-slate-600 font-bold">${title}</div>
            </div>

            <div class="grid grid-cols-3 gap-4 text-xs font-semibold border-b border-slate-200 pb-2">
              <div>ឈ្មោះ៖ .............................................</div>
              <div>ថ្នាក់៖ ....................</div>
              <div>លេខ៖ ....................</div>
            </div>

            <div class="text-xs text-slate-600 font-medium">បង្ហាញវិធីដោះស្រាយឱ្យបានច្បាស់លាស់ ហើយសរសេរឯកតា។</div>

            <!-- Ruled Lines per Problem (Screenshot 5) -->
            <div class="space-y-6 text-xs">
              ${['I', 'II', 'III', 'IV', 'V', 'VI'].map((num) => `
                <div class="space-y-2">
                  <div class="flex items-center justify-between font-bold">
                    <span>${num}. (៥ ពិន្ទុ)</span>
                    <span class="px-3 py-0.5 border border-slate-400 rounded text-[10px] font-mono">ពិន្ទុ _____ / 5</span>
                  </div>
                  <div class="space-y-3 pt-1">
                    <div class="border-b border-slate-300 h-5"></div>
                    <div class="border-b border-slate-300 h-5"></div>
                    <div class="border-b border-slate-300 h-5"></div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Signature Footer -->
            <div class="pt-8 flex justify-between items-center text-xs text-slate-600 border-t border-slate-200">
              <div>អត្តសញ្ញាណប័ណ្ណគ្រូ ៖ Puthy Khem</div>
              <div>ហត្ថលេខាគ្រូបង្រៀន ៖ .....................................</div>
            </div>
          </div>
        ` : ''}
      `;

      setTimeout(() => renderMath(sheet), 20);
    }

    function printExamPaper() {
      window.print();
    }

    function downloadExamWord() {
      const content = document.getElementById('official-exam-sheet')?.innerHTML || '';
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Exam Export</title><style>body{font-family:'Kantumruy Pro',Arial;}</style></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + content + footer;
      
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = 'KhmerMath_Exam_NGS.doc';
      fileDownload.click();
      document.body.removeChild(fileDownload);
    }

    // Initialize Pro features on DOM ready
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        setQBankGrade(7);
      }, 100);
    });
'''

# Inject pro_js_code right before </script>
html = html.replace('// --- 1. Global Grade Switcher ---', pro_js_code + '\n\n    // --- 1. Global Grade Switcher ---')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("index.html compiled with Pro Question Bank & Exam Studio.")
