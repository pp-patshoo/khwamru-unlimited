# AGENTS.md — ความรู้มี (ไม่) จำกัด

> กฎหลักของโปรเจกต์ ต้องทำตามทุกครั้ง

## 1. โปรเจกต์นี้คืออะไร
เว็บแอปสอนเขียน Python สาย Data Analyst สำหรับคนทำงานที่อยากเปลี่ยนสายงาน เริ่มจากศูนย์ ผู้เรียนเรียนเองตามบทเรียน ใช้ภาษาไทยเป็นหลักและมีศัพท์ภาษาอังกฤษกำกับ แอปใช้ฟรีและเป็น open source

- ไม่มี backend: เป็นเว็บ static + PWA และโค้ด Python ของผู้เรียนรันในเบราว์เซอร์ด้วย Pyodide
- ต้องต่อเน็ตเฉพาะตอนเปิดครั้งแรก หลังจากนั้นใช้แบบ offline ได้
- ข้อมูลของผู้เรียนเก็บใน IndexedDB บนเครื่องผู้เรียนทั้งหมด
- ใช้บนคอมพิวเตอร์เท่านั้น โดยรองรับ Windows เป็นหลักและรองรับ macOS ด้วย

เอกสารที่ต้องอ่านประกอบ:
- `docs/SPEC.md` — สเปกเต็มของแอป
- `docs/PLAN.md` — รายการงาน (task) และเกณฑ์ผ่านของแต่ละงาน
- `docs/DECISIONS.md` — บันทึกการตัดสินใจทางเทคนิค
- `content/AGENTS.md` — กฎการเขียนบทเรียน

## 2. เกี่ยวกับเจ้าของโปรเจกต์
เจ้าของโปรเจกต์ไม่ใช่โปรแกรมเมอร์ และจะตรวจงานทีละส่วนด้วยตัวเอง
- คุยกับเจ้าของเป็นภาษาไทยด้วยคำง่าย ๆ ถ้าต้องใช้ศัพท์เทคนิค ให้อธิบายสั้น ๆ ในวงเล็บ
- เมื่อต้องให้เจ้าของทำอะไร ให้บอกเป็นขั้นตอนทีละข้อ พร้อมคำสั่งที่ต้องพิมพ์และผลที่ควรเห็น
- ระบุ path ของไฟล์ทุกครั้งที่พูดถึงไฟล์

## 3. วิธีทำงาน (สำคัญที่สุด)
1. ทำงานทีละ task ตาม `docs/PLAN.md` เท่านั้น เมื่อเสร็จแล้วให้หยุดรอ ห้ามเริ่ม task ถัดไปเอง
2. ก่อนเขียนโค้ด ให้เขียน implementation plan สั้น ๆ ซึ่งบอกไฟล์ที่จะสร้างหรือแก้ วิธีทำ และจุดที่ยังไม่แน่ใจ แล้วรอให้เจ้าของอนุมัติ
3. ทำเฉพาะงานในขอบเขตของ task ถ้าพบปัญหาหรือมีไอเดียนอกขอบเขต ให้จดไว้ในหัวข้อ "ข้อสังเกต" ของสรุปงาน ห้ามลงมือแก้เอง
4. ถ้า requirement ไม่ชัด ขัดกันเอง หรือทำตามแล้วไม่ได้ผล ให้หยุดแล้วถามเจ้าของ ห้ามเดา
5. เมื่อทำ task เสร็จ ให้ใช้ skill `finish-task` ทุกครั้ง
6. ห้าม `git commit` หรือ `git push` จนกว่าเจ้าของจะพิมพ์ว่า "ผ่าน"
7. ห้ามเพิ่ม dependency ที่ไม่อยู่ในหัวข้อ 4 โดยไม่ถามก่อน และ dependency ทุกตัวต้องใช้ license MIT, Apache-2.0, BSD, ISC หรือ OFL
8. ถ้าต้องตัดสินใจทางเทคนิคเรื่องที่เอกสารไม่ได้ระบุ ให้บันทึกลง `docs/DECISIONS.md`
9. ห้ามแก้ `docs/SPEC.md` เอง ถ้าคิดว่าสเปกควรเปลี่ยน ให้เสนอเจ้าของก่อน
10. ถ้าเกณฑ์ผ่านข้อใดทำไม่ได้ ให้แจ้งตรง ๆ ห้ามรายงานว่าทำได้แล้ว
11. Git: ห้ามใช้ `git push --force`, `git reset --hard`, `git rebase`, `git clean`, ห้ามลบ branch หรือแก้ประวัติ commit ถ้าคิดว่าจำเป็นต้องใช้ ให้ถามเจ้าของก่อนและอธิบายผลกระทบ
12. ห้ามขอ token หรือรหัสผ่าน GitHub และห้ามเขียนข้อมูลลับลงไฟล์ใด ๆ ถ้า push ไม่ผ่านเพราะเรื่องสิทธิ์ ให้แจ้งเจ้าของเพื่อ login เอง

## 4. Tech Stack (ห้ามเปลี่ยนโดยไม่ถาม)
| ส่วน | ใช้ |
|---|---|
| ภาษา | JavaScript (ESM, JSX) ไม่ใช้ TypeScript และใส่ JSDoc ให้ฟังก์ชันสำคัญ |
| Build | Vite |
| UI | React (function components + hooks) |
| Routing | react-router แบบ `HashRouter` |
| Styling | CSS Modules + CSS variables จาก `src/styles/tokens.css` |
| ไอคอน | lucide-react |
| Code editor | CodeMirror 6 ผ่าน `@uiw/react-codemirror`, `@codemirror/lang-python`, `@codemirror/lang-sql` |
| รัน Python | Pyodide ใน Web Worker (กำหนดเวอร์ชันไว้ที่ `src/config.js` จุดเดียว) |
| Markdown | `react-markdown`, `remark-gfm`, `remark-directive` |
| อ่านเนื้อหาตอน build | `gray-matter`, `yaml`, `zod` |
| เก็บข้อมูล | Dexie (IndexedDB) |
| PWA / offline | `vite-plugin-pwa` (Workbox) |
| ฟอนต์ | `@fontsource/ibm-plex-sans-thai`, `@fontsource/jetbrains-mono` |
| Test | Vitest + @testing-library/react |
| Lint / Format | ESLint + Prettier |
| Deploy | GitHub Pages ผ่าน GitHub Actions |

## 5. ข้อห้าม
- ห้ามมีโค้ดฝั่งเซิร์ฟเวอร์ ฐานข้อมูลออนไลน์ ระบบ login หรือ API ที่ต้องใช้ key
- ห้ามใส่ analytics, tracking หรือ cookie ของบุคคลที่สาม
- ห้ามโหลดฟอนต์ ไอคอน หรือ CSS จาก CDN ยกเว้นไฟล์ของ Pyodide ซึ่งต้อง cache ด้วย service worker
- ห้ามเขียนข้อความที่ผู้ใช้เห็นไว้ในคอมโพเนนต์โดยตรง ให้เก็บไว้ใน `src/i18n/th.js`
- ห้ามกำหนดสี ขนาด หรือฟอนต์ไว้ในโค้ดโดยตรง ให้ใช้ CSS variables จาก `tokens.css`
- ห้ามแก้ไฟล์ใน `src/generated/` ด้วยมือ ไฟล์ในโฟลเดอร์นี้ต้องสร้างจากสคริปต์เท่านั้น
- task ด้านโค้ดห้ามแก้ไฟล์ใน `content/` และ task ด้านเนื้อหาห้ามแก้ไฟล์ใน `src/` ยกเว้น task นั้นระบุไว้

## 6. โครงสร้างโฟลเดอร์
```
khwamru-unlimited/
├── AGENTS.md
├── LICENSE                      # MIT สำหรับโค้ด
├── README.md
├── .agents/skills/              # finish-task, write-lesson, review-lesson
├── .github/workflows/           # CI และ deploy
├── docs/                        # SPEC.md, PLAN.md, DECISIONS.md
├── content/                     # เนื้อหาทั้งหมด (CC BY-NC-SA 4.0)
│   ├── AGENTS.md
│   ├── LICENSE
│   ├── glossary.yaml
│   ├── errors.yaml
│   ├── datasets/README.md       # สร้างจากสคริปต์
│   ├── courses/<course-id>/course.yaml
│   └── modules/<module-id>/
│       ├── module.yaml
│       ├── outline.md
│       └── lessons/<lesson-id>/lesson.md, exercise.yaml
├── public/
│   ├── datasets/                # CSV ที่สร้างจากสคริปต์
│   ├── fonts/                   # ฟอนต์ไทย TTF สำหรับ matplotlib
│   └── icons/
├── scripts/
│   ├── build-content.mjs
│   ├── check-content.mjs
│   └── generate-datasets.mjs
└── src/
    ├── main.jsx, App.jsx, config.js
    ├── components/              # UI ที่ใช้ซ้ำ
    ├── features/                # runner, editor, lessons, exercises, progress, glossary, settings
    ├── pages/
    ├── workers/pyodide.worker.js
    ├── generated/               # สร้างอัตโนมัติ (อยู่ใน .gitignore)
    ├── i18n/th.js
    └── styles/tokens.css, global.css
```

## 7. มาตรฐานโค้ด
- ตั้งชื่อไฟล์คอมโพเนนต์เป็น `PascalCase.jsx` และไฟล์อื่นเป็น `camelCase.js`
- ตั้งชื่อตัวแปรและฟังก์ชันเป็นภาษาอังกฤษ comment เขียนเป็นภาษาไทยได้ ส่วนที่ซับซ้อนให้อธิบายว่าทำไมจึงเขียนแบบนั้น
- คอมโพเนนต์หนึ่งไฟล์ไม่ควรยาวเกินประมาณ 200 บรรทัด ถ้ายาวกว่านั้นให้แยกไฟล์
- logic ที่ไม่ใช่ UI ต้องอยู่ในไฟล์ `.js` แยก และต้องมี unit test
- Accessibility: ทุกส่วนต้องใช้งานด้วยคีย์บอร์ดได้ มี focus ที่มองเห็นชัด ปุ่มที่มีแต่ไอคอนต้องมี `aria-label` และตัวอักษรต้องมี contrast อย่างน้อย 4.5:1
- จุดที่อาจเกิด error ได้ เช่น การโหลด Pyodide, IndexedDB และการ import ไฟล์ ต้องจัดการ error และแสดงข้อความภาษาไทยที่บอกผู้เรียนว่าควรทำอะไรต่อ

## 8. คำสั่งที่ใช้บ่อย
| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `npm run dev` | เปิดแอปบนเครื่องเพื่อทดสอบ |
| `npm run build` | build แอป โดยรัน content:build ก่อน |
| `npm run preview` | เปิดแอปที่ build แล้ว ใช้ทดสอบ PWA และโหมด offline |
| `npm test` | รัน unit test |
| `npm run lint` | ตรวจรูปแบบโค้ด |
| `npm run content:build` | แปลงเนื้อหาใน `content/` เป็น JSON ใน `src/generated/` |
| `npm run content:check` | รันโค้ดตัวอย่างและเฉลยของทุกบท |
| `npm run data:generate` | สร้างข้อมูลสมมติชุดใหม่ |

## 9. นิยามคำว่า "เสร็จ" (Definition of Done)
- ทำครบทุกข้อใน "เกณฑ์ผ่าน" ของ task
- `npm run lint`, `npm test` และ `npm run build` ผ่าน และถ้ามีการแก้เนื้อหา `npm run content:check` ต้องผ่านด้วย
- console ของเบราว์เซอร์ไม่มี error
- ส่งสรุปงานตาม skill `finish-task` แล้ว