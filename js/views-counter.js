(function () {
  'use strict';

  const API_URL = 'https://script.google.com/macros/s/AKfycbyP2-beK1ETvApPnCfxrwSZdkh_CzGEZdXHBFy9xJvDo9m3IW4C_xy2AkWz2U7ZS6lTQQ/exec';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const articleId = getArticleId();

    if (articleId) {
      loadViews();
      countView(articleId);
    } else {
      loadViews();
    }
  }

  function getArticleId() {
    const path = window.location.pathname;
    const match = path.match(/\/blog\/([^\/]+)/);
    return match ? match[1] : null;
  }

  function loadViews() {
    const callbackName = 'views_' + Date.now();

    window[callbackName] = function (data) {
      if (data && data.success && data.views) {
        updateCounters(data.views);
      }
      delete window[callbackName];
    };

    const script = document.createElement('script');
    script.src = `${API_URL}?action=getAll&callback=${callbackName}`;
    script.onerror = () => console.error('❌ Ошибка загрузки просмотров');
    document.head.appendChild(script);
  }

  function countView(articleId) {
    const key = `viewed_${articleId}`;
    if (sessionStorage.getItem(key)) {
      return;
    }

    const callbackName = 'inc_' + Date.now();

    window[callbackName] = function (data) {
      delete window[callbackName];
      setTimeout(loadViews, 500);
    };

    const script = document.createElement('script');
    script.src = `${API_URL}?action=increment&article=${encodeURIComponent(articleId)}&callback=${callbackName}`;
    script.onerror = () => console.error('❌ Ошибка при засчитывании');
    document.head.appendChild(script);

    sessionStorage.setItem(key, '1');
  }

  function updateCounters(views) {

    document.querySelectorAll('[data-url]').forEach(el => {
      const url = el.getAttribute('data-url');
      let slug = url;

      if (url.includes('/blog/')) {
        slug = url.split('/blog/')[1].split('/')[0];
      }

      const count = views[slug] || 0;
      const countEl = el.querySelector('.views-count');
      if (countEl) {
        countEl.textContent = count;
      }
    });
  }

  window.debugViews = function () {
    console.log('=== ОТЛАДКА ===');
    console.log('API URL:', API_URL);
    console.log('Статья:', getArticleId());
    loadViews();
  };
})();