// ============================================================
//  ДЕРЗКИЕ ПРИВЕТСТВИЯ (тёмная тема) — РАЗ В ДЕНЬ
// ============================================================
const DARK_GREETINGS = [
  "{name}, а ты сегодня в ударе.",
  "О, {name} на связи.",
  "{name}, выглядишь как человек с планом.",
  "{name}, у тебя всё под контролем. Почти.",
  "{name}, держим марку.",
  "{name}, ты сегодня главный герой.",
  "Ну что, {name}, зажжём?",
  "{name}, без паники — ты справишься.",
  "{name}, ты как всегда вовремя.",
  "{name}, всё по плану. Даже если плана нет."
];

const LIGHT_GREETINGS = [
  "{name}, доброе утро.",
  "Рад тебя видеть, {name}.",
  "{name}, день обещает быть хорошим.",
  "{name}, у тебя всё получится.",
  "{name}, начинаем спокойно.",
  "Хорошего дня, {name}.",
  "{name}, ты на верном пути.",
  "{name}, сегодня — твой день.",
  "Привет, {name}. Ты вовремя.",
  "{name}, пусть всё идёт легко."
];

const PROFILE_QUOTES = {
  light: [
    "Ты справляешься лучше, чем думаешь.",
    "Твой темп — правильный. Просто держи его.",
    "Каждая открытая тема — уже шаг.",
  ],
  dark: [
    "Соберись. Ты умеешь больше, чем кажется.",
    "Не сбавляй. Ты уже близко.",
    "Сегодня — твой день. Не отдавай его.",
  ]
};

let _profileQuoteCache = { light: null, dark: null };

function getProfileQuote(theme) {
  const kind = theme === "dark" ? "dark" : "light";
  if (_profileQuoteCache[kind]) return _profileQuoteCache[kind];
  const list = PROFILE_QUOTES[kind];
  const text = list[Math.floor(Math.random() * list.length)];
  _profileQuoteCache[kind] = text;
  return text;
}

const _lastGreeting = { dark: null, light: null };

function pickGreeting(list, name, kind) {
  const n = (name && name.trim()) ? name.trim() : "друг";
  if (!list || !list.length) return n;

  let idx = Math.floor(Math.random() * list.length);

  if (list.length > 1 && _lastGreeting[kind] === list[idx]) {
    idx = (idx + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
  }
  _lastGreeting[kind] = list[idx];

  return list[idx].replace(/\{name\}/g, n);
}

function pickLightGreeting(name) {
  return pickGreeting(LIGHT_GREETINGS, name, "light");
}

function pickDarkGreeting(name) {
  return pickGreeting(DARK_GREETINGS, name, "dark");
}

// Кэш выбранной фразы на текущую сессию (перезагрузка страницы = новый выбор)
let _greetingCache = { dark: null, light: null };

function getGreeting(theme, name) {
  const kind = theme === "dark" ? "dark" : "light";
  const list = theme === "dark" ? DARK_GREETINGS : LIGHT_GREETINGS;
  const n = (name && name.trim()) ? name.trim() : "друг";

  if (_greetingCache[kind] && _greetingCache[kind].name === n) {
    return _greetingCache[kind].text;
  }

  const text = pickGreeting(list, n, kind);
  _greetingCache[kind] = { name: n, text };
  return text;
}


// ============================================================
//  ДАННЫЕ
// ============================================================
window.subjects = {
  biochem: {
    num: "01", title: "Биохимия",
    author: "Кайгородов Антон",
  tabs: ["questions", "problems", "tests"],
    topics: [
      { num: "4.1", title: "Строение, переваривание, всасывание углеводов. Метаболизм гликогена, гликолиз, глюконеогенез", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-11-14", file: "content/biochem/БХ_4.1.md" },
      { num: "3.2", title: "Энергетический обмен. ЦТК. Свободно-радикальное окисление", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-10-31", file: "content/biochem/БХ_3.2.md" },
      { num: "3.1", title: "Биологические мембраны. Трансмембранная передача сигнала", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-10-24", file: "content/biochem/БХ_3.1.md" },
      { num: "2.3", title: "Коллоквиум по разделу: Матричные биосинтезы", steps: ["Прочитать основной файл", "Прочитать файл с задачами"], date: "2026-10-17", file: "content/biochem/БХ_2.3.md" },
      { num: "2.2", title: "Транскрипция, трансляция. ДНК технологии в медицине. Экспрессия генов", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-10-12", file: "content/biochem/БХ_2.2.md" },
      { num: "2.1", title: "Строение нуклеиновых кислот, репликация ДНК", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-10-05", file: "content/biochem/БХ_2.1.md" },
      { num: "1.4", title: "Коллоквиум по разделу: Энзимология", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-09-28", file: "content/biochem/БХ_1.4.md" },      
      { num: "1.3", title: "Витамины", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-09-21", file: "content/biochem/БХ_1.3.md" },
      { num: "1.2", title: "Ферменты", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-09-14", file: "content/biochem/БХ_1.2.md" },    
      { num: "1.1", title: "Структура и функции белков", steps: ["Прочитать вопросы, задачи, тесты", "Решить тесты"], date: "2026-09-07", file: "content/biochem/БХ_1.1.md" }
    ]
  },
  physio: {
    num: "02", title: "Физиология",
    author: "Кайгородов Антон",
  tabs: ["theory", "tests"],
    topics: [
      { num: "2.5", title: "Коллоквиум по разделу: Регуляция физиологических функций", steps: ["Прочитать файлик"], date: "2026-11-07", file: "content/physio/ФИЗА_2.5.md" },
      { num: "2.4", title: "Частная эндокринология. Клинико-физиологическая оценка гипо - и гиперфункции желёз", steps: ["Законспектировать ДЗ/ Лекцию", "Прочитать файлик тестов", "Выполнить тест и дз"], date: "2026-11-02", file: "content/physio/ФИЗА_2.4Т.md" },
      { num: "2.3", title: "Гуморально-гормональная регуляция. Гипоталамо-гипофизарная система", steps: ["Законспектировать ДЗ/ Лекцию", "Прочитать файлик тестов", "Выполнить тест и дз"], date: "2026-10-26", file: "content/physio/ФИЗА_2.3Т.md" },
      { num: "2.2", title: "Нервная регуляция вегетативных функций. Физиологические свойства и особенности вегетативной нервной системы, её клинико-физиологическая оценка", steps: ["Законспектировать ДЗ/ Лекцию", "Прочитать файлик тестов", "Выполнить тест и дз"], date: "2026-10-18", file: "content/physio/ФИЗА_2.2Т.md" },
      { num: "1.5", title: "Коллоквиум по разделу: Общая физиология", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-04", file: "content/physio/1.5.md" }
    ]
  },
  histology: {
    num: "03", title: "Гистология",
    author: "Мария Прокопьева",
    tabs: ["theory", "preparations"],
    topics: [
      { num: "28", title: "Коллоквиум по разделу: Органы пищеварительной системы, органы дыхания, кожа и ее производные. Диагностика препаратов.", steps: ["Прочитать файлик", "Решить тест"], date: "2026-11-07", file: "content/histology/ГИСТА_28.md", pdf: "content/histology/28П.pdf", tasksPdf: ["content/histology/ЗАДАЧИ_28.pdf", "content/histology/КРАТКИЙ_28.pdf"] },
      { num: "27", title: "Морфологическая характеристика кожи и ее производных. Морфологическая характеристика органов дыхания", steps: ["Прочитать файлик","Тема разделена на 2 части", "В конце темы краткий вариант", "Решить тест"], date: "2026-11-02", file: "content/histology/ГИСТА_27.md", pdf: "content/histology/27П.pdf" },
      { num: "26", title: "Пищеварительная система. Морфологическая характеристика печени и поджелудочной железы", steps: ["Прочитать файлик", "Решить тест"], date: "2026-10-27", file: "content/histology/ГИСТА_26.md", pdf: "content/histology/26П.pdf" },
      { num: "25", title: "Пищеварительная система. Морфологическая характеристика кишечника", steps: ["Прочитать файлик (в нем препараты)", "Решить тест"], date: "2026-10-20", file: "content/histology/ГИСТА_25.md", pdf: "content/histology/25П.pdf" },
      { num: "24", title: "Пищеварительная система. Морфологическая характеристика желудка", steps: ["Прочитать файлик", "Решить тест"], date: "2026-10-13", file: "content/histology/24.md" },
      { num: "23", title: "Пищеварительная система. Морфологическая характеристика переднего отдела пищеварительной системы: органы ротовой полости, пищевод", steps: ["Прочитать файлик", "Решить тест"], date: "2026-10-06", file: "content/histology/ГИСТА_23.md", pdf: "content/histology/23П.pdf" },
      { num: "22", title: "Коллоквиум по разделу: Органы нервной системы. Органы чувств. Диагностика препаратов", steps: ["Прочитать файлик"], date: "2026-09-29", file: "content/histology/22.md", pdf: "Бери препараты к Коллоквиуму из прошлых тем." },
      { num: "21", title: "Органы чувств. Орган слуха и равновесия. Орган вкуса", steps: ["Прочитать файлик", "Решить тест"], date: "2026-09-22", file: "content/histology/21.md", pdf: "content/histology/21П.pdf" },
      { num: "20", title: "Органы чувств. Органы зрения. Орган обоняния", steps: ["Прочитать файлик", "Решить тест"], date: "2026-09-15", file: "content/histology/20.md", pdf: "content/histology/20П.pdf" },
      { num: "19", title: "Нервная система. Морфологическая характеристика мозжечка. Морфологическая характеристика коры больших полушарий головного мозга", steps: ["Прочитать файлик", "Решить тест"], date: "2026-09-08", file: "content/histology/19.md", pdf: "content/histology/19П.pdf" },
      { num: "18", title: "Нервная система. Морфологическая характеристика спинного мозга. Морфологическая характеристика периферической нервной системы", steps: ["Прочитать файлик", "Решить тест"], date: "2026-09-01", file: "content/histology/18.md", pdf: "content/histology/18П.pdf" }
    ]
  },
  microbio: {
    num: "04", title: "Микробиология",
    author: "Сюзи Петросян",
    topics: [
      { num: "12", title: "Коллоквиум по разделу: Инфекция и иммунитет", steps: ["Прочитать файлик коллоквиума"], date: "2026-11-23", file: "content/microbio/12.md" },
      { num: "11", title: "Иммунобиологические препараты", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-11-16", file: "content/microbio/11.md" },
      { num: "10", title: "Клеточный иммунный ответ. Реакции иммунного лизиса. Реакция связывания комплемента (РСК). Иммуноферментный анализ", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-11-09", file: "content/microbio/10.md" },
      { num: "09", title: "Реакция преципитации, ее варианты. Реакция флокуляции, нейтрализации токсина антитоксином, иммунофлюоресценции. Собственно иммунологический метод диагностики", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-11-01", file: "content/microbio/09.md" },
      { num: "08", title: "Приобретенный иммунитет. Антигены. Гуморальный иммунный ответ . Антитела. Реакция агглютинации, ее варианты. Серологический метод диагностики инфекционных заболеваний", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-24", file: "content/microbio/08.md" },
      { num: "07", title: "Виды и формы иммунитета. Врожденный иммунитет. Факторы неспецифической защиты организма", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-10", file: "content/microbio/07.md" },
      { num: "06", title: "Инфекция, инфекционный процесс. Факторы патогенности бактерий", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-10", file: "content/microbio/06.md" },
      { num: "05", title: "Коллоквиум по разделу: Морфология и физиология микроорганизмов", steps: ["Прочитать файлик коллоквиума"], date: "2026-10-05", file: "content/microbio/05.md" },
      { num: "04", title: "Бактериологический метод диагностики. Культуральные, морфологические, биохимические свойства. Дыхание бактерий. Культивирование анаэробных бактерий", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-09-28", file: "content/microbio/04.md" },
      { num: "03", title: "Питание, рост и размножение бактерий. Питательные среды. Метод выделения чистых культур аэробных и анаэробных бактерий. Ферменты бактерий. Пигменты бактерий", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-09-21", file: "content/microbio/03.md" },
      { num: "02", title: "Структура бактериальной клетки. Сложные методы окраски. Особенности строения микоплазм, риккетсий, хламидий, актиномицетов, спирохет. Морфология грибов", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-09-14", file: "content/microbio/02.md" },
      { num: "01", title: "Устройство микробиологической лаборатории. Прокариоты и эукариоты. Морфология бактерий. Простые методы окраски", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-09-07", file: "content/microbio/01.md" }
    ]
  }
};

// ============================================================
//  ЕДИНЫЙ СПИСОК СТАТУСОВ + УТИЛИТЫ ГРУППЫ
// ============================================================
const USER_STATUSES = [
  "готов к коллоквиуму",
  "учусь, не мешайте",
  "всё горит",
  "на связи",
  "сплю, но не долго",
  "в потоке",
  "на парах",
  "отдыхаю",
  "на позитиве",
  "кофе и конспекты",
  "перечитываю лекции",
  "дедлайн близко",
  "живу от пары до пары",
  "почти всё успел(а)",
  "режим тишины"
];

const GROUP_DEFAULT = { letters: "ЛД", year: "25", num: "11" };
const GROUP_MAX_YEAR = 26;
const GROUP_MAX_NUM = 30;
// ============================================================
//  ЦЕПОЧКА ГРУППЫ: БУКВЫ → ГОД → НОМЕР
//  Автопереход по заполнению, серые подсказки, единый вид.
// ============================================================
function setupGroupChain(opts) {
  // opts: { letters, year, num, onChange }
  const letters = opts.letters;
  const year    = opts.year;
  const num     = opts.num;
  if (!letters || !year || !num) return null;

  const wrap = letters.closest('.group-picker');
  if (wrap) wrap.classList.add('group-picker--ready');

  const fields = [letters, year, num];

  function paintFilled(el) {
    const cell = el.closest('.group-picker__cell');
    if (!cell) return;
    cell.classList.toggle('is-filled', !!el.value);
    cell.classList.toggle('is-empty', !el.value);
    cell.classList.toggle('is-focused', document.activeElement === el);
  }
  function paintAll() { fields.forEach(paintFilled); }

  function getParts() {
    return {
      letters: normalizeGroupLetters(letters.value),
      year:    (year.value || '').replace(/\D/g, '').slice(0, 2),
      num:     (num.value || '').replace(/\D/g, '').slice(0, 2),
    };
  }
  function isComplete() {
    const p = getParts();
    return !!(p.letters && p.year && p.num);
  }

  // Ввод букв — только буквы
  letters.addEventListener('input', () => {
    const cleaned = normalizeGroupLetters(letters.value);
    if (letters.value !== cleaned) letters.value = cleaned;
    paintFilled(letters);
    // Автопереход, когда букв >= 1 и следующее поле пустое? — нет, ждём пробел/Enter
    if (opts.onChange) opts.onChange(getParts(), isComplete());
  });

  // В год — только цифры, максимум 2
  year.addEventListener('input', () => {
    let v = (year.value || '').replace(/\D/g, '').slice(0, 2);
    if (year.value !== v) year.value = v;
    paintFilled(year);
    if (v.length === 2) num.focus();   // автопереход
    if (opts.onChange) opts.onChange(getParts(), isComplete());
  });

  // В номер — только цифры, максимум 2
  num.addEventListener('input', () => {
    let v = (num.value || '').replace(/\D/g, '').slice(0, 2);
    if (num.value !== v) num.value = v;
    paintFilled(num);
    if (opts.onChange) opts.onChange(getParts(), isComplete());
  });

  // Клик в любое поле — фокус на первое незаполненное
  wrap.addEventListener('click', (e) => {
    if (e.target === letters || e.target === year || e.target === num) return;
    if (!getParts().letters) letters.focus();
    else if (!getParts().year) year.focus();
    else if (!getParts().num) num.focus();
  });

  // Фокус/блюр — перекрасить
  fields.forEach(el => {
    el.addEventListener('focus', () => paintAll());
    el.addEventListener('blur',  () => paintAll());
  });

  // Enter из любого поля: если всё заполнено — клик по «Дальше»/«Войти»
  fields.forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      if (!isComplete()) return;
      const form = wrap.closest('.onboard__step-panel, .profile-sheet__box, .onboard__box');
      const btn = form && form.querySelector('#onboardNext2, #authSubmit, #reqGroupSave, #saveNameBtn');
      if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
    });
  });

  paintAll();

  return {
    setParts(parts) {
      if (!parts) return;
      if (letters) letters.value = normalizeGroupLetters(parts.letters || '');
      if (year)    year.value    = (parts.year || '').replace(/\D/g, '').slice(0, 2);
      if (num)     num.value     = (parts.num || '').replace(/\D/g, '').slice(0, 2);
      paintAll();
      if (opts.onChange) opts.onChange(getParts(), isComplete());
    },
    getParts,
    isComplete,
    focusFirst() {
      if (!getParts().letters) letters.focus();
      else if (!getParts().year) year.focus();
      else if (!getParts().num) num.focus();
    }
  };
}
function normalizeGroupLetters(raw) {
  return (raw || "").toUpperCase().replace(/[^А-ЯЁA-Z]/g, "").slice(0, 4);
}
function formatGroup(parts) {
  if (!parts || !parts.letters || !parts.year || !parts.num) return "";
  return parts.letters + parts.year + parts.num;
}
function parseGroup(str) {
  const s = (str || "").trim().toUpperCase();
  if (!s) return { letters: "", year: "", num: "" };
  const m = s.match(/^([А-ЯЁA-Z]+)(\d{2})(\d{2})$/);
  if (m) return { letters: m[1], year: m[2], num: m[3] };
  const m2 = s.match(/^(.*?)(\d{2})(\d{2})$/);
  if (m2) return { letters: m2[1], year: m2[2], num: m2[3] };
  return { letters: s.replace(/\d/g, ""), year: "", num: "" };
}
// ============================================================
//  РАСПИСАНИЕ ПО ГРУППЕ
// ============================================================
function getScheduleForGroup(group) {
  const cfg = window.SCHEDULE_CONFIG || {};
  const all = window.SCHEDULES || {};
  const key = (group || "").trim().toUpperCase();
  if (key && all[key]) return all[key];
  if (cfg.fallbackGroup && all[cfg.fallbackGroup]) return all[cfg.fallbackGroup];
  return {};
}

// Временный просмотр чужой группы (не меняет профиль)
let _viewAsGroup = null;
function setViewAsGroup(group) { _viewAsGroup = (group || '').trim().toUpperCase() || null; }
function getViewAsGroup() { return _viewAsGroup; }

function getEffectiveGroup() {
  if (_viewAsGroup) return _viewAsGroup;
  try {
    const u = JSON.parse(localStorage.getItem('doro.user') || 'null');
    return (u && u.group) || '';
  } catch (e) { return ''; }
}

function currentSchedule() {
  return getScheduleForGroup(getEffectiveGroup());
}
// Чётность недели для КОНКРЕТНОЙ группы.
// У каждой группы может быть свой якорь: schedule._weekAnchor (строка "YYYY-MM-DD").
// Если своего якоря нет — берём глобальный из SCHEDULE_CONFIG.weekAnchor.
// Возвращает true, если это «первая» (нечётная) неделя для этой группы.
function isFirstWeek(date, schedule) {
  const cfg = window.SCHEDULE_CONFIG || {};
  const anchorStr = (schedule && schedule._weekAnchor) || cfg.weekAnchor || "2026-10-29";
  const [y, m, d] = anchorStr.split("-").map(Number);
  const anchor = new Date(y, m - 1, d);
  anchor.setHours(0, 0, 0, 0);
  const target = new Date(date); target.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((target - anchor) / 86400000);
  const weeks = Math.floor(diffDays / 7);
  return ((weeks % 2) + 2) % 2 === 0;
}

// Нормализует флаг недели у пары к 'odd' | 'even' | null.
// Поддерживает: week: 'odd' | 'even' | 1 | 2 | '1' | '2'.
function normalizeWeekFlag(v) {
  if (v === 1 || v === '1' || v === 'odd' || v === 'first') return 'odd';
  if (v === 2 || v === '2' || v === 'even' || v === 'second') return 'even';
  return null;
}

function getDaySchedule(dayKey, date) {
  const sch = currentSchedule();
  const first = isFirstWeek(date, sch);

  // 1. База: пары, у которых нет флага недели, либо флаг совпал с текущей неделей
  let base = (sch[dayKey] || []).filter(l => {
    const w = normalizeWeekFlag(l.week);
    if (!w) return true;          // без флага — каждую неделю
    return first ? w === 'odd' : w === 'even';
  });

  // 2. Старый механизм _firstWeekOnly / _secondWeekOnly (обратная совместимость)
  const firstWeekOnly = sch._firstWeekOnly || {};
  if (first && Array.isArray(firstWeekOnly[dayKey])) {
    base = base.concat(firstWeekOnly[dayKey]);
  }
  const secondWeekOnly = sch._secondWeekOnly || {};
  if (!first && Array.isArray(secondWeekOnly[dayKey])) {
    base = base.concat(secondWeekOnly[dayKey]);
  }

  // 3. Опциональный фильтр по конкретным датам (dates: ["11.11", "25.11"])
  const dateStr = String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0');
  base = base.filter(l => !l.dates || l.dates.includes(dateStr));

  return base;
}
// ============================================================
//  ЛЕКЦИИ ПО ГРУППЕ
// ============================================================
var LECTURE_YEAR = 2026;

function getLecturesForGroup(group) {
  const cfg = window.SCHEDULE_CONFIG || {};
  const all = window.LECTURES || {};
  const key = (group || "").trim().toUpperCase();
  if (key && all[key]) return all[key];
  if (cfg.fallbackGroup && all[cfg.fallbackGroup]) return all[cfg.fallbackGroup];
  return {};
}

function currentLectures() {
  return getLecturesForGroup(getEffectiveGroup());
}

function getUpcomingLectures(daysAhead) {
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var limit = new Date(today); limit.setDate(limit.getDate() + daysAhead);
  var list = [];
  var lectures = currentLectures();
  Object.keys(lectures).forEach(function (subject) {
    lectures[subject].forEach(function (item) {
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

function findNextLessonDate(subjectKey, fromDate) {
  const DOW_KEYS = ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'];
  const start = new Date(fromDate); start.setHours(0, 0, 0, 0);
  for (let i = 0; i < 60; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    const lessons = getDaySchedule(DOW_KEYS[dow], d);
    if (!lessons.some(l => l.subjectKey === subjectKey)) continue;
    return d;
  }
  return null;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
// Экранирует всё, кроме <sup>, </sup>, <sub>, </sub> — чтобы верхние/нижние индексы жили
function escapeHtmlKeepSupSub(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;(\/?)(sup|sub)&gt;/gi, '<$1$2>');
}
function toDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ============================================================
//  ДЛИНА ТЕМЫ БЕЗ БЛОКА «ТЕСТЫ»
// ============================================================
function getTheoryCharCount(raw) {
  if (!raw) return 0;
  // Заголовок секции тестов: ## Тесты / # Тест / ### Тестирование ...
  const m = raw.match(/^#{1,4}\s+(Тесты|Тест|Тестирование|Тестовые\s+задания)\s*$/mi);
  if (!m) return raw.length;
  const cut = raw.slice(0, m.index);
  // Если до тестов есть «Вопросы»/«Задачи» — они считаются, это норм (это теория)
  return cut.trim().length;
}

// ============================================================
//  СЛОЖНОСТЬ ТЕМЫ ПО ОБЪЁМУ ФАЙЛА
// ============================================================
function getTopicDifficulty(charCount) {
  if (charCount < 30000) {
    return {
      level: "easy",
      label: "Легко",
      title: "Лёгкая тема",
      desc: "Небольшой объём — можно прочитать за один подход.",
      accent: "#16a34a",
      accentDark: "#a3e635"
    };
  }
  if (charCount <= 50000) {
    return {
      level: "medium",
      label: "Средне",
      title: "Средняя тема",
      desc: "Придётся вчитаться. Лучше разбить на пару заходов.",
      accent: "#d97706",
      accentDark: "#fbbf24"
    };
  }
  return {
    level: "hard",
    label: "Сложно",
    title: "Объёмная тема",
    desc: "Материала очень много — запасись терпением и временем.",
    accent: "#dc2626",
    accentDark: "#f87171"
  };
}

// ============================================================
//  MARKDOWN-РЕНДЕР (без поисковых зависимостей)
// ============================================================
function renderTopicContent(raw) {
  if (!raw) return '<p class="reader__empty">Файл темы пуст.</p>';

  const looksLikeHtml = /<(p|div|table|h[1-6]|ul|ol|blockquote|section|article)\b[^>]*>/i.test(raw)
    && !/^#{1,6}\s/m.test(raw)
    && !/^\s*[-*+]\s/m.test(raw);
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

// ============================================================
//  Пошаговый рендер: размазываем вставку узлов по кадрам
// ============================================================
let _renderToken = 0;

function renderHtmlInChunks(container, htmlString, options) {
  options = options || {};
  const chunkSize = options.chunkSize || 30;
  const onDone = options.onDone || null;
  const myToken = ++_renderToken;

  const tmp = document.createElement('div');
  tmp.innerHTML = htmlString;
  const nodes = Array.from(tmp.childNodes);

  container.innerHTML = '';
  if (!nodes.length) {
    if (onDone && myToken === _renderToken) onDone();
    return;
  }

  // Короткие темы — вставляем сразу, без разбивки
  if (nodes.length <= chunkSize * 2) {
    container.appendChild(tmp);
    if (onDone && myToken === _renderToken) onDone();
    return;
  }

  let i = 0;
  function step() {
    if (myToken !== _renderToken) return; // тему уже переключили
    const frag = document.createDocumentFragment();
    const end = Math.min(i + chunkSize, nodes.length);
    for (; i < end; i++) frag.appendChild(nodes[i]);
    container.appendChild(frag);

    if (i < nodes.length) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(step, { timeout: 100 });
      } else {
        setTimeout(step, 0);
      }
    } else if (onDone && myToken === _renderToken) {
      onDone();
    }
  }
  step();
}

const _testsCache = new Map();
const _TESTS_CACHE_MAX = 6;

function parseTestsToQuestions(raw) {
  if (!raw) return [];
  if (_testsCache.has(raw)) return _testsCache.get(raw);

  const result = _parseTestsToQuestionsImpl(raw);

  _testsCache.set(raw, result);
  if (_testsCache.size > _TESTS_CACHE_MAX) {
    const firstKey = _testsCache.keys().next().value;
    _testsCache.delete(firstKey);
  }
  return result;
}

function _parseTestsToQuestionsImpl(raw) {
  // Убираем заголовок секции "Тесты" и мусорные разделители
  let text = raw
    .replace(/^#{1,4}\s+(Тесты|Тест|Тестирование|Тестовые\s+задания)\s*$/gmi, '')
    .replace(/^\s*(---+|\*\*\*+|___+)\s*$/gm, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/gi, ' ')
    .trim();

  const lines = text.split('\n');

  // Вопрос: **1. Вопрос?**  |  **1.**  |  1. Вопрос
  const isQuestionStart = (l) =>
    /^\s*\*\*\s*\d{1,3}[\.\)]\s+\S.*\*\*\s*$/.test(l) ||
    /^\s*\*\*\s*\d{1,3}[\.\)]\s*\*\*\s*$/.test(l) ||
    /^\s*\d{1,3}[\.\)]\s+\S/.test(l);

  // Вариант: "- ", "* ", "+ ", "а) ", "б) ", "A) ", "1) "
  const isOptionStart = (l) =>
    /^\s*(?:[-*+]|[а-яa-z][\.\)]|\d{1,2}[\.\)])\s+\S/i.test(l);

  const blocks = [];
  let current = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    if (isQuestionStart(line)) {
      if (current) blocks.push(current);
      let q = line
        .replace(/^\s*\*\*\s*/, '')
        .replace(/\*\*\s*$/, '')
        .replace(/^\s*\d{1,3}[\.\)]\s*/, '')
        .trim();
      current = { qText: q, options: [] };
      continue;
    }

    if (current) {
      if (isOptionStart(line)) current.options.push(line);
      else if (current.options.length === 0) current.qText += ' ' + line.trim();
    }
  }
  if (current) blocks.push(current);

  const questions = [];
  for (const block of blocks) {
    const options = block.options.map(opt => {
      const isCorrect =
        /\*\*[^*]+\*\*/.test(opt) ||
        /<strong>.*<\/strong>/i.test(opt) ||
        /==[^=]+==/.test(opt) ||
        /<mark>.*<\/mark>/i.test(opt);

      const clean = opt
        .replace(/^\s*(?:[-*+]|[а-яa-z][\.\)]|\d{1,2}[\.\)])\s+/i, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/==(.*?)==/g, '$1')
        .replace(/<strong>(.*?)<\/strong>/gi, '$1')
        .replace(/<mark>(.*?)<\/mark>/gi, '$1')
        // сохраняем <sup> и <sub>, остальные теги вырезаем
        .replace(/<(?!\/?(?:sup|sub)\b)[^>]+>/gi, '')
        .trim();
      return { text: clean, correct: isCorrect };
    }).filter(o => o.text);

    if (options.length < 2) continue;
    if (!options.some(o => o.correct)) continue;

    questions.push({ question: block.qText, options });
  }
  return questions;
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PHYSIO_QUIZ_LIMIT = 20;

function renderPhysioSolveMode(raw, container) {
  // Контекст темы — снимаем СРАЗУ при открытии тестов, чтобы не зависеть
  // от того, куда пользователь переключится потом
  const _meta = window.currentTopicMeta || {};
  const subjectKey   = window.currentSubjectKey || 'unknown';
  const topicNum     = _meta.num || '0';
  const topicTitle   = _meta.title || '';
  const subjectTitle = (window.subjects && window.subjects[subjectKey]?.title) || subjectKey;

  const quizKey = `${subjectKey}_${topicNum}`;
  const allQuestions = parseTestsToQuestions(raw);

  if (!allQuestions.length) {
    container.innerHTML = '<p class="reader__empty">В этой теме нет распознанных тестов</p>';
    return;
  }

  // ================= СТАРТОВЫЙ ЭКРАН =================
  function renderStartScreen() {
    const isPremium = window.doroPremium && window.doroPremium.isPremiumActive();
    const attemptsLeft = window.doroPremium
      ? window.doroPremium.quizAttemptsLeft(quizKey)
      : Infinity;
    const canStart = !window.doroPremium || window.doroPremium.canStartQuiz(quizKey);
    const freeLimit = window.doroPremium ? window.doroPremium.QUIZ_LIMIT_FREE : 10;

    const limitLabel = isPremium
      ? 'Golden: без ограничений'
      : `Осталось попыток: ${attemptsLeft} из ${freeLimit}`;

    container.innerHTML = `
      <div class="quiz-start">
        <div class="quiz-start__icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
        <h2 class="quiz-start__title">Тесты по теме</h2>
        <p class="quiz-start__sub">
          Всего вопросов: <b>${allQuestions.length}</b>.
          ${isPremium
            ? 'В Golden попытки не ограничены.'
            : `Бесплатно можно пройти <b>${freeLimit} раз</b> по каждому предмету.`}
        </p>
        <div class="quiz-start__limit ${!isPremium && attemptsLeft <= 3 ? 'quiz-start__limit--warn' : ''}">
          ${limitLabel}
        </div>
        ${
          canStart
            ? `<button type="button" class="quiz-start__btn" id="quizStartBtn">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                 Решать тесты
               </button>`
            : `<button type="button" class="quiz-start__btn quiz-start__btn--locked" disabled>
                 Попытки закончились
               </button>
               <button type="button" class="quiz-start__go-premium" id="quizGoPremiumBtn">
                 Открыть Golden
               </button>`
        }
        <button type="button" class="quiz-start__read-btn" id="quizReadBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          Просто посмотреть ответы
        </button>
      </div>
    `;

    const startBtn = container.querySelector('#quizStartBtn');
    if (startBtn && canStart) {
      startBtn.addEventListener('click', () => {
        if (window.doroPremium) window.doroPremium.addQuizAttempt(quizKey);
        openQuizOverlay();
      });
    }

    const premiumBtn = container.querySelector('#quizGoPremiumBtn');
    if (premiumBtn) {
      premiumBtn.addEventListener('click', () => {
        const backBtn = document.getElementById('readerBack');
        if (backBtn) backBtn.click();
        const navLink = document.querySelector('.nav a[data-view="premium"]');
        if (navLink) navLink.click();
      });
    }

    const readBtn = container.querySelector('#quizReadBtn');
    if (readBtn) {
      readBtn.addEventListener('click', () => {
        container.innerHTML = '';
        renderPhysioReadMode(raw, container, subjectKey);
      });
    }
  }

  // ================= ОВЕРЛЕЙ С РЕШАЛКОЙ (Множественный выбор) =================
  function openQuizOverlay() {
    const questions = shuffleArray(allQuestions).slice(0, 20).map(q => ({
      question: q.question,
      options: shuffleArray(q.options)
    }));

    let current = 0;
    let correctCount = 0;
    const answersLog = [];
    let finished = false;

    const overlay = document.createElement('div');
    overlay.className = 'qt-overlay';
    overlay.innerHTML = `
      <div class="qt-overlay__backdrop"></div>
      <div class="qt-overlay__shell" role="dialog" aria-modal="true" aria-label="Тесты">
        <div class="qt-overlay__card">
          <header class="qt-head">
            <div class="qt-head__left">
              <span class="qt-head__label">Тесты</span>
              <span class="qt-head__step"><b id="qtStep">1</b> / ${questions.length}</span>
            </div>
            <div class="qt-head__right">
              <span class="qt-head__score" title="Верных ответов">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <b id="qtScoreValue">0</b>
              </span>
              <button type="button" class="qt-head__close" id="qtClose" aria-label="Закрыть">×</button>
            </div>
          </header>
          <div class="qt-progress"><div class="qt-progress__bar" id="qtBar"></div></div>
          <main class="qt-body" id="qtBody"></main>
          <footer class="qt-foot">
            <div class="qt-foot__hint" id="qtHint">Выбери один вариант ответа</div>
            <button type="button" class="qt-btn" id="qtAnswer" disabled>Ответить</button>
          </footer>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add('qt-overlay-open');

    const stepEl   = overlay.querySelector('#qtStep');
    const scoreEl  = overlay.querySelector('#qtScoreValue');
    const barEl    = overlay.querySelector('#qtBar');
    const bodyEl   = overlay.querySelector('#qtBody');
    const hintEl   = overlay.querySelector('#qtHint');
    const answerEl = overlay.querySelector('#qtAnswer');
    const closeBtn = overlay.querySelector('#qtClose');

    function closeWithConfirm() {
      if (finished) { destroy(); return; }
      const ok = confirm('Ваша попытка будет потрачена, а прогресс обнулится. Выйти?');
      if (ok) destroy();
    }
    function destroy() {
      document.body.classList.remove('qt-overlay-open');
      overlay.remove();
      renderStartScreen();
    }

    closeBtn.addEventListener('click', closeWithConfirm);
    overlay.querySelector('.qt-overlay__backdrop').addEventListener('click', closeWithConfirm);
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') closeWithConfirm();
      if (!document.body.contains(overlay)) document.removeEventListener('keydown', escHandler);
    });

    function renderQuestion() {
      const q = questions[current];
      
      // Считаем, сколько в вопросе правильных ответов
      const correctIndices = q.options
        .map((o, i) => o.correct ? i : -1)
        .filter(i => i >= 0);
      const isMulti = correctIndices.length > 1; // Включаем режим нескольких ответов

      stepEl.textContent = String(current + 1);
      scoreEl.textContent = String(correctCount);
      barEl.style.width = ((current / questions.length) * 100) + '%';

      bodyEl.innerHTML = `
        <h2 class="qt-q">${escapeHtmlKeepSupSub(q.question)}</h2>
        <div class="qt-opts" id="qtOpts">
          ${q.options.map((o, i) => `
            <button type="button" class="qt-opt" data-i="${i}">
              <span class="qt-opt__text">${escapeHtmlKeepSupSub(o.text)}</span>
              <span class="qt-opt__state" aria-hidden="true">
                <svg class="qt-opt__state-ok" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <svg class="qt-opt__state-bad" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>
              </span>
            </button>
          `).join('')}
        </div>
      `;

      hintEl.textContent = isMulti ? 'Можно выбрать несколько' : 'Выбери один вариант';
      answerEl.textContent = 'Ответить';
      answerEl.disabled = true;
      answerEl.onclick = null;

      const optsWrap = bodyEl.querySelector('#qtOpts');
      const selected = new Set();
      let answered = false;

      optsWrap.querySelectorAll('.qt-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          const i = Number(btn.dataset.i);

          if (isMulti) {
            // Множественный выбор (галочка ставится/снимается)
            if (selected.has(i)) { selected.delete(i); btn.classList.remove('is-selected'); }
            else { selected.add(i); btn.classList.add('is-selected'); }
          } else {
            // Одиночный выбор
            selected.clear();
            selected.add(i);
            optsWrap.querySelectorAll('.qt-opt').forEach(b =>
              b.classList.toggle('is-selected', b === btn)
            );
          }
          answerEl.disabled = selected.size === 0;
        });
      });

      answerEl.onclick = () => {
        if (selected.size === 0 || answered) return;
        answered = true;

        const correctSet = new Set(correctIndices);
        let correct;

        if (isMulti) {
          // Верно, если отмечены ВСЕ правильные и НИ ОДНОГО лишнего
          correct = selected.size === correctSet.size &&
                    [...selected].every(i => correctSet.has(i));
        } else {
          // Верно, если выбран единственный правильный
          const [pick] = [...selected];
          correct = correctSet.has(pick);
        }

        optsWrap.querySelectorAll('.qt-opt').forEach((b, i) => {
          b.disabled = true;
          b.classList.remove('is-selected');
          if (correctSet.has(i)) b.classList.add('is-correct');
          else if (selected.has(i)) b.classList.add('is-wrong');
        });

        if (correct) correctCount++;
        answersLog.push({
          question: q.question,
          chosen: [...selected].map(i => q.options[i].text).join(' · '),
          correct: correctIndices.map(i => q.options[i].text).join(' · '),
          isCorrect: correct
        });

        if (!correct) {
          try {
            const raw = JSON.parse(localStorage.getItem('doro.quizErrors') || '[]');
            const arr = Array.isArray(raw) ? raw : [];
            const _topicMeta = window.currentTopicMeta || {};
            const _subjKey = window.currentSubjectKey || 'unknown';
            const _subjTitle = (window.subjects && window.subjects[_subjKey]?.title) || _subjKey;
            arr.unshift({
              question: q.question,
              correct: correctIndices.map(i => q.options[i].text).join(' · '),
              chosen: [...selected].map(i => q.options[i].text).join(' · '),
              subjectKey: _subjKey,
              subjectTitle: _subjTitle,
              topicNum: _topicMeta.num || '',
              topicTitle: _topicMeta.title || '',
              at: Date.now()
            });
            localStorage.setItem('doro.quizErrors', JSON.stringify(arr.slice(0, 200)));
          } catch (e) {}
        }

        scoreEl.textContent = String(correctCount);
        barEl.style.width = (((current + 1) / questions.length) * 100) + '%';

        hintEl.textContent = correct ? 'Верно' : 'Неверно';
        hintEl.classList.add(correct ? 'is-ok' : 'is-bad');

        const isLast = current + 1 >= questions.length;
        answerEl.textContent = isLast ? 'Показать результат' : 'Дальше';
        answerEl.disabled = false;
        answerEl.onclick = () => {
          hintEl.classList.remove('is-ok', 'is-bad');
          current++;
          if (current < questions.length) renderQuestion();
          else renderResult();
        };
      };
    }

    // ---------- Результат ----------
    function renderResult() {
      finished = true;
      const total = questions.length;
      const percent = Math.round((correctCount / total) * 100);
      const mark = correctCount === total ? '5' :
                   correctCount >= total * 0.8 ? '4' :
                   correctCount >= total * 0.6 ? '3' : '2';
      const isGolden = window.doroPremium && window.doroPremium.isPremiumActive();
      const tone = percent >= 80 ? 'good' : percent >= 60 ? 'mid' : 'bad';

      stepEl.textContent = String(total);
      barEl.style.width = '100%';
      hintEl.textContent = 'Результат';
      hintEl.classList.remove('is-ok', 'is-bad');
      answerEl.style.display = 'none';

      bodyEl.innerHTML = `
        <div class="qt-result qt-result--${tone}">
          <div class="qt-result__circle">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle class="qt-result__ring-bg" cx="60" cy="60" r="52"></circle>
              <circle class="qt-result__ring-fg" cx="60" cy="60" r="52"
                stroke-dasharray="${(percent / 100) * 2 * Math.PI * 52} 999"></circle>
            </svg>
            <div class="qt-result__center">
              <span class="qt-result__percent">${percent}<small>%</small></span>
              <span class="qt-result__score">${correctCount} из ${total}</span>
            </div>
          </div>
          <div class="qt-result__meta">
            <span class="qt-result__mark">Оценка <b>${mark}</b></span>
            ${isGolden ? `<span class="qt-result__golden">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 9.3l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.9L2 9.3l7.1-.4L12 2z"/></svg>
              Golden
            </span>` : ''}
          </div>
        </div>

        <div class="qt-review">
          <div class="qt-review__title">Разбор</div>
          <ol class="qt-review__list">
            ${answersLog.map((a, i) => `
              <li class="qt-review__item ${a.isCorrect ? 'is-correct' : 'is-wrong'}">
                <span class="qt-review__dot" aria-hidden="true"></span>
                <div class="qt-review__body">
                  <div class="qt-review__q">${escapeHtmlKeepSupSub(a.question)}</div>
                  ${a.isCorrect
                    ? `<div class="qt-review__a qt-review__a--ok">${escapeHtmlKeepSupSub(a.correct)}</div>`
                    : `<div class="qt-review__a qt-review__a--bad">Ты: ${escapeHtmlKeepSupSub(a.chosen)}</div>
                       <div class="qt-review__a qt-review__a--ok">Верно: ${escapeHtmlKeepSupSub(a.correct)}</div>`}
                </div>
              </li>
            `).join('')}
          </ol>
        </div>
      `;

      answerEl.style.display = '';
      answerEl.textContent = 'Закрыть';
      answerEl.disabled = false;
      answerEl.onclick = destroy;
      bodyEl.scrollTop = 0;
    }

    renderQuestion();
  }

  renderStartScreen();
}

// Режим «Читать» — все тесты с подсветкой верных
function renderPhysioReadMode(raw, container, subjectKey) {
  const allQuestions = parseTestsToQuestions(raw);
  if (!allQuestions.length) {
    container.innerHTML = '<p class="reader__empty">В этой теме нет распознанных тестов</p>';
    return;
  }
  const isBiochem = subjectKey === 'biochem';
  const hintText = isBiochem
    ? `Верные ответы выделены цветом. Неправильные варианты сгенерированы ИИ. Всего вопросов: ${allQuestions.length}.`
    : `Верные ответы выделены цветом. Всего вопросов: ${allQuestions.length}.`;
  container.innerHTML = `
    <div class="quiz-read">
      <div class="quiz-read__hint">${hintText}</div>
      <ol class="quiz-read__list">
        ${allQuestions.map(q => `
          <li class="quiz-read__item">
            <div class="quiz-read__q">${escapeHtmlKeepSupSub(q.question)}</div>
            <ul class="quiz-read__opts">
              ${q.options.map(o => `
                <li class="quiz-read__opt ${o.correct ? 'is-correct' : ''}">${escapeHtmlKeepSupSub(o.text)}</li>
              `).join('')}
            </ul>
          </li>
        `).join('')}
      </ol>
    </div>
  `;
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
    const inp = getInput();
    if (inp && inp.value.trim()) highlight(inp.value.trim());
    setTimeout(() => { if (inp) { inp.focus(); inp.select(); } }, 200);
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

    // Переподсветка после рендера темы/таба — иначе поиск «теряет» контент
    document.addEventListener('doro:topic-rendered', () => {
      const inp = getInput();
      if (inp && inp.value.trim()) highlight(inp.value.trim());
    });
  }

  return { bind, open, close, clear, highlight, next, prev };
})();




// ============================================================
//  ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  const $ = (id) => document.getElementById(id);

  const avatar = $('avatar');
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
  const searchField = $('searchField');
  const searchInput = $('searchInput');
  const searchResults = $('searchResults');
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
  const views = { home: $('view-home'), files: $('view-files'), links: $('view-links'), premium: $('view-premium'), profile: $('view-profile'), admin: $('view-admin') };
  const rendered = { home: false, files: false, links: false, premium: false, profile: false, admin: false };
  window.currentSubjectKey = null;
  window.currentTopicMeta = null;
  let user = JSON.parse(localStorage.getItem('doro.user') || 'null');
  if (user && typeof user === 'object') {
    user.color = user.color || '#3b82f6';
    user.group = user.group || '';
    user.status = user.status || '';
  }

  // Единая точка сохранения пользователя
  function saveUser() {
    if (!user || typeof user !== 'object') return;
    localStorage.setItem('doro.user', JSON.stringify(user));
  }
  const AVATAR_COLORS = ['#3b82f6','#16a34a','#ea580c','#9333ea','#0891b2','#e11d48','#ca8a04','#475569'];

  // ---------- Golden: эмодзи, рамки, фоны, бейджи, эффекты ----------
  const AVATAR_EMOJIS = ['🐱','🐶','🦊','🐻','🐼','🦉','🐸','🦄','🐨','🐯','🐰','🐹','🐧','🦁','🐮','🐷','👾','🤖','🦋','🌙'];
  const GOLDEN_FRAMES = [
    { id: 'none',   label: 'Без рамки' },
    { id: 'gold',   label: 'Золотая' },
    { id: 'neon',   label: 'Неон' },
    { id: 'dashed', label: 'Пунктир' },
    { id: 'glow',   label: 'Свечение' }
  ];
  const GOLDEN_BACKGROUNDS = [
    { id: 'default', label: 'Стандарт' },
    { id: 'sunset',  label: 'Закат' },
    { id: 'ocean',   label: 'Океан' },
    { id: 'forest',  label: 'Лес' },
    { id: 'gold',    label: 'Золото' },
    { id: 'space',   label: 'Космос' },
    { id: 'minimal', label: 'Минимал' }
  ];
  const GOLDEN_BADGES = [
    { id: 'none',   label: '—' },
    { id: 'fire',   label: '🔥' },
    { id: 'medal',  label: '🥇' },
    { id: 'bolt',   label: '⚡' },
    { id: 'diamond',label: '💎' },
    { id: 'grad',   label: '🎓' },
    { id: 'crown',  label: '👑' }
  ];
  const GOLDEN_EFFECTS = [
    { id: 'default', label: 'Стекло' },
    { id: 'glow',    label: 'Свечение' },
    { id: 'animated',label: 'Градиент' }
  ];

  function isGolden() {
    return !!(window.doroPremium && window.doroPremium.isPremiumActive());
  }

  // ---------- ТЕМА ----------
  const THEME_KEY = 'doro.theme';
  const THEME_MODE_KEY = 'doro.themeMode';

  function getAutoTheme() { const h = new Date().getHours(); return (h >= 9 && h < 18) ? 'light' : 'dark'; }
  function getThemeMode() { const m = localStorage.getItem(THEME_MODE_KEY); return (m === 'light' || m === 'dark' || m === 'auto') ? m : 'auto'; }
  function setThemeMode(mode) { localStorage.setItem(THEME_MODE_KEY, mode); }
  function resolveTheme(mode) { return mode === 'auto' ? getAutoTheme() : mode; }
    function updateGreetingByTheme(theme) {
      if (!greetTitle) return;
      const name = (user && user.name) ? user.name : null;
      greetTitle.textContent = getGreeting(theme, name);
    }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateGreetingByTheme(theme);
    const q = document.querySelector('.profile-thanks__short');
    if (q) q.textContent = getProfileQuote(theme === 'dark' ? 'dark' : 'light') + ' ';
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
    if (currentTheme !== nextTheme) runSnakeTransition(nextTheme);
    else applyTheme(nextTheme);
  }

  themeSegBtns.forEach(btn => btn.addEventListener('click', () => handleThemeChange(btn.dataset.mode)));

  // ---------- КНОПКА ТЕМЫ В ПРОФИЛЕ ----------
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
    const mode = getThemeMode();
    if (themeToggleLabel) themeToggleLabel.textContent = THEME_LABELS[mode];
    if (themeToggleIcon) themeToggleIcon.innerHTML = THEME_ICONS[mode];
    const t = $('tileTheme');
    if (t) t.setAttribute('aria-label', 'Тема: ' + THEME_LABELS[mode] + '. Нажмите, чтобы переключить');
  }
  const tileTheme = $('tileTheme');
  if (tileTheme) {
    tileTheme.addEventListener('click', () => {
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
    el.style.display = 'flex';
    void el.offsetWidth; // reflow для анимации
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
    window.setTimeout(() => {
      if (navIslands && !navIslands.classList.contains('is-open')) navIslands.style.display = 'none';
    }, 460);
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
        burger.setAttribute('aria-expanded', String(open));
      }
    });
  }
  document.addEventListener('click', (e) => {
    if (navIslands && navIslands.classList.contains('is-open')) {
      if (!navIslands.contains(e.target) && burger && !burger.contains(e.target)) closeNavIslands();
    } else if (nav && nav.classList.contains('nav--open')) {
      if (!nav.contains(e.target) && burger && !burger.contains(e.target)) {
        nav.classList.remove('nav--open'); burger.setAttribute('aria-expanded', 'false');
      }
    }
  });
  if (nav && burger) {
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('nav--open'); burger.setAttribute('aria-expanded', 'false');
    }));
  }
    window.addEventListener('resize', () => {
    if (!isMobileNav()) closeNavIslands();
  });

  // ---------- ПРОФИЛЬ ----------
  function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  function paintAvatar(color, useEmoji) {
    if (!avatar) return;
    avatar.style.setProperty('--ac', color);
    if (useEmoji) {
      avatar.style.background = `
        radial-gradient(circle at 30% 25%, rgba(255,255,255,0.85), transparent 55%),
        linear-gradient(135deg,
          color-mix(in srgb, ${color} 18%, #ffffff),
          color-mix(in srgb, ${color} 28%, #ffffff)
        )`;
      avatar.style.color = '';
      avatar.style.borderColor = color;
      avatar.classList.add('avatar--emoji');
    } else {
      avatar.style.background = `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #ffffff))`;
      avatar.style.color = '#fff';
      avatar.style.borderColor = color;
      avatar.classList.remove('avatar--emoji');
    }
  }
  async function syncProfileToCloud() {
    try {
      if (!window.doroCloudReady) return;
      const cloud = await window.doroCloudReady;
      if (!cloud) return;
      await cloud.saveProfile(user || {});
    } catch (e) {
      console.warn('Cloud save failed:', e);
    }
  }
  function renderProfile() {
    const avatarLetter = $('avatarLetter');
    const heroLetter = $('profileHeroLetter');
    const heroAvatar = $('profileHeroAvatar');
    const statusDisplay = $('profileStatusDisplay');
    const groupDisplay = $('profileGroupDisplay');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const quoteShort = document.querySelector('.profile-thanks__short');
    const quoteLong  = document.querySelector('.profile-thanks__long');
    if (quoteShort) quoteShort.textContent = getProfileQuote(isDark ? 'dark' : 'light') + ' ';
    if (quoteLong)  quoteLong.textContent  = '';

    if (user && user.name) {
      const initials = getInitials(user.name);
      // В шапке тоже показываем смайлик, если он выбран и Golden активен
      const useEmoji = isGolden() && user.avatarEmoji;
      if (avatarLetter) {
        avatarLetter.textContent = useEmoji ? user.avatarEmoji : initials;
      }
      if (heroLetter) heroLetter.textContent = initials;
      paintAvatar(user.color || '#3b82f6', useEmoji);
      if (greetTitle) greetTitle.textContent = getGreeting(isDark ? "dark" : "light", user.name);
      if (profileNameDisplay) profileNameDisplay.textContent = user.name;
    } else {
      if (avatarLetter) avatarLetter.textContent = '?';
      if (heroLetter) heroLetter.textContent = '?';
      if (avatar) { avatar.style.background = ''; avatar.style.color = ''; avatar.style.borderColor = ''; }
      if (greetTitle) greetTitle.textContent = getGreeting(isDark ? "dark" : "light", null);
      if (profileNameDisplay) profileNameDisplay.textContent = 'Профиль';
    }
    // --- Аватар: буква или эмодзи + Golden-рамка под цвет пользователя ---
    const accentColor = user?.color || '#3b82f6';
    if (heroAvatar) {
      const c = accentColor;
      const useEmoji = isGolden() && user?.avatarEmoji;
      heroAvatar.style.setProperty('--ac', c);
      heroAvatar.dataset.frame = (isGolden() && user?.avatarFrame) ? user.avatarFrame : 'none';
      if (useEmoji) {
        heroAvatar.style.background = `
          radial-gradient(circle at 30% 25%, rgba(255,255,255,0.85), transparent 55%),
          linear-gradient(135deg,
            color-mix(in srgb, ${c} 18%, #ffffff),
            color-mix(in srgb, ${c} 28%, #ffffff)
          )`;
        heroAvatar.style.color = '';
        heroAvatar.classList.add('is-emoji');
        heroAvatar.innerHTML = `<span aria-hidden="true">${user.avatarEmoji}</span>`;
      } else {
        heroAvatar.style.background = `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.4), transparent 55%), linear-gradient(135deg, ${c}, ${c})`;
        heroAvatar.style.color = '#fff';
        heroAvatar.classList.remove('is-emoji');
        if (heroLetter) heroLetter.textContent = (user?.name ? getInitials(user.name) : '?');
      }
    }
    // В шапке тоже применяем рамку
    if (avatar && isGolden() && user?.avatarFrame && user.avatarFrame !== 'none') {
      avatar.dataset.frame = user.avatarFrame;
    } else if (avatar) {
      delete avatar.dataset.frame;
    }
    // --- Golden: фон карточки, бейдж, эффект ---
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
      profileCard.style.setProperty('--ac', accentColor);
      const bg = (isGolden() && user?.profileBg) ? user.profileBg : 'default';
      const fx = (isGolden() && user?.profileEffect) ? user.profileEffect : 'default';
      profileCard.dataset.bg = bg;
      profileCard.dataset.effect = fx;

          // Бейдж рядом с именем (nameStyle и decor больше не поддерживаем)
      const badgeMap = { fire:'🔥', medal:'🥇', bolt:'⚡', diamond:'💎', grad:'🎓', crown:'👑' };
      const bId = (isGolden() && user?.profileBadge) ? user.profileBadge : 'none';
      const nameEl = document.getElementById('profileNameDisplay');
      if (nameEl) {
        const nameText = user && user.name ? user.name : 'Профиль';
        if (bId && bId !== 'none' && badgeMap[bId]) {
          nameEl.innerHTML = `${escapeHtml(nameText)}<span class="profile-card__badge" id="profileBadge" style="--ac:${accentColor}">${badgeMap[bId]}</span>`;
        } else {
          nameEl.textContent = nameText;
        }
      }
    }
    if (statusDisplay) statusDisplay.textContent = user?.status ? user.status : 'Статус не задан';
    if (groupDisplay) groupDisplay.textContent = user?.group ? 'Группа ' + user.group : 'Группа не выбрана';

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
    if (avatar) avatar.title = [user?.name, user?.status].filter(Boolean).join(' · ') || 'Профиль';

    const statTopicsEl = $('statTopics');
    const statReadEl = $('statRead');
    if (statTopicsEl) {
      const total = Object.values(subjects).reduce((sum, s) => sum + s.topics.filter(t => t.title !== 'Раздел в разработке').length, 0);
      statTopicsEl.textContent = String(total);
    }

    if (statReadEl) {
      const last = (function () { try { return JSON.parse(localStorage.getItem('doro.lastRead') || 'null'); } catch (e) { return null; } })();
      statReadEl.textContent = last && last.percent ? last.percent + '%' : '0%';
    }
  }

  if (avatar) avatar.addEventListener('click', (e) => { e.stopPropagation(); showView('profile'); });
  function openProfileSheet() {
    openPeModal();
  }
  function closeProfileSheet() {
    closePeModal();
  }

  window.__openProfileSheet = openProfileSheet;
  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', async () => {
      if (!nameInput) return;
      let val = nameInput.value.trim();
      if (!val) return;
      if (!/^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\-]{1,}$/.test(val) ||
          ['человек','чел','ник','никнейм','имя','тест','test','user','юзер','аноним','anon','none','нет','не знаю'].includes(val.toLowerCase())) {
        alert('Пожалуйста, укажите настоящее имя (например, «Аня»). Ники и одна буква не подходят.');
        return;
      }
      val = val.split(/\s+/)[0];
      if (!val) return;

      const oldUser = JSON.parse(localStorage.getItem('doro.user') || 'null');
      const oldId = (oldUser && oldUser.name && oldUser.group)
        ? ((oldUser.name.trim().toLowerCase().replace(/\s+/g, ' ')) + '__' + oldUser.group.trim().toUpperCase())
        : null;

      user = user || {};
      user.name = val;
      saveUser();
      nameInput.value = val;
      renderProfile();
      closeProfileSheet();

      try {
        if (window.doroCloudReady) {
          const cloud = await window.doroCloudReady;
          if (cloud) {
            // Сохраняем новый документ (ID = name__group)
            await cloud.saveProfile(user);
            // Удаляем старый, если он был и отличается
            const newId = user.name.trim().toLowerCase().replace(/\s+/g, ' ') + '__' + (user.group || '').trim().toUpperCase();
            if (oldId && oldId !== newId && cloud.deleteUserDoc) {
              try { await cloud.deleteUserDoc(oldId); } catch (e) {}
              try { localStorage.removeItem('doro.usersCache.v2'); } catch (e) {}
              usersCache = null;
              usersCacheTime = 0;
            }
          }
        }
      } catch (e) { console.warn('Cloud save failed:', e); }
    });
  }
  if (nameInput && saveNameBtn) nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveNameBtn.click(); });

  (function initGroups() {
    const lettersInp = $('groupLettersInput');
    const yearInp    = $('groupYearSelect');
    const numInp     = $('groupNumSelect');
    if (!lettersInp || !yearInp || !numInp) return;

    let chain = null;

    function applyUserGroup() {
      const parts = parseGroup(user && user.group);
      if (chain) {
        chain.setParts({
          letters: parts.letters || '',
          year:    parts.year    || '',
          num:     parts.num     || ''
        });
      } else {
        lettersInp.value = parts.letters || '';
        yearInp.value    = parts.year    || '';
        numInp.value     = parts.num     || '';
      }
    }

    async function saveGroup() {
      if (!chain || !chain.isComplete()) return;
      const p = chain.getParts();
      const groupStr = formatGroup(p);

      if (groupStr && groupStr !== user.group && isGroupFull(groupStr)) {
        alert(`Группа ${groupStr} закрыта для новых участников (полная группа).`);
        applyUserGroup();
        return;
      }

      const oldUser = JSON.parse(localStorage.getItem('doro.user') || 'null');
      const oldId = (oldUser && oldUser.name && oldUser.group)
        ? ((oldUser.name.trim().toLowerCase().replace(/\s+/g, ' ')) + '__' + oldUser.group.trim().toUpperCase())
        : null;

      if (!user) user = {};
      user.group = groupStr;
      saveUser();
      renderProfile();
      if (typeof window.__refreshSchedule === 'function') window.__refreshSchedule();

      try {
        if (window.doroCloudReady) {
          const cloud = await window.doroCloudReady;
          if (cloud) {
            await cloud.saveProfile(user);
            const newId = (user.name || '').trim().toLowerCase().replace(/\s+/g, ' ') + '__' + groupStr.trim().toUpperCase();
            if (oldId && oldId !== newId && cloud.deleteUserDoc) {
              try { await cloud.deleteUserDoc(oldId); } catch (e) {}
              try { localStorage.removeItem('doro.usersCache.v2'); } catch (e) {}
              usersCache = null;
              usersCacheTime = 0;
            }
          }
        }
      } catch (e) { console.warn('Cloud save failed:', e); }
    }

    // Цепочка: ввёл всё — сохраняем автоматически
    let saveTimer = null;
    chain = setupGroupChain({
      letters: lettersInp,
      year:    yearInp,
      num:     numInp,
      onChange: (parts, complete) => {
        clearTimeout(saveTimer);
        if (complete) {
          saveTimer = setTimeout(saveGroup, 500);
        }
      }
    });

    applyUserGroup();
    window.__refreshGroupFields = applyUserGroup;
  })();
  (function initStatus() {
    const picker = $('statusPicker');
    const trigger = $('statusTrigger');
    const triggerValue = $('statusTriggerValue');
    const menu = $('statusMenu');
    if (!picker || !trigger || !menu) return;

    menu.innerHTML = '';
    USER_STATUSES.forEach(s => {
      const li = document.createElement('li');
      li.className = 'status-picker__item';
      li.setAttribute('role', 'option');
      li.dataset.value = s;
      li.innerHTML = `<span>${s}</span>`;
      menu.appendChild(li);
    });
    const items = Array.from(menu.querySelectorAll('.status-picker__item'));
    let focusedIndex = -1;

    function defaultStatus() { return USER_STATUSES[0]; }
    function getCurrentValue() { return (user && user.status) ? user.status : defaultStatus(); }

    if (user && !user.status) {
      user.status = defaultStatus();
      saveUser();
      syncProfileToCloud();
    }

    function paintTrigger() {
      const val = getCurrentValue();
      if (triggerValue) { triggerValue.textContent = val; triggerValue.classList.remove('is-empty'); }
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
      user.status = val || defaultStatus();
      saveUser();
      paintTrigger(); closeMenu(); renderProfile();
      syncProfileToCloud();
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
        saveUser();
        // перекрасить палитру
        palette.querySelectorAll('.profile-color__swatch').forEach(b => {
          b.setAttribute('aria-selected', b.dataset.color === color ? 'true' : 'false');
        });
        // обновить профиль + превью
        renderProfile();
        if (typeof window.__paintProfilePreview === 'function') window.__paintProfilePreview();
        syncProfileToCloud();
      });
      palette.appendChild(btn);
    });
    const current = (user && user.color ? user.color : '#3b82f6').toLowerCase();
    palette.querySelectorAll('.profile-color__swatch').forEach(b => {
      b.setAttribute('aria-selected', b.dataset.color.toLowerCase() === current ? 'true' : 'false');
    });
  })();
  // ============================================================
  //  ВСТРОЕННЫЙ РЕДАКТОР ПРОФИЛЯ (pe = profile editor)
  // ============================================================
  (function initInlineProfileEditor() {
    const prevCard   = $('pePreviewCard');
    const prevAvatar = $('pePreviewAvatar');
    const prevText   = $('pePreviewAvatarText');
    const prevName   = $('pePreviewName');
    const prevStatus = $('pePreviewStatus');
    const prevGroup  = $('pePreviewGroup');
    const modeWrap   = $('peAvatarMode');
    const emojiRow   = $('peEmojiRow');
    const emojiGrid  = $('peEmojiGrid');
    const frameChips = $('peFrameChips');
    const bgGrid     = $('peBgGrid');
    const badgeChips = $('peBadgeChips');
    const fxChips    = $('peFxChips');
    const goldenLock = $('peGoldenLock');
    const goldenBody = $('peGoldenBody');
    const goldenCta  = $('peGoldenCta');

    if (!prevCard) return;

    const BADGE_EMOJI = { fire:'🔥', medal:'🥇', bolt:'⚡', diamond:'💎', grad:'🎓', crown:'👑' };
    const FRAME_LABELS = { none:'Без рамки', gold:'Золото', neon:'Неон', dashed:'Пунктир', glow:'Свечение' };
    const EFFECT_LABELS = { default:'Стекло', glow:'Свечение', animated:'Градиент' };

    function golden() { return !!(window.doroPremium && window.doroPremium.isPremiumActive()); }

    function paintEmojiGrid() {
      if (!emojiGrid) return;
      const cur = user?.avatarEmoji || '';
      emojiGrid.innerHTML = AVATAR_EMOJIS.map(e => `
        <button type="button" class="pe-emoji ${cur === e ? 'is-selected' : ''}" data-emoji="${e}" aria-label="${e}">${e}</button>
      `).join('');
    }

    function paintFrameChips() {
      if (!frameChips) return;
      const cur = user?.avatarFrame || 'none';
      frameChips.innerHTML = GOLDEN_FRAMES.map(f => `
        <button type="button" class="pe-tile ${cur === f.id ? 'is-selected' : ''}" data-frame="${f.id}">
          <span class="pe-tile__visual pe-tile__visual--frame-${f.id}"></span>
          <span class="pe-tile__label">${FRAME_LABELS[f.id] || f.label}</span>
        </button>
      `).join('');
    }

    function paintBgGrid() {
      if (!bgGrid) return;
      const cur = user?.profileBg || 'default';
      bgGrid.innerHTML = GOLDEN_BACKGROUNDS.map(b => `
        <button type="button" class="pe-bg pe-bg--${b.id} ${cur === b.id ? 'is-selected' : ''}" data-bg="${b.id}" title="${b.label}">
          <span class="pe-bg__label">${b.label}</span>
        </button>
      `).join('');
    }

    function paintBadgeChips() {
      if (!badgeChips) return;
      const cur = user?.profileBadge || 'none';
      badgeChips.innerHTML = GOLDEN_BADGES.map(b => `
        <button type="button" class="pe-badge ${cur === b.id ? 'is-selected' : ''}" data-badge="${b.id}" aria-label="${b.label}">
          ${b.id === 'none' ? '<span class="pe-badge__none">нет</span>' : b.label}
        </button>
      `).join('');
    }

    function paintFxChips() {
      if (!fxChips) return;
      const cur = user?.profileEffect || 'default';
      fxChips.innerHTML = GOLDEN_EFFECTS.map(f => `
        <button type="button" class="pe-tile ${cur === f.id ? 'is-selected' : ''}" data-fx="${f.id}">
          <span class="pe-tile__visual pe-tile__visual--fx-${f.id}"></span>
          <span class="pe-tile__label">${EFFECT_LABELS[f.id] || f.label}</span>
        </button>
      `).join('');
    }

    function paintAvatarMode() {
      if (!modeWrap) return;
      const g = golden();
      const hasEmoji = !!user?.avatarEmoji && g;
      modeWrap.querySelectorAll('.pe-seg__btn').forEach(b => {
        b.classList.toggle('is-active', (b.dataset.mode === 'emoji') === hasEmoji);
        if (b.dataset.mode === 'emoji') {
          b.classList.toggle('is-locked', !g);
          b.title = g ? 'Выбрать смайлик' : 'Доступно в Golden';
        }
      });
      if (emojiRow) emojiRow.hidden = !hasEmoji;
    }

    function paintPreview() {
      if (!prevCard) return;
      const name = (user?.name || '').trim() || 'Твоё имя';
      const c = user?.color || '#3b82f6';
      const emoji = user?.avatarEmoji || '';
      const frame = user?.avatarFrame || 'none';
      const bg = user?.profileBg || 'default';
      const fx = user?.profileEffect || 'default';
      const badge = user?.profileBadge || 'none';

      prevCard.style.setProperty('--ac', c);
      prevCard.dataset.bg = golden() ? bg : 'default';
      prevCard.dataset.effect = golden() ? fx : 'default';

      if (prevAvatar) {
        prevAvatar.style.setProperty('--ac', c);
        if (emoji) {
          prevAvatar.style.background = `
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.85), transparent 55%),
            linear-gradient(135deg,
              color-mix(in srgb, ${c} 18%, #ffffff),
              color-mix(in srgb, ${c} 28%, #ffffff)
            )`;
        } else {
          prevAvatar.style.background = `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.4), transparent 55%), linear-gradient(135deg, ${c}, ${c})`;
        }
        prevAvatar.dataset.frame = golden() ? frame : 'none';
        prevAvatar.classList.toggle('is-emoji', !!emoji);
      }
      if (prevText) prevText.textContent = emoji ? emoji : (user?.name ? getInitials(user.name) : '?');

      if (prevName) {
        if (golden() && badge !== 'none' && BADGE_EMOJI[badge]) {
          prevName.innerHTML = `${escapeHtml(name)}<span class="pe-preview__badge">${BADGE_EMOJI[badge]}</span>`;
        } else {
          prevName.textContent = name;
        }
      }
      if (prevStatus) prevStatus.textContent = user?.status || 'Статус';
      if (prevGroup) prevGroup.textContent = user?.group ? 'Группа ' + user.group : 'Группа';
    }

    function paintGoldenAccess() {
      const ok = golden();
      if (goldenLock) goldenLock.hidden = ok;
      if (goldenBody) goldenBody.hidden = !ok;
      if (!goldenCta) return;
      if (ok) {
        const days = window.doroPremium ? window.doroPremium.daysLeft() : 0;
        const wordDays = (n => {
          const m10 = n % 10, m100 = n % 100;
          if (m10 === 1 && m100 !== 11) return 'день';
          if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'дня';
          return 'дней';
        })(days);
        goldenCta.hidden = false;
        goldenCta.classList.add('is-active');
        goldenCta.innerHTML = `
          <div class="pe-golden-cta__status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.9 6.9L22 9.3l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.9L2 9.3l7.1-.4L12 2z"/>
            </svg>
            <span>Golden активен · осталось <b>${days} ${wordDays}</b></span>
          </div>
        `;
      } else {
        goldenCta.hidden = false;
        goldenCta.classList.remove('is-active');
        goldenCta.innerHTML = `
          <p class="pe-golden-cta__text">Открой оформление профиля и ещё кучу всего с Golden.</p>
          <button type="button" class="pe-golden-cta__btn" id="peGoldenGo">Открыть Golden</button>
        `;
        const go = goldenCta.querySelector('#peGoldenGo');
        if (go) go.addEventListener('click', () => {
          if (typeof setActivePanel === 'function') setActivePanel(null);
          const navLink = document.querySelector('.nav a[data-view="premium"]');
          if (navLink) navLink.click();
        });
      }
    }

    function paintAll() {
      paintPreview();
      paintAvatarMode();
      paintEmojiGrid();
      paintFrameChips();
      paintBgGrid();
      paintBadgeChips();
      paintFxChips();
      paintGoldenAccess();
    }

    window.__paintProfilePreview = paintPreview;
    window.__paintGoldenProfile = paintAll;

    window.__peOpen = function () {
      if (nameInput) nameInput.value = user?.name || '';
      paintAll();
      if (typeof window.__refreshGroupFields === 'function') window.__refreshGroupFields();
      if (typeof window.__paintStatusPicker === 'function') window.__paintStatusPicker();
    };

    // Реакции
    if (modeWrap) modeWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.pe-seg__btn'); if (!btn) return;
      if (btn.dataset.mode === 'emoji' && !golden()) {
        const gs = document.getElementById('peGoldenSection');
        if (gs) {
          gs.scrollIntoView({ behavior: 'smooth', block: 'center' });
          gs.classList.add('is-nudged');
          setTimeout(() => gs.classList.remove('is-nudged'), 900);
        }
        return;
      }
      if (!user) user = {};
      if (btn.dataset.mode === 'emoji') {
        if (!user.avatarEmoji) user.avatarEmoji = AVATAR_EMOJIS[0];
      } else {
        user.avatarEmoji = '';
      }
      saveUser(); paintAll(); renderProfile(); syncProfileToCloud();
    });

    if (emojiGrid) emojiGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.pe-emoji'); if (!btn) return;
      if (!user) user = {};
      user.avatarEmoji = btn.dataset.emoji;
      saveUser(); paintAll(); renderProfile(); syncProfileToCloud();
    });

    if (frameChips) frameChips.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-frame]'); if (!btn) return;
      if (!user) user = {};
      user.avatarFrame = btn.dataset.frame;
      saveUser(); paintAll(); renderProfile(); syncProfileToCloud();
    });

    if (bgGrid) bgGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-bg]'); if (!btn) return;
      if (!user) user = {};
      user.profileBg = btn.dataset.bg;
      saveUser(); paintAll(); renderProfile(); syncProfileToCloud();
    });

    if (badgeChips) badgeChips.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-badge]'); if (!btn) return;
      if (!user) user = {};
      user.profileBadge = btn.dataset.badge;
      saveUser(); paintAll(); renderProfile(); syncProfileToCloud();
    });

    if (fxChips) fxChips.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-fx]'); if (!btn) return;
      if (!user) user = {};
      user.profileEffect = btn.dataset.fx;
      saveUser(); paintAll(); renderProfile(); syncProfileToCloud();
    });



    document.addEventListener('doro:premium-changed', paintAll);
    paintAll();
  })();
  // ---------- СПИСОК ПОЛЬЗОВАТЕЛЕЙ В ПРОФИЛЕ ----------
const profileUsersBody = $('profileUsersBody');
const profileUsersCount = $('profileUsersCount');
const profileUsersCountLabel = $('profileUsersCountLabel');

  function getSectionAuthors() {
    const set = new Set();
    Object.values(subjects).forEach(s => {
      if (s && s.author) set.add(s.author.trim());
    });
    return [...set];
  }
  const SECTION_AUTHORS = getSectionAuthors();
  const SECTION_AUTHOR_FIRSTNAMES = SECTION_AUTHORS
    .map(a => a.split(/\s+/)[0].toLowerCase());

// Только для ключа слияния — не трогает отображение
function normalizeUserName(name) {
  return (name || '')
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/ë/g, 'е')
    .replace(/[\u0300-\u036f]/g, '');
}

// Для отображения — как есть, только с заглавной первой буквы
function displayUserName(name) {
  const n = (name || '').trim().replace(/\s+/g, ' ');
  if (!n) return '';
  return n.charAt(0).toUpperCase() + n.slice(1);
}

  // Кэш редакторов: только по uid
  let EDITOR_UIDS = new Map();

  async function loadEditorNames() {
    try {
      // Ждём, пока Firebase реально подключится (до 5 секунд)
      let waitTime = 0;
      while (!window.doroDb && waitTime < 5000) {
        await new Promise(r => setTimeout(r, 100));
        waitTime += 100;
      }
      
      if (!window.doroDb) {
        console.warn('[editors] Firebase не готов, роли не загружены');
        return;
      }

      const { getDocs, collection } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const snap = await getDocs(collection(window.doroDb, 'roles'));
      
      EDITOR_UIDS.clear();
      
      snap.forEach(d => {
        const data = d.data();
        if (data.role === 'editor' || data.role === 'admin') {
          EDITOR_UIDS.set(d.id, data.role);
        }
      });
      
      console.log('[editors] Роли успешно загружены. Найдено:', EDITOR_UIDS.size);
      
      // Если открыта вкладка пользователей — перерисовываем, чтобы бейджи появились
      const isUsersPanelOpen = document.getElementById('panelUsers')?.classList.contains('is-open');
      if (isUsersPanelOpen && typeof renderProfileUsers === 'function') {
        renderProfileUsers(true); 
      }
      
    } catch (e) { 
      console.warn('[editors] Ошибка загрузки ролей:', e); 
    }
  }

  // Возвращает 'admin', 'editor' или null — только по uid
  function getAuthorRole(u) {
    if (!u || !u.uid) return null;
    return EDITOR_UIDS.get(u.uid) || null;
  }

  // Редактор — только если совпал uid
  function isSectionAuthor(u) {
    if (!u || !u.uid) return false;
    return EDITOR_UIDS.has(u.uid);
  }

  function userKey(u) {
    return normalizeUserName(u.name).toLowerCase() + '::' + (u.group || '').trim().toLowerCase();
  }

  function mergeUsers(list) {
    const map = new Map();
    list.forEach(u => {
      const name = (u.name || '').trim().replace(/\s+/g, ' ');
      if (!name) return;
      const key = userKey({ name, group: u.group });
      if (!map.has(key)) {
        map.set(key, {
          name,
          group: (u.group || '').trim(),
          status: u.status || '',
          color: u.color || '#3b82f6',
          avatarEmoji: u.avatarEmoji || '',
          avatarFrame: u.avatarFrame || 'none',
          profileBg: u.profileBg || 'default',
          profileEffect: u.profileEffect || 'default',
          profileBadge: u.profileBadge || 'none',
          premiumActive: !!u.premiumActive,
          premiumExpiresAt: u.premiumExpiresAt || 0,
          uid: u.uid || null,
          id: u.id || null,
          uids: [u.id],
          updatedAt: u.updatedAt || 0
        });
      } else {
        const cur = map.get(key);
        cur.uids.push(u.id);
        if (u.uid && !cur.uid) cur.uid = u.uid;
        if (u.id && !cur.id) cur.id = u.id;
        if (u.status && (u.updatedAt || 0) >= cur.updatedAt) {
          cur.status = u.status;
          cur.updatedAt = u.updatedAt || 0;
        }
        if ((u.updatedAt || 0) >= cur.updatedAt) {
          cur.color = u.color || cur.color;
          cur.avatarEmoji   = u.avatarEmoji   || cur.avatarEmoji;
          cur.avatarFrame   = u.avatarFrame   || cur.avatarFrame;
          cur.profileBg     = u.profileBg     || cur.profileBg;
          cur.profileEffect = u.profileEffect || cur.profileEffect;
          cur.profileBadge  = u.profileBadge  || cur.profileBadge;
          if (u.premiumActive && (u.updatedAt || 0) >= cur.updatedAt) {
            cur.premiumActive = true;
            cur.premiumExpiresAt = u.premiumExpiresAt || 0;
          }
        }
      }
    });
    return [...map.values()];
  }

  function paintUserRow(u, opts) {
    const honorAuthor = !!(opts && opts.honorAuthor);
    const initial = u.name ? u.name[0].toUpperCase() : '?';
    const color = u.color || '#3b82f6';
    const isMe = !!(user && user.name
      && user.name.toLowerCase() === u.name.toLowerCase()
      && ((user.group || '').toLowerCase() === (u.group || '').toLowerCase()));
    const isAuthor = honorAuthor && isSectionAuthor(u);

    const row = document.createElement('div');
    row.className = 'user-chip'
      + (isMe ? ' user-chip--me' : '')
      + (isAuthor ? ' user-chip--author' : '');
    row.title = [u.name, u.group ? 'Группа ' + u.group : '', u.status || ''].filter(Boolean).join(' · ');

    const badges = [];
    if (isAuthor) badges.push('<span class="user-chip__badge user-chip__badge--author">редактор</span>');
    if (isMe) badges.push('<span class="user-chip__badge user-chip__badge--me">вы</span>');

    const emoji = u.avatarEmoji || '';
    const avatarBg = emoji
      ? `linear-gradient(135deg,
           color-mix(in srgb, ${color} 18%, #ffffff),
           color-mix(in srgb, ${color} 28%, #ffffff)
         )`
      : `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 55%, #fff))`;
    const avatarContent = emoji || initial;
    const avatarClass = 'user-chip__avatar' + (emoji ? ' is-emoji' : '');

    row.innerHTML = `
      <span class="${avatarClass}" style="background:${avatarBg}">${avatarContent}</span>
      <span class="user-chip__name">${escapeHtml(displayUserName(u.name))}</span>
      ${badges.join('')}
    `;
    return row;
  }

  // ---------- КЭШ ПОЛЬЗОВАТЕЛЕЙ ----------
  const USERS_CACHE_KEY = 'doro.usersCache.v2'; // v2 — сбросит старый кэш на 200 записей
  const USERS_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 дней
  let usersFetching = false;

  // Пытаемся загрузить кэш из localStorage при старте
  let usersCache = null;
  let usersCacheTime = 0;
  (function initUsersCache() {
    try {
      const raw = JSON.parse(localStorage.getItem(USERS_CACHE_KEY) || 'null');
      if (raw && Array.isArray(raw.data) && raw.time) {
        usersCache = raw.data;
        usersCacheTime = raw.time;
      }
    } catch (e) { /* ignore */ }
  })();

  function saveUsersCacheToLS(data) {
    try {
      localStorage.setItem(USERS_CACHE_KEY, JSON.stringify({ data, time: Date.now() }));
    } catch (e) { /* ignore */ }
  }

  async function renderProfileUsers(force = false) {
    if (!profileUsersBody) return;
    const now = Date.now();

    // Если есть свежий кэш — используем его и для числа, и для списка
    if (!force && usersCache && (now - usersCacheTime) < USERS_CACHE_TTL) {
      paintUsersList(usersCache);
      return;
    }

    if (usersFetching) return;
    usersFetching = true;

    profileUsersBody.innerHTML = '<div class="profile-users__empty">Загрузка пользователей…</div>';

    try {
      if (!window.doroCloudReady) {
        profileUsersBody.innerHTML = '<div class="profile-users__empty">Firebase недоступен.</div>';
        return;
      }
      const cloud = await window.doroCloudReady;
      if (!cloud || !cloud.listAllUsers) {
        profileUsersBody.innerHTML = '<div class="profile-users__empty">Firebase не подключён.</div>';
        return;
      }

      // Тянем всех (по 500 за раз, без ограничения в 700)
      const allUsers = await cloud.listAllUsers(500);
      usersCache = allUsers;
      usersCacheTime = Date.now();
      saveUsersCacheToLS(allUsers);

      // Считаем уникальных людей (склеиваем дубли по name+group)
      paintUsersList(allUsers);
    } catch (err) {
      console.error('renderProfileUsers error:', err);
      profileUsersBody.innerHTML = '<div class="profile-users__empty">Ошибка загрузки.</div>';
    } finally {
      usersFetching = false;
    }
  }
  // ---------- СПИСОК ЗАКРЫТЫХ ГРУПП ----------
  // Просто напиши сюда нужные группы в кавычках (БОЛЬШИМИ БУКВАМИ, без пробелов)
  const CLOSED_GROUPS = [
    "ЛД2511",
  ];

  function isGroupFull(group) {
    if (!group) return false;
    return CLOSED_GROUPS.includes(group.trim().toUpperCase());
  }

  // Слот-машина: каждый разряд — свой барабан, крутится и останавливается
  let _slotToken = 0;
  let _lastUsersTotal = -1;

  function setUsersHeroCountAnimated(groupStats) {
    const numEl = document.getElementById('profileUsersCount');
    const labelEl = document.getElementById('profileUsersCountLabel');
    if (!numEl) return;

    // Включаем режим счётчика на плитке (иконка уезжает, цифра приходит)
    const tile = document.getElementById('tileUsers');
    if (tile) tile.classList.add('has-count');

    const total = groupStats.reduce((s, [, c]) => s + c, 0);

    // склонение
    if (labelEl) {
      const m10 = total % 10, m100 = total % 100;
      let word = 'человек';
      if (m10 === 1 && m100 !== 11) word = 'человек';
      else if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) word = 'человека';
      labelEl.textContent = word;
    }

    // без изменений — без анимации
    if (total === _lastUsersTotal) {
      numEl.classList.remove('is-slots');
      numEl.textContent = String(total);
      return;
    }
    _lastUsersTotal = total;

    // reduce-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      numEl.classList.remove('is-slots');
      numEl.textContent = String(total);
      return;
    }

    const myToken = ++_slotToken;

    // Разбиваем итог на цифры
    const digits = String(total).split('');

    // Собираем слоты
    numEl.innerHTML = '';
    numEl.classList.add('is-slots');

    const reels = digits.map((targetDigit, i) => {
      // обёртка (окошко)
      const reel = document.createElement('span');
      reel.className = 'profile-users__reel';

      // столбик: 0..9 + повтор 0..9 для длинного прокрута
      const strip = document.createElement('span');
      strip.className = 'profile-users__reel-strip';

      // 2 полных круга по 10 цифр = 20 цифр
      for (let r = 0; r < 2; r++) {
        for (let d = 0; d <= 9; d++) {
          const item = document.createElement('span');
          item.className = 'profile-users__reel-item';
          item.textContent = String(d);
          strip.appendChild(item);
        }
      }
      // финальная нужная цифра — в конец (21-я позиция)
      const finalItem = document.createElement('span');
      finalItem.className = 'profile-users__reel-item';
      finalItem.textContent = targetDigit;
      strip.appendChild(finalItem);

      reel.appendChild(strip);
      numEl.appendChild(reel);
      return { reel, strip, index: i, target: Number(targetDigit) };
    });

    // Ставим прокрутку: каждая цифра начинается с 0 (сразу видно «0»)
    // и должна доехать до индекса последнего элемента (20).
    // Позиция элемента: -index * 1em (высота одного окошка = 1em).
    const STEP_PX_PER_EM = 1; // em
    const totalItems = 21;    // 20 из повторяющихся + 1 финальная

    // Все барабаны крутятся, но останавливаются по очереди:
    // задержка растёт с i: 0, 220ms, 440ms, ...
    reels.forEach(({ strip, index }) => {
      // финальное смещение — к последнему элементу
      const finalOffsetEm = -(totalItems - 1);

      // стартовая позиция — верх (0)
      strip.style.transform = 'translateY(0)';

      // задержка остановки: чем правей барабан — тем позже
      const stopDelay = index * 220;

      // длительность прокрутки (перед остановкой) — общая,
      // но каждая «докручивается» в свой момент за счёт transition-delay
      const spinDuration = 900 + index * 40; // ms

      // Триггерим анимацию:
      // 1) лёгкий старт (translateY 0)
      // 2) через requestAnimationFrame — плавный уход к финалу
      requestAnimationFrame(() => {
        strip.style.transition = `transform ${spinDuration}ms cubic-bezier(0.12, 0.8, 0.2, 1) ${stopDelay}ms`;
        strip.style.transform = `translateY(${finalOffsetEm}em)`;
      });
    });

    // Финальный «щёлк» всего блока — после последней остановки
    const lastDelay = (reels.length - 1) * 220;
    const lastDuration = 900 + (reels.length - 1) * 40;
    const finishTime = lastDelay + lastDuration;

    setTimeout(() => {
      if (myToken !== _slotToken) return;
      numEl.classList.add('is-landed');
      setTimeout(() => numEl.classList.remove('is-landed'), 500);
    }, finishTime);
  }

  // Отдельная функция отрисовки (без запроса)
  function paintUsersList(allUsers) {
    const merged = mergeUsers(allUsers);

    if (!merged.length) {
      setUsersHeroCount(0);
      return;
    }

    // Группируем по группам
    const groups = new Map();
    merged.forEach(u => {
      const g = u.group || '';
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(u);
    });
    // Своя группа — всегда первая. Дальше — по количеству человек
    // (по убыванию), при равенстве — по алфавиту. «Без группы» — в конце.
    const myGroupKey = (user && user.group) ? user.group.trim().toUpperCase() : '';
    const sortedGroups = [...groups.keys()].sort((a, b) => {
      const aKey = (a || '').trim().toUpperCase();
      const bKey = (b || '').trim().toUpperCase();

      // 1. Своя группа — всегда сверху
      const aMine = !!myGroupKey && aKey === myGroupKey;
      const bMine = !!myGroupKey && bKey === myGroupKey;
      if (aMine !== bMine) return aMine ? -1 : 1;

      // 2. «Без группы» — в конце
      if (!a && b) return 1;
      if (a && !b) return -1;

      // 3. По количеству человек — по убыванию
      const diff = groups.get(b).length - groups.get(a).length;
      if (diff !== 0) return diff;

      // 4. По алфавиту
      return a.localeCompare(b, 'ru');
    });

      setUsersHeroCountAnimated(
        sortedGroups.map(g => [g, groups.get(g).length])
      );

    const myGroup = (user && user.group) ? user.group.trim().toUpperCase() : '';

    profileUsersBody.innerHTML = '';

    // надпись про сортировку — в начало тела панели, по центру
    const oldNote = profileUsersBody.querySelector('.users-sort-note');
    if (oldNote) oldNote.remove();
    const sortNote = document.createElement('div');
    sortNote.className = 'users-sort-note users-sort-note--hero';
    sortNote.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
      <span>Сортировка по количеству человек в группе — от больших к меньшим</span>
    `;
    profileUsersBody.appendChild(sortNote);

    const grid = document.createElement('div');
    grid.className = 'users-cards-grid';

    sortedGroups.forEach(g => {
      const list = groups.get(g);
      if (!list.length) return;

      const groupFull = isGroupFull(g);
      const hasSchedule = g && window.SCHEDULES && window.SCHEDULES[g.toUpperCase()];
      const isMyGroup = !!myGroup && g.trim().toUpperCase() === myGroup;

      const card = document.createElement('div');
      card.className = 'users-group-card'
        + (groupFull ? ' users-group-card--full' : '')
        + (isMyGroup ? ' users-group-card--mine' : '');

      // клик по карточке группы — открыть расписание (если есть)
      if (hasSchedule) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          // если клик пришёлся по кнопке/ссылке внутри — не перехватываем
          if (e.target.closest('button, a')) return;
          setViewAsGroup(g);
          setActivePanel(null);
          showView('home');
          updateViewAsBanner();
          window.__refreshSchedule();
        });
      }

      // Шапка карточки — название группы
      const header = document.createElement('div');
      header.className = 'users-group-card__head';

      const nameEl = document.createElement('span');
      nameEl.className = 'users-group-card__name';
      nameEl.textContent = g || 'Без группы';
      header.appendChild(nameEl);

      // Количество человек — в том же ряду, справа от названия
      if (g) {
        const cnt = list.length;
        const m10 = cnt % 10, m100 = cnt % 100;
        let pWord = 'человек';
        if (m10 === 1 && m100 !== 11) pWord = 'человек';
        else if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) pWord = 'человека';
        const countEl = document.createElement('span');
        countEl.className = 'users-group-card__count';
        countEl.textContent = `${cnt} ${pWord}`;
        header.appendChild(countEl);
      }

      card.appendChild(header);

      // ----- Система тегов под названием группы -----
      const tagsBar = document.createElement('div');
      tagsBar.className = 'users-group-card__badges';

      // 1. Полная группа
      if (groupFull) {
        const t = document.createElement('span');
        t.className = 'group-tag group-tag--full';
        t.textContent = 'полная';
        tagsBar.appendChild(t);
      }
      // 2. Количество человек — теперь в шапке рядом с названием (см. выше)

      // 3. «Самая большая» — реально самая большая по количеству (не просто первая в списке)
      const maxCount = Math.max(...[...groups.values()].map(arr => arr.length));
      const isBiggest = groups.get(g).length === maxCount && groups.get(g).length > 1;
      if (isBiggest) {
        const t = document.createElement('span');
        t.className = 'group-tag group-tag--top';
        t.innerHTML = `
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l2.9 6.9L22 9.3l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.9L2 9.3l7.1-.4L12 2z"/>
          </svg>
          <span>самая большая</span>
        `;
        tagsBar.appendChild(t);
      }

      // 4. «Ваша группа»
      if (isMyGroup) {
        const t = document.createElement('span');
        t.className = 'group-tag group-tag--mine';
        t.textContent = 'ваша группа';
        tagsBar.appendChild(t);
      }

      // 5. «Своё расписание» — кликабельный тег
      if (hasSchedule) {
        const t = document.createElement('button');
        t.type = 'button';
        t.className = 'group-tag group-tag--schedule';
        t.innerHTML = `
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>своё расписание</span>
        `;
        t.title = 'Открыть расписание группы ' + g;
        t.addEventListener('click', (e) => {
          e.stopPropagation();
          setViewAsGroup(g);
          setActivePanel(null);
          showView('home');
          updateViewAsBanner();
          window.__refreshSchedule();
        });
        tagsBar.appendChild(t);
      }

      // 6. «Редактор» — если в группе есть автор раздела (со значком)
      const hasAuthor = list.some(u => isSectionAuthor(u));
      if (hasAuthor) {
        const t = document.createElement('span');
        t.className = 'group-tag group-tag--author';
        t.innerHTML = `
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <span>есть редактор</span>
        `;
        tagsBar.appendChild(t);
      }

      if (tagsBar.children.length) {
        card.appendChild(tagsBar);
      }

      // Тэги пользователей
      const tagsWrap = document.createElement('div');
      tagsWrap.className = 'users-group-card__tags';

      list
        .sort((a, b) => {
          const aAuth = isSectionAuthor(a) ? 0 : 1;
          const bAuth = isSectionAuthor(b) ? 0 : 1;
          if (aAuth !== bAuth) return aAuth - bAuth;
          return a.name.localeCompare(b.name, 'ru');
        })
        .forEach(u => {
          const isMe = !!(user && user.name
            && user.name.toLowerCase() === u.name.toLowerCase()
            && ((user.group || '').toLowerCase() === (u.group || '').toLowerCase()));
          const authorRole = getAuthorRole(u); // 'admin' | 'editor' | null
          const isAuthor = !!authorRole;
          const initial = u.name ? u.name[0].toUpperCase() : '?';
          const color = u.color || '#3b82f6';
          const emoji = u.avatarEmoji || '';

          // Фон аватарки: яркий для буквы, пастельный для эмодзи
          const avatarBg = emoji
            ? `linear-gradient(135deg,
                 color-mix(in srgb, ${color} 18%, #ffffff),
                 color-mix(in srgb, ${color} 28%, #ffffff)
               )`
            : `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 55%, #fff))`;
          const avatarContent = emoji || initial;
          const avatarClass = 'users-group-card__avatar' + (emoji ? ' is-emoji' : '');

          const tag = document.createElement('span');
          tag.className = 'users-group-card__tag'
            + (isMe ? ' users-group-card__tag--me' : '')
            + (isAuthor ? ' users-group-card__tag--author' : '');
          tag.title = [u.name, u.status || ''].filter(Boolean).join(' · ');

          // данные для ховер-попапа
          tag.dataset.previewUser = JSON.stringify({
            name: u.name,
            group: u.group || '',
            status: u.status || '',
            color: u.color || '#3b82f6',
            avatarEmoji: u.avatarEmoji || '',
            avatarFrame: u.avatarFrame || 'none',
            profileBg: u.profileBg || 'default',
            profileEffect: u.profileEffect || 'default',
            profileBadge: u.profileBadge || 'none'
          });

          // ★ Премиум-статус из базы (устаревание проверяем тут же)
          const premActive = !!u.premiumActive
            && (!u.premiumExpiresAt || u.premiumExpiresAt > Date.now());

          const badges = [];
          if (authorRole === 'admin') badges.push('<span class="users-group-card__badge users-group-card__badge--admin">админ</span>');
          else if (authorRole === 'editor') badges.push('<span class="users-group-card__badge users-group-card__badge--author">ред.</span>');
          if (isMe) badges.push('<span class="users-group-card__badge users-group-card__badge--me">вы</span>');

          const goldenStar = premActive
            ? `<span class="users-group-card__star" title="Golden" aria-label="Golden">★</span>`
            : '';

          tag.innerHTML = `
            <span class="${avatarClass}" style="background:${avatarBg}">${avatarContent}</span>
            <span class="users-group-card__tag-name">${escapeHtml(displayUserName(u.name))}${goldenStar}</span>
            ${badges.join('')}
          `;
          tagsWrap.appendChild(tag);
        });

      card.appendChild(tagsWrap);
      grid.appendChild(card);
    });

    profileUsersBody.appendChild(grid);
    layoutUsersMasonry(grid);
  }

  // ============================================================
  //  MASONRY ПО ВЫСОТЕ: раскладываем карточки в колонки
  //  по наименьшей текущей высоте — без рядов, плотно, по размеру.
  // ============================================================
  function layoutUsersMasonry(grid) {
    if (!grid) return;
    const cards = Array.from(grid.children);
    if (!cards.length) return;

    // Сбрасываем предыдущую раскладку
    grid.style.position = 'relative';
    cards.forEach(c => {
      c.style.position = '';
      c.style.left = '';
      c.style.top = '';
      c.style.width = '';
    });

    const containerWidth = grid.clientWidth;
    if (containerWidth <= 0) return;

    // Определяем колонки: на ПК — 3, планшет — 2, телефон — 1
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const isTablet = window.matchMedia('(max-width: 860px)').matches;
    let columns = 3;
    if (isMobile) columns = 1;
    else if (isTablet) columns = 2;

    // Ширина колонки и отступ (совпадает с gap)
    const gap = isMobile ? 8 : (isTablet ? 10 : 12);
    const colWidth = (containerWidth - gap * (columns - 1)) / columns;

    // Ставим всем карточкам одинаковую ширину, чтобы masonry был ровным
    cards.forEach(c => { c.style.width = colWidth + 'px'; });

    // Массив текущих высот колонок
    const colHeights = new Array(columns).fill(0);

    // Для каждой карточки: меряем высоту, ставим в самую низкую колонку
    cards.forEach(card => {
      // временно: absolute, чтобы измерить натуральную высоту
      card.style.position = 'absolute';
      card.style.width = colWidth + 'px';
      const h = card.offsetHeight;

      // находим самую низкую колонку
      let minIdx = 0;
      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < colHeights[minIdx]) minIdx = i;
      }

      const x = minIdx * (colWidth + gap);
      const y = colHeights[minIdx];

      card.style.left = x + 'px';
      card.style.top = y + 'px';

      colHeights[minIdx] = y + h + gap;
    });

    // Высота контейнера — максимальная колонка
    const maxH = Math.max(...colHeights) - gap;
    grid.style.height = Math.max(0, maxH) + 'px';
    grid.style.display = 'block';
  }

  // Пересчитываем masonry при ресайзе
  let _masonryResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(_masonryResizeTimer);
    _masonryResizeTimer = setTimeout(() => {
      const grid = document.querySelector('.users-cards-grid');
      if (grid && grid.children.length) layoutUsersMasonry(grid);
    }, 150);
  });
  // ---------- Управление плитками и панелями ----------
  const tileUsers     = $('tileUsers');
  const tileLectures  = $('tileLectures');
  const tileEditProfile = $('tileEditProfile');
  const panelUsers    = $('panelUsers');
  const panelLectures = $('panelLectures');
  let activePanel = null;

  // === МОДАЛКА РЕДАКТОРА ПРОФИЛЯ ===
  const peModal = $('peModal');

  function openPeModal() {
    if (!peModal) return;
    peModal.classList.add('is-open');
    peModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pe-modal-open');
    if (tileEditProfile) {
      tileEditProfile.classList.add('is-active');
      tileEditProfile.setAttribute('aria-expanded', 'true');
    }
    if (nameInput) nameInput.value = user?.name || '';
    if (typeof window.__refreshGroupFields === 'function') window.__refreshGroupFields();
    if (typeof window.__paintStatusPicker === 'function') window.__paintStatusPicker();
    if (typeof window.__peOpen === 'function') window.__peOpen();
  }

  function closePeModal() {
    if (!peModal) return;
    peModal.classList.remove('is-open');
    peModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pe-modal-open');
    if (tileEditProfile) {
      tileEditProfile.classList.remove('is-active');
      tileEditProfile.setAttribute('aria-expanded', 'false');
    }
  }

  if (peModal) {
    peModal.querySelectorAll('[data-pe-close]').forEach(el => {
      el.addEventListener('click', closePeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && peModal.classList.contains('is-open')) closePeModal();
    });
  }

  // Переключатель для старых панелей (users / lectures)
  function setActivePanel(which) {
    activePanel = which;

    [panelUsers, panelLectures].forEach(p => {
      if (!p) return;
      p.classList.remove('is-open');
      p.setAttribute('aria-hidden', 'true');
    });
    [tileUsers, tileLectures].forEach(t => {
      if (!t) return;
      t.classList.remove('is-active');
      t.setAttribute('aria-expanded', 'false');
    });

    if (!which) return;

    const panel = which === 'users' ? panelUsers
                : which === 'lectures' ? panelLectures : null;
    const tile  = which === 'users' ? tileUsers
                : which === 'lectures' ? tileLectures : null;
    if (panel) { panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false'); }
    if (tile)  { tile.classList.add('is-active'); tile.setAttribute('aria-expanded', 'true'); }

    if (which === 'users') renderProfileUsers();
    if (which === 'lectures') renderLectureInfo();
  }
  const NEW_USERS_KEY = 'doro.newUsersV1'; // поменяй на V2, чтобы снова «подсветить» плитку
  function paintUsersNew() {
    if (!tileUsers) return;
    const isNew = localStorage.getItem(NEW_USERS_KEY) !== 'seen';
    tileUsers.classList.toggle('profile-tile--new', isNew);
  }
  paintUsersNew();

  if (tileUsers) {
    tileUsers.addEventListener('click', () => {
      setActivePanel(activePanel === 'users' ? null : 'users');
      if (localStorage.getItem(NEW_USERS_KEY) !== 'seen') {
        localStorage.setItem(NEW_USERS_KEY, 'seen');
        paintUsersNew();
      }
    });
  }
    // Кнопка «Обновить» в панели пользователей
  const usersRefreshBtn = $('usersRefreshBtn');
  if (usersRefreshBtn) {
    usersRefreshBtn.addEventListener('click', async () => {
      usersRefreshBtn.style.opacity = '0.4';
      usersRefreshBtn.style.pointerEvents = 'none';
      usersCache = null;
      usersCacheTime = 0;
      try { localStorage.removeItem(USERS_CACHE_KEY); } catch (e) {}
      await renderProfileUsers(true);
      setTimeout(() => {
        usersRefreshBtn.style.opacity = '';
        usersRefreshBtn.style.pointerEvents = '';
      }, 500);
    });
  }
  if (tileLectures) {
    tileLectures.addEventListener('click', () => {
      setActivePanel(activePanel === 'lectures' ? null : 'lectures');
    });
  }

  // Обработчик плитки «Редактор» — открывает модалку
  if (tileEditProfile) {
    tileEditProfile.addEventListener('click', () => {
      if (peModal && peModal.classList.contains('is-open')) closePeModal();
      else openPeModal();
    });
  }

  // Escape закрывает открытые панели (users / lectures)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activePanel) setActivePanel(null);
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
          showView('files');
          setTimeout(() => openTopic(t.key, t.num), 50);
        });
        searchResults.appendChild(btn);
      });
    });
  }

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
    const daySchedule = getDaySchedule(dayKey, targetDate);
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
          // ★ Коллоквиум считаем по фактической теме (с учётом _topicOffset).
          // Если тема «сдвинулась за край» (null) — значит у группы в этот день
          // по этому предмету ничего нет: не считаем ни hasTopics, ни hasColloq.
          const actual = applyTopicOffset(l.subjectKey, t);
          if (actual) {
            hasTopics = true;
            if (/коллоквиум/i.test(actual.title)) hasColloq = true;
          }
        }
      }
    }
    return { hasTopics, hasColloq };
  }

  window.__refreshSchedule = function () {
    renderCalendar();
    if (rendered.home) updateTodayView();
    if (rendered.premium) renderPremiumPage();
    if (activePanel === 'lectures') renderLectureInfo();
  };

  // ---------- Просмотр чужого расписания ----------
  function updateViewAsBanner() {
    const banner = $('viewAsBanner');
    const nameEl = $('viewAsGroupName');
    const g = getViewAsGroup();
    if (!banner) return;
    if (g) {
      if (nameEl) nameEl.textContent = g;
      banner.hidden = false;
    } else {
      banner.hidden = true;
      if (nameEl) nameEl.textContent = '—';
    }
  }

  window.__exitViewAs = function () {
    setViewAsGroup(null);
    updateViewAsBanner();
    window.__refreshSchedule();
    // вернуть лекции к своей группе, если панель открыта
    if (activePanel === 'lectures') renderLectureInfo();
  };

  const viewAsBackBtn = $('viewAsBackBtn');
  if (viewAsBackBtn) {
    viewAsBackBtn.addEventListener('click', () => window.__exitViewAs());
  }

  // При уходе с Главной — сбрасываем просмотр чужой группы
  // (встроим в showView ниже — см. шаг 7)

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
      const dayInfo = getDayTopicsInfo(date);
      const hasTopics = dayInfo.hasTopics;
      const cls = ['cal-day', isWeekend ? 'weekend' : '', isToday ? 'today' : '', isSelected ? 'selected' : '', hasTopics && !isWeekend ? 'has-topics' : '', hasTopics && dayInfo.hasColloq && !isWeekend ? 'has-colloquium' : ''].filter(Boolean).join(' ');
      const disabled = isWeekend ? 'disabled' : '';
      const dataAttr = isWeekend ? '' : `data-day="${d}"`;
      html += `<button type="button" class="${cls}" ${dataAttr} ${disabled}>${d}</button>`;
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

  function updateTodayView() {
    const titleEl = $('today-title');
    const topicsPanel = $('topics-panel');
    const topicsList = $('topics-list');
    if (!titleEl || !lessonsEl) return;
    let targetDate, isToday = false;

    if (!selectedDay) {
      // Автовыбор: если сейчас >= 13:00 — показываем следующий учебный день.
      // Если < 13:00 — сегодняшний (если он учебный).
      const now = new Date();
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);

      const isSchoolDay = (d) => d.getDay() !== 0 && d.getDay() !== 6;

      let d = new Date(start);

      if (now.getHours() >= 13) {
        // смотрим на следующий день
        d.setDate(d.getDate() + 1);
      }

      // листаем вперёд до учебного дня (пятница/суббота/воскресенье → понедельник)
      while (!isSchoolDay(d)) {
        d.setDate(d.getDate() + 1);
      }

      targetDate = d;
      isToday = (targetDate.getTime() === start.getTime());

      selectedDay = targetDate.getDate();
      selectedMonth = targetDate.getMonth();
      selectedYear = targetDate.getFullYear();
      renderCalendar();

    } else {
      // Пользователь выбрал день в календаре вручную
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
    const daySchedule = getDaySchedule(dayKey, targetDate);
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

      div.innerHTML = `
        <div class="lesson-head">
          <time>${l.time}</time>
          <div style="flex:1">
            <div class="lesson-title">${l.title}</div>
            <div class="lesson-details">${details}</div>
          </div>
        </div>
      `;
      lessonsEl.appendChild(div);
      if (subjects[l.subjectKey]) {
        subjects[l.subjectKey].topics.forEach(t => {
          if (t.title === 'Раздел в разработке') return;
          const parts = t.date.split('-');
          const tDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          tDate.setHours(0, 0, 0, 0);
          const lDate = new Date(targetDate); lDate.setHours(0, 0, 0, 0);
          const next = findNextLessonDate(l.subjectKey, tDate);
          if (next && next.getTime() === lDate.getTime()) {
            // ★ Для групп с _topicOffset (например, ЛД2525 по микробиологии)
            // показываем следующую тему, а не ту, что по дате.
            // Если следующей темы нет (null) — у группы эта тема уже пройдена,
            // в этот день по этому предмету ничего не показываем.
            const actual = applyTopicOffset(l.subjectKey, t);
            if (actual && !allTopics.some(x => x.key === l.subjectKey && String(x.num) === String(actual.num))) {
              allTopics.push({ ...actual, key: l.subjectKey });
            }
          }
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
    const DAY_SWITCH_HOUR = 13;
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
    const settingsEl = $('readerSettings'); if (settingsEl) settingsEl.style.setProperty('--subject-accent', accent);
    const popEl = $('readerPop'); if (popEl) popEl.style.setProperty('--subject-accent', accent);
    const viewFiles = $('view-files'); if (viewFiles) viewFiles.style.setProperty('--subject-accent', accent);
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

      // Плашки под количеством тем
      const tabs = Array.isArray(s.tabs) ? s.tabs : [];
      const hasTests = tabs.includes('solve') || tabs.includes('read') || tabs.includes('tests');
      const hasPreps = tabs.includes('preparations');

      const testsBadge = hasTests
        ? `<span class="subject-card-big__tests" title="По этому предмету есть тесты">Тесты</span>`
        : '';
      const prepsBadge = hasPreps
        ? `<span class="subject-card-big__preps" title="К темам прикреплены препараты">Препараты</span>`
        : '';

      card.innerHTML = `
        <span class="subject-card-big__letter">${s.title[0]}</span>
        <span class="subject-card-big__body">
          <span class="subject-card-big__title">${s.title}</span>
          <span class="subject-card-big__last">${lastLine}</span>
        </span>
        <span class="subject-card-big__meta">
          <span class="subject-card-big__count">${countText}</span>
          ${testsBadge}
          ${prepsBadge}
        </span>
      `;
      card.addEventListener('click', () => openLatestTopic(key));
      subjectsCards.appendChild(card);
    });
  }
  function getCurrentTopic(valid, subjectKey) {
    if (!valid.length) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let best = null, bestDiff = Infinity;
    for (const t of valid) {
      const d = new Date(t.date + 'T00:00:00');
      if (isNaN(d.getTime())) continue;
      const diff = Math.abs(d.getTime() - today.getTime());
      if (diff < bestDiff) { bestDiff = diff; best = t; }
    }
    let picked = best || valid[valid.length - 1];

    // ★ Исключение только для групп, где в SCHEDULES задан _topicOffset.
    // Сейчас это ЛД2525: по microbio они на 1 тему впереди.
    const sch = currentSchedule();
    const offsetMap = sch && sch._topicOffset;
    if (offsetMap && subjectKey && offsetMap[subjectKey]) {
      const idx = valid.findIndex(t => t.num === picked.num);
      if (idx >= 0) {
        // сдвиг «вперёд» = к более новым темам, а valid отсортирован по убыванию номера/даты,
        // поэтому «впереди» = меньший индекс.
        const shifted = Math.max(0, idx - offsetMap[subjectKey]);
        picked = valid[shifted];
      }
    }
    return picked;
  }
    // ★ Универсальный сдвиг темы для группы (используется на Главной и в календаре).
  // subjectKey — ключ предмета ('microbio' и т.п.), topic — объект темы { num, title, ... }.
  // Если у текущей группы в SCHEDULES есть _topicOffset[subjectKey], возвращает тему
  // со сдвигом «вперёд» (к более новым). Иначе — ту же тему.
  function applyTopicOffset(subjectKey, topic) {
    if (!topic || !subjectKey) return topic;
    const sch = currentSchedule();
    const offsetMap = sch && sch._topicOffset;
    const off = offsetMap && offsetMap[subjectKey];
    if (!off) return topic;

    const subject = window.subjects && window.subjects[subjectKey];
    if (!subject) return topic;

    const valid = sortTopics(subject.topics.filter(t => t.title !== 'Раздел в разработке'));
    const idx = valid.findIndex(t => String(t.num) === String(topic.num));
    if (idx < 0) return topic;

    // valid отсортирован по убыванию номера/даты → «впереди» = меньший индекс.
    // Если следующей темы нет (упёрлись в начало списка) — значит для этой
    // группы тема «уже пройдена» → возвращаем null, чтобы её не показывать.
    const shifted = idx - off;
    if (shifted < 0) return null;
    return valid[shifted] || null;
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
    const current = getCurrentTopic(valid, key);
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
    window.currentTopicMeta = valid[initialIndex];
    window.currentSubjectKey = key;
    if (subjectsCardsView) subjectsCardsView.style.display = 'none';
    if (readerScreen) readerScreen.style.display = 'flex';
    document.dispatchEvent(new CustomEvent('doro:topic-rendered'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (readerSubjectTitle) readerSubjectTitle.textContent = subject.title;
    applySubjectAccent(readerPanel, key);
    closeReaderSettings();
    SearchCtl.close();

    // Всегда запускаем прогресс в шапке
    TopicLoader.start();


    // Теперь загрузка идет через content-store.js (сначала база, потом GitHub)
    async function loadTopicContent(topic) {
      return window.doroContent.loadTopicContent({ ...topic, subjectKey: key });
    }

    async function renderTopic(i) {
      const t = valid[i];
      if (!readerArticle) return;
      currentTopicMeta = t;
      TopicLoader.set(25);
      const authorInline = subject.author
        ? `<span class="reader__author-inline"><span class="reader__author-by">made by</span><span class="reader__author-name">${escapeHtml(subject.author)}</span></span>`
        : '';

      readerArticle.innerHTML = `
        <div class="reader__num">${t.num ? 'Тема ' + t.num : ''}${authorInline}</div>
        <h1 class="reader__heading" role="button" tabindex="0" aria-expanded="false">${t.title}</h1>
        <div class="reader__prep-slot" id="readerPrepSlot"></div>
        <div class="reader__tabs" id="readerTabs" hidden></div>
        <div class="reader__content"><p class="reader__empty">Загрузка темы…</p></div>
      `;
      readerTabs = $('readerTabs');

      // Кнопка «Скачать PDF» — только для Golden
      if (window.doroPremium && window.doroPremium.isPremiumActive()) {
        const dlBtn = document.createElement('button');
        dlBtn.type = 'button';
        dlBtn.className = 'reader-pdf-btn';
        dlBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M12 18v-6"></path>
            <polyline points="9 15 12 18 15 15"></polyline>
          </svg>
          <span>Скачать PDF</span>
        `;
        dlBtn.addEventListener('click', () => downloadTopicAsPdf());
        readerArticle.querySelector('.reader__num').appendChild(dlBtn);
      }

      // --- Сложность темы ---
      const raw = await loadTopicContent(t);
      TopicLoader.set(70);

        // --- Сложность темы (считаем только теорию, без блока «Тесты») ---
        const prepSlot = $('readerPrepSlot');
        if (prepSlot) {
          const theoryLen = getTheoryCharCount(raw);
          const diff = getTopicDifficulty(theoryLen);
          const accent = document.documentElement.getAttribute('data-theme') === 'dark'
            ? diff.accentDark : diff.accent;
          prepSlot.innerHTML = `
            <div class="reader-difficulty" data-level="${diff.level}" style="--diff-accent:${accent}">
              <div class="reader-difficulty__top">
                <span class="reader-difficulty__label">Сложность темы</span>
                <span class="reader-difficulty__chars">${theoryLen.toLocaleString('ru-RU')} симв.</span>
              </div>
            <div class="reader-difficulty__scale">
              <span class="reader-difficulty__seg"></span>
              <span class="reader-difficulty__seg"></span>
              <span class="reader-difficulty__seg"></span>
            </div>
            <h2 class="reader-difficulty__title">${diff.title}</h2>
            <p class="reader-difficulty__desc">${diff.desc}</p>
          </div>
        `;
        setTimeout(() => {
          const diffEl = prepSlot.querySelector('.reader-difficulty');
          if (!diffEl) return;
          diffEl.classList.add('is-leaving');
          setTimeout(() => {
            prepSlot.innerHTML = t.steps && t.steps.length
              ? `<div class="reader__prep reader__prep--enter"><span class="reader__prep-label">Для подготовки</span><ul>${t.steps.map(s => `<li>${s}</li>`).join('')}</ul></div>`
              : '';
          }, 400);
        }, 5000);
      }
      // --- конец блока сложности ---

    let tabConfigForRender = Array.isArray(t.tabs) ? t.tabs : (Array.isArray(subject.tabs) ? subject.tabs : []);

    // Если в заголовке темы есть слово «Коллоквиум» — принудительно убираем вкладки тестов
    const isColloquium = /коллоквиум/i.test(t.title);

    // Вкладка «Тесты» показывается только если в файле реально есть тесты и это не коллоквиум
    if (tabConfigForRender.includes('tests')) {
      const hasTests = parseTestsToQuestions(raw).length > 0;
      if (!hasTests || isColloquium) {
        tabConfigForRender = tabConfigForRender.filter(tab => tab !== 'tests');
      }
    }

    // Обратная совместимость: если в старом конфиге ещё остались 'solve'/'read' —
    // превращаем их в одну вкладку 'tests'
    if (tabConfigForRender.includes('solve') || tabConfigForRender.includes('read')) {
      tabConfigForRender = tabConfigForRender.filter(tab => tab !== 'solve' && tab !== 'read');
      if (!tabConfigForRender.includes('tests')) tabConfigForRender.push('tests');
    }

      if (readerTabs && tabConfigForRender.length >= 1) {
        const TAB_LABELS = {
          theory: 'Теория',
          tests: 'Тесты',
          preparations: 'Препараты',
          questions: 'Вопросы',
          problems: 'Задачи'
        };
        readerTabs.innerHTML = tabConfigForRender.map((tab, i) => `
          <button type="button" class="reader__tab${i === 0 ? ' is-active' : ''}" data-tab="${tab}">${TAB_LABELS[tab] || tab}</button>
        `).join('') + '<span class="reader__tab-indicator" id="readerTabIndicator"></span>';
        readerTabs.classList.toggle('reader__tabs--grid4', tabConfigForRender.length === 4);
        readerTabs.hidden = false; readerTabs.style.display = '';
      } else if (readerTabs) {
        readerTabs.hidden = true; readerTabs.style.display = 'none'; readerTabs.innerHTML = '';
        readerTabs.classList.remove('reader__tabs--grid4');
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
        contentEl.innerHTML = ''; // без скелетона — плавное появление самого контента
      }

      if (tabConfigForRender.length >= 1) {
        const sections = buildTabSections(raw, tabConfigForRender, t);
        setupTabs(sections, tabConfigForRender);
        showTab(tabConfigForRender[0], contentEl, sections);
      } else {
        renderHtmlInChunks(contentEl, renderTopicContent(raw), {
          onDone: () => {
            contentEl.classList.add('is-loaded');
            document.dispatchEvent(new CustomEvent('doro:topic-rendered'));
          }
        });
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
      TopicLoader.set(100);
    }

      const MIN_DELAY = 900;
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));

      try {
        const loadAndRender = renderTopic(initialIndex);
        await Promise.all([loadAndRender, delay(MIN_DELAY)]);
      } catch (e) {
        console.warn('[topic] render failed:', e);
        if (readerArticle) {
          const contentEl = readerArticle.querySelector('.reader__content');
          if (contentEl) {
            contentEl.innerHTML = '<p class="reader__empty">Не удалось загрузить тему. Попробуйте ещё раз.</p>';
            contentEl.classList.add('is-loaded');
          }
        }
      } finally {
        // finish() вызывается ВСЕГДА, даже если renderTopic упал
        await TopicLoader.finish();
        saveLastRead(key, valid[initialIndex].num);
      }
  }

  if (readerBack) {
    readerBack.addEventListener('click', () => {
      SearchCtl.close();
      if (typeof TopicLoader !== 'undefined') TopicLoader.reset();
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

  // ============================================================
  //  СКАЧИВАНИЕ ТЕМЫ В PDF (только Golden)
  // ============================================================
  function downloadTopicAsPdf() {
    if (!window.doroPremium || !window.doroPremium.isPremiumActive()) return;
    if (!window.currentTopicMeta || !window.currentSubjectKey) return;

    const subject = window.subjects[window.currentSubjectKey];
    if (!subject) return;

    const t = window.currentTopicMeta;
    const contentEl = document.querySelector('#reader-article .reader__content');
    if (!contentEl) return;

    // Клонируем контент и чистим лишнее
    const clone = contentEl.cloneNode(true);
    clone.querySelectorAll('mark.reader-search__hit').forEach(m => {
      const parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
    clone.querySelectorAll('.reader__extra-files, .reader__pdf-attachments').forEach(el => el.remove());

    const author = subject.author || '';
    const num = t.num || '';
    const title = t.title || '';
    const dateStr = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

    // Полный HTML-документ для печати
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)} — ${escapeHtml(subject.title)}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  html, body { background: #fff; }
  body {
    font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
    color: #16202e;
    margin: 0;
    padding: 0;
    font-size: 13.5px;
    line-height: 1.65;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Шапка */
  .pdf-head {
    border-bottom: 2px solid #b45309;
    padding-bottom: 14px;
    margin-bottom: 22px;
  }
  .pdf-num {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #b45309;
    margin-bottom: 6px;
  }
  .pdf-num .pdf-author {
    text-transform: none;
    letter-spacing: 0;
    opacity: 0.6;
    margin-left: 10px;
    font-weight: 500;
  }
  .pdf-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1.28;
    color: #16202e;
    margin: 0;
  }
  .pdf-meta {
    font-size: 11px;
    color: #7a8699;
    margin-top: 8px;
  }

  /* Контент — те же правила, что в читалке */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 800;
    line-height: 1.32;
    margin: 22px 0 10px;
    color: #16202e;
    page-break-after: avoid;
    break-after: avoid-page;
  }
  h1 { font-size: 20px; }
  h2 { font-size: 17px; }
  h3 { font-size: 15px; }
  h4 { font-size: 13.5px; }
  p { margin: 0 0 10px; }
  ul, ol { padding-left: 22px; margin: 0 0 12px; }
  li { margin-bottom: 4px; }
  li::marker { color: #b45309; font-weight: 700; }
  strong { font-weight: 700; }
  em { font-style: italic; }
  code {
    background: #f4f6fa;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: "SFMono-Regular", Consolas, monospace;
  }
  pre {
    background: #f4f6fa;
    padding: 12px 14px;
    border-radius: 8px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  blockquote {
    border-left: 3px solid #b45309;
    background: #fffaf0;
    padding: 8px 14px;
    border-radius: 0 8px 8px 0;
    margin: 0 0 12px;
    color: #5a6678;
    font-style: italic;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0 0 14px;
    font-size: 12px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  th, td {
    border: 1px solid #e2e6ee;
    padding: 6px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #fffaf0;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #b45309;
  }
  tr, td, th { page-break-inside: avoid; break-inside: avoid; }
  hr {
    border: none;
    border-top: 1px dashed #e2e6ee;
    margin: 16px 0;
  }
  img { max-width: 100%; height: auto; page-break-inside: avoid; }
  sub, sup { font-size: 0.72em; line-height: 0; position: relative; }
  sup { top: -0.45em; }
  sub { top: 0.25em; }

  .reader__empty { color: #7a8699; font-style: italic; }
  .reader__gap { height: 12px; }
  .reader__checklist-item { list-style: none; margin-left: -18px; }
  .reader__footnotes { font-size: 11px; color: #7a8699; margin-top: 24px; }

  /* Подвал */
  .pdf-foot {
    margin-top: 30px;
    padding-top: 12px;
    border-top: 1px solid #e2e6ee;
    font-size: 10.5px;
    color: #a3adbd;
    text-align: center;
  }

  /* Заголовки не висят в конце страницы */
  h1 + p, h2 + p, h3 + p { page-break-before: avoid; break-before: avoid-page; }
</style>
</head>
<body>
  <div class="pdf-head">
    <div class="pdf-num">
      ${num ? 'Тема ' + escapeHtml(num) : ''}
      ${author ? `<span class="pdf-author">made by ${escapeHtml(author)}</span>` : ''}
    </div>
    <h1 class="pdf-title">${escapeHtml(title)}</h1>
    <div class="pdf-meta">${escapeHtml(subject.title)} · ${dateStr} · doro Golden</div>
  </div>
  <div class="pdf-body">${clone.innerHTML}</div>
  <div class="pdf-foot">doro · Golden · ${escapeHtml(subject.title)}</div>
</body>
</html>`;

    // Скрытый iframe — так браузер не блокирует print и не уводит со страницы
    const oldFrame = document.getElementById('doro-pdf-frame');
    if (oldFrame) oldFrame.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'doro-pdf-frame';
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Ждём загрузку шрифтов/картинок, потом печатаем
    const doPrint = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.warn('print failed:', e);
        // fallback: открываем в новой вкладке
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const w = window.open(url, '_blank', 'noopener');
        if (!w) {
          const a = document.createElement('a');
          a.href = url;
          a.download = `${subject.title} — ${title}.html`.replace(/[\\/:*?"<>|]/g, '_');
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        setTimeout(() => URL.revokeObjectURL(url), 6000);
      }
    };

    // Печатаем после того, как страница реально отрисовалась
    if (doc.readyState === 'complete') {
      setTimeout(doPrint, 350);
    } else {
      iframe.addEventListener('load', () => setTimeout(doPrint, 350), { once: true });
    }

    // Чистим iframe через 2 минуты (после того как пользователь сохранил)
    setTimeout(() => {
      const f = document.getElementById('doro-pdf-frame');
      if (f) f.remove();
    }, 120000);
  }
// Приветствия для активного Golden
function getGoldenGreeting(name) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const list = isDark
    ? [
        `${escapeHtml(name)}, ты в потоке.`,
        `О, ${escapeHtml(name)}. Золотой час.`,
        `${escapeHtml(name)}, держим темп.`,
        `С возвращением, ${escapeHtml(name)}.`,
        `${escapeHtml(name)}, Golden на связи.`
      ]
    : [
        `Привет, ${escapeHtml(name)}.`,
        `Рады видеть, ${escapeHtml(name)}.`,
        `${escapeHtml(name)}, всё на месте.`,
        `С возвращением, ${escapeHtml(name)}.`,
        `${escapeHtml(name)}, Golden с тобой.`
      ];
  // кэш на сессию — чтобы не мигало при перерисовке
  if (!window.__goldenGreetCache) window.__goldenGreetCache = {};
  const key = isDark ? 'dark' : 'light';
  if (!window.__goldenGreetCache[key]) {
    window.__goldenGreetCache[key] = list[Math.floor(Math.random() * list.length)];
  }
  return window.__goldenGreetCache[key];
}

function getGoldenSubtitle(name, days) {
  if (days <= 3) return 'Совсем немного осталось — продли, чтобы не потерять доступ.';
  if (days <= 7) return 'Неделя — ещё норм. Но лучше продлить заранее.';
  if (days <= 14) return 'Половина пути. Всё под контролем.';
  return 'Всё под контролем. Продолжаем в том же духе.';
}
  function renderPremiumPage() {
    const view = document.getElementById('view-premium');
    if (!view || !window.doroPremium) return;

    const active = window.doroPremium.isPremiumActive();
    const days = window.doroPremium.daysLeft();
    const price = window.doroPremium.PRICE_RUB;
    const name = (user && user.name) || 'друг';

    if (active) {
      // ---------- АКТИВНЫЙ GOLDEN ----------
      view.innerHTML = `
        <div class="golden-page golden-page--active">
          <div class="golden-active-hero">
            <div class="golden-active-hero__top">
              <span class="golden-wordmark golden-wordmark--sm" aria-hidden="true">Golden</span>
              <span class="golden-active-hero__badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.9 6.9L22 9.3l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.9L2 9.3l7.1-.4L12 2z"/>
                </svg>
                активен
              </span>
            </div>

            <h1 class="golden-active-hero__title">
              ${getGoldenGreeting(name)}
            </h1>
            <p class="golden-active-hero__sub">
              ${getGoldenSubtitle(name, days)}
            </p>

            <div class="golden-active-days">
              <span class="golden-active-days__label">Осталось</span>
              <div class="golden-active-days__num-block">
                <span class="golden-active-days__num" id="goldenDaysNum">${days}</span>
                <span class="golden-active-days__word" id="goldenDaysWord">${pluralDays(days, 'день', 'дня', 'дней')}</span>
              </div>
              <div class="golden-active-days__bar">
                <span class="golden-active-days__fill" style="width:${Math.max(0, Math.min(100, Math.round((days / 30) * 100)))}%"></span>
              </div>
            </div>
          </div>

          <div class="golden-active-body">
            <div class="golden-tabs" role="tablist">
              <button type="button" class="golden-tabs__btn is-active" data-golden-tab="quizzes" role="tab" aria-selected="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>Ошибки</span>
              </button>
              <button type="button" class="golden-tabs__btn" data-golden-tab="cards" role="tab" aria-selected="false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="16" height="12" rx="2"></rect><path d="M22 8v8"></path><line x1="6" y1="12" x2="14" y2="12"></line></svg>
                <span>Карточки</span>
              </button>
            </div>

            <div class="golden-panel" id="premiumPanel"></div>

            <div class="golden-perks">
              <div class="golden-perks__head">
                <span class="golden-perks__title">Что у тебя есть</span>
                <span class="golden-perks__hint">нажми, чтобы перейти</span>
              </div>

              <div class="golden-perks__grid">
                <button type="button" class="golden-perk" data-perk-go="quizzes">
                  <span class="golden-perk__icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  </span>
                  <span class="golden-perk__body">
                    <b>Ошибки в тестах</b>
                    <span>Всё, где споткнулся — в одном месте</span>
                  </span>
                  <span class="golden-perk__arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                </button>

                <button type="button" class="golden-perk" data-perk-go="cards">
                  <span class="golden-perk__icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="16" height="12" rx="2"></rect><path d="M22 8v8"></path><line x1="6" y1="12" x2="14" y2="12"></line></svg>
                  </span>
                  <span class="golden-perk__body">
                    <b>Карточки к коллоквиуму</b>
                    <span>Вопрос → ответ, листаешь в маршрутке</span>
                  </span>
                  <span class="golden-perk__arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                </button>

                <button type="button" class="golden-perk" data-perk-go="pdf">
                  <span class="golden-perk__icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><polyline points="9 15 12 18 15 15"></polyline></svg>
                  </span>
                  <span class="golden-perk__body">
                    <b>Скачать тему в PDF</b>
                    <span>Кнопка в шапке любой темы</span>
                  </span>
                  <span class="golden-perk__arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                </button>

                <button type="button" class="golden-perk" data-perk-go="profile">
                  <span class="golden-perk__icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"></path><path d="M16.5 8.5l1.5-1.5"></path></svg>
                  </span>
                  <span class="golden-perk__body">
                    <b>Оформление профиля</b>
                    <span>Смайлик, рамки, фоны, бейдж</span>
                  </span>
                  <span class="golden-perk__arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                </button>

                <button type="button" class="golden-perk" data-perk-go="tests">
                  <span class="golden-perk__icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                  </span>
                  <span class="golden-perk__body">
                    <b>Тесты без лимита</b>
                    <span>Сколько нужно — столько и решай</span>
                  </span>
                  <span class="golden-perk__arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                </button>
              </div>
            </div>

            <button type="button" class="golden-manage" id="premiumManageBtn">Управление подпиской</button>
          </div>
        </div>
      `;

      const tabs = view.querySelectorAll('[data-golden-tab]');
      function activateTab(tab) {
        tabs.forEach(b => {
          const on = b.dataset.goldenTab === tab;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        renderGoldenTabContent(tab);
      }
      tabs.forEach(b => b.addEventListener('click', () => activateTab(b.dataset.goldenTab)));

      view.querySelectorAll('[data-perk-go]').forEach(btn => {
        btn.addEventListener('click', () => {
          const go = btn.dataset.perkGo;
          if (go === 'quizzes' || go === 'cards') {
            activateTab(go);
            const panel = view.querySelector('#premiumPanel');
            if (panel) {
              panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
              panel.classList.add('is-pulsed');
              setTimeout(() => panel.classList.remove('is-pulsed'), 800);
            }
            return;
          }
          if (go === 'profile') {
            const tile = document.getElementById('tileEditProfile');
            if (tile) tile.click();
            else if (typeof window.__openProfileSheet === 'function') window.__openProfileSheet();
            return;
          }
          if (go === 'pdf' || go === 'tests') {
            const navLink = document.querySelector('.nav a[data-view="files"]');
            if (navLink) navLink.click();
            return;
          }
        });
      });

      const manage = view.querySelector('#premiumManageBtn');
      if (manage) manage.addEventListener('click', () => {
        const ok = confirm('Отключить Golden? Все функции станут недоступны.');
        if (ok) { window.doroPremium.deactivatePremium(); renderPremiumPage(); }
      });

      // Первый таб — Ошибки
      renderGoldenTabContent('quizzes');
      return;
    }

    // ---------- ВИТРИНА ДЛЯ БЕСПЛАТНЫХ ----------
    view.innerHTML = `
      <div class="golden-page golden-page--showcase">
        <div class="golden-hero">
          <span class="golden-wordmark golden-wordmark--big" aria-hidden="true">Golden</span>
          <h1 class="golden-title">Учись как в последний раз.<br>Отдыхай как в первый.</h1>
          <p class="golden-sub">doro держит ритм, пока ты держишь голову. Всё, что нужно для пар — в одном месте, без суеты и лишних вкладок.</p>
          <button type="button" class="golden-price" id="goldenPriceBtn" aria-label="Перейти к оформлению Golden">
            <span class="golden-price__num">${price}</span>
            <span class="golden-price__cur">₽ / месяц</span>
            <span class="golden-price__tag">дешевле кофе</span>
          </button>
        </div>

        <!-- ГЛАВНОЕ: PDF + ОФЛАЙН -->
        <div class="golden-main-benefit">
          <div class="golden-main-benefit__badge">Главное</div>
          <div class="golden-main-benefit__icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M12 18v-6"></path>
              <polyline points="9 15 12 18 15 15"></polyline>
            </svg>
          </div>
          <div class="golden-main-benefit__body">
            <h3 class="golden-main-benefit__title">Скачай тему — и читай без интернета</h3>
            <p class="golden-main-benefit__text">
              Одна кнопка — и тема превращается в аккуратный PDF. В метро,
              в поезде, в очереди — читаешь с телефона, ничего не грузится.
            </p>
            <div class="golden-main-benefit__points">
              <span class="golden-main-benefit__point">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Тема целиком — с таблицами и подсветкой
              </span>
              <span class="golden-main-benefit__point">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Файл остаётся навсегда
              </span>
              <span class="golden-main-benefit__point">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Отправь другу в мессенджер
              </span>
            </div>
          </div>
        </div>

        <!-- Остальные функции -->
        <ul class="golden-other-benefits">
          <li class="golden-other-benefit">
            <span class="golden-other-benefit__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"></path>
                <path d="M16.5 8.5l1.5-1.5"></path>
              </svg>
            </span>
            <span class="golden-other-benefit__body">
              <b>Сделай профиль своим</b>
              <span>Смайлик-аватарка, рамки, фоны, бейдж рядом с именем — и тебя запоминают.</span>
            </span>
          </li>
          <li class="golden-other-benefit">
            <span class="golden-other-benefit__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
              </svg>
            </span>
            <span class="golden-other-benefit__body">
              <b>Тесты без лимита</b>
              <span>На бесплатном — ${window.doroPremium.QUIZ_LIMIT_FREE} попыток. С Golden — сколько нужно.</span>
            </span>
          </li>
          <li class="golden-other-benefit">
            <span class="golden-other-benefit__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </span>
            <span class="golden-other-benefit__body">
              <b>Список ошибок</b>
              <span>Всё, где споткнулся — в одном месте, перед коллоквиумом.</span>
            </span>
          </li>
          <li class="golden-other-benefit">
            <span class="golden-other-benefit__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="16" height="12" rx="2"></rect>
                <path d="M22 8v8"></path>
                <line x1="6" y1="12" x2="14" y2="12"></line>
              </svg>
            </span>
            <span class="golden-other-benefit__body">
              <b>Карточки к коллоквиуму</b>
              <span>Вопрос → ответ. Листаешь в маршрутке — к паре помнишь.</span>
            </span>
          </li>
        </ul>

        <button type="button" class="golden-activate" id="premiumActivateBtn">
          Забрать Golden · ${price} ₽/мес
        </button>
        <p class="golden-fine">Отмена в один клик. Без автосписаний без предупреждения.</p>
      </div>
    `;

    const activateBtn = view.querySelector('#premiumActivateBtn');
    if (activateBtn) {
      activateBtn.id = 'premiumActivateBtn';
      activateBtn.addEventListener('click', () => {
        if (typeof window.__openPayModal === 'function') {
          window.__openPayModal();
        } else {
          alert('Окно оплаты не загрузилось. Обнови страницу.');
        }
      });
    }

    // Клик по цене → плавный скролл к кнопке + подсветка
    const priceBtn = view.querySelector('#goldenPriceBtn');
    if (priceBtn) {
      priceBtn.addEventListener('click', () => {
        if (typeof window.__openPayModal === 'function') {
          window.__openPayModal();
        }
      });
    }
  }
function pluralTopicsCount(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'тема';
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'темы';
  return 'тем';
}

function pluralErrors(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'ошибка';
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'ошибки';
  return 'ошибок';
}

function readQuizErrors() {
  try {
    const raw = JSON.parse(localStorage.getItem('doro.quizErrors') || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch (e) { return []; }
}
function saveQuizErrors(arr) {
  localStorage.setItem('doro.quizErrors', JSON.stringify(arr.slice(0, 200)));
}

// ============================================================
//  GOLDEN: История ошибок — современный дашборд
// ============================================================
let _goldenErrorsExpanded = false;
let _goldenErrorsFilter = { subject: 'all', sort: 'count' };

function goldenErrorsTab() {
  const panel = document.getElementById('premiumPanel');
  if (!panel) return;

  const errors = readQuizErrors();
  console.log('[goldenErrors] записей:', errors.length);

  // ---------- пусто ----------
  if (!errors.length) {
    panel.innerHTML = `
      <div class="gerr-empty">
        <div class="gerr-empty__icon" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
        <h2 class="gerr-empty__title">Пока чисто</h2>
        <p class="gerr-empty__text">
          Здесь появятся вопросы, в которых ты ошибался в тестах.
          Реши пару тестов — и увидишь, что стоит повторить.
        </p>
      </div>
    `;
    return;
  }

  // ---------- группируем по теме ----------
  const groups = new Map();
  errors.forEach((e, idx) => {
    const key = (e.subjectKey || 'unknown') + '::' + (e.topicNum || e.topicTitle || 'unknown');
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        subjectKey: e.subjectKey || 'unknown',
        subjectTitle: e.subjectTitle || e.subjectKey || 'Раздел',
        topicNum: e.topicNum || '',
        topicTitle: e.topicTitle || e.topicNum || 'Тема',
        items: [],
        lastAt: e.at || 0
      });
    }
    const g = groups.get(key);
    g.items.push({ ...e, _idx: idx });
    if ((e.at || 0) > g.lastAt) g.lastAt = e.at || 0;
  });

  let topics = [...groups.values()];

  if (_goldenErrorsFilter.subject !== 'all') {
    topics = topics.filter(t => t.subjectKey === _goldenErrorsFilter.subject);
  }
  if (_goldenErrorsFilter.sort === 'count') {
    topics.sort((a, b) => b.items.length - a.items.length);
  } else {
    topics.sort((a, b) => b.lastAt - a.lastAt);
  }

  // ---------- сводка ----------
  const totalErrors = errors.length;
  const totalTopics = groups.size;

  const bySubject = new Map();
  groups.forEach(g => {
    if (!bySubject.has(g.subjectKey)) {
      bySubject.set(g.subjectKey, { title: g.subjectTitle, count: 0 });
    }
    bySubject.get(g.subjectKey).count += g.items.length;
  });
  const subjectSummary = [...bySubject.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4);

  const subjectList = [...bySubject.entries()].map(([k, v]) => [k, v.title]);

  const renderTopicCard = (t) => {
    const count = t.items.length;
    const firstQ = t.items[0]?.question || '';
    const newestAt = t.lastAt
      ? new Date(t.lastAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
      : '';
    return `
      <button type="button" class="gerr-card" data-topic-key="${escapeHtml(t.key)}">
        <div class="gerr-card__top">
          <span class="gerr-card__subject">${escapeHtml(t.subjectTitle)}</span>
          <span class="gerr-card__count">${count}</span>
        </div>
        <div class="gerr-card__title">
          ${t.topicNum ? `<span class="gerr-card__num">Тема ${escapeHtml(t.topicNum)}</span>` : ''}
          <span class="gerr-card__name">${escapeHtml(t.topicTitle)}</span>
        </div>
        ${firstQ ? `<div class="gerr-card__preview">${escapeHtmlKeepSupSub(firstQ)}</div>` : ''}
        <div class="gerr-card__foot">
          <span class="gerr-card__plural">${pluralErrors(count)}</span>
          ${newestAt ? `<span class="gerr-card__date">${newestAt}</span>` : ''}
          <span class="gerr-card__arrow" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </span>
        </div>
      </button>
    `;
  };

  panel.innerHTML = `
    <div class="gerr-head">
      <div class="gerr-head__num-block">
        <span class="gerr-head__num">${totalErrors}</span>
        <span class="gerr-head__label">
          ${pluralErrors(totalErrors)} · ${totalTopics} ${pluralTopicsCount(totalTopics)}
        </span>
      </div>
      <div class="gerr-head__subjects">
        ${subjectSummary.map(([k, s]) => `
          <button type="button" class="gerr-head__subj" data-filter-subject="${escapeHtml(k)}" title="${escapeHtml(s.title)}">
            <b>${s.count}</b>
            <span>${escapeHtml(s.title)}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="gerr-controls">
      <div class="gerr-filters">
        <button type="button" class="gerr-chip ${_goldenErrorsFilter.subject === 'all' ? 'is-active' : ''}" data-filter-subject="all">Все</button>
        ${subjectList.map(([k, title]) => `
          <button type="button" class="gerr-chip ${_goldenErrorsFilter.subject === k ? 'is-active' : ''}" data-filter-subject="${escapeHtml(k)}">${escapeHtml(title)}</button>
        `).join('')}
      </div>
      <div class="gerr-sort">
        <button type="button" class="gerr-sort__btn ${_goldenErrorsFilter.sort === 'count' ? 'is-active' : ''}" data-sort="count" title="По количеству">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
        </button>
        <button type="button" class="gerr-sort__btn ${_goldenErrorsFilter.sort === 'recent' ? 'is-active' : ''}" data-sort="recent" title="По дате">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 14"></polyline></svg>
        </button>
      </div>
    </div>

    <div class="gerr-grid">
      ${topics.length
        ? topics.map(renderTopicCard).join('')
        : `<div class="gerr-grid__empty">В этом разделе пока нет ошибок.</div>`}
    </div>

    <div class="gerr-actions">
      <button type="button" class="golden-btn golden-btn--ghost" id="goldenErrorsClearAll">Очистить историю</button>
    </div>

    </div><!-- /.gerr-grid -->
  `;

  // Удаляем старую модалку от прошлого рендера
  document.querySelectorAll('body > .gerr-modal').forEach(m => m.remove());

  // Создаём модалку прямо в body (вне .view и .golden-panel — нет transform-предков)
  const modalEl = document.createElement('div');
  modalEl.className = 'gerr-modal';
  modalEl.id = 'gerrModal';
  modalEl.setAttribute('aria-hidden', 'true');
  modalEl.innerHTML = `
    <div class="gerr-modal__backdrop" data-close-modal></div>
    <div class="gerr-modal__box" role="dialog" aria-modal="true">
      <div class="gerr-modal__head">
        <div class="gerr-modal__head-text">
          <span class="gerr-modal__subject" id="gerrModalSubject"></span>
          <h3 class="gerr-modal__title" id="gerrModalTitle"></h3>
        </div>
        <button type="button" class="gerr-modal__close" data-close-modal aria-label="Закрыть">×</button>
      </div>
      <div class="gerr-modal__body" id="gerrModalBody"></div>
      <div class="gerr-modal__foot">
        <button type="button" class="gerr-modal__open-topic" id="gerrModalOpenTopic">Перейти в тему →</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalEl);

  // ---------- фильтры/сортировка ----------
  panel.querySelectorAll('[data-filter-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      _goldenErrorsFilter.subject = btn.dataset.filterSubject || 'all';
      goldenErrorsTab();
    });
  });
  panel.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      _goldenErrorsFilter.sort = btn.dataset.sort || 'count';
      goldenErrorsTab();
    });
  });

  // ---------- открытие модалки темы ----------
  const modal = modalEl;
  const modalBody = modalEl.querySelector('#gerrModalBody');
  const modalSubject = modalEl.querySelector('#gerrModalSubject');
  const modalTitle = modalEl.querySelector('#gerrModalTitle');
  const modalOpenTopic = modalEl.querySelector('#gerrModalOpenTopic');

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gerr-modal-open');
  }
  function openModalFor(topicKey) {
    const t = groups.get(topicKey);
    if (!t) return;

    modalSubject.textContent = t.subjectTitle;
    modalTitle.innerHTML = (t.topicNum ? `Тема ${escapeHtml(t.topicNum)} · ` : '') + escapeHtml(t.topicTitle);

    modalBody.innerHTML = t.items.map(it => `
      <div class="gerr-item">
        <div class="gerr-item__q">${escapeHtmlKeepSupSub(it.question || '')}</div>
        <div class="gerr-item__a gerr-item__a--ok">
          <span class="gerr-item__a-label">Верно</span>
          <span class="gerr-item__a-text">${escapeHtmlKeepSupSub(it.correct || '')}</span>
        </div>
        ${it.chosen ? `
          <div class="gerr-item__a gerr-item__a--bad">
            <span class="gerr-item__a-label">Ты</span>
            <span class="gerr-item__a-text">${escapeHtmlKeepSupSub(it.chosen)}</span>
          </div>` : ''}
        <button type="button" class="gerr-item__remove" data-remove-idx="${it._idx}">Выучил(а)</button>
      </div>
    `).join('');

    modalOpenTopic.onclick = () => {
      closeModal();
      _openTopicFromGolden(t.subjectKey, t.topicNum, t.topicTitle);
    };

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gerr-modal-open');
  }

  modal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    if (!document.body.contains(modal)) document.removeEventListener('keydown', esc);
  });

  panel.querySelectorAll('.gerr-card').forEach(card => {
    card.addEventListener('click', () => openModalFor(card.dataset.topicKey));
  });

  // ---------- «Выучил(а)» ----------
  modalBody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-idx]');
    if (!btn) return;
    const idx = Number(btn.dataset.removeIdx);
    const all = readQuizErrors();
    all.splice(idx, 1);
    saveQuizErrors(all);
    goldenErrorsTab();
  });

  // ---------- очистить ----------
  const clearBtn = panel.querySelector('#goldenErrorsClearAll');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (!confirm('Очистить всю историю ошибок? Это необратимо.')) return;
    saveQuizErrors([]);
    goldenErrorsTab();
  });
}

function _openTopicFromGolden(subjectKey, topicNum, topicTitle) {
  if (!subjectKey || !window.subjects?.[subjectKey]) return;

  let num = topicNum;
  if (!num && topicTitle) {
    const t = (window.subjects[subjectKey].topics || []).find(
      x => (x.title || '').trim() === (topicTitle || '').trim()
    );
    if (t) num = t.num;
  }

  const navLink = document.querySelector('.nav a[data-view="files"]');
  if (navLink) navLink.click();
  setTimeout(() => openTopic(subjectKey, num || null), 60);
}
// ============================================================
//  GOLDEN: Карточки для коллоквиума (листалка)
// ============================================================
const GOLDEN_CARDS_KEY = 'doro.goldenCards.v2';
let _goldenCardsFilter = 'all';

const GOLDEN_CARD_SETS = [
  {
    id: 'microbio_11',
    title: 'Микробиология — тема 11',
    subtitle: 'Иммунобиологические препараты',
    subjectKey: 'microbio',
    topicNum: '11',
    topicTitle: 'Иммунобиологические препараты',
    cards: [
      {
        q: 'Что такое иммунобиологические препараты (ИБП)?',
        plan: [
          'Определение',
          'Что входит в состав',
          'Вспомогательные вещества',
          'Раздел иммунологии, который их изучает'
        ],
        answer: [
          'ИБП — препараты, действующие на иммунную систему, через иммунную систему или механизм действия которых основан на иммунологических принципах.',
          'Действующее начало: антигены, антитела, микробные клетки и их дериваты, иммуноцитокины, иммунокомпетентные клетки.',
          'В составе также стабилизаторы, адъюванты, консерванты.',
          'Раздел иммунологии, который их изучает — иммунобиотехнология.'
        ]
      },
      {
        q: 'Какие 5 групп ИБП выделяют по классификации А.А. Воробьёва?',
        plan: [
          '1-я группа — из микробов и их продуктов',
          '2-я группа — на основе антител',
          '3-я группа — иммуномодуляторы',
          '4-я группа — адаптогены',
          '5-я группа — диагностические препараты'
        ],
        answer: [
          'ИБП из живых/убитых микробов или их продуктов: вакцины, анатоксины, бактериофаги, пробиотики.',
          'На основе специфических антител: иммуноглобулины, иммунные сыворотки, иммунотоксины, абзимы.',
          'Иммуномодуляторы: экзогенные (адъюванты, гормоны) и эндогенные (интерлейкины, интерфероны, пептиды тимуса).',
          'Адаптогены: растительные (женьшень, элеутерококк), животные, БАДы.',
          'Диагностические препараты и системы.'
        ]
      },
      {
        q: 'Что такое диагностические сыворотки и какие они бывают?',
        plan: [
          'Определение',
          'Назначение',
          'Разновидности',
          'Как получают (в т.ч. монорецепторные)'
        ],
        answer: [
          'Диагностические сыворотки — иммунные сыворотки со специфическими антителами.',
          'Назначение: идентификация микроорганизмов, их антигенов и продуктов метаболизма, а также определение антител в крови больного.',
          'Виды: агглютинирующие (РА), преципитирующие (РП), флюоресцирующие (РИФ), гемолитические (РСК), монорецепторные, комплексные (поливалентные).',
          'Получают гипериммунизацией животных; монорецепторные — адсорбцией по методу Кастелляни.'
        ]
      },
      {
        q: 'Что такое диагностикумы и аллергены?',
        plan: [
          'Диагностикумы — определение',
          'Виды диагностикумов',
          'Аллергены — определение',
          'Примеры аллергенов',
          'Применение'
        ],
        answer: [
          'Диагностикумы — взвеси убитых микробных клеток или их антигенов для обнаружения антител в сыворотке больного.',
          'Виды: корпускулярные (РА), эритроцитарные (РНГА), антигенные (РСК, РП).',
          'Аллергены — препараты из микробов или их продуктов, вызывающие местную аллергическую реакцию (ГЗТ) у сенсибилизированного человека.',
          'Примеры: туберкулин, тулярин, бруцеллин, антраксин.',
          'Применение: кожные пробы (Манту с 2ТЕ PPD-L, Бюрне при бруцеллёзе).'
        ]
      },
      {
        q: 'Как используются бактериофаги в диагностике и лечении?',
        plan: [
          'Что такое бактериофаги',
          'Как получают',
          'Фагодиагностика',
          'Фаготипирование',
          'Фагопрофилактика и фаголечение'
        ],
        answer: [
          'Бактериофаги — вирусы бактерий, специфически проникающие в бактерии и вызывающие их лизис.',
          'Получают культивированием поражённых фагом бактерий на питательных средах, выделяют фильтрат, лиофильно высушивают.',
          'Фагодиагностика — индикация и идентификация микроорганизмов.',
          'Фаготипирование — внутривидовая идентификация, эпидемиологическое маркирование, поиск источника инфекции.',
          'Фагопрофилактика и фаголечение — предупреждение и лечение инфекций препаратами фагов.'
        ]
      },
      {
        q: 'Чем отличаются иммунопрофилактика и иммунотерапия?',
        plan: [
          'Иммунопрофилактика — определение',
          'Иммунотерапия — определение',
          'Когда применяют',
          'Серотерапия',
          'Серопрофилактика'
        ],
        answer: [
          'Иммунопрофилактика — предупреждение инфекционных и неинфекционных болезней путём создания активного или пассивного иммунитета.',
          'Иммунотерапия — лечение уже развившейся болезни, в основе которой нарушение функции иммунной системы.',
          'Применяют, когда нужно: сформировать специфический иммунитет, подавить активность звеньев иммунной системы, нормализовать её работу.',
          'Серотерапия — лечение иммунными сыворотками/иммуноглобулинами (пассивный иммунитет).',
          'Серопрофилактика — предупреждение болезней сыворотками у контактных лиц.'
        ]
      },
      {
        q: 'Что такое вакцины и как они классифицируются?',
        plan: [
          'Определение',
          'Действующее начало',
          'Классификация по Воробьёву',
          'Живые вакцины',
          'Неживые вакцины'
        ],
        answer: [
          'Вакцины — ИБП, действующим началом которых является специфический антиген, для активной специфической профилактики (иногда лечения).',
          'Действующее начало: живые ослабленные микробы, инактивированные клетки/вирионы, субклеточные антигенные комплексы, анатоксины, синтетические антигены.',
          'Классификация: живые, неживые, молекулярные, комбинированные.',
          'Живые: аттенуированные, дивергентные, рекомбинантные (векторные).',
          'Неживые: корпускулярные, субклеточные.'
        ]
      },
      {
        q: 'Как получают и чем характеризуются живые вакцины?',
        plan: [
          'Аттенуация',
          'Дивергентные вакцины',
          'Векторные вакцины',
          'Характеристика иммунитета',
          'Примеры'
        ],
        answer: [
          'Аттенуация — ослабление микробов химическими/физическими факторами или длительными пассажами через невосприимчивых животных.',
          'Дивергентные — непатогенные микробы с общими протективными антигенами (осповакцина, БЦЖ).',
          'Векторные — непатогенные рекомбинантные штаммы с генами протективных антигенов патогенов.',
          'Иммунитет напряжённый, длительный, близкий к постинфекционному.',
          'Примеры: оральная полиомиелитная, корь, паротит, краснуха, БЦЖ, чума EV, туляремия, сибирская язва СТИ, жёлтая лихорадка 17D.'
        ]
      },
      {
        q: 'Как получают убитые вакцины и какие у них особенности?',
        plan: [
          'Выращивание патогенов',
          'Методы инактивации',
          'Субклеточные вакцины',
          'Особенности иммунитета',
          'Примеры'
        ],
        answer: [
          'Патогены выращивают на питательных средах.',
          'Инактивация химическим (формальдегид, спирт, фенол) или физическим (температура, УФ, ионизирующая радиация) методом.',
          'Субклеточные — выделение антигенных комплексов (гликопротеинов, ЛПС, белков) с помощью ТХУ, фенола, ферментов, ультрацентрифугирования, хроматографии.',
          'Иммунитет менее напряжённый, чем у живых, требует нескольких инъекций и ревакцинаций.',
          'Примеры: коклюшная (в АКДС), брюшнотифозная, сыпнотифозная, гриппозная, гепатит А, герпетическая, клещевого энцефалита, бешенства.'
        ]
      },
      {
        q: 'Чем отличаются гомологичные и гетерологичные сыворотки?',
        plan: [
          'Гомологичные — от кого получают',
          'Гетерологичные — от кого получают',
          'Как получают',
          'Характеристика иммунитета',
          'Применение'
        ],
        answer: [
          'Гомологичные сыворотки получают от человека (переболевшие, доноры, плацентарная кровь) — они нечужеродные.',
          'Гетерологичные — от животных (лошади, ослы, кролики), содержат чужеродные белки.',
          'Получение: гипериммунизация специфическим антигеном, кровопускание в период максимального антителообразования, выделение иммунной сыворотки.',
          'Иммунитет пассивный: наступает через несколько часов, сохраняется 2–3 недели (гетерологичные) или 4–5 недель (гомологичные).',
          'Применение: токсинемические инфекции (дифтерия, столбняк, ботулизм, газовая гангрена), корь, краснуха, чума, сибирская язва.'
        ]
      },
      {
        q: 'Какие побочные действия бывают у вакцин и сывороток и как их предупредить?',
        plan: [
          'Местные реакции',
          'Общие реакции',
          'Осложнения',
          'Анафилактический шок и его предупреждение',
          'Сывороточная болезнь и её предупреждение',
          'Общие противопоказания'
        ],
        answer: [
          'Местные реакции: гиперемия, отёк, болезненность.',
          'Общие: повышение температуры, недомогание, головная боль.',
          'Осложнения: неврологические (энцефалопатия, энцефалит при АКДС), аллергические (анафилактический шок, сывороточная болезнь), аутоиммунные, иммунодефицитные.',
          'Анафилактический шок — через минуты после введения; предупреждение: аллергическая проба, введение по Безредке.',
          'Сывороточная болезнь — через 8–10 дней; предупреждение: гомологичные сыворотки, очистка от балластных белков, метод Безредки.',
          'Общие противопоказания: острые заболевания, аллергии, болезни ЦНС, хронические болезни печени/почек, тяжёлые ССВ, иммунодефициты, злокачественные новообразования.'
        ]
      }
    ]
  }
];

// ---------- Пользовательские карточки ----------
function readGoldenCards() {
  try {
    const raw = JSON.parse(localStorage.getItem(GOLDEN_CARDS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch (e) { return []; }
}
function saveGoldenCards(arr) {
  localStorage.setItem(GOLDEN_CARDS_KEY, JSON.stringify(arr));
}

function getAllGoldenCards() {
  const sets = GOLDEN_CARD_SETS.map(set => ({
    ...set,
    isSet: true,
    cards: set.cards.map((c, i) => ({
      id: `${set.id}__${i}`,
      ...c,
      subjectKey: set.subjectKey,
      topicNum: set.topicNum,
      topicTitle: set.topicTitle,
      setId: set.id
    }))
  }));

  const userCards = readGoldenCards().map(c => ({ ...c, isSet: false }));
  const userGroup = userCards.length
    ? [{
        id: 'user',
        title: 'Мои карточки',
        subtitle: 'Создано вручную',
        isSet: false,
        cards: userCards
      }]
    : [];

  return [...sets, ...userGroup];
}

function _subjectTitleOf(key) {
  return (window.subjects && window.subjects[key]?.title) || key || 'Без раздела';
}

// ---------- Листалка ----------
let _goldenCardStack = [];
let _goldenCardIndex = 0;
let _goldenCardFlipped = false;
let _goldenCardsKnown = new Set();

function pluralCards(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'карточка';
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'карточки';
  return 'карточек';
}

function goldenCardsTab() {
  const panel = document.getElementById('premiumPanel');
  if (!panel) return;

  const sets = getAllGoldenCards();
  const totalCards = sets.reduce((s, set) => s + set.cards.length, 0);

  if (_goldenCardsFilter !== 'all' && !sets.find(s => s.id === _goldenCardsFilter)) {
    _goldenCardsFilter = 'all';
  }

  const visibleSets = _goldenCardsFilter === 'all'
    ? sets
    : sets.filter(s => s.id === _goldenCardsFilter);

  const deck = visibleSets.flatMap(s => s.cards);

  panel.innerHTML = `
    <div class="golden-stats-head">
      <h2 class="golden-panel__title">Карточки</h2>
      <div class="golden-stats-summary">
        <span><b>${totalCards}</b> ${pluralCards(totalCards)}</span>
        ${_goldenCardsKnown.size ? `<span class="golden-stats-summary__sep">·</span><span><b>${_goldenCardsKnown.size}</b> знаю</span>` : ''}
      </div>
    </div>

    <p class="golden-cards__hint">
      Вопрос и план ответа на лицевой стороне. Расскажи по плану — потом переверни и сверься.
      Листай стрелками или свайпом.
    </p>

    <div class="golden-stats-controls">
      <div class="golden-stats-filters">
        <button type="button" class="golden-filter-chip ${_goldenCardsFilter === 'all' ? 'is-active' : ''}" data-card-set="all">
          Все наборы
        </button>
        ${sets.map(set => `
          <button type="button" class="golden-filter-chip ${_goldenCardsFilter === set.id ? 'is-active' : ''}" data-card-set="${escapeHtml(set.id)}">
            ${escapeHtml(set.title)}
          </button>
        `).join('')}
      </div>
    </div>

    ${deck.length
      ? `<div class="flash-deck" id="flashDeck"></div>`
      : `<p class="golden-panel__empty">Пока нет карточек.</p>`
    }
  `;

  panel.querySelectorAll('[data-card-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      _goldenCardsFilter = btn.dataset.cardSet || 'all';
      _goldenCardStack = [];
      _goldenCardIndex = 0;
      _goldenCardFlipped = false;
      goldenCardsTab();
    });
  });

  if (!deck.length) return;

  _goldenCardStack = deck;
  if (_goldenCardIndex >= deck.length) _goldenCardIndex = 0;
  _goldenCardFlipped = false;

  const deckEl = panel.querySelector('#flashDeck');
  renderFlashDeck(deckEl);
}

function renderFlashDeck(deckEl) {
  if (!deckEl) return;
  const deck = _goldenCardStack;
  const total = deck.length;
  const idx = _goldenCardIndex;
  const card = deck[idx];
  if (!card) return;

  const isKnown = _goldenCardsKnown.has(card.id);

  const planHtml = Array.isArray(card.plan) && card.plan.length
    ? `<div class="flash-card__plan">
         <div class="flash-card__label">План ответа</div>
         <ol class="flash-card__plan-list">
           ${card.plan.map(p => `<li>${escapeHtmlKeepSupSub(p)}</li>`).join('')}
         </ol>
       </div>`
    : '';

  deckEl.innerHTML = `
    <div class="flash-deck__head">
      <span class="flash-deck__set">${escapeHtml(_subjectTitleOf(card.subjectKey))}${card.topicNum ? ' · Тема ' + escapeHtml(card.topicNum) : ''}</span>
      <span class="flash-deck__counter"><b>${idx + 1}</b> / ${total}</span>
    </div>

    <div class="flash-deck__stage">
      <button type="button" class="flash-deck__nav flash-deck__nav--prev" id="flashPrev" ${idx === 0 ? 'disabled' : ''} aria-label="Предыдущая">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>

      <div class="flash-card ${_goldenCardFlipped ? 'is-flipped' : ''}" id="flashCard" tabindex="0" role="button" aria-label="Перевернуть карточку">
        <div class="flash-card__inner">
          <div class="flash-card__face flash-card__face--front">
            <div class="flash-card__badge">Вопрос</div>
            <div class="flash-card__q">${escapeHtmlKeepSupSub(card.q || '')}</div>
            ${planHtml}
            <div class="flash-card__hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Расскажи по плану, потом переверни
            </div>
          </div>

          <div class="flash-card__face flash-card__face--back">
            <div class="flash-card__badge">Ответ</div>
            <div class="flash-card__answer">
              <div class="flash-card__label">Ответ по плану</div>
              ${Array.isArray(card.answer)
                ? `<ol class="flash-card__answer-list">
                     ${card.answer.map((a, i) => `
                       <li>
                         <span class="flash-card__answer-num">${i + 1}</span>
                         <span class="flash-card__answer-text">${escapeHtmlKeepSupSub(a)}</span>
                       </li>
                     `).join('')}
                   </ol>`
                : `<p>${escapeHtmlKeepSupSub(card.answer || '')}</p>`
              }
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="flash-deck__nav flash-deck__nav--next" id="flashNext" ${idx === total - 1 ? 'disabled' : ''} aria-label="Следующая">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>

    <div class="flash-deck__actions">
      <button type="button" class="flash-deck__known ${isKnown ? 'is-active' : ''}" id="flashKnow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ${isKnown ? 'Знаю' : 'Отметить «знаю»'}
      </button>
      <button type="button" class="flash-deck__flip" id="flashFlip">Перевернуть</button>
    </div>

    <div class="flash-deck__progress">
      <span style="width:${((idx + 1) / total) * 100}%"></span>
    </div>
  `;

  const flashCard = deckEl.querySelector('#flashCard');

  function flip() {
    _goldenCardFlipped = !_goldenCardFlipped;
    flashCard.classList.toggle('is-flipped', _goldenCardFlipped);
  }

  flashCard.addEventListener('click', flip);
  flashCard.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
  });

  deckEl.querySelector('#flashFlip').addEventListener('click', flip);

  deckEl.querySelector('#flashKnow').addEventListener('click', () => {
    const id = card.id;
    if (_goldenCardsKnown.has(id)) _goldenCardsKnown.delete(id);
    else _goldenCardsKnown.add(id);
    renderFlashDeck(deckEl);
  });

  deckEl.querySelector('#flashPrev').addEventListener('click', goPrev);
  deckEl.querySelector('#flashNext').addEventListener('click', goNext);

  function goPrev() {
    if (_goldenCardIndex === 0) return;
    _goldenCardIndex--;
    _goldenCardFlipped = false;
    renderFlashDeck(deckEl);
  }
  function goNext() {
    if (_goldenCardIndex >= _goldenCardStack.length - 1) return;
    _goldenCardIndex++;
    _goldenCardFlipped = false;
    renderFlashDeck(deckEl);
  }

  let sx = 0, sy = 0, tracking = false;
  flashCard.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sx = t.clientX; sy = t.clientY; tracking = true;
  }, { passive: true });
  flashCard.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext(); else goPrev();
    }
  }, { passive: true });
}

  // Диспетчер вкладок Golden: вызывает нужную функцию рендера
  function renderGoldenTabContent(tab) {
    if (tab === 'quizzes') {
      goldenErrorsTab();
    } else if (tab === 'cards') {
      goldenCardsTab();
    }
  }
  window.renderGoldenTabContent = renderGoldenTabContent;

  function showView(name) {
    Object.values(views).forEach(v => { if (v) v.classList.remove('is-active'); });
    const v = views[name];
    if (!v) return;
    void v.offsetWidth;
    v.classList.add('is-active');

    // При уходе с Главной — сбрасываем просмотр чужой группы
    if (name !== 'home' && getViewAsGroup()) {
      setViewAsGroup(null);
      updateViewAsBanner();
    }

    // Профиль: сброс и перезапуск анимации при каждом входе
    if (name === 'profile') {
      v.classList.remove('is-reanimating');
      void v.offsetWidth;
      v.classList.add('is-reanimating');
    }

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
      if (name === 'premium') renderPremiumPage();
      rendered[name] = true;
    } else if (name === 'premium') {
      // Премиум перерисовываем всегда — состояние могло измениться
      renderPremiumPage();
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
    const groupLabel = (function () {
      try {
        const u = JSON.parse(localStorage.getItem('doro.user') || 'null');
        return u && u.group ? u.group : '';
      } catch (e) { return ''; }
    })();
    if (!lectures.length) {
      lectureInfo.innerHTML = '<div class="pop-lecture__empty">Ближайших лекций нет' + (groupLabel ? ' для группы ' + escapeHtml(groupLabel) : '') + '</div>';
      return;
    }
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

    // Гистология: в конце списка — кнопка «1 курс · 2 семестр», размером с две темы
    if (currentSubjectKey === 'histology') {
      const split = document.createElement('button');
      split.type = 'button';
      split.className = 'reader-topics__semester-split';
      split.textContent = '1 курс';
      split.title = 'Темы 1 курса, 2 семестр';
      split.addEventListener('click', (e) => {
        e.preventDefault();
        // пока ничего не делает
      });
      readerTopicsList.appendChild(split);
    }
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
    let _tocDebounce = null;
    const mo = new MutationObserver(() => {
      tocBuiltForArticle = null;
      if (readerSettings && readerSettings.classList.contains('open')) {
        clearTimeout(_tocDebounce);
        _tocDebounce = setTimeout(() => buildToc(), 150);
      }
    });
    mo.observe(readerArticle, { childList: true, subtree: true });
  }

  function stopPolling() { pollActive = false; if (pollTimeoutHandle) { clearTimeout(pollTimeoutHandle); pollTimeoutHandle = null; } }
  function randomId() { return 'doro_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  async function deleteBin(binId) {
    if (!binId) return;
    try { await fetch(`${JSONBIN_URL}/${binId}`, { method: 'DELETE', headers: { 'X-Master-Key': JSONBIN_KEY } }); } catch (e) { /* ignore */ }
  }


  const syncInfoModal = $('syncInfoModal');
  const syncInfoCancel = $('syncInfoCancel');
  const syncInfoContinue = $('syncInfoContinue');
  const LAST_SYNC_KEY = 'doro.lastSync';
  function todayIso() { return new Date().toISOString().slice(0, 10); }


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
if (tabConfig.includes('preparations')) {
  result.preparations = topic.pdf ? (Array.isArray(topic.pdf) ? topic.pdf : [topic.pdf]) : [];
  result.tasksPdf = topic.tasksPdf ? (Array.isArray(topic.tasksPdf) ? topic.tasksPdf : [topic.tasksPdf]) : [];
}
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
  // НЕ снимаем .is-loaded — иначе контент будет «пропадать» при переключении
  contentEl.classList.toggle('reader-tab-tests', tab === 'tests');
if (tab === 'preparations') {
  contentEl.innerHTML = renderPreparations(sections.preparations || [], sections.tasksPdf || []);
} else if (tab === 'questions') {
    const raw = sections.questions || '';
    if (raw.trim()) {
      renderHtmlInChunks(contentEl, renderTopicContent(raw), {
        onDone: () => {
          contentEl.classList.add('is-loaded');
          document.dispatchEvent(new CustomEvent('doro:topic-rendered'));
        }
      });
    } else {
      contentEl.innerHTML = '<p class="reader__empty">В этой теме нет вопросов</p>';
    }
  } else if (tab === 'problems') {
    const raw = sections.problems || '';
    if (raw.trim()) {
      renderHtmlInChunks(contentEl, renderTopicContent(raw), {
        onDone: () => {
          contentEl.classList.add('is-loaded');
          document.dispatchEvent(new CustomEvent('doro:topic-rendered'));
        }
      });
    } else {
      contentEl.innerHTML = '<p class="reader__empty">В этой теме нет задач</p>';
    }
  } else if (tab === 'tests') {
    const testsRaw = sections.tests || '';
    if (parseTestsToQuestions(testsRaw).length) {
      renderPhysioSolveMode(testsRaw, contentEl);
    } else {
      contentEl.innerHTML = '<p class="reader__empty">В этой теме нет тестов</p>';
    }
  }
    else {
      const rawSection = sections[tab] || '<p class="reader__empty">Раздел пуст</p>';
      renderHtmlInChunks(contentEl, renderTopicContent(rawSection), {
        onDone: () => {
          contentEl.classList.add('is-loaded');
          document.dispatchEvent(new CustomEvent('doro:topic-rendered'));
        }
      });
    }

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

    tocBuiltForArticle = null;
    if (readerSettings && readerSettings.classList.contains('open')) buildToc();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function isReaderOpen() { const vf = $('view-files'); return vf ? vf.classList.contains('reader-open') : false; }
function renderPreparations(preparations, tasks) {
  const prepList = Array.isArray(preparations) ? preparations : (preparations ? [preparations] : []);
  const taskList = Array.isArray(tasks)        ? tasks        : (tasks        ? [tasks]        : []);

  function renderOne(f) {
    const name = f.split('/').pop();
    const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(f);
    const isPdf   = /\.pdf$/i.test(f);
    if (isImage) return `<figure class="reader__prep-figure"><img src="${escapeHtml(f)}" alt="${escapeHtml(name)}" loading="lazy"><figcaption>${escapeHtml(name)}</figcaption></figure>`;
    if (isPdf)   return `<button type="button" class="reader__prep-item" data-pdf="${escapeHtml(f)}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span>${escapeHtml(name)}</span></button>`;
    return `<a class="reader__prep-item" href="${escapeHtml(f)}" target="_blank" rel="noopener"><span>${escapeHtml(name)}</span></a>`;
  }

  let html = '<div class="reader__prep-list">';

  if (taskList.length) {
    html += `<div class="reader__prep-group">
      <p class="reader__prep-hint">Дополнительные файлы</p>
      ${taskList.map(renderOne).join('')}
    </div>`;
  }

  if (prepList.length) {
    html += `<div class="reader__prep-group">
      <p class="reader__prep-hint">Препараты к теме</p>
      ${prepList.map(renderOne).join('')}
    </div>`;
  }

  if (!taskList.length && !prepList.length) {
    html += '<p class="reader__empty">К этой теме ничего не прикреплено.</p>';
  }

  html += '</div>';
  return html;
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



  // ---------- НАВЕРХ ----------
  const islandProgressUp = $('islandProgressUp');
  if (islandProgressUp) islandProgressUp.addEventListener('click', (e) => { e.stopPropagation(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  // ============================================================
  //  ОНБОРДИНГ НОВОГО ПОЛЬЗОВАТЕЛЯ
  // ============================================================
  const ONBOARD_DONE_KEY = 'doro.onboarded.v4'; // v4 заставит всех пройти регистрацию заново

    (function initOnboard() {
    const onboard       = $('onboard');
    const nameInp       = $('onboardName');
    const nextBtn       = $('onboardNext');
    const nextBtn2      = $('onboardNext2');
    const finishBtn     = $('onboardFinish');
    const stepLabel     = $('onboardStep');
    const avatarLetter  = $('onboardAvatarLetter');
    const avatarEl      = $('onboardAvatar');
    const lettersInp    = $('onboardGroupLetters');
    const yearSel       = $('onboardGroupYear');
    const numSel        = $('onboardGroupNum');
    const chipsWrap     = $('onboardStatusChips');
    const colorsWrap    = $('onboardColors');
    const panels        = Array.from(document.querySelectorAll('.onboard__step-panel'));

    if (!onboard) return;

    let draft = { name: '', group: '', status: USER_STATUSES[0], color: '#3b82f6' };

    // Предзаполнение из уже сохранённого профиля (если онбординг проходят повторно)
    if (user) {
      if (user.name && nameInp) { nameInp.value = user.name; draft.name = user.name; if (nextBtn) nextBtn.disabled = false; }
      const parts = parseGroup(user.group || '');
      if (lettersInp) lettersInp.value = parts.letters || '';
      if (yearSel && parts.year) yearSel.value = parts.year;
      if (numSel && parts.num) numSel.value = parts.num;
      if (user.color) draft.color = user.color;
      if (user.status) draft.status = user.status;
    }


    if (chipsWrap) {
      chipsWrap.innerHTML = '';
      USER_STATUSES.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'onboard__chip' + (i === 0 ? ' is-selected' : '');
        b.dataset.value = s;
        b.textContent = s;
        b.addEventListener('click', () => {
          draft.status = s;
          chipsWrap.querySelectorAll('.onboard__chip').forEach(c => c.classList.toggle('is-selected', c === b));
        });
        chipsWrap.appendChild(b);
      });
    }

    const COLORS = ['#3b82f6','#16a34a','#ea580c','#9333ea','#0891b2','#e11d48','#ca8a04','#475569'];
    if (colorsWrap) {
      colorsWrap.innerHTML = '';
      COLORS.forEach((c, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'onboard__color' + (i === 0 ? ' is-selected' : '');
        b.dataset.color = c;
        b.style.background = `linear-gradient(135deg, ${c}, color-mix(in srgb, ${c} 60%, #fff))`;
        b.addEventListener('click', () => {
          draft.color = c;
          colorsWrap.querySelectorAll('.onboard__color').forEach(x => x.classList.toggle('is-selected', x.dataset.color === c));
          paintOnboardAvatar();
        });
        colorsWrap.appendChild(b);
      });
    }

    paintOnboardAvatar(); // сразу отрисовать аватар с предзаполненными данными

    function paintOnboardAvatar() {
      const name = draft.name.trim();
      if (avatarLetter) avatarLetter.textContent = name ? name[0].toUpperCase() : '?';
      if (avatarEl) {
        avatarEl.style.background = `linear-gradient(135deg, ${draft.color}, color-mix(in srgb, ${draft.color} 60%, #fff))`;
        avatarEl.classList.remove('is-popping');
        void avatarEl.offsetWidth;
        avatarEl.classList.add('is-popping');
      }
    }
    paintOnboardAvatar();

    function goTo(n) {
      panels.forEach(p => p.classList.toggle('is-active', Number(p.dataset.step) === n));
      if (stepLabel) stepLabel.textContent = `Шаг ${n} из 3`;
      if (n === 1 && nameInp) setTimeout(() => nameInp.focus(), 200);
    }

    if (nameInp) {
      nameInp.addEventListener('input', () => {
        draft.name = nameInp.value;
        if (nextBtn) nextBtn.disabled = !nameInp.value.trim();
        paintOnboardAvatar();
      });
      nameInp.addEventListener('keydown', e => { if (e.key === 'Enter' && nextBtn && !nextBtn.disabled) nextBtn.click(); });
    }
    // Проверка «настоящего» имени: 2+ буквы, только буквы/дефис, не «человек»/«ник»
    function isRealName(raw) {
      const v = (raw || '').trim();
      if (!v) return false;
      if (!/^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\-]{1,}$/.test(v)) return false; // минимум 2 буквы
      const bad = ['человек','чел','ник','никнейм','имя','тест','test','user','юзер','аноним','anon','none','нет','не знаю'];
      if (bad.includes(v.toLowerCase())) return false;
      return true;
    }

    if (nameInp) {
      nameInp.addEventListener('input', () => {
        const ok = isRealName(nameInp.value);
        if (nextBtn) nextBtn.disabled = !ok;
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!nameInp) return;
        const val = nameInp.value.trim();
        if (!isRealName(val)) {
          alert('Пожалуйста, укажите настоящее имя (например, «Аня» или «Антон»). Ники, «человек» и одна буква не подходят.');
          return;
        }
        draft.name = val.split(/\s+/)[0];
        nameInp.value = draft.name;
        goTo(2);
      });
    }
    // ---------- Пикер группы: цепочка Буквы → Год → Номер ----------
    let chain = null;
    if (lettersInp && yearSel && numSel) {
      chain = setupGroupChain({
        letters: lettersInp,
        year:    yearSel,   // теперь это <input>, ID оставили
        num:     numSel,
        onChange: (parts, complete) => {
          if (nextBtn2) nextBtn2.disabled = !complete;
        }
      });
      // предзаполнение из уже сохранённого профиля (если есть)
      const parts = parseGroup((user && user.group) || '');
      if (parts.letters || parts.year || parts.num) {
        chain.setParts({
          letters: parts.letters || '',
          year:    parts.year    || '',
          num:     parts.num     || ''
        });
      }
      if (nextBtn2) nextBtn2.disabled = !chain.isComplete();
    }

    if (nextBtn2) {
      nextBtn2.addEventListener('click', () => {
        if (!chain || !chain.isComplete()) {
          alert('Заполните все три поля группы: буквы, год, номер.');
          return;
        }
        const groupStr = formatGroup(chain.getParts());
        if (isGroupFull(groupStr)) {
          alert(`Группа ${groupStr} закрыта для новых участников (полная группа). Выберите другую группу.`);
          return;
        }
        draft.group = groupStr;
        goTo(3);
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener('click', async () => {
        // Дополнительная страховка: группа не должна быть пустой
        if (!draft.group) {
          alert('Пожалуйста, укажи группу перед завершением.');
          goTo(2); // возвращаем на шаг с группой
          return;
        }

        finishBtn.disabled = true;
        finishBtn.textContent = 'Сохраняю…';

        user = user || {};
        user.name   = draft.name;
        user.group  = draft.group; // Теперь тут точно не пусто
        user.status = draft.status || USER_STATUSES[0];
        user.color  = draft.color;
        saveUser();
        localStorage.setItem(ONBOARD_DONE_KEY, '1');

        try {
          if (window.doroCloudReady) {
            const cloud = await window.doroCloudReady;
            if (cloud) {
              const result = await cloud.claimIdentity(user);
              if (result && result.removed > 0) {
                try { localStorage.removeItem('doro.usersCache.v2'); } catch (e) {}
                usersCache = null;
                usersCacheTime = 0;
              }
            }
          }
        } catch (e) { 
          // Если лимит превышен или ошибка сети — не блокируем вход!
          console.warn('Ошибка облака (пропускаем):', e.message); 
        }

        onboard.classList.remove('is-open');
        onboard.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('onboard-open');

        renderProfile();
        if (typeof paintThemeToggleBtn === 'function') paintThemeToggleBtn();
        if (typeof window.__refreshSchedule === 'function') window.__refreshSchedule();
        showView('profile');
      });
    }

    // Старый онбординг полностью отключён — его заменила authModal.
  })();

  // ============================================================
  //  МОДАЛКА: ОБЯЗАТЕЛЬНАЯ ГРУППА
  // ============================================================
  (function initGroupRequiredModal() {
    const modal      = $('groupRequiredModal');
    const lettersInp = $('reqGroupLetters');
    const yearInp    = $('reqGroupYear');
    const numInp     = $('reqGroupNum');
    const saveBtn    = $('reqGroupSave');

    if (!modal || !lettersInp || !yearInp || !numInp || !saveBtn) return;

    let chain = null;

    // Инициализация цепочки
    chain = setupGroupChain({
      letters: lettersInp,
      year:    yearInp,
      num:     numInp,
      onChange: (parts, complete) => {
        saveBtn.disabled = !complete;
      }
    });
    saveBtn.disabled = !chain.isComplete();

    // Предзаполнение, если у пользователя уже что-то было (частично)
    const parts = parseGroup((user && user.group) || '');
    if (parts.letters || parts.year || parts.num) {
      chain.setParts({
        letters: parts.letters || '',
        year:    parts.year    || '',
        num:     parts.num     || ''
      });
    }

    saveBtn.addEventListener('click', async () => {
      if (!chain.isComplete()) {
        alert('Заполните все три поля: буквы, год, номер.');
        return;
      }
      saveBtn.disabled = true;
      saveBtn.textContent = 'Сохраняю…';

      if (!user) user = {};
      user.group = formatGroup(chain.getParts());
      saveUser();

      try {
        if (window.doroCloudReady) {
          const cloud = await window.doroCloudReady;
          if (cloud) await cloud.saveProfile(user);
        }
      } catch (e) { console.warn('Cloud save failed:', e); }

      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('onboard-open');

      renderProfile();
      if (typeof window.__refreshSchedule === 'function') window.__refreshSchedule();
    });

    // Показ модалки, если нужно
    const onboardDone = localStorage.getItem(ONBOARD_DONE_KEY) === '1';
    if (user && user.name && !user.group && onboardDone) {
      setTimeout(() => {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('onboard-open');
        setTimeout(() => chain.focusFirst(), 400);
      }, 1000);
    }
  })();

  // ============================================================
  //  ВХОД / РЕГИСТРАЦИЯ (2 экрана: выбор → форма)
  // ============================================================
  const AUTH_LOGIN_KEY = 'doro.lastLogin';
  const authModal    = $('authModal');
  const authStep     = $('authStep');
  const authTitle    = $('authTitle');
  const authFormTitle = $('authFormTitle');
  const authNoteText = $('authNoteText');
  const authName     = $('authName');
  const authLetters  = $('authGroupLetters');
  const authYear     = $('authGroupYear');
  const authNum      = $('authGroupNum');
  const authPassword = $('authPassword');
  const authSubmit   = $('authSubmit');
  const authError    = $('authError');
  const authBack     = $('authBack');

  let authMode = 'register'; // 'login' | 'register'
  let authChain = null;

  function showAuthError(msg) {
    if (authError) { authError.textContent = msg || ''; authError.style.display = msg ? 'block' : 'none'; }
  }
  function clearAuthError() { showAuthError(''); }

  // Показ экрана «выбор» или «форма»
  function showAuthScreen(name) {
    authModal.querySelectorAll('.auth-screen').forEach(s => {
      s.classList.toggle('is-active', s.dataset.authScreen === name);
    });
    clearAuthError();
  }

  const AUTH_TEXT = {
    login: {
      step: 'Вход в doro',
      title: 'Войти в аккаунт',
      submit: 'Войти',
      note: '<strong>Уже заходили раньше?</strong> Введите то же имя и группу, что и тогда, и придумайте пароль — мы найдём ваш старый профиль и привяжем к нему этот пароль.',
    },
    register: {
      step: 'Регистрация',
      title: 'Создать аккаунт',
      submit: 'Создать аккаунт',
      note: '<strong>Пароль нужен для входа с любого устройства.</strong> Логин — это ваше имя и группа (например, «аня лд2511»). Придумайте пароль от 6 символов и запомните его.',
    },
  };

  function paintAuthForm() {
    const t = AUTH_TEXT[authMode];
    if (authStep)  authStep.textContent  = t.step;
    if (authFormTitle) authFormTitle.textContent = t.title;
    if (authSubmit) authSubmit.textContent = t.submit;
    if (authNoteText) authNoteText.innerHTML = t.note;
    if (authPassword) authPassword.setAttribute('autocomplete', authMode === 'register' ? 'new-password' : 'current-password');
  }

  function openAuth(mode, screen) {
    if (!authModal) return;
    authMode = (mode === 'login') ? 'login' : 'register';
    clearAuthError();

    // Если экран не задан — открываем «выбор»
    const startScreen = screen || 'choice';

    if (startScreen === 'form') {
      const savedName  = (user && user.name)  ? user.name  : '';
      const savedGroup = (user && user.group) ? user.group : '';

      if (authName)     authName.value     = savedName;
      if (authPassword) authPassword.value = '';

      const parts = parseGroup(savedGroup);
      if (authChain) {
        authChain.setParts({
          letters: parts.letters || '',
          year:    parts.year    || '',
          num:     parts.num     || ''
        });
      } else {
        if (authLetters) authLetters.value = parts.letters || '';
        if (authYear)    authYear.value    = parts.year    || '';
        if (authNum)     authNum.value     = parts.num     || '';
      }

      const av = $('authAvatarLetter');
      if (av) {
        const n = (authName.value || '').trim();
        av.textContent = n ? n[0].toUpperCase() : '?';
      }

      paintAuthForm();
    } else {
      // Экран «выбор»
      if (authStep) authStep.textContent = 'Вход в doro';
      const av = $('authAvatarLetter');
      if (av) av.textContent = '?';
    }

    showAuthScreen(startScreen);
    authModal.classList.add('is-open');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('onboard-open');
  }

  function closeAuth() {
    if (!authModal) return;
    authModal.classList.remove('is-open');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('onboard-open');
  }

  if (authModal) {
    // Цепочка группы в форме
    if (authLetters && authYear && authNum) {
      authChain = setupGroupChain({
        letters: authLetters,
        year:    authYear,
        num:     authNum,
        onChange: () => {}
      });
    }

    // ---- Экран выбора ----
    const chooseNewBtn = $('authChooseNew');
    const chooseOldBtn = $('authChooseOld');

    if (chooseNewBtn) chooseNewBtn.addEventListener('click', () => {
      authMode = 'register';
      openAuth('register', 'form');
    });

    if (chooseOldBtn) chooseOldBtn.addEventListener('click', () => {
      authMode = 'login';
      openAuth('login', 'form');
    });

    // ---- Кнопка «Назад» ----
    if (authBack) authBack.addEventListener('click', () => {
      showAuthScreen('choice');
      if (authStep) authStep.textContent = 'Вход в doro';
    });

    // ---- Автокапитализация букв ----
    if (authLetters) authLetters.addEventListener('input', () => {
      authLetters.value = normalizeGroupLetters(authLetters.value);
    });

    // ---- Превью аватара ----
    if (authName) authName.addEventListener('input', () => {
      const av = $('authAvatarLetter'); if (!av) return;
      const n = (authName.value || '').trim();
      av.textContent = n ? n[0].toUpperCase() : '?';
    });

    // ---- Показать/скрыть пароль ----
    authModal.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const eyeOpen   = btn.querySelector('.eye-open');
        const eyeClosed = btn.querySelector('.eye-closed');
        if (input.type === 'password') {
          input.type = 'text';
          btn.title = 'Скрыть пароль'; btn.setAttribute('aria-label', 'Скрыть пароль');
          if (eyeOpen) eyeOpen.style.display = 'none';
          if (eyeClosed) eyeClosed.style.display = 'block';
        } else {
          input.type = 'password';
          btn.title = 'Показать пароль'; btn.setAttribute('aria-label', 'Показать пароль');
          if (eyeOpen) eyeOpen.style.display = 'block';
          if (eyeClosed) eyeClosed.style.display = 'none';
        }
      });
    });

    // ---- Отправка формы ----
    if (authSubmit) authSubmit.addEventListener('click', async () => {
      clearAuthError();

      const nameRaw = (authName.value || '').trim();
      if (!nameRaw) { showAuthError('Введите имя'); return; }
      const name = nameRaw.split(/\s+/)[0];

      if (!authChain || !authChain.isComplete()) {
        showAuthError('Заполните все три поля группы: буквы, год, номер.');
        return;
      }
      const group = formatGroup(authChain.getParts());

      const password = authPassword.value;
      if (!password || password.length < 6) { showAuthError('Пароль должен быть минимум 6 символов'); return; }

      const login = (name.toLowerCase() + '_' + group.toLowerCase());

      authSubmit.disabled = true;
      authSubmit.textContent = authMode === 'register' ? 'Создаю…' : 'Вхожу…';

      try {
        const cloud = window.doroCloudReady ? await window.doroCloudReady : null;

        if (!cloud) {
          if (!user) user = {};
          user.name = name; user.group = group;
          user.status = user.status || USER_STATUSES[0];
          user.color  = user.color  || '#3b82f6';
          saveUser();
          localStorage.setItem(ONBOARD_DONE_KEY, '1');
          localStorage.setItem(AUTH_LOGIN_KEY, login);
          localStorage.setItem('doro.hasPasswordAccount', '1');
          closeAuth(); renderProfile(); showView('profile');
          return;
        }

        if (authMode === 'register') {
          await cloud.register(login, password);

          user = user || {};
          user.name = name; user.group = group;
          user.status = user.status || USER_STATUSES[0];
          user.color  = user.color  || '#3b82f6';
          saveUser();

          try {
            const claim = await cloud.claimIdentity(user);
            if (claim && claim.removed > 0) {
              try { localStorage.removeItem('doro.usersCache.v2'); } catch (e) {}
              usersCache = null; usersCacheTime = 0;
            }
          } catch (e) { console.warn('claimIdentity:', e); }

          localStorage.setItem(ONBOARD_DONE_KEY, '1');
          localStorage.setItem(AUTH_LOGIN_KEY, login);
          localStorage.setItem('doro.hasPasswordAccount', '1');
          closeAuth(); renderProfile(); showView('profile');
        } else {
          const result = await cloud.loginOrMigrate(
            { name, group, status: user?.status || USER_STATUSES[0], color: user?.color || '#3b82f6' },
            password
          );

          let profile = await cloud.getMyProfile({ name, group });
          if (!profile) {
            user = { 
              name, group, 
              status: user?.status || USER_STATUSES[0], 
              color: user?.color || '#3b82f6',
              avatarEmoji: '',
              avatarFrame: 'none',
              profileBg: 'default',
              profileBadge: 'none',
              profileEffect: 'default'
            };
            await cloud.saveProfile(user);
          } else {
            user = {
              name:          profile.name          || name,
              group:         profile.group         || group,
              status:        profile.status        || USER_STATUSES[0],
              color:         profile.color         || '#3b82f6',
              avatarEmoji:   profile.avatarEmoji   || '',
              avatarFrame:   profile.avatarFrame   || 'none',
              profileBg:     profile.profileBg     || 'default',
              profileBadge:  profile.profileBadge  || 'none',
              profileEffect: profile.profileEffect || 'default'
            };
          }
          saveUser();

          if (result && result.migrated) {
            alert(result.restored
              ? 'Нашли ваш старый профиль и привязали к нему пароль. Теперь можно входить с любого устройства.'
              : 'Пароль создан. Теперь можно входить с любого устройства по этим имени и паролю.');
            try { localStorage.removeItem('doro.usersCache.v2'); } catch (e) {}
            usersCache = null; usersCacheTime = 0;
          }

          localStorage.setItem(ONBOARD_DONE_KEY, '1');
          localStorage.setItem(AUTH_LOGIN_KEY, login);
          localStorage.setItem('doro.hasPasswordAccount', '1');
          closeAuth(); renderProfile(); showView('profile');
        }
      } catch (err) {
        console.error('Auth error:', err);
        let msg = err.message || 'Ошибка';
        if (msg.includes('email-already-in-use')) msg = 'Этот логин уже занят. Нажмите «Назад» и выберите «Я уже был здесь».';
        else if (msg.includes('user-not-found'))  msg = 'Пользователь не найден. Нажмите «Назад» и выберите «Я здесь впервые».';
        else if (msg.includes('wrong-password') || msg.includes('invalid-credential')) msg = 'Неверный пароль.';
        else if (msg.includes('invalid-email'))   msg = 'Логин составлен неправильно.';
        else if (msg.includes('weak-password'))   msg = 'Слишком простой пароль.';
        showAuthError(msg);
      } finally {
        authSubmit.disabled = false;
        paintAuthForm();
      }
    });
  }

  // ---------- Автозапуск ----------
  async function bootAuth() {
    let waitTime = 0;
    while (!window.doroCloudReady && waitTime < 8000) {
      await new Promise(r => setTimeout(r, 100));
      waitTime += 100;
    }

    const cloud = window.doroCloudReady ? await window.doroCloudReady : null;
    const hasPasswordAccount = localStorage.getItem('doro.hasPasswordAccount') === '1';

    if (hasPasswordAccount && cloud && !cloud.isAnonymous) {
      try {
        const profile = await cloud.getMyProfile(user);
        if (profile) {
  user = {
    name:          profile.name          || '',
    group:         profile.group         || '',
    status:        profile.status        || USER_STATUSES[0],
    color:         profile.color         || '#3b82f6',
    avatarEmoji:   profile.avatarEmoji   || '',           // <-- добавить
    avatarFrame:   profile.avatarFrame   || 'none',       // <-- добавить
    profileBg:     profile.profileBg     || 'default',    // <-- добавить
    profileBadge:  profile.profileBadge  || 'none',       // <-- добавить
    profileEffect: profile.profileEffect || 'default'     // <-- добавить
  };
  saveUser();

          // Подтягиваем Golden из облака
          if (profile.premiumActive && (!profile.premiumExpiresAt || profile.premiumExpiresAt > Date.now())) {
            window.doroPremium.savePremium({
              active: true,
              expiresAt: profile.premiumExpiresAt || (Date.now() + 30 * 86400000)
            });
            // savePremium уже добавил классы и диспатчил событие
            if (typeof renderPremiumPage === 'function') renderPremiumPage();
            if (typeof renderProfile === 'function') renderProfile();
          }
        }
      } catch (e) { console.warn('profile load:', e); }
      renderProfile();
      return;
    }

    // Открываем окно сразу на экране выбора
    setTimeout(() => openAuth('register', 'choice'), 400);
  }

  // Всегда грузим роли в фоне, не дожидаясь контента
  loadEditorNames();

  if (window.doroContent && window.doroContent.loadAllTopics) {
    // Не блокируем первый экран загрузкой тем — грузим параллельно
    Promise.all([
      window.doroContent.loadAllTopics().catch(e => console.warn('[boot] loadAllTopics:', e))
    ]).then(() => {
      if (typeof window.renderSections === 'function') window.renderSections();
    });
    bootAuth();
  } else {
    bootAuth();
  }
  // ============================================================
  //  ЗАГРУЗЧИК ТЕМЫ — прогресс в шапке + «выпрыг» читалки
  // ============================================================
  const TopicLoader = (function () {
    const wrap   = document.getElementById('islandTopicProgress');
    const fill   = document.getElementById('islandTopicFill');
    const value  = document.getElementById('islandTopicValue');

    let raf = null;
    let progress = 0;
    let target = 0;
    let done = false;
    let startedAt = 0;
    let fakeTimer = null;
    let token = 0;              // ← защита от «двойного finish/start»
    let hideTimer = null;

    // Минимальное время показа «100%»
    const MIN_FULL_VISIBLE_MS = 700;

    function paint() {
      if (fill)  fill.style.width = progress + '%';
      if (value) value.textContent = Math.round(progress) + '%';
    }

    function tick() {
      const diff = target - progress;
      if (Math.abs(diff) < 0.4) {
        progress = target;
      } else {
        progress += diff * 0.12;
      }
      paint();
      if (progress < target - 0.4) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    function ensureLoop() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function startFake() {
      startedAt = performance.now();
      clearInterval(fakeTimer);
      const step = () => {
        if (done) return;
        const t = Math.min(1, (performance.now() - startedAt) / 1100);
        const eased = 1 - Math.pow(1 - t, 2);
        let want;
        if (t < 1) want = eased * 60;
        else {
          const over = (performance.now() - startedAt - 1100) / 3000;
          want = 60 + Math.min(30, over * 30);
        }
        if (want > target) { target = want; ensureLoop(); }
        if (t < 1 || !done) fakeTimer = setTimeout(step, 60);
      };
      step();
    }

    function cleanupTimers() {
      clearInterval(fakeTimer);
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    }

    return {
      start() {
        if (!wrap) return;
        const myToken = ++token;
        done = false;
        progress = 0;
        target = 0;
        paint();
        cleanupTimers();
        wrap.classList.remove('is-done', 'is-visible'); // сначала убрать
        void wrap.offsetWidth;                          // рефлоу
        wrap.classList.add('is-visible');               // потом показать
        wrap.setAttribute('aria-hidden', 'false');
        startFake();
        ensureLoop();
        return myToken;
      },

      set(p) {
        if (done) return;
        const clamped = Math.min(100, Math.max(0, p));
        if (clamped > target) {
          target = clamped;
          ensureLoop();
        }
      },

      async finish() {
        if (!wrap) return;
        const myToken = ++token;
        done = true;
        clearInterval(fakeTimer);

        // Дорастаем до 100 через tick
        target = 100;
        ensureLoop();
        await new Promise((resolve) => {
          const check = () => {
            if (myToken !== token) { resolve(); return; }  // нас отменили
            if (progress >= 99.5) { progress = 100; paint(); resolve(); }
            else requestAnimationFrame(check);
          };
          check();
        });

        // Даём пользователю увидеть 100%
        await new Promise(r => setTimeout(r, MIN_FULL_VISIBLE_MS));
        if (myToken !== token) return;              // нас отменили — выходим

        wrap.classList.add('is-done');
        hideTimer = setTimeout(() => {
          if (myToken !== token) return;
          wrap.classList.remove('is-visible', 'is-done');
          wrap.setAttribute('aria-hidden', 'true');
        }, 500);
      },

      reset() {
        token++;                                   // отменить все текущие операции
        done = true;
        cleanupTimers();
        target = 0;
        progress = 0;
        paint();
        if (wrap) {
          wrap.classList.remove('is-visible', 'is-done');
          wrap.setAttribute('aria-hidden', 'true');
        }
      },
    };
  })();
  // ---------- ФИНАЛЬНЫЙ РЕНДЕР ----------
  renderProfile();
  showView('home');
  updateViewAsBanner();

  window.openTopic = openTopic;
  window.showView = showView;

  // ============================================================
  //  Периодическая проверка Golden (раз в 3 минуты)
  // ============================================================
  setInterval(async () => {
    if (!window.doroCloudReady || !window.doroPremium || !user) return;
    try {
      const cloud = await window.doroCloudReady;
      if (!cloud) return;
      const profile = await cloud.getMyProfile(user);
      if (!profile) return;
      if (profile.premiumActive && (!profile.premiumExpiresAt || profile.premiumExpiresAt > Date.now())) {
        if (!window.doroPremium.isPremiumActive()) {
          window.doroPremium.savePremium({
            active: true,
            expiresAt: profile.premiumExpiresAt || (Date.now() + 30 * 86400000)
          });
          if (typeof renderPremiumPage === 'function') renderPremiumPage();
          if (typeof renderProfile === 'function') renderProfile();
        }
      } else {
        // Golden сняли в админке — отзываем локально
        if (window.doroPremium.isPremiumActive()) {
          window.doroPremium.savePremium({ active: false });
          if (typeof renderPremiumPage === 'function') renderPremiumPage();
          if (typeof renderProfile === 'function') renderProfile();
        }
      }
    } catch (e) {}
  }, 180000);
});
// ============================================================
//  ПРЕДПРОСМОТР ПРОФИЛЯ ПРИ НАВЕДЕНИИ
// ============================================================
(function initProfileHoverCard() {
  const HOVER_DELAY = 180;
  const HIDE_DELAY  = 320;
  let openTimer = null;
  let closeTimer = null;
  let pop = null;
  let currentAnchor = null;

  const badgeMap = { fire:'🔥', medal:'🥇', bolt:'⚡', diamond:'💎', grad:'🎓', crown:'👑' };

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement('div');
    pop.className = 'user-hover';
    pop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(pop);
    pop.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    pop.addEventListener('mouseleave', scheduleHide);
    return pop;
  }

  function initials(name) {
    if (!name) return '?';
    const p = name.trim().split(/\s+/);
    if (!p.length) return '?';
    if (p.length === 1) return p[0][0].toUpperCase();
    return (p[0][0] + p[1][0]).toUpperCase();
  }

  function isGolden() {
    return !!(window.doroPremium && window.doroPremium.isPremiumActive());
  }

  function getMine() {
    try { return JSON.parse(localStorage.getItem('doro.user') || 'null'); } catch (e) { return null; }
  }

  function buildHtml(u) {
    const color = u.color || '#3b82f6';
    const emoji = u.avatarEmoji || '';
    const me = getMine();
    const isMine = !!(me && me.name
      && me.name.toLowerCase() === u.name.toLowerCase()
      && ((me.group || '') === (u.group || '')));
    const badge = (isGolden() && u.profileBadge && badgeMap[u.profileBadge]) || '';
    const frame = (isGolden() && u.avatarFrame) ? u.avatarFrame : 'none';
    const bg    = (isGolden() && u.profileBg)    ? u.profileBg    : 'default';
    const fx    = (isGolden() && u.profileEffect)? u.profileEffect: 'default';

    const avatarBg = emoji
      ? `linear-gradient(135deg,
          color-mix(in srgb, ${color} 18%, #fff),
          color-mix(in srgb, ${color} 28%, #fff))`
      : `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #fff))`;

    return `
      <div class="user-hover__card" data-bg="${bg}" data-effect="${fx}" style="--ac:${color}">
        <div class="user-hover__avatar${emoji ? ' is-emoji' : ''}" data-frame="${frame}"
             style="background:${avatarBg};--ac:${color}">
          ${emoji || initials(u.name)}
        </div>
        <div class="user-hover__name">
          ${escapeHtml(u.name)}${badge ? `<span class="user-hover__badge">${badge}</span>` : ''}
        </div>
        ${u.status ? `<div class="user-hover__status">${escapeHtml(u.status)}</div>` : ''}
        ${u.group ? `<div class="user-hover__group">Группа ${escapeHtml(u.group)}</div>` : ''}
        ${isMine ? `<div class="user-hover__me">это вы</div>` : ''}
      </div>
    `;
  }

  function position(anchor) {
    if (!pop || !anchor) return;
    const r = anchor.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();
    const margin = 10;

    let top = r.bottom + window.scrollY + margin;
    let left = r.left + window.scrollX;

    if (left + popRect.width > window.innerWidth - 12) {
      left = window.innerWidth - popRect.width - 12 + window.scrollX;
    }
    if (left < 12 + window.scrollX) left = 12 + window.scrollX;

    if (r.bottom + popRect.height + margin > window.innerHeight && r.top > popRect.height + margin) {
      top = r.top + window.scrollY - popRect.height - margin;
    }

    pop.style.top  = top + 'px';
    pop.style.left = left + 'px';
  }

  function show(u, anchor) {
    clearTimeout(closeTimer);
    if (!u || !u.name) return;
    ensurePop();
    pop.innerHTML = buildHtml(u);
    pop.classList.add('is-visible');
    pop.setAttribute('aria-hidden', 'false');
    currentAnchor = anchor;
    requestAnimationFrame(() => position(anchor));
  }

  function hide() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (!pop) return;
    pop.classList.remove('is-visible');
    pop.setAttribute('aria-hidden', 'true');
    currentAnchor = null;
  }

  function scheduleHide() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(hide, HIDE_DELAY);
  }

  function scheduleShow(u, anchor) {
    clearTimeout(openTimer);
    openTimer = setTimeout(() => show(u, anchor), HOVER_DELAY);
  }

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-preview-user]');
    if (!el) return;
    if (currentAnchor === el) return;

    // Если уже открыт попап для другого элемента — не переключаем сразу,
    // а закрываем старый и открываем новый с той же задержкой
    let data;
    try { data = JSON.parse(el.dataset.previewUser || 'null'); } catch (_) {}
    if (!data || !data.name) return;
    scheduleShow(data, el);
  });

  document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('[data-preview-user]');
    if (!el) return;
    if (e.relatedTarget && (el.contains(e.relatedTarget) || (pop && pop.contains(e.relatedTarget)))) return;
    scheduleHide();
  });

  document.addEventListener('click', (e) => {
    if (e.pointerType === 'mouse') return;
    const el = e.target.closest('[data-preview-user]');
    if (!el) {
      if (pop && pop.classList.contains('is-visible')) hide();
      return;
    }
    if (currentAnchor === el && pop && pop.classList.contains('is-visible')) {
      hide();
      return;
    }
    let data;
    try { data = JSON.parse(el.dataset.previewUser || 'null'); } catch (_) {}
    if (!data || !data.name) return;
    show(data, el);
  });

  window.addEventListener('scroll', () => {
    if (pop && pop.classList.contains('is-visible') && currentAnchor) position(currentAnchor);
  }, { passive: true });
  // ============================================================
//  МОДАЛКА ПОДДЕРЖКИ (GOLDEN)
// ============================================================
(function initSupportModal() {
  const SUPPORT_SEEN_KEY = 'doro.supportModal.seen.v1';
  const modal    = document.getElementById('supportModal');
  const closeBtn = document.getElementById('supportModalClose');
  const backdrop = document.getElementById('supportModalBackdrop');
  const goBtn    = document.getElementById('supportModalGo');

  if (!modal) return;

  // Показываем окно, только если его еще не видели
  if (!localStorage.getItem(SUPPORT_SEEN_KEY)) {
    setTimeout(() => {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }, 1000); // Небольшая задержка, чтобы сайт успел прогрузиться
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    localStorage.setItem(SUPPORT_SEEN_KEY, '1'); // Запоминаем, что видели
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (goBtn) {
    goBtn.addEventListener('click', () => {
      closeModal();
      // Перекидываем на вкладку Golden
      const navLink = document.querySelector('.nav a[data-view="premium"]');
      if (navLink) navLink.click();
    });
  }
})();
  window.addEventListener('resize', () => {
    if (pop && pop.classList.contains('is-visible') && currentAnchor) position(currentAnchor);
  });
})();

// ============================================================
//  МОДАЛКА ОПЛАТЫ GOLDEN (QR + карта + заявка)
// ============================================================
(function initPayModal() {
  const $ = (id) => document.getElementById(id);
  const modal   = $('payModal');
  const paidBtn = $('payPaidBtn');
  const errEl   = $('payError');
  const success = $('paySuccess');
  const cardNum = $('payCardNum');

  if (!modal) return;

  function showError(msg) {
    if (errEl) { errEl.textContent = msg || ''; errEl.style.display = msg ? 'block' : 'none'; }
  }

  function open() {
    if (!window.doroPremium) return;
    if (window.doroPremium.isPremiumActive()) {
      alert('Golden уже активен');
      return;
    }

    showError('');
    if (success) success.style.display = 'none';
    if (paidBtn) {
      paidBtn.style.display = '';
      paidBtn.disabled = false;
      paidBtn.textContent = 'Я оплатил(а) · отправить заявку';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    window.doroPremium.getMyPaymentRequest().then(req => {
      if (req && req.status === 'pending') {
        if (paidBtn) paidBtn.style.display = 'none';
        if (success) success.style.display = 'flex';
      }
    });
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  modal.querySelectorAll('[data-pay-close]').forEach(el => {
    el.addEventListener('click', close);
  });

  if (cardNum) {
    cardNum.addEventListener('click', () => {
      const txt = cardNum.textContent.replace(/\s/g, '');
      navigator.clipboard?.writeText(txt).then(() => {
        const old = cardNum.textContent;
        cardNum.textContent = 'скопировано ✓';
        setTimeout(() => { cardNum.textContent = old; }, 1200);
      });
    });
  }

  if (paidBtn) {
    paidBtn.addEventListener('click', async () => {
      showError('');
      paidBtn.disabled = true;
      paidBtn.textContent = 'Отправляю…';
      try {
        await window.doroPremium.submitPaymentRequest();
        paidBtn.style.display = 'none';
        if (success) success.style.display = 'flex';
      } catch (e) {
        showError(e.message || 'Не удалось отправить заявку');
        paidBtn.disabled = false;
        paidBtn.textContent = 'Я оплатил(а) · отправить заявку';
      }
    });
  }

  window.__openPayModal = open;
})();