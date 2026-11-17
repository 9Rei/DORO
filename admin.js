// DORO Golden — Чистая админ-панель (Генератор + История)
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const SECRET_KEY = "DORO_SECRET_2026"; // Должен совпадать с premium.js
  const DAYS = 30; 
  const HISTORY_KEY = 'doro.adminHistory';

  function isAdmin() {
    return document.documentElement.classList.contains('role-admin') ||
      (window.doroRoles && typeof window.doroRoles.isAdmin === 'function' && window.doroRoles.isAdmin());
  }

  async function generateGoldenKey(identity) {
    const expiresAt = Date.now() + DAYS * 86400000;
    const payload = { u: identity.trim(), e: expiresAt };
    
    // Кодируем с поддержкой кириллицы
    const str = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(SECRET_KEY),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(str));
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
    
    return { key: `GOLD.${str}.${sigB64}`, expiresAt };
  }

  function renderAdminPanel() {
    const panel = $('adminPanel');
    if (!panel) return;

    panel.innerHTML = `
      <!-- Генератор -->
      <div class="admin-panel__section">
        <h3 class="admin-panel__title">Выдать подписку Golden</h3>
        <p class="admin-panel__desc">
          Введите имя и группу пользователя <b>ровно так</b>, как они указаны у него в профиле. Подписка будет действовать <b>30 дней</b>.
        </p>

        <div class="admin-panel__row">
          <input type="text" id="adminNameInput" placeholder="Имя (например: Антон)" class="admin-panel__input">
          <input type="text" id="adminGroupInput" placeholder="Группа (например: ЛД2511)" class="admin-panel__input">
        </div>

        <button type="button" id="adminGenBtn" class="admin-panel__btn">
          Сгенерировать код на 30 дней
        </button>

        <div id="adminResult" class="admin-panel__result" style="display: none;">
          <p class="admin-panel__result-text">Код готов! Скопируйте его и отправьте пользователю:</p>
          <div class="admin-panel__result-row">
            <input type="text" id="adminKeyOutput" readonly class="admin-panel__output">
            <button type="button" id="adminCopyBtn" class="admin-panel__copy-btn">Копировать</button>
          </div>
        </div>
      </div>

      <!-- История -->
      <div class="admin-panel__section">
        <div class="admin-panel__history-head">
          <h3 class="admin-panel__title">История выдачи</h3>
          <button type="button" id="adminClearHistory" class="admin-panel__clear-btn">Очистить</button>
        </div>
        <div id="adminHistoryList" class="admin-panel__history-list"></div>
      </div>
    `;

    const genBtn = $('adminGenBtn');
    const nameInput = $('adminNameInput');
    const groupInput = $('adminGroupInput');
    const resultBox = $('adminResult');
    const outputField = $('adminKeyOutput');
    const copyBtn = $('adminCopyBtn');
    const historyList = $('adminHistoryList');
    const clearBtn = $('adminClearHistory');

    // --- Отрисовка истории ---
    function renderHistory() {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (!history.length) {
        historyList.innerHTML = '<div class="admin-panel__empty">Пока никому не выдавали коды.</div>';
        return;
      }
      
      historyList.innerHTML = history.map((item, index) => {
        const date = new Date(item.date).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        
        let daysInfo = '';
        if (item.expiresAt) {
          const daysLeft = Math.max(0, Math.ceil((item.expiresAt - Date.now()) / 86400000));
          if (daysLeft > 0) {
            daysInfo = `<span class="admin-panel__days admin-panel__days--active">(осталось ${daysLeft} дн.)</span>`;
          } else {
            daysInfo = `<span class="admin-panel__days admin-panel__days--expired">(истек)</span>`;
          }
        }

        return `
          <div class="admin-panel__history-item">
            <div class="admin-panel__history-info">
              <div><b class="admin-panel__history-name">${item.name}</b> ${daysInfo}</div>
              <div class="admin-panel__history-date">${date}</div>
            </div>
            <div class="admin-panel__history-actions">
              <div class="admin-panel__history-key" title="${item.key}">${item.key}</div>
              <button type="button" class="admin-panel__copy-small" data-idx="${index}">Копи</button>
            </div>
          </div>
        `;
      }).join('');

      historyList.querySelectorAll('.admin-panel__copy-small').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.idx;
          const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
          const keyToCopy = hist[idx].key;
          
          navigator.clipboard.writeText(keyToCopy).then(() => {
            btn.textContent = '✓';
            setTimeout(() => btn.textContent = 'Копи', 1500);
          }).catch(() => {
            const helper = document.createElement('textarea');
            helper.value = keyToCopy;
            helper.style.position = 'fixed'; helper.style.opacity = '0';
            document.body.appendChild(helper);
            helper.select();
            document.execCommand('copy');
            helper.remove();
            btn.textContent = '✓';
            setTimeout(() => btn.textContent = 'Копи', 1500);
          });
        });
      });
    }
    
    renderHistory();

    if (clearBtn) {
      clearBtn.onclick = () => {
        if (confirm('Очистить всю историю выдачи?')) {
          localStorage.removeItem(HISTORY_KEY);
          renderHistory();
        }
      };
    }

    // --- Генерация ---
    if (genBtn) {
      genBtn.onclick = async () => {
        const name = nameInput.value.trim();
        const group = groupInput.value.trim();
        
        if (!name || !group) {
          alert('Введите имя и группу пользователя');
          return;
        }

        const identity = `${name} ${group}`; 

        genBtn.disabled = true;
        genBtn.textContent = 'Генерация...';

        try {
          const result = await generateGoldenKey(identity);
          
          outputField.value = result.key;
          resultBox.style.display = 'block';

          const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
          history.unshift({
            name: identity,
            key: result.key,
            date: Date.now(),
            expiresAt: result.expiresAt
          });
          localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
          renderHistory();

        } catch (e) {
          alert('Ошибка генерации: ' + e.message);
        } finally {
          genBtn.disabled = false;
          genBtn.textContent = 'Сгенерировать код на 30 дней';
        }
      };
    }

    if (copyBtn) {
      copyBtn.onclick = () => {
        outputField.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Скопировано!';
        setTimeout(() => copyBtn.textContent = 'Копировать', 2000);
      };
    }
  }

  function init() {
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (isAdmin()) {
        clearInterval(timer);
        renderAdminPanel();
      } else if (tries >= 100) {
        clearInterval(timer);
      }
    }, 100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();