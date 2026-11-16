// ============================================================
//  content-store.js — работа с темами из Firestore
// ============================================================
(function () {
  'use strict';

  const topicsCache = new Map();
  const TOPICS_CACHE_MAX = 10;
  const TOPICS_INDEX_KEY = 'doro.topicsIndex.v1';
  const TOPICS_INDEX_TTL = 7 * 24 * 60 * 60 * 1000; // темы меняются редко; редакторская публикация инвалидирует кэш
  function invalidateTopicsIndex() { try { localStorage.removeItem(TOPICS_INDEX_KEY); } catch (_) {} }
  function invalidateTopicText(id) {
    if (!id) return;
    topicsCache.delete(id);
    try { localStorage.removeItem(topicTextCacheKey(id)); } catch (_) {}
  }
  let topicsIndexLoadPromise = null;
  const topicTextCacheKey = id => 'doro.topicText.v1:' + id;
  function readPersistentTopicText(id) {
    try { const item = JSON.parse(localStorage.getItem(topicTextCacheKey(id)) || 'null');
      if (item && typeof item.text === 'string' && Date.now() - item.time < 7 * 24 * 60 * 60 * 1000) return item.text;
      if (item) localStorage.removeItem(topicTextCacheKey(id));
    } catch (_) {}
    return null;
  }
  function savePersistentTopicText(id, text) {
    // Сохраняем только небольшие тексты: не переполняем localStorage на телефонах.
    if (typeof text !== 'string' || text.length > 90000) return;
    try { localStorage.setItem(topicTextCacheKey(id), JSON.stringify({ time: Date.now(), text })); } catch (_) {}
  }
  function cacheSet(key, value) {
    topicsCache.set(key, value);
    if (topicsCache.size > TOPICS_CACHE_MAX) {
      const firstKey = topicsCache.keys().next().value;
      topicsCache.delete(firstKey);
    }
  }
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
      if (topicsIndexLoadPromise) return topicsIndexLoadPromise;
      topicsIndexLoadPromise = (async () => {
      try {
        let records = null;
        try {
          const cached = JSON.parse(localStorage.getItem(TOPICS_INDEX_KEY) || 'null');
          if (cached && Array.isArray(cached.records) && Date.now() - cached.time < TOPICS_INDEX_TTL) records = cached.records;
        } catch (_) {}
        if (!records) {
          const { getDocs, collection } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          const snap = await getDocs(collection(window.doroDb, 'topics'));
          records = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          try {
            // Не кладём тексты тем в localStorage: это может превысить квоту браузера.
            const compact = records.map(({ content, ...meta }) => meta);
            localStorage.setItem(TOPICS_INDEX_KEY, JSON.stringify({ time: Date.now(), records: compact }));
          } catch (_) {}
        }
        records.forEach(data => {
          const subjectKey = data.subjectKey;
          
          // Если такого раздела нет, пропускаем
          if (!window.subjects || !window.subjects[subjectKey]) return;
          
          // Ищем, есть ли уже такая тема в старом списке (по номеру)
          const existingIndex = window.subjects[subjectKey].topics.findIndex(t => String(t.num) === String(data.num));
          
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
            cacheSet(`${subjectKey}_${data.num}`, data.content);
          }

          if (existingIndex !== -1) {
            window.subjects[subjectKey].topics[existingIndex] = { ...window.subjects[subjectKey].topics[existingIndex], ...newTopic };
          } else {
            window.subjects[subjectKey].topics.push(newTopic);
          }
        });
        console.log('[content] Список тем загружен (локальный кэш/Firestore)');
      } catch (e) {
        console.warn('[content] Не удалось загрузить список тем:', e);
      } finally { topicsIndexLoadPromise = null; }
      })();
      return topicsIndexLoadPromise;
    },

    // 2. Загрузка текста темы (сначала из кэша, потом fetch)
    async loadTopicContent(topic) {
      const subjectKey = topic.subjectKey || window.currentSubjectKey || 'unknown';
      const topicId = `${subjectKey}_${topic.num}`;

      if (topicsCache.has(topicId)) return topicsCache.get(topicId);
      const persistentText = readPersistentTopicText(topicId);
      if (persistentText !== null) { cacheSet(topicId, persistentText); return persistentText; }

      // Тема есть только в базе (loadAllTopics не успел / content не подтянулся)
      if (topic.isFromDb && window.doroDb) {
        try {
          const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          const snap = await getDoc(doc(window.doroDb, 'topics', topicId));
          if (snap.exists() && snap.data().content) {
            const text = snap.data().content;
            cacheSet(topicId, text);
            savePersistentTopicText(topicId, text);
            return text;
          }
        } catch (e) { console.warn('[content] getDoc fallback failed:', e); }
      }

      // Если это старая тема с GitHub — грузим и сохраняем в базу
      if (topic.file) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          const res = await fetch(topic.file, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const text = await res.text();
          cacheSet(topicId, text);
          savePersistentTopicText(topicId, text);
          // Важно: чтение старого файла больше НЕ вызывает автоматическую запись в Firestore.
          // Синхронизация в базу доступна только как явное действие редактора.
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
        
        invalidateTopicsIndex();
        savePersistentTopicText(topicId, text);
        cacheSet(topicId, text);
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
      invalidateTopicsIndex();
      invalidateTopicText(topicId);
      if (data.content) { cacheSet(topicId, data.content); savePersistentTopicText(topicId, data.content); }
      return topicId;
    },

    // 5. Удаление темы
    async deleteTopic(subjectKey, num) {
      if (!window.doroDb) return false;
      const { deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const topicId = `${subjectKey}_${num}`;
      await deleteDoc(doc(window.doroDb, 'topics', topicId));
      invalidateTopicsIndex();
      invalidateTopicText(topicId);
      return true;
    },

    // 6. Обновление существующей темы
    async updateTopic(subjectKey, oldNum, data) {
      if (!window.doroDb) return false;
      const { setDoc, doc, deleteDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      
      const oldTopicId = `${subjectKey}_${oldNum}`;
      const newTopicId = `${subjectKey}_${data.num || oldNum}`;
      
      // Если номер изменился, удаляем старый документ и его локальный кэш.
      if (oldTopicId !== newTopicId) {
        await deleteDoc(doc(window.doroDb, 'topics', oldTopicId));
        invalidateTopicText(oldTopicId);
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
      invalidateTopicsIndex();
      invalidateTopicText(newTopicId);
      if (data.content) { cacheSet(newTopicId, data.content); savePersistentTopicText(newTopicId, data.content); }
      return newTopicId;
    },

    // Экспортируем вспомогательные функции для editor-ui.js
    formatDateForInput: formatDateForInput
  };

  console.log('[content-store] Готов к работе');
})();