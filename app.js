'use strict';
(() => {
  const $=s=>document.querySelector(s), {escape:e,price}=VLK;
  let site, category='All', selected, receivedPreview=false;
  const preview=new URLSearchParams(location.search).has('preview');
  const tg=()=> 'https://t.me/'+site.telegram;
  const icons={'Movies':'◈','Wildlife':'✿','Sentosa':'☀'};
  function productCard(p) { return `<article class="product-card"><button class="product-image" data-ticket="${e(p.id)}" aria-label="View ${e(p.name)}"><img src="${e(p.image || 'assets/logo.svg')}" alt="Illustrative image for ${e(p.name)}" loading="lazy"><span class="card-badge">${e(p.badge||p.category)}</span><span class="image-arrow" aria-hidden="true">↗</span></button><div class="product-content"><div class="product-category">${e(icons[p.category]||'✦')} ${e(p.category)} <span>· ${e(p.location)}</span></div><h3>${e(p.name)}</h3><p>${e(p.subtitle)}</p><div class="product-bottom"><strong>${e(price(p))}</strong><button class="card-cta" data-ticket="${e(p.id)}" ${p.status!=='Enquire' ? 'disabled':''}>${e(p.status==='Enquire' ? 'Enquire ↗':p.status)}</button></div></div></article>`; }
  function renderProducts() {
    let products=site.products.filter(p=>p.visible).filter(p=> category==='All' || p.category===category);
    const query=$('#search').value.trim().toLowerCase();
    products=products.filter(p=>[p.name,p.subtitle,p.category,p.location].join(' ').toLowerCase().includes(query));
    if($('#sort').value==='name') products.sort((a,b)=>a.name.localeCompare(b.name));
    if($('#sort').value==='price') products.sort((a,b)=>(a.price==='' ? Infinity:a.price)-(b.price==='' ? Infinity:b.price));
    $('#product-grid').innerHTML=products.map(productCard).join('');
    $('#result-count').textContent=products.length+' experience'+(products.length===1?'':'s')+' to explore';
    $('#empty').hidden=products.length>0;
  }
  function render(data) {
    site=VLK.validate(data); document.title=site.brand+' · Singapore tickets';
    document.documentElement.style.setProperty('--accent',site.accent); document.documentElement.style.setProperty('--page',site.background); document.body.dataset.layout=site.layout;
    $('#brand').textContent=site.brand; document.querySelectorAll('.brand-name').forEach(n=>n.textContent=site.brand);
    $('#announcement').textContent=site.announcement; $('#announcement').hidden=!site.announcement;
    const lines=site.heroTitle.split('\n'); $('#hero-title').innerHTML=lines.map((l,i)=>i ? '<span>'+e(l)+'</span>':e(l)).join('<br>');
    $('#hero-text').textContent=site.heroText; $('#hero-image').src=site.heroImage||'assets/logo.svg'; $('#tagline').textContent=site.tagline; $('#notice').textContent=site.notice;
    document.querySelectorAll('.telegram-link').forEach(a=>a.href=tg()); document.querySelectorAll('.telegram-name').forEach(n=>n.textContent=site.telegram); document.querySelectorAll('.carousell-link').forEach(a=>a.href=site.carousell);
    const cats=['All',...new Set(site.products.filter(p=>p.visible).map(p=>p.category))]; if(!cats.includes(category)) category='All';
    $('#filters').innerHTML=cats.map(c=>`<button class="filter ${c===category?'active':''}" data-category="${e(c)}" aria-pressed="${c===category}">${e(c==='All'?'All experiences':c)} <span>${site.products.filter(p=>p.visible&&(c==='All'||p.category===c)).length}</span></button>`).join('');
    $('#featured').hidden=!site.showFeatured || !site.products.some(p=>p.featured&&p.visible); $('#how').hidden=!site.showHowTo; document.querySelector('nav a[href="#how"]').hidden=!site.showHowTo; $('#faq-section').hidden=!site.showFaq;
    $('#featured-list').innerHTML=site.products.filter(p=>p.featured&&p.visible).slice(0,3).map(p=>`<button class="featured-item" data-ticket="${e(p.id)}"><img src="${e(p.image||'assets/logo.svg')}" alt="" loading="lazy"><span><strong>${e(p.name)}</strong><small>${e(price(p))}</small></span><i aria-hidden="true">↗</i></button>`).join('');
    $('#faq-list').innerHTML=site.faqs.map(f=>`<details><summary>${e(f.question)}<span aria-hidden="true">+</span></summary><p>${e(f.answer)}</p></details>`).join(''); renderProducts();
  }
  async function load() { try { const r=await fetch('site.json',{cache:'no-store'}); if(!r.ok) throw Error(); const data=await r.json(); if(!receivedPreview)render(data); $('#load-error').hidden=true; } catch { $('#load-error').hidden=false; } }
  document.addEventListener('click',event=>{
    const filter=event.target.closest('[data-category]'); if(filter) {category=filter.dataset.category; render(site);}
    const button=event.target.closest('[data-ticket]'); if(button) openTicket(button.dataset.ticket);
  });
  function openTicket(id) { selected=site.products.find(p=>p.id===id); if(!selected) return;
    $('#dialog-product').innerHTML=`<div class="eyebrow">${e(selected.category)} · ${e(selected.location)}</div><h2>${e(selected.name)}</h2><strong class="dialog-price">${e(price(selected))}</strong><p>${e(selected.description)}</p><div class="ticket-terms"><strong>Before you book</strong><p>${e(selected.terms)}</p></div>`;
    $('#enquiry-form').hidden=selected.status!=='Enquire'; if(selected.status!=='Enquire') $('#dialog-product').insertAdjacentHTML('beforeend','<p class="pill">'+e(selected.status)+'</p>');
    const today=new Date(); const date=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-'); $('#visit-date').min=date; $('#visit-date').value=''; $('#enquiry-notes').value=''; $('#ticket-type').value='Adult'; $('#quantity').value='2';
    $('#enquiry-feedback').textContent='You’ll review and send your message in Telegram. This is an enquiry, not a confirmed booking.'; $('#enquiry-dialog').showModal(); }
  function enquiryMessage() { return `Hi Jason! I’d like to enquire about ${selected.name}.\nVisit date: ${$('#visit-date').value}\nTickets: ${$('#quantity').value}\nTicket type: ${$('#ticket-type').value}${$('#enquiry-notes').value.trim() ? '\nNotes: '+$('#enquiry-notes').value.trim():''}\nPlease confirm the latest price, availability and ticket terms. Thank you!`; }
  $('#enquiry-form').addEventListener('submit',event=>{event.preventDefault(); if(!$('#enquiry-form').reportValidity()) return; if(preview) {$('#enquiry-feedback').textContent='Preview: this enquiry would open Telegram for @'+site.telegram+'.';return;} const link=tg()+'?text='+encodeURIComponent(enquiryMessage()); window.open(link,'_blank','noopener,noreferrer'); $('#enquiry-feedback').textContent='Telegram opened. If your app doesn’t keep the draft, use Copy enquiry and paste it into your chat with @'+site.telegram+'.';});
  $('#copy-enquiry').addEventListener('click',async()=>{if(!$('#enquiry-form').reportValidity())return;try{await navigator.clipboard.writeText(enquiryMessage());$('#enquiry-feedback').textContent='Enquiry copied. Paste it into your chat with @'+site.telegram+'.';}catch{$('#enquiry-feedback').textContent='Clipboard unavailable. Select and copy this enquiry: '+enquiryMessage();}});
  $('#close-dialog').addEventListener('click',()=>$('#enquiry-dialog').close()); $('#enquiry-dialog').addEventListener('click',event=>{if(event.target===$('#enquiry-dialog')) {const r=$('#enquiry-dialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) $('#enquiry-dialog').close();}});
  $('#search').addEventListener('input',()=>site&&renderProducts()); $('#sort').addEventListener('change',()=>site&&renderProducts()); $('#reset-search').addEventListener('click',()=>{$('#search').value='';category='All';render(site);}); $('#retry-load').addEventListener('click',load); $('#year').textContent=new Date().getFullYear();
  if(preview) window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===window.parent&&event.data?.type==='vlk-preview') try{render(event.data.site);receivedPreview=true;}catch{}});
  load();
})();
