# -*- coding: utf-8 -*-
import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Sidebar brand subtitle
c = c.replace('ថ្នាក់ទី ៧ · ៨ · ១០</div>', 'ថ្នាក់ទី ៧ · ៨ · ៩ · ១០</div>')

# 2. Header subtitle
c = c.replace('គណិតវិទ្យាថ្នាក់ទី ៧ · ៨ · ១០ (ការបោះពុម្ព ២០២៧)', 'គណិតវិទ្យាថ្នាក់ទី ៧ · ៨ · ៩ · ១០ (ការបោះពុម្ព ២០២៧)')

# 3. Grade switcher buttons
old_btn = '<button onclick="setGlobalGrade(8)" id="btn-grade-8" class="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition">ថ្នាក់ទី ៨</button>\n          <button onclick="setGlobalGrade(10)" id="btn-grade-10" class="px-3.5 py-1.5 rounded-lg bg-white text-blue-600 shadow-sm transition">ថ្នាក់ទី ១០</button>'
new_btn = '<button onclick="setGlobalGrade(8)" id="btn-grade-8" class="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition">ថ្នាក់ទី ៨</button>\n          <button onclick="setGlobalGrade(9)" id="btn-grade-9" class="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition">ថ្នាក់ទី ៩</button>\n          <button onclick="setGlobalGrade(10)" id="btn-grade-10" class="px-3.5 py-1.5 rounded-lg bg-white text-blue-600 shadow-sm transition">ថ្នាក់ទី ១០</button>'
c = c.replace(old_btn, new_btn)

# 4. Lesson tabs
old_tabs = '''<button onclick="selectLessonGrade(8)" id="lesson-tab-8" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition border border-transparent">
              ថ្នាក់ទី ៨ (១៨ មេរៀន)
            </button>
            <button onclick="selectLessonGrade(10)" id="lesson-tab-10" class="px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-600 border border-slate-200/90 shadow-sm transition">
              ថ្នាក់ទី ១០ (៩ ជំពូកធំ)
            </button>'''
new_tabs = '''<button onclick="selectLessonGrade(8)" id="lesson-tab-8" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition border border-transparent">
              ថ្នាក់ទី ៨ (១៨ មេរៀន)
            </button>
            <button onclick="selectLessonGrade(9)" id="lesson-tab-9" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition border border-transparent">
              ថ្នាក់ទី ៩ (១៨ មេរៀន)
            </button>
            <button onclick="selectLessonGrade(10)" id="lesson-tab-10" class="px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-600 border border-slate-200/90 shadow-sm transition">
              ថ្នាក់ទី ១០ (៩ ជំពូកធំ)
            </button>'''
c = c.replace(old_tabs, new_tabs)

# 5. Qbank subtitle
c = c.replace('រៀបចំតាមកម្រិតថ្នាក់ (៧, ៨, ១០)', 'រៀបចំតាមកម្រិតថ្នាក់ (៧, ៨, ៩, ១០)')

# 6. Sched class options
old_sched = '''<option>ថ្នាក់ទី ៨B (36 នាក់)</option>
              <option>ថ្នាក់ទី ១០A (32 នាក់)</option>'''
new_sched = '''<option>ថ្នាក់ទី ៨B (36 នាក់)</option>
              <option>ថ្នាក់ទី ៩A (38 នាក់)</option>
              <option>ថ្នាក់ទី ១០A (32 នាក់)</option>'''
c = c.replace(old_sched, new_sched)

# 7. Landing page text
c = c.replace('៤៩ មេរៀន, ធនាគារសំណួរ ៤៩៨+ សំណួរស្រង់ចេញពីសៀវភៅថ្នាក់ទី ៧, ៨ និង ១០', '៦៧ មេរៀន, ធនាគារសំណួរ ៧១៤+ សំណួរស្រង់ចេញពីសៀវភៅថ្នាក់ទី ៧, ៨, ៩ និង ១០')
c = c.replace('Mathematics for Grade 7, 8, 10 (2027)', 'Mathematics for Grade 7, 8, 9, 10 (2027)')

# 8. Create test modal
old_ct = '''<option value="8">ថ្នាក់ទី ៨</option>
              <option value="10">ថ្នាក់ទី ១០</option>'''
new_ct = '''<option value="8">ថ្នាក់ទី ៨</option>
              <option value="9">ថ្នាក់ទី ៩</option>
              <option value="10">ថ្នាក់ទី ១០</option>'''
c = c.replace(old_ct, new_ct)

# 9. JS loop arrays
c = c.replace("['all', '7', '8', '10'].forEach", "['all', '7', '8', '9', '10'].forEach")
c = c.replace("[7, 8, 10].forEach", "[7, 8, 9, 10].forEach")
c = c.replace("Mathematics for grade 7, 8, 10", "Mathematics for grade 7, 8, 9, 10")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated index.html successfully!')
