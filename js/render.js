// Rendering functions — ported from the reviewed mockup.
// Pure(ish): each render* function reads PERSONAS/STORY and writes into
// known mount points in index.html. Navigation lives in app.js.

var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  status.textContent = 'Demo credentials — nothing is sent anywhere.';
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

function flyToInbox(sourceEl) {
  var screenEl = sourceEl.closest('.screen');
  var inbox = document.getElementById('dl-inbox');
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
// Module 2 demo (AI-assisted audit) — an accelerated, auto-playing
// walkthrough for presentation audiences, not the real graded module.
// Pure CSS keyframes with baked-in animation-delay do the "auto-play";
// renderModuleDemo() just rebuilds the markup fresh, which is how Replay
// resets the sequence (a re-used element wouldn't restart its animation).
// ============================================================
function renderModuleDemo() {
  var el = document.getElementById('module-demo-body');
  if (!el) return;
  function pointer(delay, x0, y0, x1, y1) {
    return '<div class="demo-pointer" style="animation-delay:' + delay + 's;--dp-x0:' + x0 + '%;--dp-y0:' + y0 + '%;--dp-x1:' + x1 + '%;--dp-y1:' + y1 + '%;"></div>' +
           '<div class="demo-click-ring" style="animation-delay:' + (delay + 0.5) + 's;--dp-x1:' + x1 + '%;--dp-y1:' + y1 + '%;"></div>';
  }
  function pointer2(delay, x0, y0, x1, y1, x2, y2) {
    return '<div class="demo-pointer two-stop" style="animation-delay:' + delay + 's;--dp-x0:' + x0 + '%;--dp-y0:' + y0 + '%;--dp-x1:' + x1 + '%;--dp-y1:' + y1 + '%;--dp-x2:' + x2 + '%;--dp-y2:' + y2 + '%;"></div>' +
           '<div class="demo-click-ring" style="animation-delay:' + (delay + 0.49) + 's;--dp-x1:' + x1 + '%;--dp-y1:' + y1 + '%;"></div>' +
           '<div class="demo-click-ring" style="animation-delay:' + (delay + 0.89) + 's;--dp-x1:' + x2 + '%;--dp-y1:' + y2 + '%;"></div>';
  }
  el.innerHTML =
    '<div class="chart-review-scroll" style="padding-top:0.9rem;">' +
      '<div class="demo-ribbon">⏩ DEMO &mdash; accelerated for presentation, not real assessment speed</div>' +
      '<div class="progress-row">' +
        '<div class="progress-dot demo-dot" style="animation-delay:1.9s"></div>' +
        '<div class="progress-dot demo-dot" style="animation-delay:3.8s"></div>' +
        '<div class="progress-dot demo-dot" style="animation-delay:5.8s"></div>' +
        '<div class="progress-dot demo-dot" style="animation-delay:8.0s"></div>' +
        '<span class="progress-label">Module 2 &middot; AI-assisted audit</span>' +
      '</div>' +

      // Chart 1 — AI drafted the wrong code; worker corrects it, DRG updates.
      '<div class="chart-card demo-reveal" style="animation-delay:0.1s">' +
        '<div class="chart-head"><div><div class="id">Synthetic chart &middot; Pneumonia</div><div class="type">Inpatient &middot; 4-day stay</div></div><span class="flag-chip">AI draft</span></div>' +
        '<div class="code-row flagged">' +
          '<div><div class="label">Principal diagnosis</div>' +
            '<div class="code demo-code-wrap">' +
              '<span class="demo-code-old mono" style="animation-delay:1.1s">J18.9 &middot; Pneumonia, unspecified organism</span>' +
              '<span class="demo-code-new mono" style="animation-delay:1.2s">J15.1 &middot; Pneumonia due to Pseudomonas</span>' +
            '</div>' +
          '</div>' +
          pointer(0.5, 85, 6, 68, 42) +
        '</div>' +
        '<div class="demo-drg" style="animation-delay:1.35s">' +
          '<span class="demo-drg-old">DRG 179 &middot; Simple pneumonia</span>' +
          '<span class="demo-drg-arrow">&rarr;</span>' +
          '<span class="demo-drg-new" style="animation-delay:1.45s">DRG 177 &middot; Pneumonia w/ major complication</span>' +
        '</div>' +
        '<div class="prompt-box demo-explain" style="animation-delay:1.55s">Physician&rsquo;s note names the organism &mdash; the AI&rsquo;s draft missed it. That one detail changes the DRG. <span class="demo-impact" style="animation-delay:1.75s">+$1,850 case value</span></div>' +
      '</div>' +

      // Chart 2 — AI's code was already right; worker confirms instead of "fixing" it.
      '<div class="chart-card demo-reveal" style="animation-delay:2.3s">' +
        '<div class="chart-head"><div><div class="id">Synthetic chart &middot; Post-op infection</div><div class="type">Inpatient &middot; 2-day stay</div></div><span class="flag-chip">AI draft</span></div>' +
        '<div class="code-row flagged">' +
          '<div><div class="label">Principal diagnosis</div><div class="code mono">T81.4XXA &middot; Infection following a procedure</div></div>' +
          pointer(2.7, 85, 6, 70, 40) +
          '<div class="demo-confirm" style="animation-delay:3.3s">&#10003; Confirmed</div>' +
        '</div>' +
        '<div class="prompt-box demo-explain" style="animation-delay:3.5s">AI got this one right. Confirming instead of &ldquo;fixing&rdquo; it keeps the false-positive rate down &mdash; over-correcting counts against a worker too.</div>' +
      '</div>' +

      // Chart 3 — AI missed a secondary diagnosis entirely; worker adds it.
      '<div class="chart-card demo-reveal" style="animation-delay:4.1s">' +
        '<div class="chart-head"><div><div class="id">Synthetic chart &middot; Hip fracture</div><div class="type">Inpatient &middot; 5-day stay</div></div><span class="flag-chip">AI draft</span></div>' +
        '<div class="code-row flagged">' +
          '<div><div class="label">Secondary diagnosis</div>' +
            '<div class="demo-code-stack">' +
              '<span class="demo-code-ghost" style="animation-delay:5.1s">+ Add missing diagnosis?</span>' +
              '<span class="demo-code-added mono" style="animation-delay:5.2s">N17.9 &middot; Acute kidney injury</span>' +
            '</div>' +
          '</div>' +
          pointer(4.5, 85, 6, 65, 48) +
        '</div>' +
        '<div class="prompt-box demo-explain" style="animation-delay:5.4s">Labs showed reduced kidney function the AI didn&rsquo;t code for. A missed secondary diagnosis undercounts how complex the case really was. <span class="demo-impact" style="animation-delay:5.6s">+$980 case value</span></div>' +
      '</div>' +

      // Chart 4 — AI had the right codes but the wrong sequence; worker reorders.
      '<div class="chart-card demo-reveal" style="animation-delay:6.1s">' +
        '<div class="chart-head"><div><div class="id">Synthetic chart &middot; Sepsis</div><div class="type">Inpatient &middot; 3-day stay</div></div><span class="flag-chip">AI draft</span></div>' +
        '<div class="code-row flagged">' +
          '<div><div class="label">Diagnosis sequence</div>' +
            '<div class="code demo-code-wrap">' +
              '<span class="demo-code-old mono" style="animation-delay:7.5s">1&#41; T81.4XXA infection &middot; 2&#41; A41.9 sepsis</span>' +
              '<span class="demo-code-new mono" style="animation-delay:7.6s">1&#41; A41.9 sepsis &middot; 2&#41; T81.4XXA infection</span>' +
            '</div>' +
          '</div>' +
          pointer2(6.5, 85, 6, 30, 38, 30, 52) +
        '</div>' +
        '<div class="prompt-box demo-explain" style="animation-delay:7.8s">AI had the right two codes but listed them in the wrong order. Sequencing decides which condition drives the DRG &mdash; order matters as much as the code itself.</div>' +
      '</div>' +

      '<div class="demo-summary demo-reveal" style="animation-delay:8.6s">' +
        '<div class="evidence-preview">' +
          '<span class="tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>Session complete</span>' +
          '<div class="line">4 charts reviewed &middot; 3 corrections caught &middot; 1 confirmed &middot; nothing counts until this session is flipped to scored</div>' +
        '</div>' +
        '<div class="demo-continue-cta" id="module-demo-continue">See your matches <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>' +
        '<div class="back-cta" id="module-demo-replay">&#8635; Replay demo</div>' +
      '</div>' +
    '</div>';
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
  el.innerHTML = '<div class="avatar" style="background:' + p.avatarBg + '"><img src="' + p.avatar + '" alt="' + p.name + '" /></div><div><div class="name">' + p.name + '</div><div class="role">' + p.role + '</div></div>';
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
    '<div><div class="map-head">Mapping your skills</div><p class="map-sub">Reading ' + first + '&rsquo;s verified work history against roles in growing fields.</p></div>' +
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
      matchBtn.innerHTML = '<svg><use href="#i-arrow"/></svg>Next';
      drawMapLines();
      var foot = el.querySelector('.map-foot');
      if (foot) foot.textContent = 'Same evidence, mapped to adjacent-fit roles.';
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
  var skillRows = story.skills.map(function (s, i) {
    var delay = reduceMotion ? '' : ' style="animation-delay:' + (0.05 + i * 0.07).toFixed(2) + 's"';
    return '<div class="skill-row' + revealCls + '"' + delay + '><div class="skill-icon ' + s.icon + '"><svg><use href="#' + s.svg + '"/></svg></div>' +
      '<div><div class="skill-name">' + s.name + '</div><div class="skill-evidence">' + s.evidence + '</div></div>' +
      '<div class="skill-badges"><span class="tier ' + s.tier + '">' + tierLabel[s.tier] + '</span>' +
      (s.trust ? '<span class="trust ' + s.trust + '">' + trustLabel[s.trust] + '</span>' : '') + '</div>' +
      '<svg class="skill-row-arrow"><use href="#i-chev"/></svg></div>';
  }).join('');
  var matchesDelay = 0.15 + story.skills.length * 0.07;
  var matchRows = story.matches.map(function (m, i) {
    var delay = matchesDelay + 0.15 + i * 0.09;
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
      (m.closesAt ? '<div class="match-closes">Closes gap at → ' + m.closesAt + '</div>' : '') +
      (m.positions && m.positions.length ? '<div class="match-positions-link" data-open-positions="' + i + '">See open positions <svg><use href="#i-chev"/></svg></div>' : '') +
      '</div><svg class="match-card-arrow"><use href="#i-chev"/></svg>' +
      '</div>';
  }).join('');
  var bannerDelay = matchesDelay + 0.3 + story.matches.length * 0.09;
  el.innerHTML =
    '<div class="card"><div class="card-title-row"><span class="card-title">Verified skills</span><span class="count-chip">' + story.skills.length + ' skills</span></div>' +
      skillRows +
      '<div class="link-row" id="home-view-all-skills"><span>View all skills and evidence</span><svg><use href="#i-chev"/></svg></div></div>' +
    '<div class="card-title-row" style="margin:1.1rem 0 0.5rem;"><span class="card-title ready-card-title">Matches</span><span class="count-chip">' + story.matches.length + '</span></div>' +
    matchRows +
    '<div class="matches-empty-note">' +
      '<img class="matches-empty-avatar" src="assets/img/rudy-note.png?v=3" alt="Rudy" />' +
      '<div class="matches-empty-bubble"><p>More roles will show up here as you verify more skills.</p></div>' +
    '</div>' +
    '<div class="card strengthen-card" style="margin-top:0.7rem;"><div class="card-title-row"><span class="card-title">What&rsquo;s next</span></div>' +
      '<p>Strengthen your evidence with a quick, untimed chart review, or check Training to close a skill gap.</p>' +
      '<div class="strengthen-cta" id="home-next-review">Go to Review <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>' +
      '<div class="demo-cta" id="home-module-demo">▶ See the AI-assisted audit in action <span class="demo-cta-tag">demo</span></div>' +
    '</div>';
  // Rings stay at --fit:0 here — animateMatchRingsIn() sweeps them once the
  // screen is actually visible; bumping while display:none has no paint to
  // transition from, so the fill would just snap in with no animation.
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

function renderSkillDetail(p, story, reviewDone) {
  var titleEl = document.getElementById('skilldetail-title');
  if (titleEl) titleEl.textContent = story.skillDetail.name;
  var el = document.getElementById('skilldetail-body');
  if (!el) return;
  var sd = story.skillDetail;
  var errRows = sd.errors.map(function (e) {
    return '<div style="display:flex;justify-content:space-between;">' + e.t + ' <span class="mono">' + e.n + '</span></div>';
  }).join('');
  var strengthenBlock = reviewDone
    ? '<div class="evidence-preview" style="margin-bottom:0.7rem;">' +
        '<span class="tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>AI-assisted review</span>' +
        '<div class="line">' + CHART_REVIEW_SUMMARY + '</div></div>'
    : '';
  var topError = sd.errors.slice().sort(function (a, b) { return b.n - a.n; })[0];
  var forwardBlock = sd.tier === 'expert' ? '' :
    '<div class="card strengthen-card">' +
      '<div class="card-title-row"><span class="card-title">What would move this forward</span></div>' +
      '<p>Two things raise this: more verified reps, and fewer flagged errors on your most common issue &mdash; <strong style="color:var(--ink);">' + topError.t + '</strong> (' + topError.n + ' flagged so far).</p>' +
      (reviewDone ? '' : '<div class="strengthen-cta" id="skilldetail-next-review">Strengthen with a quick review <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>') +
    '</div>';
  el.innerHTML =
    '<div class="card"><div class="card-title-row"><span class="card-title">Rundle evidence</span><span class="tier ' + sd.tier + '">' + tierLabel[sd.tier] + '</span></div>' +
      '<div class="bar-row"><div class="bar-label"><span>Accuracy</span><span class="mono">' + sd.accuracy + '%</span></div><div class="bar-track"><div class="bar-fill" style="width:' + (100 - sd.accuracy) + '%"></div></div></div>' +
      '<div class="bar-row"><div class="bar-label"><span>' + sd.metricLabel + '</span><span class="mono">' + sd.count + '</span></div></div>' +
      '<div class="divider-label">Common error types</div>' +
      '<div style="font-size:0.72rem;color:var(--ink-soft);line-height:1.9;">' + errRows + '</div></div>' +
    strengthenBlock +
    forwardBlock +
    '<div class="card"><div class="card-title-row"><span class="card-title">Occupation benchmark</span></div>' +
      '<p style="font-size:0.72rem;color:var(--ink-soft);line-height:1.5;margin:0 0 0.5rem;">O&middot;NET: Medical Records Specialists (29-2072.00) ranks <strong style="color:var(--ink);">Attention to Detail</strong> as the single most important work style for this role &mdash; 100 of 100.</p>' +
      '<div class="bar-track"><div class="bar-fill" style="width:0%"></div></div></div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Credential tie-in</span></div>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;"><svg style="width:1.1rem;height:1.1rem;color:var(--sienna)"><use href="#i-shield"/></svg>' +
      '<div><div style="font-size:0.78rem;font-weight:600;">' + p.cred + ' &middot; AHIMA</div><div class="status-ok"><svg><use href="#i-check"/></svg>' +
      (p.status === 'active' ? 'Active, verified' : 'In progress') + '</div></div></div></div>' +
    '<div class="cta" id="skilldetail-back-home">Back to home <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>';
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
var AHIMA_BADGE_LINK = '<span class="org-badge"><span class="org-mark">AH</span>AHIMA <svg><use href="#i-arrow"/></svg></span>';

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
  el.innerHTML = topCard +
    '<div class="divider-label">Recommended</div>' +
    '<a class="card" href="https://www.ahima.org/" target="_blank" rel="noopener" style="display:block;text-decoration:none;color:inherit;"><div class="provider-card"><div><div class="provider-name">' + t.recommended.name + '</div>' + AHIMA_BADGE_LINK + '</div>' +
    '<span class="badge-fund">' + t.recommended.badge + '</span></div></a>' +
    '<div class="divider-label">Completed</div>' +
    '<div class="card"><div class="gap-item have"><svg><use href="#i-check"/></svg><div><div class="t">' + t.completed.t + '</div><div class="d">' + t.completed.d + '</div></div></div></div>' +
    '<div class="divider-label">Continue training elsewhere</div>' +
    '<div class="card">' +
      '<a class="link-row" href="https://www.aapc.com/" target="_blank" rel="noopener" style="align-items:center;">' +
        '<span style="display:flex;align-items:center;gap:0.55rem;"><span style="width:1.7rem;height:1.7rem;border-radius:0.4rem;flex:none;background:linear-gradient(135deg,#3E7CA6,#2A5A80);color:#fff;font-family:\'Fraunces\';font-weight:700;font-size:0.5rem;display:flex;align-items:center;justify-content:center;letter-spacing:0.01em;">AAPC</span>AAPC certifications</span>' +
        '<svg><use href="#i-chev"/></svg></a>' +
    '</div>';
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
  renderSkillDetail(persona, story);
  renderGap(persona, story);
  renderTraining(persona, story);
  renderProfile(persona, story);
}
