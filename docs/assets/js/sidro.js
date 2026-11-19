// Stranice Sidra (sidro.html i sidro-*.html): snimke zaslona, cijena s
// licencnog poslužitelja i obrazac za licencu. Svaki dio radi samo ako na
// stranici postoje njegovi elementi.
(function () {
  // Snimke zaslona: kartice nad jednom velikom snimkom i uvećana snimka u dijalogu.
  // Bez JS-a snimke su jedna ispod druge, a klik otvara sliku u novoj kartici preglednika.
  var snimke = document.getElementById('snimke');
  if (!snimke) return;

  var traka = snimke.querySelector('[role="tablist"]');
  var kartice = traka ? Array.prototype.slice.call(traka.querySelectorAll('[role="tab"]')) : [];
  var ploce = kartice.map(function (k) { return document.getElementById(k.getAttribute('aria-controls')); });

  function odaberi(i, fokus) {
    kartice.forEach(function (k, j) {
      var odabrana = j === i;
      k.setAttribute('aria-selected', odabrana ? 'true' : 'false');
      k.tabIndex = odabrana ? 0 : -1;
      ploce[j].hidden = !odabrana;
    });
    if (fokus) kartice[i].focus();
  }

  if (kartice.length && ploce.every(Boolean)) {
    ploce.forEach(function (p, j) {
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-labelledby', kartice[j].id);
    });
    snimke.classList.add('kao-kartice');
    traka.hidden = false;
    odaberi(0, false);

    kartice.forEach(function (k, i) {
      k.addEventListener('click', function () { odaberi(i, false); });
      k.addEventListener('keydown', function (e) {
        var n = kartice.length, cilj = -1;
        if (e.key === 'ArrowRight') cilj = (i + 1) % n;
        else if (e.key === 'ArrowLeft') cilj = (i + n - 1) % n;
        else if (e.key === 'Home') cilj = 0;
        else if (e.key === 'End') cilj = n - 1;
        if (cilj < 0) return;
        e.preventDefault();
        odaberi(cilj, true);
      });
    });

    // Druge dvije snimke učitavaju se čim se učita prva, da prebacivanje kartice ne čeka mrežu.
    var prva = ploce[0].querySelector('img');
    var ucitajOstale = function () {
      ploce.slice(1).forEach(function (p) {
        var s = p.querySelector('img');
        if (s) s.loading = 'eager';
      });
    };
    if (prva && !prva.complete) prva.addEventListener('load', ucitajOstale);
    else ucitajOstale();
  }

  // Uvećana snimka. Esc, gumb ili klik izvan slike zatvaraju dijalog; fokus se vraća na snimku.
  var dijalog = document.getElementById('snimkaDijalog');
  if (!dijalog || typeof dijalog.showModal !== 'function') return;
  var slika = dijalog.querySelector('img');
  var opis = dijalog.querySelector('.snimka-dijalog-opis');
  var okidac = null;

  snimke.addEventListener('click', function (e) {
    var poveznica = e.target.closest ? e.target.closest('a.pozornica') : null;
    if (!poveznica || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    var izvor = poveznica.querySelector('img');
    var natpis = poveznica.parentNode.querySelector('figcaption');
    slika.src = poveznica.getAttribute('href');
    slika.alt = izvor ? izvor.alt : '';
    if (izvor) {
      slika.setAttribute('width', izvor.getAttribute('width'));
      slika.setAttribute('height', izvor.getAttribute('height'));
    }
    opis.innerHTML = natpis ? natpis.innerHTML : '';
    okidac = poveznica;
    document.documentElement.classList.add('snimka-otvorena');
    dijalog.showModal();
    dijalog.querySelector('.snimka-zatvori').focus();
  });

  dijalog.addEventListener('click', function (e) {
    if (e.target !== slika) dijalog.close();
  });
  dijalog.addEventListener('close', function () {
    document.documentElement.classList.remove('snimka-otvorena');
    if (okidac) okidac.focus();
  });
})();

(function () {
  // Isti URL kao PODRAZUMIJEVANI_BACKEND_URL u src/sidro/core/licenca_klijent.py;
  // backend mora imati SIDRO_CORS_ORIGINS=https://majstoraj.hr
  var BACKEND_URL = 'https://licenca.majstoraj.hr';
  if (document.body.getAttribute('data-faza') !== 'prodaja') return;

  function formatEur(iznos) {
    return iznos.toFixed(2).replace('.', ',').replace(',00', '');
  }

  // Cijena s poslužitelja (SIDRO_CIJENA_LICENCE_EUR), da web i aplikacija
  // uvijek pokazuju isti iznos. Bez odgovora ostaje statični tekst (10).
  fetch(BACKEND_URL + '/licence/cijena')
    .then(function (o) { return o.ok ? o.json() : null; })
    .then(function (p) {
      if (!p || typeof p.iznos !== 'number') return;
      if (p.prodaja_otvorena === false) {
        var narudzba = document.getElementById('narudzba');
        var zatvorena = document.getElementById('prodajaZatvorena');
        var gumb = document.getElementById('gumbNarudzba');
        if (narudzba) narudzba.hidden = true;
        if (zatvorena) zatvorena.hidden = false;
        if (gumb) gumb.href = '/stranice/sidro-cijena.html#prodajaZatvorena';
      }
      document.querySelectorAll('.cijena-iznos').forEach(function (el) { el.textContent = formatEur(p.iznos); });
      if (p.iznos >= 20) {
        document.querySelectorAll('.cijena-stara, .lansirna-napomena').forEach(function (el) { el.hidden = true; });
      }
    })
    .catch(function () {});

  var forma = document.getElementById('sidroLicencaForm');
  var statusBox = document.getElementById('licencaFormStatus');
  var uplataBlok = document.getElementById('licencaUplataBlok');
  if (!forma) return;
  var submitBtn = forma.querySelector('.form-submit-btn');
  var tekstGumba = submitBtn.innerHTML;

  function prikaziGresku(poruka) {
    statusBox.className = 'form-status error';
    statusBox.textContent = poruka;
  }

  forma.addEventListener('submit', function (e) {
    e.preventDefault();
    var honeypot = forma.querySelector('#fi-website');
    if (honeypot && honeypot.value.trim() !== '') return; // vjerojatno bot
    if (!forma.checkValidity()) { forma.reportValidity(); return; }

    var tijelo = {
      oib: document.getElementById('fi-oib').value.trim(),
      naziv_obrta: document.getElementById('fi-naziv').value.trim(),
      adresa_obrta: document.getElementById('fi-adresa').value.trim(),
      mjesto_obrta: document.getElementById('fi-mjesto').value.trim(),
      email: document.getElementById('fi-email').value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Šaljem…';
    statusBox.className = 'form-status';
    statusBox.textContent = '';

    fetch(BACKEND_URL + '/licence/zatrazi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tijelo)
    })
      .then(function (odgovor) {
        if (odgovor.status === 409) {
          throw new Error('Za ovaj OIB već postoji aktivna licenca. Ako ste izgubili ključ, pišite na info@majstoraj.hr.');
        }
        if (odgovor.status === 422) {
          throw new Error('Provjerite podatke (osobito OIB i e-adresu) pa pokušajte ponovno.');
        }
        if (!odgovor.ok) {
          throw new Error('Licencni poslužitelj trenutno nije dostupan. Pokušajte za nekoliko minuta ili pišite na info@majstoraj.hr.');
        }
        return odgovor.json();
      })
      .then(function (podaci) {
        statusBox.className = 'form-status success';
        statusBox.textContent = 'Hvala! Podaci za uplatu su ispod, a poslali smo ih i na ' + tijelo.email + '. Ako poruka ne stigne, provjerite neželjenu poštu; podaci su i ovdje.';
        if (podaci.primatelj) document.getElementById('licencaPrimatelj').textContent = podaci.primatelj;
        document.getElementById('licencaIban').textContent = podaci.iban;
        document.getElementById('licencaModel').textContent = podaci.model;
        document.getElementById('licencaPozivNaBroj').textContent = podaci.poziv_na_broj;
        document.getElementById('licencaIznos').textContent = formatEur(podaci.iznos) + ' ' + podaci.valuta;
        // Bar-kod po neprediktivnom tokenu, ne po rednom broju zahtjeva.
        document.getElementById('licencaBarkodSlika').src = BACKEND_URL + '/licence/hub3-barkod/' + encodeURIComponent(podaci.token);
        uplataBlok.hidden = false;
        uplataBlok.scrollIntoView({ behavior: 'smooth', block: 'start' });
        forma.querySelectorAll('input').forEach(function (polje) { polje.disabled = true; });
        submitBtn.textContent = 'Zahtjev poslan';
      })
      .catch(function (greska) {
        // Mrežnu/CORS grešku fetch() javlja kao TypeError s engleskom porukom.
        prikaziGresku(greska instanceof TypeError || !greska.message
          ? 'Slanje nije uspjelo. Provjerite internetsku vezu i pokušajte ponovno.'
          : greska.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = tekstGumba;
      });
  });
})();
