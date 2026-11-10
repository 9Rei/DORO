// ============================================================
//  content-store.js — работа с темами из Firestore
// ============================================================
(function () {
  'use strict';

  const topicsCache = new Map();
  // Преобразует ДД.ММ.ГГГГ или ДД-ММ-ГГГГ в 2026-11-10 (для базы и календаря)
  function formatDateForDb(dateStr) {
    if (!dateStr) return '';
    // Если дата уже в формате ГГГГ-ММ-ДД (с дефисами), просто возвращаем её
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
      return dateStr.trim();
    }
    // Иначе парсим как ДД.ММ.ГГГГ
    const parts = dateStr.trim().split(/[\.\-\/]/);
    if (parts.length === 3) {
      const dd = parts[0].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      let yyyy = parts[2];
      if (yyyy.length === 2) yyyy = '20' + yyyy;
      return `${yyyy}-${mm}-${dd}`;
    }
    return dateStr;
  }

  // Преобразует 2026-11-10 в 10.11.2026 (для показа в форме)
  function formatDateForInput(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.trim().split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  }

  window.doroContent = {
    // 1. Загрузка ВСЕХ тем из базы при старте сайта
    async loadAllTopics() {
      if (!window.doroDb) return;
      try {
        const { getDocs, collection } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const snap = await getDocs(collection(window.doroDb, 'topics'));
        
        snap.forEach(doc => {
          const data = doc.data();
          const subjectKey = data.subjectKey;
          
          // Если такого раздела нет, пропускаем
          if (!window.subjects || !window.subjects[subjectKey]) return;
          
          // Ищем, есть ли уже такая тема в старом списке (по номеру)
          const existingIndex = window.subjects[subjectKey].topics.findIndex(t => t.num === data.num);
          
          const newTopic = {
            num: data.num,
            title: data.title,
            steps: data.steps || [],
            date: formatDateForDb(data.date), // Конвертируем дату из базы в ISO формат
            pdf: data.pdfFiles && data.pdfFiles[0] ? data.pdfFiles[0] : null,
            isFromDb: true 
          };

          // Если у темы есть текст в базе — кладем его в кэш
          if (data.content) {
            topicsCache.set(`${subjectKey}_${data.num}`, data.content);
          }

          if (existingIndex !== -1) {
            window.subjects[subjectKey].topics[existingIndex] = { ...window.subjects[subjectKey].topics[existingIndex], ...newTopic };
          } else {
            window.subjects[subjectKey].topics.push(newTopic);
          }
        });
        console.log('[content] Список тем обновлен из базы');
      } catch (e) {
        console.warn('[content] Не удалось загрузить список тем:', e);
      }
    },

    // 2. Загрузка текста темы (сначала из кэша, потом fetch)
    async loadTopicContent(topic) {
      const subjectKey = topic.subjectKey || window.currentSubjectKey || 'unknown';
      const topicId = `${subjectKey}_${topic.num}`;

      if (topicsCache.has(topicId)) {
        return topicsCache.get(topicId);
      }

      // Если это старая тема с GitHub — грузим и сохраняем в базу
      if (topic.file) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(topic.file, { cache: 'no-cache', signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const text = await res.text();
          topicsCache.set(topicId, text);
          
          window.doroContent.syncToDb(topicId, subjectKey, topic, text);
          return text;
        } catch (e) {
          console.error('Ошибка загрузки ' + topic.file, e);
          return `Не удалось загрузить файл темы: ${topic.file}`;
        }
      }

      return '<p class="reader__empty">Файл темы пуст.</p>';
    },

    // 3. Сохранение старого файла в базу (ленивая миграция)
    async syncToDb(topicId, subjectKey, topic, text) {
      try {
        if (!window.doroDb) return;
        const { setDoc, doc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        
        await setDoc(doc(window.doroDb, 'topics', topicId), {
          subjectKey: subjectKey,
          num: topic.num,
          title: topic.title,
          date: formatDateForDb(topic.date || ''),
          steps: topic.steps || [],
          pdfFiles: topic.pdf ? [topic.pdf] : [],
          content: text,
          status: 'published',
          author: 'Автомиграция',
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        console.log(`[content] Тема ${topicId} сохранена в базу (миграция)`);
      } catch (e) {
        console.warn('[content] Не удалось сохранить в базу:', e);
      }
    },

    // 4. Создание новой темы (для редакторов)
    async createTopic(subjectKey, data) {
      if (!window.doroDb) return false;
      const { setDoc, doc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const topicId = `${subjectKey}_${data.num || Date.now()}`;
      
      await setDoc(doc(window.doroDb, 'topics', topicId), {
        subjectKey: subjectKey,
        num: data.num || '',
        title: data.title || 'Без названия',
        date: formatDateForDb(data.date || ''),
        steps: data.steps || [],
        pdfFiles: data.pdfFiles || [],
        content: data.content || '',
        status: data.status || 'draft',
        author: data.author || 'Редактор',
        updatedAt: serverTimestamp()
      });
      
      return topicId;
    },

    // 5. Удаление темы
    async deleteTopic(subjectKey, num) {
      if (!window.doroDb) return false;
      const { deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const topicId = `${subjectKey}_${num}`;
      await deleteDoc(doc(window.doroDb, 'topics', topicId));
      return true;
    },

    // 6. Обновление существующей темы
    async updateTopic(subjectKey, oldNum, data) {
      if (!window.doroDb) return false;
      const { setDoc, doc, deleteDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      
      const oldTopicId = `${subjectKey}_${oldNum}`;
      const newTopicId = `${subjectKey}_${data.num || oldNum}`;
      
      // Если номер изменился, удаляем старый документ
      if (oldTopicId !== newTopicId) {
        await deleteDoc(doc(window.doroDb, 'topics', oldTopicId));
      }

      await setDoc(doc(window.doroDb, 'topics', newTopicId), {
        subjectKey: subjectKey,
        num: data.num || oldNum,
        title: data.title,
        date: formatDateForDb(data.date || ''),
        steps: data.steps || [],
        pdfFiles: data.pdfFiles || [],
        content: data.content || '',
        status: data.status || 'published',
        author: data.author || 'Редактор',
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return newTopicId;
    },

    // Экспортируем вспомогательные функции для editor-ui.js
    formatDateForInput: formatDateForInput
  };

  console.log('[content-store] Готов к работе');
})();