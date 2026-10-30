# ความรู้มี (ไม่) จำกัด

เว็บแอปสอนเขียน Python สาย Data Analyst สำหรับคนทำงานที่อยากเปลี่ยนสายงาน เริ่มต้นจากศูนย์ ผู้เรียนสามารถเรียนรู้ได้ด้วยตนเองตามบทเรียน โดยใช้ภาษาไทยเป็นหลักและมีศัพท์ภาษาอังกฤษกำกับ แอปใช้งานได้ฟรีและเป็นโอเพนซอร์ส (Open Source)

## จุดเด่นของโปรเจกต์
- **ไม่มี Backend:** เป็นเว็บ static + PWA โค้ด Python ของผู้เรียนรันในเบราว์เซอร์โดยตรงด้วย Pyodide (Web Worker)
- **ใช้งาน Offline ได้:** ต้องต่ออินเทอร์เน็ตเฉพาะตอนเปิดใช้งานครั้งแรก หลังจากนั้นสามารถใช้งานแบบออฟไลน์ได้
- **ความเป็นส่วนตัวสูง:** ข้อมูลและความก้าวหน้าของผู้เรียนทั้งหมดเก็บไว้ในเครื่องผ่าน IndexedDB (Dexie) ไม่มีการส่งข้อมูลออกนอกเครื่อง
- **ออกแบบเพื่อคอมพิวเตอร์:** รองรับการใช้งานบนหน้าจอคอมพิวเตอร์ (รองรับ Windows เป็นหลัก และรองรับ macOS)

## Tech Stack
- **UI:** React (Function Components + Hooks), Vite
- **Routing:** react-router (HashRouter)
- **Styling:** CSS Modules + CSS Variables (tokens.css)
- **Code Editor:** CodeMirror 6
- **Python Execution:** Pyodide
- **Icons:** Lucide React
- **Fonts:** IBM Plex Sans Thai, JetBrains Mono (ติดตั้งผ่าน Fontsource)
- **Testing:** Vitest + Testing Library
- **Linting & Formatting:** ESLint + Prettier

## คำสั่งที่ใช้บ่อย
| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | เปิดแอปบนเครื่องเพื่อทดสอบการทำงาน |
| `npm run build` | รัน build แอปสำหรับ production (จะรัน content:build ก่อน) |
| `npm run preview` | เปิดพรีวิวแอปที่ build แล้ว (ใช้ทดสอบ PWA และโหมด offline) |
| `npm test` | รัน unit test ด้วย Vitest |
| `npm run lint` | ตรวจสอบรูปแบบโค้ดด้วย ESLint |
| `npm run content:build` | แปลงเนื้อหาในโฟลเดอร์ `content/` เป็นไฟล์ JSON |
| `npm run content:check` | ทดสอบความถูกต้องของโค้ดตัวอย่างและเฉลยของทุกบทเรียน |
| `npm run data:generate` | สร้างชุดข้อมูลตัวอย่างใหม่ |

## สัญญาอนุญาต (License)
- ส่วนของซอร์สโค้ด: [MIT License](LICENSE)
- ส่วนของเนื้อหาบทเรียน (`content/`): [CC BY-NC-SA 4.0](content/LICENSE)

