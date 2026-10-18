// ============================================================
//  ДАННЫЕ
// ============================================================
const subjects = {
  biochem: {
    num: "01", title: "Биохимия",
    topics: [
      {
        num: "2.3",
        title: "Коллоквиум. Матричные биосинтезы",
        steps: ["Прочитать основной файл", "Прочитать файл с задачами"],
        date: "2026-10-17",
        files: [
          { name: "БХ_2.3ЗАДАЧИ.pdf", url: "files/biochem/БХ_2.3ЗАДАЧИ.pdf" },
          { name: "БХ_2.3.pdf", url: "files/biochem/БХ_2.3.pdf" }
        ]
      },
{
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

const schedule = {
  "ПН": [
    { time: "8:00–10:25", title: "Микробио", subjectKey: "microbio", room: "239 каб.", teacher: "Бжитских Екатерина Евгеньевна" },
    { time: "10:40–13:05", title: "Биохимия", subjectKey: "biochem", room: "305 каб.", teacher: "Волобой Нина Леонидовна" }
  ],
  "ВТ": [
    { time: "8:00–9:30", title: "ОМиПК", subjectKey: "microbio", subgroups: [{ label: "А", room: "48 каб.", teacher: "Старчикова М.В." }, { label: "Б", room: "43 каб.", teacher: "Кленова А.Ф." }] },
    { time: "9:40–11:10", title: "Биоэтика", subjectKey: "hygiene", subgroups: [{ label: "А", room: "53 каб.", teacher: "Кочетова Ю.Ю." }, { label: "Б", room: "55 каб.", teacher: "Вольферц М.В." }] }
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
//  ВСПОМОГАТЕЛЬНЫЕ
// ============================================================
function findNextLessonDate(subjectKey, fromDate) {
  const dayMap = {
    1: schedule["ПН"] || [], 2: schedule["ВТ"] || [], 3: schedule["СР"] || [],
    4: schedule["ЧТ"] || [], 5: schedule["ПТ"] || []
  };
  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < 60; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    const lessons = dayMap[dow] || [];
    if (!lessons.some(l => l.subjectKey === subjectKey)) continue;

    if (i === 0) {
      const now = new Date();
      const lesson = lessons.find(l => l.subjectKey === subjectKey);
      const parts = lesson.time.split(/[–-]/);
      const endPart = parts[1] ? parts[1].trim() : '';
      const m = endPart.match(/(\d{1,2}):(\d{2})/);
      if (m) {
        const endDate = new Date(d);
        endDate.setHours(parseInt(m[1], 10), parseInt(m[2], 10), 0, 0);
        if (now > endDate) continue;
      }
    }
    return d;
  }
  return null;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Локальная дата в формате YYYY-MM-DD (без UTC-сдвига)
function toDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ---------- ПРОФИЛЬ ----------
  const avatar = document.getElementById('avatar');
    // ---------- БУРГЕР ----------
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle('nav--open');
      burger.classList.toggle('burger--open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    // закрывать меню при клике на пункт
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        burger.classList.remove('burger--open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    // закрывать меню при клике вне шапки
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('nav--open');
        burger.classList.remove('burger--open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const profilePop = document.getElementById('profilePop');
  const profileNameRow = document.getElementById('profileNameRow');
  const profileEdit = document.getElementById('profileEdit');
  const profileNameDisplay = document.getElementById('profileNameDisplay');
  const nameInput = document.getElementById('nameInput');
  const editNameBtn = document.getElementById('editNameBtn');
  const saveNameBtn = document.getElementById('saveNameBtn');
  const greetTitle = document.getElementById('greetTitle');

  let user = JSON.parse(localStorage.getItem('doro.user') || 'null');
function renderProfile() {
  if (user && user.name) {
    avatar.textContent = user.name[0].toUpperCase();
    greetTitle.textContent = `Привет, ${user.name}!`;
    profileNameDisplay.textContent = user.name;
    nameInput.value = user.name;
    profileNameRow.style.display = 'flex';
    profileEdit.style.display = 'none';
  } else {
    avatar.textContent = '?';
    greetTitle.textContent = 'Привет!';
    nameInput.value = '';
    profileNameRow.style.display = 'none';
    profileEdit.style.display = 'flex';
  }
}

  if (avatar && profilePop) {
    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePop.classList.toggle('open');
      renderProfile();
    });
  }

  if (editNameBtn) {
    editNameBtn.addEventListener('click', () => {
      profileNameRow.style.display = 'none';
      profileEdit.style.display = 'flex';
      nameInput.value = user?.name || '';
      nameInput.focus();
    });
  }

  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', () => {
      let val = nameInput.value.trim();
      if (!val) return;
      // Оставляем только первое слово — просто имя
      val = val.split(/\s+/)[0];
      if (!val) return;
      user = { name: val };
      localStorage.setItem('doro.user', JSON.stringify(user));
      nameInput.value = val;
      renderProfile();
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveNameBtn.click();
    });
  }

  document.addEventListener('click', (e) => {
    if (!profilePop || !avatar) return;
    if (profilePop.contains(e.target) || avatar.contains(e.target)) return;
    profilePop.classList.remove('open');
  });

  renderProfile();
  // ---------- ДОМАШНИЕ ЗАДАНИЯ ----------
  const HW_KEY = 'doro.homework';
  let homework = JSON.parse(localStorage.getItem(HW_KEY) || '[]');

  function saveHomework() {
    localStorage.setItem(HW_KEY, JSON.stringify(homework));
  }
  function hwId() {
    return 'hw_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  }
  function getHomeworkFor(subjectKey, dayKey, slot) {
    return homework.filter(h =>
      h.subjectKey === subjectKey &&
      h.dayKey === dayKey &&
      h.slot === slot
    );
  }

  // ---------- ПОИСК И УВЕДОМЛЕНИЯ В ПРОФИЛЕ ----------
  const searchToggle = document.getElementById('searchToggle');
  const searchField = document.getElementById('searchField');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const notifyToggle = document.getElementById('notifyToggle');
  const notifyList = document.getElementById('notifyList');
  const notifyBadge = document.getElementById('notifyBadge');

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

  if (searchToggle && searchField && searchInput && searchResults) {
    searchToggle.addEventListener('click', () => {
      const willOpen = !searchField.classList.contains('is-open');
      searchField.classList.toggle('is-open', willOpen);
      if (willOpen) {
        searchInput.value = '';
        searchResults.innerHTML = '';
        setTimeout(() => searchInput.focus(), 200);
      }
    });

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = '';
      if (!q) return;

      const found = collectAllTopics().filter(t => {
        const hay = (t.title + ' ' + subjects[t.key].title + ' ' + (t.num || '')).toLowerCase();
        return hay.includes(q);
      }).slice(0, 12);

      if (!found.length) {
        searchResults.innerHTML = '<div class="pop-result--empty">Ничего не найдено</div>';
        return;
      }

      found.forEach(t => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pop-result';
        btn.innerHTML = `
          <div class="pop-result__title">${t.num ? t.num + ' · ' : ''}${t.title}</div>
          <div class="pop-result__meta">${subjects[t.key].title}</div>
        `;
        btn.addEventListener('click', () => {
          profilePop.classList.remove('open');
          showView('files');
          setTimeout(() => openSubjectView(t.key, t.num), 50);
        });
        searchResults.appendChild(btn);
      });
    });
  }

  if (notifyToggle && notifyList && notifyBadge) {
    const SEEN_KEY = 'doro.seenTopics';
    const seen = new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'));

    const upcoming = collectAllTopics()
      .filter(t => new Date(t.date).getTime() >= new Date().setHours(0, 0, 0, 0))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 8);

    const topicId = t => `${t.key}:${t.num || t.title}`;

    function updateBadge() {
      const unseen = upcoming.filter(t => !seen.has(topicId(t))).length;
      if (unseen > 0) {
        notifyBadge.textContent = unseen;
        notifyBadge.style.display = 'grid';
      } else {
        notifyBadge.style.display = 'none';
      }
    }
    updateBadge();

    function renderNotifyList() {
      notifyList.innerHTML = '';
      if (!upcoming.length) {
        notifyList.innerHTML = '<div class="notify-item--empty">Пока нет ближайших тем</div>';
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
          seen.add(id);
          localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
          updateBadge();
          profilePop.classList.remove('open');
          showView('files');
          setTimeout(() => openSubjectView(t.key, t.num), 50);
        });
        notifyList.appendChild(btn);
      });
    }

    notifyToggle.addEventListener('click', () => {
      const willOpen = !notifyList.classList.contains('is-open');
      notifyList.classList.toggle('is-open', willOpen);
      if (willOpen) renderNotifyList();
    });
  }

  // ---------- ДАТА ----------
  const greetDate = document.getElementById('greetDate');
  if (greetDate) {
    const now = new Date();
    let dateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    greetDate.textContent = dateStr;
  }

  // ---------- КАЛЕНДАРЬ ----------
  const calendarEl = document.getElementById('calendar');
  const lessonsEl = document.getElementById('lessons');
  const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  let calDate = new Date();
  calDate.setDate(1);
  let selectedDay = null, selectedMonth = null, selectedYear = null;

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

    for (let i = 0; i < startOffset; i++) {
      html += `<button type="button" class="cal-day other" disabled>${daysInPrev - startOffset + i + 1}</button>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = isSameMonth && today.getDate() === d;
      const isSelected = selectedDay === d && selectedMonth === month && selectedYear === year;
      const dateKey = toDateKey(date);
      const hasHw = homework.some(h => h.date === dateKey && !h.done);
      const cls = [
        'cal-day',
        isWeekend ? 'weekend' : '',
        isToday ? 'today' : '',
        isSelected ? 'selected' : '',
        hasHw && !isWeekend ? 'has-hw' : ''
      ].filter(Boolean).join(' ');
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

    calendarEl.querySelectorAll('[data-nav]').forEach(b => {
      b.addEventListener('click', () => {
        calDate.setMonth(calDate.getMonth() + Number(b.dataset.nav));
        renderCalendar();
      });
    });

    calendarEl.querySelectorAll('[data-day]').forEach(b => {
      b.addEventListener('click', () => {
        selectedDay = Number(b.dataset.day);
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

  // ---------- ГЛАВНАЯ: ПАРЫ И ДЗ ----------
  function updateLessonBadge(lessonEl, subjectKey, dayKey, slot) {
    const btn = lessonEl.querySelector('.lesson-hw-btn');
    if (!btn) return;
    const undone = getHomeworkFor(subjectKey, dayKey, slot).filter(h => !h.done).length;
    btn.classList.toggle('has-undone', undone > 0);
    let badge = btn.querySelector('.lesson-hw-badge');
    if (undone > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'lesson-hw-badge';
        btn.appendChild(badge);
      }
      badge.textContent = undone;
    } else if (badge) {
      badge.remove();
    }
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
        const dateStr = lessonDate ? toDateKey(lessonDate) : toDateKey(new Date());
        homework.push({
          id: hwId(),
          subjectKey,
          dayKey,
          slot,
          lessonTitle,
          date: dateStr,
          text,
          done: false,
          createdAt: Date.now()
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
    const titleEl = document.getElementById('today-title');
    const topicsPanel = document.getElementById('topics-panel');
    const topicsList = document.getElementById('topics-list');
    if (!titleEl || !lessonsEl) return;

    let targetDate, isToday = false;

    if (!selectedDay) {
      targetDate = new Date();
      const dow = targetDate.getDay();
      if (dow === 0 || dow === 6) {
        targetDate.setDate(targetDate.getDate() + (dow === 6 ? 2 : 1));
        selectedDay = targetDate.getDate();
        selectedMonth = targetDate.getMonth();
        selectedYear = targetDate.getFullYear();
        renderCalendar();
      } else {
        isToday = true;
      }
    } else {
      targetDate = new Date(selectedYear, selectedMonth, selectedDay);
      const dow = targetDate.getDay();
      if (dow === 0 || dow === 6) {
        const nextMon = new Date(targetDate);
        nextMon.setDate(nextMon.getDate() + (dow === 6 ? 2 : 1));
        targetDate = nextMon;
        selectedDay = targetDate.getDate();
        selectedMonth = targetDate.getMonth();
        selectedYear = targetDate.getFullYear();
        renderCalendar();
      }
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
          const tDate = new Date(t.date);
          tDate.setHours(0, 0, 0, 0);
          const lDate = new Date(targetDate);
          lDate.setHours(0, 0, 0, 0);
          const next = findNextLessonDate(l.subjectKey, tDate);
          if (next && next.getTime() === lDate.getTime()) {
            allTopics.push({ ...t, key: l.subjectKey });
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
      btn.addEventListener('click', () => {
        showView('files');
        setTimeout(() => {
          const card = document.querySelector(`.card[data-subject="${t.key}"]`);
          if (card) {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('is-active'));
            card.classList.add('is-active');
          }
          openSubjectView(t.key, t.num);
        }, 50);
      });
      topicsList.appendChild(btn);
    });
  }

  // ---------- РАЗДЕЛЫ ----------
  const subjectCards = document.getElementById('subject-cards');
  function renderSections() {
    if (!subjectCards) return;
    subjectCards.innerHTML = '';
    Object.keys(subjects)
      .sort((a, b) => subjects[a].title.localeCompare(subjects[b].title, 'ru'))
      .forEach(key => {
        const s = subjects[key];
        if (!s) return;
        const btn = document.createElement('button');
        btn.className = 'card';
        btn.dataset.subject = key;
        btn.innerHTML = `<span class="card__letter">${s.title[0]}</span><span class="card__name">${s.title}</span>`;
        btn.addEventListener('click', () => {
          subjectCards.querySelectorAll('.card').forEach(c => c.classList.remove('is-active'));
          btn.classList.add('is-active');
          openSubjectView(key);
        });
        subjectCards.appendChild(btn);
      });
  }

  // ---------- ОКНО РАЗДЕЛА ----------
  function openSubjectView(key, topicNum = null) {
    const subject = subjects[key];
    if (!subject || !subject.topics.length) return;
    const valid = subject.topics
      .filter(t => t.title !== 'Раздел в разработке')
      .slice()
      .sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const aPast = da < today.getTime();
        const bPast = db < today.getTime();
        if (aPast !== bPast) return aPast ? 1 : -1;
        return aPast ? db - da : da - db;
      });
    if (!valid.length) return;

    let initialIndex = 0;
    if (topicNum) {
      const f = valid.findIndex(t => t.num === topicNum);
      if (f !== -1) initialIndex = f;
    }

    const titleEl = document.getElementById('subject-view-title');
    const bodyEl = document.getElementById('subject-view-body');
    const dotsEl = document.getElementById('modal-dots');
    const placeholder = document.getElementById('subject-placeholder');
    if (!titleEl || !bodyEl || !dotsEl) return;

    titleEl.textContent = subject.title;
    if (placeholder) placeholder.style.display = 'none';

    function renderTopic(i) {
      const t = valid[i];
      bodyEl.innerHTML = `
        <div class="modal__num">${t.num || ''}</div>
        <h4 class="modal__title">${t.title}</h4>
        <div class="modal__prep">
          <div class="modal__prep-title">Для подготовки</div>
          <ol class="modal__steps">${(t.steps || []).map(s => `<li>${s}</li>`).join('')}</ol>
        </div>
        <h4 class="modal__subtitle">Материалы</h4>
        <ul class="modal__files">${(t.files || []).map(f => f.url === '#' ? `<li><span class="mfile disabled">${f.name}</span></li>` : `<li><a href="${f.url}" target="_blank">${f.name}</a></li>`).join('')}</ul>
      `;
      dotsEl.querySelectorAll('.modal__dot').forEach((d, idx) => d.classList.toggle('modal__dot--active', idx === i));
    }

    dotsEl.innerHTML = '';
    if (valid.length > 1) {
      dotsEl.style.display = 'flex';
      valid.forEach((t, i) => {
        const btn = document.createElement('button');
        btn.className = 'modal__dot' + (i === initialIndex ? ' modal__dot--active' : '');
        btn.textContent = t.num || String(i + 1).padStart(2, '0');
        btn.addEventListener('click', () => renderTopic(i));
        dotsEl.appendChild(btn);
      });
    } else {
      dotsEl.style.display = 'none';
    }

    renderTopic(initialIndex);
  }

    function renderTasks() {
    const listEl = document.getElementById('tasksList');
    if (!listEl) return;

    if (!homework.length) {
      listEl.innerHTML = '<div class="tasks-empty">Пока ни одного задания. Добавьте значком у пары на главной.</div>';
      return;
    }

    // Группировка по сохранённой дате
    const groups = new Map();
    homework.forEach(h => {
      if (!h.date) return;
      if (!groups.has(h.date)) {
        groups.set(h.date, { date: new Date(h.date + 'T00:00:00'), items: [] });
      }
      groups.get(h.date).items.push(h);
    });

    if (!groups.size) {
      listEl.innerHTML = '<div class="tasks-empty">Пока ни одного задания. Добавьте значком у пары на главной.</div>';
      return;
    }

    const sortedDates = [...groups.keys()].sort((a, b) => a.localeCompare(b));
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const total = homework.length;
    const done = homework.filter(h => h.done).length;

    listEl.innerHTML = '';

    // Сводка сверху
    const summary = document.createElement('div');
    summary.className = 'tasks-summary';
    summary.innerHTML = `
      <div class="tasks-summary__item">
        <span class="tasks-summary__num">${total - done}</span>
        <span class="tasks-summary__label">не выполнено</span>
      </div>
      <div class="tasks-summary__item">
        <span class="tasks-summary__num">${done}</span>
        <span class="tasks-summary__label">выполнено</span>
      </div>
      <div class="tasks-summary__item">
        <span class="tasks-summary__num">${total}</span>
        <span class="tasks-summary__label">всего</span>
      </div>
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

      // Листик-дата
      block.innerHTML = `
        <div class="tasks-day__date">
          <span class="tasks-day__dow">${dowShort}</span>
          <span class="tasks-day__num">${dayNum}</span>
          <span class="tasks-day__month">${monthShort}</span>
        </div>
        <div class="tasks-day__body">
          <div class="tasks-day__top">
            <span class="tasks-day__label">
              ${isToday ? 'сегодня' : (isTomorrow ? 'завтра' : (isPast ? 'прошедшее' : 'задачи'))}
            </span>
            <span class="tasks-day__count">${undoneCount}/${g.items.length}</span>
          </div>
          <ul class="hw-list"></ul>
        </div>
      `;

      const ul = block.querySelector('.hw-list');
      g.items.forEach(h => {
        const subjTitle = h.lessonTitle
          ? h.lessonTitle
          : (subjects[h.subjectKey] ? subjects[h.subjectKey].title : 'Без предмета');

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
          const item = homework.find(x => x.id === h.id);
          if (!item) return;
          item.done = e.target.checked;
          saveHomework();
          li.classList.toggle('hw-item--done', item.done);
          renderCalendar();
          renderTasks();
          if (rendered.home) updateTodayView();
        });
        li.querySelector('.hw-remove').addEventListener('click', () => {
          homework = homework.filter(x => x.id !== h.id);
          saveHomework();
          renderTasks();
          renderCalendar();
          if (rendered.home) updateTodayView();
        });
        ul.appendChild(li);
      });

      listEl.appendChild(block);
    });
  }

  // ---------- VIEWS ----------
  const views = {
    home:  document.getElementById('view-home'),
    files: document.getElementById('view-files'),
    links: document.getElementById('view-links'),
    tasks: document.getElementById('view-tasks')
  };
  const rendered = { home: false, files: false, links: false, tasks: false };

  function showView(name) {
    Object.values(views).forEach(v => { if (v) v.classList.remove('is-active'); });
    const v = views[name];
    if (!v) return;
    v.classList.add('is-active');

    document.querySelectorAll('.nav a[data-view]').forEach(a => {
      a.classList.toggle('active', a.dataset.view === name);
    });

    if (!rendered[name]) {
      if (name === 'home') { renderCalendar(); updateTodayView(); }
      if (name === 'files') { renderSections(); }
      if (name === 'tasks') { renderTasks(); }
      rendered[name] = true;
    }

    window.scrollTo({ top: 0 });
  }

  document.querySelectorAll('.nav a[data-view]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showView(a.dataset.view);
    });
  });

  document.getElementById('brand-logo').addEventListener('click', (e) => {
    e.preventDefault();
    showView('home');
  });

  // ---------- QR-СИНХРОНИЗАЦИЯ ----------
  const JSONBIN_KEY = '$2a$10$ueLrF0JVSgVVWPZgis5xC.1sLjPqGhq1tWOSypgHXo.HBWRQecrU6';
  const JSONBIN_URL = 'https://api.jsonbin.io/v3/b';

  const qrShowBtn = document.getElementById('qrShowBtn');
  const qrScanBtn = document.getElementById('qrScanBtn');
  const qrShowModal = document.getElementById('qrShowModal');
  const qrScanModal = document.getElementById('qrScanModal');
  const qrCanvas = document.getElementById('qrCanvas');
  const qrVideo = document.getElementById('qrVideo');
  const qrShowClose = document.getElementById('qrShowClose');
  const qrScanClose = document.getElementById('qrScanClose');
  const qrFileInput = document.getElementById('qrFileInput');

  let qrStream = null;
  let qrRafId = null;
  let currentBinId = null;
  let pollAbort = false;
  let pollTimeoutHandle = null;
  let pollActive = false;

  // ---- Кнопки: телефон — только «Сканировать», ПК — только «Показать» ----
  const isPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 860;
  if (isPhone) {
    if (qrShowBtn) qrShowBtn.style.display = 'none';
  } else {
    if (qrScanBtn) qrScanBtn.style.display = 'none';
  }

  function stopPolling() {
    pollActive = false;
    if (pollTimeoutHandle) {
      clearTimeout(pollTimeoutHandle);
      pollTimeoutHandle = null;
    }
  }
  function stopQrScanner() {
    if (qrRafId) cancelAnimationFrame(qrRafId);
    qrRafId = null;
    if (qrStream) { qrStream.getTracks().forEach(t => t.stop()); qrStream = null; }
    if (qrVideo) qrVideo.srcObject = null;
  }
  function randomId() {
    return 'doro_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  async function deleteBin(binId) {
    if (!binId) return;
    try {
      await fetch(`${JSONBIN_URL}/${binId}`, {
        method: 'DELETE',
        headers: { 'X-Master-Key': JSONBIN_KEY }
      });
    } catch (e) { /* ignore */ }
  }

  // ---- Функция опроса с нарастающей задержкой ----
  async function pollBin(binId, onData, onTimeout) {
    const startTime = Date.now();
    const MAX_TOTAL = 15000; // 15 секунд
    const delays = [1000, 2000, 4000, 8000]; // нарастающая задержка
    let step = 0;

    pollActive = true;
    pollAbort = false;

    while (pollActive && !pollAbort) {
      const elapsed = Date.now() - startTime;
      if (elapsed > MAX_TOTAL) {
        pollActive = false;
        if (onTimeout) onTimeout();
        return;
      }

      try {
        const r = await fetch(`${JSONBIN_URL}/${binId}/latest`, {
          headers: { 'X-Master-Key': JSONBIN_KEY }
        });
        if (r.ok) {
          const j = await r.json();
          const rec = j.record;
          if (rec && rec.t === 'doro-hw' && Array.isArray(rec.hw)) {
            pollActive = false;
            onData(rec);
            return;
          }
        }
      } catch (e) { /* продолжим */ }

      // Ждём с нарастающей задержкой
      const delay = delays[Math.min(step, delays.length - 1)];
      step++;
      await new Promise(res => {
        pollTimeoutHandle = setTimeout(res, delay);
      });
    }
  }

  // ---- Пауза опроса, когда вкладка неактивна ----
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Вкладка ушла в фон — не опрашиваем
      if (pollTimeoutHandle) clearTimeout(pollTimeoutHandle);
      pollTimeoutHandle = null;
    } else if (pollActive && currentBinId) {
      // Вернулись — продолжаем с обычной задержкой
      // (просто цикл продолжится сам, т.к. мы остановили только setTimeout)
    }
  });

  // ===== ПК: показать QR — принять данные =====
  if (qrShowBtn && qrShowModal && qrCanvas) {
    qrShowBtn.addEventListener('click', async () => {
      const sessionId = randomId();
      qrCanvas.innerHTML = '<div style="padding:30px;color:#5a6678;font-size:13px;">Создаю сессию…</div>';
      qrShowModal.classList.add('open');

      let binId = null;
      try {
        const res = await fetch(JSONBIN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_KEY,
            'X-Bin-Name': 'session_' + sessionId,
            'X-Bin-Private': 'true'
          },
          body: JSON.stringify({ t: 'doro-session', sid: sessionId, ready: false })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        binId = json.metadata.id;
        currentBinId = binId;
      } catch (e) {
        qrCanvas.innerHTML = '<div style="padding:30px;color:#b91c1c;font-size:13px;">Ошибка создания сессии: ' + e.message + '</div>';
        return;
      }

      const qrPayload = JSON.stringify({ t: 'doro-recv', bin: binId, sid: sessionId });
      qrCanvas.innerHTML = '';
      try {
        new QRCode(qrCanvas, {
          text: qrPayload,
          width: 320,
          height: 320,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (err) {
        alert('Ошибка генерации QR: ' + err.message);
      }

      // Опрос с нарастающей задержкой и таймаутом 15 секунд
      pollBin(
        binId,
        (rec) => {
          qrShowModal.classList.remove('open');
          applyIncoming(rec);
        },
        () => {
          // По таймауту: меняем подсказку
          const hint = qrShowModal.querySelector('.qr-modal__sub');
          if (hint) hint.textContent = 'Время ожидания истекло. Нажмите «Показать QR» ещё раз.';
        }
      );
    });
  }

  if (qrShowClose) {
    qrShowClose.addEventListener('click', () => {
      qrShowModal.classList.remove('open');
      stopPolling();
    });
  }
  if (qrShowModal) {
    qrShowModal.addEventListener('click', (e) => {
      if (e.target === qrShowModal) { qrShowModal.classList.remove('open'); stopPolling(); }
    });
  }

  // ===== Телефон: сканировать QR — отдать данные =====
  async function sendToBin(binId, payload) {
    try {
      const res = await fetch(`${JSONBIN_URL}/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_KEY
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return true;
    } catch (e) {
      alert('Не удалось отправить данные: ' + e.message);
      return false;
    }
  }

  async function scanAndSend(text) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.t !== 'doro-recv' || !parsed.bin) {
        alert('Это не QR от doro.');
        return;
      }
      if (!homework.length) {
        alert('У вас нет заданий для отправки.');
        return;
      }
      const payload = {
        t: 'doro-hw',
        v: 1,
        user: user?.name || null,
        sid: parsed.sid,
        hw: homework.map(h => ({
          id: h.id, s: h.subjectKey, d: h.dayKey, sl: h.slot,
          lt: h.lessonTitle || null, dt: h.date, tx: h.text, dn: h.done
        }))
      };
      const ok = await sendToBin(parsed.bin, payload);
      if (ok) {
        alert('Отправлено заданий: ' + homework.length + '. ПК получит их в течение пары секунд.');
        qrScanModal.classList.remove('open');
      }
    } catch (e) {
      alert('Не удалось разобрать QR: ' + e.message);
    }
  }

  if (qrScanBtn && qrScanModal && qrVideo) {
    qrScanBtn.addEventListener('click', async () => {
      qrScanModal.classList.add('open');
      try {
        qrStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        qrVideo.srcObject = qrStream;
        await qrVideo.play();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        function tick() {
          if (!qrVideo.videoWidth) { qrRafId = requestAnimationFrame(tick); return; }
          canvas.width = qrVideo.videoWidth;
          canvas.height = qrVideo.videoHeight;
          ctx.drawImage(qrVideo, 0, 0, canvas.width, canvas.height);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (window.jsQR) {
            const code = jsQR(imgData.data, canvas.width, canvas.height);
            if (code && code.data) {
              stopQrScanner();
              scanAndSend(code.data);
              return;
            }
          }
          qrRafId = requestAnimationFrame(tick);
        }
        tick();
      } catch (err) {
        alert('Не удалось получить доступ к камере: ' + err.message);
        qrScanModal.classList.remove('open');
        stopQrScanner();
      }
    });
  }

  if (qrFileInput) {
    qrFileInput.addEventListener('change', () => {
      const file = qrFileInput.files[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (window.jsQR) {
          const code = jsQR(data.data, canvas.width, canvas.height);
          if (code && code.data) {
            scanAndSend(code.data);
          } else {
            alert('QR не распознан.');
          }
        }
        qrFileInput.value = '';
      };
      img.src = URL.createObjectURL(file);
    });
  }

  if (qrScanClose) {
    qrScanClose.addEventListener('click', () => {
      qrScanModal.classList.remove('open');
      stopQrScanner();
    });
  }
  if (qrScanModal) {
    qrScanModal.addEventListener('click', (e) => {
      if (e.target === qrScanModal) { qrScanModal.classList.remove('open'); stopQrScanner(); }
    });
  }

  // ---- Принять данные и удалить ящик ----
  function applyIncoming(data) {
    if (currentBinId) {
      deleteBin(currentBinId);
      currentBinId = null;
    }

    const current = JSON.parse(localStorage.getItem('doro.homework') || '[]');
    const byId = new Map(current.map(h => [h.id, h]));
    let added = 0;
    data.hw.forEach(h => {
      const mapped = {
        id: h.id, subjectKey: h.s, dayKey: h.d, slot: h.sl,
        lessonTitle: h.lt, date: h.dt, text: h.tx, done: !!h.dn,
        createdAt: Date.now()
      };
      if (!byId.has(mapped.id)) { byId.set(mapped.id, mapped); added++; }
    });
    localStorage.setItem('doro.homework', JSON.stringify([...byId.values()]));
    homework = JSON.parse(localStorage.getItem('doro.homework'));
    saveHomework();
    renderTasks();
    renderCalendar();
    if (rendered.home) updateTodayView();
    alert('Получено заданий: ' + added);
  }

  showView('home');
});