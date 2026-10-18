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

# Находим начало нужного предмета
start_marker = f"{SUBJECT}: {{"
start_idx = js.find(start_marker)
if start_idx == -1:
    print(f"Раздел {SUBJECT} не найден")
    exit(1)

# Ищем начало массива topics внутри этого предмета
topics_start = js.find("topics: [", start_idx)
if topics_start == -1:
    print("Не найден массив topics")
    exit(1)

# Ищем, где заканчивается этот массив topics.
# Мы идем от начала topics и считаем открывающие/закрывающие квадратные скобки,
# чтобы найти именно ту, которая закрывает topics: [
idx = topics_start + len("topics: [")
balance = 1
while idx < len(js) and balance > 0:
    char = js[idx]
    if char == '[':
        balance += 1
    elif char == ']':
        balance -= 1
    idx += 1

if balance != 0:
    print("Не удалось найти конец массива topics")
    exit(1)

# idx теперь указывает на символ сразу после закрывающей скобки ]
end_bracket_idx = idx - 1

# Проверяем, нет ли уже такой темы в этом предмете
subject_block = js[start_idx:end_bracket_idx]
if re.search(rf'num:\s*"{re.escape(NUM)}"', subject_block):
    print(f"Тема {NUM} уже есть в предмете {SUBJECT}")
    exit(0)

# Формируем новую тему
steps_js = "[" + ", ".join(f'"{s}"' for s in STEPS) + "]"
files_js = ", ".join(f'{{ name: "{e["name"]}", url: "{e["url"]}" }}' for e in entries)
today = date.today().isoformat()
new_topic = f'{{ num: "{NUM}", title: "{TITLE}", steps: {steps_js}, date: "{today}", files: [{files_js}] }}'

# Проверяем, пустой ли массив (есть ли там уже темы)
content_between = js[topics_start + len("topics: ["):end_bracket_idx].strip()

if content_between:
    # Если темы уже есть, ставим запятую после последней и добавляем новую
    js_new = js[:end_bracket_idx] + f",\n      {new_topic}\n    " + js[end_bracket_idx:]
else:
    # Если массив пустой, просто вставляем новую
    js_new = js[:end_bracket_idx] + f"\n      {new_topic}\n    " + js[end_bracket_idx:]

js_path.write_text(js_new, encoding="utf-8")
print("Успех!")
