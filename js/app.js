// Router + event wiring for the real Rundle app.
// render.js defines renderAll/renderMap/etc and writes into these screens;
// this file decides which screen is visible and what triggers what.

(function () {
  var SCREENS = ['cover', 'picker', 'connect', 'credentials', 'download', 'mapping',
    'home', 'skill-detail', 'matches', 'match-detail', 'training', 'profile', 'positions'];

  var selectedPersona = PERSONAS[0];
  var matchesFanfarePlayed = false;
  var navStack = [];

  function showScreen(id, opts) {
    opts = opts || {};
    var current = document.querySelector('.screen.active');
    if (!opts.skipHistory && current && current.dataset.screen && current.dataset.screen !== id) {
      navStack.push(current.dataset.screen);
    }
    SCREENS.forEach(function (s) {
      var el = document.getElementById('screen-' + s);
      if (el) el.classList.toggle('active', s === id);
    });
    onScreenShow(id);
  }

  function goBack() {
    var prev = navStack.pop();
    if (prev) showScreen(prev, { skipHistory: true });
  }

  function onScreenShow(id) {
    if (id === 'credentials') {
      playLoginTypewriter();
    } else if (id === 'download') {
      var nextBtn = document.getElementById('download-next-btn');
      if (nextBtn) nextBtn.style.display = 'none';
      playDownload(selectedPersona, function () {
        renderAll(selectedPersona);
        renderMap(selectedPersona, STORY[selectedPersona.id], function () {
          showScreen('home', { skipHistory: true });
        });
        if (nextBtn) nextBtn.style.display = '';
      });
    } else if (id === 'matches' && !matchesFanfarePlayed) {
      matchesFanfarePlayed = true;
      playMatchesFanfare();
    }
  }

  // ---- Persona picker ----
  function renderPicker() {
    var mount = document.getElementById('persona-list');
    if (!mount) return;
    mount.innerHTML = PERSONAS.map(function (p, i) {
      return '' +
        '<div class="persona-card' + (i === 0 ? ' selected' : '') + '" data-pid="' + p.id + '">' +
          '<div class="avatar" style="background:' + p.avatarBg + '"><img src="' + p.avatar + '" alt="' + p.name + '" /></div>' +
          '<div><div class="persona-name">' + p.name + '</div>' +
            '<div class="persona-role">' + p.role + ' &middot; ' + p.tenure + '</div>' +
            '<div class="persona-meta">Age ' + p.age + ' &middot; ' + p.location + '</div></div>' +
          '<svg class="persona-arrow"><use href="#i-chev"/></svg>' +
        '</div>';
    }).join('');
  }

  function selectPersona(pid) {
    var picked = PERSONAS.filter(function (p) { return p.id === pid; })[0];
    if (!picked) return;
    selectedPersona = picked;
    matchesFanfarePlayed = false;
    var mount = document.getElementById('persona-list');
    if (mount) {
      mount.querySelectorAll('.persona-card').forEach(function (c) {
        c.classList.toggle('selected', c.dataset.pid === pid);
      });
    }
    var sub = document.getElementById('connect-sublead');
    if (sub) sub.textContent = 'Select the accounts Rundle should pull ' + picked.name.split(' ')[0] + '’s work history from.';
  }

  // ---- Click delegation ----
  document.getElementById('app').addEventListener('click', function (e) {
    var backBtn = e.target.closest('.back-btn');
    if (backBtn) { goBack(); return; }

    var tab = e.target.closest('.tab[data-target]');
    if (tab) { showScreen(tab.dataset.target); return; }

    if (e.target.closest('#cover-cta')) { showScreen('picker'); return; }

    var card = e.target.closest('.persona-card');
    if (card) {
      selectPersona(card.dataset.pid);
      setTimeout(function () { showScreen('connect'); }, 800);
      return;
    }

    if (e.target.closest('#connect-cta')) { showScreen('credentials'); return; }

    if (e.target.closest('#login-btn')) {
      confirmLogin(function () { showScreen('download', { skipHistory: true }); });
      return;
    }

    if (e.target.closest('#download-next-btn')) {
      showScreen('mapping', { skipHistory: true });
      return;
    }

    var checkRow = e.target.closest('.check-row');
    if (checkRow) { checkRow.classList.toggle('checked'); return; }

    if (e.target.closest('#home-view-all-skills')) { showScreen('skill-detail'); return; }
    if (e.target.closest('#home-see-matches')) { showScreen('matches'); return; }
    if (e.target.closest('.skill-row')) { showScreen('skill-detail'); return; }

    var openPositions = e.target.closest('[data-open-positions]');
    if (openPositions) { showScreen('positions'); return; }

    var matchCard = e.target.closest('.match-card');
    if (matchCard) { showScreen('match-detail'); return; }

    if (e.target.closest('#gap-start-training')) { showScreen('training'); return; }

    var toggle = e.target.closest('.toggle-row .switch');
    if (toggle) { toggle.classList.toggle('on'); toggle.classList.toggle('off'); return; }
  });

  renderPicker();
  showScreen('cover');
})();
