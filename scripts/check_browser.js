async (page) => {
  const base = new URL(page.url()).origin;
  const errors = [];
  const checks = [];
  page.on('pageerror', error => errors.push(error.message));
  const assert = (condition, message) => { if (!condition) throw new Error(message); };

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/publications/`);
  const visible = () => page.locator('[data-publication]:not([hidden])').count();
  assert(await visible() === 9, 'Expected nine publication entries');
  await page.getByRole('searchbox', { name: 'Search publications' }).fill('Ag alloying');
  assert(await visible() === 1, 'Keyword search did not isolate the alloying paper');
  await page.getByRole('combobox', { name: 'Publication year', exact: true }).selectOption('2025');
  await page.getByRole('combobox', { name: 'Research topic', exact: true }).selectOption('defects');
  assert(await visible() === 1, 'Combined search and filters failed');
  const searchUrl = page.url();
  await page.reload();
  assert(await visible() === 1 && page.url() === searchUrl, 'Query state did not survive reload');
  await page.getByRole('searchbox').fill('no-publication-matches-this-query');
  assert(await visible() === 0 && await page.locator('#no-results').isVisible(), 'Empty state failed');
  await page.locator('[data-reset-search]').click();
  assert(await visible() === 9, 'Reset failed');
  await page.getByRole('combobox', { name: 'Publication year', exact: true }).selectOption('2023');
  await page.getByRole('combobox', { name: 'Research topic', exact: true }).selectOption('lattice');
  assert(await visible() === 2, 'Year/topic combination failed');
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await page.locator('#thermal-fluctuations summary').click();
  assert(await page.locator('#thermal-fluctuations details').getAttribute('open') !== null, 'Summary did not expand');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
  await page.locator('#thermal-fluctuations [data-copy-target]').click();
  const citation = await page.evaluate(() => navigator.clipboard.readText());
  assert(citation.includes('10.1103/p9h2-l2gh') && citation.startsWith('@article{'), 'Clipboard citation mismatch');
  const bibliography = await (await page.request.get(`${base}/publications.bib`)).text();
  assert((bibliography.match(/@article\{/g) || []).length === 9, 'Bibliography download mismatch');
  checks.push('publication search, combined filters, URL persistence, empty state, reset, summary, clipboard, bibliography');

  await page.goto(`${base}/research/`);
  await page.locator('[data-image]').first().click();
  assert(await page.locator('#image-dialog').evaluate(el => el.open), 'Image dialog did not open');
  await page.locator('#image-dialog-content').evaluate(el => el.decode());
  await page.keyboard.press('Escape');
  assert(!await page.locator('#image-dialog').evaluate(el => el.open), 'Escape did not close image dialog');
  assert(await page.locator('[data-image]').first().evaluate(el => el === document.activeElement), 'Dialog focus was not restored');
  checks.push('image dialog, image decode, Escape, focus restoration');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`);
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  assert(await page.getByRole('navigation').isVisible(), 'Mobile menu did not open');
  await page.getByRole('navigation').getByRole('link', { name: 'About', exact: true }).click();
  assert(new URL(page.url()).pathname === '/about/', 'Mobile navigation failed');
  checks.push('mobile menu and navigation');

  const routes = ['/', '/research/', '/publications/', '/software/', '/about/', '/software/solarlab/', '/software/interfaceml/', '/software/nebmake-mol/', '/404.html'];
  const sizes = [[320, 720], [390, 844], [768, 1024], [1440, 900]];
  const pages = [];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    for (const route of routes) {
      const response = await page.goto(base + route);
      assert(response.status() === 200, `${route}: HTTP ${response.status()}`);
      const images = page.locator('main img:visible');
      for (let i = 0; i < await images.count(); i++) {
        await images.nth(i).scrollIntoViewIfNeeded();
        await images.nth(i).evaluate(el => el.decode());
      }
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        lang: document.documentElement.lang,
        h1: document.querySelectorAll('h1').length,
        cjk: /[\u3400-\u9fff]/.test(document.body.innerText),
        pdfs: document.querySelectorAll('a[href$=".pdf"]').length,
        brokenImages: Array.from(document.querySelectorAll('main img')).filter(img => img.getClientRects().length && (!img.complete || !img.naturalWidth)).length,
      }));
      assert(!state.overflow, `${route} overflows at ${width}px`);
      assert(state.lang === 'en' && state.h1 === 1 && !state.cjk && !state.pdfs && !state.brokenImages, `${route} failed content/image checks at ${width}px`);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      if ((width === 390 || width === 1440) && route.split('/').filter(Boolean).length <= 1) {
        const name = route === '/' ? 'home' : route.replaceAll('/', '').replace('.html', '');
        await page.screenshot({ path: `output/playwright/${name}-${width}.png`, fullPage: true });
      }
      pages.push(`${width}:${route}`);
    }
  }
  assert(errors.length === 0, `Browser errors: ${errors.join('; ')}`);

  const noJsContext = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(`${base}/publications/`);
  assert(await noJsPage.locator('[data-publication]:visible').count() === 9, 'Publication list requires JavaScript');
  assert(await noJsPage.getByRole('navigation').isVisible(), 'Navigation requires JavaScript');
  await noJsContext.close();
  checks.push('36 route/viewport combinations, images, English-only content, no PDF links, JavaScript-disabled reading');
  await page.goto(`${base}/`);
  return { passed: true, checks, responsivePages: pages.length, browserErrors: errors };
}
