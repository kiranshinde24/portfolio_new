const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement, EMAIL = 'kiran.k.shinde2004@gmail.com', GH = 'https://github.com/kiranshinde24', IEEE = 'https://ieeexplore.ieee.org/author/280586419587211';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const toast = (m) => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2200); };

/* ---------- Data ---------- */
const PROJECTS = [
  { id: 'ims', cat: 'fullstack', t: 'Insurance Policy Management System',
    d: 'Role-based platform where admins, agents and customers manage policies, payments and claims.',
    pts: ['JWT authentication with Spring Security RBAC for three roles (admin, agent, customer).', 'Premium calculation engine and a claims workflow with approve/reject.', 'AI fraud-scoring service (Random Forest served via FastAPI) that returns a 0–1 risk score per claim.', 'REST APIs documented in Swagger UI and tested with JUnit 5, Mockito and AssertJ.'],
    tags: ['Java 21', 'Spring Boot', 'MySQL', 'JWT', 'FastAPI'], gh: 'insurance-management-system' },
  { id: 'cure', cat: 'fullstack', t: 'CureBuddy',
    d: 'Live doctor appointment app with patient, doctor and admin roles.',
    pts: ['React + TypeScript + Tailwind frontend on Vercel; Node/Express API on Render; MongoDB Atlas.', 'JWT auth for three roles and Multer-based file uploads.', 'Doctor availability and scheduling that blocks double-booking.'],
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind'], gh: 'CureBuddy', live: 'https://cure-buddy.vercel.app' },
  { id: 'sketch', cat: 'ai', t: 'Forensic Sketch-to-Image Generation',
    d: 'Benchmark of four generative model families that turn face sketches into realistic photos.',
    pts: ['Compared Pix2Pix GAN, conditional diffusion, Vision Transformer and VAE on 21,000+ paired samples.', 'Evaluated with PSNR, SSIM, LPIPS and CLIPScore; Pix2Pix led at 30.5 dB PSNR.', 'Built a two-page Gradio UI to compare models side by side.'],
    tags: ['PyTorch', 'Diffusers', 'GAN', 'CLIP', 'Gradio'], gh: 'Skethc-to-real-images-using-genai-mode' },
  { id: 'asl', cat: 'ai', t: 'Real-Time Sign Language Recognition',
    d: 'Reads American Sign Language letters from a webcam and shows the result live.',
    pts: ['Six-stage pipeline: OpenCV capture, MediaPipe hand landmarks, resize, MobileNetV2 classification.', 'Trained a TensorFlow classifier for all 26 letters (A–Z).', 'Documented the method and results in an IEEE-format paper.', 'Live demo hosted on GitHub Pages.'],
    tags: ['TensorFlow', 'OpenCV', 'MediaPipe', 'Python'], gh: 'Real-time-Sign-Language-Recognition-using-MobileNet-Mediapipe', live: 'https://kiranshinde24.github.io/Real-time-Sign-Language-Recognition-using-MobileNet-Mediapipe/' },
  { id: 'med', cat: 'ai', t: 'Medical Cost Prediction',
    d: 'Predicts individual insurance costs from age, BMI, smoking status, dependents, gender and region.',
    pts: ['End-to-end regression workflow in Jupyter: cleaning, feature handling, training and evaluation.', 'Deployed as an interactive Streamlit web app anyone can try.'],
    tags: ['Python', 'Scikit-learn', 'Streamlit', 'Jupyter'], gh: 'medical-cost-prediction', live: 'https://medical-cost-prediction-6rdftrjlmuht7adz4idu2u.streamlit.app/' }
];
const SKILLS = {
  Backend: ['Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'REST APIs', 'JWT & RBAC', 'Node.js', 'Express'],
  Frontend: ['React.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Responsive design'],
  'Data & Cloud': ['MySQL', 'MongoDB', 'SQL optimization', 'AWS EC2 / S3 / IAM', 'Vercel', 'Render'],
  'Applied AI': ['PyTorch', 'TensorFlow', 'Scikit-learn', 'FastAPI', 'OpenCV', 'Hugging Face Diffusers'],
  'Quality & Tools': ['JUnit 5', 'Mockito', 'Postman', 'Swagger', 'Maven', 'Git & GitHub', 'Agile / Scrum']
};

/* ---------- Theme, progress, scroll spy ---------- */
const setTheme = (t) => { root.dataset.theme = t; try { localStorage.setItem('t', t); } catch (e) {} };
const toggleTheme = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
$('#theme').onclick = toggleTheme;
const onScroll = () => {
  const h = root.scrollHeight - innerHeight;
  $('#bar').style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  $('#nav').classList.toggle('scrolled', scrollY > 8);
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const links = $$('#links a');
const spy = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach((s) => spy.observe(s));
$('#yr').textContent = new Date().getFullYear();

/* ---------- Typing effect ---------- */
const words = ['secure Spring Boot APIs.', 'clean React interfaces.', 'AI-powered features.', 'things that ship.'];
const tEl = $('#type');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) tEl.textContent = words[0];
else {
  let w = 0, c = 0, del = false;
  (function tick() {
    const s = words[w]; c += del ? -1 : 1; tEl.textContent = s.slice(0, c);
    let d = del ? 35 : 70;
    if (!del && c === s.length) { del = true; d = 1600; }
    else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 300; }
    setTimeout(tick, d);
  })();
}

/* ---------- Projects: render, filter, tilt, modal ---------- */
const grid = $('#grid');
grid.innerHTML = PROJECTS.map((p) => `
  <article class="card reveal" data-id="${p.id}" data-cat="${p.cat}" tabindex="0" role="button" aria-label="Open details for ${esc(p.t)}">
    <h3>${esc(p.t)}</h3><p>${esc(p.d)}</p>
    <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    <span class="more">${p.live ? 'Live demo + details →' : 'View details →'}</span>
  </article>`).join('');
$('#filters').onclick = (e) => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#filters button').forEach((x) => x.classList.toggle('on', x === b));
  $$('.card').forEach((c) => {
    const show = b.dataset.f === 'all' || c.dataset.cat === b.dataset.f;
    c.hidden = !show; c.classList.remove('pop'); if (show) { void c.offsetWidth; c.classList.add('pop'); }
  });
};
grid.addEventListener('pointermove', (e) => {
  const c = e.target.closest('.card'); if (!c || e.pointerType !== 'mouse') return;
  const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
  c.style.transform = `rotateY(${(x - .5) * 6}deg) rotateX(${(.5 - y) * 6}deg) translateY(-3px)`;
});
grid.addEventListener('pointerout', (e) => { const c = e.target.closest('.card'); if (c) c.style.transform = ''; });
const modal = $('#modal');
const openProject = (id) => {
  const p = PROJECTS.find((x) => x.id === id); if (!p) return;
  $('#mbody').innerHTML = `
    <button class="x" data-close aria-label="Close">×</button>
    <h3>${esc(p.t)}</h3><p>${esc(p.d)}</p>
    <ul class="pts">${p.pts.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    <div class="acts">${p.live ? `<a class="btn" href="${p.live}" target="_blank" rel="noopener">Live demo ↗</a>` : ''}
    <a class="btn ${p.live ? 'ghost' : ''}" href="${GH}/${p.gh}" target="_blank" rel="noopener">Source on GitHub ↗</a></div>`;
  modal.showModal();
};
grid.onclick = (e) => { const c = e.target.closest('.card'); if (c) openProject(c.dataset.id); };
grid.onkeydown = (e) => { if (e.key === 'Enter' && e.target.matches('.card')) openProject(e.target.dataset.id); };
modal.onclick = (e) => { if (e.target === modal || e.target.closest('[data-close]')) modal.close(); };

/* ---------- Skills tabs ---------- */
const tabs = $('#tabs'), chips = $('#chips');
const showSkills = (k) => {
  $$('button', tabs).forEach((b) => { const on = b.textContent === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  chips.innerHTML = SKILLS[k].map((s, i) => `<li style="animation-delay:${i * 45}ms">${esc(s)}</li>`).join('');
};
tabs.innerHTML = Object.keys(SKILLS).map((k) => `<button role="tab">${esc(k)}</button>`).join('');
tabs.onclick = (e) => { if (e.target.matches('button')) showSkills(e.target.textContent); };
showSkills('Backend');

/* ---------- Scroll reveal + counters ---------- */
const countUp = (el) => {
  const n = +el.dataset.n, s = el.dataset.s || '', t0 = performance.now(); el.dataset.started = 1;
  const f = (t) => { const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(n * (1 - (1 - p) ** 3)).toLocaleString('en-US') + s; if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
};
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  $$('b[data-n]', e.target).forEach(countUp);
}), { threshold: 0.12 });
$$('.reveal').forEach((el) => io.observe(el));

/* ---------- Live GitHub data (public API, no key) ---------- */
fetch('https://api.github.com/users/kiranshinde24').then((r) => r.ok ? r.json() : Promise.reject())
  .then((u) => { const b = $('#repos'); b.dataset.n = u.public_repos; if (b.dataset.started) b.textContent = u.public_repos; }).catch(() => {});
fetch('https://api.github.com/users/kiranshinde24/repos?sort=updated&per_page=8').then((r) => r.ok ? r.json() : Promise.reject())
  .then((rs) => {
    const list = rs.filter((r) => !r.fork).slice(0, 4);
    $('#gh').innerHTML = list.map((r) => `<li><a href="${esc(r.html_url)}" target="_blank" rel="noopener"><b>${esc(r.name)}</b><small>${esc(r.description || r.language || 'Repository')}</small></a></li>`).join('');
    $('#ghnote').textContent = '· live from the GitHub API';
  }).catch(() => { $('#gh').innerHTML = `<li><a href="${GH}" target="_blank" rel="noopener"><b>See all repositories</b><small>github.com/kiranshinde24</small></a></li>`; });

/* ---------- Command palette (Ctrl/Cmd + K) ---------- */
const go = (id) => () => $(id).scrollIntoView({ behavior: 'smooth' });
const open = (u) => () => window.open(u, '_blank', 'noopener');
const copyMail = () => navigator.clipboard.writeText(EMAIL).then(() => toast('Email copied'), () => toast(EMAIL));
const CMDS = [
  { n: 'Go to About', h: 'section', f: go('#about') }, { n: 'Go to Work', h: 'section', f: go('#work') },
  { n: 'Go to Experience', h: 'section', f: go('#experience') }, { n: 'Go to Skills', h: 'section', f: go('#skills') },
  { n: 'Go to Contact', h: 'section', f: go('#contact') }, { n: 'Go to Credentials', h: 'section', f: go('#credentials') },
  { n: 'Verify AWS certification', h: 'link', f: open('https://aws.amazon.com/verification') }, { n: 'Read IEEE publication', h: 'link', f: open(IEEE) },
  ...PROJECTS.map((p) => ({ n: 'Project: ' + p.t, h: 'details', f: () => openProject(p.id) })),
  { n: 'Toggle light / dark theme', h: 'action', f: toggleTheme }, { n: 'Copy email address', h: 'action', f: copyMail },
  { n: 'Open résumé', h: 'file', f: open('assets/Kiran_Shinde_Resume.pdf') },
  { n: 'Open GitHub', h: 'link', f: open(GH) }, { n: 'Open LinkedIn', h: 'link', f: open('https://www.linkedin.com/in/kiran-shinde24') }
];
const cmd = $('#cmd'), q = $('#q'), res = $('#res'); let shown = [], sel = 0;
const drawCmds = () => {
  const s = q.value.toLowerCase(); shown = CMDS.filter((c) => c.n.toLowerCase().includes(s));
  sel = Math.min(sel, Math.max(shown.length - 1, 0));
  res.innerHTML = shown.map((c, i) => `<li role="option" data-i="${i}" class="${i === sel ? 'sel' : ''}"><span>${esc(c.n)}</span><small class="mono">${c.h}</small></li>`).join('') || '<li class="none">No results</li>';
};
const runCmd = (i) => { const c = shown[i]; if (c) { cmd.close(); c.f(); } };
const openCmd = () => { q.value = ''; sel = 0; drawCmds(); cmd.showModal(); q.focus(); };
$('#openCmd').onclick = openCmd;
q.oninput = () => { sel = 0; drawCmds(); };
q.onkeydown = (e) => {
  if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); drawCmds(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); drawCmds(); e.preventDefault(); }
  else if (e.key === 'Enter') runCmd(sel);
};
res.onclick = (e) => { const li = e.target.closest('li[data-i]'); if (li) runCmd(+li.dataset.i); };
cmd.onclick = (e) => { if (e.target === cmd) cmd.close(); };
addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmd(); } });

/* ---------- Contact ---------- */
$('#copy').onclick = copyMail;
$('#form').onsubmit = (e) => {
  e.preventDefault(); const f = new FormData(e.target);
  const subject = encodeURIComponent('Portfolio enquiry from ' + f.get('name'));
  const body = encodeURIComponent(`${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`);
  location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`; toast('Opening your email app…');
};
