/* 共享配置：中文简介切换（docsify-book）
 * 用法：每本书 index.html 在 docsify.min.js 之前引用本文件。
 * 提供：fallbackLanguages、中文 slugify、语言切换按钮。
 */
(function () {
  var cfg = window.$docsify = window.$docsify || {};

  if (!cfg.fallbackLanguages) {
    cfg.fallbackLanguages = ['zh'];
  }

  if (!cfg.slugify) {
    cfg.slugify = function (str) {
      return String(str).trim().toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };
  }

  var style = document.createElement('style');
  style.textContent = '.lang-switch{position:fixed;top:12px;right:20px;z-index:99;padding:4px 12px;font-size:13px;line-height:20px;color:#42b983;border:1px solid #42b983;border-radius:4px;background:#fff;cursor:pointer;text-decoration:none}.lang-switch:hover{background:#42b983;color:#fff}';
  document.head.appendChild(style);

  cfg.plugins = (cfg.plugins || []).concat([function (hook) {
    var LANG_RE = /\/zh(\/|$)/;

    function currentIsZh() {
      var path = (location.hash || '#/').replace(/^#/, '') || '/';
      return LANG_RE.test(path);
    }

    function toggle() {
      var path = (location.hash || '#/').replace(/^#/, '') || '/';
      if (LANG_RE.test(path)) {
        path = path.replace(LANG_RE, '/');
        if (path === '/' || path === '//') { path = '/'; }
        location.hash = '#' + path;
      } else {
        location.hash = '#/zh' + path;
      }
    }

    hook.mounted(function () {
      var el = document.createElement('a');
      el.className = 'lang-switch';
      el.href = '#';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        toggle();
      });
      document.body.appendChild(el);
    });

    hook.doneEach(function () {
      var el = document.querySelector('.lang-switch');
      if (el) { el.textContent = currentIsZh() ? 'English' : '中文'; }
    });
  }]);
})();
