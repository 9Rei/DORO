// ============================================================
//  content-store.js — работа с темами из Firestore
// ============================================================
(function () {
  'use strict';

  const topicsCache = new Map();

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
            date: data.date || '',
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
          date: topic.date || '',
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
        date: data.date || '',
        steps: data.steps || [],
        pdfFiles: data.pdfFiles || [],
        content: data.content || '',
        status: data.status || 'draft',
        author: data.author || 'Редактор',
        updatedAt: serverTimestamp()
      });
      
      return topicId;
    }
  };

  console.log('[content-store] Готов к работе');
})();