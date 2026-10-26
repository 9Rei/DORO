// ============================================================
//  ДЕРЗКИЕ ПРИВЕТСТВИЯ (тёмная тема) — РАЗ В ДЕНЬ
// ============================================================
const DARK_GREETINGS = [
  "Добрый вечер, {name}.",
  "Спокойного вечера, {name}.",
  "{name}, всё под контролем.",
  "Тихо и по делу, {name}.",
  "Вечер — хорошее время для практики, {name}."
];
const LIGHT_GREETINGS = [
  "Доброе утро, {name}!",
  "Хорошего дня, {name}.",
  "{name}, готовы к работе?",
  "Продуктивного дня, {name}.",
  "Всё по плану, {name}."
];

function pickLightGreeting(name) {
  const n = name || "друг";
  const day = Math.floor(Date.now() / 86400000);
  const idx = day % LIGHT_GREETINGS.length;
  return LIGHT_GREETINGS[idx].replace(/\{name\}/g, n);
}

const DARK_GREET_KEY = 'doro.darkGreeting';

function getCurrentDarkGreeting() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(DARK_GREET_KEY) || 'null'); }
  catch (e) { saved = null; }
  if (saved && typeof saved === 'object' && typeof saved.idx === 'number' && DARK_GREETINGS[saved.idx]) {
    return DARK_GREETINGS[saved.idx];
  }
  const idx = Math.floor(Math.random() * DARK_GREETINGS.length);
  localStorage.setItem(DARK_GREET_KEY, JSON.stringify({ idx }));
  return DARK_GREETINGS[idx];
}

function pickNewDarkGreeting() {
  let lastIdx = -1;
  try {
    const saved = JSON.parse(localStorage.getItem(DARK_GREET_KEY) || 'null');
    if (saved && typeof saved === 'object' && typeof saved.idx === 'number') lastIdx = saved.idx;
  } catch (e) { /* ignore */ }
  let newIdx = Math.floor(Math.random() * DARK_GREETINGS.length);
  if (newIdx === lastIdx && DARK_GREETINGS.length > 1) {
    newIdx = (newIdx + 1 + Math.floor(Math.random() * (DARK_GREETINGS.length - 1))) % DARK_GREETINGS.length;
  }
  localStorage.setItem(DARK_GREET_KEY, JSON.stringify({ idx: newIdx }));
  return DARK_GREETINGS[newIdx];
}

function pickDarkGreeting(name) {
  const tpl = getCurrentDarkGreeting();
  return tpl.replace(/\{name\}/g, name || "друг");
}

// ============================================================
//  ДАННЫЕ
// ============================================================
const subjects = {
  biochem: {
    num: "01", title: "Биохимия",
    author: "Кайгородов Антон",
    tabs: ["questions", "problems", "tests"],
    topics: [
      { num: "3.1", title: "Биологические мембраны. Трансмембранная передача сигнала", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-10-24", file: "content/biochem/БХ_3.1.md" },
      { num: "2.3", title: "Коллоквиум. Матричные биосинтезы", steps: ["Прочитать основной файл", "Прочитать файл с задачами"], date: "2026-10-17", file: "content/biochem/БХ_2.3.md" }
    ]
  },
  physio: {
    num: "02", title: "Физиология",
    author: "Кайгородов Антон",
    tabs: ["theory", "tests"],
    topics: [
      { num: "2.4", title: "Частная эндокринология. Клинико-физиологическая оценка гипо - и гиперфункции желёз", steps: ["Законспектировать ДЗ/ Лекцию", "Прочитать файлик тестов", "Выполнить тест и дз"], date: "2026-11-2", file: "content/physio/ФИЗА_2.4Т.md" },
      { num: "2.3", title: "Гуморально-гормональная регуляция. Гипоталамо-гипофизарная система", steps: ["Законспектировать ДЗ/ Лекцию", "Прочитать файлик тестов", "Выполнить тест и дз"], date: "2026-10-26", file: "content/physio/ФИЗА_2.3Т.md" },
      { num: "2.2", title: "Нервная регуляция вегетативных функций. Физиологические свойства и особенности вегетативной нервной системы, её клинико-физиологическая оценка", steps: ["Законспектировать ДЗ/ Лекцию", "Прочитать файлик тестов", "Выполнить тест и дз"], date: "2026-10-18", file: "content/physio/ФИЗА_2.2Т.md" },
      { num: "1.5", title: "КОЛЛОКВИУМ по разделу «Общая физиология»", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-04", file: "content/physio/1.5.md" }
    ]
  },
  histology: {
    num: "03", title: "Гистология",
    author: "Мария Прокопьева",
    tabs: ["theory", "preparations"],
    topics: [
      { num: "25", title: "Пищеварительная система. Морфологическая характеристика кишечника.", steps: ["Прочитать файлик (в нем препараты)", "Решить тест"], date: "2026-10-20", file: "content/histology/ГИСТА_25.md", pdf: "content/histology/25П.pdf" },
      { num: "24", title: "Пищеварительная система. Морфологическая характеристика желудка.", steps: ["Прочитать файлик", "Решить тест"], date: "2026-10-13", file: "content/histology/24.md" }
    ]
  },
  microbio: {
    num: "04", title: "Микробиология",
    author: "Сюзи Петросян",
    topics: [
      { num: "09", title: "Реакция преципитации, ее варианты. Реакция флокуляции, нейтрализации токсина антитоксином, иммунофлюоресценции. Собственно иммунологический метод диагностики", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-11-01", file: "content/microbio/09.md" },
      { num: "08", title: "Приобретенный иммунитет. Антигены. Гуморальный иммунный ответ . Антитела. Реакция агглютинации, ее варианты. Серологический метод диагностики инфекционных заболеваний", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-24", file: "content/microbio/08.md" },
      { num: "07", title: "Виды и формы иммунитета. Врожденный иммунитет. Факторы неспецифической защиты организма", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-10", file: "content/microbio/07.md" },
      { num: "06", title: "Инфекция, инфекционный процесс. Факторы патогенности бактерий", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-10", file: "content/microbio/06.md" },
      { num: "05", title: "Коллоквиум по разделу: Морфология и физиология микроорганизмов", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-05", file: "content/microbio/05.md" },
      { num: "04", title: "Бактериологический метод диагностики. Культуральные, морфологические, биохимические свойства. Дыхание бактерий. Культивирование анаэробных бактерий", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-09-28", file: "content/microbio/04.md" },
      { num: "03", title: "Питание, рост и размножение бактерий. Питательные среды. Метод выделения чистых культур аэробных и анаэробных бактерий. Ферменты бактерий. Пигменты бактерий", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-09-21", file: "content/microbio/03.md" },
      { num: "02", title: "Структура бактериальной клетки. Сложные методы окраски. Особенности строения микоплазм, риккетсий, хламидий, актиномицетов, спирохет. Морфология грибов", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-09-14", file: "content/microbio/02.md" },
      { num: "01", title: "Устройство микробиологической лаборатории. Прокариоты и эукариоты. Морфология бактерий. Простые методы окраски", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-09-07", file: "content/microbio/01.md" }
    ]
  }
};

const schedule = {
  "ПН": [
    { time: "8:00–10:25", title: "Микробио", subjectKey: "microbio", room: "239 каб.", teacher: "Бжитских Екатерина Евгеньевна" },
    { time: "10:40–13:05", title: "Биохимия", subjectKey: "biochem", room: "305 каб.", teacher: "Волобой Нина Леонидовна" }
  ],
  "ВТ": [
    { time: "8:00–9:30", title: "ОМиПК", subjectKey: "omipk", subgroups: [{ label: "А", room: "48 каб.", teacher: "Старчикова М.В." }, { label: "Б", room: "43 каб.", teacher: "Кленова А.Ф." }] },
    { time: "9:40–11:10", title: "Биоэтика", subjectKey: "bioethics", subgroups: [{ label: "А", room: "53 каб.", teacher: "Кочетова Ю.Ю." }, { label: "Б", room: "55 каб.", teacher: "Вольферц М.В." }] }
  ],
  "СР": [
    { time: "8:00–10:25", title: "БЖД", subjectKey: "hygiene", room: "220 каб.", teacher: "Асманова Мария Андреевна" },
    { time: "10:40–13:05", title: "Гигиена", subjectKey: "hygiene", room: "133 каб.", teacher: "Ушаков Александр Анатольевич" }
  ],
  "ЧТ": [
    { time: "8:00–10:25", title: "Норм физа", subjectKey: "physio", room: "409 каб.", teacher: "Шахматов Игорь Ильич" },
    { time: "10:35–12:05", title: "Истмед (1 нед.)", room: "326 каб.", teacher: "Кулипанова Наталья Викторовна" }
  ],
  "ПТ": [
    { time: "10:30–12:00", title: "Физра", subjectKey: "physio", room: "4 каб.", teacher: "Воронцов Павел Геннадьевич" },
    { time: "13:30–15:55", title: "Гиста", subjectKey: "histology", room: "433 каб.", teacher: "Грибанова Ольга Геннадьевна" }
  ]
};

// ============================================================
//  ЛЕКЦИИ
// ============================================================
var LECTURE_YEAR = 2026;
var lectureDates = {
  "Биохимия": [
    { d: "01.09", t: "13:00" }, { d: "22.09", t: "13:00" }, { d: "13.10", t: "13:00" },
    { d: "03.11", t: "13:00" }, { d: "17.11", t: "13:00" }, { d: "01.12", t: "13:00" },
    { d: "15.12", t: "13:00" }, { d: "22.12", t: "13:00" }
  ],
  "Микра": [
    { d: "08.09", t: "13:00" }, { d: "29.09", t: "13:00" },
    { d: "20.10", t: "13:00" }, { d: "10.11", t: "13:00" }
  ],
  "Биоэтика": [
    { d: "15.09", t: "13:00" }, { d: "06.10", t: "13:00" }, { d: "27.10", t: "13:00" }
  ],
  "Гигиена": [
    { d: "01.09", t: "14:40" }, { d: "22.09", t: "14:40" }, { d: "13.10", t: "14:40" },
    { d: "27.10", t: "14:40" }, { d: "10.11", t: "14:40" }, { d: "24.11", t: "14:40" },
    { d: "08.12", t: "14:40" }, { d: "22.12", t: "14:40" }
  ],
  "БЖД": [
    { d: "08.09", t: "14:40" }, { d: "29.09", t: "14:40" }, { d: "20.10", t: "14:40" },
    { d: "03.11", t: "14:40" }, { d: "17.11", t: "14:40" }, { d: "01.12", t: "14:40" },
    { d: "15.12", t: "14:40" }
  ],
  "Истмед": [
    { d: "12.09", t: "09:40" }, { d: "15.09", t: "09:40" }, { d: "26.09", t: "09:40" },
    { d: "06.10", t: "09:40" }, { d: "10.10", t: "09:40" }, { d: "24.10", t: "09:40" },
    { d: "07.11", t: "09:40" }, { d: "21.11", t: "09:40" }, { d: "29.12", t: "09:40" }
  ],
  "Н. физ": [
    { d: "02.09", t: "14:40" }, { d: "16.09", t: "14:40" }, { d: "30.09", t: "14:40" },
    { d: "14.10", t: "14:40" }, { d: "28.10", t: "14:40" }, { d: "18.11", t: "14:40" },
    { d: "02.12", t: "14:40" }, { d: "16.12", t: "14:40" }, { d: "30.12", t: "14:40" }
  ],
  "Гиста": [
    { d: "09.09", t: "14:40" }, { d: "07.10", t: "14:40" }, { d: "11.11", t: "14:40" },
    { d: "09.12", t: "14:40" }, { d: "13.01", t: "14:40" }
  ],
  "ОМиПК": [
    { d: "23.09", t: "14:40" }, { d: "21.10", t: "14:40" },
    { d: "25.11", t: "14:40" }, { d: "23.12", t: "14:40" }
  ]
};

function getUpcomingLectures(daysAhead) {
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var limit = new Date(today); limit.setDate(limit.getDate() + daysAhead);
  var list = [];
  Object.keys(lectureDates).forEach(function (subject) {
    lectureDates[subject].forEach(function (item) {
      var parts = item.d.split(".");
      if (parts.length !== 2) return;
      var d = new Date(LECTURE_YEAR, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      d.setHours(0, 0, 0, 0);
      if (d >= today && d <= limit) list.push({ date: d, subject: subject, dateStr: item.d, time: item.t });
    });
  });
  list.sort(function (a, b) { return a.date - b.date; });
  return list;
}

// ============================================================
//  ВСПОМОГАТЕЛЬНЫЕ
// ============================================================
function findNextLessonDate(subjectKey, fromDate) {
  const dayMap = { 1: schedule["ПН"] || [], 2: schedule["ВТ"] || [], 3: schedule["СР"] || [], 4: schedule["ЧТ"] || [], 5: schedule["ПТ"] || [] };
  const start = new Date(fromDate); start.setHours(0, 0, 0, 0);
  for (let i = 0; i < 60; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    const lessons = dayMap[dow] || [];
    if (!lessons.some(l => l.subjectKey === subjectKey)) continue;
    return d;
  }
  return null;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ============================================================
//  MARKDOWN-РЕНДЕР (без поисковых зависимостей)
// ============================================================
function renderTopicContent(raw) {
  if (!raw) return '<p class="reader__empty">Файл темы пуст.</p>';

  const looksLikeHtml = /<\w+[\s>]/.test(raw) && !/^#{1,6}\s/m.test(raw) && !/^\s*[-*+]\s/m.test(raw);
  if (looksLikeHtml) return raw;

  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let inCode = false, codeBuf = [], codeLang = '';
  let listStack = [], para = [], blockquoteBuf = [], inBlockquote = false;
  let refDefs = {}, footnotesOrder = [];

  const flushPara = () => { if (para.length) { out.push('<p>' + inlineMd(para.join(' ')) + '</p>'); para = []; } };
  const flushList = () => { while (listStack.length) out.push(`</${listStack.pop().type}>`); };
  const flushBlockquote = () => {
    if (!inBlockquote) return;
    const text = blockquoteBuf.join('\n').trim();
    if (text) { out.push('<blockquote>' + renderTopicContentInline(text) + '</blockquote>'); }
    blockquoteBuf = []; inBlockquote = false;
  };
  const flushAll = () => { flushPara(); flushList(); flushBlockquote(); };

  function inlineMd(s) {
    if (s == null) return '';
    const PH = {
      BR: '\u0000BR\u0000', NBSP: '\u0000NBSP\u0000',
      SUB_O: '\u0000SUBO\u0000', SUB_C: '\u0000SUBC\u0000',
      SUP_O: '\u0000SUPO\u0000', SUP_C: '\u0000SUPC\u0000',
      MARK_O: '\u0000MARKO\u0000', MARK_C: '\u0000MARKC\u0000',
      U_O: '\u0000UO\u0000', U_C: '\u0000UC\u0000',
      DEL_O: '\u0000DELO\u0000', DEL_C: '\u0000DELC\u0000',
      KBD_O: '\u0000KBDO\u0000', KBD_C: '\u0000KBDC\u0000',
      ABBR_O: '\u0000ABBRO\u0000', ABBR_C: '\u0000ABBRC\u0000', ABBR_T: '\u0000ABBRT\u0000',
      HR: '\u0000HR\u0000'
    };
    s = s
      .replace(/<br\s*\/?>/gi, PH.BR)
      .replace(/&nbsp;/gi, PH.NBSP)
      .replace(/<hr\s*\/?>/gi, PH.HR)
      .replace(/<sub>/gi, PH.SUB_O).replace(/<\/sub>/gi, PH.SUB_C)
      .replace(/<sup>/gi, PH.SUP_O).replace(/<\/sup>/gi, PH.SUP_C)
      .replace(/<mark>/gi, PH.MARK_O).replace(/<\/mark>/gi, PH.MARK_C)
      .replace(/<u>/gi, PH.U_O).replace(/<\/u>/gi, PH.U_C)
      .replace(/<del>/gi, PH.DEL_O).replace(/<\/del>/gi, PH.DEL_C)
      .replace(/<kbd>/gi, PH.KBD_O).replace(/<\/kbd>/gi, PH.KBD_C)
      .replace(/<abbr\s+title="([^"]*)">/gi, (_, t) => PH.ABBR_T + t + '\u0000')
      .replace(/<abbr>/gi, PH.ABBR_O + '\u0000' + PH.ABBR_C)
      .replace(/<\/abbr>/gi, PH.ABBR_C);

    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const codeSpans = [];
    s = s.replace(/`([^`]+)`/g, (_, code) => { const idx = codeSpans.length; codeSpans.push(code); return `\u0000CODE${idx}\u0000`; });

    s = s
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/==(.+?)==/g, '<mark>$1</mark>');

    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">🖼 $1</a>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    s = s.replace(/\[\^([^\]]+)\]/g, (_, id) => {
      if (!footnotesOrder.includes(id)) footnotesOrder.push(id);
      const idx = footnotesOrder.indexOf(id) + 1;
      return `<sup class="reader__footnote-ref" data-fn="${id}">[${idx}]</sup>`;
    });

    s = s.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => '<code>' + codeSpans[+i] + '</code>');

    s = s
      .replace(new RegExp(PH.BR, 'g'), '<br>')
      .replace(new RegExp(PH.NBSP, 'g'), '&nbsp;')
      .replace(new RegExp(PH.HR, 'g'), '<hr>')
      .replace(new RegExp(PH.SUB_O, 'g'), '<sub>').replace(new RegExp(PH.SUB_C, 'g'), '</sub>')
      .replace(new RegExp(PH.SUP_O, 'g'), '<sup>').replace(new RegExp(PH.SUP_C, 'g'), '</sup>')
      .replace(new RegExp(PH.MARK_O, 'g'), '<mark>').replace(new RegExp(PH.MARK_C, 'g'), '</mark>')
      .replace(new RegExp(PH.U_O, 'g'), '<u>').replace(new RegExp(PH.U_C, 'g'), '</u>')
      .replace(new RegExp(PH.DEL_O, 'g'), '<del>').replace(new RegExp(PH.DEL_C, 'g'), '</del>')
      .replace(new RegExp(PH.KBD_O, 'g'), '<kbd>').replace(new RegExp(PH.KBD_C, 'g'), '</kbd>');

    s = s.replace(/\u0000ABBRO\u0000\u0000ABBRT\u0000([^\u0000]*)\u0000/g, '<abbr title="$1">');
    s = s.replace(new RegExp(PH.ABBR_O, 'g'), '<abbr>');
    s = s.replace(new RegExp(PH.ABBR_C, 'g'), '</abbr>');
    return s;
  }

  function renderTopicContentInline(text) {
    const subLines = text.split('\n');
    const subOut = [];
    for (let i = 0; i < subLines.length; i++) {
      const l = subLines[i];
      if (!l.trim()) continue;
      let m = l.match(/^(#{1,4})\s+(.*)$/);
      if (m) { subOut.push(`<h${m[1].length}>${inlineMd(m[2].trim())}</h${m[1].length}>`); continue; }
      m = l.match(/^\s*[-*+]\s+(.*)$/);
      if (m) { subOut.push('<ul><li>' + inlineMd(m[1]) + '</li></ul>'); continue; }
      m = l.match(/^\s*\d+\.\s+(.*)$/);
      if (m) { subOut.push('<ol><li>' + inlineMd(m[1]) + '</li></ol>'); continue; }
      subOut.push('<p>' + inlineMd(l.trim()) + '</p>');
    }
    return subOut.join('\n');
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (/^\s*```(\w*)\s*$/.test(line)) {
      if (inCode) {
        const cls = codeLang ? ` class="language-${codeLang}"` : '';
        out.push('<pre><code' + cls + '>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
        codeBuf = []; codeLang = ''; inCode = false;
      } else { flushAll(); inCode = true; codeLang = line.match(/^\s*```(\w*)/)[1] || ''; }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }

    let fnDef = line.match(/^\[\^([^\]]+)\]:\s*(.*)$/);
    if (fnDef) { flushAll(); refDefs[fnDef[1]] = fnDef[2]; continue; }

    if (!line.trim()) { flushPara(); continue; }

    if (/^>\s?/.test(line)) {
      flushPara(); flushList();
      if (!inBlockquote) { inBlockquote = true; blockquoteBuf = []; }
      blockquoteBuf.push(line.replace(/^>\s?/, ''));
      if (i + 1 >= lines.length || !/^>\s?/.test(lines[i + 1])) flushBlockquote();
      continue;
    } else if (inBlockquote) { flushBlockquote(); }

    if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(line)) { flushAll(); out.push('<div class="reader__gap"></div>'); continue; }

    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      flushAll();
      const headerCells = line.trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim());
      i += 2;
      const bodyRows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        bodyRows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim()));
        i++;
      }
      i--;
      let tableHtml = '<div class="reader__table-wrap"><table class="reader__table"><thead><tr>';
      headerCells.forEach(c => { tableHtml += '<th>' + inlineMd(c) + '</th>'; });
      tableHtml += '</tr></thead><tbody>';
      bodyRows.forEach(row => { tableHtml += '<tr>'; row.forEach(c => { tableHtml += '<td>' + inlineMd(c) + '</td>'; }); tableHtml += '</tr>'; });
      tableHtml += '</tbody></table></div>';
      out.push(tableHtml);
      continue;
    }

    let m = line.match(/^(#{1,6})\s+(.*)$/);
    if (m) { flushAll(); const lvl = m[1].length; out.push(`<h${lvl}>${inlineMd(m[2].trim())}</h${lvl}>`); continue; }

    m = line.match(/^(\s*)[-*+]\s+\[([ xX])\]\s+(.*)$/);
    if (m) {
      flushPara();
      const indent = m[1].length;
      const checked = m[2].toLowerCase() === 'x';
      if (listStack.length === 0) { out.push('<ul class="reader__checklist">'); listStack.push({ type: 'ul', indent }); }
      out.push(`<li class="reader__checklist-item"><input type="checkbox" disabled ${checked ? 'checked' : ''}> ${inlineMd(m[3])}</li>`);
      continue;
    }

    m = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    if (m) {
      flushPara(); flushBlockquote();
      const indent = m[1].length;
      const isOrdered = /^\d/.test(m[2]);
      const type = isOrdered ? 'ol' : 'ul';
      while (listStack.length && listStack[listStack.length - 1].indent > indent) out.push(`</${listStack.pop().type}>`);
      const last = listStack[listStack.length - 1];
      if (!last || last.indent < indent) { out.push(`<${type}>`); listStack.push({ type, indent }); }
      else if (last.type !== type) { out.push(`</${listStack.pop().type}>`); out.push(`<${type}>`); listStack.push({ type, indent }); }
      out.push('<li>' + inlineMd(m[3]) + '</li>');
      continue;
    }
    if (listStack.length) flushList();
    para.push(line.trim());
  }

  flushAll();
  if (inCode && codeBuf.length) {
    const cls = codeLang ? ` class="language-${codeLang}"` : '';
    out.push('<pre><code' + cls + '>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
  }
  if (footnotesOrder.length) {
    let fnHtml = '<div class="reader__footnotes"><hr><ol>';
    footnotesOrder.forEach(id => { fnHtml += `<li id="fn-${id}">${inlineMd(refDefs[id] || '—')}</li>`; });
    fnHtml += '</ol></div>';
    out.push(fnHtml);
  }
  return out.join('\n') || '<p class="reader__empty">Файл темы пуст.</p>';
}

const SearchCtl = (function () {
  let marks = [];
  let idx = -1;

  function getArticle() { return document.getElementById('reader-article'); }
  function getInput()   { return document.getElementById('readerSearchInput'); }
  function getCount()   { return document.getElementById('readerSearchCount'); }
  function getPanel()   { return document.getElementById('islandSearch'); }

  function clear() {
    const article = getArticle();
    if (article) {
      article.querySelectorAll('mark.reader-search__hit').forEach(m => {
        const parent = m.parentNode;
        if (!parent) return;
        while (m.firstChild) parent.insertBefore(m.firstChild, m);
        parent.removeChild(m);
        parent.normalize();
      });
    }
    marks = [];
    idx = -1;
    const cnt = getCount();
    if (cnt) cnt.textContent = '';
  }

  function focusMark(i) {
    if (!marks.length) return;
    if (i < 0) i = marks.length - 1;
    if (i >= marks.length) i = 0;
    idx = i;
    marks.forEach((m, k) => m.classList.toggle('reader-search__hit--active', k === i));
    const active = marks[i];
    if (active) {
      const y = active.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    const cnt = getCount();
    if (cnt) cnt.textContent = (i + 1) + '/' + marks.length;
  }

  function highlight(query) {
    clear();
    const article = getArticle();
    if (!article || !query) return;
    const q = query.toLowerCase();
    const content = article.querySelector('.reader__content');
    if (!content) return;

    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const tag = node.parentNode && node.parentNode.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MARK') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);

    textNodes.forEach(node => {
      const text = node.nodeValue;
      const lower = text.toLowerCase();
      let i = lower.indexOf(q);
      if (i === -1) return;
      const frag = document.createDocumentFragment();
      let last = 0;
      while (i !== -1) {
        if (i > last) frag.appendChild(document.createTextNode(text.slice(last, i)));
        const mark = document.createElement('mark');
        mark.className = 'reader-search__hit';
        mark.textContent = text.slice(i, i + q.length);
        frag.appendChild(mark);
        marks.push(mark);
        last = i + q.length;
        i = lower.indexOf(q, last);
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });

    if (marks.length) focusMark(0);
    else { const cnt = getCount(); if (cnt) cnt.textContent = 'нет совпадений'; }
  }

  function open() {
    const panel = getPanel();
    if (!panel) return;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('island-search-open');
    setTimeout(() => { const inp = getInput(); if (inp) inp.focus(); }, 200);
  }

  function close() {
    const panel = getPanel();
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('island-search-open');
    clear();
    const inp = getInput(); if (inp) inp.value = '';
  }

  function next() {
    if (marks.length) focusMark(idx + 1);
  }

  function prev() {
    if (marks.length) focusMark(idx - 1);
  }

  function bind() {
    const closeBtn = document.getElementById('readerSearchClose');
    const prevBtn = document.getElementById('readerSearchPrev');
    const nextBtn = document.getElementById('readerSearchNext');
    const input = getInput();
    if (input) {
      let timer = null;
      input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => highlight(input.value.trim()), 200);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (e.shiftKey) prev();
          else next();
        } else if (e.key === 'Escape') {
          close();
        }
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
  }

  return { bind, open, close, clear, highlight, next, prev };
})();
// ============================================================
//  ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  const $ = (id) => document.getElementById(id);

  const avatar = $('avatar');
  const profileSheet = $('profileSheet');
  const profileSheetBackdrop = $('profileSheetBackdrop');
  const profileSheetClose = $('profileSheetClose');
  const editProfileBtn = $('editProfileBtn');
  const profileNameDisplay = $('profileNameDisplay');
  const nameInput = $('nameInput');
  const saveNameBtn = $('saveNameBtn');
  const greetTitle = $('greetTitle');
  const greetDate = $('greetDate');

  const burger = $('burger');
  const nav = $('nav');

  const themeSegBtns = document.querySelectorAll('.theme-seg__btn');

  const calendarEl = $('calendar');
  const lessonsEl = $('lessons');

  const searchToggle = $('searchToggle');
  const searchField = $('searchField');
  const searchInput = $('searchInput');
  const searchResults = $('searchResults');
  const notifyToggle = $('notifyToggle');
  const notifyList = $('notifyList');
  const notifyBadge = $('notifyBadge');
  const avatarBadge = $('avatarBadge');

  const lectureToggle = $('lectureToggle');
  const lectureInfo = $('lectureInfo');

  const subjectsCards = $('subjects-cards');
  const subjectsCardsView = $('subjects-cards-view');

  const readerScreen = $('reader-screen');
  const readerBack = $('readerBack');
  const readerPanel = document.querySelector('#reader .reader__panel');
  const readerArticle = $('reader-article');
  const readerSubjectTitle = $('reader-subject-title');
  let readerTabs = $('readerTabs');

  const readerMenuBtn = $('readerMenuBtn');
  const readerSettings = $('readerSettings');
  const readerSettingsClose = $('readerSettingsClose');
  const readerSettingsBackdrop = $('readerSettingsBackdrop');
  const fontValue = $('fontValue');

  const views = {
    home: $('view-home'), files: $('view-files'), links: $('view-links'),
    tasks: $('view-tasks'), profile: $('view-profile')
  };
  const rendered = { home: false, files: false, links: false, tasks: false, profile: false };

  let currentSubjectKey = null;
  let currentTopicMeta = null;

  let user = JSON.parse(localStorage.getItem('doro.user') || 'null');
  if (user && typeof user === 'object') {
    user.color = user.color || '#3b82f6';
    user.group = user.group || '';
    user.status = user.status || '';
  }

  const AVATAR_COLORS = ['#3b82f6','#16a34a','#ea580c','#9333ea','#0891b2','#e11d48','#ca8a04','#475569'];

  // ---------- ТЕМА ----------
  const THEME_KEY = 'doro.theme';
  const THEME_MODE_KEY = 'doro.themeMode';

  function getAutoTheme() { const h = new Date().getHours(); return (h >= 9 && h < 18) ? 'light' : 'dark'; }
  function getThemeMode() { const m = localStorage.getItem(THEME_MODE_KEY); return (m === 'light' || m === 'dark' || m === 'auto') ? m : 'auto'; }
  function setThemeMode(mode) { localStorage.setItem(THEME_MODE_KEY, mode); }
  function resolveTheme(mode) { return mode === 'auto' ? getAutoTheme() : mode; }
  function updateGreetingByTheme(theme) {
    if (!greetTitle) return;
    greetTitle.textContent = theme === 'dark'
      ? pickDarkGreeting(user && user.name ? user.name : null)
      : pickLightGreeting(user && user.name ? user.name : null);
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateGreetingByTheme(theme);
  }
  function syncThemeSeg() {
    const mode = getThemeMode();
    themeSegBtns.forEach(btn => btn.setAttribute('aria-selected', btn.dataset.mode === mode ? 'true' : 'false'));
  }
  function syncReaderTheme() {
    // новая кнопка «Тема» сама себя перерисовывает через paintRsThemeBtn
  }
  function syncAllThemeSwitchers() { syncThemeSeg(); syncReaderTheme(); }

  (function initTheme() {
    const mode = getThemeMode();
    const theme = resolveTheme(mode);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateGreetingByTheme(theme);
  })();

  (function scheduleAutoTheme() {
    let lastAuto = getAutoTheme();
    setInterval(() => {
      if (getThemeMode() !== 'auto') return;
      const auto = getAutoTheme();
      if (auto !== lastAuto) {
        lastAuto = auto;
        if (document.documentElement.getAttribute('data-theme') !== auto) applyTheme(auto);
      }
    }, 60000);
  })();

  let snakeTimers = { theme: null, cleanup: null };
  function runSnakeTransition(nextTheme) {
    const island = $('island');
    if (!island) { applyTheme(nextTheme); return; }
    if (snakeTimers.theme) clearTimeout(snakeTimers.theme);
    if (snakeTimers.cleanup) clearTimeout(snakeTimers.cleanup);
    island.classList.remove('is-switching-green', 'is-switching-blue');
    const dirClass = nextTheme === 'dark' ? 'is-switching-green' : 'is-switching-blue';
    void island.offsetWidth;
    island.classList.add(dirClass);
    snakeTimers.theme = setTimeout(() => applyTheme(nextTheme), 600);
    snakeTimers.cleanup = setTimeout(() => {
      island.classList.remove(dirClass);
      snakeTimers.theme = null;
      snakeTimers.cleanup = null;
    }, 1250);
  }

  function handleThemeChange(nextMode) {
    if (!nextMode) return;
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = resolveTheme(nextMode);
    setThemeMode(nextMode);
    syncAllThemeSwitchers();
    if (nextTheme === 'dark' && currentTheme !== 'dark') pickNewDarkGreeting();
    if (currentTheme !== nextTheme) runSnakeTransition(nextTheme);
    else applyTheme(nextTheme);
  }

  themeSegBtns.forEach(btn => btn.addEventListener('click', () => handleThemeChange(btn.dataset.mode)));

  // ---------- КНОПКА ТЕМЫ В ПРОФИЛЕ ----------
  const themeToggleBtn = $('themeToggleBtn');
  const themeToggleLabel = $('themeToggleLabel');
  const themeToggleIcon = $('themeToggleIcon');
  const THEME_CYCLE = ['auto', 'light', 'dark'];
  const THEME_LABELS = { auto: 'Авто', light: 'Светлая', dark: 'Тёмная' };
  const THEME_ICONS = {
    auto: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"></path></svg>',
    light: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>',
    dark: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
  };
  function paintThemeToggleBtn() {
    if (!themeToggleBtn) return;
    const mode = getThemeMode();
    if (themeToggleLabel) themeToggleLabel.textContent = THEME_LABELS[mode];
    if (themeToggleIcon) themeToggleIcon.innerHTML = THEME_ICONS[mode];
    themeToggleBtn.setAttribute('aria-label', 'Тема: ' + THEME_LABELS[mode] + '. Нажмите, чтобы переключить');
  }
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = getThemeMode();
      const idx = THEME_CYCLE.indexOf(current);
      const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      handleThemeChange(next);
      paintThemeToggleBtn();
    });
  }
  const themeObserver = new MutationObserver(() => paintThemeToggleBtn());
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  paintThemeToggleBtn();
  syncAllThemeSwitchers();

  // ---------- БУРГЕР ----------
  const isMobileNav = () => window.matchMedia('(max-width: 860px)').matches;
  let navIslands = null;

  function getIslandRect() { const el = $('island'); return el ? el.getBoundingClientRect() : null; }
  function positionNavIslands() {
    if (!navIslands) return;
    const rect = getIslandRect(); if (!rect) return;
    const wrap = navIslands;
    wrap.style.top = rect.top + 'px';
    wrap.style.left = rect.left + 'px';
    wrap.style.right = 'auto';
    wrap.style.width = rect.width + 'px';
    wrap.style.padding = '0';
    const first = wrap.querySelector('.nav-island--first');
    if (first) first.style.minHeight = rect.height + 'px';
    wrap.querySelectorAll('.nav-island:not(.nav-island--first)').forEach(el => { el.style.minHeight = rect.height + 'px'; });
  }
  function buildNavIslands() {
    if (navIslands) return navIslands;
    if (!nav) return null;
    const links = Array.from(nav.querySelectorAll('a[data-view]'));
    if (!links.length) return null;
    navIslands = document.createElement('div');
    navIslands.className = 'nav-islands';
    navIslands.setAttribute('aria-hidden', 'true');
    navIslands.style.display = 'none';
    links.forEach((link, idx) => {
      const btn = document.createElement('a');
      btn.href = '#';
      btn.className = 'nav-island' + (idx === 0 ? ' nav-island--first' : '') + (link.classList.contains('active') ? ' active' : '');
      btn.dataset.view = link.dataset.view;
      btn.innerHTML = '<span class="nav-island__title">' + link.textContent.trim() + '</span>';
      btn.addEventListener('click', (e) => { e.preventDefault(); closeNavIslands(); showView(btn.dataset.view); });
      navIslands.appendChild(btn);
    });
    document.body.appendChild(navIslands);
    return navIslands;
  }
  function syncNavIslandsActive() {
    if (!navIslands || !nav) return;
    const activeView = nav.querySelector('a.active')?.dataset.view || 'home';
    navIslands.querySelectorAll('.nav-island').forEach(el => el.classList.toggle('active', el.dataset.view === activeView));
  }
  function openNavIslands() {
    if (!isMobileNav()) return;
    const el = buildNavIslands(); if (!el) return;
    syncNavIslandsActive();
    el.style.display = 'flex'; positionNavIslands(); void el.offsetWidth;
    document.body.classList.add('nav-islands-active');
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
  }
  function closeNavIslands() {
    document.body.classList.remove('nav-islands-active');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (!navIslands) return;
    navIslands.classList.remove('is-open');
    navIslands.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => { if (navIslands && !navIslands.classList.contains('is-open')) navIslands.style.display = 'none'; }, 420);
  }
  function toggleNavIslands() {
    if (!isMobileNav()) return;
    if (navIslands && navIslands.classList.contains('is-open')) closeNavIslands();
    else openNavIslands();
  }
  if (burger) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isMobileNav()) toggleNavIslands();
      else if (nav) {
        const open = nav.classList.toggle('nav--open');
        burger.classList.toggle('burger--open', open);
        burger.setAttribute('aria-expanded', String(open));
      }
    });
  }
  document.addEventListener('click', (e) => {
    if (navIslands && navIslands.classList.contains('is-open')) {
      if (!navIslands.contains(e.target) && burger && !burger.contains(e.target)) closeNavIslands();
    } else if (nav && nav.classList.contains('nav--open')) {
      if (!nav.contains(e.target) && burger && !burger.contains(e.target)) {
        nav.classList.remove('nav--open'); burger.classList.remove('burger--open'); burger.setAttribute('aria-expanded', 'false');
      }
    }
  });
  if (nav && burger) {
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('nav--open'); burger.classList.remove('burger--open'); burger.setAttribute('aria-expanded', 'false');
    }));
  }
  window.addEventListener('resize', () => {
    if (!isMobileNav()) closeNavIslands();
    else if (navIslands && navIslands.classList.contains('is-open')) positionNavIslands();
  });
  window.addEventListener('scroll', () => {
    if (navIslands && navIslands.classList.contains('is-open')) positionNavIslands();
  }, { passive: true });

  // ---------- ПРОФИЛЬ ----------
  function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  function paintAvatar(color) {
    if (!avatar) return;
    avatar.style.background = `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #ffffff))`;
    avatar.style.color = '#fff';
    avatar.style.borderColor = color;
  }

  function renderProfile() {
    const avatarLetter = $('avatarLetter');
    const heroLetter = $('profileHeroLetter');
    const heroAvatar = $('profileHeroAvatar');
    const statusDisplay = $('profileStatusDisplay');
    const groupDisplay = $('profileGroupDisplay');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (user && user.name) {
      const initials = getInitials(user.name);
      if (avatarLetter) avatarLetter.textContent = initials;
      if (heroLetter) heroLetter.textContent = initials;
      paintAvatar(user.color || '#3b82f6');
      if (greetTitle) greetTitle.textContent = isDark ? pickDarkGreeting(user.name) : pickLightGreeting(user.name);
      if (profileNameDisplay) profileNameDisplay.textContent = user.name;
    } else {
      if (avatarLetter) avatarLetter.textContent = '?';
      if (heroLetter) heroLetter.textContent = '?';
      if (avatar) { avatar.style.background = ''; avatar.style.color = ''; avatar.style.borderColor = ''; }
      if (greetTitle) greetTitle.textContent = isDark ? pickDarkGreeting(null) : pickLightGreeting(null);
      if (profileNameDisplay) profileNameDisplay.textContent = 'Профиль';
    }
    if (heroAvatar) {
      const c = user?.color || '#3b82f6';
      heroAvatar.style.background = `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.4), transparent 55%), linear-gradient(135deg, ${c}, ${c})`;
      heroAvatar.style.color = '#fff';
    }
    if (statusDisplay) statusDisplay.textContent = user?.status ? user.status : 'Статус не задан';
    if (groupDisplay) groupDisplay.textContent = user?.group ? 'Группа ' + user.group : 'Группа не выбрана';

    const sheetOpen = profileSheet && profileSheet.classList.contains('is-open');
    if (!sheetOpen) {
      const groupSelect = $('groupSelect');
      if (groupSelect) groupSelect.value = user?.group || '';
      if (typeof window.__paintStatusPicker === 'function') window.__paintStatusPicker();
      const palette = $('avatarPalette');
      if (palette) {
        const current = (user?.color || '#3b82f6').toLowerCase();
        palette.querySelectorAll('.profile-color__swatch').forEach(btn => {
          btn.setAttribute('aria-selected', btn.dataset.color.toLowerCase() === current ? 'true' : 'false');
        });
      }
    }
    if (avatar) avatar.title = [user?.name, user?.status].filter(Boolean).join(' · ') || 'Профиль';

    const statTopicsEl = $('statTopics');
    const statTasksEl = $('statTasks');
    const statReadEl = $('statRead');
    if (statTopicsEl) {
      const total = Object.values(subjects).reduce((sum, s) => sum + s.topics.filter(t => t.title !== 'Раздел в разработке').length, 0);
      statTopicsEl.textContent = String(total);
    }
    if (statTasksEl) statTasksEl.textContent = String(homework.length);
    if (statReadEl) {
      const last = (function () { try { return JSON.parse(localStorage.getItem('doro.lastRead') || 'null'); } catch (e) { return null; } })();
      statReadEl.textContent = last && last.percent ? last.percent + '%' : '0%';
    }
  }

  if (avatar) avatar.addEventListener('click', (e) => { e.stopPropagation(); showView('profile'); });

  function openProfileSheet() {
    if (!profileSheet) return;
    profileSheet.style.removeProperty('display');
    if (nameInput) nameInput.value = user?.name || '';
    const statusInput = $('statusInput');
    const groupSelect = $('groupSelect');
    if (statusInput) statusInput.value = user?.status || '';
    if (groupSelect) groupSelect.value = user?.group || '';
    profileSheet.classList.add('is-open');
    profileSheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('profile-sheet-open');
    setTimeout(() => { if (nameInput) nameInput.focus(); }, 250);
  }
  function closeProfileSheet() {
    if (!profileSheet) return;
    profileSheet.classList.remove('is-open');
    profileSheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('profile-sheet-open');
  }
  if (editProfileBtn) editProfileBtn.addEventListener('click', openProfileSheet);
  if (profileSheetClose) profileSheetClose.addEventListener('click', closeProfileSheet);
  if (profileSheetBackdrop) profileSheetBackdrop.addEventListener('click', closeProfileSheet);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profileSheet && profileSheet.classList.contains('is-open')) closeProfileSheet();
  });
  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', () => {
      if (!nameInput) return;
      let val = nameInput.value.trim();
      if (!val) return;
      val = val.split(/\s+/)[0];
      if (!val) return;
      user = user || {};
      user.name = val;
      localStorage.setItem('doro.user', JSON.stringify(user));
      nameInput.value = val;
      renderProfile();
      closeProfileSheet();
    });
  }
  if (nameInput && saveNameBtn) nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveNameBtn.click(); });

  (function initGroups() {
    const select = $('groupSelect');
    if (!select) return;
    for (let i = 11; i <= 20; i++) {
      const opt = document.createElement('option');
      opt.value = 'ЛД25' + i;
      opt.textContent = 'ЛД25' + i;
      select.appendChild(opt);
    }
    if (user && user.group) select.value = user.group;
    select.addEventListener('change', () => {
      if (!user) user = {};
      user.group = select.value;
      localStorage.setItem('doro.user', JSON.stringify(user));
      renderProfile();
    });
  })();

  (function initStatus() {
    const picker = $('statusPicker');
    const trigger = $('statusTrigger');
    const triggerValue = $('statusTriggerValue');
    const menu = $('statusMenu');
    if (!picker || !trigger || !menu) return;
    const items = Array.from(menu.querySelectorAll('.status-picker__item'));
    let focusedIndex = -1;
    function getCurrentValue() { return (user && user.status) || ''; }
    function paintTrigger() {
      const val = getCurrentValue();
      if (triggerValue) { triggerValue.textContent = val || '— не задан —'; triggerValue.classList.toggle('is-empty', !val); }
      items.forEach(it => it.setAttribute('aria-selected', it.dataset.value === val ? 'true' : 'false'));
    }
    function openMenu() {
      picker.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      const cur = getCurrentValue();
      focusedIndex = items.findIndex(it => it.dataset.value === cur);
      if (focusedIndex < 0) focusedIndex = 0;
      items.forEach((it, i) => it.classList.toggle('is-focused', i === focusedIndex));
    }
    function closeMenu() {
      picker.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      items.forEach(it => it.classList.remove('is-focused'));
      focusedIndex = -1;
    }
    function selectValue(val) {
      if (!user) user = {};
      user.status = val || '';
      localStorage.setItem('doro.user', JSON.stringify(user));
      paintTrigger(); closeMenu(); renderProfile();
    }
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (picker.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    items.forEach((item, idx) => {
      item.addEventListener('click', (e) => { e.stopPropagation(); selectValue(item.dataset.value); });
      item.addEventListener('mouseenter', () => {
        items.forEach(it => it.classList.remove('is-focused'));
        item.classList.add('is-focused');
        focusedIndex = idx;
      });
    });
    document.addEventListener('click', (e) => {
      if (!picker.classList.contains('is-open')) return;
      if (!picker.contains(e.target)) closeMenu();
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!picker.classList.contains('is-open')) openMenu(); }
      else if (e.key === 'Escape') closeMenu();
    });
    picker.addEventListener('keydown', (e) => {
      if (!picker.classList.contains('is-open')) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedIndex = (focusedIndex + 1) % items.length;
        items.forEach((it, i) => it.classList.toggle('is-focused', i === focusedIndex));
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedIndex = (focusedIndex - 1 + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle('is-focused', i === focusedIndex));
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0) selectValue(items[focusedIndex].dataset.value);
      } else if (e.key === 'Escape') { closeMenu(); trigger.focus(); }
    });
    paintTrigger();
    window.__paintStatusPicker = paintTrigger;
  })();

  (function initPalette() {
    const palette = $('avatarPalette');
    if (!palette) return;
    palette.innerHTML = '';
    AVATAR_COLORS.forEach(color => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'profile-color__swatch';
      btn.dataset.color = color;
      btn.style.background = `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #ffffff))`;
      btn.setAttribute('aria-selected', 'false');
      btn.addEventListener('click', () => {
        if (!user) user = {};
        user.color = color;
        localStorage.setItem('doro.user', JSON.stringify(user));
        palette.querySelectorAll('.profile-color__swatch').forEach(b => {
          b.setAttribute('aria-selected', b.dataset.color === color ? 'true' : 'false');
        });
        renderProfile();
      });
      palette.appendChild(btn);
    });
    const current = (user && user.color ? user.color : '#3b82f6').toLowerCase();
    palette.querySelectorAll('.profile-color__swatch').forEach(b => {
      b.setAttribute('aria-selected', b.dataset.color.toLowerCase() === current ? 'true' : 'false');
    });
  })();

  // ---------- ДОМАШНИЕ ЗАДАНИЯ ----------
  const HW_KEY = 'doro.homework';
  let homework = JSON.parse(localStorage.getItem(HW_KEY) || '[]');
  function saveHomework() { localStorage.setItem(HW_KEY, JSON.stringify(homework)); }
  function hwId() { return 'hw_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7); }
  function getHomeworkFor(subjectKey, dayKey, slot) {
    return homework.filter(h => h.subjectKey === subjectKey && h.dayKey === dayKey && h.slot === slot);
  }

  // ---------- МОДАЛКА ПАНЕЛЕЙ ПРОФИЛЯ ----------
  const profilePop = $('profilePop');
  const profilePopBackdrop = $('profilePopBackdrop');
  const profilePopClose = $('profilePopClose');
  let activePanelKey = null;

  function openProfilePanel(key) {
    if (!profilePop) return;
    if (profileSheet) {
      profileSheet.classList.remove('is-open');
      profileSheet.setAttribute('aria-hidden', 'true');
      profileSheet.style.display = 'none';
      document.body.classList.remove('profile-sheet-open');
    }
    ['searchField', 'lectureInfo', 'notifyList'].forEach(id => { const el = $(id); if (el) el.classList.remove('is-open'); });
    let panelEl = null;
    if (key === 'search') panelEl = $('searchField');
    if (key === 'lecture') panelEl = $('lectureInfo');
    if (key === 'notify') panelEl = $('notifyList');
    if (!panelEl) return;
    panelEl.classList.add('is-open');
    activePanelKey = key;
    profilePop.classList.add('is-open');
    profilePop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('profile-pop-open');
    if (key === 'search' && searchInput) setTimeout(() => searchInput.focus(), 150);
  }
  function closeProfilePanel() {
    if (!profilePop) return;
    profilePop.classList.remove('is-open');
    profilePop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('profile-pop-open');
    ['searchField', 'lectureInfo', 'notifyList'].forEach(id => { const el = $(id); if (el) el.classList.remove('is-open'); });
    activePanelKey = null;
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activePanelKey === 'search') { closeProfilePanel(); return; }
      openProfilePanel('search');
    });
  }
  if (lectureToggle) {
    lectureToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activePanelKey === 'lecture') { closeProfilePanel(); return; }
      renderLectureInfo();
      openProfilePanel('lecture');
    });
  }
  if (notifyToggle) {
    notifyToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activePanelKey === 'notify') { closeProfilePanel(); return; }
      renderNotifyList();
      openProfilePanel('notify');
    });
  }
  if (profilePopBackdrop) profilePopBackdrop.addEventListener('click', closeProfilePanel);
  if (profilePopClose) profilePopClose.addEventListener('click', closeProfilePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profilePop && profilePop.classList.contains('is-open')) closeProfilePanel();
  });

  function collectAllTopics() {
    const all = [];
    Object.entries(subjects).forEach(([key, s]) => {
      s.topics.forEach(t => {
        if (t.title === 'Раздел в разработке') return;
        all.push({ ...t, key });
      });
    });
    return all;
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = '';
      if (!q) return;
      const found = collectAllTopics().filter(t => {
        const hay = (t.title + ' ' + subjects[t.key].title + ' ' + (t.num || '')).toLowerCase();
        return hay.includes(q);
      }).slice(0, 12);
      if (!found.length) { searchResults.innerHTML = '<div class="pop-result--empty">Ничего не найдено</div>'; return; }
      found.forEach(t => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pop-result';
        btn.innerHTML = `
          <div class="pop-result__title">${t.num ? t.num + ' · ' : ''}${t.title}</div>
          <div class="pop-result__meta">${subjects[t.key].title}</div>
        `;
        btn.addEventListener('click', () => {
          closeProfilePanel();
          showView('files');
          setTimeout(() => openTopic(t.key, t.num), 50);
        });
        searchResults.appendChild(btn);
      });
    });
  }

  // ---------- УВЕДОМЛЕНИЯ ----------
  const DEV_NOTIFICATIONS = [{ id: 'n-2026-10-23-2', text: 'Патч изменений 1.02. Кнопки переключатели в темах, разные авторы и многое другое!' }];
  const NOTIFY_SEEN_KEY = 'doro.seenTopics';
  const NOTIFY_SEEN_DEV_KEY = 'doro.seenDevNotifications';

  function getSeenTopics() { try { return new Set(JSON.parse(localStorage.getItem(NOTIFY_SEEN_KEY) || '[]')); } catch (e) { return new Set(); } }
  function saveSeenTopics(set) { localStorage.setItem(NOTIFY_SEEN_KEY, JSON.stringify([...set])); }
  function getSeenDev() { try { return new Set(JSON.parse(localStorage.getItem(NOTIFY_SEEN_DEV_KEY) || '[]')); } catch (e) { return new Set(); } }
  function saveSeenDev(set) { localStorage.setItem(NOTIFY_SEEN_DEV_KEY, JSON.stringify([...set])); }

  function getUpcomingTopics() {
    return collectAllTopics()
      .filter(t => new Date(t.date).getTime() >= new Date().setHours(0, 0, 0, 0))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 8);
  }
  function topicId(t) { return `${t.key}:${t.num || t.title}`; }

  function updateNotifyBadge() {
    if (!notifyBadge) return;
    const seenTopics = getSeenTopics();
    const seenDev = getSeenDev();
    const upcoming = getUpcomingTopics();
    const unseenAuto = upcoming.filter(t => !seenTopics.has(topicId(t))).length;
    const unseenDev = DEV_NOTIFICATIONS.filter(n => !seenDev.has(n.id)).length;
    const total = unseenAuto + unseenDev;
    notifyBadge.style.display = total > 0 ? 'block' : 'none';
    if (avatarBadge) avatarBadge.style.display = total > 0 ? 'block' : 'none';
  }

  function renderDevNotifications() {
    const listEl = $('notifyDevList');
    if (!listEl) return;
    const seen = getSeenDev();
    const items = DEV_NOTIFICATIONS.slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    listEl.innerHTML = '';
    if (!items.length) return;
    items.forEach(n => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'notify-item notify-item--dev' + (seen.has(n.id) ? ' notify-item--seen' : '');
      const dateStr = n.date ? new Date(n.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '';
      btn.innerHTML = `
        <span class="notify-item__dot"></span>
        <span class="notify-item__body">
          <span class="notify-item__title">${escapeHtml(n.text)}</span>
          <span class="notify-item__meta">${dateStr ? 'обновление · ' + dateStr : 'обновление'}</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        const s = getSeenDev(); s.add(n.id); saveSeenDev(s);
        updateNotifyBadge(); renderDevNotifications();
      });
      listEl.appendChild(btn);
    });
  }

  function renderAutoNotifications() {
    const autoEl = $('notifyAutoList');
    if (!autoEl) return;
    const seen = getSeenTopics();
    const upcoming = getUpcomingTopics();
    autoEl.innerHTML = '';
    if (!upcoming.length) {
      if (DEV_NOTIFICATIONS.length === 0) autoEl.innerHTML = '<div class="notify-item--empty">Пока нет ближайших тем</div>';
      return;
    }
    upcoming.forEach(t => {
      const id = topicId(t);
      const dateStr = new Date(t.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'notify-item' + (seen.has(id) ? ' notify-item--seen' : '');
      btn.innerHTML = `
        <span class="notify-item__dot"></span>
        <span class="notify-item__body">
          <span class="notify-item__title">${t.title}</span>
          <span class="notify-item__meta">${subjects[t.key].title} · ${dateStr}</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        const s = getSeenTopics(); s.add(id); saveSeenTopics(s);
        updateNotifyBadge(); showView('files');
        setTimeout(() => openTopic(t.key, t.num), 50);
      });
      autoEl.appendChild(btn);
    });
  }

  function renderNotifyList() { renderDevNotifications(); renderAutoNotifications(); }
  updateNotifyBadge();

  // ---------- ДАТА ----------
  if (greetDate) {
    const now = new Date();
    let dateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    greetDate.textContent = dateStr;
  }

  // ---------- КАЛЕНДАРЬ ----------
  const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  let calDate = new Date(); calDate.setDate(1);
  let selectedDay = null, selectedMonth = null, selectedYear = null;

  function getDayTopicsInfo(targetDate) {
    const dayKey = ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'][targetDate.getDay()];
    const daySchedule = schedule[dayKey] || [];
    if (!daySchedule.length) return { hasTopics: false, hasColloq: false };
    const lDate = new Date(targetDate); lDate.setHours(0, 0, 0, 0);
    let hasTopics = false, hasColloq = false;
    for (const l of daySchedule) {
      if (!subjects[l.subjectKey]) continue;
      for (const t of subjects[l.subjectKey].topics) {
        if (t.title === 'Раздел в разработке') continue;
        const parts = t.date.split('-');
        const tDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        tDate.setHours(0, 0, 0, 0);
        const next = findNextLessonDate(l.subjectKey, tDate);
        if (next && next.getTime() === lDate.getTime()) {
          hasTopics = true;
          if (/коллоквиум/i.test(t.title)) hasColloq = true;
        }
      }
    }
    return { hasTopics, hasColloq };
  }

  function renderCalendar() {
    if (!calendarEl) return;
    const year = calDate.getFullYear(), month = calDate.getMonth();
    const firstDay = new Date(year, month, 1);
    let startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const today = new Date();
    const isSameMonth = today.getFullYear() === year && today.getMonth() === month;
    let html = `<div class="cal-head"><span class="cal-month">${MONTHS[month]} ${year}</span><div class="cal-nav"><button type="button" data-nav="-1">‹</button><button type="button" data-nav="1">›</button></div></div><div class="cal-grid">${DOW.map(d => `<div class="cal-dow">${d}</div>`).join('')}`;
    for (let i = 0; i < startOffset; i++) html += `<button type="button" class="cal-day other" disabled>${daysInPrev - startOffset + i + 1}</button>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = isSameMonth && today.getDate() === d;
      const isSelected = selectedDay === d && selectedMonth === month && selectedYear === year;
      const dateKey = toDateKey(date);
      const hasHw = homework.some(h => h.date === dateKey && !h.done);
      const dayInfo = getDayTopicsInfo(date);
      const hasTopics = dayInfo.hasTopics;
      const cls = ['cal-day', isWeekend ? 'weekend' : '', isToday ? 'today' : '', isSelected ? 'selected' : '', hasHw && !isWeekend ? 'has-hw' : '', hasTopics && !isWeekend ? 'has-topics' : '', hasTopics && dayInfo.hasColloq && !isWeekend ? 'has-colloquium' : ''].filter(Boolean).join(' ');
      const disabled = isWeekend ? 'disabled' : '';
      const dataAttr = isWeekend ? '' : `data-day="${d}"`;
      const dot = hasHw && !isWeekend ? '<span class="cal-hw-dot"></span>' : '';
      html += `<button type="button" class="${cls}" ${dataAttr} ${disabled}>${d}${dot}</button>`;
    }
    const total = startOffset + daysInMonth;
    let rest = total % 7;
    if (rest !== 0) { rest = 7 - rest; for (let i = 1; i <= rest; i++) html += `<button type="button" class="cal-day other" disabled>${i}</button>`; }
    html += '</div>';
    calendarEl.innerHTML = html;

    calendarEl.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => {
      calDate.setMonth(calDate.getMonth() + Number(b.dataset.nav));
      renderCalendar();
    }));
    calendarEl.querySelectorAll('[data-day]').forEach(b => b.addEventListener('click', () => {
      selectedDay = Number(b.dataset.day); selectedMonth = month; selectedYear = year;
      renderCalendar(); updateTodayView();
    }));
  }

  // ---------- ПАРЫ И ДЗ ----------
  function updateLessonBadge(lessonEl, subjectKey, dayKey, slot) {
    const btn = lessonEl.querySelector('.lesson-hw-btn');
    if (!btn) return;
    const undone = getHomeworkFor(subjectKey, dayKey, slot).filter(h => !h.done).length;
    btn.classList.toggle('has-undone', undone > 0);
    let badge = btn.querySelector('.lesson-hw-badge');
    if (undone > 0) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'lesson-hw-badge'; btn.appendChild(badge); }
      badge.textContent = undone;
    } else if (badge) badge.remove();
  }

  function bindLessonHw(lessonEl, subjectKey, dayKey, lessonDate, slot, lessonTitle) {
    const btn = lessonEl.querySelector('.lesson-hw-btn');
    const area = lessonEl.querySelector('.lesson-hw-area');
    if (!btn || !area) return;
    btn.addEventListener('click', () => {
      if (!area.hidden) { area.hidden = true; area.innerHTML = ''; return; }
      area.hidden = false;
      area.innerHTML = `
        <form class="hw-form">
          <input type="text" class="hw-input" placeholder="Что нужно сделать?" maxlength="200" autocomplete="off">
          <button type="submit" class="hw-save" title="Сохранить">Сохранить</button>
        </form>
      `;
      const form = area.querySelector('.hw-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = form.querySelector('.hw-input');
        const text = inp.value.trim();
        if (!text) return;
        homework.push({
          id: hwId(), subjectKey, dayKey, slot, lessonTitle,
          date: lessonDate ? toDateKey(lessonDate) : toDateKey(new Date()),
          text, done: false, createdAt: Date.now()
        });
        saveHomework();
        updateLessonBadge(lessonEl, subjectKey, dayKey, slot);
        renderCalendar();
        if (rendered.tasks) renderTasks();
        area.hidden = true; area.innerHTML = '';
      });
    });
  }

  function updateTodayView() {
    const titleEl = $('today-title');
    const topicsPanel = $('topics-panel');
    const topicsList = $('topics-list');
    if (!titleEl || !lessonsEl) return;
    let targetDate, isToday = false;
    if (!selectedDay) {
      targetDate = new Date();
      if (targetDate.getHours() >= 15) {
        targetDate.setDate(targetDate.getDate() + 1);
        selectedDay = targetDate.getDate(); selectedMonth = targetDate.getMonth(); selectedYear = targetDate.getFullYear();
        renderCalendar(); isToday = false;
      } else {
        const dow = targetDate.getDay();
        if (dow === 0 || dow === 6) {
          targetDate.setDate(targetDate.getDate() + (dow === 6 ? 2 : 1));
          selectedDay = targetDate.getDate(); selectedMonth = targetDate.getMonth(); selectedYear = targetDate.getFullYear();
          renderCalendar(); isToday = false;
        } else isToday = true;
      }
    } else {
      targetDate = new Date(selectedYear, selectedMonth, selectedDay);
      const dow = targetDate.getDay();
      if (dow === 0 || dow === 6) {
        const nextMon = new Date(targetDate);
        nextMon.setDate(nextMon.getDate() + (dow === 6 ? 2 : 1));
        targetDate = nextMon;
        selectedDay = targetDate.getDate(); selectedMonth = targetDate.getMonth(); selectedYear = targetDate.getFullYear();
        renderCalendar();
      }
      isToday = false;
    }
    const daysOfWeekAcc = ['воскресенье','понедельник','вторник','среду','четверг','пятницу','субботу'];
    titleEl.textContent = isToday ? 'Сегодня' : 'На ' + daysOfWeekAcc[targetDate.getDay()];
    const dayKey = ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'][targetDate.getDay()];
    const daySchedule = schedule[dayKey] || [];
    lessonsEl.innerHTML = '';
    const allTopics = [];
    if (!daySchedule.length) {
      lessonsEl.innerHTML = '<div class="lesson"><div class="lesson-head">В этот день пар нет</div></div>';
      if (topicsPanel) topicsPanel.style.display = 'none';
      return;
    }
    daySchedule.forEach((l, slot) => {
      const div = document.createElement('div');
      div.className = 'lesson';
      let details = '';
      if (l.room) details += l.room + ' · ';
      if (l.teacher) details += l.teacher;
      if (l.subgroups) details = 'Разделение на подгруппы';
      const subjectKeyForHw = l.subjectKey || `slot_${dayKey}_${slot}`;
      const undone = getHomeworkFor(subjectKeyForHw, dayKey, slot).filter(h => !h.done).length;
      const badge = `<button type="button" class="lesson-hw-btn ${undone ? 'has-undone' : ''}" title="Задания по паре" data-slot="${slot}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3 8-8"></path>
          <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11"></path>
        </svg>
        ${undone ? `<span class="lesson-hw-badge">${undone}</span>` : ''}
      </button>`;
      div.innerHTML = `
        <div class="lesson-head">
          <time>${l.time}</time>
          <div style="flex:1">
            <div class="lesson-title">${l.title}</div>
            <div class="lesson-details">${details}</div>
          </div>
          ${badge}
        </div>
        <div class="lesson-hw-area" hidden></div>
      `;
      lessonsEl.appendChild(div);
      bindLessonHw(div, subjectKeyForHw, dayKey, targetDate, slot, l.title);
      if (subjects[l.subjectKey]) {
        subjects[l.subjectKey].topics.forEach(t => {
          if (t.title === 'Раздел в разработке') return;
          const parts = t.date.split('-');
          const tDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          tDate.setHours(0, 0, 0, 0);
          const lDate = new Date(targetDate); lDate.setHours(0, 0, 0, 0);
          const next = findNextLessonDate(l.subjectKey, tDate);
          if (next && next.getTime() === lDate.getTime()) allTopics.push({ ...t, key: l.subjectKey });
        });
      }
    });
    if (!topicsPanel || !topicsList) return;
    if (!allTopics.length) { topicsPanel.style.display = 'none'; return; }
    topicsPanel.style.display = 'block';
    topicsList.innerHTML = '';
    allTopics.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'lesson-topic';
      btn.dataset.subject = t.key;
      btn.innerHTML = `<span class="lesson-topic__letter">${subjects[t.key].title[0]}</span><div class="lesson-topic__title">${t.title}</div>`;
      btn.addEventListener('click', () => { showView('files'); setTimeout(() => openTopic(t.key, t.num), 50); });
      topicsList.appendChild(btn);
    });
  }

  (function scheduleDaySwitch() {
    const DAY_SWITCH_HOUR = 15;
    function msUntilSwitch() {
      const now = new Date(); const next = new Date(now);
      next.setHours(DAY_SWITCH_HOUR, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return next - now;
    }
    function tick() { if (selectedDay === null) updateTodayView(); setTimeout(tick, msUntilSwitch()); }
    setTimeout(tick, msUntilSwitch());
  })();

  // ---------- РАЗДЕЛЫ ----------
  function pluralTopics(n) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'тема';
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'темы';
    return 'тем';
  }
  function getSubjectAccent(key) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const accentMap = isDark ? {
      biochem: '#a3e635', physio: '#38bdf8', histology: '#e879f9',
      microbio: '#fb923c', hygiene: '#2dd4bf', bioethics: '#c084fc', bjd: '#fbbf24'
    } : {
      biochem: '#16a34a', physio: '#2563eb', histology: '#9333ea',
      microbio: '#ea580c', hygiene: '#0891b2', bioethics: '#a855f7', bjd: '#d97706'
    };
    return accentMap[key] || '#3b82f6';
  }
  function applySubjectAccent(panelEl, key) {
    const accent = getSubjectAccent(key);
    if (panelEl) { panelEl.style.setProperty('--subject-accent', accent); panelEl.dataset.accent = key; }
    const subjBadge = $('reader-subject-title'); if (subjBadge) subjBadge.style.setProperty('--subject-accent', accent);
    const readerEl = $('reader'); if (readerEl) readerEl.style.setProperty('--subject-accent', accent);
    const topicsEl = $('readerTopics'); if (topicsEl) topicsEl.style.setProperty('--subject-accent', accent);
  }
  function sortTopics(topics) {
    return topics.slice().sort((a, b) => {
      const na = parseFloat(String(a.num ?? '').replace(',', '.'));
      const nb = parseFloat(String(b.num ?? '').replace(',', '.'));
      const aHas = Number.isFinite(na), bHas = Number.isFinite(nb);
      if (aHas && bHas) return nb - na;
      if (aHas !== bHas) return aHas ? -1 : 1;
      const da = new Date(a.date).getTime() || 0;
      const db = new Date(b.date).getTime() || 0;
      return db - da;
    });
  }
  function renderSections() {
    if (!subjectsCards) return;
    subjectsCards.innerHTML = '';
    Object.keys(subjects).sort((a, b) => subjects[a].title.localeCompare(subjects[b].title, 'ru')).forEach(key => {
      const s = subjects[key];
      const validTopics = sortTopics(s.topics.filter(t => t.title !== 'Раздел в разработке'));
      const lastTopic = validTopics[0];
      const accent = getSubjectAccent(key);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'subject-card-big';
      card.style.setProperty('--card-accent', accent);
      const lastLine = lastTopic ? `${lastTopic.num ? 'Тема ' + lastTopic.num + ' · ' : ''}${lastTopic.title}` : 'Материалы появятся позже';
      const countText = validTopics.length ? `${validTopics.length} ${pluralTopics(validTopics.length)}` : 'Скоро';
      card.innerHTML = `
        <span class="subject-card-big__letter">${s.title[0]}</span>
        <span class="subject-card-big__body">
          <span class="subject-card-big__title">${s.title}</span>
          <span class="subject-card-big__last">${lastLine}</span>
        </span>
        <span class="subject-card-big__meta">
          <span class="subject-card-big__count">${countText}</span>
        </span>
      `;
      card.addEventListener('click', () => openLatestTopic(key));
      subjectsCards.appendChild(card);
    });
  }
  function getCurrentTopic(valid) {
    if (!valid.length) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let best = null, bestDiff = Infinity;
    for (const t of valid) {
      const d = new Date(t.date + 'T00:00:00');
      if (isNaN(d.getTime())) continue;
      const diff = Math.abs(d.getTime() - today.getTime());
      if (diff < bestDiff) { bestDiff = diff; best = t; }
    }
    return best || valid[valid.length - 1];
  }
  function openLatestTopic(key) {
    const subject = subjects[key];
    if (!subject) return;
    const valid = sortTopics(subject.topics.filter(t => t.title !== 'Раздел в разработке'));
    if (subjectsCardsView) subjectsCardsView.style.display = 'none';
    if (readerScreen) readerScreen.style.display = 'flex';
    if (!valid.length) {
      if (readerSubjectTitle) readerSubjectTitle.textContent = subject.title;
      if (readerArticle) readerArticle.innerHTML = '<p class="reader__empty">Материалы появятся позже</p>';
      return;
    }
    const current = getCurrentTopic(valid);
    openTopic(key, current.num);
  }

  async function openTopic(key, topicNum = null) {
    const subject = subjects[key];
    if (!subject) return;
    const valid = sortTopics(subject.topics.filter(t => t.title !== 'Раздел в разработке'));
    if (!valid.length) return;
    const viewFiles = $('view-files');
    if (viewFiles) viewFiles.classList.add('reader-open');
    let initialIndex = 0;
    if (topicNum) {
      const f = valid.findIndex(t => t.num === topicNum);
      if (f !== -1) initialIndex = f;
    }
    currentTopicMeta = valid[initialIndex];
    currentSubjectKey = key;
    if (subjectsCardsView) subjectsCardsView.style.display = 'none';
    if (readerScreen) readerScreen.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (readerSubjectTitle) readerSubjectTitle.textContent = subject.title;
    applySubjectAccent(readerPanel, key);
    closeReaderSettings();
    SearchCtl.close();

    const topicCache = new Map();
    async function loadTopicContent(topic) {
      if (!topic.file) return '';
      if (topicCache.has(topic.file)) return topicCache.get(topic.file);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(topic.file, { cache: 'no-cache', signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        topicCache.set(topic.file, text);
        return text;
      } catch (e) {
        console.error('Ошибка загрузки ' + topic.file, e);
        return `Не удалось загрузить файл темы: ${topic.file}`;
      }
    }

    async function renderTopic(i) {
      const t = valid[i];
      if (!readerArticle) return;
      currentTopicMeta = t;
      const authorInline = subject.author
        ? `<span class="reader__author-inline"><span class="reader__author-by">made by</span><span class="reader__author-name">${escapeHtml(subject.author)}</span></span>`
        : '';
      readerArticle.innerHTML = `
        <div class="reader__num">${t.num ? 'Тема ' + t.num : ''}${authorInline}</div>
        <h1 class="reader__heading" role="button" tabindex="0" aria-expanded="false">${t.title}</h1>
        ${t.steps && t.steps.length ? `<div class="reader__prep"><span class="reader__prep-label">Для подготовки</span><ul>${t.steps.map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
        <div class="reader__tabs" id="readerTabs" hidden></div>
        <div class="reader__content"><p class="reader__empty">Загрузка темы…</p></div>
      `;
      readerTabs = $('readerTabs');

      const tabConfigForRender = Array.isArray(t.tabs) ? t.tabs : (Array.isArray(subject.tabs) ? subject.tabs : []);
      if (readerTabs && tabConfigForRender.length) {
        const TAB_LABELS = { theory: 'Теория', tests: 'Тесты', preparations: 'Препараты', questions: 'Вопросы', problems: 'Задачи' };
        readerTabs.innerHTML = tabConfigForRender.map((tab, i) => `
          <button type="button" class="reader__tab${i === 0 ? ' is-active' : ''}" data-tab="${tab}">${TAB_LABELS[tab] || tab}</button>
        `).join('') + '<span class="reader__tab-indicator" id="readerTabIndicator"></span>';
        readerTabs.hidden = false; readerTabs.style.display = '';
      } else if (readerTabs) {
        readerTabs.hidden = true; readerTabs.style.display = 'none'; readerTabs.innerHTML = '';
      }

      const headingEl = readerArticle.querySelector('.reader__heading');
      if (headingEl) {
        const toggleHeading = () => {
          if (!window.matchMedia('(max-width: 640px)').matches) return;
          const expanded = headingEl.classList.toggle('is-expanded');
          headingEl.setAttribute('aria-expanded', String(expanded));
        };
        headingEl.addEventListener('click', toggleHeading);
        headingEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleHeading(); }
        });
      }

      const contentEl = readerArticle.querySelector('.reader__content');
      if (contentEl) {
        contentEl.classList.remove('is-loaded');
        contentEl.innerHTML = `<div class="reader__skeleton" aria-hidden="true">
          <div class="reader__skeleton-line reader__skeleton-line--sub"></div>
          <div class="reader__skeleton-line reader__skeleton-line--w90"></div>
          <div class="reader__skeleton-line reader__skeleton-line--w80"></div>
          <div class="reader__skeleton-line reader__skeleton-line--w70"></div>
          <div class="reader__skeleton-line reader__skeleton-line--w60"></div>
          <div class="reader__skeleton-line reader__skeleton-line--w40"></div>
        </div>`;
      }

      const raw = await loadTopicContent(t);
      const tabConfig = Array.isArray(t.tabs) ? t.tabs : (Array.isArray(subject.tabs) ? subject.tabs : []);
      if (tabConfig.length) {
        const sections = buildTabSections(raw, tabConfig, t);
        setupTabs(sections, tabConfig);
        showTab(tabConfig[0], contentEl, sections);
      } else {
        contentEl.innerHTML = renderTopicContent(raw);
      }

      const extraFiles = extractPdfLinksFromMarkdown(raw);
      if (contentEl && extraFiles.length && !tabConfig.includes('preparations')) {
        const files = extraFiles;
        if (files.length) {
          const wrap = document.createElement('div');
          wrap.className = 'reader__extra-files';
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'reader__extra-btn';
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span>Посмотреть доп. файлы${files.length > 1 ? ' (' + files.length + ')' : ''}</span>`;
          btn.addEventListener('click', () => openPdfModal(files, t.title || 'Доп. файлы'));
          wrap.appendChild(btn);
          contentEl.appendChild(wrap);
        }
      }
      if (contentEl) contentEl.classList.add('is-loaded');
      document.dispatchEvent(new CustomEvent('doro:topic-rendered'));
      tocBuiltForArticle = null;
      if (readerSettings && readerSettings.classList.contains('open')) buildToc();
    }
    await renderTopic(initialIndex);
    saveLastRead(key, valid[initialIndex].num);
  }

  if (readerBack) {
    readerBack.addEventListener('click', () => {
    SearchCtl.close();
      if (readerScreen) readerScreen.style.display = 'none';
      setCollapsed(false);
      if (subjectsCardsView) subjectsCardsView.style.display = 'block';
      const viewFiles = $('view-files');
      if (viewFiles) { viewFiles.classList.remove('reader-open'); viewFiles.style.removeProperty('--subject-accent'); delete viewFiles.dataset.accent; }
      const readerEl = $('reader'); if (readerEl) { readerEl.style.removeProperty('--subject-accent'); delete readerEl.dataset.accent; }
      closeReaderSettings();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- ЗАДАНИЯ ----------
  function renderTasks() {
    const listEl = $('tasksList');
    if (!listEl) return;
    if (!homework.length) { listEl.innerHTML = '<div class="tasks-empty">Пока ни одного задания. Добавьте значком у пары на главной.</div>'; return; }
    const groups = new Map();
    homework.forEach(h => {
      if (!h.date) return;
      if (!groups.has(h.date)) groups.set(h.date, { date: new Date(h.date + 'T00:00:00'), items: [] });
      groups.get(h.date).items.push(h);
    });
    if (!groups.size) { listEl.innerHTML = '<div class="tasks-empty">Пока ни одного задания. Добавьте значком у пары на главной.</div>'; return; }
    const sortedDates = [...groups.keys()].sort((a, b) => a.localeCompare(b));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const total = homework.length;
    const done = homework.filter(h => h.done).length;
    listEl.innerHTML = '';
    const summary = document.createElement('div');
    summary.className = 'tasks-summary';
    summary.innerHTML = `
      <div class="tasks-summary__item"><span class="tasks-summary__num">${total - done}</span><span class="tasks-summary__label">не выполнено</span></div>
      <div class="tasks-summary__item"><span class="tasks-summary__num">${done}</span><span class="tasks-summary__label">выполнено</span></div>
      <div class="tasks-summary__item"><span class="tasks-summary__num">${total}</span><span class="tasks-summary__label">всего</span></div>
    `;
    listEl.appendChild(summary);
    sortedDates.forEach(dateKey => {
      const g = groups.get(dateKey);
      g.items.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      const isToday = g.date.getTime() === today.getTime();
      const isTomorrow = g.date.getTime() === today.getTime() + 86400000;
      const isPast = g.date.getTime() < today.getTime();
      const dowShort = ['вс','пн','вт','ср','чт','пт','сб'][g.date.getDay()];
      const dayNum = g.date.getDate();
      const monthShort = g.date.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '');
      const undoneCount = g.items.filter(h => !h.done).length;
      const block = document.createElement('div');
      block.className = 'tasks-day' + (isToday ? ' tasks-day--today' : '') + (isPast ? ' tasks-day--past' : '');
      block.innerHTML = `
        <div class="tasks-day__date">
          <span class="tasks-day__dow">${dowShort}</span>
          <span class="tasks-day__num">${dayNum}</span>
          <span class="tasks-day__month">${monthShort}</span>
        </div>
        <div class="tasks-day__body">
          <div class="tasks-day__top">
            <span class="tasks-day__label">${isToday ? 'сегодня' : (isTomorrow ? 'завтра' : (isPast ? 'прошедшее' : 'задачи'))}</span>
            <span class="tasks-day__count">${undoneCount}/${g.items.length}</span>
          </div>
          <ul class="hw-list"></ul>
        </div>
      `;
      const ul = block.querySelector('.hw-list');
      g.items.forEach(h => {
        const subjTitle = h.lessonTitle ? h.lessonTitle : (subjects[h.subjectKey] ? subjects[h.subjectKey].title : 'Без предмета');
        const li = document.createElement('li');
        li.className = 'hw-item' + (h.done ? ' hw-item--done' : '');
        li.dataset.id = h.id;
        li.innerHTML = `
          <label class="hw-check">
            <input type="checkbox" class="hw-toggle" ${h.done ? 'checked' : ''}>
            <span class="hw-text">
              <span class="hw-text__main">${escapeHtml(h.text)}</span>
              <span class="hw-text__sub">${subjTitle}</span>
            </span>
          </label>
          <button type="button" class="hw-remove" title="Удалить">×</button>
        `;
        li.querySelector('.hw-toggle').addEventListener('change', (e) => {
          const item = homework.find(x => x.id === h.id); if (!item) return;
          item.done = e.target.checked;
          saveHomework();
          li.classList.toggle('hw-item--done', item.done);
          renderCalendar(); renderTasks();
          if (rendered.home) updateTodayView();
        });
        li.querySelector('.hw-remove').addEventListener('click', () => {
          homework = homework.filter(x => x.id !== h.id);
          saveHomework(); renderTasks(); renderCalendar();
          if (rendered.home) updateTodayView();
        });
        ul.appendChild(li);
      });
      listEl.appendChild(block);
    });
  }

  // ---------- VIEWS ----------
  function showView(name) {
    closeProfilePanel();
    Object.values(views).forEach(v => { if (v) v.classList.remove('is-active'); });
    const v = views[name];
    if (!v) return;
    void v.offsetWidth;
    v.classList.add('is-active');

    const viewFiles = $('view-files');
    if (viewFiles && name !== 'files') {
      setCollapsed(false);
      viewFiles.classList.remove('reader-open');
      viewFiles.style.removeProperty('--subject-accent');
      delete viewFiles.dataset.accent;
      const readerEl = $('reader');
      if (readerEl) { readerEl.style.removeProperty('--subject-accent'); delete readerEl.dataset.accent; }
      if (readerScreen) readerScreen.style.display = 'none';
      if (subjectsCardsView) subjectsCardsView.style.display = 'block';
      closeReaderSettings();
      SearchCtl.close();
    }

    document.querySelectorAll('.nav a[data-view]').forEach(a => a.classList.toggle('active', a.dataset.view === name));
    syncNavIslandsActive();
    if (name === 'profile') { syncAllThemeSwitchers(); renderProfile(); }

    if (!rendered[name]) {
      if (name === 'home') { renderCalendar(); updateTodayView(); }
      if (name === 'files') renderSections();
      if (name === 'tasks') renderTasks();
      rendered[name] = true;
    }
    window.scrollTo({ top: 0 });
  }

  document.querySelectorAll('.nav a[data-view]').forEach(a => {
    a.addEventListener('click', (e) => { e.preventDefault(); showView(a.dataset.view); });
  });
  const brandLogo = $('brand-logo');
  if (brandLogo) brandLogo.addEventListener('click', (e) => { e.preventDefault(); showView('home'); });

  // ---------- БЛИЖАЙШАЯ ЛЕКЦИЯ ----------
  function pluralDays(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }
  function renderLectureInfo() {
    if (!lectureInfo) return;
    var lectures = getUpcomingLectures(60).slice(0, 2);
    if (!lectures.length) { lectureInfo.innerHTML = '<div class="pop-lecture__empty">Ближайших лекций нет</div>'; return; }
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var html = '<div class="pop-lecture__list">';
    lectures.forEach(function (lec) {
      var diffDays = Math.round((lec.date - today) / (1000 * 60 * 60 * 24));
      var whenText;
      if (diffDays === 0) whenText = "сегодня";
      else if (diffDays === 1) whenText = "завтра";
      else if (diffDays === 2) whenText = "послезавтра";
      else whenText = "через " + diffDays + " " + pluralDays(diffDays, "день", "дня", "дней");
      var dayName = lec.date.toLocaleDateString("ru-RU", { weekday: "long" });
      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      var dateFormatted = lec.date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
      html += '<div class="pop-lecture__item">' +
        '<div class="pop-lecture__subject">' + escapeHtml(lec.subject) + '</div>' +
        '<div class="pop-lecture__meta">' + dayName + ', ' + dateFormatted + ' · ' + lec.time + '</div>' +
        '<div class="pop-lecture__when">' + whenText + '</div>' +
      '</div>';
    });
    html += '</div>';
    lectureInfo.innerHTML = html;
  }

  let tocBuiltForArticle = null;
  const readerTopics = $('readerTopics');
  const readerTopicsList = $('readerTopicsList');

  function buildTopicsList() {
    if (!readerTopicsList) return;
    readerTopicsList.innerHTML = '';
    if (!currentSubjectKey || !subjects[currentSubjectKey]) return;
    const valid = sortTopics(subjects[currentSubjectKey].topics.filter(t => t.title !== 'Раздел в разработке'));
    valid.forEach(t => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'reader-topics__item' + (currentTopicMeta && currentTopicMeta.num === t.num ? ' is-active' : '');
      btn.innerHTML = `<span class="reader-topics__item-num">${t.num || '—'}</span>`;
      btn.title = t.title;
      btn.addEventListener('click', () => { openTopic(currentSubjectKey, t.num); closeReaderSettings(); });
      readerTopicsList.appendChild(btn);
    });
  }

  const readerPop = $('readerPop');
  function openReaderSettings() {
    if (!readerSettings) return;
    buildTopicsList();
    if (readerPop) { readerPop.classList.add('open'); readerPop.setAttribute('aria-hidden', 'false'); }
    if (readerTopics) readerTopics.setAttribute('aria-hidden', 'false');
    if (readerSettings) readerSettings.setAttribute('aria-hidden', 'false');
    document.body.classList.add('reader-settings-open');
    if (readerMenuBtn) readerMenuBtn.setAttribute('aria-expanded', 'true');
    if (readerSettingsBackdrop) readerSettingsBackdrop.classList.add('is-visible');
  }
  function closeReaderSettings() {
    document.body.classList.remove('reader-settings-open');
    if (readerPop) { readerPop.classList.remove('open'); readerPop.setAttribute('aria-hidden', 'true'); }
    if (readerTopics) readerTopics.setAttribute('aria-hidden', 'true');
    if (readerSettings) readerSettings.setAttribute('aria-hidden', 'true');
    if (readerMenuBtn) readerMenuBtn.setAttribute('aria-expanded', 'false');
    if (readerSettingsBackdrop) readerSettingsBackdrop.classList.remove('is-visible');
  }
  function toggleReaderSettings() {
    if (!readerSettings) return;
    if (readerSettings.classList.contains('open')) closeReaderSettings();
    else openReaderSettings();
  }

  if (readerMenuBtn) readerMenuBtn.addEventListener('click', toggleReaderSettings);
  if (readerSettingsClose) readerSettingsClose.addEventListener('click', closeReaderSettings);
  if (readerSettingsBackdrop) readerSettingsBackdrop.addEventListener('click', closeReaderSettings);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && readerSettings && readerSettings.classList.contains('open')) closeReaderSettings();
  });

  // Подключаем поиск по теме
  SearchCtl.bind();

  // Кнопка «Поиск» в настройках читалки
  const rsSearchBtn = $('rsSearchBtn');
  if (rsSearchBtn) {
    rsSearchBtn.addEventListener('click', () => {
      closeReaderSettings();
      setTimeout(() => SearchCtl.open(), 250);
    });
  }

  // Кнопка «Тема» в настройках читалки
  const rsThemeBtn = $('rsThemeBtn');
  const rsThemeIcon = $('rsThemeIcon');
  const rsThemeLabel = $('rsThemeLabel');
  const RS_THEME_CYCLE = ['auto', 'light', 'dark'];
  const RS_THEME_LABELS = { auto: 'Авто', light: 'Светлая', dark: 'Тёмная' };
  const RS_THEME_ICONS = {
    auto:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"></path></svg>',
    light: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>',
    dark:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
  };
  function paintRsThemeBtn() {
    const mode = getThemeMode();
    if (rsThemeLabel) rsThemeLabel.textContent = RS_THEME_LABELS[mode];
    if (rsThemeIcon) rsThemeIcon.innerHTML = RS_THEME_ICONS[mode];
  }
  if (rsThemeBtn) {
    rsThemeBtn.addEventListener('click', () => {
      const cur = getThemeMode();
      const i = RS_THEME_CYCLE.indexOf(cur);
      const next = RS_THEME_CYCLE[(i + 1) % RS_THEME_CYCLE.length];
      handleThemeChange(next);
      paintRsThemeBtn();
    });
  }
  paintRsThemeBtn();
  const themeModeObs = new MutationObserver(() => paintRsThemeBtn());
  themeModeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Ctrl/Cmd+F — открывает поиск
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      const rf = $('view-files');
      if (rf && rf.classList.contains('reader-open')) {
        e.preventDefault();
        SearchCtl.open();
      }
    }
  });

  // ---------- РАЗМЕР ШРИФТА ----------
  const FONT_KEY = 'doro.readerFontSize';
  const FONT_SIZES = [8,9,10,11,12,13,14,15,16,17,18];
  const fontRange = $('fontRange');
  let fontIndex = FONT_SIZES.indexOf(parseInt(localStorage.getItem(FONT_KEY) || '16', 10));
  if (fontIndex < 0) fontIndex = FONT_SIZES.indexOf(16);
  function paintRangeProgress() {
    if (!fontRange) return;
    const max = Number(fontRange.max) || 1;
    fontRange.style.setProperty('--range-progress', ((Number(fontRange.value) / max) * 100) + '%');
  }
  function applyFontSize() {
    const size = FONT_SIZES[fontIndex];
    document.documentElement.style.setProperty('--reader-font-size', size + 'px');
    localStorage.setItem(FONT_KEY, String(size));
    if (fontValue) fontValue.textContent = String(size);
    if (fontRange) { fontRange.value = String(fontIndex); paintRangeProgress(); }
  }
  if (fontRange) {
    fontRange.min = '0'; fontRange.max = String(FONT_SIZES.length - 1); fontRange.step = '1';
    fontRange.value = String(fontIndex);
    fontRange.addEventListener('input', () => { fontIndex = Number(fontRange.value); applyFontSize(); });
  }
  applyFontSize();

  // ---------- РЕЖИМ ЧТЕНИЯ ----------
  const READ_MODE_KEY = 'doro.readerMode';
  const readModeBtns = document.querySelectorAll('.rs-mode__btn');
  function getReadMode() { const v = localStorage.getItem(READ_MODE_KEY); return (v === 'class' || v === 'normal') ? v : 'normal'; }
  function applyReadMode(mode) {
    const m = (mode === 'class' || mode === 'normal') ? mode : 'normal';
    document.documentElement.classList.toggle('reader-mode-class', m === 'class');
    localStorage.setItem(READ_MODE_KEY, m);
    readModeBtns.forEach(btn => btn.setAttribute('aria-selected', btn.dataset.readmode === m ? 'true' : 'false'));
  }
  readModeBtns.forEach(btn => btn.addEventListener('click', () => applyReadMode(btn.dataset.readmode)));
  applyReadMode(getReadMode());

  // ---------- TOC ----------
  const tocToggle = $('tocToggle');
  const tocWrap = $('tocWrap');
  function openTocWrap() { if (!tocWrap || !tocToggle) return; buildToc(); tocWrap.classList.add('is-open'); tocToggle.setAttribute('aria-expanded', 'true'); }
  function closeTocWrap() { if (!tocWrap || !tocToggle) return; tocWrap.classList.remove('is-open'); tocToggle.setAttribute('aria-expanded', 'false'); }
  if (tocToggle && tocWrap) tocToggle.addEventListener('click', () => {
    if (tocWrap.classList.contains('is-open')) closeTocWrap();
    else openTocWrap();
  });

  const tocList = $('tocList');
  let tocObserver = null;
  function buildToc() {
    if (!tocList) return;
    tocList.innerHTML = '';
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    if (!readerArticle) return;
    const headings = readerArticle.querySelectorAll('.reader__content h1, .reader__content h2, .reader__content h3, .reader__content h4');
    if (!headings.length) { tocList.innerHTML = '<div class="toc__empty">В этой теме нет заголовков</div>'; return; }
    const items = [];
    headings.forEach((h, idx) => {
      if (!h.id) h.id = 'toc-' + (idx + 1);
      const text = h.textContent.trim();
      if (!text) return;
      items.push({ id: h.id, level: h.tagName.toLowerCase(), text, el: h });
    });
    const bookmarks = getBookmarks();
    const bkey = bookmarkKeyForTopic();
    const saved = (bkey && bookmarks[bkey]) || {};
    const starEmpty = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    const starFilled = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    items.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toc__link toc__link--' + item.level;
      btn.dataset.target = item.id;
      const num = document.createElement('span'); num.className = 'toc__num'; num.textContent = String(index + 1).padStart(2, '0');
      const text = document.createElement('span'); text.className = 'toc__link-text'; text.textContent = item.text;
      const star = document.createElement('button'); star.type = 'button';
      star.className = 'toc__star' + (saved[item.id] ? ' is-active' : '');
      star.title = saved[item.id] ? 'Убрать из избранного' : 'В избранное';
      star.innerHTML = saved[item.id] ? starFilled : starEmpty;
      star.addEventListener('click', (e) => {
        e.stopPropagation(); e.preventDefault();
        const bm = getBookmarks(); const k = bookmarkKeyForTopic(); if (!k) return;
        if (!bm[k]) bm[k] = {};
        if (bm[k][item.id]) { delete bm[k][item.id]; star.classList.remove('is-active'); star.title = 'В избранное'; star.innerHTML = starEmpty; }
        else { bm[k][item.id] = true; star.classList.add('is-active'); star.title = 'Убрать из избранного'; star.innerHTML = starFilled; }
        if (!Object.keys(bm[k]).length) delete bm[k];
        saveBookmarks(bm);
      });
      btn.appendChild(num); btn.appendChild(text); btn.appendChild(star);
      btn.addEventListener('click', () => {
        const target = document.getElementById(item.id);
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
        if (window.innerWidth <= 640) closeReaderSettings();
        tocList.querySelectorAll('.toc__link').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
      tocList.appendChild(btn);
    });
    const map = new Map(items.map(it => [it.el, it.id]));
    let current = null;
    const markActive = (id) => {
      if (!id || id === current) return;
      current = id;
      tocList.querySelectorAll('.toc__link').forEach(b => b.classList.toggle('is-active', b.dataset.target === id));
      const active = tocList.querySelector('.toc__link.is-active');
      if (active && readerSettings && readerSettings.classList.contains('open')) {
        const r = active.getBoundingClientRect(); const cr = tocList.getBoundingClientRect();
        if (r.top < cr.top || r.bottom > cr.bottom) active.scrollIntoView({ block: 'nearest' });
      }
    };
    tocObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) markActive(map.get(visible[0].target));
    }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });
    items.forEach(it => tocObserver.observe(it.el));
    const top = window.scrollY + 120;
    let startId = items[0] && items[0].id;
    for (const it of items) { if (it.el.offsetTop <= top) startId = it.id; else break; }
    markActive(startId);
  }

  if (readerArticle) {
    const mo = new MutationObserver(() => {
      tocBuiltForArticle = null;
      if (readerSettings && readerSettings.classList.contains('open')) buildToc();
    });
    mo.observe(readerArticle, { childList: true, subtree: true });
  }

  // ---------- QR-СИНХРОНИЗАЦИЯ ----------
  const JSONBIN_KEY = '$2a$10$ueLrF0JVSgVVWPZgis5xC.1sLjPqGhq1tWOSypgHXo.HBWRQecrU6';
  const JSONBIN_URL = 'https://api.jsonbin.io/v3/b';
  const qrShowBtn = $('qrShowBtn');
  const qrScanBtn = $('qrScanBtn');
  const qrShowModal = $('qrShowModal');
  const qrScanModal = $('qrScanModal');
  const qrCanvas = $('qrCanvas');
  const qrVideo = $('qrVideo');
  const qrShowClose = $('qrShowClose');
  const qrScanClose = $('qrScanClose');
  let qrStream = null, qrRafId = null, currentBinId = null, pollTimeoutHandle = null, pollActive = false;
  const isPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (isPhone) { if (qrShowBtn) qrShowBtn.style.display = 'none'; }
  else { if (qrScanBtn) qrScanBtn.style.display = 'none'; }

  function stopPolling() { pollActive = false; if (pollTimeoutHandle) { clearTimeout(pollTimeoutHandle); pollTimeoutHandle = null; } }
  function stopQrScanner() {
    if (qrRafId) cancelAnimationFrame(qrRafId);
    qrRafId = null;
    if (qrStream) { qrStream.getTracks().forEach(t => t.stop()); qrStream = null; }
    if (qrVideo) qrVideo.srcObject = null;
  }
  function randomId() { return 'doro_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  async function deleteBin(binId) {
    if (!binId) return;
    try { await fetch(`${JSONBIN_URL}/${binId}`, { method: 'DELETE', headers: { 'X-Master-Key': JSONBIN_KEY } }); } catch (e) { /* ignore */ }
  }
  async function pollBin(binId, onData, onTimeout) {
    const startTime = Date.now(); const MAX_TOTAL = 15000;
    const delays = [1000, 2000, 4000, 8000]; let step = 0; pollActive = true;
    while (pollActive) {
      if (Date.now() - startTime > MAX_TOTAL) { pollActive = false; if (onTimeout) onTimeout(); return; }
      try {
        const r = await fetch(`${JSONBIN_URL}/${binId}/latest`, { headers: { 'X-Master-Key': JSONBIN_KEY } });
        if (r.ok) {
          const j = await r.json(); const rec = j.record;
          if (rec && rec.t === 'doro-hw' && Array.isArray(rec.hw)) { pollActive = false; onData(rec); return; }
        }
      } catch (e) { /* продолжим */ }
      const delay = delays[Math.min(step, delays.length - 1)]; step++;
      await new Promise(res => { pollTimeoutHandle = setTimeout(res, delay); });
    }
  }

  const syncInfoModal = $('syncInfoModal');
  const syncInfoCancel = $('syncInfoCancel');
  const syncInfoContinue = $('syncInfoContinue');
  const LAST_SYNC_KEY = 'doro.lastSync';
  function todayIso() { return new Date().toISOString().slice(0, 10); }

  async function startQrSession() {
    if (localStorage.getItem(LAST_SYNC_KEY) === todayIso()) { alert('Сегодня вы уже переносили задания. Следующий перенос — завтра.'); return; }
    const sessionId = randomId();
    if (qrCanvas) qrCanvas.innerHTML = '<div style="padding:30px;color:#5a6678;font-size:13px;">Создаю сессию…</div>';
    if (qrShowModal) qrShowModal.classList.add('open');
    let binId = null;
    try {
      const res = await fetch(JSONBIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY, 'X-Bin-Name': 'session_' + sessionId, 'X-Bin-Private': 'true' },
        body: JSON.stringify({ t: 'doro-session', sid: sessionId, ready: false })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      binId = json.metadata.id; currentBinId = binId;
    } catch (e) {
      if (qrCanvas) qrCanvas.innerHTML = '<div style="padding:30px;color:#b91c1c;font-size:13px;">Ошибка создания сессии: ' + e.message + '</div>';
      return;
    }
    const qrPayload = JSON.stringify({ t: 'doro-recv', bin: binId, sid: sessionId });
    if (qrCanvas) qrCanvas.innerHTML = '';
    try {
      if (qrCanvas && window.QRCode) new QRCode(qrCanvas, { text: qrPayload, width: 320, height: 320, colorDark: '#000', colorLight: '#fff', correctLevel: QRCode.CorrectLevel.M });
    } catch (err) { alert('Ошибка генерации QR: ' + err.message); }
    pollBin(binId,
      (rec) => { if (qrShowModal) qrShowModal.classList.remove('open'); applyIncoming(rec); },
      () => {
        if (!qrShowModal) return;
        const hint = qrShowModal.querySelector('.qr-modal__sub');
        if (hint) hint.textContent = 'Время ожидания истекло. Нажмите «Принять ДЗ» ещё раз.';
      }
    );
  }

  if (qrShowBtn) qrShowBtn.addEventListener('click', () => {
    if (localStorage.getItem(LAST_SYNC_KEY) === todayIso()) { alert('Сегодня вы уже переносили задания. Следующий перенос — завтра.'); return; }
    if (syncInfoModal) syncInfoModal.classList.add('open');
  });
  if (syncInfoCancel) syncInfoCancel.addEventListener('click', () => { if (syncInfoModal) syncInfoModal.classList.remove('open'); });
  if (syncInfoContinue) syncInfoContinue.addEventListener('click', () => {
    if (syncInfoModal) syncInfoModal.classList.remove('open');
    setTimeout(startQrSession, 300);
  });
  if (syncInfoModal) syncInfoModal.addEventListener('click', (e) => { if (e.target === syncInfoModal) syncInfoModal.classList.remove('open'); });
  if (qrShowClose) qrShowClose.addEventListener('click', () => { if (qrShowModal) qrShowModal.classList.remove('open'); stopPolling(); });
  if (qrShowModal) qrShowModal.addEventListener('click', (e) => { if (e.target === qrShowModal) { qrShowModal.classList.remove('open'); stopPolling(); } });

  async function sendToBin(binId, payload) {
    try {
      const res = await fetch(`${JSONBIN_URL}/${binId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return true;
    } catch (e) { alert('Не удалось отправить данные: ' + e.message); return false; }
  }
  async function scanAndSend(text) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.t !== 'doro-recv' || !parsed.bin) { alert('Это не QR от doro.'); return; }
      if (!homework.length) { alert('У вас нет заданий для отправки.'); return; }
      const payload = {
        t: 'doro-hw', v: 1, user: user?.name || null, sid: parsed.sid,
        hw: homework.map(h => ({ id: h.id, s: h.subjectKey, d: h.dayKey, sl: h.slot, lt: h.lessonTitle || null, dt: h.date, tx: h.text, dn: h.done }))
      };
      const ok = await sendToBin(parsed.bin, payload);
      if (ok) { alert('Отправлено заданий: ' + homework.length + '. ПК получит их в течение пары секунд.'); if (qrScanModal) qrScanModal.classList.remove('open'); }
    } catch (e) { alert('Не удалось разобрать QR: ' + e.message); }
  }

  if (qrScanBtn && qrScanModal && qrVideo) {
    qrScanBtn.addEventListener('click', async () => {
      qrScanModal.classList.add('open');
      try {
        qrStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        qrVideo.srcObject = qrStream; await qrVideo.play();
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
        function tick() {
          if (!qrVideo.videoWidth) { qrRafId = requestAnimationFrame(tick); return; }
          canvas.width = qrVideo.videoWidth; canvas.height = qrVideo.videoHeight;
          ctx.drawImage(qrVideo, 0, 0, canvas.width, canvas.height);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (window.jsQR) {
            const code = jsQR(imgData.data, canvas.width, canvas.height);
            if (code && code.data) { stopQrScanner(); scanAndSend(code.data); return; }
          }
          qrRafId = requestAnimationFrame(tick);
        }
        tick();
      } catch (err) { alert('Не удалось получить доступ к камере: ' + err.message); qrScanModal.classList.remove('open'); stopQrScanner(); }
    });
  }
  if (qrScanClose) qrScanClose.addEventListener('click', () => { if (qrScanModal) qrScanModal.classList.remove('open'); stopQrScanner(); });
  if (qrScanModal) qrScanModal.addEventListener('click', (e) => { if (e.target === qrScanModal) { qrScanModal.classList.remove('open'); stopQrScanner(); } });

  function applyIncoming(data) {
    if (currentBinId) { deleteBin(currentBinId); currentBinId = null; }
    localStorage.setItem(LAST_SYNC_KEY, todayIso());
    const current = JSON.parse(localStorage.getItem(HW_KEY) || '[]');
    const byId = new Map(current.map(h => [h.id, h]));
    let added = 0;
    data.hw.forEach(h => {
      const mapped = { id: h.id, subjectKey: h.s, dayKey: h.d, slot: h.sl, lessonTitle: h.lt, date: h.dt, text: h.tx, done: !!h.dn, createdAt: Date.now() };
      if (!byId.has(mapped.id)) { byId.set(mapped.id, mapped); added++; }
    });
    localStorage.setItem(HW_KEY, JSON.stringify([...byId.values()]));
    homework = JSON.parse(localStorage.getItem(HW_KEY));
    saveHomework(); renderTasks(); renderCalendar();
    if (rendered.home) updateTodayView();
    alert('Получено заданий: ' + added);
  }

  // ---------- ЗАКЛАДКИ ----------
  const FAV_KEY = 'doro.bookmarks';
  function getBookmarks() { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveBookmarks(obj) { localStorage.setItem(FAV_KEY, JSON.stringify(obj)); }
  function bookmarkKeyForTopic() {
    if (!currentTopicMeta) return null;
    return `${currentTopicMeta.key || currentSubjectKey}::${currentTopicMeta.num || currentTopicMeta.title}`;
  }

  // ---------- СВЁРНУТАЯ ШАПКА + ПРОГРЕСС ----------
  const islandProgress = $('islandProgress');
  const islandProgressValue = $('islandProgressValue');
  const islandProgressFill = $('islandProgressFill');
  let lastScrollY = window.scrollY;
  let collapseThreshold = window.innerWidth <= 860 ? 90 : 160;

  function splitTheoryAndTests(raw) {
    if (!raw) return { hasTabs: false };
    const testsMatch = raw.match(/^#{1,3}\s+(Тесты|Тест|Тестирование)\s*$/mi);
    if (!testsMatch) return { hasTabs: false };
    const testsIndex = testsMatch.index;
    const theoryMatch = raw.slice(0, testsIndex).match(/^#{1,3}\s+(Теория|Теория\.?)\s*$/mi);
    if (!theoryMatch) return { hasTabs: true, theory: raw.slice(0, testsIndex).trim(), tests: raw.slice(testsIndex).trim() };
    return { hasTabs: true, theory: raw.slice(theoryMatch.index + theoryMatch[0].length, testsIndex).trim(), tests: raw.slice(testsIndex).trim() };
  }
  function splitIntoThreeSections(raw) {
    if (!raw) return { questions: '', problems: '', tests: '' };
    const lines = raw.split('\n');
    const markers = {
      questions: /^#{1,3}\s+(Вопросы|Вопрос)\s*$/i,
      problems: /^#{1,3}\s+(Задачи|Задача|Задач)\s*$/i,
      tests: /^#{1,3}\s+(Тесты|Тест|Тестирование)\s*$/i
    };
    const sections = { questions: [], problems: [], tests: [] };
    let current = null;
    for (const line of lines) {
      let matched = false;
      for (const key of Object.keys(markers)) if (markers[key].test(line)) { current = key; matched = true; break; }
      if (matched) continue;
      if (current) sections[current].push(line);
    }
    return { questions: sections.questions.join('\n').trim(), problems: sections.problems.join('\n').trim(), tests: sections.tests.join('\n').trim() };
  }
  let tabsResizeHandler = null;
  function moveTabIndicator() {
    if (!readerTabs) return;
    const active = readerTabs.querySelector('.reader__tab.is-active');
    const indicator = readerTabs.querySelector('.reader__tab-indicator');
    if (!active || !indicator) return;
    const rect = active.getBoundingClientRect(); const parentRect = readerTabs.getBoundingClientRect();
    indicator.style.width = rect.width + 'px';
    indicator.style.transform = `translateX(${rect.left - parentRect.left - 4}px)`;
  }
  function setupTabs(sections, tabConfig) {
    if (!readerTabs) return;
    readerTabs.querySelectorAll('.reader__tab').forEach(btn => {
      btn.style.display = ''; btn.disabled = false;
      btn.onclick = () => {
        if (btn.classList.contains('is-active')) return;
        const contentEl = readerArticle.querySelector('.reader__content');
        showTab(btn.dataset.tab, contentEl, sections);
      };
    });
    requestAnimationFrame(moveTabIndicator);
    if (tabsResizeHandler) window.removeEventListener('resize', tabsResizeHandler);
    tabsResizeHandler = moveTabIndicator;
    window.addEventListener('resize', tabsResizeHandler);
  }
  function extractPdfLinksFromMarkdown(raw) {
    if (!raw) return [];
    const result = [];
    const reMd = /\\?\[\s*([^\]\\]*)\s*\\?\]\(\s*([^)\s]+\.pdf(?:\?[^)\s]*)?)\s*\)/gi;
    let m;
    while ((m = reMd.exec(raw)) !== null) { const href = m[2].trim(); if (href && !result.includes(href)) result.push(href); }
    raw.split('\n').forEach(line => {
      if (/\[.*\]\(.*\)/.test(line)) return;
      const match = line.match(/((?:\.\/)?(?:[\w\-.%/]+)\.pdf(?:\?[^\s)]*)?)/i);
      if (match) { const href = match[1]; if (!result.includes(href)) result.push(href); }
    });
    return result;
  }
  function buildTabSections(raw, tabConfig, topic) {
    const result = {};
    if (tabConfig.includes('theory')) { const s = splitTheoryAndTests(raw); result.theory = s.hasTabs ? s.theory : raw; }
    if (tabConfig.includes('tests')) { const s = splitTheoryAndTests(raw); result.tests = s.hasTabs ? s.tests : ''; }
    if (tabConfig.includes('preparations')) result.preparations = topic.pdf ? (Array.isArray(topic.pdf) ? topic.pdf : [topic.pdf]) : [];
    if (tabConfig.includes('questions') || tabConfig.includes('problems')) {
      const three = splitIntoThreeSections(raw);
      if (tabConfig.includes('questions')) result.questions = three.questions;
      if (tabConfig.includes('problems')) result.problems = three.problems;
      if (tabConfig.includes('tests') && three.tests) result.tests = three.tests;
      if (tabConfig.includes('theory') && !three.questions && !three.problems) result.theory = raw;
    }
    return result;
  }
  function showTab(tab, contentEl, sections) {
    SearchCtl.clear();
    if (!contentEl || !readerTabs) return;
    readerTabs.querySelectorAll('.reader__tab').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tab));
    moveTabIndicator();
    contentEl.classList.remove('is-loaded');
    if (tab === 'preparations') contentEl.innerHTML = renderPreparations(sections.preparations || []);
    else if (tab === 'questions') {
      const raw = sections.questions || '';
      contentEl.innerHTML = raw.trim() ? renderTopicContent(raw) : '<p class="reader__empty">В этой теме нет вопросов</p>';
    } else if (tab === 'problems') {
      const raw = sections.problems || '';
      contentEl.innerHTML = raw.trim() ? renderTopicContent(raw) : '<p class="reader__empty">В этой теме нет задач</p>';
    } else if (tab === 'tests') {
      const testsRaw = sections.tests || '';
      const cleaned = testsRaw
        .replace(/^#{1,3}\s+(Тесты|Тест|Тестирование)\s*$/mi, '')
        .replace(/^\s*(---+|\*\*\*+|___+)\s*$/gm, '')
        .replace(/<br\s*\/?>/gi, '')
        .replace(/&nbsp;/gi, '')
        .replace(/<hr\s*\/?>/gi, '')
        .trim();
      const hasTests = /\*\*\d+\.\*\*|\d+\.\s|^\s*-\s/m.test(cleaned);
      contentEl.innerHTML = hasTests ? renderTopicContent(testsRaw) : '<p class="reader__empty">В этой теме их нет, наслаждайся</p>';
    } else {
      contentEl.innerHTML = renderTopicContent(sections[tab] || '<p class="reader__empty">Раздел пуст</p>');
    }
    void contentEl.offsetWidth;
    contentEl.classList.add('is-loaded');

    contentEl.querySelectorAll('.reader__prep-item[data-pdf]').forEach(btn => {
      btn.addEventListener('click', () => openPdfModal([btn.dataset.pdf], 'Препарат'));
    });

    const pdfLinks = Array.from(contentEl.querySelectorAll('a[href$=".pdf"], a[href*=".pdf?"]'))
      .map(a => ({ href: a.getAttribute('href'), name: a.textContent.trim() || a.getAttribute('href') }))
      .filter((v, i, arr) => arr.findIndex(x => x.href === v.href) === i);

    if (pdfLinks.length) {
      pdfLinks.forEach(f => {
        const link = contentEl.querySelector(`a[href="${f.href}"]`); if (!link) return;
        const parent = link.parentElement;
        if (parent && parent.tagName === 'P') {
          let prev = parent.previousElementSibling;
          while (prev && !prev.textContent.trim() && !prev.querySelector('img')) prev = prev.previousElementSibling;
          if (prev && /примечани/i.test(prev.textContent)) prev.remove();
          parent.remove();
        } else link.remove();
      });
      contentEl.querySelectorAll('p').forEach(p => { if (!p.textContent.trim() && !p.querySelector('img')) p.remove(); });
      const wrap = document.createElement('div'); wrap.className = 'reader__pdf-attachments';
      const title = document.createElement('div'); title.className = 'reader__pdf-attachments-title'; title.textContent = 'Файлы к теме';
      wrap.appendChild(title);
      pdfLinks.forEach(f => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'reader__prep-item';
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span>${escapeHtml(f.name)}</span>`;
        btn.addEventListener('click', () => openPdfModal([f.href], f.name));
        wrap.appendChild(btn);
      });
      contentEl.appendChild(wrap);
    }

    if (readerArticle) { readerArticle.classList.remove('is-switching'); void readerArticle.offsetWidth; readerArticle.classList.add('is-switching'); }
    tocBuiltForArticle = null;
    if (readerSettings && readerSettings.classList.contains('open')) buildToc();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function isReaderOpen() { const vf = $('view-files'); return vf ? vf.classList.contains('reader-open') : false; }
  function renderPreparations(files) {
    if (!files || !files.length) return '<p class="reader__empty">Препараты к этой теме не прикреплены.</p>';
    const items = files.map((f) => {
      const name = f.split('/').pop();
      const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(f);
      const isPdf = /\.pdf$/i.test(f);
      if (isImage) return `<figure class="reader__prep-figure"><img src="${escapeHtml(f)}" alt="${escapeHtml(name)}" loading="lazy"><figcaption>${escapeHtml(name)}</figcaption></figure>`;
      if (isPdf) return `<button type="button" class="reader__prep-item" data-pdf="${escapeHtml(f)}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span>${escapeHtml(name)}</span></button>`;
      return `<a class="reader__prep-item" href="${escapeHtml(f)}" target="_blank" rel="noopener"><span>${escapeHtml(name)}</span></a>`;
    }).join('');
    return `<div class="reader__prep-list"><p class="reader__prep-hint">Нажмите на файл, чтобы открыть препараты к теме.</p>${items}</div>`;
  }
  function setCollapsed(on) {
    if (document.body.classList.contains('island-collapsed') === on) return;
    document.body.classList.toggle('island-collapsed', on);
    if (on && islandProgress) islandProgress.setAttribute('aria-hidden', 'false');
    else if (islandProgress) islandProgress.setAttribute('aria-hidden', 'true');
  }
  let lastPercent = 0, progress100Shown = false;
  function computeReadPercent() {
    const article = $('reader-article');
    if (!article) return 0;
    const content = article.querySelector('.reader__content');
    const target = content || article;
    const rect = target.getBoundingClientRect();
    const total = target.offsetHeight;
    if (total <= 0) return 0;
    const viewportH = window.innerHeight;
    const scrollable = Math.max(1, total - viewportH);
    const realScrolled = Math.max(0, window.scrollY - (target.offsetTop + article.offsetTop));
    if (rect.top + rect.height <= viewportH + 8) return 100;
    let percent = Math.round((realScrolled / scrollable) * 100);
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return percent;
  }
  function updateReadProgress() {
    if (!islandProgressValue || !islandProgressFill) return;
    const p = computeReadPercent();
    islandProgressValue.textContent = p + '%';
    islandProgressFill.style.width = p + '%';
    if (p >= 100 && lastPercent < 100 && !progress100Shown) { progress100Shown = true; celebrateProgress100(); }
    if (p < 95) progress100Shown = false;
    lastPercent = p;
  }
  function celebrateProgress100() {
    const island = $('island'); if (!island) return;
    island.classList.remove('island--done'); void island.offsetWidth; island.classList.add('island--done');
    if (islandProgressValue) {
      islandProgressValue.classList.remove('island-progress__value--done'); void islandProgressValue.offsetWidth;
      islandProgressValue.classList.add('island-progress__value--done');
      setTimeout(() => islandProgressValue.classList.remove('island-progress__value--done'), 1400);
    }
    setTimeout(() => island.classList.remove('island--done'), 1400);
  }
  function onScrollForIsland() {
    const y = window.scrollY;
    const progressEl = $('islandProgress');
    if (!isReaderOpen()) {
      setCollapsed(false);
      if (progressEl) progressEl.classList.remove('is-up');
      lastScrollY = y; return;
    }
    if (y < 60) setCollapsed(false);
    else if (y > collapseThreshold) setCollapsed(true);
    if (progressEl) {
      const scrollDelta = y - lastScrollY;
      if (scrollDelta < -5) progressEl.classList.add('is-up');
      else if (scrollDelta > 15) progressEl.classList.remove('is-up');
    }
    lastScrollY = y;
    updateReadProgress();
  }
  window.addEventListener('scroll', onScrollForIsland, { passive: true });
  window.addEventListener('resize', () => {
    collapseThreshold = window.innerWidth <= 860 ? 90 : 160;
    if (isReaderOpen()) updateReadProgress();
  }, { passive: true });
  document.addEventListener('doro:topic-rendered', () => setTimeout(updateReadProgress, 30));

  // ---------- PDF-МОДАЛКА ----------
  function openPdfModal(files, title) {
    if (!files || !files.length) return;
    if (files.length === 1) { window.open(files[0], '_blank', 'noopener'); return; }
    const list = files.map(f => f.split('/').pop()).join('\n');
    const pick = prompt('В теме несколько доп. файлов:\n' + list + '\n\nВведи номер (1–' + files.length + '), чтобы открыть:', '1');
    const idx = parseInt(pick, 10);
    if (Number.isFinite(idx) && idx >= 1 && idx <= files.length) window.open(files[idx - 1], '_blank', 'noopener');
  }

  // ---------- ЗАЩИТА ОТ КОПИРОВАНИЯ ----------
  const MAX_LINES = 15;
  let copyToastTimer = null, selectionGuardLock = false;
  function isMobileReader() { return window.innerWidth <= 860; }
  function showCopyToast(msg) {
    let toast = $('copyToast');
    if (!toast) { toast = document.createElement('div'); toast.id = 'copyToast'; toast.className = 'copy-toast'; document.body.appendChild(toast); }
    toast.textContent = msg; toast.classList.add('is-visible');
    clearTimeout(copyToastTimer);
    copyToastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }
  function isInsideReader(el) {
    if (!el) return false;
    const node = el.nodeType === 1 ? el : el.parentElement;
    return !!(node && node.closest && node.closest('.reader__content'));
  }
  function countSelectionLines(sel) {
    if (!sel || !sel.rangeCount) return 0;
    const rects = sel.getRangeAt(0).getClientRects(); if (!rects.length) return 0;
    const tops = [];
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (r.width < 1 || r.height < 1) continue;
      const top = Math.round(r.top / 2) * 2;
      if (!tops.includes(top)) tops.push(top);
    }
    return tops.length;
  }
  function trimSelectionToMaxLines(sel) {
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const lines = [];
    const walker = document.createTreeWalker(
      range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentNode : range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT, null
    );
    let node;
    while ((node = walker.nextNode())) {
      if (!range.intersectsNode(node)) continue;
      if (!isInsideReader(node)) continue;
      const textLen = node.nodeValue.length;
      for (let i = 0; i < textLen; i++) {
        const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1);
        const rect = r.getBoundingClientRect(); if (rect.width < 0.1) continue;
        const top = Math.round(rect.top / 2) * 2;
        let line = lines.find(l => l.top === top);
        if (!line) lines.push({ top, firstNode: node, firstOffset: i, lastNode: node, lastOffset: i + 1 });
        else { line.lastNode = node; line.lastOffset = i + 1; }
      }
    }
    if (lines.length <= MAX_LINES) return;
    lines.sort((a, b) => a.top - b.top);
    const keep = lines.slice(-MAX_LINES);
    const first = keep[0], last = keep[keep.length - 1];
    selectionGuardLock = true;
    try {
      const newRange = document.createRange();
      newRange.setStart(first.firstNode, first.firstOffset);
      newRange.setEnd(last.lastNode, last.lastOffset);
      sel.removeAllRanges(); sel.addRange(newRange);
      showCopyToast('Максимум ' + MAX_LINES + ' строк');
    } catch (e) {
      sel.removeAllRanges(); showCopyToast('Максимум ' + MAX_LINES + ' строк');
    }
    selectionGuardLock = false;
  }
  document.addEventListener('selectionchange', () => {
    if (selectionGuardLock || isMobileReader()) return;
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) return;
    if (!isInsideReader(sel.anchorNode) && !isInsideReader(sel.focusNode)) return;
    if (countSelectionLines(sel) > MAX_LINES) trimSelectionToMaxLines(sel);
  });
  document.addEventListener('copy', (e) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    if (!isInsideReader(sel.anchorNode) && !isInsideReader(sel.focusNode)) return;
    if (countSelectionLines(sel) > MAX_LINES) { e.preventDefault(); e.stopPropagation(); showCopyToast('Максимум ' + MAX_LINES + ' строк'); }
  });
  document.addEventListener('beforecopy', (e) => {
    if (isMobileReader()) return;
    const sel = window.getSelection(); if (!sel) return;
    if (isInsideReader(sel.anchorNode) || isInsideReader(sel.focusNode)) {
      if (countSelectionLines(sel) > MAX_LINES) { e.preventDefault(); showCopyToast('Максимум ' + MAX_LINES + ' строк'); }
    }
  });
  document.addEventListener('cut', (e) => { if (isInsideReader(e.target)) { e.preventDefault(); showCopyToast('Копирование ограничено.'); } });
  document.addEventListener('contextmenu', (e) => {
    if (isMobileReader()) return;
    if (isInsideReader(e.target)) { e.preventDefault(); showCopyToast('Правая кнопка отключена. Выделяйте до ' + MAX_LINES + ' строк.'); return false; }
  });
  document.addEventListener('keydown', (e) => {
    if (isMobileReader()) return;
    const isSelectAll = (e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A');
    if (isSelectAll && isInsideReader(document.activeElement)) { e.preventDefault(); showCopyToast('Выделить всё в теме нельзя. Максимум ' + MAX_LINES + ' строк.'); }
  });

  // ---------- ПРОДОЛЖИТЬ ЧТЕНИЕ ----------
  const LAST_READ_KEY = 'doro.lastRead';
  function saveLastRead(subjectKey, topicNum) {
    try {
      const prev = JSON.parse(localStorage.getItem(LAST_READ_KEY) || 'null');
      const same = prev && prev.subjectKey === subjectKey && prev.topicNum === topicNum;
      localStorage.setItem(LAST_READ_KEY, JSON.stringify({
        subjectKey, topicNum,
        scrollY: same ? (prev.scrollY || 0) : 0,
        percent: same ? (prev.percent || 0) : 0,
        updatedAt: Date.now()
      }));
      updateContinueTile();
    } catch (e) { /* ignore */ }
  }
  let lastReadSaveTimer = null;
  function scheduleLastReadUpdate() {
    if (!isReaderOpen() || !currentSubjectKey || !currentTopicMeta) return;
    clearTimeout(lastReadSaveTimer);
    lastReadSaveTimer = setTimeout(() => {
      try {
        const prev = JSON.parse(localStorage.getItem(LAST_READ_KEY) || 'null');
        if (!prev) return;
        if (prev.subjectKey !== currentSubjectKey || prev.topicNum !== currentTopicMeta.num) return;
        prev.scrollY = window.scrollY; prev.percent = lastPercent; prev.updatedAt = Date.now();
        localStorage.setItem(LAST_READ_KEY, JSON.stringify(prev));
        updateContinueTile();
      } catch (e) { /* ignore */ }
    }, 400);
  }
  window.addEventListener('scroll', scheduleLastReadUpdate, { passive: true });
  function getLastRead() {
    try {
      const r = JSON.parse(localStorage.getItem(LAST_READ_KEY) || 'null');
      if (!r || !r.subjectKey || !r.topicNum) return null;
      if (!subjects[r.subjectKey]) return null;
      const topic = subjects[r.subjectKey].topics.find(t => t.num === r.topicNum);
      if (!topic || topic.title === 'Раздел в разработке') return null;
      return r;
    } catch (e) { return null; }
  }
  const continueBtn = $('continueBtn');
  const continueLabel = $('continueLabel');
  function updateContinueTile() {
    if (!continueBtn) return;
    const last = getLastRead();
    if (!last) {
      continueBtn.classList.add('is-hidden'); continueBtn.setAttribute('aria-hidden', 'true'); continueBtn.setAttribute('tabindex', '-1');
      return;
    }
    const subjTitle = subjects[last.subjectKey]?.title || '';
    const pct = last.percent || 0;
    if (continueLabel) continueLabel.textContent = pct > 0 ? `${subjTitle} · ${pct}%` : subjTitle;
    continueBtn.classList.remove('is-hidden'); continueBtn.setAttribute('aria-hidden', 'false'); continueBtn.removeAttribute('tabindex');
  }
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      const last = getLastRead(); if (!last) return;
      showView('files');
      setTimeout(async () => {
        await openTopic(last.subjectKey, last.topicNum);
        setTimeout(() => { if (last.scrollY > 0) window.scrollTo({ top: last.scrollY, behavior: 'smooth' }); }, 250);
      }, 50);
    });
  }
  updateContinueTile();

  // ---------- АРХИВ ----------
  const archiveTile = $('archiveTile');
  if (archiveTile) archiveTile.addEventListener('click', () => window.open('https://disk.yandex.ru/', '_blank', 'noopener'));

  // ---------- НАВЕРХ ----------
  const islandProgressUp = $('islandProgressUp');
  if (islandProgressUp) islandProgressUp.addEventListener('click', (e) => { e.stopPropagation(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ---------- ФИНАЛЬНЫЙ РЕНДЕР ----------
  renderProfile();
  closeProfilePanel();
  showView('home');
});