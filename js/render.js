// Rendering functions — ported from the reviewed mockup.
// Pure(ish): each render* function reads PERSONAS/STORY and writes into
// known mount points in index.html. Navigation lives in app.js.

// osReduceMotion is the real accessibility signal and never changes.
// reduceMotion is what every animation actually checks — app.js's hidden
// demo-fast toggle can force it on for reruns without touching every call site.
var osReduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var reduceMotion = osReduceMotion;

// ============================================================
// Source-document builders (Downloading screen)
// ============================================================
var sources = [
  { key: 'cos', url: 'careeronestop.org/.../find-certifications.aspx', label: 'CareerOneStop' },
  { key: 'onet', url: 'onetonline.org/link/summary/29-2072.00', label: 'O·NET OnLine' },
  { key: 'bls', url: 'bls.gov/oes/current/oes292072.htm', label: 'U.S. Bureau of Labor Statistics' },
  { key: 'ahima', url: 'ahima.org/certification/verify', label: 'AHIMA' }
];

function skeleton(pid, src) {
  return '' +
    '<div class="src-skel" id="slot-' + pid + '-' + src.key + '">' +
      '<div class="src-chrome"><span class="sdot"></span><span class="sdot"></span><span class="sdot"></span><span class="surl">' + src.url + '</span></div>' +
      '<div class="src-skel-body"><span class="spin"></span><span class="src-skel-text">Connecting to ' + src.label + '&hellip;<span class="u">' + src.url + '</span></span></div>' +
    '</div>';
}

function onetDoc(p) { var name = p.name;
  return '' +
    '<div class="src-doc src-onet">' +
      '<div class="src-chrome"><span class="sdot"></span><span class="sdot"></span><span class="sdot"></span><span class="surl">onetonline.org/link/summary/29-2072.00</span></div>' +
      '<div class="src-head"><div class="mark img"><img src="assets/img/logo-onet.png" alt="" /></div><div><div class="org">O&middot;NET OnLine</div><div class="sub">Sponsored by the U.S. Department of Labor, Employment &amp; Training Administration</div></div></div>' +
      '<div class="src-body">' +
        '<div class="row"><span class="k">Occupation</span><span class="v">Medical Records Specialists</span></div>' +
        '<div class="row"><span class="k">O&middot;NET-SOC Code</span><span class="v">29-2072.00</span></div>' +
        '<div class="row"><span class="k">Job Zone</span><span class="v">3 &middot; Medium Preparation</span></div>' +
        '<div class="row"><span class="k">Median Wage</span><span class="v">$24.59/hr &middot; $51,140/yr</span></div>' +
        '<div class="lbl">Work Styles (Importance)</div>' +
        '<div class="row"><span class="k">Attention to Detail</span><span class="v">100</span></div>' +
        '<div class="row"><span class="k">Dependability</span><span class="v">88</span></div>' +
        '<div class="row"><span class="k">Integrity</span><span class="v">77</span></div>' +
        '<div class="lbl">Hot Technologies</div>' +
        '<div class="row"><span class="k">Epic Systems, 3M Encoder, DRG grouping software</span></div>' +
      '</div>' +
      '<div class="src-foot">Referenced for ' + name + ' &middot; O&middot;NET 29.3 Database</div>' +
    '</div>';
}

function blsDoc(p) { var name = p.name;
  return '' +
    '<div class="src-doc src-bls">' +
      '<div class="src-chrome"><span class="sdot"></span><span class="sdot"></span><span class="sdot"></span><span class="surl">bls.gov/oes/current/oes292072.htm</span></div>' +
      '<div class="src-head"><div class="mark img"><img src="assets/img/logo-bls.jpg" alt="" /></div><div><div class="org">U.S. Bureau of Labor Statistics</div><div class="sub">Occupational Employment &amp; Wage Statistics</div></div></div>' +
      '<div class="src-body">' +
        '<div class="row"><span class="k">SOC Code</span><span class="v">29-2072</span></div>' +
        '<div class="row"><span class="k">Employment (2024)</span><span class="v">194,800</span></div>' +
        '<div class="row"><span class="k">Median Annual Wage</span><span class="v">$51,140</span></div>' +
        '<div class="row"><span class="k">Median Hourly Wage</span><span class="v">$24.59</span></div>' +
        '<div class="row"><span class="k">Projected Growth &rsquo;24&ndash;&rsquo;34</span><span class="v">7%+</span></div>' +
        '<div class="row"><span class="k">Projected Openings/yr</span><span class="v">14,200</span></div>' +
      '</div>' +
      '<div class="src-foot">Referenced for ' + name + ' &middot; U.S. BLS, Occupational Employment &amp; Wage Statistics</div>' +
    '</div>';
}

function cosDoc(p) { var name = p.name;
  return '' +
    '<div class="src-doc src-cos">' +
      '<div class="src-chrome"><span class="sdot"></span><span class="sdot"></span><span class="sdot"></span><span class="surl">careeronestop.org/.../find-certifications.aspx</span></div>' +
      '<div class="src-head"><div class="mark img"><img src="assets/img/logo-cos.png" alt="" /></div><div><div class="org">CareerOneStop</div><div class="sub">Sponsored by the U.S. Department of Labor</div></div></div>' +
      '<div class="src-body">' +
        '<div class="row"><span class="k">Certification</span><span class="v">Certified Coding Specialist (CCS)</span></div>' +
        '<div class="row"><span class="k">Organization</span><span class="v">AHIMA</span></div>' +
        '<div class="row"><span class="k">Type</span><span class="v">National Certification</span></div>' +
        '<div class="row"><span class="k">Education/Training Req&rsquo;d?</span><span class="v">Yes</span></div>' +
        '<div class="row"><span class="k">Work Experience Req&rsquo;d?</span><span class="v">Yes</span></div>' +
        '<div class="row"><span class="k">Renewal Required?</span><span class="v">Every 2 Year(s)</span></div>' +
      '</div>' +
      '<div class="src-foot">Referenced for ' + name + ' &middot; CareerOneStop Certification Finder</div>' +
    '</div>';
}

function ahimaDoc(p) {
  var statusHtml = p.status === 'active'
    ? '<span class="src-status active">Active</span>'
    : '<span class="src-status pending">Exam scheduled</span>';
  var idRow = p.credId
    ? '<div class="row"><span class="k">Credential ID</span><span class="v">' + p.credId + '</span></div>'
    : '<div class="row"><span class="k">Credential ID</span><span class="v">Pending exam</span></div>';
  var dateRows = p.issue
    ? '<div class="row"><span class="k">Issue Date</span><span class="v">' + p.issue + '</span></div>' +
      '<div class="row"><span class="k">Renewal Due</span><span class="v">' + p.renew + '</span></div>'
    : '<div class="row"><span class="k">Target Exam</span><span class="v">' + p.pendingNote + '</span></div>';
  return '' +
    '<div class="src-doc src-ahima">' +
      '<div class="src-chrome"><span class="sdot"></span><span class="sdot"></span><span class="sdot"></span><span class="surl">ahima.org/certification/verify</span></div>' +
      '<div class="src-head"><div class="mark img wide"><img src="assets/img/logo-ahima.png" alt="" /></div><div><div class="org">AHIMA</div><div class="sub">American Health Information Management Association &middot; Credential Verification</div></div></div>' +
      '<div class="src-body">' +
        '<div class="row"><span class="k">Name</span><span class="v">' + p.name + '</span></div>' +
        '<div class="row"><span class="k">Credential</span><span class="v">' + p.cred + '</span></div>' +
        idRow + dateRows +
        '<div class="row"><span class="k">Status</span>' + statusHtml + '</div>' +
      '</div>' +
      '<div class="src-foot">AHIMA Credential Verification Service</div>' +
    '</div>';
}

var docBuilders = { onet: onetDoc, bls: blsDoc, cos: cosDoc, ahima: ahimaDoc };

// ============================================================
// Login typewriter (credentials screen)
// ============================================================
function typeInto(el, text, speed, done) {
  if (reduceMotion) { el.textContent = text; if (done) done(); return; }
  var i = 0;
  (function step() {
    el.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) { setTimeout(step, speed); } else if (done) { done(); }
  })();
}

// Password field: two letters stay visible at a time in a trailing window,
// then fold into dots as typing continues — slow enough to read the joke.
function typePasswordReveal(el, text, speed, done) {
  if (reduceMotion) { el.textContent = '•'.repeat(text.length); if (done) done(); return; }
  var i = 0;
  (function step() {
    if (i >= text.length) {
      setTimeout(function () {
        el.textContent = '•'.repeat(text.length);
        if (done) done();
      }, speed);
      return;
    }
    var dotsEnd = Math.max(0, i - 1);
    el.textContent = '•'.repeat(dotsEnd) + text.slice(dotsEnd, i + 1);
    i++;
    setTimeout(step, speed);
  })();
}

// Auto-checks each source one after another, then flips the CTA from
// pending copper to ready green once all four have checked in. AHIMA
// already got its real login on an earlier screen — this box just
// confirms it's included.
function playConnectAutoCheck() {
  var order = ['onet', 'bls', 'cos', 'ahima'];
  var ctaBtn = document.getElementById('connect-cta');
  var step = reduceMotion ? 0 : 550;
  order.forEach(function (key, i) {
    setTimeout(function () {
      var row = document.querySelector('.check-row[data-source="' + key + '"]');
      if (row) row.classList.add('checked');
    }, 450 + i * step);
  });
  setTimeout(function () {
    if (ctaBtn) ctaBtn.classList.remove('pending');
  }, 450 + order.length * step + 250);
}

function playLoginTypewriter() {
  var loginUser = document.getElementById('login-user');
  var loginPass = document.getElementById('login-pass');
  var caretUser = document.getElementById('caret-user');
  var caretPass = document.getElementById('caret-pass');
  var btn = document.getElementById('login-btn');
  var status = document.getElementById('login-status');
  if (!loginUser || !loginPass) return;
  loginUser.textContent = ''; loginPass.textContent = '';
  if (caretUser) caretUser.style.display = '';
  if (caretPass) caretPass.style.display = '';
  btn.textContent = 'Log in';
  btn.style.background = '';
  btn.classList.add('pending');
  status.textContent = '';
  setTimeout(function () {
    typeInto(loginUser, 'Demo_Login', 110, function () {
      if (caretUser) caretUser.style.display = 'none';
      setTimeout(function () {
        typePasswordReveal(loginPass, 'DATA_FLYWHEEL!', 380, function () {
          if (caretPass) caretPass.style.display = 'none';
          status.textContent = 'Tap Log in to connect to AHIMA.';
          btn.classList.remove('pending');
        });
      }, 550);
    });
  }, reduceMotion ? 0 : 900);
}

// Requires an explicit tap on #login-btn — never auto-triggered.
function confirmLogin(onDone) {
  var btn = document.getElementById('login-btn');
  var status = document.getElementById('login-status');
  if (!btn || btn.textContent === 'Connected') return;
  btn.textContent = 'Connected';
  btn.style.background = 'linear-gradient(135deg, var(--good), #3F5C38)';
  if (status) status.textContent = 'Connected to AHIMA. Nothing is sent anywhere — demo only.';
  if (onDone) setTimeout(onDone, reduceMotion ? 0 : 900);
}

// ============================================================
// Downloading screen
// ============================================================
var dlMount = document.getElementById('download-list');
var dlToken = 0;

function flyToInbox(sourceEl, inboxId) {
  var screenEl = sourceEl.closest('.screen');
  var inbox = document.getElementById(inboxId || 'dl-inbox');
  if (!screenEl || !inbox || reduceMotion) return;
  var screenRect = screenEl.getBoundingClientRect();
  var fromRect = sourceEl.getBoundingClientRect();
  var toRect = inbox.getBoundingClientRect();
  var fly = document.createElement('div');
  fly.className = 'fly-doc';
  fly.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13H7Z"/><path d="M14 3v5h5"/></svg>';
  fly.style.left = (fromRect.left - screenRect.left + fromRect.width / 2 - 10) + 'px';
  fly.style.top = (fromRect.top - screenRect.top + 8) + 'px';
  screenEl.appendChild(fly);
  requestAnimationFrame(function () {
    var dx = (toRect.left - screenRect.left + toRect.width / 2 - 10) - (fromRect.left - screenRect.left + fromRect.width / 2 - 10);
    var dy = (toRect.top - screenRect.top + toRect.height / 2 - 10) - (fromRect.top - screenRect.top + 8);
    fly.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.4)';
    fly.style.opacity = '0';
  });
  setTimeout(function () {
    fly.remove();
    inbox.classList.remove('pulse');
    void inbox.offsetWidth;
    inbox.classList.add('pulse');
  }, 1650);
}

// ============================================================
// Employment step — connect payroll, upload a resume, or enter it
// manually. Every path is click-triggered (same interaction model as
// the Connect-your-sources checkboxes): nothing auto-plays, the
// worker's click is what starts the connecting -> connected animation.
// ============================================================
var EMPLOYMENT_PROVIDERS = ['Workday', 'ADP', 'UKG', 'Paycom'];
var employmentPersona = null;
// Set once connectEmployment finishes, so Verified Skills can show the
// same employment-history card without knowing which provider (or
// resume) the demo run actually used.
var employmentConnection = null;

function employmentHistoryCard(story) {
  if (!employmentConnection) return '';
  var tl = story.employer.map(function (e) {
    return '<div class="tl-item"><div class="tl-date">' + e.from + ' &mdash; ' + e.to + '</div><div class="tl-title">' + e.title + '</div><div class="tl-sub">' + e.role + '</div></div>';
  }).join('');
  var head = employmentConnection.kind === 'payroll'
    ? '<span class="ep-logo" style="height:1.1rem;padding:0.1rem 0.3rem;"><img src="assets/img/' + employmentConnection.brand.logo + '" alt="' + employmentConnection.sourceLabel + '" /></span>Verified from ' + employmentConnection.sourceLabel + '<span class="trust employer">Employer-verified</span>'
    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>Extracted from your resume<span class="trust documented">Documented</span>';
  return '<div class="card employment-result-card"><div class="employment-result-head">' + head + '</div><div class="timeline">' + tl + '</div></div>';
}

function renderEmployment(persona, story) {
  employmentPersona = persona;
  employmentConnection = null;
  var el = document.getElementById('employment-body');
  if (!el) return;
  var inboxCount = document.getElementById('employment-inbox-count');
  if (inboxCount) inboxCount.textContent = '0/1';
  var providerRows = EMPLOYMENT_PROVIDERS.map(function (name, i) {
    var delay = ' style="animation-delay:' + (0.06 + i * 0.05).toFixed(2) + 's"';
    var brand = PAYROLL_BRAND[name];
    return '<div class="employment-provider reveal-row" data-provider="' + name + '"' + delay + '>' +
      '<div class="ep-logo"><img src="assets/img/' + brand.logo + '" alt="' + name + '" /></div>' +
      '<div class="ep-radio"><span class="ep-radio-spin"></span><svg class="ep-radio-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg></div>' +
      '</div>';
  }).join('');
  el.innerHTML =
    '<div class="matches-empty-note reveal-row" style="animation-delay:0s;">' +
      '<img class="matches-empty-avatar" src="assets/img/rudy-note.png?v=3" alt="Rudy" />' +
      '<div class="matches-empty-bubble"><p>Pick whichever one holds your paystubs &mdash; I&rsquo;ll do the rest.</p></div>' +
    '</div>' +
    '<div class="card reveal-row" style="animation-delay:0.05s"><div class="card-title-row"><span class="card-title">Connect your payroll account</span></div>' +
      '<div class="employment-providers" id="employment-providers">' + providerRows + '</div>' +
      '<div class="employment-hint">Your employer is never contacted. 200+ providers supported.</div>' +
      '<div class="employment-connect-cta pending" id="employment-connect-btn">Select a provider to connect</div>' +
    '</div>' +
    '<div id="employment-alt-section">' +
      '<div class="employment-or reveal-row" style="animation-delay:0.3s">or</div>' +
      '<div class="card employment-manual reveal-row" style="animation-delay:0.35s">' +
        '<div class="employment-upload" id="employment-upload">' +
          '<div class="employment-upload-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M12 4 7 9M12 4l5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg></div>' +
          '<div><div class="employment-upload-title">Upload your resume</div><div class="employment-upload-sub">PDF or DOCX &mdash; we&rsquo;ll pull your work history from it</div></div>' +
          '<div class="ep-status"><span class="ep-spin"></span><span class="ep-check">&#10003; Extracted</span></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="employment-result"></div>';
  var continueBtn = document.getElementById('employment-continue-btn');
  if (continueBtn) { continueBtn.classList.add('pending'); continueBtn.textContent = 'Continue'; }
  var bottomCta = document.getElementById('employment-bottom-cta');
  if (bottomCta) bottomCta.style.display = 'none';
}

function toggleProviderSelect(tile) {
  var wasSelected = tile.classList.contains('selected');
  var providersEl = document.getElementById('employment-providers');
  if (providersEl) {
    providersEl.querySelectorAll('.employment-provider.selected').forEach(function (t) { t.classList.remove('selected'); });
  }
  var btn = document.getElementById('employment-connect-btn');
  var altSection = document.getElementById('employment-alt-section');
  if (wasSelected) {
    if (btn) { btn.classList.add('pending'); btn.textContent = 'Select a provider to connect'; }
    if (altSection) altSection.style.display = '';
    return;
  }
  tile.classList.add('selected');
  if (btn) { btn.classList.remove('pending'); btn.textContent = 'Connect to ' + tile.dataset.provider; }
  if (altSection) altSection.style.display = 'none';
}

// Payroll providers get the same "pull a real source" treatment as the
// Download screen — a browser-chrome skeleton that morphs into a doc
// full of the worker's actual employment record, THEN the trust-tagged
// timeline card underneath it. Resume/manual keep the simpler single-step reveal.
var PAYROLL_BRAND = {
  Workday: { color: '#3069B5', logo: 'logo-workday.svg', url: 'workday.com/wd/employee/worker-history' },
  ADP: { color: '#EE2722', logo: 'logo-adp.svg', url: 'adp.com/workforcenow/employment-verification' },
  UKG: { color: '#005857', logo: 'logo-ukg.svg', url: 'ukg.com/portal/employment-record' },
  Paycom: { color: '#00833E', logo: 'logo-paycom.svg', url: 'paycom.com/employee/employment-history' }
};

function payrollSkeleton(sourceLabel, brand) {
  return '<div class="src-skel" id="employment-skel">' +
    '<div class="src-chrome"><span class="sdot"></span><span class="sdot"></span><span class="sdot"></span><span class="surl">' + brand.url + '</span></div>' +
    '<div class="src-skel-body"><span class="spin"></span><span class="src-skel-text">Connecting to ' + sourceLabel + '&hellip;<span class="u">' + brand.url + '</span></span></div>' +
  '</div>';
}

function payrollDoc(sourceLabel, brand, persona) {
  var current = STORY[persona.id].employer[0];
  return '<div class="src-doc">' +
    '<div class="src-chrome"><span class="sdot"></span><span class="sdot"></span><span class="sdot"></span><span class="surl">' + brand.url + '</span></div>' +
    '<div class="src-head" style="background:' + brand.color + ';">' +
      '<div class="mark payroll-mark"><img src="assets/img/' + brand.logo + '" alt="' + sourceLabel + '" /></div>' +
      '<div><div class="org">' + sourceLabel + '</div><div class="sub">Employment &amp; payroll records</div></div>' +
    '</div>' +
    '<div class="src-body">' +
      '<div class="row"><span class="k">Employee</span><span class="v">' + persona.name + '</span></div>' +
      '<div class="row"><span class="k">Employer</span><span class="v">' + current.title + '</span></div>' +
      '<div class="row"><span class="k">Position</span><span class="v">' + current.role + '</span></div>' +
      '<div class="row"><span class="k">Start Date</span><span class="v">' + current.from + '</span></div>' +
      '<div class="row"><span class="k">Status</span><span class="v">Active</span></div>' +
    '</div>' +
    '<div class="src-foot">Referenced for ' + persona.name + ' &middot; ' + sourceLabel + ' Employment Verification</div>' +
  '</div>';
}

function connectEmployment(el, sourceLabel, kind) {
  if (el.classList.contains('connecting') || el.classList.contains('connected')) return;
  el.classList.remove('selected');
  el.classList.add('connecting');
  var connectBtn = document.getElementById('employment-connect-btn');
  var providersEl = document.getElementById('employment-providers');
  var result = document.getElementById('employment-result');

  if (kind === 'payroll') {
    if (providersEl) providersEl.classList.add('locked');
    if (connectBtn) { connectBtn.classList.add('pending'); connectBtn.textContent = 'Connecting to ' + sourceLabel + '…'; }
    var brand = PAYROLL_BRAND[sourceLabel] || { color: 'var(--sienna)', url: sourceLabel.toLowerCase() + '.com' };
    if (result) result.innerHTML = '<div class="reveal-row">' + payrollSkeleton(sourceLabel, brand) + '</div>';

    setTimeout(function () {
      el.classList.remove('connecting');
      el.classList.add('connected');
      if (connectBtn) { connectBtn.classList.remove('pending'); connectBtn.textContent = 'Connected to ' + sourceLabel; }
      var skel = document.getElementById('employment-skel');
      if (skel) flyToInbox(skel, 'employment-inbox');
      var countEl = document.getElementById('employment-inbox-count');
      if (countEl) countEl.textContent = '1/1';
      if (result) result.innerHTML = '<div class="reveal-row">' + payrollDoc(sourceLabel, brand, employmentPersona) + '</div>';
    }, reduceMotion ? 0 : 1500);

    setTimeout(function () {
      if (connectBtn) connectBtn.classList.add('done');
      employmentConnection = { kind: 'payroll', sourceLabel: sourceLabel, brand: brand };
      if (result) {
        var empStory = STORY[employmentPersona.id];
        var tl = empStory.employer.map(function (e) {
          return '<div class="tl-item"><div class="tl-date">' + e.from + ' &mdash; ' + e.to + '</div><div class="tl-title">' + e.title + '</div><div class="tl-sub">' + e.role + '</div></div>';
        }).join('');
        result.insertAdjacentHTML('beforeend',
          '<div class="card employment-result-card reveal-row">' +
            '<div class="employment-result-head"><span class="ep-logo" style="height:1.1rem;padding:0.1rem 0.3rem;"><img src="assets/img/' + brand.logo + '" alt="' + sourceLabel + '" /></span>Verified from ' + sourceLabel + '<span class="trust employer">Employer-verified</span></div>' +
            '<div class="timeline">' + tl + '</div>' +
          '</div>'
        );
        var newCard = result.lastElementChild;
        if (newCard && !reduceMotion) setTimeout(function () { newCard.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 50);
      }
      unlockEmploymentContinue();
    }, reduceMotion ? 0 : 2400);
    return;
  }

  setTimeout(function () {
    el.classList.remove('connecting');
    el.classList.add('connected');
    employmentConnection = { kind: 'resume' };
    if (result) {
      var empStory = STORY[employmentPersona.id];
      var tl = empStory.employer.map(function (e) {
        return '<div class="tl-item"><div class="tl-date">' + e.from + ' &mdash; ' + e.to + '</div><div class="tl-title">' + e.title + '</div><div class="tl-sub">' + e.role + '</div></div>';
      }).join('');
      result.innerHTML =
        '<div class="card employment-result-card reveal-row">' +
          '<div class="employment-result-head"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>Extracted from your resume<span class="trust documented">Documented</span></div>' +
          '<div class="timeline">' + tl + '</div>' +
        '</div>';
    }
    unlockEmploymentContinue();
  }, 1100);
}

function unlockEmploymentContinue() {
  var continueBtn = document.getElementById('employment-continue-btn');
  if (continueBtn) { continueBtn.classList.remove('pending'); continueBtn.textContent = 'Connected — Continue'; }
  var bottomCta = document.getElementById('employment-bottom-cta');
  if (bottomCta) bottomCta.style.display = '';
}

function playDownload(persona, onDone) {
  dlMount = document.getElementById('download-list');
  if (!dlMount) return;
  var myToken = ++dlToken;
  var status = document.getElementById('dl-status');
  if (status) status.textContent = 'Pulling ' + persona.name.split(' ')[0] + '’s records from each source…';
  dlMount.innerHTML = sources.map(function (s) { return skeleton(persona.id, s); }).join('');
  var countEl = document.getElementById('dl-count');
  var received = 0;
  if (countEl) countEl.textContent = '0/' + sources.length;
  var step = reduceMotion ? 0 : 1900;
  sources.forEach(function (s, i) {
    setTimeout(function () {
      if (myToken !== dlToken) return; // a newer selection superseded this run
      var slot = document.getElementById('slot-' + persona.id + '-' + s.key);
      if (slot) {
        flyToInbox(slot);
        slot.outerHTML = docBuilders[s.key](persona);
        dlMount.scrollTo({ top: dlMount.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      received++;
      if (countEl) countEl.textContent = received + '/' + sources.length;
      if (i === sources.length - 1) {
        var st = document.getElementById('dl-status');
        if (st) st.textContent = 'All sources verified for ' + persona.name + '.';
        if (onDone) setTimeout(onDone, 1200);
      }
    }, reduceMotion ? 0 : step * (i + 1) + 700);
  });
}

// ============================================================
// Screens 6-13
// ============================================================
var tierLabel = { expert: 'Expert', advanced: 'Advanced', developing: 'Developing' };
var trustLabel = { credential: 'Credential-verified', employer: 'Employer-verified', documented: 'Documented', simulated: 'Simulation-verified' };

// ============================================================
// Chart review ("strengthen this evidence") — optional, untimed,
// no fixed answer key. Same 3 charts regardless of persona/skill.
// ============================================================
var CHART_REVIEW_CHARTS = [
  {
    id: 'Encounter #4471', type: 'Inpatient · 3-day stay',
    rows: [
      { label: 'Principal diagnosis', code: 'I50.9' },
      { label: 'Secondary diagnosis', code: 'E11.9', flagged: true },
      { label: 'Procedure', code: '5A1955Z' }
    ],
    prompt: 'The AI wasn’t confident E11.9 captures the full picture here. Does the documentation support a more specific code?'
  },
  {
    id: 'Encounter #2938', type: 'Outpatient visit',
    rows: [
      { label: 'Principal diagnosis', code: 'J45.909', flagged: true },
      { label: 'Secondary diagnosis', code: 'Z79.899' }
    ],
    prompt: 'AI flagged possible undercoding on the principal diagnosis — documentation mentions “status asthmaticus.” Worth a closer look?'
  },
  {
    id: 'Encounter #5502', type: 'Inpatient · 6-day stay',
    rows: [
      { label: 'Principal diagnosis', code: 'N17.9' },
      { label: 'Secondary diagnosis', code: 'E87.6', flagged: true }
    ],
    prompt: 'Labs show a potassium level of 3.1 mEq/L, but no matching diagnosis code was drafted. Missing something?'
  }
];
var CHART_REVIEW_SUMMARY = CHART_REVIEW_CHARTS.length + ' flagged charts reviewed · 1 real gap caught · Aug 2026';

// ============================================================
// Module 1 demo (Chart Coding Review) — a hands-off auto-play for
// presentation audiences, not the real graded module. Each synthetic
// chart poses a real yes/no judgment call with two candidate answers;
// a cursor visibly deliberates between them (so the audience can guess
// along in their own head) before landing on the correct one and
// revealing the finding. No clicking required from the presenter.
// ============================================================
var MODULE_DEMO_CHARTS = [
  {
    title: 'Synthetic chart &middot; Diabetic CKD', type: 'Inpatient &middot; 3-day stay',
    label: 'Principal diagnosis',
    aiCode: 'E11.22 &middot; Diabetes with diabetic CKD, plus N18.31',
    question: 'The provider never writes that the CKD is caused by the diabetes. Does the AI&rsquo;s link still hold?',
    choices: [
      { key: 'right', label: 'Yes &mdash; no query needed' },
      { key: 'query', label: 'No &mdash; query to confirm the link' },
      { key: 'fix', label: 'No &mdash; code diabetes alone' },
      { key: 'unrelated', label: 'No &mdash; code them as unrelated conditions' }
    ],
    correct: 'right',
    isCorrection: false,
    explain: 'The word &ldquo;with&rdquo; in the ICD-10-CM index presumes a causal relationship unless the record states another cause &mdash; no query needed. Reaching for a query here is the most common wrong answer in the module, a habit left from before that convention was clarified.'
  },
  {
    title: 'Synthetic chart &middot; Sepsis', type: 'Inpatient &middot; 4-day stay',
    label: 'Diagnosis sequence',
    aiCode: '1&#41; N39.0 UTI &middot; 2&#41; A41.51 sepsis due to E. coli',
    question: 'BP 82/48, lactate 4.2, pressors for 12 hours, sepsis present on admission. Which comes first &mdash; the UTI, or the sepsis?',
    choices: [
      { key: 'uti', label: 'The UTI' },
      { key: 'sepsis', label: 'The sepsis' },
      { key: 'shock', label: 'Add septic shock too &mdash; pressors were used' },
      { key: 'query', label: 'Query the provider to confirm it was present on admission' }
    ],
    correct: 'sepsis',
    isCorrection: true,
    newCode: '1&#41; A41.51 sepsis due to E. coli &middot; 2&#41; N39.0 UTI',
    explain: 'Sepsis present on admission and meeting principal-diagnosis criteria sequences first &mdash; that&rsquo;s already stated, so a query is unnecessary. Septic shock is the other trap &mdash; it needs the provider to document it; pressor use is a clinical indicator, not documentation on its own. This moves the case out of the UTI DRG family entirely &mdash; the biggest dollar swing in the set.',
    impact: '+$3,400 case value'
  },
  {
    title: 'Synthetic chart &middot; UTI', type: 'Inpatient &middot; 3-day stay',
    label: 'Secondary diagnosis',
    aiCode: 'N39.0 &middot; Urinary tract infection, site not specified',
    question: 'No urine culture, no antibiotic order, no note describing an infection. What should happen to this code?',
    choices: [
      { key: 'keep', label: 'Keep it as coded' },
      { key: 'remove', label: 'Remove it &mdash; not supported' },
      { key: 'upgrade', label: 'Make it more specific instead' },
      { key: 'query', label: 'Query the provider to confirm the infection' }
    ],
    correct: 'remove',
    isCorrection: true,
    removeCode: true,
    explain: 'No culture, no antibiotic order, no clinical note backing up an infection. A code the documentation doesn&rsquo;t support gets removed, not made more specific or sent back on a query &mdash; there&rsquo;s nothing in the chart for a query to confirm.',
    impact: 'Improper payment averted'
  },
  {
    title: 'Synthetic chart &middot; COPD exacerbation', type: 'Inpatient &middot; 4-day stay',
    label: 'Secondary diagnosis',
    aiCode: 'No secondary diagnosis coded',
    ghost: true,
    question: 'Labs show sodium at 128 mEq/L. The note says &ldquo;encouraged fluids, monitored levels.&rdquo; Which code fits?',
    choices: [
      { key: 'dehydration', label: 'E86.0 &middot; Dehydration' },
      { key: 'hyponatremia', label: 'E87.1 &middot; Hyponatremia' },
      { key: 'aki', label: 'N17.9 &middot; Acute kidney injury' },
      { key: 'fluid', label: 'E87.8 &middot; Other fluid balance disorder' }
    ],
    correct: 'hyponatremia',
    isCorrection: true,
    newCode: 'E87.1 &middot; Hyponatremia',
    explain: '128 mEq/L is the lab definition of hyponatremia specifically. The other three are close clinical neighbors &mdash; a vaguer fluid-balance code included &mdash; but each needs its own supporting evidence in the note, and the lab value only backs up one of them.',
    impact: '+$720 case value'
  },
  {
    title: 'Synthetic chart &middot; Heart failure history', type: 'Inpatient &middot; 3-day stay',
    label: 'Secondary diagnosis (AI flag)',
    aiCode: 'I50.32 &middot; Chronic diastolic heart failure (41% confidence)',
    question: 'Copied forward from an old history list &mdash; no workup, no mention this stay. Trust the score?',
    choices: [
      { key: 'score', label: 'Delete &mdash; under 50% confidence' },
      { key: 'judgment', label: 'Delete &mdash; no workup this stay, not reportable' },
      { key: 'accept', label: 'Accept &mdash; it&rsquo;s in the chart' },
      { key: 'query', label: 'Query the provider to confirm it&rsquo;s still active' }
    ],
    correct: 'judgment',
    isCorrection: true,
    removeCode: true,
    explain: 'The confidence score is a property of the model, not evidence about the patient &mdash; deleting because of a number you can&rsquo;t audit is still outsourcing the judgment. A query gets partial credit; it&rsquo;s reasonable but adds a step the chart facts already answer. This one is unreportable as-is: no workup, no treatment, just a copied history line.',
    impact: 'Improper payment averted'
  }
];
var MODULE_DEMO_CORRECTIONS = MODULE_DEMO_CHARTS.filter(function (c) { return c.isCorrection; }).length;
var MODULE_DEMO_CONFIRMED = MODULE_DEMO_CHARTS.length - MODULE_DEMO_CORRECTIONS;
var moduleDemoStep = 0;
var moduleDemoAnswer = null;
var moduleDemoTimers = [];

function scheduleModuleDemoTimer(fn, delay) {
  moduleDemoTimers.push(setTimeout(fn, delay));
}

function clearModuleDemoTimers() {
  moduleDemoTimers.forEach(clearTimeout);
  moduleDemoTimers = [];
}

function renderModuleDemo() {
  clearModuleDemoTimers();
  moduleDemoStep = 0;
  moduleDemoAnswer = null;
  var body = document.getElementById('module-demo-body');
  if (body) body.innerHTML = '';
  var badge = document.getElementById('module-demo-rec-badge');
  if (badge) badge.style.display = 'none';
  var modal = document.getElementById('recording-consent-modal');
  if (modal) modal.style.display = 'flex';
}

// Only fires from the modal's "I understand" button — starts the REC
// indicator and the auto-play once the recording notice is acknowledged.
function startModuleDemoRecording() {
  var modal = document.getElementById('recording-consent-modal');
  if (modal) modal.style.display = 'none';
  var badge = document.getElementById('module-demo-rec-badge');
  if (badge) badge.style.display = '';
  renderModuleDemoStep();
}

// No reveal screen — the cursor's "chosen" flash on the answer button
// (in autoPlayModuleDemoChoice, right before this fires) is the only
// feedback. This goes straight from one question to the next.
function answerModuleDemo(key) {
  if (moduleDemoAnswer) return;
  moduleDemoAnswer = key;
  clearModuleDemoTimers();
  scheduleModuleDemoTimer(function () {
    moduleDemoStep++;
    moduleDemoAnswer = null;
    renderModuleDemoStep();
  }, reduceMotion ? 300 : 700);
}

// Moves a cursor between the answer choices like someone weighing them
// (visiting up to 2 wrong ones first so a 3-option question still reads
// as deliberation, not a guess), then "clicks" the correct one — the
// audience gets to guess silently while it plays out, nothing to click
// themselves.
function autoPlayModuleDemoChoice(chart) {
  var cursor = document.getElementById('module-demo-cursor');
  var row = document.getElementById('module-demo-choices');
  if (!cursor || !row) return;
  var btns = row.querySelectorAll('.choice-btn');
  if (btns.length < 2) return;
  if (reduceMotion) { scheduleModuleDemoTimer(function () { answerModuleDemo(chart.correct); }, 200); return; }

  var correctIdx = chart.choices.findIndex(function (c) { return c.key === chart.correct; });
  var otherIdxs = [];
  for (var i = 0; i < btns.length; i++) { if (i !== correctIdx) otherIdxs.push(i); }
  var visitOrder = otherIdxs.slice(0, 2).concat([correctIdx]);

  function moveTo(idx) {
    var btn = btns[idx];
    var rowBox = row.getBoundingClientRect();
    var b = btn.getBoundingClientRect();
    cursor.style.left = (b.left - rowBox.left + b.width / 2) + 'px';
    cursor.style.top = (b.top - rowBox.top + b.height * 0.4) + 'px';
  }

  moveTo(visitOrder[0]);
  cursor.classList.add('visible');

  var stepMs = Math.max(850, Math.floor(2800 / visitOrder.length));
  visitOrder.forEach(function (idx, i) {
    scheduleModuleDemoTimer(function () {
      btns.forEach(function (b) { b.classList.remove('considering'); });
      moveTo(idx);
      btns[idx].classList.add('considering');
    }, 750 + i * stepMs);
  });

  var clickAt = 750 + (visitOrder.length - 1) * stepMs + stepMs * 0.7;
  scheduleModuleDemoTimer(function () {
    btns[correctIdx].classList.remove('considering');
    btns[correctIdx].classList.add('chosen');
    var ring = document.createElement('div');
    ring.className = 'demo-click-ring2';
    ring.style.left = cursor.style.left;
    ring.style.top = cursor.style.top;
    row.appendChild(ring);
    cursor.classList.remove('visible');
  }, clickAt);
  scheduleModuleDemoTimer(function () { answerModuleDemo(chart.correct); }, clickAt + 500);
}

function renderModuleDemoStep() {
  var el = document.getElementById('module-demo-body');
  if (!el) return;
  if (moduleDemoStep >= MODULE_DEMO_CHARTS.length) {
    el.innerHTML =
      '<div class="chart-review-scroll" style="padding-top:0.9rem;">' +
        '<div class="demo-summary demo-reveal">' +
          '<div class="evidence-preview">' +
            '<span class="tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>Demo complete</span>' +
            '<div class="line">' + MODULE_DEMO_CHARTS.length + ' charts reviewed &middot; ' + MODULE_DEMO_CORRECTIONS + ' corrections caught &middot; ' + MODULE_DEMO_CONFIRMED + ' confirmed &middot; this was a preview walkthrough, not a scored session</div>' +
          '</div>' +
          '<div class="demo-continue-cta" id="module-demo-continue">Show my new verified skills <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>' +
          '<div class="back-cta" id="module-demo-replay">&#8635; Replay demo</div>' +
        '</div>' +
      '</div>';
    return;
  }

  var chart = MODULE_DEMO_CHARTS[moduleDemoStep];
  var dots = MODULE_DEMO_CHARTS.map(function (c, i) {
    return '<div class="progress-dot' + (i < moduleDemoStep ? ' done' : (i === moduleDemoStep ? ' active' : '')) + '"></div>';
  }).join('');
  var head = '<div class="progress-row">' + dots + '<span class="progress-label">Module 1 &middot; chart ' + (moduleDemoStep + 1) + ' of ' + MODULE_DEMO_CHARTS.length + '</span></div>' +
    '<div class="demo-ribbon" style="margin:0 1.1rem 0.6rem;">&#9654; Watching a demo &mdash; this plays itself, nothing to tap</div>';
  var chartHead = '<div class="chart-head"><div><div class="demo-question-label">Question #' + (moduleDemoStep + 1) + '</div><div class="id">' + chart.title + '</div><div class="type">' + chart.type + '</div></div></div>';

  var letters = ['A', 'B', 'C', 'D'];
  var choiceBtns = chart.choices.map(function (c, i) {
    return '<div class="choice-btn"><span class="choice-letter">' + letters[i] + '</span>' + c.label + '</div>';
  }).join('');
  el.innerHTML = head +
    '<div class="chart-review-scroll">' +
      '<div class="chart-card demo-reveal">' +
        chartHead +
        '<div class="demo-question-text">Review this AI-coded entry &mdash; what&rsquo;s the right call?</div>' +
        '<div class="code-row flagged"><div><div class="label">' + chart.label + '</div><div class="code mono">' + chart.aiCode + '</div></div></div>' +
      '</div>' +
      '<div class="choice-row" id="module-demo-choices">' + choiceBtns +
        '<div class="demo-cursor" id="module-demo-cursor"><svg viewBox="0 0 24 24" fill="var(--sienna)" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg></div>' +
      '</div>' +
    '</div>';
  // The question + all 4 choices can be taller than the viewport on a
  // shorter screen -- since nothing here is manually scrollable during
  // an auto-play, force the choices into view instead of leaving them
  // silently cut off below the fold.
  var choicesEl = document.getElementById('module-demo-choices');
  if (choicesEl) choicesEl.scrollIntoView({ block: 'end' });
  clearModuleDemoTimers();
  scheduleModuleDemoTimer(function () { autoPlayModuleDemoChoice(chart); }, 900);
}

function renderReviewTab(skillName, reviewDone) {
  var el = document.getElementById('review-body');
  if (!el) return;
  if (reviewDone) {
    el.innerHTML =
      '<div class="done-wrap" style="padding-top:2.5rem;">' +
        '<div class="done-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
        '<h2>Review complete</h2>' +
        '<p>Nice work — this is now part of your ' + skillName + ' evidence.</p>' +
        '<div class="evidence-preview">' +
          '<span class="tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>AI-assisted review</span>' +
          '<div class="line">' + CHART_REVIEW_SUMMARY + '</div></div>' +
        '<div class="strengthen-cta" id="review-view-evidence-btn" style="width:100%;margin-top:0.9rem;">View updated evidence <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>' +
      '</div>';
    return;
  }
  el.innerHTML =
    '<div class="matches-empty-note" style="padding:0 1.1rem 0.9rem;">' +
      '<img class="matches-empty-avatar" src="assets/img/rudy-note.png?v=3" alt="Rudy" />' +
      '<div class="matches-empty-bubble"><p>A few charts, your read on them — that&rsquo;s it. No score, no clock.</p></div>' +
    '</div>' +
    '<div class="card strengthen-card" style="margin:0 1.1rem;">' +
      '<div class="card-title-row"><span class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>Strengthen your evidence</span></div>' +
      '<p>Rundle flagged ' + CHART_REVIEW_CHARTS.length + ' charts its AI coder wasn’t confident on, from your ' + skillName + ' work. Take a look and tell us what you see — untimed, no score, no fixed answer key.</p>' +
      '<div class="strengthen-cta" id="strengthen-evidence-btn">Review ' + CHART_REVIEW_CHARTS.length + ' flagged charts <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div></div>';
}

function renderChartReviewIntro() {
  var el = document.getElementById('chart-review-body');
  if (!el) return;
  var infoRows = [
    { label: 'What it is', value: 'Rundle flagged ' + CHART_REVIEW_CHARTS.length + ' charts its AI coder wasn’t fully confident on. You review each one and say what you’d flag — the same judgment call a working CDI specialist makes on the job.' },
    { label: 'Time limit', value: 'None. Take as long as you want on each chart.' },
    { label: 'Attempts', value: 'Unlimited — there’s no pass or fail, so there’s nothing to retry.' },
    { label: 'AI tools', value: 'Nothing here is graded against an answer key, so outside AI tools won’t help you — this works best as your own read of the chart.' },
    { label: 'What happens after', value: 'A short note is added to this skill’s evidence — not a score, not a rank.' }
  ];
  var rows = infoRows.map(function (r) {
    return '<div class="review-info-row"><div class="review-info-label">' + r.label + '</div><div class="review-info-value">' + r.value + '</div></div>';
  }).join('');
  el.innerHTML =
    '<div class="chart-review-scroll" style="padding-top:0.9rem;">' +
      '<img src="assets/img/chart-review-illustration.png?v=1" alt="" style="display:block;width:7rem;height:auto;margin:0 auto 1rem;" />' +
      '<div class="card">' + rows + '</div>' +
    '</div>' +
    '<div class="choice-row" style="padding-top:0.3rem;">' +
      '<div class="strengthen-cta" id="chart-review-start-btn" style="flex:1;">Start review <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>' +
    '</div>';
}

function renderChartReviewStep(step) {
  var el = document.getElementById('chart-review-body');
  if (!el) return;
  if (step >= CHART_REVIEW_CHARTS.length) {
    el.innerHTML =
      '<div class="done-wrap">' +
        '<div class="done-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
        '<h2>Review complete</h2>' +
        '<p>You looked at ' + CHART_REVIEW_CHARTS.length + ' flagged charts. This is now part of your evidence.</p>' +
        '<div class="evidence-preview">' +
          '<span class="tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>AI-assisted review</span>' +
          '<div class="line">' + CHART_REVIEW_SUMMARY + '</div></div>' +
        '<div class="back-cta" id="chart-review-back-btn">Back to Review</div>' +
      '</div>';
    return;
  }
  var chart = CHART_REVIEW_CHARTS[step];
  var dots = CHART_REVIEW_CHARTS.map(function (c, i) {
    return '<div class="progress-dot' + (i < step ? ' done' : (i === step ? ' active' : '')) + '"></div>';
  }).join('');
  var rows = chart.rows.map(function (r) {
    return '<div class="code-row' + (r.flagged ? ' flagged' : '') + '">' +
      '<div><div class="label">' + r.label + '</div><div class="code mono">' + r.code + '</div></div>' +
      (r.flagged ? '<span class="flag-chip">Low confidence</span>' : '') +
      '</div>';
  }).join('');
  el.innerHTML =
    '<div class="progress-row">' + dots + '<span class="progress-label">Chart ' + (step + 1) + ' of ' + CHART_REVIEW_CHARTS.length + '</span></div>' +
    '<div class="chart-review-scroll">' +
      '<div class="chart-card"><div class="chart-head"><div><div class="id">' + chart.id + '</div><div class="type">' + chart.type + '</div></div><span class="flag-chip">AI unsure</span></div>' + rows + '</div>' +
      '<div class="prompt-box">' + chart.prompt + '</div>' +
    '</div>' +
    '<div class="choice-row">' +
      '<div class="choice-btn" data-review-choice="ok">Looks right</div>' +
      '<div class="choice-btn primary" data-review-choice="flag">Flag a concern</div>' +
    '</div>';
}

function renderIdentity(mountId, p) {
  var el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = '<div class="avatar" style="background:' + p.avatarBg + '"><img src="' + p.avatar + '" alt="' + p.name + '" /></div><div><div class="name">' + p.name + '</div></div>';
}

var MAP_COLORS = ['#C6741E', '#2F6B57', '#A24E20', '#D8994A', '#6B4A2A', '#3E7CA6', '#8B5FA3', '#4F8C6B'];
var mapMatched = false;
var mapDrawn = false;
var mapConnectionsCache = null;
var mapResizeObserver = null;

// Deterministic pseudo-random in [0,1) — same seed always gives the same
// value, so the graph doesn't reshuffle on redraw.
function seededRandom(seed) {
  var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Several connections per skill, spread fairly widely around its
// proportional position — a dense, richly-connected web. A coverage pass
// then guarantees every role has at least one incoming line.
function computeMapConnections(nSkills, nRoles) {
  var conns = [];
  for (var i = 0; i < nSkills; i++) {
    var center = nSkills > 1 ? (i / (nSkills - 1)) * (nRoles - 1) : (nRoles - 1) / 2;
    var numLinks = 2 + Math.floor(seededRandom(i * 3.1) * 3); // 2, 3, or 4
    var set = {};
    for (var k = 0; k < numLinks; k++) {
      var spread = Math.max(2, nRoles * 0.85);
      var jitter = (seededRandom(i * 5.7 + k * 2.3) - 0.5) * spread;
      var idx = Math.max(0, Math.min(nRoles - 1, Math.round(center + jitter)));
      set[idx] = true;
    }
    conns.push(Object.keys(set).map(Number));
  }
  var covered = {};
  conns.forEach(function (roleList) { roleList.forEach(function (ri) { covered[ri] = true; }); });
  for (var ri = 0; ri < nRoles; ri++) {
    if (covered[ri]) continue;
    var skillIdx = Math.min(nSkills - 1, Math.floor(seededRandom(ri * 9.1) * nSkills));
    conns[skillIdx].push(ri);
  }
  return conns;
}

function renderMap(p, story, onMatched) {
  var el = document.getElementById('map-dynamic');
  if (!el) return;
  mapMatched = false;
  mapDrawn = false;
  mapConnectionsCache = null;
  var first = p.name.split(' ')[0];
  var skillChips = story.map.skills.map(function (s, i) {
    return '<div class="map-chip" data-side="l" data-i="' + i + '" style="animation-delay:' + (i * 0.08) + 's">' + s + '</div>';
  }).join('');
  var roleChips = story.map.roles.map(function (r, i) {
    return '<div class="map-chip" data-side="r" data-i="' + i + '" style="animation-delay:' + (0.15 + i * 0.08) + 's">' + r + '</div>';
  }).join('');
  el.innerHTML =
    '<svg class="figure-motif map-figure" viewBox="0 0 40 70" aria-hidden="true">' +
      '<circle cx="20" cy="8" r="6" fill="#F0C98A"/>' +
      '<rect x="15" y="14" width="10" height="28" rx="5" fill="#E4B877" transform="rotate(-4 20 28)"/>' +
      '<rect x="9" y="38" width="8" height="26" rx="4" fill="#D8994A" transform="rotate(14 13 51)"/>' +
      '<rect x="20" y="38" width="8" height="26" rx="4" fill="#C6741E" transform="rotate(-10 24 51)"/>' +
      '<rect x="22" y="12" width="7" height="22" rx="3.5" fill="#E4B877" transform="rotate(-55 25 23)"/>' +
    '</svg>' +
    '<div class="back-btn" style="display:flex;align-items:center;gap:0.3rem;cursor:pointer;position:relative;"><svg style="width:1rem;height:1rem;transform:rotate(180deg);color:#6B6258"><use href="#i-chev"/></svg></div>' +
    '<div><div class="map-head">Mapping your skills</div><p class="map-sub">Reading ' + first + '&rsquo;s verified work history and skills against roles in growing medical fields.</p></div>' +
    '<div class="map-match-btn" id="map-match-btn"><svg><use href="#i-match"/></svg>Click to match</div>' +
    '<div class="map-scroll"><div class="map-stage" id="map-stage">' +
      '<div class="map-cols" id="map-cols"><div class="map-col" id="map-col-l">' + skillChips + '</div><div class="map-col right" id="map-col-r">' + roleChips + '</div></div>' +
      '<svg class="map-svg" id="map-svg"></svg>' +
    '</div>' +
    '<p class="map-foot">Tap Match to connect your skills to matching roles.</p></div>';

  var matchBtn = document.getElementById('map-match-btn');
  if (matchBtn) {
    matchBtn.addEventListener('click', function () {
      if (mapMatched) {
        if (onMatched) onMatched();
        return;
      }
      mapMatched = true;
      matchBtn.classList.add('done');
      matchBtn.innerHTML = '<svg><use href="#i-arrow"/></svg>See your job matches';
      drawMapLines();
      var foot = el.querySelector('.map-foot');
      if (foot) foot.style.display = 'none';
    });
  }

  // The stage's height now comes from real in-flow content (the chip
  // columns), so there's nothing to guess. It can still shift slightly after
  // the async Fraunces swap changes chip metrics, or on a real window
  // resize — reposition (not rebuild) for those two specific, well-understood
  // triggers. An earlier version of this used a ResizeObserver to reposition
  // on *any* layout change, which could fire mid-entrance-animation and left
  // some lines never drawn — narrowing back to these two known triggers.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { if (mapMatched) drawMapLines(); });
  }
  window.addEventListener('resize', function () {
    if (mapMatched && document.getElementById('map-stage')) drawMapLines();
  });
}

function mapPathD(a, b) {
  var midX = (a.x + b.x) / 2;
  return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' C ' + midX.toFixed(1) + ' ' + a.y.toFixed(1) + ', ' + midX.toFixed(1) + ' ' + b.y.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
}

// Draws the skill<->role connections the first time (with the full
// entrance animation), then only *repositions* the same elements on any
// later call (font swap, resize, orientation change) by updating their
// geometry attributes in place. Rebuilding the whole SVG on every reposition
// was the cause of lines visibly flickering away and redrawing — updating
// attributes on existing nodes doesn't retrigger their CSS animations, so a
// layout-driven correction is invisible instead of a visible re-animate.
function drawMapLines() {
  var stage = document.getElementById('map-stage');
  var svg = document.getElementById('map-svg');
  if (!stage || !svg) return;
  var stageRect = stage.getBoundingClientRect();
  if (!stageRect.width || !stageRect.height) return;
  svg.setAttribute('viewBox', '0 0 ' + stageRect.width + ' ' + stageRect.height);

  function chipPoint(side, i) {
    var chip = stage.querySelector('.map-chip[data-side="' + side + '"][data-i="' + i + '"]');
    if (!chip) return null;
    var r = chip.getBoundingClientRect();
    return {
      x: side === 'l' ? (r.right - stageRect.left) : (r.left - stageRect.left),
      y: r.top - stageRect.top + r.height / 2
    };
  }

  function countChips(side) {
    var i = 0;
    while (chipPoint(side, i)) i++;
    return i;
  }

  if (mapDrawn && mapConnectionsCache) {
    // Reposition pass: same connections, same elements, just move them.
    mapConnectionsCache.forEach(function (roleList, si) {
      var a = chipPoint('l', si);
      if (!a) return;
      roleList.forEach(function (ri) {
        var b = chipPoint('r', ri);
        if (!b) return;
        var d = mapPathD(a, b);
        var key = si + '-' + ri;
        svg.querySelectorAll('[data-conn="' + key + '"]').forEach(function (elm) { elm.setAttribute('d', d); });
      });
    });
    ['l', 'r'].forEach(function (side) {
      var i = 0, pt;
      while ((pt = chipPoint(side, i))) {
        var node = svg.querySelector('.map-node[data-node="' + side + '-' + i + '"]');
        if (node) { node.setAttribute('cx', pt.x.toFixed(1)); node.setAttribute('cy', pt.y.toFixed(1)); }
        i++;
      }
    });
    return;
  }

  // First draw: build everything fresh (all invisible, opacity:0 via CSS),
  // then reveal it on a plain JS timer — see below.
  var nSkills = countChips('l');
  var nRoles = countChips('r');
  var connections = computeMapConnections(nSkills, nRoles);
  mapConnectionsCache = connections;

  var parts = [];
  var revealMs = 300; // when this connection's line should fade in
  var stepMs = reduceMotion ? 0 : 90;
  var revealSchedule = []; // [{ time, key }]
  // Earliest time that touches each chip, so a node's dot lights up in sync
  // with its own line arriving — not on an unrelated independent clock,
  // which read as dots scattering in ahead of the lines connecting.
  var nodeReveal = {};
  function touch(side, i, t) {
    var key = side + '-' + i;
    if (nodeReveal[key] === undefined || t < nodeReveal[key]) nodeReveal[key] = t;
  }

  connections.forEach(function (roleList, si) {
    var a = chipPoint('l', si);
    if (!a) return;
    roleList.forEach(function (ri) {
      var b = chipPoint('r', ri);
      if (!b) return;
      var d = mapPathD(a, b);
      var color = MAP_COLORS[si % MAP_COLORS.length];
      var key = si + '-' + ri;
      parts.push('<path pathLength="1" data-conn="' + key + '" class="map-path-halo" d="' + d + '"/>');
      parts.push('<path pathLength="1" data-conn="' + key + '" class="map-path-glow" style="stroke:' + color + '" d="' + d + '"/>');
      parts.push('<path pathLength="1" data-conn="' + key + '" class="map-path" style="stroke:' + color + '" d="' + d + '"/>');
      revealSchedule.push({ time: revealMs, key: key });
      touch('l', si, revealMs);
      touch('r', ri, revealMs);
      revealMs += stepMs;
    });
  });

  drawMapNodes(parts, 'l', chipPoint, nodeReveal, revealMs);
  drawMapNodes(parts, 'r', chipPoint, nodeReveal, revealMs);
  svg.innerHTML = parts.join('');
  mapDrawn = true;

  if (reduceMotion) {
    svg.querySelectorAll('.map-path, .map-path-glow, .map-path-halo, .map-node').forEach(function (elm) {
      elm.classList.add('in');
    });
    return;
  }
  revealSchedule.forEach(function (item) {
    setTimeout(function () {
      svg.querySelectorAll('[data-conn="' + item.key + '"]').forEach(function (elm) { elm.classList.add('in'); });
    }, item.time);
  });
  Object.keys(nodeReveal).forEach(function (key) {
    setTimeout(function () {
      var node = svg.querySelector('.map-node[data-node="' + key + '"]');
      if (node) node.classList.add('in');
    }, nodeReveal[key]);
  });
}

function drawMapNodes(parts, side, chipPoint, nodeReveal, fallback) {
  var i = 0, pt;
  while ((pt = chipPoint(side, i))) {
    var key = side + '-' + i;
    parts.push('<circle class="map-node" data-node="' + key + '" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="2.8"/>');
    i++;
  }
}

function renderHome(p, story) {
  renderIdentity('home-identity', p);
  var el = document.getElementById('home-content');
  if (!el) return;
  var revealCls = reduceMotion ? '' : ' reveal-row';
  var matchRows = story.matches.map(function (m, i) {
    var delay = 0.15 + i * 0.09;
    var cardStyle = '--fit:0' + (reduceMotion ? '' : ';animation-delay:' + delay.toFixed(2) + 's');
    var topCls = i === 0 ? ' match-card-top' : '';
    return '<div class="card match-card' + topCls + revealCls + '" data-match-idx="' + i + '" data-fit="' + m.fit + '" style="' + cardStyle + '"><div class="match-scores">' +
      '<div class="fit-ring"><span>' + m.fit + '%</span></div>' +
      (m.transfer != null ? '<div class="transfer-badge"><span>' + m.transfer + '</span><em>transfer</em></div>' : '') +
      '</div>' +
      '<div class="match-body"><div class="match-title">' + m.title + '</div>' +
      '<div class="match-meta' + (m.good ? ' good' : '') + '">' + m.meta + '</div>' +
      (m.wage ? '<div class="match-wage">' + m.wage + '</div>' : '') +
      (m.credential ? '<div class="match-credential">🔒 ' + m.credential + ' required</div>' : '') +
      (m.positions && m.positions.length ? '<div class="match-positions-link" data-open-positions="' + i + '">See open positions <svg><use href="#i-chev"/></svg></div>' : '') +
      '</div><svg class="match-card-arrow"><use href="#i-chev"/></svg>' +
      '</div>';
  }).join('');
  el.innerHTML =
    '<div class="matches-empty-note home-hero-note">' +
      '<img class="home-hero-avatar" src="assets/img/rudy-home-wave.gif" alt="Rudy waving" />' +
      '<div class="matches-empty-bubble"><p>More roles will show up here as you verify more skills.</p></div>' +
    '</div>' +
    matchRows;
  // Rings stay at --fit:0 here — animateMatchRingsIn() sweeps them once the
  // screen is actually visible; bumping while display:none has no paint to
  // transition from, so the fill would just snap in with no animation.
}

// ============================================================
// Verified Skills — its own onboarding step now, shown twice: once
// right after Download (pre-assessment), and again after the audit
// demo (post-assessment), where it gains a new Simulation-verified
// skill earned from that demo.
// ============================================================
var ASSESSMENT_SKILL_RESULT = {
  name: 'AI-Assisted Chart Audit', icon: 'a', svg: 'i-target',
  evidence: MODULE_DEMO_CHARTS.length + ' charts reviewed &middot; ' + MODULE_DEMO_CORRECTIONS + ' corrections caught &middot; ' + MODULE_DEMO_CONFIRMED + ' confirmed',
  tier: 'advanced', trust: 'simulated'
};

// A real seal-style credential badge (shield + ribbon tails) instead
// of a small line-art icon -- reads as an actual earned badge.
function credentialBadgeSvg() {
  return '<svg viewBox="0 0 24 24">' +
    '<defs><linearGradient id="credBadgeGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#DB8940"/><stop offset="1" stop-color="var(--sienna)"/>' +
    '</linearGradient></defs>' +
    '<path d="M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6l-9-4Z" fill="url(#credBadgeGrad)" stroke="#fff" stroke-width="1"/>' +
    '<path d="M8.5 12.5l2.5 2.5 5-5.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';
}

function renderVerifiedSkills(p, story, assessmentDone) {
  renderIdentity('verified-skills-identity', p);
  var el = document.getElementById('verified-skills-content');
  if (!el) return;
  var skills = story.skills.slice();
  if (assessmentDone) skills.unshift(ASSESSMENT_SKILL_RESULT);
  var heroBlock = '';
  if (assessmentDone) {
    heroBlock =
      '<div class="done-wrap" style="padding-top:0.3rem;padding-bottom:0.4rem;">' +
        '<img class="module-badge-img" src="assets/img/module1-badge.png?v=1" alt="Module 1 badge" />' +
        '<h2>Module 1 complete</h2>' +
        '<p>You now have <strong style="color:var(--ink);">' + skills.length + ' verified skills</strong> &mdash; 1 new, earned from this assessment.</p>' +
      '</div>';
  }
  var revealCls = reduceMotion ? '' : ' reveal-row';
  var skillRows = skills.map(function (s, i) {
    var delay = reduceMotion ? '' : ' style="animation-delay:' + (0.05 + i * 0.07).toFixed(2) + 's"';
    var isNew = assessmentDone && s === ASSESSMENT_SKILL_RESULT;
    return '<div class="skill-row' + revealCls + '"' + delay + '><div class="skill-icon ' + s.icon + '"><svg><use href="#' + s.svg + '"/></svg>' + (isNew ? '<span class="skill-new-tag">New</span>' : '') + '</div>' +
      '<div><div class="skill-name">' + s.name + '</div><div class="skill-evidence">' + s.evidence + '</div></div>' +
      '<div class="skill-badges"><span class="tier ' + s.tier + '">' + tierLabel[s.tier] + '</span>' +
      (s.trust ? '<span class="trust ' + s.trust + '">' + trustLabel[s.trust] + '</span>' : '') + '</div></div>';
  }).join('');
  var credentialCard =
    '<div class="card"><div class="card-title-row"><span class="card-title">Credential tie-in</span></div>' +
      '<div style="display:flex;align-items:center;gap:0.8rem;"><div class="credential-badge">' + credentialBadgeSvg() + '</div>' +
      '<div><div style="font-size:0.85rem;font-weight:700;">' + p.cred + ' &middot; AHIMA</div><div class="status-ok"><svg><use href="#i-check"/></svg>' +
      (p.status === 'active' ? 'Active, verified' : 'In progress') + '</div></div></div></div>';
  el.innerHTML =
    heroBlock +
    credentialCard +
    employmentHistoryCard(story) +
    '<div class="card"><div class="card-title-row"><span class="card-title">Verified skills</span><span class="count-chip">' + skills.length + ' skills</span></div>' +
      '<div class="skill-list-head"><div class="skill-list-head-spacer"></div><div class="skill-list-head-name"></div>' +
        '<div class="skill-list-head-badges"><span>Level</span><span>Evidence</span></div></div>' +
      skillRows +
    '</div>';
  var continueBtn = document.getElementById('verified-skills-continue-btn');
  if (continueBtn) continueBtn.textContent = assessmentDone ? 'Continue' : 'Continue to assessment';
}

// ============================================================
// Assessment gateway — the "five modules" overview, gateway into the
// audit demo. Only Module 1 is real (it's the built demo); the other
// four are shown for context, not fabricated as interactive features.
// ============================================================
var ASSESSMENT_MODULES = [
  { n: 1, name: 'Chart Coding Review', desc: 'Review charts an AI already coded. Catch what it got wrong, leave what it got right.', time: '40 min', status: 'demo' },
  { n: 2, name: 'Inpatient coding', desc: 'Code eight synthetic charts, sequence the principal diagnosis, derive the DRG.', time: '45 min', status: 'unavailable' },
  { n: 3, name: 'Physician query', desc: 'Draft a compliant, non-leading query for an ambiguous chart.', time: '25 min', status: 'unavailable' },
  { n: 4, name: 'Compliance judgment', desc: 'Scenario items on guidelines, upcoding risk and when to escalate.', time: '20 min', status: 'unavailable' },
  { n: 5, name: 'Working style', desc: 'A short inventory. Advisory only, reported separately, never a pass or fail.', time: '15 min', status: 'unavailable' }
];

function renderAssessmentGateway() {
  var el = document.getElementById('assessment-gateway-body');
  if (!el) return;
  var rows = ASSESSMENT_MODULES.map(function (m) {
    var isDemo = m.status === 'demo';
    return '<div class="gw-module' + (isDemo ? ' gw-module-active' : '') + '">' +
      '<div class="gw-num' + (isDemo ? ' gw-num-active' : '') + '">' + m.n + '</div>' +
      '<div class="gw-body"><div class="gw-title-row"><span class="gw-name">' + m.name + '</span>' +
        (m.tag ? '<span class="gw-tag">' + m.tag + '</span>' : '') + '</div>' +
        '<div class="gw-desc">' + m.desc + '</div></div>' +
      '<div class="gw-side"><div class="gw-time">' + m.time + '</div>' +
      (isDemo ? '<div class="gw-start-btn" id="gateway-start-module2">Begin Assessment</div>' : '<div class="gw-unavailable">Not in this demo</div>') +
      '</div></div>';
  }).join('');
  el.innerHTML = rows;
}

// Sweeps every ring on screen from 0 up to its real fit value (clockwise,
// via the conic-gradient reading --fit). Driven by a manual rAF tween rather
// than a CSS transition on the custom property — a transition would depend
// on the browser supporting @property-registered animatable custom
// properties, which isn't universal; setting the value directly every frame
// works anywhere conic-gradient itself works.
function animateMatchRingsIn(container) {
  if (!container) return;
  var cards = container.querySelectorAll('.match-card');
  if (!cards.length) return;
  if (reduceMotion) {
    cards.forEach(function (c) { c.style.setProperty('--fit', c.dataset.fit); });
    return;
  }
  cards.forEach(function (c) { c.style.setProperty('--fit', 0); });
  var duration = 1400;
  var start = null;
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function tick(ts) {
    if (start === null) start = ts;
    var t = Math.min(1, (ts - start) / duration);
    var eased = easeOutCubic(t);
    cards.forEach(function (c) {
      var target = parseFloat(c.dataset.fit) || 0;
      c.style.setProperty('--fit', (target * eased).toFixed(1));
    });
    if (t < 1) requestAnimationFrame(tick);
  }
  // Let the 0% state actually get painted (and the screen transition settle)
  // before the sweep starts — starting it in the same frame the screen
  // becomes visible meant most of the sweep had already finished by the
  // time it was actually on screen, so only the tail end was ever seen.
  setTimeout(function () { requestAnimationFrame(tick); }, 300);
}

function renderGap(p, story) {
  var g = story.gap;
  var header = document.getElementById('gapdetail-header');
  if (header) {
    header.innerHTML = '<div class="back-btn" data-back="home" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;"><svg style="width:1rem;height:1rem;transform:rotate(180deg);color:var(--ink-soft)"><use href="#i-chev"/></svg><div class="name">' + g.title + '</div></div>' +
      '<div class="fit-ring" style="--fit:' + g.fit + ';width:2.1rem;height:2.1rem;font-size:0.6rem;"><span>' + g.fit + '%</span></div>';
  }
  var el = document.getElementById('gapdetail-body');
  if (!el) return;
  // Carry the "Ready in ~X months" framing over from the Matches card that
  // led here — otherwise this screen drops that context entirely.
  var matchedMeta = story.matches.filter(function (m) { return m.title === g.title; })[0];
  var metaLine = matchedMeta ? '<p class="sub-lead" style="padding:0 0.1rem 0.7rem;">' + matchedMeta.meta + '</p>' : '';
  var haveRows = g.have.map(function (h) {
    return '<div class="gap-item have"><svg><use href="#i-check"/></svg><div><div class="t">' + h.t + '</div><div class="d">' + h.d + '</div></div></div>';
  }).join('');
  el.innerHTML = metaLine +
    '<div class="card"><div class="card-title-row"><span class="card-title">Already proven</span></div>' + haveRows + '</div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">One gap remaining</span></div>' +
      '<div class="gap-item need"><svg><use href="#i-bolt"/></svg><div><div class="t">' + g.need.t + '</div><div class="d">' + g.need.d + '</div></div></div></div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Close the gap</span></div>' +
      '<div class="provider-card"><div><div class="provider-name">' + g.provider.name + '</div>' + AHIMA_BADGE + '</div>' +
      '<span class="badge-fund">' + g.provider.badge + '</span></div></div>' +
    '<div class="cta" id="gap-start-training">Start training path <svg><use href="#i-arrow"/></svg></div>';
}

function rungBar(pct) {
  var heights = [7, 11, 15, 19, 23];
  var bars = heights.map(function (h, i) {
    var segStart = i * 20;
    var filled = pct > segStart;
    var complete = pct >= 100;
    var bg = !filled ? '#EDE4D5' : (complete ? 'linear-gradient(180deg,#8FC97A,var(--good))' : 'linear-gradient(180deg,#E5A458,var(--ochre))');
    var shadow = !filled ? 'none' : (complete ? '0 1px 2px rgba(79,122,62,.35)' : '0 1px 2px rgba(162,78,32,.35)');
    return '<div style="width:0.8rem;height:' + h + 'px;border-radius:3px;background:' + bg + ';box-shadow:' + shadow + ';"></div>';
  }).join('');
  return '<div style="display:flex;align-items:flex-end;gap:0.26rem;height:23px;">' + bars + '</div>';
}

var AHIMA_BADGE = '<span class="org-badge"><span class="org-mark">AH</span>AHIMA</span>';

function renderTraining(p, story) {
  var el = document.getElementById('training-body');
  if (!el) return;
  var t = story.training;
  var topCard;
  if (t.mode === 'renewal') {
    topCard = '<div class="card"><div class="card-title-row"><span class="card-title">' + p.cred + ' renewal</span><span class="count-chip">' + t.dueLabel + '</span></div>' +
      '<div class="bar-row" style="display:flex;align-items:center;justify-content:space-between;gap:0.6rem;"><div><div style="font-size:0.72rem;">CEU credits</div><span class="mono" style="font-size:0.72rem;font-weight:600;">' + t.ceu + '</span></div>' + rungBar(t.ceuPct) + '</div>' +
      '<p style="font-size:0.68rem;color:var(--ink-soft);margin:0.5rem 0 0;">Renewal required every 2 years, per ' + AHIMA_BADGE + '</p></div>';
  } else {
    topCard = '<div class="card"><div class="card-title-row"><span class="card-title">' + t.examLabel + '</span><span class="count-chip">' + t.examDate + '</span></div>' +
      '<div class="bar-row" style="display:flex;align-items:center;justify-content:space-between;gap:0.6rem;"><div><div style="font-size:0.72rem;">' + t.progressLabel + '</div><span class="mono" style="font-size:0.72rem;font-weight:600;">' + t.progress + '</span></div>' + rungBar(t.progressPct) + '</div>' +
      '<p style="font-size:0.68rem;color:var(--ink-soft);margin:0.5rem 0 0;">Self-paced prep track, approved by ' + AHIMA_BADGE + '</p></div>';
  }
  var institutions = [
    { mark: 'img', src: 'assets/img/logo-ahima.png', name: 'AHIMA', full: 'American Health Information Management Association', desc: 'RHIT, CCS &amp; CDIP credentials, CEU courses', domain: 'ahima.org', href: 'https://www.ahima.org/' },
    { mark: 'text', text: 'AAPC', bg: 'linear-gradient(135deg,#3E7CA6,#2A5A80)', name: 'AAPC', full: 'AAPC', desc: 'CPC certifications &amp; coding practice exams', domain: 'aapc.com', href: 'https://www.aapc.com/' },
    { mark: 'text', text: 'ACDIS', bg: 'linear-gradient(135deg,#6B8E4E,#4A6B36)', name: 'ACDIS', full: 'Association of Clinical Documentation Integrity Specialists', desc: 'CDI query-writing training &amp; CCDS exam prep', domain: 'acdis.org', href: 'https://acdis.org/' },
    { mark: 'text', text: 'HCCA', bg: 'linear-gradient(135deg,#A24E20,#7A3A17)', name: 'HCCA', full: 'Health Care Compliance Association', desc: 'Compliance training &amp; CHC certification', domain: 'hcca-info.org', href: 'https://www.hcca-info.org/' }
  ];
  var instRows = institutions.map(function (inst) {
    var mark = inst.mark === 'img'
      ? '<span class="inst-mark inst-mark-img"><img src="' + inst.src + '" alt="" /></span>'
      : '<span class="inst-mark" style="background:' + inst.bg + ';">' + inst.text + '</span>';
    return '<a class="inst-row" href="' + inst.href + '" target="_blank" rel="noopener">' +
      mark +
      '<div class="inst-body"><div class="inst-name">' + inst.full + '</div><div class="inst-desc">' + inst.desc + '</div>' +
        '<div class="inst-ext"><svg><use href="#i-external"/></svg>External &middot; ' + inst.domain + '</div></div>' +
    '</a>';
  }).join('');
  var recRow = '<a class="inst-row inst-row-featured" href="https://www.ahima.org/" target="_blank" rel="noopener">' +
    '<span class="inst-mark inst-mark-img"><img src="assets/img/logo-ahima.png" alt="" /></span>' +
    '<div class="inst-body">' +
      '<div class="inst-name-row"><span class="inst-name">' + t.recommended.name + '</span><span class="inst-rec-tag">Recommended</span></div>' +
      '<div class="inst-desc">' + t.recommended.org + '</div>' +
      '<div class="inst-ext"><svg><use href="#i-external"/></svg>External &middot; ahima.org <span class="inst-fund">&middot; ' + t.recommended.badge + '</span></div>' +
    '</div>' +
  '</a>';
  el.innerHTML = topCard +
    '<div class="divider-label">Completed</div>' +
    '<div class="card"><div class="gap-item have"><svg><use href="#i-check"/></svg><div><div class="t">' + t.completed.t + '</div><div class="d">' + t.completed.d + '</div></div></div></div>' +
    '<div class="divider-label">Continue training elsewhere</div>' +
    '<p class="inst-intro">These are real outside organizations, not part of Rundle &mdash; each link opens their site in a new tab.</p>' +
    '<div class="card" style="padding:0.3rem 0.9rem;">' + recRow + instRows + '</div>';
}

function renderProfile(p, story) {
  renderIdentity('profile-identity', p);
  var el = document.getElementById('profile-body');
  if (!el) return;
  var credBody;
  if (p.status === 'active') {
    credBody = '<div class="cred-row"><div><div style="font-size:0.8rem;font-weight:600;">' + p.cred + ' &middot; AHIMA</div><div class="cred-id mono">' + p.credId + '</div></div>' +
      '<div class="status-ok"><svg><use href="#i-check"/></svg>Active</div></div>' +
      '<p style="font-size:0.66rem;color:var(--ink-soft);margin:0.4rem 0 0;">Issued ' + p.issue + ' &middot; Renews every 2 years &middot; Next ' + p.renew + '</p>';
  } else {
    credBody = '<div class="cred-row"><div><div style="font-size:0.8rem;font-weight:600;">' + p.cred + ' &middot; AHIMA</div><div class="cred-id mono">Pending exam</div></div>' +
      '<div class="status-ok" style="color:var(--sienna);"><svg><use href="#i-bolt"/></svg>In progress</div></div>' +
      '<p style="font-size:0.66rem;color:var(--ink-soft);margin:0.4rem 0 0;">' + p.pendingNote + '</p>';
  }
  var tl = story.employer.map(function (e) {
    return '<div class="tl-item"><div class="tl-date">' + e.from + ' &mdash; ' + e.to + '</div><div class="tl-title">' + e.title + '</div><div class="tl-sub">' + e.role + ' &middot; ' + e.note + '</div></div>';
  }).join('');
  var sourceLogos = { cos: 'logo-cos.png', onet: 'logo-onet.png', bls: 'logo-bls.jpg', ahima: 'logo-ahima.png' };
  var sourceLinks = { cos: 'https://www.careeronestop.org/', onet: 'https://www.onetonline.org/', bls: 'https://www.bls.gov/', ahima: 'https://www.ahima.org/' };
  var sourceRows = sources.map(function (s) {
    var wide = s.key === 'ahima' ? ' wide' : '';
    return '<a class="check-row" href="' + sourceLinks[s.key] + '" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;"><div class="check-logo' + wide + '"><img src="assets/img/' + sourceLogos[s.key] + '" alt="" /></div>' +
      '<div class="check-body" style="flex:1;min-width:0;"><div class="check-title">' + s.label + '</div><div class="check-sub">' + s.url + '</div></div>' +
      '<div class="status-ok" style="margin-left:auto;flex:none;white-space:nowrap;"><svg><use href="#i-check"/></svg>Connected</div></a>';
  }).join('');
  el.innerHTML =
    '<div class="card"><div class="card-title-row"><span class="card-title">Credential</span></div>' + credBody + '</div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Employment history</span></div><div class="timeline">' + tl + '</div></div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Data sources</span><span class="count-chip">' + sources.length + ' connected</span></div>' + sourceRows + '</div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Who can see this</span></div>' +
      '<div class="toggle-row"><div><div class="t">Visible to employers</div><div class="d">Skills, credential, tenure</div></div><div class="switch on"></div></div>' +
      '<div class="toggle-row"><div><div class="t">Visible to training partners</div><div class="d">For funded course matching</div></div><div class="switch on"></div></div>' +
      '<div class="toggle-row"><div><div class="t">Include simulation detail</div><div class="d">Full task-level results</div></div><div class="switch off"></div></div></div>';
}

function renderPositions(title, positions) {
  var titleEl = document.getElementById('positions-title');
  if (titleEl) titleEl.textContent = title;
  var el = document.getElementById('positions-body');
  if (!el) return;
  var cards = positions.map(function (job) {
    return '<div class="card job-card">' +
      '<div class="job-logo img"><img src="' + job.logoImg + '" alt="" /></div>' +
      '<div class="job-info"><div class="job-role">' + job.role + '</div>' +
      '<div class="job-company">' + job.company + '</div>' +
      '<div class="job-meta">' + job.location + ' &middot; ' + job.wage + '</div>' +
      '<div class="job-posted">Posted ' + job.posted + '</div></div>' +
      '<div class="job-apply">Apply</div></div>';
  }).join('');
  el.innerHTML =
    '<div class="src-note" style="margin-bottom:0.6rem;">Actual openings matching this role &mdash; not just the occupation category.</div>' +
    cards;
}

function renderAll(persona) {
  var story = STORY[persona.id];
  if (!story) return;
  renderHome(persona, story);
  renderGap(persona, story);
  renderTraining(persona, story);
  renderProfile(persona, story);
}
