// Formulář: demo režim neodesílá nic, ostrý režim posílá na endpoint ze site.json (data-endpoint).
(function () {
  document.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      var demo = f.getAttribute('data-demo') === '1';
      if (f.querySelector('.past input').value) { e.preventDefault(); return; }   // robot
      if (demo || !endpoint) {
        e.preventDefault();
        stav.textContent = 'Ukázka formuláře: nic se neodesílá. Po spuštění webu bude zpráva doručena na e-mail firmy.';
        return;
      }
      e.preventDefault();
      stav.textContent = 'Odesílám…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Děkujeme, zpráva byla odeslána.'; })
        .catch(function () { stav.textContent = 'Odeslání se nepodařilo. Napište nám prosím e-mailem.'; });
    });
  });
})();

// Kalendář obsazenosti: ukázka vzhledu s vymyšlenými termíny (ostrý web zobrazí Google kalendář jen ke čtení).
(function () {
  var box = document.querySelector('[data-kal]');
  if (!box) return;
  var mesice = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
  var dnes = new Date(); var ofs = 0;
  function obs(y, m, d) { return ((y * 31 + m * 7 + d * 3) % 11 < 3) || (d >= 12 && d <= 15 && m % 2 === 0); }
  function kresli() {
    var z = new Date(dnes.getFullYear(), dnes.getMonth() + ofs, 1), y = z.getFullYear(), m = z.getMonth();
    var pocet = new Date(y, m + 1, 0).getDate(), start = (z.getDay() + 6) % 7;
    var h = '<div class="kal-hlava"><button type="button" aria-label="Předchozí měsíc"' + (ofs === 0 ? ' disabled' : '') + ' data-p="-1">‹</button><strong>' + mesice[m] + ' ' + y + '</strong><button type="button" aria-label="Další měsíc" data-p="1">›</button></div><div class="kal-mrizka">';
    ['po','út','st','čt','pá','so','ne'].forEach(function (n) { h += '<span class="dn">' + n + '</span>'; });
    for (var i = 0; i < start; i++) h += '<span></span>';
    for (var d = 1; d <= pocet; d++) {
      var minulo = ofs === 0 && d < dnes.getDate();
      h += '<span class="den' + (minulo ? ' minulo' : (obs(y, m, d) ? ' obs' : '')) + '">' + d + '</span>';
    }
    box.innerHTML = h + '</div>';
    box.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { ofs = Math.max(0, Math.min(11, ofs + Number(b.getAttribute('data-p')))); kresli(); });
    });
  }
  kresli();
})();
