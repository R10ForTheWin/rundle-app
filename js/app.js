// Router + event wiring for the real Rundle app.
// render.js defines renderAll/renderMap/etc and writes into these screens;
// this file decides which screen is visible and what triggers what.

(function () {
  var SCREENS = ['cover', 'picker', 'credentials', 'employment', 'connect', 'download', 'verified-skills',
    'assessment-gateway', 'module-demo', 'mapping',
    'home', 'review', 'chart-review', 'match-detail', 'training', 'profile', 'positions'];

  var selectedPersona = PERSONAS[0];
  var chartReviewDone = false;
  var chartReviewStep = 0;
  var assessmentDone = false;
  var navStack = [];

  // ---- Hidden presenter tools: a short tap on the corner toggles
  // instant-animation mode (for re-running the demo without waiting out
  // every timer); a long-press on the same corner opens a bare-bones
  // jump-to-any-screen menu. Deliberately NOT persisted across reloads —
  // it used to stick via localStorage, which meant a stray tap during
  // testing silently killed every animation for good until you noticed
  // and found the gesture again. Always starts off on a fresh load.
  var demoFast = false;
  var SCREEN_LABELS = {
    cover: 'Cover', picker: 'Choose persona', connect: 'Connect sources',
    credentials: 'AHIMA login', download: 'Downloading data', employment: 'Confirm work history',
    'verified-skills': 'Verified skills', 'assessment-gateway': 'Assessment gateway',
    'module-demo': 'Module 1 demo', mapping: 'Skill mapping', home: 'Job matches',
    review: 'Review', 'chart-review': 'Chart review',
    'match-detail': 'Match / gap detail', training: 'Training', profile: 'Profile', positions: 'Open positions'
  };

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
    document.body.classList.toggle('cover-active', id === 'cover');
    onScreenShow(id);
  }

  function goBack() {
    var prev = navStack.pop();
    if (prev) showScreen(prev, { skipHistory: true });
  }

  function onScreenShow(id) {
    if (id === 'connect') {
      playConnectAutoCheck();
    } else if (id === 'credentials') {
      playLoginTypewriter();
    } else if (id === 'download') {
      var nextBtn = document.getElementById('download-next-btn');
      if (nextBtn) nextBtn.style.display = 'none';
      playDownload(selectedPersona, function () {
        renderAll(selectedPersona);
        if (nextBtn) nextBtn.style.display = '';
      });
    } else if (id === 'employment') {
      renderEmployment(selectedPersona, STORY[selectedPersona.id]);
    } else if (id === 'verified-skills') {
      renderVerifiedSkills(selectedPersona, STORY[selectedPersona.id], assessmentDone);
    } else if (id === 'assessment-gateway') {
      renderAssessmentGateway();
    } else if (id === 'module-demo') {
      renderModuleDemo();
    } else if (id === 'mapping') {
      renderMap(selectedPersona, STORY[selectedPersona.id], function () {
        showScreen('home', { skipHistory: true });
      });
    } else if (id === 'home') {
      animateMatchRingsIn(document.getElementById('home-content'));
    } else if (id === 'review') {
      renderReviewTab(STORY[selectedPersona.id].skillDetail.name, chartReviewDone);
    } else if (id === 'chart-review') {
      chartReviewStep = 0;
      renderChartReviewIntro();
    }
  }

  // ---- Persona picker ----
  function renderPicker() {
    var mount = document.getElementById('persona-list');
    if (!mount) return;
    var revealCls = reduceMotion ? '' : ' reveal-row';
    mount.innerHTML = PERSONAS.map(function (p, i) {
      var delay = reduceMotion ? '' : ' style="animation-delay:' + (i * 0.08).toFixed(2) + 's"';
      return '' +
        '<div class="persona-card' + (i === 0 ? ' selected' : '') + revealCls + '" data-pid="' + p.id + '"' + delay + '>' +
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
    chartReviewDone = false;
    chartReviewStep = 0;
    assessmentDone = false;
    var mount = document.getElementById('persona-list');
    if (mount) {
      mount.querySelectorAll('.persona-card').forEach(function (c) {
        c.classList.toggle('selected', c.dataset.pid === pid);
      });
    }
    var sub = document.getElementById('connect-sublead');
    if (sub) sub.textContent = 'Public sources Rundle uses to benchmark ' + picked.name.split(' ')[0] + '’s skills against the role.';
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
      var continueBtn = document.getElementById('picker-continue-btn');
      if (continueBtn) continueBtn.classList.remove('pending');
      return;
    }

    if (e.target.closest('#picker-continue-btn')) {
      if (!e.target.closest('#picker-continue-btn').classList.contains('pending')) showScreen('credentials');
      return;
    }

    if (e.target.closest('#connect-cta')) { showScreen('download'); return; }

    if (e.target.closest('#login-btn')) {
      confirmLogin(function () { showScreen('employment', { skipHistory: true }); });
      return;
    }

    var provider = e.target.closest('.employment-provider:not(.connected):not(.connecting)');
    if (provider) { toggleProviderSelect(provider); return; }

    var connectBtn = e.target.closest('#employment-connect-btn');
    if (connectBtn) {
      if (connectBtn.classList.contains('done')) { showScreen('connect'); return; }
      if (!connectBtn.classList.contains('pending')) {
        var selectedProvider = document.querySelector('.employment-provider.selected');
        if (selectedProvider) connectEmployment(selectedProvider, selectedProvider.dataset.provider, 'payroll');
      }
      return;
    }

    var uploadCard = e.target.closest('#employment-upload:not(.connected)');
    if (uploadCard) { connectEmployment(uploadCard, 'your resume', 'resume'); return; }

    if (e.target.closest('#employment-continue-btn')) {
      if (!e.target.closest('#employment-continue-btn').classList.contains('pending')) showScreen('connect');
      return;
    }

    if (e.target.closest('#download-next-btn')) {
      showScreen('verified-skills', { skipHistory: true });
      return;
    }

    var checkRow = e.target.closest('.check-row');
    if (checkRow) { checkRow.classList.toggle('checked'); return; }

    if (e.target.closest('#verified-skills-continue-btn')) {
      showScreen(assessmentDone ? 'mapping' : 'assessment-gateway');
      return;
    }
    if (e.target.closest('#gateway-start-module2')) { showScreen('module-demo'); return; }
    if (e.target.closest('#home-next-review')) { showScreen('review'); return; }
    if (e.target.closest('#module-demo-replay')) { renderModuleDemo(); return; }
    if (e.target.closest('#module-demo-continue')) {
      assessmentDone = true;
      showScreen('verified-skills', { skipHistory: true });
      return;
    }

    if (e.target.closest('#strengthen-evidence-btn')) { showScreen('chart-review'); return; }
    if (e.target.closest('#review-view-evidence-btn')) { showScreen('verified-skills', { skipHistory: true }); return; }

    if (e.target.closest('#chart-review-start-btn')) {
      chartReviewStep = 0;
      renderChartReviewStep(chartReviewStep);
      return;
    }

    var reviewChoice = e.target.closest('[data-review-choice]');
    if (reviewChoice) {
      chartReviewStep++;
      if (chartReviewStep >= CHART_REVIEW_CHARTS.length) chartReviewDone = true;
      renderChartReviewStep(chartReviewStep);
      return;
    }

    if (e.target.closest('#chart-review-back-btn')) { showScreen('review', { skipHistory: true }); return; }

    var openPositions = e.target.closest('[data-open-positions]');
    if (openPositions) {
      var matchIdx = Number(openPositions.dataset.openPositions);
      var match = STORY[selectedPersona.id].matches[matchIdx];
      if (match && match.positions) renderPositions(match.title, match.positions);
      showScreen('positions');
      return;
    }

    var matchCard = e.target.closest('.match-card');
    if (matchCard) { showScreen('match-detail'); return; }

    if (e.target.closest('#gap-start-training')) { showScreen('training'); return; }

    var toggle = e.target.closest('.toggle-row .switch');
    if (toggle) { toggle.classList.toggle('on'); toggle.classList.toggle('off'); return; }
  });

  function pulseTapZone(color) {
    var zone = document.getElementById('demo-tap-zone');
    if (!zone) return;
    zone.style.transition = 'none';
    zone.style.background = color;
    requestAnimationFrame(function () {
      zone.style.transition = 'background 0.6s ease';
      zone.style.background = 'transparent';
    });
  }

  // Screens whose onScreenShow re-triggers a timed animation from
  // scratch, safely (no risk of wiping progress a user already made,
  // like a completed payroll connection) — the only ones fast-forward
  // is allowed to restart.
  var FAST_FORWARD_SCREENS = { connect: true, credentials: true, download: true, 'module-demo': true };

  function fastForwardCurrentScreen() {
    var current = document.querySelector('.screen.active');
    var id = current && current.dataset.screen;
    if (id && FAST_FORWARD_SCREENS[id]) onScreenShow(id);
  }

  function toggleDemoFast() {
    demoFast = !demoFast;
    reduceMotion = osReduceMotion || demoFast;
    var zone = document.getElementById('demo-tap-zone');
    if (zone) zone.classList.toggle('fast', demoFast);
    pulseTapZone(demoFast ? 'rgba(184,108,45,0.4)' : 'rgba(120,120,120,0.3)');
    if (demoFast) fastForwardCurrentScreen();
  }

  function closeJumpMenu() {
    var menu = document.getElementById('demo-jump-menu');
    if (menu) { menu.style.display = 'none'; menu.innerHTML = ''; }
  }

  function openJumpMenu() {
    var menu = document.getElementById('demo-jump-menu');
    if (!menu) return;
    var rows = SCREENS.map(function (id) {
      return '<div data-jump="' + id + '" style="padding:0.55rem 0.9rem;font-size:0.78rem;font-weight:600;border-bottom:1px solid rgba(0,0,0,.08);cursor:pointer;">' + (SCREEN_LABELS[id] || id) + '</div>';
    }).join('');
    menu.innerHTML =
      '<div id="demo-jump-backdrop" style="position:absolute;inset:0;background:rgba(20,20,15,.45);z-index:1000;display:flex;align-items:center;justify-content:center;">' +
        '<div style="background:#fff;border-radius:0.9rem;max-height:70%;width:82%;overflow-y:auto;box-shadow:0 1rem 2rem rgba(0,0,0,.3);">' +
          rows +
        '</div>' +
      '</div>';
    menu.style.display = 'block';
  }

  document.addEventListener('click', function (e) {
    if (e.target.id === 'demo-jump-backdrop') { closeJumpMenu(); return; }
    var jump = e.target.closest('[data-jump]');
    if (jump) { closeJumpMenu(); showScreen(jump.dataset.jump, { skipHistory: true }); return; }
  });

  var tapZone = document.getElementById('demo-tap-zone');
  if (tapZone) {
    tapZone.classList.toggle('fast', demoFast);
    var pressStart = 0;
    // stopPropagation on every stage: this zone sits inside #app, whose
    // click-delegation handler (".back-btn" etc.) would otherwise see the
    // synthetic click a pointerup produces and could act on it.
    tapZone.addEventListener('pointerdown', function (e) { pressStart = Date.now(); e.stopPropagation(); });
    tapZone.addEventListener('pointerup', function (e) {
      e.stopPropagation();
      var held = Date.now() - pressStart;
      if (held >= 600) { openJumpMenu(); return; }
      toggleDemoFast();
    });
    tapZone.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  renderPicker();
  showScreen('cover');

  // Safety net: the cover GIF fades in via its own onload, but if that
  // somehow never fires (odd cache edge case), don't leave it invisible.
  setTimeout(function () {
    var coverImg = document.querySelector('.cover-rudy');
    if (coverImg) coverImg.classList.add('loaded');
  }, 2500);
})();
