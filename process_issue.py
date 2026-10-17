import os
import re
import subprocess
import requests
from datetime import date
from pathlib import Path

SUBJECT = os.environ["SUBJECT"]
NUM = os.environ["NUM"]
TITLE = os.environ["TITLE"]
STEPS = os.environ["STEPS"]
ATTACHMENTS_RAW = os.environ["ATTACHMENTS"]

attachments = []
if ATTACHMENTS_RAW:
    for item in ATTACHMENTS_RAW.split("|"):
        name, url = item.split(":::")
        attachments.append({"name": name, "url": url})

target_dir = Path("files") / SUBJECT
target_dir.mkdir(parents=True, exist_ok=True)

entries = []
headers = {"Authorization": f"Bearer {os.environ['GH_TOKEN']}"}
for a in attachments:
    r = requests.get(a["url"], headers=headers)
    if r.status_code != 200:
        r = requests.get(a["url"])
    if r.status_code != 200:
        raise SystemExit(f"Не скачал {a['name']}: HTTP {r.status_code}")
    safe = a["name"].replace("/", "_")
    (target_dir / safe).write_bytes(r.content)
    entries.append({"name": safe, "url": f"files/{SUBJECT}/{safe}"})

js_path = Path("script.js")
js = js_path.read_text(encoding="utf-8")

if re.search(rf'num:\s*"{re.escape(NUM)}"', js):
    raise SystemExit(f"Тема с номером {NUM} уже есть")

pattern = rf'({re.escape(SUBJECT)}:\s*\{{[^}}]*?topics:\s*\[)'
if not re.search(pattern, js):
    raise SystemExit(f"Раздел {SUBJECT} не найден в script.js")

steps_js = "[" + ", ".join(f'"{s}"' for s in STEPS.split("|")) + "]"
files_js = ",\n".join(
    f'          {{ name: "{e["name"]}", url: "{e["url"]}" }}' for e in entries
)
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
