import { Browser } from '@playwright/test';
import * as fs from 'fs';

export async function getAllXPaths(browser: Browser, url: string) {
  const page = await browser.newPage();
  await page.goto(url);

  const elements = await page.evaluate(() => {
    function getRelativeXPath(node: Element): string {
      // Priority 1: Use ID
      if (node.id) {
        return `//*[@id='${node.id}']`;
      }

      // Priority 2: Use name attribute (for form elements)
      if (node.getAttribute('name')) {
        return `//${node.tagName.toLowerCase()}[@name='${node.getAttribute('name')}']`;
      }

      // Priority 3: Use aria-label
      if (node.getAttribute('aria-label')) {
        return `//${node.tagName.toLowerCase()}[@aria-label='${node.getAttribute('aria-label')}']`;
      }

      // Priority 4: Use placeholder (for inputs)
      if (node.getAttribute('placeholder')) {
        return `//input[@placeholder='${node.getAttribute('placeholder')}']`;
      }

      // Priority 5: Use text content
      const text = node.textContent?.trim();
      if (text && text.length > 0 && text.length < 100) {
        return `//${node.tagName.toLowerCase()}[contains(text(), '${text.slice(0, 50)}')]`;
      }

      // Priority 6: Use class
      const classes = node.className;
      if (classes && typeof classes === 'string' && classes.trim()) {
        const classList = classes.split(' ').filter(c => c);
        if (classList.length > 0) {
          return `//${node.tagName.toLowerCase()}[@class='${classes}']`;
        }
      }

      // Fallback: tag with index
      const siblings = Array.from(node.parentNode?.childNodes || []).filter(
        n => (n as Element).tagName === node.tagName
      );
      const index = siblings.indexOf(node) + 1;
      return `//${node.tagName.toLowerCase()}[${index}]`;
    }

    function getCssSelector(node: Element): string {
      // Priority 1: ID
      if (node.id) {
        return `#${node.id}`;
      }

      // Priority 2: Unique class combination
      if (node.className) {
        const classStr = typeof node.className === 'string' ? node.className : (node.className as any).baseVal || '';
        const classes = classStr
          .split(' ')
          .filter((c: string) => c)
          .join('.');
        if (classes) {
          return `${node.tagName.toLowerCase()}.${classes}`;
        }
      }

      // Priority 3: Attribute selector
      if (node.getAttribute('data-testid')) {
        return `[data-testid='${node.getAttribute('data-testid')}']`;
      }

      if (node.getAttribute('name')) {
        return `${node.tagName.toLowerCase()}[name='${node.getAttribute('name')}']`;
      }

      return '';
    }

    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [onclick], [role="button"], label, [role="link"]'
    );

    return Array.from(interactiveElements).map(el => {
      const relXPath = getRelativeXPath(el as Element);
      const cssSelector = getCssSelector(el as Element);
      const text = (el.textContent || '').trim().slice(0, 50);
      const ariaLabel = el.getAttribute('aria-label') || '';
      const placeholder = el.getAttribute('placeholder') || '';
      const tag = el.tagName.toLowerCase();
      const id = el.id || '';
      const name = el.getAttribute('name') || '';
      const type = el.getAttribute('type') || '';

      return {
        tag,
        text,
        id,
        name,
        type,
        ariaLabel,
        placeholder,
        relativeXPath: relXPath,
        cssSelector: cssSelector,
        playwrightLocator: id
          ? `page.locator('#${id}')`
          : text
          ? `page.getByText('${text}')`
          : ariaLabel
          ? `page.getByLabel('${ariaLabel}')`
          : placeholder
          ? `page.locator('[placeholder="${placeholder}"]')`
          : `page.locator('${cssSelector || relXPath}')`
      };
    });
  });

  const header = 'Tag,Text,ID,Name,Type,AriaLabel,Placeholder,RelativeXPath,CssSelector,PlaywrightLocator\n';
  const rows = elements
    .map(el =>
      [
        el.tag,
        `"${el.text.replace(/"/g, '""')}"`,
        el.id,
        el.name,
        el.type,
        `"${el.ariaLabel.replace(/"/g, '""')}"`,
        `"${el.placeholder.replace(/"/g, '""')}"`,
        `"${el.relativeXPath.replace(/"/g, '""')}"`,
        `"${el.cssSelector.replace(/"/g, '""')}"`,
        `"${el.playwrightLocator.replace(/"/g, '""')}"`
      ].join(',')
    )
    .join('\n');

  fs.writeFileSync('xpaths.csv', header + rows);

  console.log(`✅ Extracted ${elements.length} interactive elements and saved to xpaths.csv`);
  console.log('📋 Columns: Tag, Text, ID, Name, Type, AriaLabel, Placeholder, RelativeXPath, CssSelector, PlaywrightLocator');

  await page.close();
}


