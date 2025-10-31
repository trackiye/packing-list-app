// asinValidator.js - Run with: node asinValidator.js
// NOTE: This file is a local utility and not part of the Next.js build.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require("https"); // FIX 1: Disabling fatal rule for require()

// Extract ASINs from your file
const ASINS_TO_TEST = [
  { name: "TESSAN Universal Adapter", asin: "B08X59N349", tier: "Budget" },
  { name: "EPICKA Adapter", asin: "B077B2G2M5", tier: "Mid" },
  { name: "Zendure Passport III", asin: "B0BL72D437", tier: "Premium" },
  { name: "Anker Soundcore Q30", asin: "B08H7R5P7Y", tier: "Budget" },
  { name: "Sony WH-CH720N", asin: "B0BP42Y17W", tier: "Mid" },
  { name: "Sennheiser Accentum", asin: "B0CHFJJNZ7", tier: "Premium" },
  { name: "Anker PowerCore 20K", asin: "B07S829B65", tier: "Budget" },
  { name: "Baseus 65W", asin: "B0B7J12X6D", tier: "Mid" },
  { name: "Anker Prime 200W", asin: "B0C2MB18F2", tier: "Premium" },
  { name: "Aerolite 40L", asin: "B07G4J4Q4D", tier: "Budget" },
  { name: "tomtoc Navigator T66", asin: "B097P4JVP7", tier: "Mid" },
  { name: "Peak Design 45L", asin: "B07G58C4S2", tier: "Premium" },
  { name: "Bagsmart Compression", asin: "B07GFL9Q8K", tier: "Budget" },
  { name: "Eagle Creek Compress", asin: "B08B5R3S7R", tier: "Mid" },
  { name: "Peak Design Cubes", asin: "B07L929R7N", tier: "Premium" },
  { name: "GL.iNet AR300M", asin: "B01KMQY2G8", tier: "Budget" },
  { name: "GL.iNet Mango", asin: "B07712LPVF", tier: "Mid" },
  { name: "GL.iNet Slate AX", asin: "B09PM6L63B", tier: "Premium" },
  { name: "Minus33 Kodiak", asin: "B076C55Q6Y", tier: "Budget" },
  { name: "Smartwool Merino", asin: "B07F2G3W5V", tier: "Mid" },
  { name: "Icebreaker Tech Lite", asin: "B092W3J3P8", tier: "Premium" },
  { name: "Venture 4th Pouch", asin: "B01B7H36Y2", tier: "Budget" },
  { name: "Zoppen Wallet", asin: "B07FDV1L6X", tier: "Mid" },
  { name: "Polare Leather", asin: "B07TT4FKB4", tier: "Premium" },
  { name: "Klymit Cush", asin: "B00J6118D6", tier: "Budget" },
  { name: "AirComfy Ease", asin: "B07R8B2Q1J", tier: "Mid" },
  { name: "MLVOC Memory Foam", asin: "B082K8ZNQ1", tier: "Premium" },
  { name: "Lermende Toiletry", asin: "B073R3966D", tier: "Budget" },
  { name: "WANDF Hanging", asin: "B08W32P6C4", tier: "Mid" },
  { name: "ELIZO Leather", asin: "B0BDGKJ1N3", tier: "Premium" },
  { name: "Osprey Farpoint", asin: "B09KQ262GM", tier: "Budget" },
  { name: "Tortuga 40L Lite", asin: "B0DZTH2D2S", tier: "Mid" },
  { name: "Peak Design Travel", asin: "B0DDL4YW86", tier: "Premium" },
  { name: "Gonex Compression", asin: "B0D73CVRLM", tier: "Budget" },
  { name: "Eagle Creek Pack-It", asin: "B00F9S85CS", tier: "Mid" },
  { name: "BAGSMART Compression", asin: "B0CL3YKGYG", tier: "Premium" },
];

// Colors for console output
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

function testASIN(asin, productName, tier) {
  return new Promise((resolve) => {
    const url = `https://www.amazon.com/dp/${asin}`;

    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        const status = res.statusCode;

        if (status === 200) {
          console.log(
            `${GREEN}✓ VALID${RESET} | ${tier.padEnd(
              8
            )} | ${asin} | ${productName}`
          );
          resolve({ asin, status: "valid", productName, tier });
        } else if (status === 301 || status === 302) {
          console.log(
            `${YELLOW}⚠ REDIRECT${RESET} | ${tier.padEnd(
              8
            )} | ${asin} | ${productName}`
          );
          resolve({ asin, status: "redirect", productName, tier });
        } else {
          console.log(
            `${RED}✗ BROKEN${RESET} | ${tier.padEnd(
              8
            )} | ${asin} | ${productName} (Status: ${status})`
          );
          resolve({ asin, status: "broken", productName, tier });
        }
      })
      .on("error", (err) => {
        // FIX 2: The variable 'err' is now used in the console log to clear the warning
        console.log(
          `${RED}✗ ERROR${RESET} | ${tier.padEnd(
            8
          )} | ${asin} | ${productName} (Details: ${err.message})`
        );
        resolve({ asin, status: "error", productName, tier });
      });
  });
}

async function validateAllASINs() {
  console.log("\n🔍 ASIN VALIDATION STARTING...\n");
  console.log("=".repeat(80));

  const results = [];

  // Test each ASIN with delay to avoid rate limiting
  for (const item of ASINS_TO_TEST) {
    const result = await testASIN(item.asin, item.name, item.tier);
    results.push(result);

    // Wait 500ms between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("=".repeat(80));

  // Summary
  const valid = results.filter((r) => r.status === "valid").length;
  const broken = results.filter(
    (r) => r.status === "broken" || r.status === "error"
  ).length;
  const redirects = results.filter((r) => r.status === "redirect").length;

  console.log(`\n📊 SUMMARY:`);
  console.log(`${GREEN}✓ Valid: ${valid}${RESET}`);
  console.log(`${YELLOW}⚠ Redirects: ${redirects}${RESET}`);
  console.log(`${RED}✗ Broken: ${broken}${RESET}`);
  console.log(`\nTotal Tested: ${results.length}\n`);

  // List broken ASINs
  if (broken > 0) {
    console.log(`${RED}🚨 BROKEN ASINs TO REPLACE:${RESET}`);
    results
      .filter((r) => r.status === "broken" || r.status === "error")
      .forEach((r) => {
        console.log(`   - ${r.asin} | ${r.tier} | ${r.productName}`);
      });
  }
}

// Run validation
validateAllASINs();
