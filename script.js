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
    { time: "8:00–10:25", title: "Микробио", subjectKey: "microbio", room: "239 каб.", teacher: "Тимонов Андрей Викторович" },
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
//  ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // --- БУРГЕР ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
  }

  // --- ПРОФИЛЬ ---
  const avatar = document.getElementById('avatar');
  const profilePop = document.getElementById('profilePop');
  const profileView = document.getElementById('profileView');
  const profileEdit = document.getElementById('profileEdit');
  const profileNameDisplay = document.getElementById('profileNameDisplay');
  const nameInput = document.getElementById('nameInput');
  const editNameBtn = document.getElementById('editNameBtn');
  const saveNameBtn = document.getElementById('saveNameBtn');
  const greetTitle = document.getElementById('greetTitle');

  let user = JSON.parse(localStorage.getItem('doro.user') || 'null');

  function renderProfile() {
    if (user && user.name) {
      avatar.textContent = user.name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').slice(0, 2).join('');
      greetTitle.textContent = `Привет, ${user.name.trim().split(/\s+/)[0]}!`;
      profileNameDisplay.textContent = user.name;
      profileView.style.display = 'flex';
      profileEdit.style.display = 'none';
    } else {
      avatar.textContent = '?';
      greetTitle.textContent = 'Привет!';
      profileView.style.display = 'none';
      profileEdit.style.display = 'flex';
    }

    // Если имени нет — автоматически открываем поповер при первом заходе
      if (!user || !user.name) {
        if (avatar && profilePop) {
          // Небольшая задержка, чтобы шапка успела отрисоваться
          setTimeout(() => {
            profilePop.classList.add('open');
            renderProfile();
            if (nameInput) nameInput.focus();
          }, 300);
        }
      }
    }

  // Открытие/закрытие поповера
  if (avatar && profilePop) {
    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePop.classList.toggle('open');
      renderProfile();
    });
  }

  // Кнопка "Изменить"
  if (editNameBtn) {
    editNameBtn.addEventListener('click', () => {
      profileView.style.display = 'none';
      profileEdit.style.display = 'flex';
      nameInput.value = user?.name || '';
      nameInput.focus();
    });
  }

  // Сохранение
  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', () => {
      const val = nameInput.value.trim();
      if (!val) return;
      user = { name: val };
      localStorage.setItem('doro.user', JSON.stringify(user));
      renderProfile();
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveNameBtn.click();
    });
  }

  // Закрытие при клике вне поповера
  document.addEventListener('click', (e) => {
    if (!profilePop || !avatar) return;
    if (profilePop.contains(e.target) || avatar.contains(e.target)) return;
    profilePop.classList.remove('open');
  });

  renderProfile();

  // --- ДАТА ---
  const greetDate = document.getElementById('greetDate');
  if (greetDate) {
    const now = new Date();
    let dateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    greetDate.textContent = dateStr;
  }

  // --- КАЛЕНДАРЬ И ПАРЫ ---
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

    let html = `<div class="cal-head"><span class="cal-month">${MONTHS[month]} ${year}</span><div class="cal-nav"><button data-nav="-1">‹</button><button data-nav="1">›</button></div></div><div class="cal-grid">${DOW.map(d => `<div class="cal-dow">${d}</div>`).join('')}`;

    for (let i = 0; i < startOffset; i++) html += `<button type="button" class="cal-day other" disabled>${daysInPrev - startOffset + i + 1}</button>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = isSameMonth && today.getDate() === d;
      const isSelected = selectedDay === d && selectedMonth === month && selectedYear === year;
      const cls = ['cal-day', isWeekend ? 'weekend' : '', isToday ? 'today' : '', isSelected ? 'selected' : ''].filter(Boolean).join(' ');
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
      selectedDay = Number(b.dataset.day);
      selectedMonth = month;
      selectedYear = year;
      if (isSameMonth && today.getDate() === selectedDay) { selectedDay = null; selectedMonth = null; selectedYear = null; }
      renderCalendar();
      updateTodayView();
    }));
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

    const daysOfWeek = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
    titleEl.textContent = isToday ? 'Сегодня' : 'На ' + daysOfWeek[targetDate.getDay()];

    const dayKey = ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'][targetDate.getDay()];
    const daySchedule = schedule[dayKey] || [];

    lessonsEl.innerHTML = '';
    const allTopics = [];

    if (!daySchedule.length) {
      lessonsEl.innerHTML = '<div class="lesson"><div class="lesson-head">В этот день пар нет</div></div>';
      if (topicsPanel) topicsPanel.style.display = 'none';
      return;
    }

    daySchedule.forEach(l => {
      const div = document.createElement('div');
      div.className = 'lesson';
      let details = '';
      if (l.room) details += l.room + ' · ';
      if (l.teacher) details += l.teacher;
      if (l.subgroups) details = 'Разделение на подгруппы';
      div.innerHTML = `<div class="lesson-head"><time>${l.time}</time><div style="flex:1"><div class="lesson-title">${l.title}</div><div class="lesson-details">${details}</div></div></div>`;
      lessonsEl.appendChild(div);

        
            if (subjects[l.subjectKey]) {
        subjects[l.subjectKey].topics.forEach(t => {
          if (t.title === 'Раздел в разработке') return;
          const tDate = new Date(t.date);
          tDate.setHours(0, 0, 0, 0);
          const lDate = new Date(targetDate);
          lDate.setHours(0, 0, 0, 0);

          // Если тема добавлена ПОСЛЕ этой пары — она к ней не относится
          if (tDate > lDate) return;

          // Находим, к какой паре по этому предмету тема относится
          const nextLessonDate = findNextLessonDate(l.subjectKey, tDate);

          // Тема показывается только если ближайшая пара по предмету — это именно сегодня
          if (nextLessonDate && nextLessonDate.getTime() === lDate.getTime()) {
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
      btn.addEventListener('click', () => openSubjectView(t.key, t.num));
      topicsList.appendChild(btn);
    });
  }

  // --- РАЗДЕЛЫ ---
  const subjectCards = document.getElementById('subject-cards');
  function renderSections() {
    if (!subjectCards) return;
    subjectCards.innerHTML = '';
    const order = ['biochem','physio','histology','microbio','hygiene'];
    order.forEach(key => {
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

  // --- ОКНО РАЗДЕЛА ---
  function openSubjectView(key, topicNum = null) {
    const subject = subjects[key];
    if (!subject || !subject.topics.length) return;
    const valid = subject.topics.filter(t => t.title !== 'Раздел в разработке');
    if (!valid.length) return;

    let initialIndex = 0;
    if (topicNum) {
      const found = valid.findIndex(t => t.num === topicNum);
      if (found !== -1) initialIndex = found;
    }

    const viewSection = document.getElementById('subject-view');
    const titleEl = document.getElementById('subject-view-title');
    const bodyEl = document.getElementById('subject-view-body');
    const dotsEl = document.getElementById('modal-dots');
    const placeholder = document.getElementById('subject-placeholder');
    if (!titleEl || !bodyEl || !dotsEl || !viewSection) return;

    titleEl.textContent = subject.title;
    if (placeholder) placeholder.style.display = 'none';

    function renderTopic(index) {
      const t = valid[index];
      bodyEl.innerHTML = `
        <div class="modal__num">${t.num || ''}</div>
        <h4 class="modal__title">${t.title}</h4>
        <div class="modal__prep">
          <div class="modal__prep-title">Для подготовки</div>
          <ol class="modal__steps">${(t.steps||[]).map(s=>`<li>${s}</li>`).join('')}</ol>
        </div>
        <h4 class="modal__subtitle">Материалы</h4>
        <ul class="modal__files">${(t.files||[]).map(f=>f.url==='#'?`<li><span class="mfile disabled">${f.name}</span></li>`:`<li><a href="${f.url}" target="_blank">${f.name}</a></li>`).join('')}</ul>
      `;
      dotsEl.querySelectorAll('.modal__dot').forEach((d,i)=>d.classList.toggle('modal__dot--active', i===index));
    }

    dotsEl.innerHTML = '';
    if (valid.length > 1) {
      dotsEl.style.display = 'flex';
      valid.forEach((t,i) => {
        const btn = document.createElement('button');
        btn.className = 'modal__dot' + (i===initialIndex?' modal__dot--active':'');
        btn.textContent = t.num || String(i+1).padStart(2,'0');
        btn.addEventListener('click', () => renderTopic(i));
        dotsEl.appendChild(btn);
      });
    } else {
      dotsEl.style.display = 'none';
    }

    renderTopic(initialIndex);
    setTimeout(() => {
      const y = viewSection.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 50);
  }

  // --- ИНИЦИАЛИЗАЦИЯ ---
  renderCalendar();
  updateTodayView();
  renderSections();

  // Клик по лого наверх
  const brandLogo = document.getElementById('brand-logo');
  if (brandLogo) brandLogo.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Подсветка меню
  const brand = document.getElementById('brand-logo');
  const navLinks = document.querySelectorAll('.nav a');
  const sections = [
    { el: document.querySelector('.today'), link: brand },
    { el: document.querySelector('#files'), link: document.querySelector('.nav a[href="#files"]') },
    { el: document.querySelector('#links'), link: document.querySelector('.nav a[href="#links"]') }
  ];

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        brand.classList.remove('active');
        navLinks.forEach(l => l.classList.remove('active'));
        const found = sections.find(s => s.el === entry.target);
        if (found && found.link) found.link.classList.add('active');
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

  sections.forEach(s => { if (s.el) navObserver.observe(s.el); });

  // Сжатие шапки
  const islandHeader = document.getElementById('island');
  if (islandHeader) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          islandHeader.classList.toggle('compact', window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});

// Находит ближайшую дату (день), когда есть пара по данному предмету,
// начиная с даты темы (включая саму дату темы).
// Учитывает только рабочие дни (ПН–ПТ).
function findNextLessonDate(subjectKey, fromDate) {
  const dayMap = {
    1: schedule["ПН"] || [],
    2: schedule["ВТ"] || [],
    3: schedule["СР"] || [],
    4: schedule["ЧТ"] || [],
    5: schedule["ПТ"] || []
  };

  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < 60; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;

    const lessons = dayMap[dow] || [];
    const hasLesson = lessons.some(l => l.subjectKey === subjectKey);
    if (hasLesson) return d;
  }

  return null;
}