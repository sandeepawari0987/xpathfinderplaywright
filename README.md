# XPath Creator 🔍

A Playwright-based tool to automatically extract XPaths, CSS selectors, and Playwright locators from web pages. Perfect for test automation and element identification.

## Features ✨

- 🎯 Extracts interactive elements (buttons, links, inputs, etc.)
- 📍 Generates **Relative XPaths** - practical XPath expressions
- 🎨 Creates **CSS Selectors** - modern element targeting
- ⚙️ Produces **Playwright Locators** - ready-to-use in tests
- 📊 Outputs to CSV - easy to import into spreadsheets
- 🔗 Multiple identification methods - ID, name, text, aria-label, placeholder

## Project Structure 📁

```
XpathCreator/
├── utils/
│   └── xpathExtractor.ts      # Main extraction logic
├── tests/
│   └── xpathExtractor.spec.ts # Playwright test file
├── package.json               # Project dependencies
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── xpaths.csv                # Generated output file
└── README.md                 # This file
```

## Installation 🚀

### Prerequisites
- Node.js 16+ installed
- npm installed

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Dependencies included:**
   - `@playwright/test` - Playwright testing framework
   - `@types/node` - Node.js type definitions
   - `typescript` - TypeScript compiler

## Usage 🎯

### Run Tests and Extract XPaths

**Option 1: Using npm script**
```bash
npm test
```

**Option 2: Using npx directly**
```bash
npx playwright test
```

**Option 3: Run specific test**
```bash
npx playwright test xpathExtractor.spec.ts
```

### Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run tests and extract XPaths |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:debug` | Debug mode with DevTools |
| `npm run test:report` | View HTML test report |
| `npm run extract` | Extract XPaths (same as test) |

## Output Format 📋

The script generates **xpaths.csv** with the following columns:

| Column | Description |
|--------|-------------|
| `Tag` | HTML element type (a, button, input, etc.) |
| `Text` | Element text content (first 50 chars) |
| `ID` | Element ID attribute |
| `Name` | Element name attribute |
| `Type` | Input type (text, password, checkbox, etc.) |
| `AriaLabel` | Accessibility label |
| `Placeholder` | Input placeholder text |
| `RelativeXPath` | Practical relative XPath |
| `CssSelector` | CSS selector |
| `PlaywrightLocator` | Ready-to-use Playwright locator |

## Example Output 📊

```csv
Tag,Text,ID,Name,Type,AriaLabel,Placeholder,RelativeXPath,CssSelector,PlaywrightLocator
a,Skip to content,,,,"","","//a[contains(text(), 'Skip to content')]","a.skip-link","page.getByText('Skip to content')"
button,Submit,submit-btn,,,"","","//button[@id='submit-btn']","#submit-btn","page.locator('#submit-btn')"
input,,search,,text,Search...,"Search...","//input[@placeholder='Search...']","input[type='text']","page.locator('[placeholder=\"Search...\"]')"
```

## Using Locators in Tests 🧪

### Example Playwright Test

```typescript
import { test, expect } from '@playwright/test';

test('Example using extracted locators', async ({ page }) => {
  await page.goto('https://example.com');

  // Using Playwright locator from CSV
  await page.getByText('Submit').click();

  // Using relative XPath
  await page.locator("//button[contains(text(), 'Submit')]").click();

  // Using CSS selector
  await page.locator("button.submit-btn").click();

  // Using ID
  await page.locator('#submit-btn').click();
});
```

## Locator Priority 🎯

The tool prioritizes locators in this order:

1. **ID** - `#element-id`
2. **Data-testid** - `[data-testid='value']`
3. **Name** - `[name='value']`
4. **Aria-label** - `//*[@aria-label='value']`
5. **Placeholder** - `[placeholder='value']`
6. **Text content** - `//button[contains(text(), 'value')]`
7. **Class names** - `button.class-name`
8. **Tag with index** - `//button[1]`

## Configuration ⚙️

### Target URL
Edit [xpathExtractor.spec.ts](tests/xpathExtractor.spec.ts):

```typescript
test('Extract all XPaths from Example.com', async ({ browser }) => {
  const url = process.env.TEST_URL || 'https://example.com'; // Change this
  await getAllXPaths(browser, url);
});
```

Or use environment variable:
```bash
TEST_URL=https://your-site.com npm test
```

### Browser Configuration
Edit [playwright.config.ts](playwright.config.ts) to:
- Change browser (chromium, firefox, webkit)
- Adjust viewport size
- Set base URL
- Configure retries

## Troubleshooting 🔧

### Issue: "playeright" not found
**Solution:** Check spelling - it's `playwright` not `playeright`
```bash
npx playwright test  # ✅ Correct
npx playeright test  # ❌ Wrong
```

### Issue: TypeScript errors
**Solution:** Ensure types are properly configured
```bash
npx tsc --noEmit  # Check for errors
npm install --save-dev typescript  # Reinstall if needed
```

### Issue: No interactive elements found
**Solution:** 
- Increase wait time in page loading
- Check if page uses JavaScript for rendering
- Verify URL is accessible

## Advanced Usage 🚀

### Extract from Multiple URLs
Create a custom test file:

```typescript
import { test } from '@playwright/test';
import { getAllXPaths } from '../utils/xpathExtractor';

const urls = [
  'https://example.com',
  'https://example.com/about',
  'https://example.com/contact'
];

for (const url of urls) {
  test(`Extract XPaths from ${url}`, async ({ browser }) => {
    await getAllXPaths(browser, url);
  });
}
```

### Filter Output
Process xpaths.csv to get only specific elements:

```bash
# Get only buttons
grep "^button," xpaths.csv

# Get only inputs
grep "^input," xpaths.csv

# Get elements with IDs only
awk -F',' '$3 != ""' xpaths.csv
```

## Performance Tips 💡

- Use more specific selectors (ID > name > aria-label > text)
- Combine locators for reliability: `page.locator('[data-testid="btn"]')`
- Add waits for dynamic content: `page.waitForSelector()`
- Use `page.getByRole()` for accessibility-first testing

## Contributing 🤝

Feel free to modify the extraction logic in [utils/xpathExtractor.ts](utils/xpathExtractor.ts) to:
- Add new attributes to extract
- Change priority order
- Filter different element types
- Export to different formats

## License 📄

ISC

## Support 💬

For issues or suggestions, check:
1. Spelling of commands (playwright, not playeright)
2. Node.js and npm versions
3. Browser installation (Playwright handles this)
4. Internet connection (needs to access target URL)

---

**Happy XPath extracting! 🎉**
