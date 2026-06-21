import { test } from '@playwright/test';
import { getAllXPaths } from '../utils/xpathExtractor';

test('Extract all XPaths from Example.com', async ({ browser }) => {
  const url = process.env.TEST_URL || 'https://demoqa.com/';
  await getAllXPaths(browser, url);
  console.log('XPaths extracted successfully');
});
