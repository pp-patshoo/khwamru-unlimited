# PLAN — แผนงาน

วิธีใช้: ทำทีละ task ตามลำดับ เมื่อเจ้าของพิมพ์ "ผ่าน" ให้เปลี่ยน [ ] เป็น [x]

## Phase 0 เตรียมโปรเจกต์

### [x] T0.1 สร้างโปรเจกต์
- สร้างไฟล์ `.nvmrc` ที่ระบุเลขเวอร์ชันหลักของ Node.js ที่เจ้าของติดตั้ง (ดูจาก `node -v`) และเพิ่ม `"engines": { "node": ">=<เวอร์ชันหลัก>" }` ใน package.json
- สร้างโปรเจกต์ Vite + React (JavaScript) และติดตั้ง dependency ตาม AGENTS.md หัวข้อ 4
- สร้างโครงสร้างโฟลเดอร์ตาม AGENTS.md หัวข้อ 6, ตั้งค่า ESLint + Prettier + Vitest และเขียน test ตัวอย่าง 1 ชุด
- เพิ่ม npm scripts ตาม AGENTS.md หัวข้อ 8 สคริปต์ที่ยังไม่ได้ทำให้แสดงข้อความว่า "ยังไม่ได้ทำ (ดู Txx)"
- ตั้ง `base` ใน vite config ให้รองรับ GitHub Pages (`/khwamru-unlimited/`)
- สร้าง `.gitignore`, `LICENSE` (MIT), `content/LICENSE` (CC BY-NC-SA 4.0), `README.md` ภาษาไทย และ `docs/DECISIONS.md`
- รัน `git init`
**เกณฑ์ผ่าน:** `npm run dev` แสดงหน้า "ความรู้มี (ไม่) จำกัด" และ lint, test, build ผ่านทั้งหมด
**เจ้าของตรวจ:** รัน `npm run dev` แล้วเปิดลิงก์ที่ terminal แสดง
- สร้าง `.gitattributes` ที่มี `* text=auto eol=lf` และกำหนดให้ไฟล์ฟอนต์ ไอคอน และ PNG เป็น `binary`
- หลัง `git init` ให้รัน `git remote add origin <URL ที่เจ้าของให้>` และเมื่อเจ้าของพิมพ์ "ผ่าน" ให้รัน `git push -u origin main`

### [x] T0.2 Design system และ Layout
- สร้าง `tokens.css` ตาม SPEC หัวข้อ 5, ติดตั้งฟอนต์ผ่าน fontsource และสร้าง `global.css`
- สร้างคอมโพเนนต์ Button (primary/secondary/ghost), Card, Callout (tip/warning/note/mac/excel), Badge, ProgressBar, Modal, Toast และ Tooltip
- สร้าง AppLayout ที่มี header (ชื่อแอป + เมนู คอร์ส/คำศัพท์/ตั้งค่า) และสร้าง ScreenSizeGuard สำหรับหน้าจอกว้างน้อยกว่า 1024px
- สร้างหน้า `/dev/components` แสดงคอมโพเนนต์ทั้งหมด
**เกณฑ์ผ่าน:** สีตัวอักษรทุกคู่มี contrast อย่างน้อย 4.5:1 (ให้แสดงตารางผลตรวจ) กด Tab แล้วเห็น focus ชัด และไม่มีการโหลดฟอนต์จาก CDN
**เจ้าของตรวจ:** เปิด `/#/dev/components` ดูหน้าตา แล้วลองย่อหน้าต่างให้แคบลง
- หมายเหตุ: เพิ่มเฉดสีพื้นหลังโทนอ่อนสำหรับ Callout และ Badge ลงใน tokens.css เพื่อให้ทุกคู่สีผ่านเกณฑ์ WCAG AA (contrast >= 4.5:1) โดยบันทึกการตัดสินใจใน DECISIONS.md

### [ ] T0.3 Routing และโครงหน้า
- สร้าง route ทุกหน้าตาม SPEC หัวข้อ 4 โดยใช้ HashRouter ใส่เนื้อหาชั่วคราวไว้ก่อน และมีหน้า 404
- เก็บข้อความทั้งหมดไว้ใน `src/i18n/th.js`
**เกณฑ์ผ่าน:** คลิกเมนูไปได้ทุกหน้า และกดปุ่ม Back ของเบราว์เซอร์แล้วทำงานถูกต้อง

## Phase 1 ระบบรันโค้ด

### [ ] T1.1 Pyodide Worker
- กำหนด `PYODIDE_VERSION` และ URL ไว้ใน `src/config.js` โดยใช้เวอร์ชัน stable ล่าสุด แล้วบันทึกเหตุผลใน DECISIONS.md
- เขียน worker ตาม protocol ใน SPEC หัวข้อ 6 ให้รองรับ stdout/stderr, stdin, namespace ใหม่ทุกครั้งที่รัน, การแสดงค่าบรรทัดสุดท้าย และ error ที่ระบุเลขบรรทัดถูกต้อง
- สร้าง `runnerClient.js` ที่เรียกใช้แบบ Promise และติดตามสถานะได้ (loading/ready/running/error) และให้เริ่มโหลดเบื้องหลังหลังหน้าแรกแสดงผล
- เขียน unit test สำหรับฟังก์ชันที่แยก traceback และสร้างหน้า `/dev/runner` สำหรับทดสอบ
**เกณฑ์ผ่าน:** `print("สวัสดี")` แสดงผลภาษาไทยถูกต้อง, `input()` อ่านค่าจาก stdin ได้, error แสดงเลขบรรทัดของโค้ดผู้เรียนถูกต้อง และ `1 + 1` ในบรรทัดสุดท้ายแสดง `2`

### [ ] T1.2 Editor, Output และปุ่มหยุด
- สร้าง CodeEditor (python/sql) ที่มีเลขบรรทัด ย่อหน้าครั้งละ 4 ช่องว่าง กด Tab แล้วได้ 4 ช่องว่าง และกด Ctrl+Enter เพื่อรัน
- สร้าง OutputPanel ที่แสดง stdout, stderr, รูป, ตาราง และสถานะ สร้าง RunControls ที่มีปุ่มรัน/หยุด/รีเซ็ต และสร้าง StdinBox
- ทำระบบหยุดโค้ดอัตโนมัติที่ 10 วินาที ระบบเริ่ม worker ใหม่ และการจำกัด output
- รวมทั้งหมดเป็นคอมโพเนนต์ `CodePlayground`
**เกณฑ์ผ่าน:** เมื่อรัน `while True: pass` แอปไม่ค้าง หยุดเองภายในประมาณ 10 วินาทีพร้อมข้อความภาษาไทย และรันโค้ดครั้งถัดไปได้ตามปกติ ปุ่ม "หยุด" ใช้งานได้

### [ ] T1.3 Package, ไฟล์ข้อมูล และกราฟ
- โหลด package ตามที่โค้ดเรียกใช้และตามที่บทกำหนด เขียนไฟล์ข้อมูลลงในระบบไฟล์ของ Pyodide และแสดง DataFrame เป็นตาราง
- ตั้งค่า matplotlib ให้ใช้ Agg พร้อมฟอนต์ไทย โดยวางไฟล์ TTF ที่ใช้ license OFL ไว้ใน `public/fonts/` พร้อมไฟล์ license และแปลงกราฟเป็นรูป
- งานนี้ยังไม่มีไฟล์ข้อมูลจริง ให้ใช้ CSV ทดสอบขนาดเล็กใน `public/datasets/_test.csv` ไปก่อน
**เกณฑ์ผ่าน:** `pd.read_csv("data/_test.csv").head()` แสดงเป็นตาราง กราฟที่มีชื่อภาษาไทยแสดงภาษาไทยถูกต้อง และระหว่างโหลด pandas มีข้อความแจ้งสถานะ

### [ ] T1.4 โหมด SQL
- สร้าง SQLite จาก CSV ตาม SPEC หัวข้อ 6 รันคำสั่ง SQL แสดงผลเป็นตาราง (สูงสุด 200 แถวพร้อมบอกจำนวนแถวทั้งหมด) และแสดง error
**เกณฑ์ผ่าน:** `SELECT * FROM _test` แสดงผลได้ และเมื่อพิมพ์ SQL ผิดจะเห็น error พร้อมคำอธิบายภาษาไทย

### [ ] T1.5 ตัวช่วยอ่าน error
- เขียนระบบตรวจโค้ดก่อนรันตาม SPEC หัวข้อ 6
- สร้าง `content/errors.yaml` (task นี้ได้รับอนุญาตให้แก้ไฟล์ใน content) ให้ครอบคลุม SyntaxError, IndentationError, NameError, TypeError, ValueError, IndexError, KeyError, AttributeError, ZeroDivisionError, FileNotFoundError, ModuleNotFoundError และ EOFError รวมถึง KeyError เมื่อเรียกชื่อคอลัมน์ pandas ผิด และ sqlite3 OperationalError (no such table/column)
- สร้างคอมโพเนนต์ ErrorExplainer
**เกณฑ์ผ่าน:** มี unit test ครอบคลุมการตรวจเครื่องหมายคำพูดแบบโค้งและการจับคู่ pattern ของ error และเมื่อรัน `print(“hi”)` จะเห็นคำเตือนก่อนรัน

## Phase 2 ข้อมูลสมมติ

### [ ] T2.1 สคริปต์สร้างข้อมูลบ้านกาแฟ
- เขียน `scripts/generate-datasets.mjs` ตาม SPEC หัวข้อ 11 ให้สร้างไฟล์ CSV ใน `public/datasets/` และสร้าง `content/datasets/README.md`
- เปลี่ยนไฟล์ทดสอบเดิมไปใช้ข้อมูลจริง
**เกณฑ์ผ่าน:** มี test ยืนยันว่ารัน 2 ครั้งแล้วได้ไฟล์เหมือนกันทุกไบต์ จำนวนปัญหาใน README ตรงกับข้อมูลจริง และรูปแบบข้อมูลตาม SPEC เห็นได้จากตัวเลขใน README
**เจ้าของตรวจ:** เปิดไฟล์ CSV ใน Antigravity และอ่าน README

## Phase 3 ระบบเนื้อหา

### [ ] T3.1 Schema และ build-content
- เขียน schema ด้วย zod ตาม SPEC หัวข้อ 7–8 และเขียน `scripts/build-content.mjs` ให้สร้าง `src/generated/content.json`
- ถ้าเนื้อหาผิดรูปแบบ ให้แสดงข้อความภาษาไทยที่บอก path ของไฟล์และสาเหตุ ต้องตรวจว่า id ไม่ซ้ำ โมดูลและศัพท์ที่อ้างถึงมีอยู่จริง
- สร้าง `course.yaml` ของ data-analyst แบบโครงร่าง และโมดูล `_demo` (`draft: true`) ที่มี 3 บท ครบแบบฝึกหัดทุก type และ syntax พิเศษทุกแบบ
**เกณฑ์ผ่าน:** ถ้าเนื้อหาผิดรูปแบบ build ต้องล้มและบอกสาเหตุชัดเจน และมี test ครอบคลุม schema

### [ ] T3.2 หน้าเรียน (LessonView)
- render Markdown, กล่อง callout, code block ที่รันได้ (CodePlayground ขนาดเล็ก), tooltip ของศัพท์, เป้าหมายของบท และเวลาเรียนโดยประมาณ
- มี sidebar รายการบท และปุ่มบทก่อนหน้า/บทถัดไป
**เกณฑ์ผ่าน:** บทใน `_demo` แสดงผลถูกต้องทุก syntax และใช้งานด้วยคีย์บอร์ดได้

### [ ] T3.3 ระบบแบบฝึกหัด
- สร้าง ExercisePanel ที่รองรับทั้ง 5 type ตาม SPEC หัวข้อ 8 ให้ตรวจ output/assert/sql ใน worker และมีลำดับการเปิดคำใบ้และเฉลยตามสเปก
- ทำ animation เมื่อผ่าน และส่ง event เมื่อเรียนจบบท (ยังไม่บันทึกลงฐานข้อมูล)
**เกณฑ์ผ่าน:** ตอบถูกแล้วผ่าน ตอบผิดแล้วเห็นข้อความจาก assert และปุ่มดูเฉลยแสดงตามเงื่อนไข

### [ ] T3.4 หน้าคำศัพท์และหน้าภาพรวมคอร์ส
- ทำหน้า `/glossary` และ `/courses/:courseId` ให้ใช้ข้อมูลจริง รวมถึงส่วนพื้นฐานที่ต้องมีก่อนเรียน
**เกณฑ์ผ่าน:** ค้นหาศัพท์ได้ทั้งภาษาไทยและอังกฤษ

### [ ] T3.5 สคริปต์ตรวจเนื้อหา (content:check)
- เขียน `scripts/check-content.mjs` ให้ใช้ Pyodide ใน Node เวอร์ชันเดียวกับ `config.js`
- ตรวจว่า block `run` รันผ่าน, block `run error` เกิด error จริง, เฉลยผ่าน test ทุกข้อ และโค้ดเริ่มต้นต้องไม่ผ่าน test เพราะถ้าผ่าน แบบฝึกหัดนั้นก็ไม่มีความหมาย
- ตรวจ SQL ด้วย ส่วนเวลาเรียนที่อยู่นอกช่วง 10–15 นาที และบทที่ยาวเกิน 800 คำ ให้แจ้งเป็นคำเตือน
- สรุปผลเป็นภาษาไทย
**เกณฑ์ผ่าน:** `_demo` ผ่าน และถ้าแก้เฉลยให้ผิด สคริปต์ต้องจับได้

## Phase 4 ความก้าวหน้า

### [ ] T4.1 ฐานข้อมูลและการบันทึกโค้ดอัตโนมัติ
- ทำตาม SPEC หัวข้อ 9 สร้าง Dexie schema และ repository รวมถึงบันทึกโค้ดอัตโนมัติและปุ่มรีเซ็ตโค้ด
**เกณฑ์ผ่าน:** ปิดแล้วเปิดเบราว์เซอร์ใหม่ โค้ดและสถานะการผ่านแบบฝึกหัดยังอยู่

### [ ] T4.2 เรียนต่อ ความก้าวหน้า และเป้าหมายรายสัปดาห์
- ทำปุ่ม "เรียนต่อ" แถบความก้าวหน้าของคอร์สและโมดูล คำเตือนเมื่อข้ามบท และวิดเจ็ตเป้าหมายรายสัปดาห์
**เกณฑ์ผ่าน:** มี unit test สำหรับการนับสัปดาห์ (วันจันทร์ถึงวันอาทิตย์)

### [ ] T4.3 Export/Import และดาวน์โหลดโค้ด
- Export/Import ความก้าวหน้า, ล้างข้อมูลโดยยืนยัน 2 ครั้ง และดาวน์โหลดโค้ดเป็น `.py` หรือ `.ipynb`
**เกณฑ์ผ่าน:** Export แล้วล้างข้อมูล จากนั้น Import กลับมา ข้อมูลต้องเหมือนเดิม และไฟล์ `.ipynb` เปิดใน Jupyter ได้

### [ ] T4.4 แบบทดสอบข้ามส่วนที่ 0
- ทำหน้า placement และร่างคำถาม 10 ข้อใน `content/modules/computer-basics/placement.yaml` (task นี้ได้รับอนุญาตให้แก้ไฟล์ใน content)
**เกณฑ์ผ่าน:** ตอบถูกตั้งแต่ 8 ข้อขึ้นไป บทในส่วนที่ 0 จะมีสถานะ `skipped`

## Phase 5 PWA และเผยแพร่

### [ ] T5.1 PWA และโหมด Offline
- ตั้งค่า manifest, ไอคอน (ใช้ `@vite-pwa/assets-generator` ได้), precache, runtime cache, ปุ่มดาวน์โหลดสำหรับใช้ offline, toast แจ้งอัปเดต และตัวแสดงสถานะ offline
**เกณฑ์ผ่าน:** รัน `npm run build` และ `npm run preview` แล้วกดดาวน์โหลดสำหรับใช้ offline จากนั้นเปิด DevTools > Network > Offline แล้วรีโหลดหน้า ต้องยังรันโค้ด pandas ได้
**เจ้าของตรวจ:** agent ต้องเขียนขั้นตอนทดสอบแบบละเอียดให้

### [ ] T5.2 GitHub, CI และ Deploy
- ใน workflow ให้ใช้ `actions/setup-node` แบบ `node-version-file: .nvmrc` เพื่อให้ CI ใช้ Node.js เวอร์ชันเดียวกับเครื่องเจ้าของ
- เขียน workflow ที่รัน lint, test, content:check และ build แล้ว deploy ไปยัง GitHub Pages
- เขียนขั้นตอนให้เจ้าของสร้าง repo และตั้งค่า Pages ทีละขั้น
**เกณฑ์ผ่าน:** push แล้วเว็บขึ้นที่ `https://<username>.github.io/khwamru-unlimited/`

### [ ] T5.3 เก็บรายละเอียดและออกเวอร์ชัน v0.1
- ทำหน้า About, ลิงก์ feedback, คำแนะนำสำหรับเบราว์เซอร์ที่ไม่รองรับ และอัปเดต README
- ทดสอบการใช้งานด้วยคีย์บอร์ดอย่างเดียวทั้งแอป
**เกณฑ์ผ่าน:** สร้าง tag `v0.1.0`

## Phase 6 เนื้อหา v1.0
งานเนื้อหาทุก task ใช้ขั้นตอนเดียวกัน คือใช้ skill `write-lesson` ดังนี้:
(ก) วางโครงโมดูล แล้วรอเจ้าของอนุมัติ
(ข) เขียนบทครั้งละไม่เกิน 5 บท แล้วรัน content:check
(ค) เจ้าของเปิดแชทใหม่แล้วใช้ skill `review-lesson`
(ง) แก้ตามรายงาน
(จ) เจ้าของตรวจ แล้วพิมพ์ "ผ่าน"

- [ ] T6.1 `course.yaml` ฉบับสมบูรณ์, เพิ่มศัพท์เริ่มต้นใน glossary ประมาณ 40 คำ และเขียนโมดูล `da-intro`
- [ ] T6.2 `computer-basics`
- [ ] T6.3 `python-basics` (แบ่งเป็นหลายชุด ชุดละไม่เกิน 5 บท)
- [ ] T6.4 `stats-basics`
- [ ] T6.5 `pandas-basics`
- [ ] T6.6 `data-cleaning`
- [ ] T6.7 `data-summary`
- [ ] T6.8 ออกเวอร์ชัน v1.0: เจ้าของลองเรียนเองตั้งแต่ต้นจนจบ และให้ผู้ทดลองใช้ 2–3 คนส่ง feedback

## Phase 7 v1.1
- [ ] T7.1 `visualization`
- [ ] T7.2 `sql`
- [ ] T7.3 ออกเวอร์ชัน v1.1

## Phase 8 v1.2
- [ ] T8.1 `storytelling-project` (รวมโปรเจกต์จบ)
- [ ] T8.2 `beyond-browser`
- [ ] T8.3 `sql-advanced`
- [ ] T8.4 Dark Mode (task ด้านโค้ด)
- [ ] T8.5 ออกเวอร์ชัน v1.2