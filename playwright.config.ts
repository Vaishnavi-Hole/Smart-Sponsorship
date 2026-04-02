// import { createLovableConfig } from "lovable-agent-playwright-config/config";

// export default createLovableConfig({
//   // Add your custom playwright configuration overrides here
//   // Example:
//   // timeout: 60000,
//   // use: {
//   //   baseURL: 'http://localhost:3000',
//   // },
// });

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 30000,

  use: {
    headless: true,
    baseURL: 'http://localhost:3000', // change if needed
  },

  reporter: 'html',

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});