/* RESQ-X: interactive 3D Raspberry Pi 5.
 * Source for assets/js/pi-viewer.js. Build with: npm run build:viewer */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* Marker positions are in model space (1 unit = 1 cm, board centred on the origin). */
var PARTS = [
  { id: 'cpu',   name: 'BCM2712 processor', pos: [-1.12, -0.08, 0.47],  view: { az: 20, el: 48 },
    text: 'Quad-core Arm Cortex-A76 chip. It runs the RESQ-X software, including the camera stream and the planned AI-assisted driving.' },
  { id: 'ram',   name: 'Memory (RAM)',      pos: [-1.11, -0.34, -1.16], view: { az: 20, el: 52 },
    text: 'Working memory the software uses while the robot is running.' },
  { id: 'rp1',   name: 'RP1 I/O chip',      pos: [1.4, -0.36, -0.75],   view: { az: 25, el: 50 },
    text: 'Handles the USB ports, Ethernet, the camera connectors and the GPIO pins.' },
  { id: 'gpio',  name: '40-pin GPIO header', pos: [-1.19, 0.41, -2.51], view: { az: 8, el: 42 },
    text: 'Add-on boards and sensors connect here. Motor driver boards and sensors such as the MLX90640 and MPU6050 typically use these pins.' },
  { id: 'cam',   name: 'Camera and display connectors', pos: [0.77, -0.03, 1.86], view: { az: -6, el: 36 },
    text: 'Two MIPI connectors for cameras or displays. The Pi camera that provides live video plugs in here.' },
  { id: 'usb',   name: 'USB ports',         pos: [3.56, 1.23, -1.06],   view: { az: 62, el: 26 },
    text: 'Two USB 3.0 and two USB 2.0 ports for accessories.' },
  { id: 'eth',   name: 'Gigabit Ethernet',  pos: [3.3, 0.93, 1.71],     view: { az: 62, el: 26 },
    text: 'Wired network connection, handy for setting up and testing.' },
  { id: 'hdmi',  name: 'Micro-HDMI ports',  pos: [-1.19, -0.13, 2.47],  view: { az: 0, el: 32 },
    text: 'Two display outputs, useful when setting the robot up.' },
  { id: 'power', name: 'USB-C power input', pos: [-3.32, -0.11, 2.46],  view: { az: -18, el: 32 },
    text: 'Powers the board. RESQ-X plans to run from power banks.' },
  { id: 'sd',    name: 'microSD slot (underside)', pos: [-3.71, -1.11, -0.06], view: { az: 25, el: -52 },
    text: 'Holds the operating system and the robot\u2019s software. It sits on the underside of the board.' }
];
var VIEWS = {
  def:   { az: 35, el: 36 },
  top:   { az: 0,  el: 86 },
  ports: { az: 90, el: 14 },
  under: { az: 25, el: -56 }
};
var D2R = Math.PI / 180;

function init(root) {
  if (root.__pi) return;
  root.__pi = true;

  var stage = root.querySelector('.viewer-stage');
  var pinsBox = root.querySelector('.viewer-pins');
  var info = root.querySelector('.viewer-info');
  var bar = root.querySelector('.viewer-bar');
  var loading = root.querySelector('.viewer-loading');
  var loadingText = loading.querySelector('span');
  var fill = loading.querySelector('i');
  var hint = root.querySelector('.viewer-hint');
  var infoTitle = info.querySelector('strong');
  var infoText = info.querySelector('span');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    loadingText.textContent = '3D view is not available on this device.';
    fill.style.display = 'none';
    root.classList.add('nogl');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.insertBefore(renderer.domElement, stage.querySelector('.viewer-pins'));

  var scene = new THREE.Scene();
  var pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;
  var key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(6, 12, 7); scene.add(key);
  var rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(-8, 4, -7); scene.add(rim);

  /* a faint pool of light under the board so it does not float in the void */
  var gc = document.createElement('canvas'); gc.width = gc.height = 256;
  var gx = gc.getContext('2d'), gg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gg.addColorStop(0, 'rgba(255,255,255,0.12)'); gg.addColorStop(1, 'rgba(255,255,255,0)');
  gx.fillStyle = gg; gx.fillRect(0, 0, 256, 256);
  var glow = new THREE.Mesh(new THREE.PlaneGeometry(30, 30),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = -1.5; glow.renderOrder = -1; scene.add(glow);

  var camera = new THREE.PerspectiveCamera(28, 1.6, 0.1, 200);
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.enablePan = false; controls.rotateSpeed = 0.8;
  controls.autoRotate = !reduce; controls.autoRotateSpeed = 1.2;
  controls.enableZoom = false;                       /* plain scroll must keep scrolling the page */
  renderer.domElement.style.touchAction = 'pan-y';   /* vertical swipes scroll the page on touch screens */
  renderer.domElement.addEventListener('wheel', function (e) { controls.enableZoom = e.ctrlKey || e.metaKey; }, { capture: true, passive: true });

  var base = 18, model = null, dirty = true, visible = true, tween = null, pins = [], showPins = true, lastOcc = 0;
  var raycaster = new THREE.Raycaster(), tmp = new THREE.Vector3(), dir = new THREE.Vector3();

  function clampEl(e) { return Math.max(-86, Math.min(86, e)); }
  function sph() {
    var v = camera.position.clone().sub(controls.target), r = v.length();
    return { r: r, az: Math.atan2(v.x, v.z) / D2R, el: Math.asin(v.y / r) / D2R, tx: controls.target.x, ty: controls.target.y, tz: controls.target.z };
  }
  function place(s) {
    var el = s.el * D2R, az = s.az * D2R;
    camera.position.set(s.tx + s.r * Math.cos(el) * Math.sin(az), s.ty + s.r * Math.sin(el), s.tz + s.r * Math.cos(el) * Math.cos(az));
    controls.target.set(s.tx, s.ty, s.tz);
    controls.update(); dirty = true;
  }
  function viewTo(v, opts) {
    opts = opts || {};
    var cur = sph();
    var to = { r: v.r || base, az: cur.az + ((((v.az - cur.az + 540) % 360) + 360) % 360 - 180), el: clampEl(v.el),
               tx: v.tx || 0, ty: v.ty || 0, tz: v.tz || 0 };
    if (tween) tween.kill();
    if (window.gsap && !reduce && !opts.instant) {
      tween = window.gsap.to(cur, Object.assign({}, to, { duration: 1.15, ease: 'power3.inOut', onUpdate: function () { place(cur); } }));
    } else { place(to); }
  }
  function setAuto(on) {
    controls.autoRotate = on;
    var b = root.querySelector('[data-act="rotate"]'); if (b) b.setAttribute('aria-pressed', String(on));
  }

  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    var hf = 2 * Math.atan(Math.tan(camera.fov * D2R / 2) * camera.aspect);
    var prev = base; base = Math.max(17, (camera.aspect < 1.4 ? 6.7 : 7.6) / Math.tan(hf / 2));
    controls.minDistance = base * 0.3; controls.maxDistance = base * 1.8;
    var s = sph(); s.r = s.r * base / prev; place(s);
    dirty = true;
  }
  place({ r: base, az: VIEWS.def.az, el: VIEWS.def.el, tx: 0, ty: 0, tz: 0 });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);
  resize();
  place({ r: base, az: VIEWS.def.az, el: VIEWS.def.el, tx: 0, ty: 0, tz: 0 });

  /* ---------- markers ---------- */
  function select(p, focus) {
    pins.forEach(function (q) { q.el.classList.toggle('on', q === p); q.el.setAttribute('aria-pressed', String(q === p)); });
    if (!p) { infoTitle.textContent = 'Select a marker'; infoText.textContent = 'Each marker names a part of the board and what it does for RESQ-X.'; return; }
    infoTitle.textContent = p.name; infoText.textContent = p.text;
    if (focus) { setAuto(false); viewTo({ r: base * 0.62, az: p.view.az, el: p.view.el, tx: p.pos[0], ty: p.pos[1] + (p.view.el < 0 ? 0.2 : -0.25), tz: p.pos[2] }); }
  }
  function buildPins() {
    PARTS.forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pin'; b.setAttribute('aria-label', d.name); b.setAttribute('aria-pressed', 'false');
      var tip = document.createElement('span'); tip.className = 'tip'; tip.textContent = d.name; b.appendChild(tip);
      var p = { id: d.id, name: d.name, text: d.text, pos: d.pos, view: d.view, el: b, vis: true, occ: false };
      b.addEventListener('click', function () { select(p.el.classList.contains('on') ? null : p, true); });
      pinsBox.appendChild(b); pins.push(p);
    });
  }
  function updatePins(now) {
    var w = stage.clientWidth, h = stage.clientHeight;
    pins.forEach(function (p) {
      tmp.set(p.pos[0], p.pos[1], p.pos[2]).project(camera);
      var x = (tmp.x * 0.5 + 0.5) * w, y = (-tmp.y * 0.5 + 0.5) * h;
      p.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      p.el.classList.toggle('flip', x > w * 0.66);
      p.inView = tmp.z < 1 && x > 8 && x < w - 8 && y > 8 && y < h - 8;
    });
    if (now - lastOcc > 90 && model) {
      lastOcc = now;
      pins.forEach(function (p) {
        if (!p.inView) { p.occ = true; return; }
        tmp.set(p.pos[0], p.pos[1], p.pos[2]);
        dir.copy(tmp).sub(camera.position); var dist = dir.length(); dir.normalize();
        raycaster.set(camera.position, dir); raycaster.far = dist - 0.05;
        p.occ = raycaster.intersectObject(model, true).length > 0;
      });
    }
    pins.forEach(function (p) { p.el.classList.toggle('hide', !showPins || !p.inView || p.occ); });
  }

  /* ---------- controls UI ---------- */
  var interacted = false;
  controls.addEventListener('start', function () {
    if (tween) tween.kill();
    setAuto(false);
    if (!interacted) { interacted = true; hint.classList.add('gone'); }
  });
  controls.addEventListener('change', function () { dirty = true; });
  bar.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'rotate') { setAuto(!controls.autoRotate); }
    else if (act === 'labels') { showPins = !showPins; t.setAttribute('aria-pressed', String(showPins)); dirty = true; }
    else if (act === 'reset') { select(null); setAuto(false); viewTo(Object.assign({ r: base }, VIEWS.def)); }
    else if (VIEWS[act]) { select(null); setAuto(false); viewTo(Object.assign({ r: base }, VIEWS[act])); }
    hint.classList.add('gone');
  });
  stage.addEventListener('dblclick', function () { select(null); setAuto(false); viewTo(Object.assign({ r: base }, VIEWS.def)); });
  stage.addEventListener('keydown', function (e) {
    var s = sph(), k = e.key, used = true;
    if (k === 'ArrowLeft') s.az -= 8; else if (k === 'ArrowRight') s.az += 8;
    else if (k === 'ArrowUp') s.el = clampEl(s.el + 6); else if (k === 'ArrowDown') s.el = clampEl(s.el - 6);
    else if (k === '+' || k === '=') s.r = Math.max(controls.minDistance, s.r * 0.9);
    else if (k === '-') s.r = Math.min(controls.maxDistance, s.r / 0.9);
    else if (k === 'Home') { select(null); viewTo(Object.assign({ r: base }, VIEWS.def)); return e.preventDefault(); }
    else used = false;
    if (used) { e.preventDefault(); setAuto(false); hint.classList.add('gone'); place(s); }
  });

  /* ---------- render loop (only while on screen) ---------- */
  var raf = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    var moved = controls.update();
    if (moved || dirty) { renderer.render(scene, camera); updatePins(now); dirty = false; }
  }
  function run(on) {
    if (on && !raf) raf = requestAnimationFrame(frame);
    else if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; run(visible && !document.hidden); }).observe(stage);
  }
  document.addEventListener('visibilitychange', function () { run(visible && !document.hidden); });

  /* ---------- load the model ---------- */
  new GLTFLoader().load(root.getAttribute('data-model'), function (gltf) {
    model = gltf.scene; scene.add(model);
    buildPins(); select(null);
    root.classList.add('ready'); bar.hidden = false; info.hidden = false; loading.hidden = true;
    var rb = root.querySelector('[data-act="rotate"]'); if (rb) rb.setAttribute('aria-pressed', String(controls.autoRotate));
    dirty = true; lastOcc = 0; run(visible && !document.hidden);
    root.dispatchEvent(new CustomEvent('pi-ready'));
  }, function (ev) {
    if (ev.lengthComputable) {
      var f = ev.loaded / ev.total; fill.style.transform = 'scaleX(' + f.toFixed(3) + ')';
      loadingText.textContent = 'Loading 3D model ' + Math.round(f * 100) + '%';
    }
  }, function () {
    loadingText.textContent = 'The 3D model could not be loaded.'; fill.style.display = 'none'; root.classList.add('nogl');
  });
}

window.RESQPiViewer = { init: init };
