import { chromium } from 'playwright';

const screens = [
  { name: 'home', actions: [] },
  { name: 'stan-czerwony', actions: [{ click: 'text=Stan Czerwony' }] },
  { name: 'niszczarka', actions: [{ click: 'text=Wróć' }, { click: 'text=Niszczarka Myśli' }] },
  { name: 'sloik', actions: [{ click: 'text=Wróć' }, { click: 'text=Słoik Sukcesów' }] },
  { name: 'stan-zolty', actions: [{ click: 'text=Wróć' }, { click: 'text=Stan Żółty' }] },
  { name: 'stan-zielony', actions: [{ click: 'text=Wróć' }, { click: 'text=Stan Zielony' }] },
  { name: 'zdejmij-zbroje', actions: [{ click: 'text=Wróć' }, { click: 'text=Zdejmij Zbroję' }] },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:5173');
await page.waitForTimeout(1500);

for (const screen of screens) {
  for (const action of screen.actions) {
    if (action.click) {
      await page.click(action.click);
      await page.waitForTimeout(600);
    }
  }
  await page.screenshot({ path: `/tmp/${screen.name}.png`, fullPage: true });
  console.log(`Screenshot: ${screen.name}`);
}

await browser.close();
