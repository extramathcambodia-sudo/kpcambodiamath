# -*- coding: utf-8 -*-
"""
Build a beautiful, modern, executive-grade UI for KPCambodianmathematics
with proper KaTeX rendering, refined Khmer typography, and clean cards.
"""

html_content = '''<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KPCambodianmathematics - ប្រព័ន្ធគណិតវិទ្យា និងធនាគារសំណួរ</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Kantumruy Pro Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  
  <!-- KaTeX for crisp Math Rendering (synchronous for reliable execution) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <!-- External Math Data Store -->
  <script src="math_data.js"></script>

  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --surface: #ffffff;
      --bg: #f8fafc;
    }
    body {
      font-family: 'Kantumruy Pro', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg);
      color: #0f172a;
      line-height: 1.75;
    }
    .sidebar {
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.9rem;
      border-radius: 0.625rem;
      font-size: 0.85rem;
      color: #94a3b8;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      transform: translateX(2px);
    }
    .nav-item.active {
      background: linear-gradient(90deg, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0.08) 100%);
      color: #60a5fa;
      font-weight: 600;
      box-shadow: inset 3px 0 0 #3b82f6;
    }
    .card-modern {
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02);
      transition: all 0.2s ease;
    }
    .card-modern:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
    }
    .formula-card {
      background: #ffffff;
      border-radius: 0.875rem;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #3b82f6;
      padding: 1rem 1.25rem;
      transition: transform 0.15s ease;
    }
    .formula-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
    }
    .katex-display {
      margin: 0.5rem 0 !important;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0.25rem 0;
    }
    .katex {
      font-size: 1.05em !important;
    }
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
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
        padding: 24px;
        box-shadow: none;
        border: none;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body class="bg-slate-50 font-sans antialiased overflow-x-hidden min-h-screen text-slate-800">

  <!-- ================= DASHBOARD CONTAINER ================= -->
  <div id="app-dashboard" class="flex h-screen overflow-hidden">

  <!-- ================= SIDEBAR ================= -->
  <aside class="w-64 sidebar text-white flex flex-col justify-between shrink-0 select-none overflow-y-auto z-20">
    <div>
      <!-- Brand Logo -->
      <div class="p-5 flex items-center gap-3.5 border-b border-slate-800 cursor-pointer" onclick="goToLandingPage()">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20 text-white">
          &Sigma;
        </div>
        <div>
          <div class="font-bold text-sm leading-snug tracking-wide text-white">KPCambodianMath</div>
          <div class="text-[11px] text-blue-400 font-medium">ថ្នាក់ទី ៧ · ៨ · ១០</div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="p-3.5 space-y-6">
        <div>
          <div class="text-[11px] font-bold text-slate-400 px-3 mb-2 uppercase tracking-wider">ខ្លឹមសារ និងតេស្ត</div>
          <nav class="space-y-1">
            <div onclick="switchTab('lessons')" id="nav-lessons" class="nav-item active">
              <span class="text-base">📖</span> <span>ខ្លឹមសារមេរៀន</span>
            </div>
            <div onclick="switchTab('qbank')" id="nav-qbank" class="nav-item">
              <span class="text-base">📚</span> <span>ធនាគារសំណួរ</span>
              <span id="qbank-sidebar-count" class="ml-auto text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">498</span>
            </div>
            <div onclick="switchTab('tests')" id="nav-tests" class="nav-item">
              <span class="text-base">📄</span> <span>តេស្តតាមមេរៀន</span>
            </div>
            <div onclick="switchTab('monthly')" id="nav-monthly" class="nav-item">
              <span class="text-base">📅</span> <span>តេស្តប្រចាំខែ</span>
            </div>
            <div onclick="switchTab('geometry')" id="nav-geometry" class="nav-item">
              <span class="text-base">📐</span> <span>សំណង់ធរណីមាត្រ</span>
            </div>
          </nav>
        </div>

        <div>
          <div class="text-[11px] font-bold text-slate-400 px-3 mb-2 uppercase tracking-wider">ការគ្រប់គ្រងការប្រឡង</div>
          <nav class="space-y-1">
            <div onclick="switchTab('schedule')" id="nav-schedule" class="nav-item">
              <span class="text-base">⏱</span> <span>កំណត់ពេលប្រឡង</span>
            </div>
            <div onclick="switchTab('classes')" id="nav-classes" class="nav-item">
              <span class="text-base">🏫</span> <span>ថ្នាក់ និងសិស្ស</span>
            </div>
            <div onclick="switchTab('grading')" id="nav-grading" class="nav-item">
              <span class="text-base">☑️</span> <span>ដាក់ពិន្ទុ និងលទ្ធផល</span>
            </div>
          </nav>
        </div>

        <div>
          <div class="text-[11px] font-bold text-slate-400 px-3 mb-2 uppercase tracking-wider">សកម្មភាពក្នុងថ្នាក់</div>
          <nav class="space-y-1">
            <div onclick="switchTab('wheel')" id="nav-wheel" class="nav-item">
              <span class="text-base">🎡</span> <span>កង់ចាប់ឈ្មោះ</span>
            </div>
            <div onclick="switchTab('group-games')" id="nav-group-games" class="nav-item">
              <span class="text-base">🎮</span> <span>ហ្គេមក្រុម</span>
            </div>
            <div onclick="switchTab('live-quiz')" id="nav-live-quiz" class="nav-item">
              <span class="text-base">📱</span> <span>ហ្គេមសំណួរផ្ទាល់</span>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div onclick="goToLandingPage()" class="p-4 border-t border-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-2 transition-colors">
      <span>←</span> <span>ចេញទៅទំព័រដើម</span>
    </div>
  </aside>

  <!-- ================= MAIN CONTENT ================= -->
  <div class="flex-1 flex flex-col h-screen overflow-hidden">

    <!-- Top Header Bar -->
    <header class="bg-white/95 backdrop-blur border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between shrink-0 z-10">
      <div class="flex items-center gap-4">
        <div>
          <h1 id="page-title" class="text-lg font-bold text-slate-900 leading-tight">ខ្លឹមសារមេរៀន</h1>
          <div id="page-subtitle" class="text-xs text-slate-500 font-normal">គណិតវិទ្យាថ្នាក់ទី ៧ · ៨ · ១០ (ការបោះពុម្ព ២០២៧)</div>
        </div>
      </div>
      
      <div class="flex items-center gap-3.5">
        <!-- Modern Grade Switcher Chips -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/60">
          <button onclick="setGlobalGrade('all')" id="btn-grade-all" class="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition">គ្រប់ថ្នាក់</button>
          <button onclick="setGlobalGrade(7)" id="btn-grade-7" class="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition">ថ្នាក់ទី ៧</button>
          <button onclick="setGlobalGrade(8)" id="btn-grade-8" class="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition">ថ្នាក់ទី ៨</button>
          <button onclick="setGlobalGrade(10)" id="btn-grade-10" class="px-3.5 py-1.5 rounded-lg bg-white text-blue-600 shadow-sm transition">ថ្នាក់ទី ១០</button>
        </div>

        <button onclick="openCreateTestModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition">
          <span>+</span> <span>បង្កើតតេស្ត</span>
        </button>

        <div class="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            PK
          </div>
          <div class="text-left hidden md:block">
            <div class="text-xs font-bold text-slate-800 leading-tight">Puthy Khem</div>
            <div class="text-[10px] text-slate-400">គ្រូបង្រៀនគណិតវិទ្យា</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Scrollable Workspace Viewport -->
    <main class="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">

      <!-- =========================================================
           1. ផ្ទាំង «ខ្លឹមសារមេរៀន» (Modern Redesigned Lesson View)
      ========================================================== -->
      <section id="view-lessons" class="space-y-5 max-w-7xl mx-auto">
        <!-- Filter / Tabs Strip -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <!-- Grade Pill Tabs -->
          <div class="flex items-center gap-2">
            <button onclick="selectLessonGrade(7)" id="lesson-tab-7" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition border border-transparent">
              ថ្នាក់ទី ៧ (២២ មេរៀន)
            </button>
            <button onclick="selectLessonGrade(8)" id="lesson-tab-8" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition border border-transparent">
              ថ្នាក់ទី ៨ (១៨ មេរៀន)
            </button>
            <button onclick="selectLessonGrade(10)" id="lesson-tab-10" class="px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-600 border border-slate-200/90 shadow-sm transition">
              ថ្នាក់ទី ១០ (៩ ជំពូកធំ)
            </button>
          </div>

          <!-- Quick Search -->
          <div class="relative">
            <input type="text" id="lesson-search" oninput="filterLessons()" placeholder="🔍 ស្វែងរកមេរៀន..." class="bg-white border border-slate-200 rounded-xl pl-3.5 pr-4 py-2 text-xs w-64 focus:outline-none focus:border-blue-500 shadow-2xs">
          </div>
        </div>

        <!-- Master-Detail Split Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left Column: Syllabus List -->
          <div class="lg:col-span-4 card-modern p-3 space-y-1.5 max-h-[750px] overflow-y-auto" id="lesson-list-container">
            <!-- Populated via JS with clean chapter cards -->
          </div>

          <!-- Right Column: Interactive Lesson Detail -->
          <div class="lg:col-span-8 card-modern p-6 lg:p-7 space-y-6 bg-white" id="lesson-detail-container">
            <!-- Populated via JS -->
          </div>
        </div>
      </section>

      <!-- =========================================================
           2. ផ្ទាំង «ធនាគារសំណួរ» (Modern Question Bank View)
      ========================================================== -->
      <section id="view-qbank" class="space-y-5 max-w-7xl mx-auto hidden">
        <!-- Control Header -->
        <div class="card-modern p-6 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2.5">
                <h2 class="font-bold text-lg text-slate-900">ធនាគារសំណួររួម</h2>
                <span id="qbank-total-badge" class="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 font-bold border border-blue-200/60">498 សំណួរ</span>
              </div>
              <p class="text-xs text-slate-500 mt-1">រៀបចំតាមកម្រិតថ្នាក់ (៧, ៨, ១០) ជំពូក មេរៀន ភ្ជាប់ជាមួយចម្លើយត្រឹមត្រូវ និងការពន្យល់ដោះស្រាយ។</p>
            </div>
            <div class="flex items-center gap-2.5">
              <button onclick="exportQBankToPrint()" class="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition">
                <span>📥</span> <span>បោះពុម្ពសំណួរដែលបានរើស</span>
              </button>
              <button onclick="openCreateTestModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition">
                + បង្កើតតេស្តពីសំណួរទាំងនេះ
              </button>
            </div>
          </div>

          <!-- Filters Row -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <select id="qfilter-chapter" onchange="applyQBankFilters()" class="border border-slate-200 rounded-xl px-3.5 py-2 text-xs bg-white text-slate-700 focus:outline-none focus:border-blue-500">
              <option value="all">គ្រប់ជំពូក / មេរៀន</option>
            </select>
            <select id="qfilter-diff" onchange="applyQBankFilters()" class="border border-slate-200 rounded-xl px-3.5 py-2 text-xs bg-white text-slate-700 focus:outline-none focus:border-blue-500">
              <option value="all">គ្រប់កម្រិតពិបាក</option>
              <option value="ងាយ">ងាយ (Easy)</option>
              <option value="មធ្យម">មធ្យម (Medium)</option>
              <option value="លំបាក">លំបាក (Challenging)</option>
            </select>
            <select id="qfilter-type" onchange="applyQBankFilters()" class="border border-slate-200 rounded-xl px-3.5 py-2 text-xs bg-white text-slate-700 focus:outline-none focus:border-blue-500">
              <option value="all">គ្រប់ប្រភេទសំណួរ</option>
              <option value="mcq">ពហុជ្រើសរើស (MCQ)</option>
              <option value="written">សរសេរ / ដោះស្រាយ</option>
            </select>
            <input type="text" id="qfilter-search" oninput="applyQBankFilters()" placeholder="🔍 ស្វែងរកពាក្យ ឬរូបមន្ត..." class="border border-slate-200 rounded-xl px-3.5 py-2 text-xs w-full focus:outline-none focus:border-blue-500">
          </div>
        </div>

        <div class="flex justify-between items-center px-1">
          <div class="text-xs font-semibold text-slate-500">
            បង្ហាញ <span id="qbank-showing-count" class="font-bold text-blue-600">0</span> សំណួរ
          </div>
        </div>

        <!-- Question Cards Stream -->
        <div class="space-y-3.5" id="qbank-items-container">
          <!-- Injected dynamically -->
        </div>
      </section>

      <!-- =========================================================
           3. ផ្ទាំង «តេស្តតាមមេរៀន» (Chapter Tests View)
      ========================================================== -->
      <section id="view-tests" class="space-y-5 max-w-7xl mx-auto hidden">
        <div class="card-modern p-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="font-bold text-lg text-slate-900">📄 តេស្តតាមមេរៀន (Chapter Tests & Quizzes)</h2>
              <p class="text-xs text-slate-500 mt-1">វិញ្ញាសាតេស្តរៀបចំតាមមេរៀននីមួយៗសម្រាប់វាស់ស្ទង់សមត្ថភាពសិស្ស</p>
            </div>
            <button onclick="openCreateTestModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition">
              + បង្កើតតេស្តថ្មី
            </button>
          </div>
        </div>

        <div class="space-y-3.5" id="test-list-container">
          <!-- Injected dynamically -->
        </div>
      </section>

      <!-- =========================================================
           4. ផ្ទាំង «តេស្តប្រចាំខែ» (Monthly Tests View)
      ========================================================== -->
      <section id="view-monthly" class="space-y-5 max-w-7xl mx-auto hidden">
        <div class="card-modern p-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="font-bold text-lg text-slate-900">📅 វិញ្ញាសាប្រឡងប្រចាំខែ (Monthly Exams Suite)</h2>
              <p class="text-xs text-slate-500 mt-1">វិញ្ញាសាប្រឡងស្តង់ដារ ក្រសួងអប់រំ យុវជន និងកីឡា / សាលារៀនជំនាន់ថ្មី (ខែវិច្ឆិកា ដល់ ខែមិថុនា)</p>
            </div>
          </div>
        </div>

        <div class="space-y-3.5" id="monthly-list-container">
          <!-- Injected dynamically -->
        </div>
      </section>

      <!-- =========================================================
           5. ផ្ទាំង «សំណង់ធរណីមាត្រ» (Geometric Studio)
      ========================================================== -->
      <section id="view-geometry" class="space-y-4 max-w-7xl mx-auto hidden">
        <div class="card-modern p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="font-bold text-sm text-slate-900">📐 ផ្ទាំងសំណង់ធរណីមាត្រអន្តរកម្ម (Geometric Studio)</h2>
            <p class="text-xs text-slate-500">គូសចំណុច អង្កត់ រង្វង់ មេដ្យាទ័រ និងត្រីកោណសម័ង្ស</p>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            <button onclick="setGeoTool('move')" id="gtool-move" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white">✋ ទាញចំណុច</button>
            <button onclick="setGeoTool('point')" id="gtool-point" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">📍 ចំណុច</button>
            <button onclick="setGeoTool('segment')" id="gtool-segment" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">📏 អង្កត់</button>
            <button onclick="setGeoTool('circle')" id="gtool-circle" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">⭕ រង្វង់</button>
            <button onclick="setGeoTool('bisector')" id="gtool-bisector" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200">➗ មេដ្យាទ័រ</button>
            <button onclick="demoEquilateral()" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200">🔺 ត្រីកោណសម័ង្ស</button>
            <button onclick="clearGeoCanvas()" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100">🗑 សម្អាត</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div class="lg:col-span-3 card-modern overflow-hidden relative bg-white" style="height: 520px;">
            <canvas id="geoCanvas" class="w-full h-full cursor-crosshair"></canvas>
            <div id="geo-hint" class="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-lg">
              ជ្រើសរើសឧបករណ៍ខាងលើ ឬចុចទាញចំណុចនៅលើផ្ទាំងគំនូរ
            </div>
          </div>
          <div class="card-modern p-5 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-xs text-slate-700 border-b pb-2 mb-3">📊 រង្វាស់ និងលក្ខណៈធរណីមាត្រ</h3>
              <div id="geo-measurements" class="space-y-2 text-xs text-slate-600 max-h-80 overflow-y-auto"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Other sections (Schedule, Classes, Wheel, etc.) -->
      <section id="view-schedule" class="space-y-4 max-w-5xl mx-auto hidden">
        <div class="card-modern p-6">
          <h2 class="font-bold text-base text-slate-900">ការប្រឡងដែលបានកំណត់ពេល</h2>
          <div id="scheduled-list" class="space-y-2 mt-3"></div>
        </div>
        <div class="card-modern p-6 space-y-4">
          <h3 class="font-bold text-sm text-slate-800">កំណត់ពេលប្រឡងថ្មី</h3>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">តេស្ត</label>
            <select id="sched-test" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs bg-white"></select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ថ្នាក់</label>
            <select id="sched-class" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs bg-white">
              <option>ថ្នាក់ទី ៧A (35 នាក់)</option>
              <option>ថ្នាក់ទី ៨B (36 នាក់)</option>
              <option>ថ្នាក់ទី ១០A (32 នាក់)</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">កាលបរិច្ឆេទ</label>
              <input id="sched-date" type="date" value="2026-10-17" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">PIN សម្ងាត់</label>
              <input id="sched-pin" type="text" value="9754" class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold tracking-widest">
            </div>
          </div>
          <button onclick="saveSchedule()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm">
            រក្សាទុកការកំណត់ពេល
          </button>
        </div>
      </section>

      <section id="view-classes" class="space-y-4 max-w-5xl mx-auto hidden">
        <div class="card-modern p-6">
          <h2 class="font-bold text-base text-slate-900 mb-2">🏫 ថ្នាក់រៀន និងបញ្ជីសិស្ស</h2>
          <p class="text-xs text-slate-500">គ្រប់គ្រងថ្នាក់ទី ៧A, ៨B, ១០A និងការតាមដានពិន្ទុសិស្ស។</p>
        </div>
      </section>

      <section id="view-grading" class="space-y-4 max-w-5xl mx-auto hidden">
        <div class="card-modern p-6">
          <h2 class="font-bold text-base text-slate-900 mb-2">☑️ ដាក់ពិន្ទុ និងលទ្ធផលប្រឡង</h2>
          <p class="text-xs text-slate-500">ពិនិត្យមើលលទ្ធផលប្រឡងតាមសិស្សម្នាក់ៗ និងរបាយការណ៍ស្ថិតិ។</p>
        </div>
      </section>

      <section id="view-wheel" class="max-w-6xl mx-auto hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 space-y-5">
            <div class="card-modern p-6 flex flex-col items-center">
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
            <div class="card-modern p-5 space-y-3">
              <div class="text-xs font-semibold text-slate-700">បញ្ជីសិស្ស (24 នាក់)</div>
              <div id="student-chips" class="flex flex-wrap gap-1.5 pt-1"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="view-group-games" class="space-y-4 max-w-6xl mx-auto hidden">
        <div class="card-modern p-6">
          <h2 class="font-bold text-base text-slate-900">ហ្គេមក្រុមសម្រាប់ថ្នាក់រៀន</h2>
          <p class="text-xs text-slate-500 mt-1">លេងហ្គេមសំណួរគណិតវិទ្យាថ្នាក់ទី ៧, ៨ និង ១០៖ កាតបើក កង់វិល និងប្រណាំងទូកង។</p>
        </div>
      </section>

      <section id="view-live-quiz" class="space-y-4 max-w-6xl mx-auto hidden">
        <div class="card-modern p-6">
          <h2 class="font-bold text-base text-slate-900">📱 ហ្គេមសំណួរផ្ទាល់លើទូរស័ព្ទសិស្ស</h2>
          <p class="text-xs text-slate-500 mt-1">សិស្សម្នាក់ៗចូលលេងលើទូរស័ព្ទរបស់ខ្លួនដោយលេខកូដ ៦ ខ្ទង់។</p>
        </div>
      </section>

    </main>
  </div>
  </div> <!-- End #app-dashboard -->

  <!-- ================= LANDING PAGE VIEW ================= -->
  <div id="app-landing" class="hidden min-h-screen w-full flex-col justify-between bg-slate-50 text-slate-800">
    <header class="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur px-8 lg:px-16 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3.5 cursor-pointer" onclick="goToLandingPage()">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xl text-white shadow-md">
          &Sigma;
        </div>
        <div>
          <div class="font-bold text-base text-slate-900 leading-tight">KPCambodianmathematics</div>
          <div class="text-xs text-slate-400">ប្រព័ន្ធប្រឡង និងធនាគារសំណួរគណិតវិទ្យា</div>
        </div>
      </div>
      <div class="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200/50">ថ្នាក់ទី ៧ · ៨ · ១០</div>
    </header>

    <main class="flex-1 max-w-6xl mx-auto w-full px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <div class="text-xs font-bold tracking-widest text-blue-600 uppercase">
          KPCAMBODIANMATHEMATICS · 2027
        </div>
        <h1 class="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.25] tracking-tight">
          ប្រព័ន្ធប្រឡងគណិតវិទ្យា<br>និងធនាគារសំណួរ
        </h1>
        <p class="text-sm text-slate-600 max-w-lg leading-relaxed">
          ប្រមូលផ្តុំខ្លឹមសារមេរៀន ៤៩ មេរៀន, ធនាគារសំណួរ ៤៩៨+ សំណួរស្រង់ចេញពីសៀវភៅថ្នាក់ទី ៧, ៨ និង ១០, តេស្តតាមមេរៀន និងវិញ្ញាសាប្រឡងប្រចាំខែពេញលេញ។
        </p>
        <div class="flex items-center gap-3 pt-2">
          <span class="w-8 h-[2px] bg-blue-600 rounded-full inline-block"></span>
          <span class="text-xs text-slate-500">ការប្រឡងប្រចាំខែ · តេស្តតាមមេរៀន · បោះពុម្ពជា PDF</span>
        </div>
      </div>

      <div class="lg:col-span-5 space-y-4">
        <div class="text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">ជ្រើសរើសចូលប្រើ</div>
        <div onclick="openStudentPortal()" class="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-pointer">
          <h3 class="text-xl font-bold text-slate-900 group-hover:text-blue-600">សិស្ស</h3>
          <p class="text-xs text-slate-500 mt-1 font-medium">ចូលធ្វើតេស្ត និងមើលលទ្ធផល</p>
        </div>
        <div onclick="goToDashboard()" class="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-pointer">
          <h3 class="text-xl font-bold text-slate-900 group-hover:text-blue-600">គ្រូបង្រៀន</h3>
          <p class="text-xs text-slate-500 mt-1 font-medium">គ្រប់គ្រងធនាគារសំណួរ មេរៀន និងចេញវិញ្ញាសា</p>
        </div>
      </div>
    </main>

    <footer class="w-full px-8 lg:px-16 py-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200">
      <div>KPCambodianmathematics</div>
      <div>Mathematics for Grade 7, 8, 10 (2027)</div>
    </footer>
  </div>

  <!-- ================= MODAL: INTERACTIVE TEST RUNNER ================= -->
  <div id="test-runner-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
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
        <!-- Injected dynamically -->
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div class="text-xs text-slate-500">
          សូមពិនិត្យចម្លើយឱ្យបានច្បាស់លាស់មុនពេលចុច «បញ្ជូនចម្លើយ»
        </div>
        <div class="flex gap-2">
          <button onclick="closeTestRunner()" class="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            បោះបង់
          </button>
          <button onclick="submitTestAnswers()" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow">
            ✓ បញ្ជូនចម្លើយ និងមើលពិន្ទុ
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= MODAL: TEST PRINT / PDF PREVIEW ================= -->
  <div id="test-print-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden flex items-center justify-center p-4">
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
        <!-- Injected dynamically -->
      </div>
    </div>
  </div>

  <!-- ================= MODAL: SOLUTION VIEWER ================= -->
  <div id="solution-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden flex items-center justify-center p-4">
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
  <div id="create-test-modal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4">
      <div class="flex justify-between items-center pb-2 border-b">
        <h3 class="font-bold text-base text-slate-900">+ បង្កើតតេស្តថ្មីពីធនាគារសំណួរ</h3>
        <button onclick="closeCreateTestModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>
      <div class="space-y-3.5">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ចំណងជើងតេស្ត</label>
          <input type="text" id="ct-title" placeholder="ឧ. តេស្តគណិតវិទ្យាប្រចាំសប្តាហ៍..." class="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">កម្រិតថ្នាក់</label>
            <select id="ct-grade" onchange="updateCreateTestChapters()" class="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white">
              <option value="7">ថ្នាក់ទី ៧</option>
              <option value="8">ថ្នាក់ទី ៨</option>
              <option value="10">ថ្នាក់ទី ១០</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">រយៈពេល (នាទី)</label>
            <input type="number" id="ct-duration" value="45" class="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ជ្រើសរើសមេរៀន</label>
          <select id="ct-chapter" class="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white"></select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ចំនួនសំណួរ MCQ</label>
            <input type="number" id="ct-mcq-count" value="10" min="1" max="20" class="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">ចំនួនសំណួរសរសេរ</label>
            <input type="number" id="ct-written-count" value="2" min="0" max="5" class="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs">
          </div>
        </div>
      </div>
      <div class="flex gap-2 pt-3 border-t">
        <button onclick="generateCustomTest()" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow">
          បង្កើតតេស្តភ្លាមៗ
        </button>
        <button onclick="closeCreateTestModal()" class="px-4 py-2.5 border rounded-xl text-xs text-slate-600 hover:bg-slate-50">
          បោះបង់
        </button>
      </div>
    </div>
  </div>

  <!-- Student Login Modal -->
  <div id="student-modal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
      <div class="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 class="font-bold text-base text-slate-900">ចូលប្រឡងសម្រាប់សិស្ស</h3>
        <button onclick="closeStudentModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1.5">ឈ្មោះ ឬ អត្តលេខសិស្ស</label>
        <input type="text" id="student-id-input" placeholder="ឧទាហរណ៍៖ វ៉ាន់ ពិសិដ្ឋ" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1.5">ជ្រើសរើសវិញ្ញាសាប្រឡង</label>
        <select id="student-test-select" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-500"></select>
      </div>
      <div class="flex gap-2 pt-2">
        <button onclick="startStudentExam()" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow">
          ចូលធ្វើតេស្ត
        </button>
        <button onclick="closeStudentModal()" class="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl text-xs">
          បោះបង់
        </button>
      </div>
    </div>
  </div>

  <!-- ================= JAVASCRIPT APPLICATION CODE ================= -->
  <script>
    // State
    let currentGrade = 10;
    let currentLessonGrade = 10;
    let currentSelectedLesson = null;
    let activeLessonSubTab = 'theory'; // 'theory', 'formulas', 'examples', 'practice'
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

    // High quality Math rendering helper with KaTeX
    function renderMath(target) {
      if (window.renderMathInElement) {
        renderMathInElement(target || document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false,
          ignoredTags: ["script", "noscript", "style", "textarea"]
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
            btn.className = "px-3.5 py-1.5 rounded-lg bg-white text-blue-600 shadow-sm transition";
          } else {
            btn.className = "px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition";
          }
        }
      });

      if (g !== 'all') {
        selectLessonGrade(Number(g));
      }
      filterQBankGrade(g);
      filterTestsGrade(g);
      filterMonthlyGrade(g);
    }

    // --- 2. Tab Navigation ---
    const tabHeaders = {
      'lessons': { title: 'ខ្លឹមសារមេរៀន និងរូបមន្តគន្លឹះ', subtitle: 'ស្រង់ចេញពីសៀវភៅ Mathematics for grade 7, 8, 10 (2027)' },
      'qbank': { title: 'ធនាគារសំណួររួម', subtitle: 'សំណួរពហុជ្រើសរើស និងលំហាត់ដោះស្រាយ ភ្ជាប់ជាមួយចម្លើយ និងការពន្យល់' },
      'tests': { title: 'តេស្តតាមមេរៀន (Chapter Tests)', subtitle: 'កម្រងតេស្តវាស់ស្ទង់សមត្ថភាពតាមជំពូកនីមួយៗ' },
      'monthly': { title: 'វិញ្ញាសាប្រឡងប្រចាំខែ (Monthly Exams)', subtitle: 'វិញ្ញាសាស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា / សាលារៀនជំនាន់ថ្មី' },
      'geometry': { title: 'សំណង់ធរណីមាត្រអន្តរកម្ម', subtitle: 'គូសវាស់ និងសង់រូបធរណីមាត្រដោយផ្ទាល់' },
      'schedule': { title: 'កំណត់ពេលប្រឡង', subtitle: 'គ្រប់គ្រងកាលវិភាគ និង PIN សម្ងាត់សម្រាប់សិស្ស' },
      'classes': { title: 'ថ្នាក់ និងសិស្ស', subtitle: 'គ្រប់គ្រងបញ្ជីឈ្មោះ និងស្ថិតិសិស្ស' },
      'grading': { title: 'ដាក់ពិន្ទុ និងលទ្ធផល', subtitle: 'របាយការណ៍ពិន្ទុ និងការវិភាគកម្រិតយល់ដឹង' },
      'wheel': { title: 'កង់ចាប់ឈ្មោះ', subtitle: 'សកម្មភាពចាប់ឈ្មោះសិស្សឡើងឆ្លើយសំណួរក្នុងថ្នាក់' },
      'group-games': { title: 'ហ្គេមក្រុម', subtitle: 'ហ្គេមសំណួរគណិតវិទ្យាជាក្រុម' },
      'live-quiz': { title: 'ហ្គេមសំណួរផ្ទាល់លើទូរស័ព្ទ', subtitle: 'សិស្សចូលលេងព្រមគ្នាដោយលេខកូដ PIN' }
    };

    function switchTab(tabId) {
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      const activeNav = document.getElementById('nav-' + tabId);
      if (activeNav) activeNav.classList.add('active');

      const info = tabHeaders[tabId] || { title: 'ផ្ទាំងគ្រប់គ្រង', subtitle: '' };
      document.getElementById('page-title').innerText = info.title;
      document.getElementById('page-subtitle').innerText = info.subtitle;

      const views = ['lessons', 'qbank', 'tests', 'monthly', 'geometry', 'schedule', 'classes', 'grading', 'wheel', 'group-games', 'live-quiz'];
      views.forEach(v => {
        const el = document.getElementById('view-' + v);
        if (el) el.classList.add('hidden');
      });

      const target = document.getElementById('view-' + tabId);
      if (target) target.classList.remove('hidden');

      if (tabId === 'geometry') resizeGeoCanvas();
      if (tabId === 'wheel') drawWheel();

      setTimeout(() => renderMath(), 50);
    }

    // --- 3. LESSONS SECTION LOGIC (REFINED & BEAUTIFUL) ---
    function selectLessonGrade(g) {
      currentLessonGrade = g;
      [7, 8, 10].forEach(grade => {
        const tab = document.getElementById('lesson-tab-' + grade);
        if (tab) {
          if (grade === g) {
            tab.className = "px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-600 border border-slate-200/90 shadow-sm transition";
          } else {
            tab.className = "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition border border-transparent";
          }
        }
      });
      renderLessonList();
    }

    function renderLessonList() {
      const container = document.getElementById('lesson-list-container');
      const lessons = (window.MATH_DATA && window.MATH_DATA.lessons[String(currentLessonGrade)]) || [];
      const query = (document.getElementById('lesson-search')?.value || '').toLowerCase().trim();

      const filtered = lessons.filter(l => l.title.toLowerCase().includes(query) || (l.summary && l.summary.toLowerCase().includes(query)));

      if (filtered.length === 0) {
        container.innerHTML = '<div class="text-xs text-slate-400 p-6 text-center">មិនមានមេរៀនដែលត្រូវនឹងការស្វែងរក</div>';
        return;
      }

      container.innerHTML = filtered.map((l, idx) => `
        <div onclick="showLessonDetail('${l.id}')" id="litem-${l.id}" class="p-3 rounded-xl border border-transparent cursor-pointer hover:bg-slate-100/70 transition flex items-center justify-between gap-3 ${idx === 0 ? 'bg-blue-50/80 border-blue-200' : ''}">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-6 h-6 rounded-lg ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'} text-[11px] font-bold flex items-center justify-center shrink-0">
              ${l.num}
            </span>
            <div class="truncate text-xs font-semibold ${idx === 0 ? 'text-blue-900 font-bold' : 'text-slate-800'}">
              ${l.title.replace(/\\(.*?\\)/g, '').trim()}
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full ${l.category === 'ពីជគណិត' ? 'bg-blue-50 text-blue-700' : (l.category === 'ធរណីមាត្រ' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700')} font-medium shrink-0">
            ${l.category}
          </span>
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
      document.querySelectorAll('#lesson-list-container > div').forEach(el => {
        el.className = el.className.replace('bg-blue-50/80 border-blue-200', '');
        const badge = el.querySelector('span');
        if (badge) badge.className = badge.className.replace('bg-blue-600 text-white', 'bg-slate-100 text-slate-600');
      });

      const activeItem = document.getElementById('litem-' + lessonId);
      if (activeItem) {
        activeItem.classList.add('bg-blue-50/80', 'border-blue-200');
        const badge = activeItem.querySelector('span');
        if (badge) badge.className = badge.className.replace('bg-slate-100 text-slate-600', 'bg-blue-600 text-white');
      }

      const lessons = window.MATH_DATA.lessons[String(currentLessonGrade)] || [];
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return;

      currentSelectedLesson = lesson;
      renderLessonDetailPanel();
    }

    function setLessonSubTab(tab) {
      activeLessonSubTab = tab;
      renderLessonDetailPanel();
    }

    function renderLessonDetailPanel() {
      const lesson = currentSelectedLesson;
      if (!lesson) return;

      const container = document.getElementById('lesson-detail-container');

      // Questions associated with this lesson for Practice tab
      const practiceQuestions = (window.MATH_DATA.questionBank || []).filter(q => 
        q.grade === currentLessonGrade && 
        q.chapter.includes(lesson.title.slice(0, 8))
      ).slice(0, 5);

      container.innerHTML = `
        <!-- Lesson Hero Header -->
        <div class="border-b border-slate-100 pb-5 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">ថ្នាក់ទី ${currentLessonGrade}</span>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">${lesson.category}</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="createTestFromCurrentLesson('${lesson.title}')" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5">
                <span>+</span> <span>បង្កើតតេស្ត</span>
              </button>
            </div>
          </div>
          <h2 class="text-xl lg:text-2xl font-black text-slate-900 leading-tight">
            ${currentLessonGrade === 10 ? 'ជំពូកទី' : 'មេរៀនទី'} ${lesson.num} ៖ ${lesson.title}
          </h2>
        </div>

        <!-- Sub Tabs Strip -->
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <button onclick="setLessonSubTab('theory')" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeLessonSubTab === 'theory' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-600 hover:bg-slate-50'}">
            <span>📖</span> <span>ទ្រឹស្តី និងនិយមន័យ</span>
          </button>
          <button onclick="setLessonSubTab('formulas')" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeLessonSubTab === 'formulas' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-600 hover:bg-slate-50'}">
            <span>📐</span> <span>រូបមន្តគន្លឹះ</span>
          </button>
          <button onclick="setLessonSubTab('examples')" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeLessonSubTab === 'examples' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-600 hover:bg-slate-50'}">
            <span>✍️</span> <span>ឧទាហរណ៍អនុវត្ត</span>
          </button>
          <button onclick="setLessonSubTab('practice')" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeLessonSubTab === 'practice' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' : 'text-slate-600 hover:bg-slate-50'}">
            <span>🎯</span> <span>សំណួរតេស្ត (${practiceQuestions.length})</span>
          </button>
        </div>

        <!-- Sub Tab Content -->
        <div class="pt-2">
          ${renderLessonSubTabContent(lesson, practiceQuestions)}
        </div>
      `;

      setTimeout(() => renderMath(container), 20);
    }

    function renderLessonSubTabContent(lesson, practiceQuestions) {
      if (activeLessonSubTab === 'theory') {
        return `
          <div class="space-y-4">
            <div class="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200/70">
              <div class="flex items-center gap-2 font-bold text-xs text-blue-900 mb-2">
                <span>💡</span> <span>ខ្លឹមសារសង្ខេបគ្រឹះ</span>
              </div>
              <p class="text-xs text-slate-800 leading-relaxed font-normal">${lesson.summary}</p>
            </div>
            
            <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div class="flex items-center gap-2 font-bold text-xs text-slate-800">
                <span>📌</span> <span>ចំណុចសំខាន់ៗដែលត្រូវយល់ដឹង</span>
              </div>
              <ul class="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed pl-1">
                <li>ស្វែងយល់ពីនិយមន័យពិតប្រាកដ និងលក្ខខណ្ឌនៃអថេរ និងមេគុណ</li>
                <li>អនុវត្តក្បួន និងរូបមន្តដោយប្រុងប្រយ័ត្នចំពោះសញ្ញា ($+$ និង $-$)</li>
                <li>ផ្ទៀងផ្ទាត់ដំណោះស្រាយឡើងវិញជានិច្ចមុននឹងសន្និដ្ឋាន</li>
              </ul>
            </div>
          </div>
        `;
      } else if (activeLessonSubTab === 'formulas') {
        const formulas = Array.isArray(lesson.formulas) ? lesson.formulas : [
          { name: "រូបមន្តសំខាន់", math: lesson.formulas }
        ];

        return `
          <div class="space-y-3.5">
            ${formulas.map(f => `
              <div class="formula-card">
                <div class="font-bold text-xs text-blue-900 mb-1 flex items-center justify-between">
                  <span>${f.name}</span>
                  <span class="text-[10px] text-blue-500 font-semibold uppercase">រូបមន្តគន្លឹះ</span>
                </div>
                <div class="text-sm text-slate-900 leading-loose py-1 font-mono">
                  ${f.math}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (activeLessonSubTab === 'examples') {
        const examples = Array.isArray(lesson.examples) ? lesson.examples : [
          { title: "ឧទាហរណ៍អនុវត្តគំរូ", question: lesson.title, solution: lesson.examples }
        ];

        return `
          <div class="space-y-4">
            ${examples.map((ex, idx) => `
              <div class="card-modern p-5 space-y-3 bg-white border border-slate-200">
                <div class="flex items-center justify-between border-b pb-2">
                  <span class="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">${idx + 1}</span>
                    <span>${ex.title}</span>
                  </span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">លំហាត់គំរូ</span>
                </div>
                <div class="text-xs text-slate-800 font-semibold leading-relaxed">
                  ${ex.question}
                </div>
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 space-y-1.5">
                  <div class="font-bold text-blue-900 text-[11px]">✍️ ដំណោះស្រាយលម្អិត ៖</div>
                  <div class="leading-relaxed whitespace-pre-wrap">${ex.solution}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (activeLessonSubTab === 'practice') {
        if (practiceQuestions.length === 0) {
          return `<div class="card-modern p-8 text-center text-xs text-slate-400">មិនទាន់មានសំណួរតេស្តជាក់លាក់សម្រាប់មេរៀននេះនៅឡើយទេ។ សូមចូលទៅកាន់ផ្ទាំង «ធនាគារសំណួរ» ដើម្បីស្វែងរកសំណួរពាក់ព័ន្ធ។</div>`;
        }

        return `
          <div class="space-y-4">
            ${practiceQuestions.map((q, idx) => `
              <div class="card-modern p-4 space-y-3 bg-white border border-slate-200">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-start gap-2.5">
                    <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
                    <p class="text-xs font-semibold text-slate-900 leading-relaxed">${q.question}</p>
                  </div>
                  <button onclick="toggleAnswer('${q.id}')" class="px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 shrink-0 font-medium">
                    👁 ចម្លើយ
                  </button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
                  ${q.options.map(opt => `
                    <div class="p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs flex items-center gap-2">
                      <span class="w-4 h-4 rounded-full bg-white font-bold text-[10px] text-slate-700 flex items-center justify-center border">${opt.key}</span>
                      <span class="truncate">${opt.text}</span>
                    </div>
                  `).join('')}
                </div>
                <div id="ans-${q.id}" class="hidden p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div class="font-bold">✓ ចម្លើយត្រឹមត្រូវ ៖ ជម្រើស (${q.answer})</div>
                  <div class="text-[11px] text-emerald-800">${q.explanation || ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
      return '';
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
        container.innerHTML = '<div class="card-modern p-12 text-center text-xs text-slate-400">ពុំមានសំណួរដែលត្រូវនឹងតម្រងស្វែងរកនេះឡើយ។</div>';
        return;
      }

      const toShow = qbankFiltered.slice(0, 50);

      container.innerHTML = toShow.map(q => `
        <div class="card-modern p-5 hover:border-slate-300 transition space-y-3">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/50 shrink-0 mt-0.5">
                ថ្នាក់ទី ${q.grade}
              </span>
              <div>
                <p class="text-xs font-semibold text-slate-900 leading-relaxed">${q.question}</p>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600">${q.chapter}</span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] ${q.difficulty === 'ងាយ' ? 'bg-emerald-50 text-emerald-700' : (q.difficulty === 'មធ្យម' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700')} font-medium">${q.difficulty}</span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] bg-purple-50 text-purple-700">${q.category}</span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-bold">${q.points} ពិន្ទុ</span>
                </div>
              </div>
            </div>
            <button onclick="toggleAnswer('${q.id}')" class="px-3.5 py-1.5 text-xs border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 shrink-0 font-medium transition shadow-2xs">
              👁 ចម្លើយ
            </button>
          </div>

          ${q.options && q.options.length > 0 ? `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
              ${q.options.map(opt => `
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-white font-bold text-[11px] text-slate-700 flex items-center justify-center border shadow-xs shrink-0">${opt.key}</span>
                  <span class="truncate font-medium text-slate-800">${opt.text}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div id="ans-${q.id}" class="hidden p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div class="font-bold flex items-center gap-1.5">
              <span>✓ ចម្លើយត្រឹមត្រូវ ៖ ជម្រើស (${q.answer})</span>
            </div>
            <div class="text-[11px] text-emerald-800">${q.explanation || ''}</div>
          </div>
        </div>
      `).join('');

      renderMath(container);
    }

    function toggleAnswer(qid) {
      const el = document.getElementById('ans-' + qid);
      if (el) el.classList.toggle('hidden');
      renderMath(el);
    }

    // --- 5. TESTS SECTION LOGIC ---
    function renderTests() {
      const container = document.getElementById('test-list-container');
      const tests = (window.MATH_DATA && window.MATH_DATA.chapterTests) || [];

      const filtered = tests.filter(t => currentGrade === 'all' || t.grade === Number(currentGrade));

      container.innerHTML = filtered.map(t => `
        <div class="card-modern p-5 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-emerald-500">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-xl">
              📄
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">ថ្នាក់ទី ${t.grade}</span>
                <h3 class="font-bold text-sm text-slate-900">${t.title}</h3>
              </div>
              <p class="text-xs text-slate-500 mt-1">${t.desc || ''}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">${t.mcqCount} ពហុជ្រើសរើស</span>
                ${t.writtenCount > 0 ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">✏️ ${t.writtenCount} សរសេរ</span>` : ''}
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">${t.points} ពិន្ទុ</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-medium">⏱ ${t.duration} នាទី</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="launchInteractiveTest('${t.id}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition">
              ★ ចូលធ្វើតេស្ត
            </button>
            <button onclick="openPrintTest('${t.id}')" class="p-2 border border-slate-200 rounded-xl text-xs hover:bg-slate-50 text-slate-700" title="បោះពុម្ពវិញ្ញាសា">
              🖨 បោះពុម្ព
            </button>
          </div>
        </div>
      `).join('');
    }

    function filterTestsGrade(g) {
      renderTests();
    }

    // --- 6. MONTHLY TESTS LOGIC ---
    function renderMonthlyTests() {
      const container = document.getElementById('monthly-list-container');
      const tests = (window.MATH_DATA && window.MATH_DATA.monthlyTests) || [];

      const filtered = tests.filter(t => currentGrade === 'all' || t.grade === Number(currentGrade));

      container.innerHTML = filtered.map(t => `
        <div class="card-modern p-5 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-blue-600">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-2xl">
              📅
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">ថ្នាក់ទី ${t.grade}</span>
                <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">ខែ ${t.month}</span>
                <h3 class="font-bold text-sm text-slate-900">${t.title}</h3>
              </div>
              <p class="text-xs text-slate-500 mt-1">ខ្លឹមសាររួមមាន ៖ ${t.lessonsCovered}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">⏱ ${t.duration} នាទី</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold">★ ${t.totalPoints} ពិន្ទុ</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-700 font-medium">៣ ផ្នែកពេញលេញ</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="openPrintMonthly('${t.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition">
              <span>🖨</span> <span>មើល និងបោះពុម្ព</span>
            </button>
            <button onclick="viewMonthlySolution('${t.id}')" class="px-3.5 py-2 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition">
              🔑 ដំណោះស្រាយ
            </button>
          </div>
        </div>
      `).join('');
    }

    function filterMonthlyGrade(g) {
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

      const qb = window.MATH_DATA.questionBank.filter(q => q.grade === test.grade && q.chapter.includes(test.chapter.slice(0, 10)) && q.type === 'mcq');
      const questionsToUse = (qb.length >= test.mcqCount ? qb.slice(0, test.mcqCount) : window.MATH_DATA.questionBank.filter(q => q.grade === test.grade && q.type === 'mcq').slice(0, test.mcqCount));

      activeTest.questions = questionsToUse;

      const container = document.getElementById('runner-questions-container');
      container.innerHTML = questionsToUse.map((q, idx) => `
        <div class="card-modern p-5 space-y-3">
          <div class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">${idx + 1}</span>
            <div class="text-xs font-semibold text-slate-900 leading-relaxed">${q.question}</div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            ${q.options.map(opt => `
              <label class="p-3 rounded-xl border border-slate-200 flex items-center gap-3 text-xs cursor-pointer hover:bg-slate-50 transition">
                <input type="radio" name="q_${q.id}" value="${opt.key}" onchange="recordAnswer('${q.id}', '${opt.key}')" class="text-blue-600">
                <span class="font-bold text-slate-700">${opt.key}.</span>
                <span class="text-slate-800">${opt.text}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `).join('');

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
      renderMath(container);
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

          <div class="grid grid-cols-3 gap-4 text-xs font-semibold py-2 border-b border-dashed border-slate-300">
            <div>ឈ្មោះសិស្ស៖ ...........................................</div>
            <div>ថ្នាក់៖ .................................</div>
            <div>កាលបរិច្ឆេទ៖ ....../....../2026</div>
          </div>

          <div class="space-y-6 pt-2">
            ${test.sections.map((sec) => `
              <div class="space-y-3">
                <h4 class="font-bold text-xs bg-slate-100 p-2 rounded-lg text-slate-900">${sec.title}</h4>
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
      renderMath(content);
    }

    function openPrintTest(testId) {
      const tests = window.MATH_DATA.chapterTests || [];
      const test = tests.find(t => t.id === testId);
      if (!test) return;

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
            <h4 class="font-bold text-xs bg-slate-100 p-2 rounded-lg">ផ្នែកពហុជ្រើសរើស (MCQ) — ចូរគូសរង្វង់លើជម្រើសដែលត្រឹមត្រូវតែមួយគត់</h4>
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
      renderMath(content);
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
      renderMath(content);
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
        <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 leading-relaxed font-mono whitespace-pre-wrap text-slate-800">
          ${test.solutions}
        </div>
      `;
      document.getElementById('solution-modal').classList.remove('hidden');
      renderMath(document.getElementById('solution-modal'));
    }

    function closeSolutionModal() {
      document.getElementById('solution-modal').classList.add('hidden');
    }

    // --- 10. CREATE TEST MODAL ---
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
        <div class="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
          <div>
            <span class="font-bold text-blue-900">${testName}</span> • <span>${className}</span> • <span>📅 ${date}</span>
          </div>
          <span class="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold">PIN: ${pin}</span>
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
        <span class="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200/80 font-medium cursor-pointer hover:bg-slate-200">${s}</span>
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
            btn.className = "px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white";
          } else {
            btn.className = "px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200";
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

      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

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
      setTimeout(() => renderMath(), 100);
    }

    // --- INITIALIZE APPLICATION ---
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

      // Default to Grade 10
      selectLessonGrade(10);
      initQBank();
      renderTests();
      renderMonthlyTests();
      renderStudentChips();
      populateScheduleDropdown();
      initGeoEvents();

      setTimeout(() => renderMath(), 200);
    });
  </script>
</body>
</html>
'''

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_content)

with open("KPCambodianmathematics.html", "w", encoding="utf-8") as f:
    f.write(html_content)

with open("KPCambodianmathematics", "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Updated index.html with beautiful modern design ({len(html_content)} bytes).")
