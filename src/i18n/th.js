export const th = {
  appName: 'ความรู้มี (ไม่) จำกัด',
  welcomeDescription: 'เว็บแอปสอนเขียน Python สาย Data Analyst สำหรับคนทำงานที่อยากเปลี่ยนสายงาน',

  // Navigation
  nav: {
    home: 'หน้าแรก',
    courses: 'คอร์สเรียน',
    glossary: 'คำศัพท์',
    settings: 'ตั้งค่า',
    about: 'เกี่ยวกับ',
    devComponents: 'ส่วนประกอบ (Dev)',
    devRunner: 'ทดสอบ Runner (Dev)',
  },

  // Page titles and placeholders (T0.3)
  pages: {
    home: {
      startLearning: 'เริ่มเรียน',
    },
    courses: {
      title: 'เลือกคอร์สเรียน',
      placeholder: 'รายการคอร์สจะแสดงที่นี่',
    },
    courseDetail: {
      title: 'ภาพรวมคอร์ส',
      courseId: 'รหัสคอร์ส',
      placeholder: 'รายละเอียดคอร์สจะแสดงที่นี่',
    },
    lesson: {
      title: 'หน้าเรียน',
      courseId: 'รหัสคอร์ส',
      lessonId: 'รหัสบทเรียน',
      placeholder: 'เนื้อหาบทเรียนจะแสดงที่นี่',
    },
    glossary: {
      title: 'คำศัพท์',
      placeholder: 'รายการคำศัพท์จะแสดงที่นี่',
    },
    placement: {
      title: 'แบบทดสอบข้ามบท',
      courseId: 'รหัสคอร์ส',
      placeholder: 'แบบทดสอบจะแสดงที่นี่',
    },
    settings: {
      title: 'ตั้งค่า',
      placeholder: 'ตัวเลือกการตั้งค่าจะแสดงที่นี่',
    },
    about: {
      title: 'เกี่ยวกับ',
      placeholder: 'ข้อมูลเกี่ยวกับแอปจะแสดงที่นี่',
    },
    notFound: {
      title: 'ไม่พบหน้านี้',
      message: 'หน้าที่คุณต้องการไม่มีอยู่ในระบบ หรืออาจถูกย้ายไปที่อื่นแล้ว',
      backHome: 'กลับหน้าแรก',
    },
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

  // Runner & Pyodide status (SPEC หัวข้อ 6)
  runner: {
    status: {
      uninitialized: 'ยังไม่ได้เริ่ม',
      loading: 'กำลังโหลด Pyodide...',
      ready: 'พร้อมใช้งาน',
      running: 'กำลังรันโค้ด...',
      error: 'เกิดข้อผิดพลาดในการโหลด',
    },
    defaultLoadingMessage: 'กำลังเตรียมระบบ Pyodide...',
    readyMessage: 'พร้อมใช้งาน',
    runningMessage: 'กำลังรันโค้ด...',
    initFailed: (detail) =>
      `โหลดระบบรัน Python ไม่สำเร็จ (${detail}) ตรวจว่าเชื่อมต่ออินเทอร์เน็ตอยู่ แล้วกดรันอีกครั้ง`,
    // ข้อความระหว่างเตรียม package, ไฟล์ข้อมูล และฟอนต์ก่อนรันโค้ด (T1.3)
    prepare: {
      packageLoading: (names) => `กำลังเตรียม ${names}...`,
      packageLoaded: (names) => `เตรียม ${names} เสร็จแล้ว`,
      packageDefault: 'กำลังเตรียม package...',
      packageFailed: (detail) =>
        `เตรียม package ไม่สำเร็จ (${detail}) ตรวจชื่อ package แล้วกดรันอีกครั้ง`,
      datasetMissing: (name) =>
        `ไม่พบไฟล์ข้อมูล "${name}" กรุณาแจ้งผู้ดูแลบทเรียน หรือรีเฟรชหน้าแล้วลองใหม่`,
      fontFailed: 'โหลดฟอนต์ภาษาไทยสำหรับกราฟไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองใหม่',
      figureFailed: 'วาดกราฟไม่สำเร็จ ผลลัพธ์อื่นยังแสดงอยู่ด้านบน',
    },
  },

  // Dev Runner Page (T1.1)
  devRunner: {
    title: 'ทดสอบ Code Playground (T1.2)',
    description: 'หน้านี้ใช้สำหรับทดสอบ Editor, Output และปุ่มหยุดตามเกณฑ์ผ่านของ T1.2',
    statusLabel: 'สถานะ Runner:',
    codeLabel: 'โค้ด Python ที่จะรัน:',
    stdinLabel: 'ข้อมูลสำหรับ input() (แต่ละบรรทัดแยกตามรอบที่เรียก):',
    runButton: 'รันโค้ด',
    runningButton: 'กำลังรัน...',
    presetsLabel: 'ตัวอย่างโค้ดทดสอบตามเกณฑ์ผ่าน:',
    presetHello: '1. ทดสอบ print ภาษาไทย',
    presetStdin: '2. ทดสอบ input()',
    presetError: '3. ทดสอบ Error และระบุเลขบรรทัด',
    presetLastExpr: '4. ทดสอบ 1 + 1 บรรทัดสุดท้าย',
    presetNamespace: '5. ทดสอบแยก Namespace',
    presetInfinite: '6. ทดสอบวนลูปไม่หยุด (while True)',
    presetLongOutput: '7. ทดสอบ output ยาวเกินไป',
    presetCsv: '8. อ่านไฟล์ CSV ด้วย pandas (T1.3)',
    presetChart: '9. วาดกราฟชื่อภาษาไทย (T1.3)',
    presetLongTable: '10. ตาราง DataFrame ยาวเกิน 50 แถว (T1.3)',
    stdoutLabel: 'Standard Output (stdout):',
    stderrLabel: 'Standard Error (stderr):',
    resultLabel: 'ผลลัพธ์บรรทัดสุดท้าย (Result):',
    errorLabel: 'ข้อผิดพลาด (Error):',
    errorType: 'ประเภท:',
    errorLine: 'เลขบรรทัด:',
    errorMessage: 'ข้อความ:',
    tracebackLabel: 'Traceback:',
    noOutput: '(ไม่มีข้อความส่งออก)',
    successDone: 'รันสำเร็จ (ok: true)',
    failedDone: 'รันไม่สำเร็จ (ok: false)',
    emptyResult: '(ไม่มีผลลัพธ์)',
    emptyError: '(ไม่มีข้อผิดพลาด)',
  },

  // Code Playground (T1.2)
  playground: {
    sectionLabel: 'ช่องเขียนและรันโค้ด',
    editorLabel: 'ช่องเขียนโค้ด Python (กด Ctrl+Enter เพื่อรัน, Esc เพื่อออกจากช่องนี้)',
    controlsLabel: 'ปุ่มควบคุมการรัน',
    runButton: 'รัน',
    runningButton: 'กำลังรัน...',
    runShortcut: 'รันโค้ด (Ctrl+Enter)',
    stopButton: 'หยุด',
    resetButton: 'รีเซ็ตโค้ด',
    stdinLabel: 'ข้อมูลสำหรับ input() (แต่ละบรรทัดใช้กับ input() ตามลำดับ):',
    outputTitle: 'ผลลัพธ์',
    stdoutLabel: 'Output',
    stderrLabel: 'ข้อความ stderr',
    resultLabel: 'ค่าของบรรทัดสุดท้าย',
    imageAlt: 'กราฟที่ได้จากโค้ด',
    tableCaption: (shown, total) => `แสดง ${shown} แถว จากทั้งหมด ${total} แถว`,
    errorLabel: 'ข้อผิดพลาด',
    errorType: 'ประเภท:',
    errorLine: 'บรรทัดที่:',
    errorMessage: 'ข้อความ:',
    tracebackLabel: 'รายละเอียด (Traceback):',
    runningLabel: 'กำลังรันโค้ด...',
    emptyOutput: 'กดปุ่ม "รัน" เพื่อดูผลลัพธ์',
    timeoutStopped:
      'โค้ดทำงานเกิน 10 วินาที ระบบหยุดให้อัตโนมัติ โค้ดอาจวนลูปไม่รู้จบ (เช่น while True ที่ไม่มีเงื่อนไขหยุด) กรุณาตรวจเงื่อนไขของลูปแล้วลองรันใหม่',
    userStopped: 'หยุดการทำงานแล้ว กดรันอีกครั้งเมื่อพร้อม',
    outputTruncated:
      'ผลลัพธ์ยาวเกินไป ระบบตัดส่วนที่เกินออกแล้ว (จำกัดไว้ที่ 10,000 บรรทัด หรือ 1 MB) ลองลดจำนวนครั้งที่ print',
  },
}
