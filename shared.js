'use strict';
(() => {
  const text = (v, max = 1000) => typeof v === 'string' ? v.slice(0, max) : '';
  const image = v => { if (typeof v !== 'string') return ''; if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v) && v.length < 220000) return v; if (/^assets\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|svg)$/.test(v)) return v; try { const u = new URL(v); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; } };
  function validate(input) {
    if (!input || input.version !== 1 || !Array.isArray(input.products) || input.products.length > 100 || !Array.isArray(input.faqs) || input.faqs.length > 30) throw Error('Invalid catalogue. Use a version 1 site.json with up to 100 tickets and 30 FAQs.');
    const products = input.products.map((p, i) => {
      if (!p || !text(p.name, 100).trim()) throw Error('Every ticket needs a name.');
      if (p.price !== '' && (typeof p.price !== 'number' || !Number.isFinite(p.price) || p.price < 0 || p.price > 10000)) throw Error('Ticket prices must be blank or a number from 0 to 10,000.');
      return { id: /^[a-zA-Z0-9_-]{1,60}$/.test(p.id) ? p.id : 'ticket-' + i, name:text(p.name,100), subtitle:text(p.subtitle,120), category:text(p.category,60) || 'Experiences', location:text(p.location,100), description:text(p.description,1200), image:image(p.image), price:p.price, badge:text(p.badge,60), featured:p.featured === true, visible:p.visible !== false, status:['Enquire','Sold out','Coming soon'].includes(p.status) ? p.status : 'Enquire', terms:text(p.terms,1600) };
    });
    if (new Set(products.map(p=>p.id)).size !== products.length) throw Error('Ticket IDs must be unique.');
    let carousell; try { const u = new URL(input.carousell); if (u.protocol !== 'https:' || !['www.carousell.sg','carousell.sg'].includes(u.hostname) || u.username || u.password) throw Error(); carousell=u.href; } catch { throw Error('Use a valid https://www.carousell.sg/ profile URL.'); }
    if (!/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(input.telegram)) throw Error('Enter a valid Telegram username without @.');
    return {version:1, brand:text(input.brand,80) || 'Voucher Lobang King', tagline:text(input.tagline,160), announcement:text(input.announcement,220), heroTitle:text(input.heroTitle,160), heroText:text(input.heroText,600), heroImage:image(input.heroImage), telegram:input.telegram, carousell, accent:/^#[0-9a-f]{6}$/i.test(input.accent) ? input.accent:'#175cff', background:/^#[0-9a-f]{6}$/i.test(input.background) ? input.background:'#f7f8fa', layout:input.layout === 'compact' ? 'compact':'comfortable', showFeatured:input.showFeatured !== false, showHowTo:input.showHowTo !== false, showFaq:input.showFaq !== false, notice:text(input.notice,1200), products, faqs:input.faqs.map(f=>({question:text(f?.question,200),answer:text(f?.answer,1600)})).filter(f=>f.question)};
  }
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const price = p => p.price === '' ? 'Enquire for price' : 'From S$' + p.price.toFixed(2).replace(/\.00$/, '');
  const encode = value => { const bytes=new TextEncoder().encode(value); let bin=''; for(const b of bytes) bin+=String.fromCharCode(b); return btoa(bin); };
  const decode = value => new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g,'')), c=>c.charCodeAt(0)));
  window.VLK={validate,escape,price,encode,decode};
})();
