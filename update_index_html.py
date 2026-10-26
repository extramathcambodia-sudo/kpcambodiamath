# -*- coding: utf-8 -*-
"""
Script to update index.html with complete integration of Grade 7, 8, and 10:
- Lesson summaries and formulas
- 498+ Question Bank with multi-grade filtering
- Chapter Tests & Monthly Tests suites
- Interactive Quiz Runner and Print/PDF Generator
- KaTeX math formula rendering
"""

html_content = '''<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KPCambodianmathematics - ប្រព័ន្ធប្រឡងគណិតវិទ្យា និងធនាគារសំណួរ (ថ្នាក់ទី ៧, ៨, ១០)</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Kantumruy Pro Font -->
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  
  <!-- KaTeX for beautiful Math Rendering -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <!-- External Math Data Store -->
  <script src="math_data.js"></script>

  <style>
    body {
      font-family: 'Kantumruy Pro', sans-serif;
      background-color: #f6f6f2;
      color: #1e293b;
    }
    .sidebar {
      background-color: #162040;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.85rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      color: #cbd5e1;
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .nav-item.active {
      background-color: #253b76;
      color: #ffffff;
      font-weight: 600;
      box-shadow: inset 3px 0 0 #60a5fa;
    }
    .card {
      background: #ffffff;
      border-radius: 0.875rem;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }
    .test-row {
      border-left: 4px solid #16a34a;
    }
    .test-row-monthly {
      border-left: 4px solid #2563eb;
    }
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    @media print {
      body * {
        visibility: hidden;
      }
      #print-modal-content, #print-modal-content * {
        visibility: visible;
      }
      #print-modal-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 20px;
        box-shadow: none;
        border: none;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body class="bg-[#f6f6f2] font-sans antialiased overflow-x-hidden min-h-screen">

  <!-- ================= DASHBOARD CONTAINER ================= -->
  <div id="app-dashboard" class="flex h-screen overflow-hidden">

  <!-- ================= SIDEBAR ================= -->
  <aside class="w-64 sidebar text-white flex flex-col justify-between shrink-0 select-none overflow-y-auto">
    <div>
      <!-- Logo -->
      <div class="p-4 flex items-center gap-3 border-b border-slate-700/60 cursor-pointer" onclick="goToLandingPage()">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl shadow-inner text-white">
          &Sigma;
        </div>
        <div>
          <div class="font-bold text-sm leading-tight tracking-wide">KPCambodianmathematics</div>
          <div class="text-[11px] text-blue-300 font-medium">ថ្នាក់ទី ៧, ៨, ១០ (២០២៧)</div>
        </div>
      </div>

      <!-- Navigation Sections -->
      <div class="p-3 space-y-5">
        <!-- ការបង្រៀន និងខ្លឹមសារ -->
        <div>
          <div class="text-[11px] font-semibold text-slate-400 px-3 mb-1.5 uppercase tracking-wider">ខ្លឹមសារ និងតេស្ត</div>
          <nav class="space-y-1">
            <div onclick="switchTab('lessons')" id="nav-lessons" class="nav-item">
              <span>📖</span> <span>ខ្លឹមសារមេរៀន</span>
            </div>
            <div onclick="switchTab('qbank')" id="nav-qbank" class="nav-item">
              <span>📚</span> <span>ធនាគារសំណួរ</span>
              <span id="qbank-sidebar-count" class="ml-auto text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-bold">498</span>
            </div>
            <div onclick="switchTab('tests')" id="nav-tests" class="nav-item active">
              <span>📄</span> <span>តេស្តតាមមេរៀន</span>
            </div>
            <div onclick="switchTab('monthly')" id="nav-monthly" class="nav-item">
              <span>📅</span> <span>តេស្តប្រចាំខែ</span>
            </div>
            <div onclick="switchTab('geometry')" id="nav-geometry" class="nav-item">
              <span>📐</span> <span>សំណង់ធរណីមាត្រ</span>
            </div>
          </nav>
        </div>

        <!-- ការគ្រប់គ្រងការប្រឡង -->
        <div>
          <div class="text-[11px] font-semibold text-slate-400 px-3 mb-1.5 uppercase tracking-wider">ការគ្រប់គ្រងការប្រឡង</div>
          <nav class="space-y-1">
            <div onclick="switchTab('schedule')" id="nav-schedule" class="nav-item">
              <span>⏱</span> <span>កំណត់ពេលប្រឡង</span>
            </div>
            <div onclick="switchTab('classes')" id="nav-classes" class="nav-item">
              <span>🏫</span> <span>ថ្នាក់ និងសិស្ស</span>
            </div>
            <div onclick="switchTab('grading')" id="nav-grading" class="nav-item">
              <span>☑️</span> <span>ដាក់ពិន្ទុ និងលទ្ធផល</span>
            </div>
          </nav>
        </div>

        <!-- សកម្មភាពក្នុងថ្នាក់ -->
        <div>
          <div class="text-[11px] font-semibold text-slate-400 px-3 mb-1.5 uppercase tracking-wider">សកម្មភាពក្នុងថ្នាក់</div>
          <nav class="space-y-1">
            <div onclick="switchTab('wheel')" id="nav-wheel" class="nav-item">
              <span>🎡</span> <span>កង់ចាប់ឈ្មោះ</span>
            </div>
            <div onclick="switchTab('group-games')" id="nav-group-games" class="nav-item">
              <span>🎮</span> <span>ហ្គេមក្រុម</span>
            </div>
            <div onclick="switchTab('live-quiz')" id="nav-live-quiz" class="nav-item">
              <span>📱</span> <span>ហ្គេមសំណួរផ្ទាល់</span>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- Footer Link -->
    <div onclick="goToLandingPage()" class="p-4 border-t border-slate-700/60 text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-2 transition-colors">
      <span>←</span> <span>ចេញទៅទំព័រដើម</span>
    </div>
  </aside>

  <!-- ================= MAIN CONTENT ================= -->
  <div class="flex-1 flex flex-col h-screen overflow-hidden">

    <!-- Top Header -->
    <header class="bg-white/90 backdrop-blur border-b border-gray-200 px-8 py-3.5 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-4">
        <div>
          <h1 id="page-title" class="text-xl font-bold text-slate-800">តេស្ត</h1>
          <div class="text-[11px] text-slate-500">ប្រព័ន្ធគណិតវិទ្យាកម្ពុជា • ថ្នាក់ទី ៧, ៨ និង ១០</div>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Global Grade Switcher -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button onclick="setGlobalGrade('all')" id="btn-grade-all" class="px-3 py-1 rounded-lg bg-white text-blue-600 shadow-sm transition">គ្រប់ថ្នាក់</button>
          <button onclick="setGlobalGrade(7)" id="btn-grade-7" class="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">ថ្នាក់ទី ៧</button>
          <button onclick="setGlobalGrade(8)" id="btn-grade-8" class="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">ថ្នាក់ទី ៨</button>
          <button onclick="setGlobalGrade(10)" id="btn-grade-10" class="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">ថ្នាក់ទី ១០</button>
        </div>

        <button onclick="openCreateTestModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition">
          <span>+</span> <span>បង្កើតតេស្ត</span>
        </button>

        <div class="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm cursor-pointer">
          <div class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">P</div>
          <span class="text-xs font-medium text-slate-700">Puthy Khem</span>
        </div>
      </div>
    </header>

    <!-- Scrollable Content Area -->
    <main class="flex-1 overflow-y-auto p-8 space-y-6">

      <!-- =========================================================
           1. ផ្ទាំង «ខ្លឹមសារមេរៀន» (Lesson Content & Formulas)
      ========================================================== -->
      <section id="view-lessons" class="space-y-5 max-w-6xl mx-auto hidden">
        <!-- Grade selection & search bar -->
        <div class="card p-5">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="font-bold text-base text-slate-800">📖 ខ្លឹមសារមេរៀន និងរូបមន្តគន្លឹះ</h2>
              <p class="text-xs text-slate-500 mt-0.5">ស្រង់ចេញពីសៀវភៅ Mathematics for grade 7, 8, 10 (2027)</p>
            </div>
            <div class="flex items-center gap-2">
              <input type="text" id="lesson-search" oninput="filterLessons()" placeholder="🔍 ស្វែងរកមេរៀន..." class="border border-gray-200 rounded-lg px-3.5 py-1.5 text-xs w-60 focus:outline-none focus:border-blue-500">
            </div>
          </div>

          <!-- Grade Pills -->
          <div class="flex gap-2 mt-4 pt-3 border-t">
            <button onclick="selectLessonGrade(7)" id="lesson-tab-7" class="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">ថ្នាក់ទី ៧ (២២ មេរៀន)</button>
            <button onclick="selectLessonGrade(8)" id="lesson-tab-8" class="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200">ថ្នាក់ទី ៨ (១៨ មេរៀន)</button>
            <button onclick="selectLessonGrade(10)" id="lesson-tab-10" class="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200">ថ្នាក់ទី ១០ (៩ ជំពូកធំ)</button>
          </div>
        </div>

        <!-- Lessons Split View: List on left, details on right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <!-- Lesson List -->
          <div class="lg:col-span-5 card p-4 space-y-2 max-h-[650px] overflow-y-auto" id="lesson-list-container">
            <!-- Populated via JS -->
          </div>

          <!-- Lesson Detail Viewer -->
          <div class="lg:col-span-7 card p-6 space-y-5" id="lesson-detail-container">
            <!-- Populated via JS -->
          </div>
        </div>
      </section>

      <!-- =========================================================
           2. ផ្ទាំង «ធនាគារសំណួរ» (Question Bank View)
      ========================================================== -->
      <section id="view-qbank" class="space-y-4 max-w-6xl mx-auto hidden">
        <!-- Question Bank Summary Banner -->
        <div class="card p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="font-bold text-base text-slate-800 flex items-center gap-2">
                <span>📚 ធនាគារសំណួររួម</span>
                <span id="qbank-total-badge" class="px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-bold">498 សំណួរ</span>
              </h2>
              <p class="text-xs text-slate-500 mt-1">រៀបចំតាមកម្រិតថ្នាក់ (៧, ៨, ១០) ជំពូក មេរៀន និងកម្រិតពិបាក ភ្ជាប់ជាមួយចម្លើយត្រឹមត្រូវ និងការពន្យល់។</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="exportQBankToPrint()" class="border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5">
                <span>📥</span> <span>បោះពុម្ពសំណួរដែលបានរើស</span>
              </button>
              <button onclick="openCreateTestModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">
                + បង្កើតតេស្តពីសំណួរទាំងនេះ
              </button>
            </div>
          </div>

          <!-- Grade Filter Badges -->
          <div class="flex flex-wrap gap-2 pt-1 border-t">
            <button onclick="filterQBankGrade('all')" id="qfilter-all" class="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white">ទាំងអស់ (<span id="count-all">0</span>)</button>
            <button onclick="filterQBankGrade(7)" id="qfilter-7" class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-slate-700 hover:bg-gray-200">ថ្នាក់ទី ៧ (<span id="count-7">0</span>)</button>
            <button onclick="filterQBankGrade(8)" id="qfilter-8" class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-slate-700 hover:bg-gray-200">ថ្នាក់ទី ៨ (<span id="count-8">0</span>)</button>
            <button onclick="filterQBankGrade(10)" id="qfilter-10" class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-slate-700 hover:bg-gray-200">ថ្នាក់ទី ១០ (<span id="count-10">0</span>)</button>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="card p-4 space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Chapter Filter -->
            <select id="qfilter-chapter" onchange="applyQBankFilters()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none">
              <option value="all">គ្រប់ជំពូក / មេរៀន</option>
            </select>

            <!-- Difficulty Filter -->
            <select id="qfilter-diff" onchange="applyQBankFilters()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none">
              <option value="all">គ្រប់កម្រិត</option>
              <option value="ងាយ">ងាយ (Easy)</option>
              <option value="មធ្យម">មធ្យម (Medium)</option>
              <option value="លំបាក">លំបាក (Challenging)</option>
            </select>

            <!-- Type Filter -->
            <select id="qfilter-type" onchange="applyQBankFilters()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none">
              <option value="all">គ្រប់ប្រភេទ</option>
              <option value="mcq">ពហុជ្រើសរើស (MCQ)</option>
              <option value="written">សរសេរ / ដោះស្រាយ</option>
            </select>

            <!-- Search input -->
            <input type="text" id="qfilter-search" oninput="applyQBankFilters()" placeholder="🔍 ស្វែងរកពាក្យ ឬរូបមន្ត..." class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-56 focus:outline-none focus:border-blue-500">
            
            <div class="ml-auto text-xs text-slate-400">
              បង្ហាញ <span id="qbank-showing-count" class="font-bold text-slate-700">0</span> សំណួរ
            </div>
          </div>
        </div>

        <!-- Question Cards List -->
        <div class="space-y-3" id="qbank-items-container">
          <!-- Populated dynamically via renderQBank() -->
        </div>
      </section>

      <!-- =========================================================
           3. ផ្ទាំង «តេស្តតាមមេរៀន» (Chapter Tests View)
      ========================================================== -->
      <section id="view-tests" class="space-y-4 max-w-6xl mx-auto">
        <div class="card p-5">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="font-bold text-base text-slate-800">📄 តេស្តតាមមេរៀន (Chapter Tests & Quizzes)</h2>
              <p class="text-xs text-slate-400">វិញ្ញាសាតេស្តរៀបចំតាមមេរៀននីមួយៗសម្រាប់វាស់ស្ទង់សមត្ថភាពសិស្ស</p>
            </div>
            <div class="flex items-center gap-2.5">
              <button onclick="openCreateTestModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition">
                + បង្កើតតេស្តថ្មី
              </button>
            </div>
          </div>

          <!-- Grade Pills Filter -->
          <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t">
            <button onclick="filterTestsGrade('all')" id="testfilter-all" class="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">គ្រប់ថ្នាក់</button>
            <button onclick="filterTestsGrade(7)" id="testfilter-7" class="px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200">ថ្នាក់ទី ៧</button>
            <button onclick="filterTestsGrade(8)" id="testfilter-8" class="px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200">ថ្នាក់ទី ៨</button>
            <button onclick="filterTestsGrade(10)" id="testfilter-10" class="px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200">ថ្នាក់ទី ១០</button>
          </div>
        </div>

        <!-- Test List Container -->
        <div class="space-y-3" id="test-list-container">
          <!-- Populated dynamically -->
        </div>
      </section>

      <!-- =========================================================
           4. ផ្ទាំង «តេស្តប្រចាំខែ» (Monthly Tests View)
      ========================================================== -->
      <section id="view-monthly" class="space-y-4 max-w-6xl mx-auto hidden">
        <div class="card p-5">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="font-bold text-base text-slate-800">📅 វិញ្ញាសាប្រឡងប្រចាំខែ (Monthly Exams Suite)</h2>
              <p class="text-xs text-slate-500 mt-1">វិញ្ញាសាប្រឡងស្តង់ដារ ក្រសួងអប់រំ យុវជន និងកីឡា / សាលារៀនជំនាន់ថ្មី (ពីខែវិច្ឆិកា ដល់ខែមិថុនា)</p>
            </div>
          </div>

          <!-- Filter Pills -->
          <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t">
            <button onclick="filterMonthlyGrade('all')" id="mfilter-all" class="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">គ្រប់ថ្នាក់</button>
            <button onclick="filterMonthlyGrade(7)" id="mfilter-7" class="px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200">ថ្នាក់ទី ៧</button>
            <button onclick="filterMonthlyGrade(8)" id="mfilter-8" class="px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200">ថ្នាក់ទី ៨</button>
            <button onclick="filterMonthlyGrade(10)" id="mfilter-10" class="px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200">ថ្នាក់ទី ១០</button>
          </div>
        </div>

        <!-- Monthly Tests List -->
        <div class="space-y-3" id="monthly-list-container">
          <!-- Populated dynamically -->
        </div>
      </section>

      <!-- =========================================================
           5. ផ្ទាំង «សំណង់ធរណីមាត្រ» (Geometric Studio)
      ========================================================== -->
      <section id="view-geometry" class="space-y-4 max-w-6xl mx-auto hidden">
        <div class="card p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="font-bold text-sm text-slate-800">📐 ផ្ទាំងសំណង់ធរណីមាត្រអន្តរកម្ម (Geometric Construction)</h2>
            <p class="text-xs text-slate-500">គូសចំណុច អង្កត់ រង្វង់ មេដ្យាទ័រ និងត្រីកោណសម័ង្ស</p>
          </div>
          <!-- Tool Buttons -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button onclick="setGeoTool('move')" id="gtool-move" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white">✋ ទាញចំណុច</button>
            <button onclick="setGeoTool('point')" id="gtool-point" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-slate-700 hover:bg-gray-200">📍 ចំណុច</button>
            <button onclick="setGeoTool('segment')" id="gtool-segment" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-slate-700 hover:bg-gray-200">📏 អង្កត់</button>
            <button onclick="setGeoTool('circle')" id="gtool-circle" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-slate-700 hover:bg-gray-200">⭕ រង្វង់</button>
            <button onclick="setGeoTool('bisector')" id="gtool-bisector" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-slate-700 hover:bg-gray-200">➗ មេដ្យាទ័រ</button>
            <button onclick="demoEquilateral()" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200">🔺 សង់ត្រីកោណសម័ង្ស</button>
            <button onclick="clearGeoCanvas()" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100">🗑 សម្អាត</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-3 card overflow-hidden relative bg-white" style="height: 480px;">
            <canvas id="geoCanvas" class="w-full h-full cursor-crosshair"></canvas>
            <div id="geo-hint" class="absolute bottom-3 left-3 bg-slate-800/80 text-white text-xs px-3 py-1.5 rounded-lg">
              ជ្រើសរើសឧបករណ៍ខាងលើ ឬចុចទាញចំណុចនៅលើផ្ទាំងគំនូរ
            </div>
          </div>
          <div class="card p-4 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-xs text-slate-700 border-b pb-2 mb-3">📊 រង្វាស់ និងលក្ខណៈធរណីមាត្រ</h3>
              <div id="geo-measurements" class="space-y-2 text-xs text-slate-600 max-h-80 overflow-y-auto"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================
           6. ផ្ទាំង «កំណត់ពេលប្រឡង» (Exam Scheduling)
      ========================================================== -->
      <section id="view-schedule" class="space-y-4 max-w-5xl mx-auto hidden">
        <div class="card p-5">
          <h2 class="font-bold text-sm text-slate-800">ការប្រឡងដែលបានកំណត់ពេល</h2>
          <div id="scheduled-list" class="space-y-2 mt-3"></div>
        </div>

        <div class="card p-6 space-y-4">
          <h3 class="font-bold text-sm text-slate-800">កំណត់ពេលប្រឡងថ្មី</h3>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">តេស្ត (ជ្រើសរើសពីធនាគារតេស្ត)</label>
            <select id="sched-test" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white"></select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ថ្នាក់</label>
            <select id="sched-class" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white">
              <option>ថ្នាក់ទី ៧A (35 នាក់)</option>
              <option>ថ្នាក់ទី ៨B (36 នាក់)</option>
              <option>ថ្នាក់ទី ១០A (32 នាក់)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">កាលបរិច្ឆេទប្រឡង</label>
            <input id="sched-date" type="date" value="2026-10-17" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs">
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">រយៈពេល (នាទី)</label>
              <input id="sched-duration" type="number" value="60" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">PIN សម្ងាត់សម្រាប់សិស្ស</label>
              <input id="sched-pin" type="text" value="9754" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold tracking-widest">
            </div>
          </div>
          <button onclick="saveSchedule()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm">
            រក្សាទុកការកំណត់ពេល
          </button>
        </div>
      </section>

      <!-- =========================================================
           7. ផ្ទាំង «កង់ចាប់ឈ្មោះ»
      ========================================================== -->
      <section id="view-wheel" class="max-w-6xl mx-auto hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 space-y-5">
            <div class="card p-6 flex flex-col items-center">
              <div class="relative flex items-center justify-center">
                <div class="absolute -top-2 z-10 text-2xl text-slate-900">▼</div>
                <canvas id="wheelCanvas" width="380" height="380" class="rounded-full shadow-md"></canvas>
                <button onclick="spinWheel()" class="absolute w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs border-4 border-white shadow-lg flex items-center justify-center">
                  បង្វិល
                </button>
              </div>
              <div id="winner-banner" class="mt-4 hidden px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-bold"></div>
            </div>
          </div>
          <div class="lg:col-span-5 space-y-5">
            <div class="card p-5 space-y-3">
              <div class="text-xs font-semibold text-slate-700">បញ្ជីសិស្ស (24 នាក់)</div>
              <div id="student-chips" class="flex flex-wrap gap-1.5 pt-1"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================
           8. ផ្ទាំង «ហ្គេមក្រុម» & «ហ្គេមផ្ទាល់»
      ========================================================== -->
      <section id="view-group-games" class="space-y-4 max-w-6xl mx-auto hidden">
        <div class="card p-5">
          <h2 class="font-bold text-sm text-slate-800">ហ្គេមក្រុមសម្រាប់ថ្នាក់រៀន</h2>
          <p class="text-xs text-slate-500 mt-1">លេងហ្គេមសំណួរគណិតវិទ្យាថ្នាក់ទី ៧, ៨ និង ១០៖ កាតបើក កង់វិល និងប្រណាំងទូកង។</p>
        </div>
      </section>

      <section id="view-live-quiz" class="space-y-4 max-w-6xl mx-auto hidden">
        <div class="card p-5">
          <h2 class="font-bold text-sm text-slate-800">📱 ហ្គេមសំណួរផ្ទាល់លើទូរស័ព្ទសិស្ស</h2>
          <p class="text-xs text-slate-500 mt-1">សិស្សម្នាក់ៗចូលលេងលើទូរស័ព្ទរបស់ខ្លួនដោយលេខកូដ ៦ ខ្ទង់។</p>
        </div>
      </section>

      <section id="view-classes" class="space-y-4 max-w-5xl mx-auto hidden">
        <div class="card p-6">
          <h2 class="font-bold text-base text-slate-800 mb-2">🏫 ថ្នាក់រៀន និងបញ្ជីសិស្ស</h2>
          <p class="text-xs text-slate-500">គ្រប់គ្រងថ្នាក់ទី ៧A, ៨B, ១០A ព្រមទាំងការតាមដានពិន្ទុសិស្ស។</p>
        </div>
      </section>

      <section id="view-grading" class="space-y-4 max-w-5xl mx-auto hidden">
        <div class="card p-6">
          <h2 class="font-bold text-base text-slate-800 mb-2">☑️ ដាក់ពិន្ទុ និងលទ្ធផលប្រឡង</h2>
          <p class="text-xs text-slate-500">ពិនិត្យមើលលទ្ធផលប្រឡងតាមសិស្សម្នាក់ៗ និងរបាយការណ៍ស្ថិតិ។</p>
        </div>
      </section>

    </main>
  </div>
  </div> <!-- End #app-dashboard -->

  <!-- ================= LANDING PAGE VIEW ================= -->
  <div id="app-landing" class="hidden min-h-screen w-full flex-col justify-between bg-[#f8f7f2] text-slate-800">
    <header class="w-full border-b border-stone-200/70 bg-[#f8f7f2]/90 backdrop-blur px-8 lg:px-16 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3 cursor-pointer" onclick="goToLandingPage()">
        <div class="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-blue-500/25">
          &Sigma;
        </div>
        <div>
          <div class="font-bold text-lg text-slate-900 leading-tight">KPCambodianmathematics</div>
          <div class="text-xs text-slate-400">ប្រព័ន្ធប្រឡង និងធនាគារសំណួរគណិតវិទ្យា</div>
        </div>
      </div>
      <div class="text-xs text-slate-500 font-medium">ថ្នាក់ទី ៧, ៨, ១០</div>
    </header>

    <main class="flex-1 max-w-6xl mx-auto w-full px-6 lg:px-12 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <div class="text-xs font-bold tracking-widest text-blue-600 uppercase">
          KPCAMBODIANMATHEMATICS / 2027
        </div>
        <h1 class="text-5xl lg:text-6xl font-black text-[#0f172a] leading-[1.2] tracking-tight">
          ប្រព័ន្ធប្រឡង<br>គណិតវិទ្យា
        </h1>
        <p class="text-base text-slate-600 max-w-md leading-relaxed font-normal">
          ធនាគារសំណួរ ៤៩៨+ សំណួរ, ខ្លឹមសារមេរៀន ៤៩ មេរៀន (ថ្នាក់ទី ៧, ៨, ១០), តេស្តតាមមេរៀន និងវិញ្ញាសាប្រឡងប្រចាំខែពេញលេញ។
        </p>
        <div class="flex items-center gap-3 pt-2">
          <span class="w-8 h-[2px] bg-amber-500 rounded-full inline-block"></span>
          <span class="text-xs text-slate-500">ការប្រឡងប្រចាំខែ · តេស្តតាមមេរៀន · បោះពុម្ពជា PDF</span>
        </div>
      </div>

      <div class="lg:col-span-5 space-y-4">
        <div class="text-xs font-semibold text-slate-400 px-1">ជ្រើសរើសចូលប្រើ</div>
        <div onclick="openStudentPortal()" class="group bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <h3 class="text-2xl font-bold text-slate-900 group-hover:text-blue-600">សិស្ស</h3>
          <p class="text-sm text-slate-600 mt-1 font-medium">ចូលធ្វើតេស្ត និងមើលលទ្ធផល</p>
        </div>
        <div onclick="goToDashboard()" class="group bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <h3 class="text-2xl font-bold text-slate-900 group-hover:text-blue-600">គ្រូបង្រៀន</h3>
          <p class="text-sm text-slate-600 mt-1 font-medium">គ្រប់គ្រងធនាគារសំណួរ មេរៀន និងចេញវិញ្ញាសា</p>
        </div>
      </div>
    </main>

    <footer class="w-full px-8 lg:px-16 py-4 flex items-center justify-between text-xs text-slate-400 border-t border-stone-200/50">
      <div>KPCambodianmathematics</div>
      <div>Mathematics for Grade 7, 8, 10 (2027)</div>
    </footer>
  </div>

  <!-- ================= MODAL: INTERACTIVE TEST RUNNER ================= -->
  <div id="test-runner-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
        <div>
          <h3 id="runner-title" class="font-bold text-base">ចូលធ្វើតេស្ត</h3>
          <div class="text-xs text-slate-300 flex items-center gap-3 mt-0.5">
            <span id="runner-meta">ថ្នាក់ទី ៧ • ៤៥ នាទី</span>
            <span>•</span>
            <span class="text-amber-400 font-bold" id="runner-timer">⏱ នៅសល់៖ 45:00</span>
          </div>
        </div>
        <button onclick="closeTestRunner()" class="text-slate-400 hover:text-white text-2xl font-bold">&times;</button>
      </div>

      <!-- Question Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6" id="runner-questions-container">
        <!-- Rendered dynamically -->
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div class="text-xs text-slate-500">
          សូមពិនិត្យចម្លើយឱ្យបានច្បាស់លាស់មុនពេលចុច «បញ្ជូនចម្លើយ»
        </div>
        <div class="flex gap-2">
          <button onclick="closeTestRunner()" class="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
            បោះបង់
          </button>
          <button onclick="submitTestAnswers()" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow">
            ✓ បញ្ជូនចម្លើយ និងមើលពិន្ទុ
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= MODAL: TEST PRINT / PDF PREVIEW ================= -->
  <div id="test-print-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
      <div class="px-6 py-3.5 bg-slate-100 border-b flex items-center justify-between no-print">
        <h3 class="font-bold text-sm text-slate-800">🖨 មើល និងបោះពុម្ពវិញ្ញាសា (Print / Save as PDF)</h3>
        <div class="flex items-center gap-2">
          <button onclick="window.print()" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
            <span>🖨</span> <span>បោះពុម្ពឥឡូវនេះ</span>
          </button>
          <button onclick="closePrintModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold px-2">&times;</button>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-8 text-slate-900 bg-white" id="print-modal-content">
        <!-- Printable sheet rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- ================= MODAL: SOLUTION VIEWER ================= -->
  <div id="solution-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
      <div class="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
        <h3 id="sol-modal-title" class="font-bold text-base">🔑 គន្លឹះ និងដំណោះស្រាយលម្អិត</h3>
        <button onclick="closeSolutionModal()" class="text-emerald-200 hover:text-white text-2xl font-bold">&times;</button>
      </div>
      <div class="flex-1 overflow-y-auto p-6 space-y-4 text-xs leading-relaxed text-slate-800" id="sol-modal-content">
        <!-- Content dynamically injected -->
      </div>
    </div>
  </div>

  <!-- ================= MODAL: CREATE TEST WIZARD ================= -->
  <div id="create-test-modal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-xl w-full shadow-2xl p-6 space-y-4">
      <div class="flex justify-between items-center pb-2 border-b">
        <h3 class="font-bold text-base text-slate-800">+ បង្កើតតេស្តថ្មីពីធនាគារសំណួរ</h3>
        <button onclick="closeCreateTestModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ចំណងជើងតេស្ត</label>
          <input type="text" id="ct-title" placeholder="ឧ. តេស្តគណិតវិទ្យាប្រចាំសប្តាហ៍..." class="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-blue-500">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">កម្រិតថ្នាក់</label>
            <select id="ct-grade" onchange="updateCreateTestChapters()" class="w-full px-3 py-2 border rounded-lg text-xs bg-white">
              <option value="7">ថ្នាក់ទី ៧</option>
              <option value="8">ថ្នាក់ទី ៨</option>
              <option value="10">ថ្នាក់ទី ១០</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">រយៈពេល (នាទី)</label>
            <input type="number" id="ct-duration" value="45" class="w-full px-3 py-2 border rounded-lg text-xs">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ជ្រើសរើសមេរៀន</label>
          <select id="ct-chapter" class="w-full px-3 py-2 border rounded-lg text-xs bg-white"></select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ចំនួនសំណួរពហុជ្រើសរើស (MCQ)</label>
            <input type="number" id="ct-mcq-count" value="10" min="1" max="20" class="w-full px-3 py-2 border rounded-lg text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ចំនួនសំណួរសរសេរ</label>
            <input type="number" id="ct-written-count" value="2" min="0" max="5" class="w-full px-3 py-2 border rounded-lg text-xs">
          </div>
        </div>
      </div>
      <div class="flex gap-2 pt-3 border-t">
        <button onclick="generateCustomTest()" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow">
          បង្កើតតេស្តភ្លាមៗ
        </button>
        <button onclick="closeCreateTestModal()" class="px-4 py-2.5 border rounded-lg text-xs text-slate-600 hover:bg-slate-50">
          បោះបង់
        </button>
      </div>
    </div>
  </div>

  <!-- Student Login Modal -->
  <div id="student-modal" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
      <div class="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 class="font-bold text-lg text-slate-800">ចូលប្រឡងសម្រាប់សិស្ស</h3>
        <button onclick="closeStudentModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1.5">ឈ្មោះ ឬ អត្តលេខសិស្ស</label>
        <input type="text" id="student-id-input" placeholder="ឧទាហរណ៍៖ វ៉ាន់ ពិសិដ្ឋ" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1.5">ជ្រើសរើសវិញ្ញាសាប្រឡង</label>
        <select id="student-test-select" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-500"></select>
      </div>
      <div class="flex gap-2 pt-2">
        <button onclick="startStudentExam()" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow">
          ចូលធ្វើតេស្ត
        </button>
        <button onclick="closeStudentModal()" class="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-sm">
          បោះបង់
        </button>
      </div>
    </div>
  </div>

  <!-- ================= JAVASCRIPT APP LOGIC ================= -->
  <script>
    // Global State
    let currentGrade = 'all';
    let currentLessonGrade = 7;
    let currentSelectedLesson = null;
    let qbankFiltered = [];
    let activeTest = null;
    let timerInterval = null;
    let userAnswers = {};

    const studentsList = [
      "ខាន់ សុវណ្ណមេធា", "ខុម សុផារិទ្ធ", "ឆេង ម៉ារ៉ាឌ្ឍី", "គន្ធ ប៉ហួរ", "ជិន សុខពិសី", "ងួន បូរិណ្ណ",
      "ងួន សិលា", "ចិន្តា បញ្ញាយុត្ត", "ឆាយ វីរៈ", "ជា សីហរតនៈវិសាល", "ជា សុខវឌ្ឍនា", "ជ័យ ច័ន្ទព៌មាន",
      "ឈាន មុន្នីរ័ត្ន", "ឈាង សុគន្ធដាលីន", "ឈុន ដារ៉ានី", "ញ៉ុល កាឡឺលីណា", "ដាវិន ណាវីហ្សា", "តូ សិរីលី",
      "ថន ណាវីហ្សា", "នាង សុខាវត្តី", "នួន ស៊ានសុខឃាង", "បូរ៉ា ឯករាជ", "ប៊ុនណា វឌ្ឍន៍ស៊ីលីកា", "ផន កែវឡៅ"
    ];

    // Helper: Trigger KaTeX math rendering
    function triggerMath() {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
      }
    }

    // --- 1. Global Grade Switcher ---
    function setGlobalGrade(g) {
      currentGrade = g;
      ['all', '7', '8', '10'].forEach(id => {
        const btn = document.getElementById('btn-grade-' + id);
        if (btn) {
          if (String(g) === id) {
            btn.className = "px-3 py-1 rounded-lg bg-white text-blue-600 shadow-sm transition";
          } else {
            btn.className = "px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition";
          }
        }
      });

      // Filter all active views
      if (g !== 'all') {
        selectLessonGrade(Number(g));
      }
      filterQBankGrade(g);
      filterTestsGrade(g);
      filterMonthlyGrade(g);
    }

    // --- 2. Tab Navigation ---
    const tabTitles = {
      'lessons': 'ខ្លឹមសារមេរៀន និងរូបមន្តគន្លឹះ',
      'qbank': 'ធនាគារសំណួរ',
      'tests': 'តេស្តតាមមេរៀន',
      'monthly': 'វិញ្ញាសាប្រឡងប្រចាំខែ',
      'geometry': 'សំណង់ធរណីមាត្រ',
      'schedule': 'កំណត់ពេលប្រឡង',
      'classes': 'ថ្នាក់ និងសិស្ស',
      'grading': 'ដាក់ពិន្ទុ និងលទ្ធផល',
      'wheel': 'កង់ចាប់ឈ្មោះ',
      'group-games': 'ហ្គេមក្រុម',
      'live-quiz': 'ហ្គេមសំណួរផ្ទាល់'
    };

    function switchTab(tabId) {
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      const activeNav = document.getElementById('nav-' + tabId);
      if (activeNav) activeNav.classList.add('active');

      document.getElementById('page-title').innerText = tabTitles[tabId] || 'ផ្ទាំងគ្រប់គ្រង';

      const views = ['lessons', 'qbank', 'tests', 'monthly', 'geometry', 'schedule', 'classes', 'grading', 'wheel', 'group-games', 'live-quiz'];
      views.forEach(v => {
        const el = document.getElementById('view-' + v);
        if (el) el.classList.add('hidden');
      });

      const target = document.getElementById('view-' + tabId);
      if (target) target.classList.remove('hidden');

      if (tabId === 'geometry') resizeGeoCanvas();
      if (tabId === 'wheel') drawWheel();

      setTimeout(triggerMath, 100);
    }

    // --- 3. LESSONS SECTION LOGIC ---
    function selectLessonGrade(g) {
      currentLessonGrade = g;
      [7, 8, 10].forEach(grade => {
        const tab = document.getElementById('lesson-tab-' + grade);
        if (tab) {
          if (grade === g) {
            tab.className = "px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm";
          } else {
            tab.className = "px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200";
          }
        }
      });
      renderLessonList();
    }

    function renderLessonList() {
      const container = document.getElementById('lesson-list-container');
      const lessons = (window.MATH_DATA && window.MATH_DATA.lessons[String(currentLessonGrade)]) || [];
      const query = (document.getElementById('lesson-search')?.value || '').toLowerCase().trim();

      const filtered = lessons.filter(l => l.title.toLowerCase().includes(query) || l.summary.toLowerCase().includes(query));

      if (filtered.length === 0) {
        container.innerHTML = '<div class="text-xs text-slate-400 p-4 text-center">មិនមានមេរៀនដែលត្រូវនឹងការស្វែងរក</div>';
        return;
      }

      container.innerHTML = filtered.map((l, idx) => `
        <div onclick="showLessonDetail('${l.id}')" id="litem-${l.id}" class="p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 transition ${idx === 0 ? 'bg-blue-50/60 border-blue-400' : 'bg-white'}">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800">មេរៀនទី ${l.num} ៖ ${l.title}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">${l.category}</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">${l.summary}</p>
        </div>
      `).join('');

      if (filtered.length > 0) {
        showLessonDetail(filtered[0].id);
      }
    }

    function filterLessons() {
      renderLessonList();
    }

    function showLessonDetail(lessonId) {
      document.querySelectorAll('#lesson-list-container > div').forEach(el => el.classList.remove('bg-blue-50/60', 'border-blue-400'));
      const activeItem = document.getElementById('litem-' + lessonId);
      if (activeItem) activeItem.classList.add('bg-blue-50/60', 'border-blue-400');

      const lessons = window.MATH_DATA.lessons[String(currentLessonGrade)] || [];
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return;

      currentSelectedLesson = lesson;
      const container = document.getElementById('lesson-detail-container');

      container.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div>
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wide">ថ្នាក់ទី ${currentLessonGrade} • ${lesson.category}</span>
            <h2 class="text-xl font-bold text-slate-900 mt-0.5">មេរៀនទី ${lesson.num} ៖ ${lesson.title}</h2>
          </div>
          <div class="flex gap-2">
            <button onclick="findQuestionsForLesson('${lesson.title}')" class="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition">
              🎯 សំណួរលើមេរៀននេះ
            </button>
            <button onclick="createTestFromCurrentLesson('${lesson.title}')" class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition">
              + បង្កើតតេស្ត
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Summary Box -->
          <div class="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <h4 class="font-bold text-xs text-amber-900 mb-1 flex items-center gap-1.5">
              <span>💡</span> <span>សង្ខេបទ្រឹស្តី និងនិយមន័យគ្រឹះ</span>
            </h4>
            <p class="text-xs text-slate-700 leading-relaxed">${lesson.summary}</p>
          </div>

          <!-- Formulas Box -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 class="font-bold text-xs text-blue-900 mb-2 flex items-center gap-1.5">
              <span>📐</span> <span>រូបមន្ត និងលក្ខណៈគន្លឹះដែលត្រូវចងចាំ</span>
            </h4>
            <pre class="text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">${lesson.formulas}</pre>
          </div>

          <!-- Worked Example Box -->
          <div class="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <h4 class="font-bold text-xs text-emerald-900 mb-1 flex items-center gap-1.5">
              <span>✍️</span> <span>ឧទាហរណ៍អនុវត្តគំរូ</span>
            </h4>
            <div class="text-xs text-slate-800 leading-relaxed">${lesson.examples}</div>
          </div>
        </div>
      `;

      triggerMath();
    }

    function findQuestionsForLesson(lessonTitle) {
      switchTab('qbank');
      document.getElementById('qfilter-search').value = lessonTitle.slice(0, 8);
      applyQBankFilters();
    }

    function createTestFromCurrentLesson(lessonTitle) {
      openCreateTestModal();
      document.getElementById('ct-grade').value = currentLessonGrade;
      updateCreateTestChapters();
      document.getElementById('ct-title').value = `តេស្តសមត្ថភាព ៖ ${lessonTitle}`;
    }

    // --- 4. QUESTION BANK LOGIC ---
    function initQBank() {
      const qb = (window.MATH_DATA && window.MATH_DATA.questionBank) || [];
      document.getElementById('count-all').innerText = qb.length;
      document.getElementById('count-7').innerText = qb.filter(q => q.grade === 7).length;
      document.getElementById('count-8').innerText = qb.filter(q => q.grade === 8).length;
      document.getElementById('count-10').innerText = qb.filter(q => q.grade === 10).length;
      document.getElementById('qbank-sidebar-count').innerText = qb.length;
      document.getElementById('qbank-total-badge').innerText = qb.length + " សំណួរ";

      populateChapterFilter();
      applyQBankFilters();
    }

    function populateChapterFilter() {
      const select = document.getElementById('qfilter-chapter');
      const qb = window.MATH_DATA.questionBank || [];
      let chapters = [...new Set(qb.filter(q => currentGrade === 'all' || q.grade === Number(currentGrade)).map(q => q.chapter))];
      chapters.sort();

      select.innerHTML = '<option value="all">គ្រប់ជំពូក / មេរៀន</option>' + chapters.map(ch => `<option value="${ch}">${ch}</option>`).join('');
    }

    function filterQBankGrade(g) {
      currentGrade = g;
      ['all', '7', '8', '10'].forEach(id => {
        const btn = document.getElementById('qfilter-' + id);
        if (btn) {
          if (String(g) === id) {
            btn.className = "px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white";
          } else {
            btn.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-slate-700 hover:bg-gray-200";
          }
        }
      });
      populateChapterFilter();
      applyQBankFilters();
    }

    function applyQBankFilters() {
      const qb = (window.MATH_DATA && window.MATH_DATA.questionBank) || [];
      const ch = document.getElementById('qfilter-chapter').value;
      const diff = document.getElementById('qfilter-diff').value;
      const type = document.getElementById('qfilter-type').value;
      const search = (document.getElementById('qfilter-search').value || '').toLowerCase().trim();

      qbankFiltered = qb.filter(q => {
        if (currentGrade !== 'all' && q.grade !== Number(currentGrade)) return false;
        if (ch !== 'all' && q.chapter !== ch) return false;
        if (diff !== 'all' && q.difficulty !== diff) return false;
        if (type !== 'all' && q.type !== type) return false;
        if (search) {
          const matchQ = q.question.toLowerCase().includes(search);
          const matchCh = q.chapter.toLowerCase().includes(search);
          if (!matchQ && !matchCh) return false;
        }
        return true;
      });

      document.getElementById('qbank-showing-count').innerText = qbankFiltered.length;
      renderQBank();
    }

    function renderQBank() {
      const container = document.getElementById('qbank-items-container');
      if (qbankFiltered.length === 0) {
        container.innerHTML = '<div class="card p-8 text-center text-xs text-slate-400">ពុំមានសំណួរដែលត្រូវនឹងតម្រងស្វែងរកនេះឡើយ។</div>';
        return;
      }

      // Display up to 50 at once for smooth rendering
      const toShow = qbankFiltered.slice(0, 60);

      container.innerHTML = toShow.map(q => `
        <div class="card p-4 hover:shadow-md transition space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 shrink-0 mt-0.5">ថ្នាក់ទី ${q.grade}</span>
              <div>
                <p class="text-xs font-semibold text-slate-800 leading-relaxed">${q.question}</p>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">${q.chapter}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] ${q.difficulty === 'ងាយ' ? 'bg-emerald-50 text-emerald-700' : (q.difficulty === 'មធ្យម' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700')}">${q.difficulty}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700">${q.category}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-slate-600 font-bold">${q.points} ពិន្ទុ</span>
                </div>
              </div>
            </div>
            <button onclick="toggleAnswer('${q.id}')" class="px-3 py-1 text-xs border border-gray-200 hover:bg-gray-50 rounded-lg text-slate-600 shrink-0 font-medium">
              👁 ចម្លើយ
            </button>
          </div>

          ${q.options && q.options.length > 0 ? `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
              ${q.options.map(opt => `
                <div class="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-white font-bold text-[11px] text-slate-700 flex items-center justify-center border shadow-xs">${opt.key}</span>
                  <span class="truncate">${opt.text}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Hidden Answer Box -->
          <div id="ans-${q.id}" class="hidden p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div class="font-bold flex items-center gap-1.5">
              <span>✓ ចម្លើយត្រឹមត្រូវ៖ ជម្រើស (${q.answer})</span>
            </div>
            <div class="text-[11px] text-emerald-800">${q.explanation || ''}</div>
          </div>
        </div>
      `).join('');

      triggerMath();
    }

    function toggleAnswer(qid) {
      const el = document.getElementById('ans-' + qid);
      if (el) el.classList.toggle('hidden');
      triggerMath();
    }

    // --- 5. TESTS SECTION LOGIC ---
    function renderTests() {
      const container = document.getElementById('test-list-container');
      const tests = (window.MATH_DATA && window.MATH_DATA.chapterTests) || [];

      const filtered = tests.filter(t => currentGrade === 'all' || t.grade === Number(currentGrade));

      container.innerHTML = filtered.map(t => `
        <div class="card p-4 test-row flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-lg">
              📄
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">ថ្នាក់ទី ${t.grade}</span>
                <h3 class="font-bold text-xs text-slate-800">${t.title}</h3>
              </div>
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span class="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-medium">• រួចរាល់</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-slate-600">${t.mcqCount} ពហុជ្រើសរើស</span>
                ${t.writtenCount > 0 ? `<span class="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-slate-600">✏️ ${t.writtenCount} សរសេរ</span>` : ''}
                <span class="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-slate-700 font-semibold">${t.points} ពិន្ទុ</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-medium">⏱ ${t.duration} នាទី</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="launchInteractiveTest('${t.id}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm">
              ★ ចូលធ្វើតេស្ត
            </button>
            <button onclick="openPrintTest('${t.id}')" class="p-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 text-slate-700" title="បោះពុម្ពវិញ្ញាសា">
              🖨 បោះពុម្ព
            </button>
          </div>
        </div>
      `).join('');
    }

    function filterTestsGrade(g) {
      currentGrade = g;
      ['all', '7', '8', '10'].forEach(id => {
        const btn = document.getElementById('testfilter-' + id);
        if (btn) {
          if (String(g) === id) {
            btn.className = "px-3.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white";
          } else {
            btn.className = "px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200";
          }
        }
      });
      renderTests();
    }

    // --- 6. MONTHLY TESTS LOGIC ---
    function renderMonthlyTests() {
      const container = document.getElementById('monthly-list-container');
      const tests = (window.MATH_DATA && window.MATH_DATA.monthlyTests) || [];

      const filtered = tests.filter(t => currentGrade === 'all' || t.grade === Number(currentGrade));

      container.innerHTML = filtered.map(t => `
        <div class="card p-5 test-row-monthly flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-xl">
              📅
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">ថ្នាក់ទី ${t.grade}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">ខែ ${t.month}</span>
                <h3 class="font-bold text-sm text-slate-800">${t.title}</h3>
              </div>
              <p class="text-xs text-slate-500 mt-1">ខ្លឹមសាររួមមាន៖ ${t.lessonsCovered}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">⏱ រយៈពេល៖ ${t.duration} នាទី</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold">★ ពិន្ទុសរុប៖ ${t.totalPoints} ពិន្ទុ</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-700 font-medium">៣ ផ្នែកពេញលេញ</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="openPrintMonthly('${t.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5">
              <span>🖨</span> <span>មើល និងបោះពុម្ព</span>
            </button>
            <button onclick="viewMonthlySolution('${t.id}')" class="px-3.5 py-2 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold">
              🔑 ដំណោះស្រាយ
            </button>
          </div>
        </div>
      `).join('');
    }

    function filterMonthlyGrade(g) {
      currentGrade = g;
      ['all', '7', '8', '10'].forEach(id => {
        const btn = document.getElementById('mfilter-' + id);
        if (btn) {
          if (String(g) === id) {
            btn.className = "px-3.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white";
          } else {
            btn.className = "px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-slate-600 hover:bg-gray-200";
          }
        }
      });
      renderMonthlyTests();
    }

    // --- 7. INTERACTIVE TEST RUNNER ---
    function launchInteractiveTest(testId) {
      const tests = window.MATH_DATA.chapterTests || [];
      const test = tests.find(t => t.id === testId);
      if (!test) return;

      activeTest = test;
      userAnswers = {};

      document.getElementById('runner-title').innerText = test.title;
      document.getElementById('runner-meta').innerText = `ថ្នាក់ទី ${test.grade} • រយៈពេល ${test.duration} នាទី • ${test.points} ពិន្ទុ`;

      // Get questions for this chapter
      const qb = window.MATH_DATA.questionBank.filter(q => q.grade === test.grade && q.chapter.includes(test.chapter.slice(0, 10)) && q.type === 'mcq');
      const questionsToUse = (qb.length >= test.mcqCount ? qb.slice(0, test.mcqCount) : window.MATH_DATA.questionBank.filter(q => q.grade === test.grade && q.type === 'mcq').slice(0, test.mcqCount));

      activeTest.questions = questionsToUse;

      const container = document.getElementById('runner-questions-container');
      container.innerHTML = questionsToUse.map((q, idx) => `
        <div class="card p-5 space-y-3">
          <div class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">${idx + 1}</span>
            <div class="text-xs font-semibold text-slate-800 leading-relaxed">${q.question}</div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            ${q.options.map(opt => `
              <label class="p-3 rounded-xl border border-gray-200 flex items-center gap-3 text-xs cursor-pointer hover:bg-slate-50 transition">
                <input type="radio" name="q_${q.id}" value="${opt.key}" onchange="recordAnswer('${q.id}', '${opt.key}')" class="text-blue-600">
                <span class="font-bold text-slate-600">${opt.key}.</span>
                <span class="text-slate-800">${opt.text}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `).join('');

      // Start countdown
      let secondsLeft = test.duration * 60;
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        secondsLeft--;
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        document.getElementById('runner-timer').innerText = `⏱ នៅសល់៖ ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        if (secondsLeft <= 0) {
          clearInterval(timerInterval);
          alert('⏰ ដល់ពេលកំណត់! ប្រព័ន្ធនឹងបញ្ជូនចម្លើយដោយស្វ័យប្រវត្តិ។');
          submitTestAnswers();
        }
      }, 1000);

      document.getElementById('test-runner-modal').classList.remove('hidden');
      triggerMath();
    }

    function recordAnswer(qid, key) {
      userAnswers[qid] = key;
    }

    function closeTestRunner() {
      clearInterval(timerInterval);
      document.getElementById('test-runner-modal').classList.add('hidden');
    }

    function submitTestAnswers() {
      clearInterval(timerInterval);
      if (!activeTest || !activeTest.questions) return;

      let correctCount = 0;
      const total = activeTest.questions.length;

      activeTest.questions.forEach(q => {
        if (userAnswers[q.id] === q.answer) {
          correctCount++;
        }
      });

      const scorePercent = Math.round((correctCount / total) * 100);
      const totalPoints = activeTest.points;
      const earnedPoints = Math.round((correctCount / total) * totalPoints);

      alert(`🎉 លទ្ធផលប្រឡងរបស់អ្នក៖\n\n- ចម្លើយត្រឹមត្រូវ៖ ${correctCount} / ${total}\n- ពិន្ទុទទួលបាន៖ ${earnedPoints} / ${totalPoints} (${scorePercent}%)\n- ការវាយតម្លៃ៖ ${scorePercent >= 80 ? 'ល្អប្រសើរ 🌟' : (scorePercent >= 50 ? 'មធ្យម 👍' : 'ត្រូវខិតខំបន្ថែម 📚')}`);

      closeTestRunner();
    }

    // --- 8. PRINT EXAM PAPER ---
    function openPrintMonthly(testId) {
      const tests = window.MATH_DATA.monthlyTests || [];
      const test = tests.find(t => t.id === testId);
      if (!test) return;

      const content = document.getElementById('print-modal-content');
      content.innerHTML = `
        <div class="space-y-6">
          <!-- Header Standard MoEYS -->
          <div class="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div class="text-center font-bold text-xs space-y-1">
              <div>ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div class="pt-1 text-[11px] text-slate-600">សាលារៀនជំនាន់ថ្មី / KPCambodianmathematics</div>
            </div>
            <div class="text-right text-xs space-y-1">
              <div class="font-bold text-sm text-blue-900">វិញ្ញាសាប្រឡងគណិតវិទ្យា</div>
              <div class="font-semibold text-slate-700">ថ្នាក់ទី ${test.grade} • ${test.month}</div>
              <div class="text-slate-500">រយៈពេល ៖ ${test.duration} នាទី • ពិន្ទុសរុប ៖ ${test.totalPoints} ពិន្ទុ</div>
            </div>
          </div>

          <!-- Student Info line -->
          <div class="grid grid-cols-3 gap-4 text-xs font-semibold py-2 border-b border-dashed border-slate-300">
            <div>ឈ្មោះសិស្ស៖ ...........................................</div>
            <div>ថ្នាក់៖ .................................</div>
            <div>កាលបរិច្ឆេទ៖ ....../....../2026</div>
          </div>

          <!-- Exam Sections -->
          <div class="space-y-6 pt-2">
            ${test.sections.map((sec, idx) => `
              <div class="space-y-3">
                <h4 class="font-bold text-xs bg-slate-100 p-2 rounded text-slate-900">${sec.title}</h4>
                <div class="space-y-3 pl-2">
                  ${sec.questions.map(q => `
                    <div class="text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">${q}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="pt-8 text-center text-xs text-slate-400 border-t">
            --- សូមជូនពរឱ្យទទួលបានជោគជ័យ និងនិទ្ទេសល្អ ---
          </div>
        </div>
      `;

      document.getElementById('test-print-modal').classList.remove('hidden');
      triggerMath();
    }

    function openPrintTest(testId) {
      const tests = window.MATH_DATA.chapterTests || [];
      const test = tests.find(t => t.id === testId);
      if (!test) return;

      // Extract questions from question bank
      const qb = window.MATH_DATA.questionBank.filter(q => q.grade === test.grade && q.chapter.includes(test.chapter.slice(0, 10)) && q.type === 'mcq');
      const questionsToUse = (qb.length >= test.mcqCount ? qb.slice(0, test.mcqCount) : window.MATH_DATA.questionBank.filter(q => q.grade === test.grade).slice(0, test.mcqCount));

      const content = document.getElementById('print-modal-content');
      content.innerHTML = `
        <div class="space-y-6">
          <div class="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div class="text-center font-bold text-xs space-y-1">
              <div>ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div class="pt-1 text-[11px] text-slate-600">សាលារៀនជំនាន់ថ្មី</div>
            </div>
            <div class="text-right text-xs space-y-1">
              <div class="font-bold text-sm text-blue-900">${test.title}</div>
              <div class="font-semibold text-slate-700">ថ្នាក់ទី ${test.grade} • ${test.chapter}</div>
              <div class="text-slate-500">រយៈពេល ៖ ${test.duration} នាទី • ពិន្ទុសរុប ៖ ${test.points} ពិន្ទុ</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-xs font-semibold py-2 border-b border-dashed border-slate-300">
            <div>ឈ្មោះសិស្ស៖ ...........................................</div>
            <div>ថ្នាក់៖ .................................</div>
            <div>កាលបរិច្ឆេទ៖ ....../....../2026</div>
          </div>

          <div class="space-y-5 pt-2">
            <h4 class="font-bold text-xs bg-slate-100 p-2 rounded">ផ្នែកពហុជ្រើសរើស (MCQ) — ចូរគូសរង្វង់លើជម្រើសដែលត្រឹមត្រូវតែមួយគត់</h4>
            <div class="grid grid-cols-1 gap-4">
              ${questionsToUse.map((q, idx) => `
                <div class="text-xs space-y-1.5 pb-2 border-b border-slate-100">
                  <div class="font-bold">${idx + 1}. ${q.question}</div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pl-4">
                    ${q.options.map(opt => `
                      <div><b>${opt.key}.</b> ${opt.text}</div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.getElementById('test-print-modal').classList.remove('hidden');
      triggerMath();
    }

    function exportQBankToPrint() {
      if (qbankFiltered.length === 0) return;
      const toPrint = qbankFiltered.slice(0, 30);
      const content = document.getElementById('print-modal-content');
      content.innerHTML = `
        <div class="space-y-6">
          <div class="text-center font-bold text-base text-slate-900 border-b pb-3">
            កម្រងលំហាត់ និងសំណួរគណិតវិទ្យា (KPCambodianmathematics)
          </div>
          <div class="space-y-4">
            ${toPrint.map((q, idx) => `
              <div class="text-xs space-y-1.5 pb-3 border-b">
                <div class="font-bold">${idx + 1}. [ថ្នាក់ទី ${q.grade} - ${q.chapter}] ${q.question} (${q.points} ពិន្ទុ)</div>
                ${q.options && q.options.length > 0 ? `
                  <div class="grid grid-cols-4 gap-2 pl-4">
                    ${q.options.map(o => `<div><b>${o.key}.</b> ${o.text}</div>`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
      document.getElementById('test-print-modal').classList.remove('hidden');
      triggerMath();
    }

    function closePrintModal() {
      document.getElementById('test-print-modal').classList.add('hidden');
    }

    // --- 9. VIEW MONTHLY SOLUTIONS ---
    function viewMonthlySolution(testId) {
      const tests = window.MATH_DATA.monthlyTests || [];
      const test = tests.find(t => t.id === testId);
      if (!test) return;

      document.getElementById('sol-modal-title').innerText = `🔑 ដំណោះស្រាយ ៖ ${test.title}`;
      document.getElementById('sol-modal-content').innerHTML = `
        <div class="p-4 rounded-xl bg-slate-50 border font-mono whitespace-pre-wrap leading-relaxed">
          ${test.solutions}
        </div>
      `;
      document.getElementById('solution-modal').classList.remove('hidden');
      triggerMath();
    }

    function closeSolutionModal() {
      document.getElementById('solution-modal').classList.add('hidden');
    }

    // --- 10. CREATE TEST MODAL & GENERATOR ---
    function openCreateTestModal() {
      updateCreateTestChapters();
      document.getElementById('create-test-modal').classList.remove('hidden');
    }

    function closeCreateTestModal() {
      document.getElementById('create-test-modal').classList.add('hidden');
    }

    function updateCreateTestChapters() {
      const grade = document.getElementById('ct-grade').value;
      const select = document.getElementById('ct-chapter');
      const lessons = (window.MATH_DATA && window.MATH_DATA.lessons[grade]) || [];

      select.innerHTML = '<option value="all">គ្រប់មេរៀនទាំងអស់</option>' + lessons.map(l => `<option value="${l.title}">មេរៀនទី ${l.num} ៖ ${l.title}</option>`).join('');
    }

    function generateCustomTest() {
      const title = document.getElementById('ct-title').value.trim() || 'តេស្តគណិតវិទ្យាថ្មី';
      const grade = Number(document.getElementById('ct-grade').value);
      const duration = Number(document.getElementById('ct-duration').value) || 45;
      const chapter = document.getElementById('ct-chapter').value;
      const mcqCount = Number(document.getElementById('ct-mcq-count').value) || 10;
      const writtenCount = Number(document.getElementById('ct-written-count').value) || 2;

      const newTest = {
        id: "ct_custom_" + Date.now(),
        grade: grade,
        title: title,
        chapter: chapter === 'all' ? `មេរៀនចម្រុះថ្នាក់ទី ${grade}` : chapter,
        duration: duration,
        points: mcqCount * 2 + writtenCount * 5,
        mcqCount: mcqCount,
        writtenCount: writtenCount,
        desc: `តេស្តបង្កើតដោយលោកគ្រូ Puthy Khem លើកម្រិតថ្នាក់ទី ${grade}។`
      };

      window.MATH_DATA.chapterTests.unshift(newTest);
      renderTests();
      closeCreateTestModal();
      switchTab('tests');
      alert(`✓ បានបង្កើត «${title}» ដោយជោគជ័យ!`);
    }

    // --- 11. SCHEDULE EXAMS ---
    function populateScheduleDropdown() {
      const select = document.getElementById('sched-test');
      const tests = [...(window.MATH_DATA.chapterTests || []), ...(window.MATH_DATA.monthlyTests || [])];
      select.innerHTML = tests.map(t => `<option value="${t.title}">[ថ្នាក់ទី ${t.grade}] ${t.title}</option>`).join('');
    }

    function saveSchedule() {
      const testName = document.getElementById('sched-test').value;
      const className = document.getElementById('sched-class').value;
      const date = document.getElementById('sched-date').value;
      const pin = document.getElementById('sched-pin').value;

      const list = document.getElementById('scheduled-list');
      list.innerHTML += `
        <div class="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
          <div>
            <span class="font-bold text-blue-900">${testName}</span> • <span>${className}</span> • <span>📅 ${date}</span>
          </div>
          <span class="px-2.5 py-1 bg-blue-600 text-white rounded font-bold">PIN: ${pin}</span>
        </div>
      `;
      alert('✓ បានកំណត់ពេលប្រឡងជោគជ័យ!');
    }

    // --- 12. STUDENT MODAL ---
    function openStudentPortal() {
      const select = document.getElementById('student-test-select');
      const tests = [...(window.MATH_DATA.chapterTests || []), ...(window.MATH_DATA.monthlyTests || [])];
      select.innerHTML = tests.map(t => `<option value="${t.id}">[ថ្នាក់ទី ${t.grade}] ${t.title} (${t.duration} នាទី)</option>`).join('');
      document.getElementById('student-modal').classList.remove('hidden');
    }

    function closeStudentModal() {
      document.getElementById('student-modal').classList.add('hidden');
    }

    function startStudentExam() {
      const name = document.getElementById('student-id-input').value.trim() || 'សិស្សទូទៅ';
      const testId = document.getElementById('student-test-select').value;
      closeStudentModal();
      goToDashboard();
      launchInteractiveTest(testId);
    }

    // --- 13. WHEEL OF NAMES ---
    let wheelAngle = 0;
    const wheelColors = ['#e11d48', '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#ea580c', '#4f46e5'];

    function renderStudentChips() {
      const container = document.getElementById('student-chips');
      container.innerHTML = studentsList.map(s => `
        <span class="px-2.5 py-1 rounded-full text-[11px] bg-blue-50 text-blue-700 border border-blue-200 font-medium cursor-pointer hover:bg-blue-100">${s}</span>
      `).join('');
    }

    function drawWheel() {
      const canvas = document.getElementById('wheelCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = cx - 10;
      const sliceAngle = (2 * Math.PI) / studentsList.length;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      studentsList.forEach((name, i) => {
        const start = wheelAngle + i * sliceAngle;
        const end = start + sliceAngle;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = wheelColors[i % wheelColors.length];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 11px "Kantumruy Pro", sans-serif';
        ctx.fillText(name, radius - 14, 4);
        ctx.restore();
      });
    }

    function spinWheel() {
      let speed = 0.3 + Math.random() * 0.2;
      const decel = 0.003;
      const banner = document.getElementById('winner-banner');
      banner.classList.add('hidden');

      function anim() {
        wheelAngle += speed;
        speed -= decel;
        drawWheel();
        if (speed > 0) {
          requestAnimationFrame(anim);
        } else {
          const sliceAngle = (2 * Math.PI) / studentsList.length;
          const normalized = (2 * Math.PI - (wheelAngle % (2 * Math.PI))) % (2 * Math.PI);
          const winnerIdx = Math.floor(normalized / sliceAngle);
          const winner = studentsList[winnerIdx];
          banner.innerText = '🎉 សូមអបអរសាទរ៖ ' + winner + '!';
          banner.classList.remove('hidden');
        }
      }
      anim();
    }

    // --- 14. GEOMETRY STUDIO ---
    let geoPoints = [];
    let geoSegments = [];
    let geoCircles = [];
    let geoBisectors = [];
    let geoTool = 'move';
    let selectedPtIndex = null;
    let pendingPoint = null;

    function initGeoEvents() {
      const canvas = document.getElementById('geoCanvas');
      if (!canvas) return;

      canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (geoTool === 'point') {
          const label = String.fromCharCode(65 + geoPoints.length);
          geoPoints.push({ x, y, label });
          drawGeoCanvas();
        } else if (geoTool === 'segment') {
          const pt = findClosestPoint(x, y);
          if (pt !== null) {
            if (pendingPoint === null) {
              pendingPoint = pt;
            } else {
              if (pendingPoint !== pt) {
                geoSegments.push({ p1: pendingPoint, p2: pt });
              }
              pendingPoint = null;
              drawGeoCanvas();
            }
          }
        } else if (geoTool === 'circle') {
          const pt = findClosestPoint(x, y);
          if (pt !== null) {
            if (pendingPoint === null) {
              pendingPoint = pt;
            } else {
              if (pendingPoint !== pt) {
                geoCircles.push({ center: pendingPoint, edge: pt });
              }
              pendingPoint = null;
              drawGeoCanvas();
            }
          }
        } else if (geoTool === 'bisector') {
          const pt = findClosestPoint(x, y);
          if (pt !== null) {
            if (pendingPoint === null) {
              pendingPoint = pt;
            } else {
              if (pendingPoint !== pt) {
                geoBisectors.push({ p1: pendingPoint, p2: pt });
              }
              pendingPoint = null;
              drawGeoCanvas();
            }
          }
        } else if (geoTool === 'move') {
          selectedPtIndex = findClosestPoint(x, y);
        }
      });

      canvas.addEventListener('mousemove', (e) => {
        if (geoTool === 'move' && selectedPtIndex !== null) {
          const rect = canvas.getBoundingClientRect();
          geoPoints[selectedPtIndex].x = e.clientX - rect.left;
          geoPoints[selectedPtIndex].y = e.clientY - rect.top;
          drawGeoCanvas();
        }
      });

      window.addEventListener('mouseup', () => {
        if (geoTool === 'move') selectedPtIndex = null;
      });
    }

    function findClosestPoint(x, y) {
      for (let i = 0; i < geoPoints.length; i++) {
        if (Math.hypot(geoPoints[i].x - x, geoPoints[i].y - y) < 15) return i;
      }
      return null;
    }

    function setGeoTool(t) {
      geoTool = t;
      pendingPoint = null;
      ['move', 'point', 'segment', 'circle', 'bisector'].forEach(tool => {
        const btn = document.getElementById('gtool-' + tool);
        if (btn) {
          if (tool === t) {
            btn.className = "px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white";
          } else {
            btn.className = "px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-slate-700 hover:bg-gray-200";
          }
        }
      });
    }

    function demoEquilateral() {
      clearGeoCanvas();
      const canvas = document.getElementById('geoCanvas');
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 50;
      const d = 160;

      geoPoints.push({ x: cx - d/2, y: cy, label: 'A' });
      geoPoints.push({ x: cx + d/2, y: cy, label: 'B' });
      geoPoints.push({ x: cx, y: cy - d * Math.sqrt(3)/2, label: 'C' });

      geoSegments.push({ p1: 0, p2: 1 });
      geoSegments.push({ p1: 1, p2: 2 });
      geoSegments.push({ p1: 2, p2: 0 });

      geoCircles.push({ center: 0, edge: 1 });
      geoCircles.push({ center: 1, edge: 0 });

      drawGeoCanvas();
    }

    function clearGeoCanvas() {
      geoPoints = [];
      geoSegments = [];
      geoCircles = [];
      geoBisectors = [];
      selectedPtIndex = null;
      pendingPoint = null;
      drawGeoCanvas();
    }

    function resizeGeoCanvas() {
      const canvas = document.getElementById('geoCanvas');
      if (!canvas) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      drawGeoCanvas();
    }

    function drawGeoCanvas() {
      const canvas = document.getElementById('geoCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Circles
      geoCircles.forEach(c => {
        const pC = geoPoints[c.center];
        const pE = geoPoints[c.edge];
        if (!pC || !pE) return;
        const r = Math.hypot(pE.x - pC.x, pE.y - pC.y);
        ctx.beginPath();
        ctx.arc(pC.x, pC.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#9333ea';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Bisectors
      geoBisectors.forEach(b => {
        const A = geoPoints[b.p1];
        const B = geoPoints[b.p2];
        if (!A || !B) return;
        const mx = (A.x + B.x) / 2;
        const my = (A.y + B.y) / 2;
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        ctx.beginPath();
        ctx.moveTo(mx - dy * 2, my + dx * 2);
        ctx.lineTo(mx + dy * 2, my - dx * 2);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Segments
      geoSegments.forEach(s => {
        const A = geoPoints[s.p1];
        const B = geoPoints[s.p2];
        if (!A || !B) return;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      // Points
      geoPoints.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, idx === selectedPtIndex ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = idx === selectedPtIndex ? '#f59e0b' : '#1e40af';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px "Kantumruy Pro", sans-serif';
        ctx.fillText(p.label, p.x + 8, p.y - 8);
      });

      // Update Measurements
      const measEl = document.getElementById('geo-measurements');
      let html = '';
      geoSegments.forEach(s => {
        const A = geoPoints[s.p1];
        const B = geoPoints[s.p2];
        if (!A || !B) return;
        const dist = (Math.hypot(B.x - A.x, B.y - A.y) / 40).toFixed(2);
        html += `<div class="flex justify-between p-2 rounded bg-slate-50"><span>អង្កត់ <b>${A.label}${B.label}</b></span><span class="font-bold text-blue-600">${dist} cm</span></div>`;
      });
      geoCircles.forEach(c => {
        const A = geoPoints[c.center];
        const B = geoPoints[c.edge];
        if (!A || !B) return;
        const r = (Math.hypot(B.x - A.x, B.y - A.y) / 40).toFixed(2);
        html += `<div class="flex justify-between p-2 rounded bg-purple-50"><span>រង្វង់ផ្ចិត <b>${A.label}</b></span><span class="font-bold text-purple-700">R = ${r} cm</span></div>`;
      });
      measEl.innerHTML = html || '<p class="text-slate-400">មិនទាន់មានរង្វាស់នៅឡើយទេ។</p>';
    }

    // --- 15. NAVIGATION (LANDING & DASHBOARD) ---
    function goToLandingPage() {
      document.getElementById('app-dashboard').classList.add('hidden');
      const landing = document.getElementById('app-landing');
      landing.classList.remove('hidden');
      landing.classList.add('flex');
      window.location.hash = 'home';
    }

    function goToDashboard() {
      const landing = document.getElementById('app-landing');
      landing.classList.add('hidden');
      landing.classList.remove('flex');
      document.getElementById('app-dashboard').classList.remove('hidden');
      window.location.hash = 'dashboard';
      setTimeout(triggerMath, 150);
    }

    // --- INITIALIZE APP ---
    window.addEventListener('DOMContentLoaded', () => {
      if (window.location.hash === '#home') {
        goToLandingPage();
      } else {
        goToDashboard();
      }

      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#home') goToLandingPage();
        else if (window.location.hash === '#dashboard') goToDashboard();
      });

      // Render sections
      selectLessonGrade(7);
      initQBank();
      renderTests();
      renderMonthlyTests();
      renderStudentChips();
      populateScheduleDropdown();
      initGeoEvents();

      setTimeout(triggerMath, 300);
    });
  </script>
</body>
</html>
'''

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Updated index.html successfully ({len(html_content)} bytes).")

# Also update KPCambodianmathematics.html and KPCambodianmathematics to be identical
with open("KPCambodianmathematics.html", "w", encoding="utf-8") as f:
    f.write(html_content)

with open("KPCambodianmathematics", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Synchronized KPCambodianmathematics.html and KPCambodianmathematics.")
