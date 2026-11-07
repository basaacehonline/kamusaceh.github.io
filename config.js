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
    el.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;padding:14px 18px;border:2px solid currentColor;border-radius:14px;background:Canvas;color:CanvasText;font:600 15px/1.4 system-ui,sans-serif;text-align:center";
    document.body.appendChild(el);
    el.textContent = pesan || "Tidak dapat memuat data dari server. Coba muat ulang, atau periksa KAMUS_API di config.js.";
  } else if (pesan) el.textContent = pesan;
}

function kamusAmbil(aksi) {
  if (!KAMUS_API) {
    kamusGalat("Server belum disambungkan. Isi KAMUS_API di config.js dengan URL aplikasi web Apps Script.");
    return Promise.reject(new Error("KAMUS_API kosong"));
  }
  return fetch(KAMUS_API + (KAMUS_API.indexOf("?") < 0 ? "?" : "&") + "aksi=" + aksi).then(function (r) { return r.json(); });
}

/* bentuk data kontributor dari server -> bentuk yang dipakai halaman */
function kamusOrang(x) {
  var bln = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], j = String(x.j || ""), m = j.match(/^(\d{4})-(\d{2})/);
  return { n: x.n || x.username, r: x.r, j: m ? bln[+m[2] - 1] + " " + m[1] : j, kata: x.kata, sunting: x.sunting, verif: x.verif, lafal: x.lafal, streak: x.streak };
}
