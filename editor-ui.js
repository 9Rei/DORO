// ============================================================
//  editor-ui.js — интерфейс для редакторов
// ============================================================
(function () {
  'use strict';

  let currentSubjectKey = null;

  function openEditorModal() {
    let modal = document.getElementById('editorModal');
    
    // Если модалки ещё нет, создаем её
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'editorModal';
      modal.className = 'editor-modal';
      modal.innerHTML = `
        <div class="editor-modal__box">
          <div class="editor-modal__head">
            <span class="editor-modal__title">Новая тема</span>
            <button type="button" class="editor-modal__close" id="editorCloseBtn">×</button>
          </div>
          <div class="editor-modal__body">
            <div class="editor-field">
              <label>Номер темы (например, 29)</label>
              <input type="text" id="editorNum" placeholder="29">
            </div>
            <div class="editor-field">
              <label>Название темы</label>
              <input type="text" id="editorTitle" placeholder="Введите название">
            </div>
            <div class="editor-field">
              <label>Дата (ГГГГ-ММ-ДД)</label>
              <input type="text" id="editorDate" placeholder="2026-12-01">
            </div>
            <div class="editor-field">
              <label>Шаги подготовки (через запятую)</label>
              <input type="text" id="editorSteps" placeholder="Прочитать файл, Решить тест">
            </div>
            <div class="editor-field">
              <label>Текст темы (Markdown)</label>
              <textarea id="editorContent" placeholder="Вставьте текст..."></textarea>
            </div>
          </div>
          <div class="editor-modal__foot">
            <button type="button" class="editor-btn editor-btn--cancel" id="editorCancelBtn">Отмена</button>
            <button type="button" class="editor-btn editor-btn--save" id="editorSaveBtn">Сохранить</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Закрытие
      document.getElementById('editorCloseBtn').onclick = () => modal.classList.remove('is-open');
      document.getElementById('editorCancelBtn').onclick = () => modal.classList.remove('is-open');

      // Сохранение
      document.getElementById('editorSaveBtn').onclick = async () => {
        const num = document.getElementById('editorNum').value.trim();
        const title = document.getElementById('editorTitle').value.trim();
        const date = document.getElementById('editorDate').value.trim();
        const stepsStr = document.getElementById('editorSteps').value.trim();
        const content = document.getElementById('editorContent').value.trim();

        if (!num || !title || !content) {
          alert('Заполните номер, название и текст темы.');
          return;
        }

        const btn = document.getElementById('editorSaveBtn');
        btn.disabled = true;
        btn.textContent = 'Сохранение...';

        try {
          await window.doroContent.createTopic(currentSubjectKey, {
            num, title, date,
            steps: stepsStr.split(',').map(s => s.trim()).filter(Boolean),
            content,
            status: 'published',
            author: (JSON.parse(localStorage.getItem('doro.user') || '{}').name) || 'Редактор'
          });

          alert('Тема успешно создана!');
          modal.classList.remove('is-open');
          
          // Мгновенно добавляем тему в локальный список и перерисовываем
          if (window.subjects && window.subjects[currentSubjectKey]) {
            window.subjects[currentSubjectKey].topics.push({
              num, title, date,
              steps: stepsStr.split(',').map(s => s.trim()).filter(Boolean),
              isFromDb: true
            });
            // Перерисовываем карточки разделов и открываем тему
            if (window.renderSections) window.renderSections();
            if (window.openTopic) window.openTopic(currentSubjectKey, num);
          } else {
            location.reload(); // На всякий случай, если что-то пошло не так
          }

        } catch (e) {
          console.error(e);
          alert('Ошибка при создании темы: ' + e.message);
          btn.disabled = false;
          btn.textContent = 'Сохранить';
        }
      };
    }

    modal.classList.add('is-open');
  }

  // Функция, которая добавляет кнопку в интерфейс читалки
  function injectEditorButton() {
    // Ищем шапку читалки (где кнопки поиска и настроек)
    const topBar = document.querySelector('.reader__top');
    if (!topBar) return;
    
    // Если кнопка уже есть — не добавляем
    if (document.getElementById('createTopicBtn')) return;

    // Создаем кнопку
    const btn = document.createElement('button');
    btn.id = 'createTopicBtn';
    btn.className = 'editor-btn';
    btn.innerHTML = `+ Создать тему`;
    btn.style.marginLeft = 'auto'; // прижимаем к правому краю
    btn.style.marginRight = '12px';

    btn.onclick = () => {
      // Получаем текущий предмет
      const subjectTitle = document.getElementById('reader-subject-title').textContent;
      // Определяем ключ по названию (грубый метод, но работает)
      const subjectsMap = { 'Биохимия': 'biochem', 'Физиология': 'physio', 'Гистология': 'histology', 'Микробиология': 'microbio' };
      currentSubjectKey = subjectsMap[subjectTitle] || 'histology';
      
      openEditorModal();
    };

    // Вставляем кнопку перед меню настроек
    const menuBtn = document.getElementById('readerMenuBtn');
    if (menuBtn) {
      topBar.insertBefore(btn, menuBtn);
    } else {
      topBar.appendChild(btn);
    }
  }

  // Запускаем проверку кнопки при каждом открытии темы
  const observer = new MutationObserver(() => {
    if (window.doroRoles && window.doroRoles.isEditor()) {
      injectEditorButton();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const readerArticle = document.getElementById('reader-article');
    if (readerArticle) {
      observer.observe(readerArticle, { childList: true, subtree: true });
    }
  });

})();