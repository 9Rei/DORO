// ============================================================
//  content-store.js — работа с темами (БЕЗ СЕРВЕРА)
// ============================================================
(function () {
  'use strict';

  const TOPICS_KEY = 'doro.topics.db';
  
  // Получаем все темы из localStorage
  function getDb() {
    try { return JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}'); }
    catch (_) { return {}; }
  }

  // Сохраняем темы в localStorage
  function saveDb(db) {
    try { localStorage.setItem(TOPICS_KEY, JSON.stringify(db)); } catch (_) {}
  }

  // Форматирование даты для ввода
  function formatDateForInput(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.trim().split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return dateStr;
  }

  window.doroContent = {
    // 1. Загрузка ВСЕХ тем при старте
    async loadAllTopics() {
      const db = getDb();
      
      // Переносим темы из localStorage в window.subjects
      Object.keys(db).forEach(topicId => {
        const data = db[topicId];
        const subjectKey = data.subjectKey;
        
        if (!window.subjects || !window.subjects[subjectKey]) return;
        
        const existingIndex = window.subjects[subjectKey].topics.findIndex(t => String(t.num) === String(data.num));
        
        const newTopic = {
          num: data.num,
          title: data.title,
          steps: data.steps || [],
          date: data.date || '',
          pdf: data.pdfFiles && data.pdfFiles[0] ? data.pdfFiles[0] : null,
          isFromDb: true 
        };

        if (existingIndex !== -1) {
          window.subjects[subjectKey].topics[existingIndex] = { ...window.subjects[subjectKey].topics[existingIndex], ...newTopic };
        } else {
          window.subjects[subjectKey].topics.push(newTopic);
        }
      });
      console.log('[content] Темы загружены из localStorage');
    },

    // 2. Загрузка текста темы
    async loadTopicContent(topic) {
      const subjectKey = topic.subjectKey || window.currentSubjectKey || 'unknown';
      const topicId = `${subjectKey}_${topic.num}`;
      
      const db = getDb();
      if (db[topicId] && db[topicId].content) {
        return db[topicId].content;
      }

      // Если темы нет в базе, но есть локальный файл
      if (topic.file) {
        try {
          const res = await fetch(topic.file);
          if (res.ok) return await res.text();
        } catch (e) {
          console.error('Ошибка загрузки файла', e);
        }
      }

      return '<p class="reader__empty">Текст темы пока не добавлен.</p>';
    },

    // 3. Создание новой темы (вызывается из editor-ui)
    async createTopic(subjectKey, data) {
      const db = getDb();
      const topicId = `${subjectKey}_${data.num || Date.now()}`;
      
      db[topicId] = {
        subjectKey: subjectKey,
        num: data.num || '',
        title: data.title || 'Без названия',
        date: data.date || '',
        steps: data.steps || [],
        pdfFiles: data.pdfFiles || [],
        content: data.content || '',
        updatedAt: Date.now()
      };
      saveDb(db);
      return topicId;
    },

    // 4. Обновление темы
    async updateTopic(subjectKey, oldNum, data) {
      const db = getDb();
      const oldTopicId = `${subjectKey}_${oldNum}`;
      const newTopicId = `${subjectKey}_${data.num || oldNum}`;
      
      if (oldTopicId !== newTopicId) {
        delete db[oldTopicId];
      }

      db[newTopicId] = {
        subjectKey: subjectKey,
        num: data.num || oldNum,
        title: data.title,
        date: data.date || '',
        steps: data.steps || [],
        pdfFiles: data.pdfFiles || [],
        content: data.content || '',
        updatedAt: Date.now()
      };
      saveDb(db);
      return newTopicId;
    },

    // 5. Удаление темы
    async deleteTopic(subjectKey, num) {
      const db = getDb();
      const topicId = `${subjectKey}_${num}`;
      delete db[topicId];
      saveDb(db);
      return true;
    },

    // Экспорт вспомогательных функций
    formatDateForInput: formatDateForInput
  };

  console.log('[content-store] Готов к работе (офлайн-режим)');
})();