/* ============================================================
   tour.js — интерактивное обучение по всему сайту doro
   ============================================================ */
(function () {
  'use strict';

  const TOUR_KEY = 'doro.tour.v1';
  const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

  /* ---------- Шаги ----------
     action — если указан, шаг не листается кнопкой:
              пользователь ОБЯЗАН кликнуть по элементу.
     afterAction — что сделать после клика (напр., дождаться рендера).
  */
  const STEPS = [
    /* ========== ГЛАВНАЯ ========== */
    {
      selector: '#brand-logo',
      title: 'Это doro',
      text: 'Твой личный помощник по учёбе. Сейчас пройдёмся по всему сайту — от главной до читалки.',
      place: 'bottom', padding: 6, radius: 999,
    },
    {
      selector: '#greetTitle',
      title: 'Приветствие',
      text: 'Меняется от темы и времени суток. В тёмной теме — дерзкое, в светлой — спокойное.',
      place: 'bottom', padding: 10, radius: 16,
    },
    {
      selector: '#lessons',
      title: 'Пары на день',
      text: 'Расписание подстраивается под день. У каждой пары есть кнопка — можно быстро записать задание.',
      place: 'bottom', padding: 12, radius: 24,
    },
    {
      selector: '#calendar',
      title: 'Календарь',
      text: 'Дни с темами подсвечены. Коллоквиумы — ярче. Точка внизу — есть невыполненное задание.',
      place: 'left', padding: 12, radius: 24,
    },

    /* ========== РАЗДЕЛЫ ========== */
    {
      selector: '.nav a[data-view="files"]',
      title: 'Разделы',
      text: 'Жми «Разделы» — откроются все предметы.',
      place: 'bottom', padding: 4, radius: 999,
      desktopOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 400)),
    },
    {
      selector: '#burger',
      title: 'Меню',
      text: 'На телефоне навигация прячется за этой кнопкой. Нажми — откроется меню.',
      place: 'bottom', padding: 6, radius: 999,
      mobileOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 600)),
    },
    {
      selector: '.nav-island[data-view="files"]',
      title: 'Разделы',
      text: 'Жми «Разделы» — откроются все предметы.',
      place: 'top', padding: 6, radius: 999,
      mobileOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 500)),
    },
    {
      selector: '.subjects-cards',
      title: 'Карточки предметов',
      text: 'Карточка открывает самую актуальную тему. Цифра — сколько тем уже есть. Нажми на любую.',
      place: 'bottom', padding: 14, radius: 28,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 900)),
    },

    /* ========== ЧИТАЛКА ========== */
    {
      selector: '#reader-article .reader__content',
      title: 'Текст темы',
      text: 'Заголовки, списки, таблицы — всё поддерживается. Можно выделять и копировать до 15 строк.',
      place: 'bottom', padding: 16, radius: 20,
    },
    {
      selector: '#readerMenuBtn',
      title: 'Настройки чтения',
      text: 'Жми на шестерёнку — откроется меню: размер шрифта, режим «на паре», тема и все темы предмета.',
      place: 'left', padding: 6, radius: 999,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 500)),
    },
    {
      selector: '#fontRange',
      title: 'Размер шрифта',
      text: 'Ползунок меняет размер. Попробуй подёргать — он живой.',
      place: 'bottom', padding: 10, radius: 16,
    },
    {
      selector: '.rs-mode__btn[data-readmode="class"]',
      title: 'Режим «на паре»',
      text: 'Компактно и узкие отступы — чтобы конспект влезал на экран.',
      place: 'bottom', padding: 8, radius: 16,
    },
    {
      selector: '#readerSettingsClose',
      title: 'Закрыть настройки',
      text: 'Нажми на крестик, чтобы вернуться к чтению.',
      place: 'left', padding: 6, radius: 999,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 300)),
    },
    {
      selector: '#readerBack',
      title: 'Назад к разделам',
      text: 'Жми стрелку — вернёшься к списку предметов.',
      place: 'right', padding: 6, radius: 999,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 300)),
    },

    /* ========== ЗАДАНИЯ ========== */
    {
      selector: '.nav a[data-view="tasks"]',
      title: 'Задания',
      text: 'Все задания из пар собираются здесь. Жми — откроем раздел.',
      place: 'bottom', padding: 4, radius: 999,
      desktopOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 400)),
    },
    {
      selector: '#burger',
      title: 'Меню',
      text: 'Открой меню — выберем «Задания».',
      place: 'bottom', padding: 6, radius: 999,
      mobileOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 600)),
    },
    {
      selector: '.nav-island[data-view="tasks"]',
      title: 'Задания',
      text: 'Жми «Задания» в меню.',
      place: 'top', padding: 6, radius: 999,
      mobileOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 500)),
    },
    {
      selector: '#tasksList',
      title: 'Список заданий',
      text: 'Задания по дням, с чекбоксами и счётчиком. Добавляются значком у пары на главной.',
      place: 'top', padding: 12, radius: 20,
    },

    /* ========== ССЫЛКИ ========== */
    {
      selector: '.nav a[data-view="links"]',
      title: 'Ссылки',
      text: 'ЛК, Moodle, баллы, лекции — всё под рукой. Жми.',
      place: 'bottom', padding: 4, radius: 999,
      desktopOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 400)),
    },
    {
      selector: '#burger',
      title: 'Меню',
      text: 'Открой меню — выберем «Ссылки».',
      place: 'bottom', padding: 6, radius: 999,
      mobileOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 600)),
    },
    {
      selector: '.nav-island[data-view="links"]',
      title: 'Ссылки',
      text: 'Жми «Ссылки» в меню.',
      place: 'top', padding: 6, radius: 999,
      mobileOnly: true,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 500)),
    },
    {
      selector: '.links-grid',
      title: 'Полезные ссылки',
      text: 'Быстрый переход на нужные сайты. Открываются в новой вкладке.',
      place: 'bottom', padding: 12, radius: 20,
    },

    /* ========== ПРОФИЛЬ ========== */
    {
      selector: '#avatar',
      title: 'Профиль',
      text: 'Имя, статус, группа и цвет аватарки. Жми на аватарку — откроем профиль.',
      place: 'bottom', padding: 6, radius: 999,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 500)),
    },
    {
      selector: '.profile-card',
      title: 'Твоя карточка',
      text: 'Имя, статус, группа. Кнопка справа сверху — редактировать профиль.',
      place: 'bottom', padding: 12, radius: 28,
    },
    {
      selector: '#editProfileBtn',
      title: 'Редактировать',
      text: 'Жми — откроется шторка с настройками. Попробуй.',
      place: 'left', padding: 6, radius: 999,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 500)),
    },
    {
      selector: '#nameInput',
      title: 'Имя',
      text: 'Здесь можно поменять имя. Статус и группа — рядом.',
      place: 'bottom', padding: 8, radius: 16,
    },
    {
      selector: '#avatarPalette',
      title: 'Цвет аватарки',
      text: 'Выбери цвет — он применится сразу.',
      place: 'top', padding: 8, radius: 16,
    },
    {
      selector: '#profileSheetClose',
      title: 'Закрыть редактирование',
      text: 'Жми крестик — вернёшься к профилю.',
      place: 'left', padding: 6, radius: 999,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 300)),
    },
    {
      selector: '#tileUsers',
      title: 'Пользователи',
      text: 'Список всех, кто пользуется doro. Жми — откроем.',
      place: 'bottom', padding: 10, radius: 20,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 600)),
    },
    {
      selector: '#panelUsers',
      title: 'Список пользователей',
      text: 'Редакторы разделов — отдельно, остальные — по группам.',
      place: 'top', padding: 12, radius: 22,
    },
    {
      selector: '#tileLectures',
      title: 'Лекции',
      text: 'Ближайшие лекции по предметам. Жми — увидишь.',
      place: 'bottom', padding: 10, radius: 20,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 400)),
    },
    {
      selector: '#panelLectures',
      title: 'Ближайшие лекции',
      text: 'Дата, время и через сколько дней.',
      place: 'top', padding: 12, radius: 22,
    },
    {
      selector: '#tileNotify',
      title: 'Уведомления',
      text: 'Новые темы и крупные обновления. Жми — откроем.',
      place: 'bottom', padding: 10, radius: 20,
      action: 'click',
      afterAction: () => new Promise(r => setTimeout(r, 400)),
    },
    {
      selector: '#panelNotify',
      title: 'Уведомления',
      text: 'Крупные обновления сверху, новые темы снизу. Клик по теме — открывает её.',
      place: 'top', padding: 12, radius: 22,
    },
    {
      selector: '#tileTheme',
      title: 'Тема',
      text: 'Авто / светлая / тёмная. Жми — переключим.',
      place: 'bottom', padding: 10, radius: 20,
    },
    {
      selector: '#tileTour',
      title: 'Обучение',
      text: 'Если что-то забыл — жми сюда. Тур всегда можно пройти заново.',
      place: 'bottom', padding: 10, radius: 20,
    },
    {
      selector: '.profile-card__quick',
      title: 'Быстрые действия',
      text: 'QR для переноса заданий с телефона на ПК и обратно, плюс архив.',
      place: 'bottom', padding: 10, radius: 20,
    },

    /* ========== ФИНАЛ ========== */
    {
      selector: '#brand-logo',
      title: 'Готово!',
      text: 'Ты прошёл обучение.',
      place: 'bottom', padding: 6, radius: 999,
      isFinal: true,
    },
  ];

  /* ---------- DOM ---------- */
  let root, backdrop, spot, tip, counterEl, titleEl, textEl, hintEl;
  let currentIndex = -1;
  let activeSteps = [];
  let isOpen = false;
  let actionHandler = null;
    let actionTarget = null;
  function cleanupAction() {
    if (actionTarget && actionHandler) {
      actionTarget.removeEventListener('click', actionHandler, true);
    }
    actionTarget = null;
    actionHandler = null;
  }

  function buildDom() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'tour';
    root.setAttribute('aria-hidden', 'true');

    backdrop = document.createElement('div');
    backdrop.className = 'tour__backdrop';

    spot = document.createElement('div');
    spot.className = 'tour__spot';
    spot.style.display = 'none';

    tip = document.createElement('div');
    tip.className = 'tour__tip';
    tip.setAttribute('role', 'dialog');
    tip.setAttribute('aria-modal', 'true');
    tip.innerHTML = `
      <div class="tour__head">
        <span class="tour__counter"></span>
        <span class="tour__hint"></span>
      </div>
      <h3 class="tour__title"></h3>
      <p class="tour__text"></p>
    `;
    root.appendChild(backdrop);
    root.appendChild(spot);
    root.appendChild(tip);
    document.body.appendChild(root);

    counterEl = tip.querySelector('.tour__counter');
    titleEl   = tip.querySelector('.tour__title');
    textEl    = tip.querySelector('.tour__text');
    hintEl    = tip.querySelector('.tour__hint');

    /* клик по фону ничего не делает (закрыть нельзя) */
    backdrop.addEventListener('click', (e) => { e.stopPropagation(); });

    /* запрет Esc */
    document.addEventListener('keydown', onKey, true);

    window.addEventListener('resize', () => { if (isOpen) positionCurrent(); });
    window.addEventListener('scroll', () => { if (isOpen) positionCurrent(); }, { passive: true });
  }

  function onKey(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Enter') {
      e.preventDefault(); e.stopPropagation();
    }
  }

  /* ---------- Логика ---------- */
  function filterSteps() {
    return STEPS.filter(s => {
      if (s.mobileOnly && !isMobile()) return false;
      if (s.desktopOnly && isMobile()) return false;
      return true;
    });
  }

  function resolveSelector(sel) {
    if (!sel) return null;
    try {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return null;
      return el;
    } catch (e) { return null; }
  }

  async function start(force) {
    if (!force && localStorage.getItem(TOUR_KEY) === 'done') return;
    buildDom();
    activeSteps = filterSteps();
    currentIndex = -1;
    isOpen = true;
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    await goTo(0);
  }

  function finish() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('is-open');
    root.classList.remove('has-spot');
    root.setAttribute('aria-hidden', 'true');
    spot.style.display = 'none';
    document.body.style.overflow = '';
    localStorage.setItem(TOUR_KEY, 'done');
    document.removeEventListener('keydown', onKey, true);
    cleanupAction();
  }

  async function goTo(index) {
    if (index < 0) index = 0;
    if (index >= activeSteps.length) { finish(); return; }

    const step = activeSteps[index];

    cleanupAction();

    /* элемент */
    let el = resolveSelector(step.selector);
    let attempts = 0;
    while (!el && attempts < 5) {
      await new Promise(r => setTimeout(r, 150));
      el = resolveSelector(step.selector);
      attempts++;
    }
    if (!el) {
      if (index + 1 < activeSteps.length) return goTo(index + 1);
      return finish();
    }
    /* прокрутка */
    const rect = el.getBoundingClientRect();
    const isMobileView = window.matchMedia('(max-width: 860px)').matches;
    const topLimit = isMobileView ? 100 : 80;      // запас под шапку
    const bottomLimit = isMobileView ? 180 : 120;  // запас под тултип снизу
    if (rect.top < topLimit || rect.bottom > window.innerHeight - bottomLimit) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      await new Promise(r => setTimeout(r, 450));
    }

    currentIndex = index;
    renderStep(step, el);
  }
  function renderStep(step, el) {
    const total = activeSteps.length;
    counterEl.textContent = `${currentIndex + 1} / ${total}`;
    titleEl.textContent = step.title;
    textEl.textContent = step.text;

    const isFinal = !!step.isFinal;
    hintEl.textContent = isFinal ? '' : 'нажми на элемент';

    /* подсветка */
    const padding = step.padding ?? 8;
    const radius = step.radius ?? 16;
    const rect = el.getBoundingClientRect();
    const sTop    = rect.top    - padding;
    const sLeft   = rect.left   - padding;
    const sWidth  = rect.width  + padding * 2;
    const sHeight = rect.height + padding * 2;

    spot.style.display = 'block';
    spot.style.top    = sTop + 'px';
    spot.style.left   = sLeft + 'px';
    spot.style.width  = sWidth + 'px';
    spot.style.height = sHeight + 'px';
    spot.style.borderRadius = radius + 'px';
    root.classList.add('has-spot');

    if (isFinal) {
      cleanupAction();
      /* Финальный шаг: клик по логотипу закрывает тур */
      actionTarget = el;
      actionHandler = async () => {
        cleanupAction();
        finish();
      };
      el.addEventListener('click', actionHandler, true);
    } else {
      /* Вешаем нативный слушатель на сам элемент. Клик пользователя
         отрабатывает штатно (навигация, шторки, темы, что угодно),
         а мы дополнительно переходим на следующий шаг. */
      actionTarget = el;
      actionHandler = async (ev) => {
        /* НЕ мешаем стандартному поведению — просто ждём кадр,
           чтобы переход/открытие успели примениться */
        if (step.afterAction) { try { await step.afterAction(); } catch (e) {} }
        await new Promise(r => setTimeout(r, 200));

        cleanupAction();

        if (currentIndex + 1 < activeSteps.length) goTo(currentIndex + 1);
        else finish();
      };
      /* capture: true — чтобы сработать до внутренних обработчиков,
         но не preventDefault, чтобы клик отработал по элементу как обычно */
      el.addEventListener('click', actionHandler, true);
    }

    placeTip(step.place || 'auto', el, step);
  }
  function positionCurrent() {
    if (!isOpen || currentIndex < 0) return;
    const step = activeSteps[currentIndex];
    if (!step) return;
    const el = resolveSelector(step.selector);
    if (!el) return;
    const padding = step.padding ?? 8;
    const rect = el.getBoundingClientRect();
    spot.style.top    = (rect.top    - padding) + 'px';
    spot.style.left   = (rect.left   - padding) + 'px';
    spot.style.width  = (rect.width  + padding * 2) + 'px';
    spot.style.height = (rect.height + padding * 2) + 'px';
    placeTip(step.place || 'auto', el, step);
  }

  function placeTip(place, el, step) {
    tip.dataset.place = '';
    tip.style.top = '';
    tip.style.left = '';

    tip.style.visibility = 'hidden';
    tip.style.display = 'block';
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    tip.style.visibility = '';

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 16;
    const margin = 12;

    const canRight  = rect.right + gap + tw + margin <= vw;
    const canLeft   = rect.left  - gap - tw - margin >= 0;
    const canBottom = rect.bottom + gap + th + margin <= vh;
    const canTop    = rect.top   - gap - th - margin >= 0;

    let use = place;
    if (use === 'auto' || (use === 'right' && !canRight) || (use === 'left' && !canLeft)
        || (use === 'bottom' && !canBottom) || (use === 'top' && !canTop)) {
      if (canBottom) use = 'bottom';
      else if (canTop) use = 'top';
      else if (canRight) use = 'right';
      else if (canLeft) use = 'left';
      else use = 'bottom';
    }
    tip.dataset.place = use;

    /* На мобиле — центрируем тултип по горизонтали, чтобы не прилипал к краю */
    if (isMobile()) {
      if (use === 'bottom' || use === 'top') {
        left = Math.max(margin, Math.min(
          rect.left + rect.width / 2 - tw / 2,
          vw - tw - margin
        ));
        if (use === 'bottom') top = rect.bottom + gap;
        else top = rect.top - th - gap;
        tip.style.left = left + 'px';
        tip.style.top  = Math.max(margin, Math.min(top, vh - th - margin)) + 'px';
        tip.style.animation = 'none';
        void tip.offsetWidth;
        tip.style.animation = '';
        return;
      }
    }
    tip.dataset.place = use;

    let top = 0, left = 0;
    if (use === 'bottom')      { top = rect.bottom + gap; left = rect.left; }
    else if (use === 'top')    { top = rect.top - th - gap; left = rect.left; }
    else if (use === 'right')  { top = rect.top; left = rect.right + gap; }
    else if (use === 'left')   { top = rect.top; left = rect.left - tw - gap; }

    left = Math.max(margin, Math.min(left, vw - tw - margin));
    top  = Math.max(margin, Math.min(top, vh - th - margin));

    tip.style.left = left + 'px';
    tip.style.top  = top + 'px';

    tip.style.animation = 'none';
    void tip.offsetWidth;
    tip.style.animation = '';
  }

  /* ---------- Публичный API ---------- */
  window.doroTour = {
    start: () => start(true),
    reset: () => { localStorage.removeItem(TOUR_KEY); },
  };

  /* ---------- Автозапуск ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const tryStart = () => {
      const onboard = document.getElementById('onboard');
      const groupModal = document.getElementById('groupRequiredModal');
      const onboardOpen = onboard && onboard.classList.contains('is-open');
      const groupOpen = groupModal && groupModal.classList.contains('is-open');
      if (onboardOpen || groupOpen) { setTimeout(tryStart, 600); return; }
      const user = JSON.parse(localStorage.getItem('doro.user') || 'null');
      if (!user || !user.name) { setTimeout(tryStart, 800); return; }
      setTimeout(() => start(false), 700);
    };
    setTimeout(tryStart, 1200);
  });
})();