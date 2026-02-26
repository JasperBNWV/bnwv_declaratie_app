import { DeclaratieItem } from "../types"

export function generateBookmarklet(declaratie: DeclaratieItem): string {
  const doelDatum = declaratie.datum.split("-").reverse().join("-") // "DD-MM-YYYY"
  const [, doelMaand, doelJaar] = doelDatum.split("-").map(Number)

  const data = {
    soort: declaratie.soort,
    doelDatum,        // "DD-MM-YYYY" voor title-attribuut matching
    doelMaand,        // numeriek voor maandnavigatie
    doelJaar,
    omschrijving: declaratie.omschrijving,
    km: declaratie.km,
    retour: declaratie.retour,
  }

  const script = `
(function() {
  const d = ${JSON.stringify(data)};

  // 1. Soort
  const soortEl = document.getElementById('rd-soort');
  if (soortEl) { soortEl.value = d.soort; soortEl.dispatchEvent(new Event('change')); }

  // 2. Omschrijving
  const omschrEl = document.getElementById('rd-omschrijving');
  if (omschrEl) omschrEl.value = d.omschrijving;

  // 3. Km
  const kmEl = document.getElementById('rd-afstand');
  if (kmEl && d.km != null) { kmEl.value = d.km; kmEl.dispatchEvent(new Event('input')); }

  // 4. Retour
  const retourEl = document.getElementById('rd-retour');
  if (retourEl) retourEl.checked = d.retour;

  // 5. Datum: navigeer naar de juiste maand indien nodig, dan klik de dag
  function selecteerDag() {
    const link = Array.from(document.querySelectorAll('.datepick a'))
      .find(el => el.getAttribute('title') === d.doelDatum);
    if (link) { link.click(); return true; }
    return false;
  }

  if (!selecteerDag()) {
    // Huidige maand klopt niet — navigeer via de prev-knop of next-knop
    const maandSelect = document.querySelector('.datepick-month-year[title*="maand"], select.datepick-month-year');
    if (maandSelect) {
      // Stel de maand/jaar dropdowns in als die beschikbaar zijn
      const opties = Array.from(maandSelect.options || []);
      const doelOptie = opties.find(o => o.value === d.doelMaand + '/' + d.doelJaar);
      if (doelOptie) {
        maandSelect.value = doelOptie.value;
        maandSelect.dispatchEvent(new Event('change'));
        setTimeout(selecteerDag, 100);
      }
    } else {
      // Fallback: klik de navigatiepijl tot we in de juiste maand zitten (max 24 keer)
      let pogingen = 0;
      const interval = setInterval(() => {
        if (selecteerDag() || pogingen++ > 24) clearInterval(interval);
        else {
          const today = new Date();
          const isPast = (d.doelJaar < today.getFullYear()) ||
            (d.doelJaar === today.getFullYear() && d.doelMaand < today.getMonth() + 1);
          const knop = document.querySelector(isPast ? '.datepick-cmd-prev' : '.datepick-cmd-next');
          if (knop) knop.click();
        }
      }, 150);
    }
  }

  // 6. Bevestiging
  const msg = document.createElement('div');
  msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#2d6a4f;color:white;padding:12px 20px;border-radius:4px;font-family:monospace;z-index:99999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.2)';
  msg.innerHTML = '✓ Formulier ingevuld<br><small style="opacity:.8">Plak nog: Van + Naar</small>';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
})()`.trim()

  return `javascript:${encodeURIComponent(script)}`
}
