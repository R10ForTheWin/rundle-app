// Router + event wiring for the real Rundle app.
// render.js defines renderAll/renderMap/etc and writes into these screens;
// this file decides which screen is visible and what triggers what.

(function () {
  var SCREENS = ['cover', 'picker', 'connect', 'credentials', 'download', 'employment', 'verified-skills',
    'assessment-gateway', 'module-demo', 'mapping',
    'home', 'skill-detail', 'review', 'chart-review', 'match-detail', 'training', 'profile', 'positions'];

  var selectedPersona = PERSONAS[0];
  var chartReviewDone = false;
  var chartReviewStep = 0;
  var assessmentDone = false;
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
    } else if (id === 'skill-detail') {
      renderSkillDetail(selectedPersona, STORY[selectedPersona.id], chartReviewDone);
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
      var continueBtn = document.getElementById('picker-continue-btn');
      if (continueBtn) continueBtn.classList.remove('pending');
      return;
    }

    if (e.target.closest('#picker-continue-btn')) {
      if (!e.target.closest('#picker-continue-btn').classList.contains('pending')) showScreen('connect');
      return;
    }

    if (e.target.closest('#connect-cta')) { showScreen('credentials'); return; }

    if (e.target.closest('#login-btn')) {
      confirmLogin(function () { showScreen('download', { skipHistory: true }); });
      return;
    }

    var provider = e.target.closest('.employment-provider:not(.connected):not(.connecting)');
    if (provider) { toggleProviderSelect(provider); return; }

    var connectBtn = e.target.closest('#employment-connect-btn');
    if (connectBtn) {
      if (connectBtn.classList.contains('done')) { showScreen('verified-skills'); return; }
      if (!connectBtn.classList.contains('pending')) {
        var selectedProvider = document.querySelector('.employment-provider.selected');
        if (selectedProvider) connectEmployment(selectedProvider, selectedProvider.dataset.provider, 'payroll');
      }
      return;
    }

    var uploadCard = e.target.closest('#employment-upload:not(.connected)');
    if (uploadCard) { connectEmployment(uploadCard, 'your resume', 'resume'); return; }

    if (e.target.closest('#employment-manual-btn')) {
      var manualBtn = document.getElementById('employment-manual-btn');
      if (manualBtn) unlockEmploymentContinue();
      return;
    }

    if (e.target.closest('#employment-continue-btn')) {
      if (!e.target.closest('#employment-continue-btn').classList.contains('pending')) showScreen('verified-skills');
      return;
    }

    if (e.target.closest('#download-next-btn')) {
      showScreen('employment', { skipHistory: true });
      return;
    }

    var checkRow = e.target.closest('.check-row');
    if (checkRow) { checkRow.classList.toggle('checked'); return; }

    if (e.target.closest('#verified-skills-continue-btn')) {
      showScreen(assessmentDone ? 'mapping' : 'assessment-gateway');
      return;
    }
    if (e.target.closest('#verified-skills-view-all')) { showScreen('skill-detail'); return; }
    if (e.target.closest('#gateway-start-module2')) { showScreen('module-demo'); return; }
    if (e.target.closest('#home-next-review')) { showScreen('review'); return; }
    if (e.target.closest('#module-demo-replay')) { renderModuleDemo(); return; }
    if (e.target.closest('#module-demo-continue')) {
      assessmentDone = true;
      showScreen('verified-skills', { skipHistory: true });
      return;
    }
    if (e.target.closest('.skill-row')) { showScreen('skill-detail'); return; }
    if (e.target.closest('#skilldetail-next-review')) { showScreen('review'); return; }
    if (e.target.closest('#skilldetail-back-home')) { showScreen('verified-skills', { skipHistory: true }); return; }

    if (e.target.closest('#strengthen-evidence-btn')) { showScreen('chart-review'); return; }
    if (e.target.closest('#review-view-evidence-btn')) { showScreen('skill-detail'); return; }

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

  renderPicker();
  showScreen('cover');
})();
