import os
import re
import json
import requests
from datetime import date
from pathlib import Path

SUBJECT = os.environ["SUBJECT"]
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

if re.search(rf'num:\s*"{re.escape(NUM)}"', js):
    print(f"Тема {NUM} уже есть")
    exit(0)

pattern = rf'({re.escape(SUBJECT)}:\s*\{{[^}}]*?topics:\s*\[)'
if not re.search(pattern, js):
    print(f"Раздел {SUBJECT} не найден")
    exit(1)

steps_js = "[" + ", ".join(f'"{s}"' for s in STEPS) + "]"
files_js = ",\n".join(f'          {{ name: "{e["name"]}", url: "{e["url"]}" }}' for e in entries)
new_topic = f'''      {{
        num: "{NUM}",
        title: "{TITLE}",
        steps: {steps_js},
        date: "{date.today().isoformat()}",
        files: [
{files_js}
        ]
      }},
'''

js_new = re.sub(pattern, r'\1\n' + new_topic, js, count=1)
js_path.write_text(js_new, encoding="utf-8")
print("Успех!")
