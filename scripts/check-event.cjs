// Dependency-free smoke checks for a native Washington Baths event page.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

try {
  const [file, payment] = process.argv.slice(2);
  assert(file && payment, 'Usage: node scripts/check-event.cjs events/<slug>.html <Square Payment Link>');
  assert(/^events\/[a-z0-9]+(?:-[a-z0-9]+)*\.html$/.test(file), 'Use an events/<slug>.html path');
  const square = new URL(payment);
  assert(square.protocol === 'https:' && square.hostname === 'square.link' &&
    /^\/u\/[A-Za-z0-9]+$/.test(square.pathname) && !square.username && !square.password &&
    !square.port && !square.search && !square.hash, 'Expected a direct https://square.link/u/... payment link');
  const root = path.resolve(__dirname, '..');
  const page = path.join(root, file);
  const html = fs.readFileSync(page, 'utf8');
  const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert(/<!doctype html>/i.test(html), 'Missing HTML5 doctype');
  assert(/<title>[^<]+<\/title>/i.test(html), 'Missing page title');
  assert(/name=["']viewport["']/i.test(html), 'Missing mobile viewport');
  assert(!/\{\{|PASTE_SQUARE|<<<<<<<|=======|>>>>>>>/.test(html + homepage), 'Unfilled template or conflict markers');
  assert(!/<script\b|\bon\w+\s*=|javascript:|tickets?\s+remaining|access[_-]?token|catalog[_-]?id/i.test(html),
    'Event page must have no scripts, inline handlers, inventory counter, or credential/catalog fields');
  const purchase = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>\s*PURCHASE TICKETS\s*<\/a>/gi)];
  assert(purchase.length === 1 && purchase[0][1] === payment, 'Purchase link does not exactly match the supplied Square URL');
  const refs = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)].map(m => m[1]);
  for (const ref of refs) {
    if (/^https:\/\//.test(ref)) continue;
    assert(!/^[a-z]+:|^\/\//i.test(ref), `Unexpected URL: ${ref}`);
    const local = ref.split(/[?#]/)[0];
    const target = local.startsWith('/') ? path.resolve(root, '.' + local) : path.resolve(path.dirname(page), local);
    assert(target === root || target.startsWith(root + path.sep), `Path leaves repository: ${ref}`);
    assert(fs.existsSync(target), `Missing linked file: ${ref}`);
  }
  const image = html.match(/<img\b[^>]*>/i)?.[0];
  assert(image && /alt=["'][^"']+["']/.test(image), 'Missing poster or alt text');
  assert(/src=["'][^"']+\.(?:jpg|jpeg|png|webp)["']/i.test(image), 'Use a browser-friendly poster format');
  assert(/max-width:\s*100%/.test(image) && /height:\s*auto/.test(image), 'Poster must scale without distortion');
  const heading = homepage.indexOf('Upcoming Dates, Closures &amp; Events') >= 0
    ? homepage.indexOf('Upcoming Dates, Closures &amp; Events')
    : homepage.indexOf('Upcoming Dates, Closures & Events');
  assert(heading >= 0, 'Missing upcoming events section');
  const sectionEnd = homepage.indexOf('View Past Events', heading);
  assert(sectionEnd > heading, 'Cannot locate end of upcoming events section');
  const section = homepage.slice(heading, sectionEnd);
  const links = [...section.matchAll(/href=["']([^"']+)["']/g)].filter(m => m[1] === '/' + file);
  assert(links.length === 1, 'Expected exactly one link in upcoming events');
  console.log(`PASS: ${file} — local links, poster markup, homepage listing, and exact Square URL`);
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}
