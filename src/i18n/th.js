export const th = {
  appName: 'ความรู้มี (ไม่) จำกัด',
  welcomeDescription: 'เว็บแอปสอนเขียน Python สาย Data Analyst สำหรับคนทำงานที่อยากเปลี่ยนสายงาน',

  // Navigation
  nav: {
    home: 'หน้าแรก',
    courses: 'คอร์สเรียน',
    glossary: 'คำศัพท์',
    settings: 'ตั้งค่า',
    devComponents: 'ส่วนประกอบ (Dev)',
  },

  // ScreenSizeGuard (SPEC หัวข้อ 4)
  screenSizeGuard: {
    title: 'ความกว้างหน้าจอไม่เพียงพอ',
    message: 'แอปนี้ออกแบบสำหรับคอมพิวเตอร์ กรุณาเปิดบนคอมพิวเตอร์หรือขยายหน้าต่าง',
  },

  // Callout titles (SPEC หัวข้อ 5, 8)
  callout: {
    tip: 'เคล็ดลับ',
    warning: 'ข้อควรระวัง',
    note: 'หมายเหตุ',
    mac: 'สำหรับผู้ใช้ Mac',
    excel: 'เทียบกับ Excel',
  },

  // Common UI
  common: {
    close: 'ปิด',
    openModal: 'เปิดหน้าต่างตัวอย่าง',
    showToast: 'แสดงข้อความแจ้งเตือน',
    modalTitle: 'ตัวอย่างหน้าต่าง Modal',
    modalContent: 'นี่คือตัวอย่างหน้าต่างโต้ตอบ (Modal Dialog) ที่สามารถปิดด้วยปุ่ม Esc หรือกดปุ่มปิดด้านบนได้',
    toastMessage: 'นี่คือข้อความแจ้งเตือนแบบ Toast',
    tooltipSample: 'ชี้เมาส์หรือกด Tab มาที่นี่เพื่อดู Tooltip',
    tooltipContent: 'ข้อความอธิบายเพิ่มเติมใน Tooltip',
    progressLabel: 'ความก้าวหน้าการเรียน',
  },

  // Dev Showcase Page
  dev: {
    title: 'Design System & Component Showcase',
    description: 'หน้านี้ใช้สำหรับตรวจสอบคอมโพเนนต์และการออกแบบในระบบ (เฉพาะโหมดพัฒนา)',
    buttonsSection: '1. ปุ่ม (Button)',
    cardsSection: '2. การ์ด (Card)',
    calloutsSection: '3. กล่องข้อความ (Callout)',
    badgesSection: '4. ป้ายสถานะ (Badge)',
    progressSection: '5. แถบความคืบหน้า (ProgressBar)',
    modalToastSection: '6. หน้าต่างและข้อความแจ้งเตือน (Modal & Toast)',
    tooltipSection: '7. ข้อความกำกับ (Tooltip)',
    contrastSection: '8. ตารางตรวจ Contrast คู่สีทั้งหมด (เกณฑ์ WCAG AA >= 4.5:1)',
    contrastHeaders: {
      pair: 'องค์ประกอบ',
      sample: 'ตัวอย่างข้อความ',
      fgColor: 'สีตัวอักษร',
      bgColor: 'สีพื้นหลัง',
      ratio: 'อัตราส่วน Contrast',
      result: 'ผลตรวจ',
    },
    pass: 'ผ่านเกณฑ์',
    fail: 'ไม่ผ่าน',
    screenGuardSection: '9. ระบบจำกัดขนาดหน้าจอ (ScreenSizeGuard)',
    screenGuardNote: 'ทดสอบได้โดยการย่อความกว้างหน้าต่างเบราว์เซอร์ให้น้อยกว่า 1024px',
  },
}
