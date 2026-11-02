/**
 * โค้ด Python ตัวช่วยที่ worker รันครั้งเดียวตอนเริ่มต้น
 * ฟังก์ชันทั้งหมดคืนค่าเป็น JSON string หรือ bool เพื่อให้ JavaScript อ่านได้ง่าย
 * โดยไม่ต้องจัดการ PyProxy ของ Python เอง
 */
export const PYTHON_HELPERS = `
import base64
import importlib
import importlib.util
import io
import json
import sys

FONT_FAMILY = "IBM Plex Sans Thai"

def _is_installed(name):
    return importlib.util.find_spec(name) is not None

def _prewarm(names):
    # import ล่วงหน้าตอนเตรียมระบบ เพื่อให้เวลาโหลดไม่ถูกนับในเวลาของโค้ดผู้เรียน
    for name in names:
        if _is_installed(name):
            importlib.import_module(name)

def _setup_plotting(font_paths_json):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib import font_manager

    for path in json.loads(font_paths_json):
        font_manager.fontManager.addfont(path)
    plt.rcParams["font.family"] = FONT_FAMILY
    # เครื่องหมายลบเป็น "−" ของ Unicode ทำให้ฟอนต์ไทยบางตัวแสดงเป็นสี่เหลี่ยม
    plt.rcParams["axes.unicode_minus"] = False
    # Agg ไม่มีหน้าต่างให้แสดง จึงทำให้ plt.show() ไม่ทำอะไรและไม่พ่นคำเตือน
    plt.show = lambda *args, **kwargs: None

def _is_table(value):
    pd = sys.modules.get("pandas")
    return pd is not None and isinstance(value, (pd.DataFrame, pd.Series))

def _cell_text(cell):
    import pandas as pd
    try:
        if pd.isna(cell):
            return "NaN"
    except (TypeError, ValueError):
        # ค่าที่เป็นลิสต์หรือ array ตรวจ isna แบบค่าเดียวไม่ได้ ให้แสดงตามปกติ
        pass
    return str(cell)

def _table_json(value, limit):
    import pandas as pd
    frame = value.to_frame() if isinstance(value, pd.Series) else value
    shown = frame.head(limit).reset_index()
    columns = [str(column) for column in shown.columns]
    rows = [[_cell_text(cell) for cell in row] for row in shown.itertuples(index=False, name=None)]
    return json.dumps({"columns": columns, "rows": rows, "totalRows": len(frame)})

def _collect_figures():
    # ไม่ import matplotlib ตรงนี้ เพราะถ้าผู้เรียนไม่ได้ใช้กราฟ จะเสียเวลาโดยไม่จำเป็น
    if "matplotlib.pyplot" not in sys.modules:
        return json.dumps([])
    import warnings
    import matplotlib.pyplot as plt
    from matplotlib import MatplotlibDeprecationWarning

    images = []
    for number in plt.get_fignums():
        buffer = io.BytesIO()
        with warnings.catch_warnings():
            # matplotlib 3.10 เตือนเรื่องพิกัดทศนิยมภายในตอนคำนวณขอบกราฟ (bbox_inches) ผู้เรียนแก้เองไม่ได้
            # ถ้าปล่อยไว้ คำเตือนนี้จะขึ้นในช่อง stderr ทั้งที่โค้ดไม่ผิด
            warnings.simplefilter("ignore", MatplotlibDeprecationWarning)
            plt.figure(number).savefig(buffer, format="png", dpi=100, bbox_inches="tight")
        encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
        images.append("data:image/png;base64," + encoded)
    plt.close("all")
    return json.dumps(images)
`
