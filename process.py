import os
import re
import json
import requests
from datetime import date
from pathlib import Path

SUBJECT_MAP = {
    "биохимия": "biochem",
    "физиология": "physio",
    "гистология": "histology",
    "микробиология": "microbio",
    "гигиена": "hygiene"
}
SUBJECT_RAW = os.environ["SUBJECT"]
SUBJECT = SUBJECT_MAP.get(SUBJECT_RAW, SUBJECT_RAW)
NUM = os.environ["NUM"]
TITLE = os.environ["TITLE"]
STEPS = os.environ.get("STEPS", "").split("|") if os.environ.get("STEPS") else []
ATTACHMENTS = os.environ.get("ATTACHMENTS", "").split("|") if os.environ.get("ATTACHMENTS") else []

# Скачивание файлов
target_dir = Path("files") / SUBJECT
target_dir.mkdir(parents=True, exist_ok=True)
entries = []
headers = {"Authorization": f"Bearer {os.environ.get('GH_TOKEN', '')}"}

for a in ATTACHMENTS:
    if not a: continue
    name, url = a.split(":::")
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        r = requests.get(url)
    if r.status_code == 200:
        safe = name.replace("/", "_")
        (target_dir / safe).write_bytes(r.content)
        entries.append({"name": safe, "url": f"files/{SUBJECT}/{safe}"})

# Изменение script.js
js_path = Path("script.js")
js = js_path.read_text(encoding="utf-8")

# Проверяем, нет ли уже такой темы ИМЕННО В ЭТОМ ПРЕДМЕТЕ
# Ищем блок предмета
start_marker = f"{SUBJECT}: {{"
start_idx = js.find(start_marker)
if start_idx == -1:
    print(f"Раздел {SUBJECT} не найден")
    exit(1)

# Проверка на дубликат внутри блока (простая, по номеру темы)
subject_block = js[start_idx:]
if re.search(rf'num:\s*"{re.escape(NUM)}"', subject_block[:subject_block.find(']')]):
    print(f"Тема {NUM} уже есть в предмете {SUBJECT}")
    exit(0)

# Формируем JS-код новой темы (в одну строчку, чтобы не ломать форматирование)
steps_js = "[" + ", ".join(f'"{s}"' for s in STEPS) + "]"
files_js = ", ".join(f'{{ name: "{e["name"]}", url: "{e["url"]}" }}' for e in entries)
today = date.today().isoformat()

new_topic = f'{{ num: "{NUM}", title: "{TITLE}", steps: {steps_js}, date: "{today}", files: [{files_js}] }}'

# Ищем место, куда вставить новую тему
# Нам нужно найти "topics: [" внутри блока предмета и добавить туда строку
topics_idx = js.find("topics: [", start_idx)
if topics_idx == -1:
    print("Не найден массив topics")
    exit(1)

# Находим закрывающую скобку массива topics
bracket_idx = js.find("]", topics_idx)
if bracket_idx == -1:
    print("Не найдена закрывающая скобка массива topics")
    exit(1)

# Проверяем, пустой ли массив
content_between = js[topics_idx + len("topics: ["):bracket_idx].strip()
comma = "," if content_between else ""

# Вставляем новую тему перед закрывающей скобкой
js_new = js[:bracket_idx] + f"\n      {new_topic}{comma}\n    " + js[bracket_idx:]

js_path.write_text(js_new, encoding="utf-8")
print("Успех!")
