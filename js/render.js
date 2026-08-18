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
  status.textContent = 'Demo credentials — nothing is sent anywhere.';
  setTimeout(function () {
    typeInto(loginUser, 'Demo Login', 110, function () {
      if (caretUser) caretUser.style.display = 'none';
      setTimeout(function () {
        typeInto(loginPass, '•••••••••••••', 110, function () {
          if (caretPass) caretPass.style.display = 'none';
          status.textContent = 'Tap Log in to connect to AHIMA.';
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

function renderIdentity(mountId, p) {
  var el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = '<div class="avatar" style="background:' + p.avatarBg + '"><img src="' + p.avatar + '" alt="' + p.name + '" /></div><div><div class="name">' + p.name + '</div><div class="role">' + p.role + '</div></div>';
}

var MAP_COLORS = ['#C6741E', '#2F6B57', '#A24E20', '#D8994A', '#6B4A2A', '#3E7CA6', '#8B5FA3', '#4F8C6B'];

// Deterministic pseudo-random in [0,1) — same seed always gives the same
// value, so the graph doesn't reshuffle on window resize, but it isn't the
// neat mechanical fan a straight proportional mapping would produce.
function seededRandom(seed) {
  var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function computeMapConnections(nSkills, nRoles) {
  var conns = [];
  for (var i = 0; i < nSkills; i++) {
    var center = nSkills > 1 ? (i / (nSkills - 1)) * (nRoles - 1) : (nRoles - 1) / 2;
    var r = seededRandom(i * 3.1);
    var numLinks = r < 0.15 ? 1 : (r < 0.6 ? 2 : 3);
    var set = {};
    for (var k = 0; k < numLinks; k++) {
      var spread = (nRoles - 1) * 0.95;
      var jitter = (seededRandom(i * 5.7 + k * 2.3) - 0.5) * spread;
      var idx = Math.max(0, Math.min(nRoles - 1, Math.round(center + jitter)));
      set[idx] = true;
    }
    conns.push(Object.keys(set).map(Number));
  }
  return conns;
}

function renderMap(p, story, onMatched) {
  var el = document.getElementById('map-dynamic');
  if (!el) return;
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
    '<div class="map-match-btn" id="map-match-btn"><svg><use href="#i-target"/></svg>Match</div>' +
    '<div class="map-scroll"><div class="map-stage" id="map-stage" style="height:' + (Math.max(story.map.skills.length, story.map.roles.length) * 3.55 + 0.9) + 'rem">' +
      '<svg class="map-svg" id="map-svg"></svg>' +
      '<div class="map-cols"><div class="map-col" id="map-col-l">' + skillChips + '</div><div class="map-col right" id="map-col-r">' + roleChips + '</div></div>' +
    '</div>' +
    '<p class="map-foot">Tap Match to connect your skills to matching roles.</p></div>';

  var matchBtn = document.getElementById('map-match-btn');
  if (matchBtn) {
    matchBtn.addEventListener('click', function () {
      if (matchBtn.classList.contains('done')) {
        if (onMatched) onMatched();
        return;
      }
      matchBtn.classList.add('done');
      matchBtn.innerHTML = '<svg><use href="#i-arrow"/></svg>Next';
      drawMapLines();
      var foot = el.querySelector('.map-foot');
      if (foot) foot.textContent = 'Same evidence, mapped to adjacent-fit roles.';
    });
  }
}

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
  var nSkills = countChips('l');
  var nRoles = countChips('r');
  var connections = computeMapConnections(nSkills, nRoles);

  var parts = [];
  var delay = 0.35;
  connections.forEach(function (roleList, si) {
    var a = chipPoint('l', si);
    if (!a) return;
    roleList.forEach(function (ri) {
      var b = chipPoint('r', ri);
      if (!b) return;
      var midX = (a.x + b.x) / 2;
      var d = 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' C ' + midX.toFixed(1) + ' ' + a.y.toFixed(1) + ', ' + midX.toFixed(1) + ' ' + b.y.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      var color = MAP_COLORS[si % MAP_COLORS.length];
      var dl = delay.toFixed(2) + 's';
      parts.push('<path pathLength="1" class="map-path-glow" style="stroke:' + color + ';animation-delay:' + dl + '" d="' + d + '"/>');
      parts.push('<path pathLength="1" class="map-path" style="stroke:' + color + ';animation-delay:' + dl + '" d="' + d + '"/>');
      if (!reduceMotion) {
        var sparkBegin = (delay + 0.75).toFixed(2) + 's';
        parts.push(
          '<circle class="map-spark" r="2.6" fill="' + color + '">' +
            '<animateMotion dur="1s" begin="' + sparkBegin + '" fill="freeze" path="' + d + '"/>' +
            '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.85;1" dur="1s" begin="' + sparkBegin + '" fill="freeze"/>' +
          '</circle>'
        );
      }
      delay += 0.11;
    });
  });
  story_map_nodes(parts, 'l', chipPoint);
  story_map_nodes(parts, 'r', chipPoint);
  svg.innerHTML = parts.join('');
}

function story_map_nodes(parts, side, chipPoint) {
  var i = 0, pt;
  while ((pt = chipPoint(side, i))) {
    parts.push('<circle class="map-node" cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="2.8" style="animation-delay:' + (0.15 + i * 0.08).toFixed(2) + 's"/>');
    i++;
  }
}

window.addEventListener('resize', function () {
  if (document.getElementById('map-stage')) drawMapLines();
});

function renderHome(p, story) {
  renderIdentity('home-identity', p);
  var el = document.getElementById('home-content');
  if (!el) return;
  var skillRows = story.skills.map(function (s) {
    return '<div class="skill-row"><div class="skill-icon ' + s.icon + '"><svg><use href="#' + s.svg + '"/></svg></div>' +
      '<div><div class="skill-name">' + s.name + '</div><div class="skill-evidence">' + s.evidence + '</div></div>' +
      '<span class="tier ' + s.tier + '">' + tierLabel[s.tier] + '</span></div>';
  }).join('');
  var readyRows = story.ready.map(function (r) {
    return '<div class="ready-row"><div class="ready-icon"><svg><use href="#' + r.svg + '"/></svg></div>' +
      '<div><div class="ready-title">' + r.title + '</div><div class="ready-fit">' + r.fit + '% fit</div></div></div>';
  }).join('');
  el.innerHTML =
    '<div class="card"><div class="card-title-row"><span class="card-title">Verified skills</span><span class="count-chip">' + story.skills.length + ' skills</span></div>' +
      skillRows +
      '<div class="link-row" id="home-view-all-skills"><span>View all skills and evidence</span><svg><use href="#i-chev"/></svg></div></div>' +
    '<div class="record-banner"><div class="record-eyebrow">OVERALL RECORD</div><div class="record-title">' + story.recordLabel + '</div>' +
      '<div class="record-sub">' + story.recordSub + '</div>' +
      '<svg class="record-motif" viewBox="0 0 32 32"><rect x="2" y="20" width="7" height="10" rx="1.8" fill="rgba(255,255,255,0.16)"/><rect x="10.5" y="13" width="7" height="17" rx="1.8" fill="rgba(255,255,255,0.24)"/><rect x="19" y="6" width="7" height="24" rx="1.8" fill="rgba(255,255,255,0.34)"/><circle cx="22.5" cy="1.5" r="2.6" fill="rgba(255,255,255,0.5)"/></svg></div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Roles you&rsquo;re ready for</span></div>' + readyRows +
      '<div class="cta" id="home-see-matches">See all matches <svg><use href="#i-arrow"/></svg></div></div>';
}

function renderSkillDetail(p, story) {
  var titleEl = document.getElementById('skilldetail-title');
  if (titleEl) titleEl.textContent = story.skillDetail.name;
  var el = document.getElementById('skilldetail-body');
  if (!el) return;
  var sd = story.skillDetail;
  var errRows = sd.errors.map(function (e) {
    return '<div style="display:flex;justify-content:space-between;">' + e.t + ' <span class="mono">' + e.n + '</span></div>';
  }).join('');
  el.innerHTML =
    '<div class="card"><div class="card-title-row"><span class="card-title">Rundle evidence</span><span class="tier ' + sd.tier + '">' + tierLabel[sd.tier] + '</span></div>' +
      '<div class="bar-row"><div class="bar-label"><span>Accuracy</span><span class="mono">' + sd.accuracy + '%</span></div><div class="bar-track"><div class="bar-fill" style="width:' + sd.accuracy + '%"></div></div></div>' +
      '<div class="bar-row"><div class="bar-label"><span>' + sd.metricLabel + '</span><span class="mono">' + sd.count + '</span></div></div>' +
      '<div class="divider-label">Common error types</div>' +
      '<div style="font-size:0.72rem;color:var(--ink-soft);line-height:1.9;">' + errRows + '</div></div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Occupation benchmark</span></div>' +
      '<p style="font-size:0.72rem;color:var(--ink-soft);line-height:1.5;margin:0 0 0.5rem;">O&middot;NET: Medical Records Specialists (29-2072.00) ranks <strong style="color:var(--ink);">Attention to Detail</strong> as the single most important work style for this role &mdash; 100 of 100.</p>' +
      '<div class="bar-track"><div class="bar-fill" style="width:100%"></div></div></div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Credential tie-in</span></div>' +
      '<div style="display:flex;align-items:center;gap:0.5rem;"><svg style="width:1.1rem;height:1.1rem;color:var(--sienna)"><use href="#i-shield"/></svg>' +
      '<div><div style="font-size:0.78rem;font-weight:600;">' + p.cred + ' &middot; AHIMA</div><div class="status-ok"><svg><use href="#i-check"/></svg>' +
      (p.status === 'active' ? 'Active, verified' : 'In progress') + '</div></div></div></div>';
}

function renderMatches(p, story) {
  var el = document.getElementById('matches-body');
  if (!el) return;
  el.innerHTML = story.matches.map(function (m, i) {
    return '<div class="card match-card" data-match-idx="' + i + '"><div class="fit-ring" style="--fit:' + m.fit + '"><span>' + m.fit + '%</span></div>' +
      '<div class="match-body"><div class="match-title">' + m.title + '</div>' +
      '<div class="match-meta' + (m.good ? ' good' : '') + '">' + m.meta + '</div>' +
      (m.wage ? '<div class="match-wage">' + m.wage + '</div>' : '') +
      (m.hasPositions ? '<div class="match-positions-link" data-open-positions="1">See open positions <svg><use href="#i-chev"/></svg></div>' : '') +
      '</div></div>';
  }).join('');
}

// Called when the Matches screen becomes visible (not at render time) so the
// reveal actually plays while the user is looking at it.
function playMatchesFanfare() {
  var fanfare = document.getElementById('matches-fanfare');
  if (!fanfare || reduceMotion) return;
  fanfare.classList.add('show');
  setTimeout(function () { fanfare.classList.remove('show'); }, 3000);
}

function renderGap(p, story) {
  var g = story.gap;
  var header = document.getElementById('gapdetail-header');
  if (header) {
    header.innerHTML = '<div class="back-btn" data-back="matches" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;"><svg style="width:1rem;height:1rem;transform:rotate(180deg);color:var(--ink-soft)"><use href="#i-chev"/></svg><div class="name">' + g.title + '</div></div>' +
      '<div class="fit-ring" style="--fit:' + g.fit + ';width:2.1rem;height:2.1rem;font-size:0.6rem;"><span>' + g.fit + '%</span></div>';
  }
  var el = document.getElementById('gapdetail-body');
  if (!el) return;
  var haveRows = g.have.map(function (h) {
    return '<div class="gap-item have"><svg><use href="#i-check"/></svg><div><div class="t">' + h.t + '</div><div class="d">' + h.d + '</div></div></div>';
  }).join('');
  el.innerHTML =
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

var AHIMA_BADGE = '<span class="org-badge"><span class="org-mark">AH</span>AHIMA <svg><use href="#i-arrow"/></svg></span>';

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
    '<div class="card"><div class="provider-card"><div><div class="provider-name">' + t.recommended.name + '</div>' + AHIMA_BADGE + '</div>' +
    '<span class="badge-fund">' + t.recommended.badge + '</span></div></div>' +
    '<div class="divider-label">Completed</div>' +
    '<div class="card"><div class="gap-item have"><svg><use href="#i-check"/></svg><div><div class="t">' + t.completed.t + '</div><div class="d">' + t.completed.d + '</div></div></div></div>';
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
  el.innerHTML =
    '<div class="card"><div class="card-title-row"><span class="card-title">Credential</span></div>' + credBody + '</div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Employment history</span></div><div class="timeline">' + tl + '</div></div>' +
    '<div class="card"><div class="card-title-row"><span class="card-title">Who can see this</span></div>' +
      '<div class="toggle-row"><div><div class="t">Visible to employers</div><div class="d">Skills, credential, tenure</div></div><div class="switch on"></div></div>' +
      '<div class="toggle-row"><div><div class="t">Visible to training partners</div><div class="d">For funded course matching</div></div><div class="switch on"></div></div>' +
      '<div class="toggle-row"><div><div class="t">Include simulation detail</div><div class="d">Full task-level results</div></div><div class="switch off"></div></div></div>';
}

function renderPositions(p, story) {
  var titleEl = document.getElementById('positions-title');
  if (titleEl) titleEl.textContent = story.gap.title;
  var el = document.getElementById('positions-body');
  if (!el) return;
  var cards = story.positions.map(function (job) {
    return '<div class="card job-card">' +
      '<div class="job-logo" style="background:' + job.logoBg + '">' + job.logo + '</div>' +
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
  renderMatches(persona, story);
  renderGap(persona, story);
  renderTraining(persona, story);
  renderProfile(persona, story);
  renderPositions(persona, story);
}
