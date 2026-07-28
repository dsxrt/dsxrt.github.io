#!/usr/bin/env node
/**
 * 精选账号商城 · 极简风格独立站生成器
 * 灵感：teenage.engineering — 干净、留白、产品为王
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DIST_DIR = path.join(__dirname, 'dist');

function loadJSON(name) {
    const fp = path.join(DATA_DIR, name);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
}
function loadRootJSON(name) {
    const fp = path.join(__dirname, name);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fixImg(url, base) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return base + url;
    return url;
}

// ── SEO ──
const SEO = loadRootJSON('seo.json') || {};
const SEO_KEYWORDS = SEO.keywords || '';
const SEO_DESC = SEO.description || '';
const SITE_TITLE = SEO.title || '精选账号商城';
const SEO_TITLE_SUFFIX = SEO.titleSuffix || '';
const SEO_AUTHOR = SEO.author || SITE_TITLE;
const SEO_ROBOTS = SEO.robots || 'index, follow';
const SEO_CANONICAL = SEO.canonical || '';
const SEO_OG = SEO.og || {};
const SEO_TWITTER = SEO.twitter || {};
const SEO_JSON_LD = SEO.jsonLd || {};
const SEO_FAVICON = SEO.favicon || '';

// ── CSS ── teenage.engineering 风格：极简、留白、黑白为主
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --bg: #ffffff;
  --bg-alt: #f7f7f8;
  --bg-card: #ffffff;
  --text: #111111;
  --text-2: #555555;
  --text-3: #999999;
  --border: #e5e5e5;
  --border-light: #f0f0f0;
  --accent: #111111;
  --accent-hover: #333333;
  --radius: 12px;
  --radius-lg: 20px;
  --max-w: 1200px;
  --transition: cubic-bezier(0.16, 1, 0.3, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection { background: #111; color: #fff; }

a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; display: block; }
.container { max-width: var(--max-w); margin: 0 auto; padding: 0 40px; }

/* ── Header ── */
.header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
}
.header-inner {
  max-width: var(--max-w); margin: 0 auto; padding: 0 40px;
  height: 64px; display: flex; align-items: center; justify-content: space-between;
}
.logo {
  font-size: 1.1rem; font-weight: 700; letter-spacing: -0.03em;
  display: flex; align-items: center;
}
.logo-icon {
  height: 44px; width: auto; border-radius: 10px;
  overflow: visible; flex-shrink: 0;
  display: flex; align-items: center;
  margin-right: 10px;
}
.logo-icon img { height: 44px; width: auto; object-fit: contain; display: block; }
.logo-text-wrap { display: flex; flex-direction: column; }
.logo-title { white-space: nowrap; line-height: 1.2; }
.logo-addr {
  font-size: .62rem; font-weight: 400; color: var(--text-3);
  line-height: 1.5;
}
.logo-addr a { color: var(--text-3); }
.logo-addr a:hover { color: var(--text); }
.nav-links { display: flex; align-items: center; gap: 28px; }
.nav-links a {
  font-size: .82rem; font-weight: 500; color: var(--text-2);
  transition: color .2s; letter-spacing: -0.01em;
}
.nav-links a:hover { color: var(--text); }
.nav-cta {
  display: inline-flex; align-items: center;
  padding: 8px 20px; border-radius: 100px;
  background: var(--text); color: #fff;
  font-size: .8rem; font-weight: 600;
  transition: all .25s var(--transition);
  letter-spacing: -0.01em;
}
.nav-cta:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

/* ── Hero ── */
.hero {
  padding: 100px 40px 80px;
  max-width: var(--max-w); margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
  align-items: center; min-height: 520px;
}
.hero-text { max-width: 520px; }
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: .75rem; font-weight: 600; color: var(--text-3);
  text-transform: uppercase; letter-spacing: .12em;
  margin-bottom: 20px;
}
.hero-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
.hero h1 {
  font-size: clamp(2.4rem, 4.5vw, 3.6rem);
  font-weight: 800; letter-spacing: -0.04em; line-height: 1.08;
  margin-bottom: 24px; color: var(--text);
}
.hero h1 em {
  font-style: normal;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc {
  font-size: 1.05rem; color: var(--text-2);
  line-height: 1.7; margin-bottom: 36px; font-weight: 400;
}
.hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: 100px;
  background: var(--text); color: #fff;
  font-size: .9rem; font-weight: 600;
  transition: all .3s var(--transition);
  letter-spacing: -0.01em;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 14px 28px; border-radius: 100px;
  background: transparent; color: var(--text);
  font-size: .9rem; font-weight: 500;
  border: 1.5px solid var(--border);
  transition: all .3s var(--transition);
}
.btn-ghost:hover { border-color: var(--text); transform: translateY(-1px); }

.hero-visual {
  position: relative; display: flex; align-items: center; justify-content: center;
}
.hero-img-container {
  width: 100%; aspect-ratio: 4/3; border-radius: var(--radius-lg);
  overflow: hidden; background: var(--bg-alt);
  position: relative;
}
.hero-img-container img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .6s var(--transition);
}
.hero-img-container:hover img { transform: scale(1.03); }
.hero-float-badge {
  position: absolute; bottom: -16px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 16px;
  padding: 14px 28px; border-radius: 100px;
  background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
  white-space: nowrap; font-size: .82rem; font-weight: 500;
}
.hero-float-badge .num {
  font-size: 1.3rem; font-weight: 800; letter-spacing: -0.03em;
}
.hero-float-badge .divider { width: 1px; height: 24px; background: var(--border); }

/* ── Stats Bar ── */
.stats-bar {
  display: flex; justify-content: center; gap: 48px;
  padding: 40px; max-width: var(--max-w); margin: 0 auto;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}
.stat-item { text-align: center; }
.stat-num {
  font-size: 2rem; font-weight: 800; letter-spacing: -0.04em;
  color: var(--text);
}
.stat-label {
  font-size: .72rem; font-weight: 500; color: var(--text-3);
  text-transform: uppercase; letter-spacing: .1em; margin-top: 4px;
}

/* ── Filter ── */
.filter-section {
  padding: 48px 40px 0;
  max-width: var(--max-w); margin: 0 auto;
}
.section-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 32px;
}
.section-title {
  font-size: 1.8rem; font-weight: 800; letter-spacing: -0.03em;
}
.section-sub {
  font-size: .85rem; color: var(--text-3); font-weight: 400;
  margin-top: 6px;
}
.filter-bar { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-btn {
  padding: 8px 20px; border-radius: 100px; cursor: pointer;
  font-size: .8rem; font-weight: 500;
  transition: all .25s var(--transition);
  background: transparent; color: var(--text-2);
  border: 1.5px solid var(--border);
  user-select: none;
}
.filter-btn:hover { border-color: var(--text-2); color: var(--text); }
.filter-btn.active {
  background: var(--text); color: #fff; border-color: var(--text);
}

/* ── Products ── */
.products-section { padding: 32px 40px 80px; max-width: var(--max-w); margin: 0 auto; }
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.product-card {
  display: block; position: relative;
  border-radius: var(--radius-lg); overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  transition: all .4s var(--transition);
  cursor: pointer; text-decoration: none; color: inherit;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.08);
  border-color: transparent;
}

.card-img {
  position: relative; overflow: hidden;
  aspect-ratio: 4/3; background: var(--bg-alt);
}
.card-img img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .5s var(--transition);
}
.product-card:hover .card-img img { transform: scale(1.06); }
.card-badge {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  padding: 4px 12px; border-radius: 6px;
  font-size: .68rem; font-weight: 700;
  background: rgba(255,255,255,0.92); color: #111;
  backdrop-filter: blur(8px);
  letter-spacing: .02em;
}

.card-content { padding: 18px 20px 20px; }
.card-category {
  font-size: .68rem; font-weight: 600; color: var(--text-3);
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px;
}
.card-name {
  font-size: .9rem; font-weight: 600; line-height: 1.5;
  color: var(--text); margin-bottom: 14px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; min-height: 2.7em;
  letter-spacing: -0.01em;
}
.card-bottom {
  display: flex; align-items: center; justify-content: space-between;
}
.card-price {
  font-size: 1.1rem; font-weight: 700; letter-spacing: -0.02em;
}
.card-price .currency { font-size: .75rem; font-weight: 500; color: var(--text-3); }
.card-arrow {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-alt); color: var(--text-2);
  font-size: .85rem; transition: all .3s var(--transition);
}
.product-card:hover .card-arrow {
  background: var(--text); color: #fff;
  transform: translateX(3px);
}

/* ── Features ── */
.features-section {
  padding: 80px 40px;
  max-width: var(--max-w); margin: 0 auto;
  border-top: 1px solid var(--border-light);
}
.features-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
}
.feature-item {
  padding: 36px 28px;
  border-right: 1px solid var(--border-light);
  transition: background .3s;
}
.feature-item:last-child { border-right: none; }
.feature-item:hover { background: var(--bg-alt); }
.feature-num {
  font-size: .7rem; font-weight: 700; color: var(--text-3);
  letter-spacing: .1em; margin-bottom: 16px;
}
.feature-item h3 {
  font-size: 1rem; font-weight: 700; margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.feature-item p {
  font-size: .82rem; color: var(--text-2); line-height: 1.6;
  font-weight: 400;
}

/* ── CTA ── */
.cta-section {
  padding: 0 40px 100px;
  max-width: var(--max-w); margin: 0 auto;
}
.cta-card {
  position: relative; overflow: hidden;
  border-radius: var(--radius-lg);
  padding: 80px 60px;
  background: #111; color: #fff;
  text-align: center;
}
.cta-card h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800; letter-spacing: -0.03em;
  margin-bottom: 14px;
}
.cta-card p {
  color: rgba(255,255,255,0.6); font-size: .95rem;
  margin-bottom: 32px; max-width: 440px; margin-left: auto; margin-right: auto;
  line-height: 1.7;
}
.cta-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 36px; border-radius: 100px;
  background: #fff; color: #111;
  font-size: .9rem; font-weight: 600;
  transition: all .3s var(--transition);
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,255,255,0.2); }

/* ── Footer ── */
.footer {
  padding: 48px 40px 40px;
  max-width: var(--max-w); margin: 0 auto;
  border-top: 1px solid var(--border-light);
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 16px;
}
.footer-left {
  font-size: .78rem; color: var(--text-3); line-height: 1.7;
}
.footer-left a { color: var(--text-2); transition: color .2s; }
.footer-left a:hover { color: var(--text); }
.footer-right {
  display: flex; gap: 24px;
}
.footer-right a {
  font-size: .78rem; color: var(--text-3); font-weight: 500;
  transition: color .2s;
}
.footer-right a:hover { color: var(--text); }

/* ── Animations ── */
.fade-up {
  opacity: 0; transform: translateY(20px);
  transition: opacity .6s var(--transition), transform .6s var(--transition);
}
.fade-up.visible { opacity: 1; transform: translateY(0); }
.fade-up.d1 { transition-delay: .05s; }
.fade-up.d2 { transition-delay: .1s; }
.fade-up.d3 { transition-delay: .15s; }
.fade-up.d4 { transition-delay: .2s; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hero { grid-template-columns: 1fr; gap: 40px; padding: 60px 40px 60px; min-height: auto; }
  .hero-text { max-width: 100%; }
  .hero-visual { order: -1; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .feature-item:nth-child(2) { border-right: none; }
  .feature-item:nth-child(1), .feature-item:nth-child(2) { border-bottom: 1px solid var(--border-light); }
}
@media (max-width: 768px) {
  .container, .header-inner, .hero, .stats-bar, .filter-section,
  .products-section, .features-section, .cta-section, .footer { padding-left: 20px; padding-right: 20px; }
  .hero h1 { font-size: 2rem; }
  .hero-desc { font-size: .92rem; }
  .stats-bar { gap: 24px; flex-wrap: wrap; }
  .stat-num { font-size: 1.5rem; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .card-content { padding: 12px 14px 14px; }
  .card-name { font-size: .82rem; }
  .card-price { font-size: .95rem; }
  .features-grid { grid-template-columns: 1fr; }
  .feature-item { border-right: none; border-bottom: 1px solid var(--border-light); }
  .feature-item:last-child { border-bottom: none; }
  .cta-card { padding: 48px 28px; }
  .section-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .nav-links { display: none; }
  .footer { flex-direction: column; text-align: center; }
  .footer-right { justify-content: center; }
  .hero-float-badge { display: none; }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .card-img { aspect-ratio: 1/1; }
  .card-content { padding: 10px; }
  .card-name { font-size: .78rem; min-height: auto; -webkit-line-clamp: 2; }
  .card-badge { font-size: .6rem; padding: 3px 8px; }
  .card-arrow { width: 26px; height: 26px; font-size: .7rem; }
  .btn-primary, .btn-ghost { padding: 12px 24px; font-size: .82rem; }
}
`;

const JS = `
function filterCategory(id, el) {
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
  if (el) el.classList.add('active');
  document.querySelectorAll('.product-card').forEach(function(c, i) {
    if (id === 'all' || c.dataset.cat == id) {
      c.style.display = '';
      c.style.opacity = '0'; c.style.transform = 'translateY(16px)';
      setTimeout(function() { c.style.transition = 'all .4s cubic-bezier(0.16,1,0.3,1)'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 50);
    } else { c.style.display = 'none'; }
  });
}
document.addEventListener('DOMContentLoaded', function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-up').forEach(function(el) { observer.observe(el); });
});
`;

function main() {
    const config = loadJSON('config.json') || {};
    const categories = loadJSON('categories.json') || [];
    const products = loadJSON('products.json') || [];
    const meta = loadJSON('meta.json') || {};

    if (!products.length) { console.error('❌ 没有商品数据'); process.exit(1); }

    const siteUrl = meta.siteUrl || process.env.SITE_URL;
    const siteName = SITE_TITLE;
    const GITHUB_PAGES_URL = process.env.GITHUB_PAGES_URL || SEO_CANONICAL;

    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

    function shortCatName(name) {
        return name
            .replace(/谷歌美国电话\/?/i, '')
            .replace(/GoogleVoice\s*\/?\s*GV靓号/i, 'GV靓号')
            .replace(/谷歌邮箱\s*\/?\s*油管\s*\/?\s*Google\s*\/?\s*Gmail/i, '谷歌邮箱')
            .replace(/苹果id\s*\/?\s*Apple\s*id\s*\/?\s*AppStore/i, '苹果ID')
            .replace(/服务类/i, '服务')
            .trim() || name;
    }

    const activeCats = categories.filter(c => products.some(p => p.category_id === c.id));
    const catBtns = activeCats
        .sort((a, b) => (b.sort || 0) - (a.sort || 0))
        .map(c => `<div class="filter-btn" onclick="filterCategory(${c.id}, this)">${esc(shortCatName(c.name))}</div>`)
        .join('\n        ');

    const cards = products.filter(p => p.active !== 0).sort((a, b) => (b.sort||0) - (a.sort||0)).map((p) => {
        const cat = categories.find(c => c.id === p.category_id);
        const catName = cat ? shortCatName(cat.name) : '';
        const img = p.image_url ? fixImg(p.image_url, siteUrl) : '';
        const variants = p.variants || [];
        const minPrice = variants.length ? Math.min(...variants.map(v => v.price)) : 0;
        const tags = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);
        const cleanTag = t => t.replace(/b[12]#[0-9a-fA-F]{3,6}/g, '').replace(/#[0-9a-fA-F]{3,6}$/g, '').replace(/\s+/g, ' ').trim();
        const tagLabel = cleanTag(tags[0] || '');

        return `
        <a class="product-card fade-up" href="${siteUrl}/product?id=${p.id}" target="_blank" rel="noopener" data-cat="${p.category_id}">
            <div class="card-img">
                ${img ? `<img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy">` : ''}
                ${tagLabel ? `<div class="card-badge">${esc(tagLabel)}</div>` : ''}
            </div>
            <div class="card-content">
                <div class="card-category">${esc(catName)}</div>
                <div class="card-name">${esc(p.name)}</div>
                <div class="card-bottom">
                    <div class="card-price"><span class="currency">¥</span>${minPrice.toFixed(2)}</div>
                    <div class="card-arrow">→</div>
                </div>
            </div>
        </a>`;
    }).join('\n');

    const heroImg = products[0]?.image_url ? fixImg(products[0].image_url, siteUrl) : '';
    const ogImage = heroImg || (meta.siteLogo ? fixImg(meta.siteLogo, siteUrl) : '');

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "description": SEO_DESC,
        "url": GITHUB_PAGES_URL,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/product?id={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };
    const itemListLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": products.filter(p => p.active !== 0).map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
                "@type": "Product",
                "name": p.name,
                "url": `${siteUrl}/product?id=${p.id}`,
                "image": p.image_url ? fixImg(p.image_url, siteUrl) : '',
                "offers": {
                    "@type": "Offer",
                    "price": p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : 0,
                    "priceCurrency": "CNY"
                }
            }
        }))
    };

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(siteName)}${SEO_TITLE_SUFFIX ? ' – ' + esc(SEO_TITLE_SUFFIX) : ''}</title>
    <meta name="description" content="${esc(SEO_DESC)}">
    <meta name="keywords" content="${esc(SEO_KEYWORDS)}">
    <meta name="author" content="${esc(SEO_AUTHOR)}">
    <meta name="robots" content="${esc(SEO_ROBOTS)}">
    <meta name="googlebot" content="${esc(SEO_ROBOTS)}">
    ${SEO_CANONICAL ? `<link rel="canonical" href="${esc(SEO_CANONICAL)}">` : ''}
    <meta property="og:type" content="${esc(SEO_OG.type || 'website')}">
    <meta property="og:url" content="${esc(SEO_OG.url || GITHUB_PAGES_URL)}">
    <meta property="og:title" content="${esc(siteName)}">
    <meta property="og:description" content="${esc(SEO_DESC)}">
    ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
    <meta property="og:locale" content="${esc(SEO_OG.locale || 'zh_CN')}">
    <meta property="og:site_name" content="${esc(SEO_OG.siteName || siteName)}">
    <meta name="twitter:card" content="${esc(SEO_TWITTER.card || 'summary_large_image')}">
    <meta name="twitter:title" content="${esc(siteName)}">
    <meta name="twitter:description" content="${esc(SEO_DESC)}">
    ${ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}">` : ''}
    <script type="application/ld+json">${JSON.stringify({...SEO_JSON_LD, ...jsonLd})}<\/script>
    <script type="application/ld+json">${JSON.stringify(itemListLd)}<\/script>
    ${SEO_FAVICON ? `<link rel="icon" href="${esc(SEO_FAVICON)}">` : ''}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>${CSS}</style>
</head>
<body>

<header class="header">
    <div class="header-inner">
        <a href="${GITHUB_PAGES_URL || '#'}" class="logo">
            ${meta.siteLogo ? `<div class="logo-icon"><img src="${esc(fixImg(meta.siteLogo, siteUrl))}" alt="${esc(siteName)}"></div>` : ''}
            <div class="logo-text-wrap">
                <span class="logo-title">${esc(siteName)}</span>
                <span class="logo-addr">新商城地址：<a href="${siteUrl}" target="_blank" rel="noopener">${esc(siteUrl)}</a></span>
            </div>
        </a>
        <nav class="nav-links">
            <a href="#products">商品</a>
            <a href="#features">优势</a>
            <a href="${siteUrl}" target="_blank" rel="noopener" class="nav-cta">进入商城</a>
        </nav>
    </div>
</header>

<section class="hero">
    <div class="hero-text">
        <div class="hero-eyebrow fade-up"><div class="dot"></div>自动发货 · 质保无忧</div>
        <h1 class="fade-up d1">精选优质<br><em>数字账号资源</em></h1>
        <p class="hero-desc fade-up d2">Google Voice 靓号、Gmail 邮箱、Apple ID 等多品类覆盖，源头直供，一站购齐。</p>
        <div class="hero-actions fade-up d3">
            <a href="${siteUrl}" target="_blank" rel="noopener" class="btn-primary">浏览全部商品</a>
            <a href="#products" class="btn-ghost">了解更多 ↓</a>
        </div>
    </div>
    <div class="hero-visual fade-up d2">
        <div class="hero-img-container">
            ${heroImg ? `<img src="${esc(heroImg)}" alt="${esc(siteName)}">` : ''}
        </div>
        <div class="hero-float-badge">
            <span class="num">${products.filter(p=>p.active!==0).length}</span>
            <span>款商品</span>
            <div class="divider"></div>
            <span class="num">24h</span>
            <span>自动发货</span>
        </div>
    </div>
</section>

<div class="stats-bar">
    <div class="stat-item fade-up">
        <div class="stat-num">${activeCats.length}</div>
        <div class="stat-label">品类</div>
    </div>
    <div class="stat-item fade-up d1">
        <div class="stat-num">${products.filter(p=>p.active!==0).length}</div>
        <div class="stat-label">商品</div>
    </div>
    <div class="stat-item fade-up d2">
        <div class="stat-num">${products.reduce((s,p) => s + (p.variants?.length||0), 0)}</div>
        <div class="stat-label">规格</div>
    </div>
    <div class="stat-item fade-up d3">
        <div class="stat-num">24h</div>
        <div class="stat-label">自动发货</div>
    </div>
</div>

<div class="filter-section" id="products">
    <div class="section-header">
        <div>
            <div class="section-title">全部商品</div>
            <div class="section-sub">源头直供，品质保障</div>
        </div>
        <div class="filter-bar">
            <div class="filter-btn active" onclick="filterCategory('all', this)">全部</div>
            ${catBtns}
        </div>
    </div>
</div>

<section class="products-section">
    <div class="products-grid">
        ${cards}
    </div>
</section>

<section class="features-section" id="features">
    <div class="features-grid">
        <div class="feature-item fade-up">
            <div class="feature-num">01</div>
            <h3>即时发货</h3>
            <p>付款即发，全程自动化，无需等待人工处理。</p>
        </div>
        <div class="feature-item fade-up d1">
            <div class="feature-num">02</div>
            <h3>品质保障</h3>
            <p>质保期内首登异常免费更换，售后无忧。</p>
        </div>
        <div class="feature-item fade-up d2">
            <div class="feature-num">03</div>
            <h3>源头价格</h3>
            <p>一手资源直供，无中间商差价，性价比优先。</p>
        </div>
        <div class="feature-item fade-up d3">
            <div class="feature-num">04</div>
            <h3>可选靓号</h3>
            <p>支持自选号码与地区，精准匹配你的需求。</p>
        </div>
    </div>
</section>

<section class="cta-section">
    <div class="cta-card fade-up">
        <h2>找到你需要的了吗？</h2>
        <p>全站自动发货，品质保障，源头直供。如有疑问，欢迎随时联系。</p>
        <a href="${siteUrl}" target="_blank" rel="noopener" class="cta-btn">前往商城 →</a>
    </div>
</section>

<footer class="footer">
    <div class="footer-left">
        © ${new Date().getFullYear()} ${esc(siteName)} · 虚拟数字商品<br>
        <a href="${siteUrl}" target="_blank" rel="noopener">${esc(siteUrl)}</a>
    </div>
    <div class="footer-right">
        <a href="${siteUrl}" target="_blank" rel="noopener">商城</a>
        <a href="#products">商品</a>
        <a href="#features">优势</a>
    </div>
</footer>

<script>${JS}</script>
</body>
</html>`;

    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
    console.log(`✅ dist/index.html (${(Buffer.byteLength(html)/1024).toFixed(1)}KB)`);
    console.log(`   商品: ${products.filter(p=>p.active!==0).length} 个`);
    console.log(`   分类: ${activeCats.length} 个`);
    console.log(`   风格: 极简 · 干净 · 留白 · teenage.engineering 灵感`);
    console.log(`   链接: 全部指向 ${siteUrl}/product?id=xxx`);
}

main();
