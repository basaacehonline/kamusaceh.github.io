/* ==============================================================
   KONFIGURASI SERVER  (satu-satunya yang perlu Anda isi)
   Tempel URL aplikasi web Google Apps Script, yang berakhiran /exec
   Contoh: "https://script.google.com/macros/s/AKfy.../exec"
   ============================================================== */
var KAMUS_API = "https://script.google.com/macros/s/AKfycbx1ssf2Jkdv2lLWRa0c1b1MxUmtZMfLqWk_-RYC3h_V9ewzHyx1HKyWpy7PmSKkHmwC/exec";
/* ============================================================== */

var KAMUS_CONFIG = { loginUrl: KAMUS_API, addWordUrl: KAMUS_API, dataUrl: KAMUS_API };

function kamusGalat(pesan) {
  var el = document.getElementById("kamus-galat");
  if (!el) {
    el = document.createElement("div");
    el.id = "kamus-galat"; el.setAttribute("role", "alert");
    el.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;padding:14px 18px;border:2px solid currentColor;border-radius:14px;background:Canvas;color:CanvasText;font:600 16px/1.4 system-ui,sans-serif";
    document.body.appendChild(el);
    el.textContent = pesan || "Tidak dapat memuat data dari server. Coba muat ulang, atau periksa KAMUS_API di config.js.";
  } else if (pesan) el.textContent = pesan;
}

function kamusAmbil(aksi) {
  if (!KAMUS_API) {
    kamusGalat("Server belum disambungkan. Isi KAMUS_API di config.js dengan URL aplikasi web Apps Script.");
    return Promise.reject(new Error("KAMUS_API kosong"));
  }
  /* cache:"no-store" + penanda waktu: data selalu diambil baru dari server, tidak dari cache peramban */
  return fetch(KAMUS_API + (KAMUS_API.indexOf("?") < 0 ? "?" : "&") + "aksi=" + aksi + "&_=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.json(); });
}

/* bentuk data kontributor dari server -> bentuk yang dipakai halaman */
function kamusOrang(x) {
  var bln = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], j = String(x.j || ""), m = j.match(/^(\d{4})-(\d{2})/);
  return { n: x.n || x.username, r: x.r, j: m ? bln[+m[2] - 1] + " " + m[1] : j, kata: x.kata, sunting: x.sunting, verif: x.verif, lafal: x.lafal, streak: x.streak };
}

/* Tautan ke beranda: "/" diubah menjadi "/?" + 4 karakter acak campuran huruf dan angka, mis. /?k3x9.
   Alamat selalu baru, jadi beranda dimuat dari server dan tidak dari cache peramban.
   Tanpa JavaScript tautan tetap "/". Kode yang sama ada di 404.html (halaman itu tidak memuat file ini). */
function kamusAcak() {
  var h = "abcdefghijklmnopqrstuvwxyz", d = "0123456789", s = h + d, a = [], i, j, t;
  var r = function (n) { return Math.floor(Math.random() * n); };
  a.push(h.charAt(r(26)), d.charAt(r(10)), s.charAt(r(36)), s.charAt(r(36)));   /* minimal satu huruf dan satu angka */
  for (i = a.length - 1; i > 0; i--) { j = r(i + 1); t = a[i]; a[i] = a[j]; a[j] = t; }
  return a.join("");
}
(function () {
  function acak(a) { a.setAttribute("href", "/?" + kamusAcak()); a.setAttribute("data-beranda", ""); }
  function cocok(a) { return a && (a.getAttribute("href") === "/" || a.hasAttribute("data-beranda")); }
  function semua() { var l = document.querySelectorAll('a[href="/"],a[data-beranda]'), i; for (i = 0; i < l.length; i++) acak(l[i]); }
  function pilih(e) { var a = e.target && e.target.closest ? e.target.closest("a") : null; if (cocok(a)) acak(a); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", semua); else semua();
  ["pointerdown", "click", "auxclick", "keydown"].forEach(function (n) { document.addEventListener(n, pilih, true); });
})();

/* Sembunyikan tombol sunting dan hapus pada halaman entri bagi pengguna yang belum masuk. */
(function () {
  var style = document.createElement("style");
  style.textContent = ".crud{display:none!important}.crud.authenticated{display:grid!important}";
  document.head.appendChild(style);

  function sinkronCrud() {
    var crud = document.querySelector(".crud");
    if (!crud) return;
    var token = null;
    try { token = sessionStorage.getItem("kamus-token"); } catch (e) {}
    crud.classList.toggle("authenticated", !!token);
  }
  function mulai() {
    sinkronCrud();
    var tombolLogin = document.getElementById("loginBtn");
    if (tombolLogin && window.MutationObserver) {
      new MutationObserver(sinkronCrud).observe(tombolLogin, { childList: true, subtree: true, characterData: true });
    }
    window.addEventListener("storage", sinkronCrud);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();
})();
