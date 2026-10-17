// ============================================================
//  ДАННЫЕ ПРЕДМЕТОВ
// ============================================================
const subjects = {
  biochem: {
    num: "01", title: "Биохимия",
    topics: [{
      num: "2.2", title: "Транскрипция, трансляция. ДНК технологии в медицине. Экспрессия генов",
      steps: ["Прочитать основной файлик", "Прочитать файлик тестов", "Решить тест"],
      date: "2026-10-10",
      files: [
        { name: "БХ_2.2.pdf", url: "files/biochem/БХ_2.2.pdf" },
        { name: "БХ_2.2ТЕСТЫ.pdf", url: "files/biochem/БХ_2.2ТЕСТЫ.pdf" }
      ]
    }]
  },
  physio: {
    num: "02", title: "Физиология",
    topics: [
      { num: "1.5", title: "КОЛЛОКВИУМ по разделу «Общая физиология»", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-04", files: [{ name: "ФИЗА_КОЛЛОК.pdf", url: "files/physio/ФИЗА_КОЛЛОК.pdf" }] },
      { num: "2.1", title: "Общие принципы регуляции. Рефлекторная деятельность ЦНС.", steps: ["Сделать конспект", "Выполнить тест"], date: "2026-10-13", files: [{ name: "ФИЗА_2.1.pdf", url: "files/physio/ФИЗА_2.1.pdf" }, { name: "ФИЗА_2.1ТЕСТЫ.pdf", url: "files/physio/ФИЗА_2.1ТЕСТЫ.pdf" }] }
    ]
  },
  histology: {
    num: "03", title: "Гистология",
    topics: [
      { num: "24", title: "Пищеварительная система. Морфологическая характеристика желудка.", steps: ["Прочитать файлик", "Решить тест"], date: "2026-10-13", files: [{ name: "ГИСТА_24.pdf", url: "files/histology/ГИСТА_24.pdf" }] },
      { num: "25", title: "Дыхательная система. Морфологическая характеристика.", steps: ["Прочитать файлик", "Решить тест"], date: "2026-10-20", files: [{ name: "ГИСТА_25.pdf", url: "files/histology/ГИСТА_25.pdf" }] }
    ]
  },
  microbio: {
    num: "04", title: "Микробиология",
    topics: [{ num: "06", title: "Инфекция, инфекционный процесс. Факторы патогенности бактерий", steps: ["Прочитать файлик", "Выполнить тест"], date: "2026-10-10", files: [{ name: "МИКРА_6.pdf", url: "files/microbio/МИКРА_6.pdf" }] }]
  },
  hygiene: {
    num: "05", title: "Гигиена",
    topics: [{ title: "Раздел в разработке", steps: ["Материалы появятся позже"], date: "2026-09-01", files: [{ name: "Пока пусто", url: "#" }] }]
  }
};

// ============================================================
//  РАСПИСАНИЕ
// ============================================================
const schedule = {
  "ПН": [
    { time: "8:00–10:25", title: "Микробио", subjectKey: "microbio", room: "239 каб.", teacher: "Тимонов Андрей Викторович", place: "Папанинцев, 126" },
    { time: "10:40–13:05", title: "Биохимия", subjectKey: "biochem", room: "305 каб.", teacher: "Волобой Нина Леонидовна", place: "Папанинцев, 126" }
  ],
  "ВТ": [
    { time: "8:00–9:30", title: "ОМиПК", subjectKey: "microbio", subgroups: [{ label: "А", room: "48 каб.", teacher: "Старчикова М.В." }, { label: "Б", room: "43 каб.", teacher: "Кленова А.Ф." }], place: "Комсомольский, 82" },
    { time: "9:40–11:10", title: "Биоэтика", subjectKey: "hygiene", subgroups: [{ label: "А", room: "53 каб.", teacher: "Кочетова Ю.Ю." }, { label: "Б", room: "55 каб.", teacher: "Вольферц М.В." }], place: "Комсомольский, 82" }
  ],
  "СР": [
    { time: "8:00–10:25", title: "БЖД", subjectKey: "hygiene", room: "220 каб.", teacher: "Асманова Мария Андреевна", place: "Некрасова, 65" },
    { time: "10:40–13:05", title: "Гигиена", subjectKey: "hygiene", room: "133 каб.", teacher: "Ушаков Александр Анатольевич", place: "Некрасова, 65" }
  ],
  "ЧТ": [
    { time: "8:00–10:25", title: "Норм физа", subjectKey: "physio", room: "409 каб.", teacher: "Шахматов Игорь Ильич", place: "Папанинцев, 126" },
    { time: "10:35–12:05", title: "Истмед (1 нед.)", subjectKey: "histology", room: "326 каб.", teacher: "Кулипанова Наталья Викторовна", place: "Папанинцев, 126" }
  ],
  "ПТ": [
    { time: "10:30–12:00", title: "Физра", subjectKey: "physio", room: "4 каб.", teacher: "Воронцов Павел Геннадьевич", place: "Некрасова, 65" },
    { time: "13:30–15:55", title: "Гиста", subjectKey: "histology", room: "433 каб.", teacher: "Грибанова Ольга Геннадьевна", place: "Папанинцев, 126" }
  ]
};

// ============================================================
//  ВСПОМОГАТЕЛЬНЫЕ
// ============================================================
function daysSince(dateInput) {
  const then = new Date(dateInput).getTime();
  if (isNaN(then)) return 999;
  return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
}
const NEW_DAYS = 2;

function getAccentColor(key) {
  const colors = { biochem: '#16a34a', physio: '#2563eb', histology: '#9333ea', microbio: '#ea580c', hygiene: '#0891b2' };
  return colors[key] || '#3b82f6';
}

// ============================================================
//  БУРГЕР-МЕНЮ
// ============================================================
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(e.target) || burger.contains(e.target)) return;
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
}

// ============================================================
//  ПРОФИЛЬ
// ============================================================
const STORAGE_USER = 'doro.user';
const avatar = document.getElementById('avatar');
const profilePop = document.getElementById('profilePop');
const nameInput = document.getElementById('nameInput');
const saveName = document.getElementById('saveName');
const greetTitle = document.getElementById('greetTitle');

let user = JSON.parse(localStorage.getItem(STORAGE_USER) || 'null');

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').slice(0, 2).join('');
}

function applyUser() {
  if (!avatar || !greetTitle) return;
  if (user && user.name) {
    avatar.textContent = initials(user.name);
    const first = user.name.trim().split(/\s+/)[0];
    greetTitle.textContent = `Привет, ${first}!`;
  } else {
    avatar.textContent = '?';
    greetTitle.textContent = 'Привет!';
  }
}

if (avatar && profilePop && nameInput && saveName) {
  avatar.addEventListener('click', (e) => {
    e.stopPropagation();
    profilePop.classList.toggle('open');
    if (profilePop.classList.contains('open')) {
      nameInput.value = user?.name || '';
      nameInput.focus();
    }
  });

  saveName.addEventListener('click', () => {
    const val = nameInput.value.trim();
    if (!val) return;
    user = { name: val };
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    applyUser();
    profilePop.classList.remove('open');
  });

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveName.click();
  });

  document.addEventListener('click', (e) => {
    if (profilePop.contains(e.target) || avatar.contains(e.target)) return;
    profilePop.classList.remove('open');
  });
}

// ============================================================
//  ДАТА В ПРИВЕТСТВИИ
// ============================================================
const greetDate = document.getElementById('greetDate');
if (greetDate) {
  const now = new Date();
  let dateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  greetDate.textContent = dateStr;
}

// ============================================================
//  КАЛЕНДАРЬ + ПАРЫ
// ============================================================
const calendarEl = document.getElementById('calendar');
const lessonsEl = document.getElementById('lessons');
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

const STORAGE_LESSON_TASKS = 'doro.lessonTasks';
let lessonTasks = JSON.parse(localStorage.getItem(STORAGE_LESSON_TASKS) || '{}');

let calDate = new Date();
calDate.setDate(1);
let selectedDay = null;
let selectedMonth = null;
let selectedYear = null;

function saveLessonTasks() {
  localStorage.setItem(STORAGE_LESSON_TASKS, JSON.stringify(lessonTasks));
}

function renderCalendar() {
  if (!calendarEl) return;
  const year = calDate.getFullYear();
  const month = calDate.getMonth();

  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay();
  startOffset = (startOffset + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const today = new Date();
  const isSameMonth = today.getFullYear() === year && today.getMonth() === month;

  let html = `
    <div class="cal-head">
      <span class="cal-month">${MONTHS[month]} ${year}</span>
      <div class="cal-nav">
        <button type="button" data-nav="-1" aria-label="Назад">‹</button>
        <button type="button" data-nav="1" aria-label="Вперёд">›</button>
      </div>
    </div>
    <div class="cal-grid">
      ${DOW.map(d => `<div class="cal-dow">${d}</div>`).join('')}
  `;

  for (let i = 0; i < startOffset; i++) {
    const d = daysInPrev - startOffset + i + 1;
    html += `<button type="button" class="cal-day other" disabled>${d}</button>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay(); // 0 = Вс, 6 = Сб
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const isToday = isSameMonth && today.getDate() === d;
    const isSelected = selectedDay === d && selectedMonth === month && selectedYear === year;
    
    const classes = [
      'cal-day',
      isWeekend ? 'weekend' : '',
      isToday ? 'today' : '',
      isSelected ? 'selected' : ''
    ].filter(Boolean).join(' ');

    // Если выходной — делаем кнопку некликабельной
    const disabledAttr = isWeekend ? 'disabled' : '';
    const dataAttr = isWeekend ? '' : `data-day="${d}"`;

    html += `<button type="button" class="${classes}" ${dataAttr} ${disabledAttr}>${d}</button>`;
  }

  const totalCells = startOffset + daysInMonth;
  let rest = totalCells % 7;
  if (rest !== 0) {
    rest = 7 - rest;
    for (let i = 1; i <= rest; i++) {
      html += `<button type="button" class="cal-day other" disabled>${i}</button>`;
    }
  }

  html += `</div>`;
  calendarEl.innerHTML = html;

  calendarEl.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      calDate.setMonth(calDate.getMonth() + Number(btn.dataset.nav));
      renderCalendar();
    });
  });

  calendarEl.querySelectorAll('[data-day]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDay = Number(btn.dataset.day);
      selectedMonth = month;
      selectedYear = year;

      if (isSameMonth && today.getDate() === selectedDay) {
        selectedDay = null; selectedMonth = null; selectedYear = null;
      }

      renderCalendar();
      updateTodayView();
    });
  });
}

function updateTodayView() {
  const titleEl = document.getElementById('today-title');
  const topicsPanel = document.getElementById('topics-panel');
  const topicsList = document.getElementById('topics-list');

  if (!titleEl || !lessonsEl) return;

  let targetDate;
  let isToday = false;

  if (!selectedDay) {
    targetDate = new Date();
    const currentDayOfWeek = targetDate.getDay(); // 0 = Вс, 6 = Сб

    // Если сегодня выходной — показываем следующий понедельник
    if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
      const daysToMonday = currentDayOfWeek === 6 ? 2 : 1;
      targetDate.setDate(targetDate.getDate() + daysToMonday);

      // Выделяем этот понедельник в календаре
      selectedDay = targetDate.getDate();
      selectedMonth = targetDate.getMonth();
      selectedYear = targetDate.getFullYear();
      renderCalendar();
    } else {
      isToday = true;
    }
  } else {
    // Пользователь выбрал конкретный день в календаре
    targetDate = new Date(selectedYear, selectedMonth, selectedDay);
    const dayOfWeek = targetDate.getDay();

    // Если выбран выходной — показываем следующий рабочий день (понедельник)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const daysToMonday = dayOfWeek === 6 ? 2 : 1;
      const nextMonday = new Date(targetDate);
      nextMonday.setDate(nextMonday.getDate() + daysToMonday);
      targetDate = nextMonday;

      // Перезаписываем выбранную дату, чтобы в календаре выделился именно понедельник
      selectedDay = targetDate.getDate();
      selectedMonth = targetDate.getMonth();
      selectedYear = targetDate.getFullYear();
      renderCalendar();
    }
  }

  // Форматируем заголовок как "На понедельник", "На вторник" и т.д.
  const daysOfWeek = [
    'воскресенье', 'понедельник', 'вторник', 'среда',
    'четверг', 'пятница', 'суббота'
  ];
  const dayOfWeekName = daysOfWeek[targetDate.getDay()];
  
  // Если это сегодняшний день (и это не выходной), пишем "Сегодня"
  if (isToday) {
    titleEl.textContent = 'Сегодня';
  } else {
    titleEl.textContent = 'На ' + dayOfWeekName;
  }

  const jsDay = targetDate.getDay();
  const dayKey = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"][jsDay];
  const daySchedule = schedule[dayKey] || [];

  lessonsEl.innerHTML = '';
  const allTopicsForDay = [];

  if (!daySchedule.length) {
    lessonsEl.innerHTML = '<div class="lesson"><div class="lesson-head">В этот день пар нет</div></div>';
    if (topicsPanel) topicsPanel.style.display = 'none';
    return;
  }

  daySchedule.forEach((lesson, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'lesson';

    let detailsText = '';
    if (lesson.room) detailsText += `${lesson.room} · `;
    if (lesson.teacher) detailsText += `${lesson.teacher}`;
    if (lesson.subgroups) detailsText = 'Разделение на подгруппы';

    const topicsForLesson = getTopicsForLesson(lesson, targetDate);
    topicsForLesson.forEach(t => allTopicsForDay.push({ ...t, subjectKey: lesson.subjectKey }));

    wrapper.innerHTML = `
      <div class="lesson-head">
        <time>${lesson.time}</time>
        <div style="flex:1">
          <div class="lesson-title">${lesson.title}</div>
          <div class="lesson-details">${detailsText}</div>
        </div>
      </div>
    `;

    lessonsEl.appendChild(wrapper);
  });

  if (!topicsPanel || !topicsList) return;

  if (!allTopicsForDay.length) {
    topicsPanel.style.display = 'none';
    return;
  }

  topicsPanel.style.display = 'block';
  topicsList.innerHTML = '';

  allTopicsForDay.forEach(topic => {
    const subject = subjects[topic.subjectKey];
    const letter = subject ? subject.title.charAt(0).toUpperCase() : '?';

    const btn = document.createElement('button');
    btn.className = 'lesson-topic';
    btn.dataset.subject = topic.subjectKey;
    btn.innerHTML = `
      <span class="lesson-topic__letter">${letter}</span>
      <div class="lesson-topic__title">${topic.title}</div>
    `;
    btn.addEventListener('click', () => openSubjectView(topic.subjectKey, topic.num));
    topicsList.appendChild(btn);
  });
}

function getTopicsForLesson(lesson, targetDate) {
  const subjectKey = lesson.subjectKey;
  if (!subjectKey || !subjects[subjectKey]) return [];
  const subject = subjects[subjectKey];
  if (!subject.topics) return [];

  const lessonDate = new Date(targetDate);
  lessonDate.setHours(0, 0, 0, 0);

  return subject.topics.filter(topic => {
    if (topic.title === "Раздел в разработке") return false;
    const topicDate = new Date(topic.date);
    topicDate.setHours(0, 0, 0, 0);
    const diffDays = (topicDate - lessonDate) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 14;
  });
}

// ============================================================
//  РАЗДЕЛЫ (КАРТОЧКИ)
// ============================================================
function renderSections() {
  const container = document.getElementById('subject-cards');
  if (!container) return;
  container.innerHTML = '';

  const order = ['biochem', 'physio', 'histology', 'microbio', 'hygiene'];
  const subjectKeys = Object.keys(subjects).filter(k => k !== 'recent');
  const sortedKeys = order.filter(k => subjectKeys.includes(k));

  sortedKeys.forEach((key) => {
    const subject = subjects[key];
    const hasTopics = subject.topics && subject.topics.some(t => t.title !== "Раздел в разработке");
    const lastTopic = hasTopics ? subject.topics[0] : null;

    const a = document.createElement('button'); // Теперь это кнопка
    a.className = 'card';
    a.dataset.subject = key;

    const letter = subject.title.charAt(0).toUpperCase();

    let badgeHtml = '';
    if (lastTopic && daysSince(lastTopic.date) < NEW_DAYS) {
      badgeHtml = '<span class="card__badge card__badge--show">NEW</span>';
    }

    a.innerHTML = `
      ${badgeHtml}
      <span class="card__letter">${letter}</span>
      <span class="card__name">${subject.title}</span>
    `;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      // Подсвечиваем активную карточку
      container.querySelectorAll('.card').forEach(c => c.classList.remove('is-active'));
      a.classList.add('is-active');
      
      // Открываем контент
      openSubjectView(key);
    });

    container.appendChild(a);
  });
}

// ============================================================
//  РАСКРЫВАЮЩАЯСЯ ПАНЕЛЬ РАЗДЕЛА
// ============================================================
function openSubjectView(key, topicNum = null) {
  const subject = subjects[key];
  if (!subject || !subject.topics.length) return;

  const validTopics = subject.topics.filter(t => t.title !== "Раздел в разработке");
  if (!validTopics.length) return;

  let initialIndex = 0;
  if (topicNum) {
    const found = validTopics.findIndex(t => t.num === topicNum);
    if (found !== -1) initialIndex = found;
  }

  const viewSection = document.getElementById('subject-view');
  const titleEl = document.getElementById('subject-view-title');
  const bodyEl = document.getElementById('subject-view-body');
  const dotsEl = document.getElementById('modal-dots');
  const placeholder = document.getElementById('subject-placeholder');

  if (!titleEl || !bodyEl || !dotsEl || !viewSection) return;

  viewSection.style.setProperty('--card-accent', getAccentColor(key));
  titleEl.textContent = subject.title;
  if (placeholder) placeholder.style.display = 'none';

  function renderTopic(index) {
    const topic = validTopics[index];
    bodyEl.innerHTML = `
      <div class="modal__num">${topic.num || ''}</div>
      <h4 class="modal__title">${topic.title}</h4>
      <div class="modal__prep">
        <div class="modal__prep-title">Для подготовки</div>
        <ol class="modal__steps">
          ${(topic.steps || []).map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
      <h4 class="modal__subtitle">Материалы</h4>
      <ul class="modal__files">
        ${(topic.files || []).map(f => f.url === '#' ? `<li><span class="mfile disabled">${f.name}</span></li>` : `<li><a href="${f.url}" target="_blank">${f.name}</a></li>`).join('')}
      </ul>
    `;

    dotsEl.querySelectorAll('.modal__dot').forEach((d, i) => {
      d.classList.toggle('modal__dot--active', i === index);
    });
  }

  dotsEl.innerHTML = '';
  if (validTopics.length > 1) {
    dotsEl.style.display = 'flex';
    validTopics.forEach((topic, i) => {
      const btn = document.createElement('button');
      btn.className = 'modal__dot' + (i === initialIndex ? ' modal__dot--active' : '');
      btn.textContent = topic.num || String(i + 1).padStart(2, '0');
      btn.addEventListener('click', () => renderTopic(i));
      dotsEl.appendChild(btn);
    });
  } else {
    dotsEl.style.display = 'none';
  }

  renderTopic(initialIndex);

  // Плавно скроллим к панели так, чтобы она встала чуть ниже шапки
  setTimeout(() => {
    const yOffset = -100; 
    const y = viewSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, 50);
}

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  applyUser();
  updateTodayView();
  renderCalendar();
  renderSections();
  // Обработка клика по логотипу (скролл наверх)
  const brandLogo = document.getElementById('brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- ПОДСВЕТКА АКТИВНОЙ ВКЛАДКИ В ШАПКЕ ---
  const brand = document.getElementById('brand-logo');
  const navLinks = document.querySelectorAll('.nav a');
  const sectionsToObserve = [
    { el: document.querySelector('.today'), link: brand }, // Главная = лого
    { el: document.querySelector('#files'), link: document.querySelector('.nav a[href="#files"]') },
    { el: document.querySelector('#links'), link: document.querySelector('.nav a[href="#links"]') }
  ];

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Убираем активный класс со всех (включая лого)
        brand.classList.remove('active');
        navLinks.forEach(l => l.classList.remove('active'));

        // Находим нужный элемент и добавляем класс
        const found = sectionsToObserve.find(s => s.el === entry.target);
        if (found && found.link) {
          found.link.classList.add('active');
        }
      }
    });
  }, {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0
  });

  sectionsToObserve.forEach(s => {
    if (s.el) navObserver.observe(s.el);
  });
}); // <-- ВОТ ЭТА СТРОКА ЗАКРЫВАЕТ DOMContentLoaded