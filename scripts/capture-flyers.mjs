import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function capture() {
  const browser = await puppeteer.launch({ headless: true });

  // Story flyer: 1080x1920
  const storyPage = await browser.newPage();
  await storyPage.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await storyPage.goto(`${BASE}/flyer/story`, { waitUntil: 'networkidle0', timeout: 30000 });
  await storyPage.screenshot({ path: 'public/flyer-story.png', type: 'png' });
  console.log('Captured flyer-story.png (1080x1920)');

  // Post flyer: 1080x1080
  const postPage = await browser.newPage();
  await postPage.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  await postPage.goto(`${BASE}/flyer/post`, { waitUntil: 'networkidle0', timeout: 30000 });
  await postPage.screenshot({ path: 'public/flyer-post.png', type: 'png' });
  console.log('Captured flyer-post.png (1080x1080)');

  await browser.close();
  console.log('Done! Flyers saved to public/');
}

capture().catch(err => { console.error(err); process.exit(1); });
