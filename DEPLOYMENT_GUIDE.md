# 🚀 សៀវភៅណែនាំអំពីការ Deploy គេហទំព័រ KPCambodianmathematics
### (Deployment Guide & Instructions)

ឯកសារសម្រាប់ Deploy ទាំងអស់ត្រូវបានរៀបចំទុកនៅក្នុង Folder: **`dist/`**  
ទំហំសរុបនៃ Folder `dist/` គឺត្រឹមតែ **~12.6 MB** ប៉ុណ្ណោះ (ស្រាល ស្អាត និងមានគ្រប់ File ចាំបាច់ទាំងអស់)។

---

## 📁 រចនាសម្ព័ន្ធ Folder ដែលបានរៀបចំរួចរាល់

```text
KP Cambodiamathmatic/
├── 📁 dist/                     ⭐ [Folder សម្រាប់យកទៅ Deploy ផ្ទាល់]
│   ├── index.html              -> ទំព័រដើមគេហទំព័រ (Main Portal)
│   ├── math_data.js            -> មូលដ្ឋានទិន្នន័យមេរៀន និងធនាគារសំណួរ ថ្នាក់ទី ៧-១០
│   ├── 📁 static/               -> Font Kantumruy Pro, KaTeX, CSS, JS, រូបភាព
│   ├── lesson-g7-l01.html      -> ទំព័រគំរូមេរៀនទី១ ថ្នាក់ទី៧
│   ├── geometry-angle-bisector.html -> បន្ទប់ស្ទូឌីយោសំណង់ធរណីមាត្រ
│   ├── exam-demo.html          -> បន្ទប់ប្រឡងសាកល្បង
│   ├── 404.html                -> ទំព័រជូនដំណឹងពេលរកមិនឃើញ URL
│   ├── _redirects              -> Routing config សម្រាប់ Netlify / Cloudflare
│   ├── vercel.json             -> Configuration សម្រាប់ Vercel
│   └── netlify.toml            -> Configuration សម្រាប់ Netlify
│
├── ⚡ Prepare_Deploy.bat        -> ចុចពីរដង (Double-click) ដើម្បី Update Folder dist ស្វ័យប្រវត្តិ
├── 🌐 Run_Test_Dist.bat        -> ចុចពីរដងដើម្បីតេស្តមើល Folder dist លើ Browser (Port 8080)
├── ⚙️ build_dist.py             -> Python Script សម្រាប់ចម្រាញ់ File ចូលទៅ dist/
├── 📄 vercel.json              -> Config ប្រសិនបើ Deploy តាមរយៈ GitHub ទៅ Vercel
├── 📄 netlify.toml             -> Config ប្រសិនបើ Deploy តាមរយៈ GitHub ទៅ Netlify
└── 📄 .gitignore               -> ការពារកុំឱ្យឡើង File ធំៗ (>840MB TeX files) ចូល Git
```

---

## 🌟 វិធី Deploy ងាយស្រួលៗចំនួន ៥ របៀប

---

### វិធីទី ១ ៖ Netlify Drop (ងាយស្រួលបំផុត មិនបាច់សរសេរកូដ — ចំណាយពេលត្រឹមតែ 10 វិនាទី)

1. បើក Browser ហើយចូលទៅកាន់ ៖ **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. Sign in ឬ Sign up គណនី Netlify (ឥតគិតថ្លៃ)។
3. **អូស (Drag and Drop) Folder `dist`** ទាំងមូលទម្លាក់ចូលទៅក្នុងប្រអប់លើទំព័រ Netlify។
4. រង់ចាំ ៥ ទៅ ១០ វិនាទី អ្នកនឹងទទួលបាន **Link គេហទំព័រ (Live URL)** ដំណើរការជាផ្លូវការភ្លាមៗ!
5. អ្នកអាចប្តូរឈ្មោះ Domain តាមចិត្ត (ឧ. `kpcambodianmath.netlify.app`)។

---

### វិធីទី ២ ៖ Vercel (លឿន និងពេញនិយមបំផុត)

#### ជម្រើស A (តាមរយៈ Vercel CLI) ៖
1. បើក Terminal / PowerShell រួច Run ៖
   ```bash
   npm i -g vercel
   ```
2. ចូលទៅកាន់ Folder គម្រោង ហើយ Run ៖
   ```bash
   vercel
   ```
   (Vercel នឹងស្គាល់ `vercel.json` ហើយ Deploy Folder `dist` ដោយស្វ័យប្រវត្តិ)។

#### ជម្រើស B (តាមរយៈ GitHub) ៖
1. Push Code ទៅកាន់ GitHub Repository របស់អ្នក។
2. ចូលទៅ **[https://vercel.com](https://vercel.com)** រួចចុច **Add New Project** -> ជ្រើសរើស Repo របស់អ្នក។
3. ចុច **Deploy** នោះ Vercel នឹងដំណើរការភ្លាមៗ!

---

### វិធីទី ៣ ៖ GitHub Pages (ឥតគិតថ្លៃ 100%)

1. បង្កើត GitHub Repository ថ្មីមួយ (ឧ. `kpcambodiamath`)។
2. នៅក្នុង Folder គម្រោង ដំណើរការ Command ៖
   ```bash
   git init
   git add .
   git commit -m "Deploy KPCambodianmathematics"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO>.git
   git push -u origin main
   ```
   *(ដោយសារយើងបានបង្កើត `.gitignore` រួចហើយ វានឹង Push ត្រឹមតែ ~13MB ប៉ុណ្ណោះ មិនឡើង File ធំៗឡើយ)*។
3. ចូលទៅ Settings នៃ Repository លើ GitHub -> ជ្រើសរើស **Pages** -> Source ជ្រើស **Deploy from a branch** -> Branch ជ្រើស **main** និង Folder ជ្រើស **/ (root)** ឬ Deploy តាមរយៈ GitHub Action សម្រាប់ `dist`។

---

### វិធីទី ៤ ៖ Cloudflare Pages (លឿនបំផុតទូទាំងពិភពលោក)

1. ចូលទៅកាន់ **[https://dash.cloudflare.com/](https://dash.cloudflare.com/)** -> **Workers & Pages** -> **Create application** -> **Pages**។
2. ជ្រើសរើស **Upload assets**។
3. អូស Folder **`dist`** ទម្លាក់ចូល រួចចុច **Deploy site**។

---

### វិធីទី ៥ ៖ លើ Web Hosting ធម្មតា (cPanel / DirectAdmin / Hostinger)

1. ចុចស្តាំលើ Folder **`dist`** រួចជ្រើសរើស **Send to -> Compressed (zipped) folder** (បង្កើតជា `dist.zip`)។
2. ចូលទៅកាន់ **cPanel -> File Manager -> `public_html`**។
3. ចុច **Upload** File `dist.zip` នោះឡើង។
4. ចុចស្តាំលើ `dist.zip` រួចជ្រើសយក **Extract** ពន្លា File ទាំងអស់ចេញក្នុង `public_html` ជាការស្រេច!

---

## 🔄 របៀបធ្វើបច្ចុប្បន្នភាព (Update) នៅពេលអ្នកកែប្រែកូដ

ប្រសិនបើថ្ងៃក្រោយអ្នកមានការកែប្រែទំព័រ `index.html` ឬទិន្នន័យ `math_data.js` ៖
1. គ្រាន់តែចុចពីរដង (Double-click) លើ File **`Prepare_Deploy.bat`**។
2. ប្រព័ន្ធនឹងធ្វើការចម្រាញ់ និង Update ចូលទៅ Folder **`dist/`** ជាថ្មីដោយស្វ័យប្រវត្តិតាមរយៈកូដ `build_dist.py`។
3. បន្ទាប់មកអ្នកអាចយក Folder `dist` ទៅ Deploy ម្តងទៀតបានយ៉ាងងាយស្រួលបំផុត!
