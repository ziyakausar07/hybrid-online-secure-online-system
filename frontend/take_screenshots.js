const puppeteer = require('puppeteer');
const path = require('path');

const artifactsDir = 'C:\\Users\\Asus\\.gemini\\antigravity-ide\\brain\\9d78f53c-e9db-4ab4-81df-bae08e4791dd';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  try {
    // =============================================
    // BUG 1 (DEF-001): Voting Page - Submit Vote Button
    // =============================================
    console.log('Taking Bug 1 screenshot: /vote page...');
    const votePage = await browser.newPage();
    await votePage.setViewport({ width: 1280, height: 800 });
    
    // Go to homepage first
    await votePage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });
    await votePage.screenshot({ 
      path: path.join(artifactsDir, 'bug1_homepage.png'),
      fullPage: true 
    });
    console.log('Homepage screenshot saved');
    
    // Go to voting page
    await votePage.goto('http://localhost:3000/vote', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    await votePage.screenshot({ 
      path: path.join(artifactsDir, 'bug1_vote_page.png'),
      fullPage: true 
    });
    console.log('Bug 1 - /vote page screenshot saved');
    await votePage.close();

    // =============================================
    // BUG 4 (DEF-004): Live Results / Admin Portal - Memory Leak
    // =============================================
    console.log('Taking Bug 4 screenshot: /live-results page...');
    const resultsPage = await browser.newPage();
    await resultsPage.setViewport({ width: 1280, height: 800 });
    
    await resultsPage.goto('http://localhost:3000/live-results', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    await resultsPage.screenshot({ 
      path: path.join(artifactsDir, 'bug4_live_results_page.png'),
      fullPage: true 
    });
    console.log('Bug 4 - /live-results page screenshot saved');
    
    // Also capture results page
    await resultsPage.goto('http://localhost:3000/results', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    await resultsPage.screenshot({ 
      path: path.join(artifactsDir, 'bug4_results_page.png'),
      fullPage: true 
    });
    console.log('Bug 4 - /results page screenshot saved');
    await resultsPage.close();

    console.log('All screenshots taken successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
})();
