// NOVA AUDIOVISUAL · botón "Instalar app" (compartido por el portal y el sitio de la productora)
// Android / Chrome / Edge de escritorio: usa el aviso nativo de instalación (beforeinstallprompt).
// iPhone / iPad (Safari no tiene ese aviso): muestra cómo hacerlo con Compartir → "Agregar a inicio".
// Si la app ya está abierta como instalada, no aparece nada.
(() => {
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (standalone) return;
  const ua = navigator.userAgent;
  const iOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let aviso = null;

  const css = `
  .nova-install{display:none; align-items:center; gap:7px; flex:none; cursor:pointer; font:700 13px/1 Inter,system-ui,sans-serif;
    color:#fff; background:linear-gradient(135deg,#b45fd8,#8f3cb4); border:2px solid #141112; border-radius:999px;
    padding:8px 13px; box-shadow:0 3px 0 #141112; transition:transform .12s, box-shadow .12s; white-space:nowrap}
  .nova-install.on{display:inline-flex}
  .nova-install:hover{transform:translateY(-1px); box-shadow:0 4px 0 #141112}
  .nova-install:active{transform:translateY(2px); box-shadow:0 1px 0 #141112}
  .nova-install svg{width:16px; height:16px}
  @media (max-width:720px){ .nova-install{margin-left:auto} }
  @media (max-width:420px){ .nova-install .t-largo{display:none} }
  .nova-sheet{position:fixed; inset:0; z-index:100; display:flex; align-items:flex-end; justify-content:center; background:rgba(10,8,9,.6); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px)}
  .nova-sheet .in{width:min(440px,100%); margin:16px; padding:22px 20px 18px; border-radius:20px; background:#3a3437; color:#fbf3e4;
    border:2px solid #141112; box-shadow:0 6px 0 #141112; font:15px/1.5 Inter,system-ui,sans-serif}
  .nova-sheet h3{margin:0 0 6px; font:900 19px Montserrat,Inter,sans-serif}
  .nova-sheet p{margin:0 0 12px; color:#d3c8b8}
  .nova-sheet ol{margin:0 0 16px; padding-left:20px} .nova-sheet li{margin:6px 0}
  .nova-sheet b{color:#e0b858}
  .nova-sheet button{width:100%; padding:12px; border-radius:12px; border:2px solid #141112; background:linear-gradient(180deg,#f0cc70,#e0b858);
    color:#141112; font:700 15px Inter,sans-serif; box-shadow:0 3px 0 #141112; cursor:pointer}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'nova-install';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg><span>Instalar<span class="t-largo"> app</span></span>';

  // va al final de la barra superior, después del menú
  function colocar(){ const bar = document.querySelector('.topbar .wrap'); if (bar) bar.appendChild(btn); }

  function hojaIOS(){
    const s = document.createElement('div'); s.className = 'nova-sheet';
    s.innerHTML = `<div class="in" role="dialog" aria-modal="true" aria-label="Instalar en iPhone">
      <h3>Instalar en tu iPhone</h3>
      <p>Queda como app en tu pantalla de inicio, a pantalla completa.</p>
      <ol><li>Toca <b>Compartir</b> <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#e0b858" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px"><path d="M12 3v13"/><path d="m7 8 5-5 5 5"/><path d="M5 12v8h14v-8"/></svg> en la barra de Safari.</li>
      <li>Elige <b>Agregar a inicio</b> (desliza hacia abajo si no lo ves).</li>
      <li>Toca <b>Agregar</b>.</li></ol>
      <button type="button">Entendido</button></div>`;
    s.addEventListener('click', e => { if (e.target === s || e.target.tagName === 'BUTTON') s.remove(); });
    document.body.appendChild(s);
  }

  addEventListener('beforeinstallprompt', e => { e.preventDefault(); aviso = e; btn.classList.add('on'); });
  addEventListener('appinstalled', () => { aviso = null; btn.classList.remove('on'); });
  btn.addEventListener('click', async () => {
    if (aviso) { aviso.prompt(); const r = await aviso.userChoice.catch(() => null); if (r && r.outcome === 'accepted') btn.classList.remove('on'); aviso = null; }
    else if (iOS) hojaIOS();
  });

  const listo = () => { colocar(); if (iOS) btn.classList.add('on'); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', listo) : listo();
})();
