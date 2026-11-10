// ============================================================
//  editor-ui.js — интерфейс для редакторов
// ============================================================
(function () {
  'use strict';

  let currentSubjectKey = null;
  let editingTopicNum = null;

  function openEditorModal(topicData = null) {
    let modal = document.getElementById('editorModal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'editorModal';
      modal.className = 'editor-modal';
      modal.innerHTML = `
        <div class="editor-modal__box">
          <div class="editor-modal__head">
            <span class="editor-modal__title" id="editorModalTitle">Новая тема</span>
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
              <label>Ссылки на PDF (через запятую, если есть)</label>
              <input type="text" id="editorPdf" placeholder="content/histology/29П.pdf">
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

      document.getElementById('editorCloseBtn').onclick = () => modal.classList.remove('is-open');
      document.getElementById('editorCancelBtn').onclick = () => modal.classList.remove('is-open');

      document.getElementById('editorSaveBtn').onclick = async () => {
        const num = document.getElementById('editorNum').value.trim();
        const title = document.getElementById('editorTitle').value.trim();
        const date = document.getElementById('editorDate').value.trim();
        const stepsStr = document.getElementById('editorSteps').value.trim();
        const pdfStr = document.getElementById('editorPdf').value.trim();
        const content = document.getElementById('editorContent').value.trim();

        if (!num || !title || !content) {
          alert('Заполните номер, название и текст темы.');
          return;
        }

        const btn = document.getElementById('editorSaveBtn');
        btn.disabled = true;
        btn.textContent = 'Сохранение...';

        try {
          const data = {
            num, title, date,
            steps: stepsStr.split(',').map(s => s.trim()).filter(Boolean),
            pdfFiles: pdfStr.split(',').map(s => s.trim()).filter(Boolean),
            content,
            status: 'published',
            author: (JSON.parse(localStorage.getItem('doro.user') || '{}').name) || 'Редактор'
          };

          if (editingTopicNum !== null) {
            await window.doroContent.updateTopic(currentSubjectKey, editingTopicNum, data);
            alert('Тема успешно обновлена!');
          } else {
            await window.doroContent.createTopic(currentSubjectKey, data);
            alert('Тема успешно создана!');
          }

          modal.classList.remove('is-open');
          location.reload(); // Перезагружаем страницу, чтобы обновить список

        } catch (e) {
          console.error(e);
          alert('Ошибка: ' + e.message);
          btn.disabled = false;
          btn.textContent = 'Сохранить';
        }
      };
    }

    if (topicData) {
      document.getElementById('editorModalTitle').textContent = 'Редактировать тему';
      document.getElementById('editorNum').value = topicData.num || '';
      document.getElementById('editorTitle').value = topicData.title || '';
      document.getElementById('editorDate').value = window.doroContent.formatDateForInput(topicData.date || '');
      document.getElementById('editorSteps').value = (topicData.steps || []).join(', ');
      document.getElementById('editorPdf').value = (topicData.pdfFiles || []).join(', ');
      document.getElementById('editorContent').value = topicData.content || '';
    } else {
      document.getElementById('editorModalTitle').textContent = 'Новая тема';
      document.getElementById('editorNum').value = '';
      document.getElementById('editorTitle').value = '';
      
      // Автоматически подставляем сегодняшнюю дату в формате ДД.ММ.ГГГГ
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      document.getElementById('editorDate').value = `${dd}.${mm}.${yyyy}`;
      
      document.getElementById('editorSteps').value = '';
      document.getElementById('editorPdf').value = '';
      document.getElementById('editorContent').value = '';
    }

    modal.classList.add('is-open');
  }

  function injectEditorButtons() {
    const topBar = document.querySelector('.reader__top');
    if (!topBar) return;

    const subjectTitle = document.getElementById('reader-subject-title').textContent;
    const subjectsMap = { 'Биохимия': 'biochem', 'Физиология': 'physio', 'Гистология': 'histology', 'Микробиология': 'microbio' };
    currentSubjectKey = subjectsMap[subjectTitle] || 'histology';

    // Создаем контейнер для действий редактора (чтобы они стояли в ряд)
    let actionsWrap = document.getElementById('editorActionsWrap');
    if (!actionsWrap) {
      actionsWrap = document.createElement('div');
      actionsWrap.id = 'editorActionsWrap';
      actionsWrap.className = 'editor-actions-wrap';
      // Вставляем перед шестеренкой
      const menuBtn = document.getElementById('readerMenuBtn');
      if (menuBtn) {
        topBar.insertBefore(actionsWrap, menuBtn);
      } else {
        topBar.appendChild(actionsWrap);
      }
    }

    // 1. Кнопка "Создать тему"
    if (!document.getElementById('createTopicBtn')) {
      const btnCreate = document.createElement('button');
      btnCreate.id = 'createTopicBtn';
      btnCreate.className = 'reader-icon-btn editor-action-btn';
      btnCreate.title = 'Создать тему';
      btnCreate.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
      btnCreate.onclick = () => {
        editingTopicNum = null;
        openEditorModal();
      };
      actionsWrap.appendChild(btnCreate);
    }

    // 2. Кнопки "Редактировать" и "Удалить" (появляются только если открыта тема)
    if (window.currentTopicMeta && !document.getElementById('editTopicBtn')) {
      const btnEdit = document.createElement('button');
      btnEdit.id = 'editTopicBtn';
      btnEdit.className = 'reader-icon-btn editor-action-btn';
      btnEdit.title = 'Редактировать тему';
      btnEdit.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
      btnEdit.onclick = async () => {
        const raw = await window.doroContent.loadTopicContent({ ...window.currentTopicMeta, subjectKey: currentSubjectKey });
        editingTopicNum = window.currentTopicMeta.num;
        openEditorModal({
          ...window.currentTopicMeta,
          pdfFiles: window.currentTopicMeta.pdf ? [window.currentTopicMeta.pdf] : [],
          content: raw
        });
      };

      const btnDel = document.createElement('button');
      btnDel.id = 'deleteTopicBtn';
      btnDel.className = 'reader-icon-btn editor-action-btn editor-action-btn--danger';
      btnDel.title = 'Удалить тему';
      btnDel.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
      btnDel.onclick = async () => {
        if (!confirm('Вы уверены, что хотите удалить эту тему?')) return;
        await window.doroContent.deleteTopic(currentSubjectKey, window.currentTopicMeta.num);
        alert('Тема удалена');
        location.reload();
      };

      actionsWrap.appendChild(btnEdit);
      actionsWrap.appendChild(btnDel);
    }
  }

  const observer = new MutationObserver(() => {
    if (window.doroRoles && window.doroRoles.isEditor()) {
      injectEditorButtons();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const readerArticle = document.getElementById('reader-article');
    if (readerArticle) {
      observer.observe(readerArticle, { childList: true, subtree: true });
    }
  });

})();