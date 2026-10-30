---
name: write-lesson
description: ใช้เมื่อเจ้าของสั่งให้วางโครงโมดูลหรือเขียนบทเรียนใน content/modules/ เพื่อให้บทเรียนมีโครงสร้าง ภาษา และความถูกต้องตามมาตรฐานของโปรเจกต์
---

# write-lesson

skill นี้มี 2 โหมด คือ **A วางโครงโมดูล** และ **B เขียนบท** ถ้าเจ้าของไม่ได้ระบุโหมด ให้ถามก่อน

## ก่อนเริ่มทุกครั้ง ให้อ่าน
1. `content/AGENTS.md`
2. `docs/SPEC.md` หัวข้อ 7, 8, 11 และ 12
3. `module.yaml` และ `outline.md` ของโมดูลนี้ (ถ้ามี)
4. field `introduces` ของทุกบทก่อนหน้า โดยไล่ตามลำดับใน `course.yaml` แล้วสรุปเป็นรายการ "สิ่งที่ผู้เรียนรู้แล้ว"
5. `content/glossary.yaml` และ `content/datasets/README.md`

## โหมด A วางโครงโมดูล
1. สร้าง `content/modules/<module-id>/outline.md` เป็นตาราง:
   | ลำดับ | id | ชื่อบท | objectives | introduces | แนวแบบฝึกหัด | นาที |
2. เพิ่มหัวข้อ "Mini project ท้ายโมดูล" ถ้า SPEC หัวข้อ 12 กำหนดไว้
3. ตรวจว่าไม่มีบทไหนใช้สิ่งที่ยังไม่ได้สอน และแต่ละบทมีแนวคิดใหม่ไม่เกิน 3 อย่าง
4. หยุดรอให้เจ้าของอนุมัติ ห้ามเริ่มเขียนบทจริง

## โหมด B เขียนบท
1. เขียนตาม outline ที่เจ้าของอนุมัติแล้ว ครั้งละไม่เกิน 5 บท
2. สร้างไฟล์ให้แต่ละบท:
   - `lessons/<lesson-id>/lesson.md` โดยใช้ `lesson-template.md`
   - `lessons/<lesson-id>/exercise.yaml` โดยใช้ `exercise-template.yaml`
   - เพิ่ม id ของบทลงใน `module.yaml`
3. ถ้ามีศัพท์ใหม่ ให้เพิ่มลง `content/glossary.yaml`
4. รัน `npm run content:build` และ `npm run content:check` จนผ่าน
5. ตรวจงานตัวเองตาม checklist ใน `.agents/skills/review-lesson/SKILL.md`
6. ส่งสรุปที่มี: รายการบทพร้อม path, ศัพท์ใหม่, **จุดที่ไม่แน่ใจและต้องให้คนตรวจ**, ผล content:check และแนะนำให้เจ้าของเปิดแชทใหม่เพื่อใช้ skill `review-lesson`
7. ห้ามแก้ outline เองระหว่างเขียน ถ้าจำเป็นต้องเปลี่ยน ให้ถามเจ้าของก่อน