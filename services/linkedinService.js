const puppeteer = require('puppeteer');

class LinkedInService {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async initialize() {
        try {
            this.browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            });
            this.page = await this.browser.newPage();
            
            // Set user agent to avoid detection
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            console.log('LinkedIn service initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize LinkedIn service:', error);
            return false;
        }
    }

    async getFollowerCount(linkedinUrl) {
        try {
            if (!this.browser || !this.page) {
                const initialized = await this.initialize();
                if (!initialized) {
                    throw new Error('Failed to initialize browser');
                }
            }

            console.log('Fetching LinkedIn data for:', linkedinUrl);
            
            // Navigate to LinkedIn profile
            await this.page.goto(linkedinUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            // Wait for page to load
            await this.page.waitForTimeout(3000);

            // Try multiple selectors for follower count
            let followerCount = null;
            const selectors = [
                'span[class*="text-body-small"]',
                '.pv-recent-activity-section__follower-count',
                '.pv-oc__member-list-container span',
                '[data-test-id="followers-count"]',
                'span:contains("followers")',
                '.artdeco-entity-lockup__subtitle span'
            ];

            for (const selector of selectors) {
                try {
                    const elements = await this.page.$$(selector);
                    for (const element of elements) {
                        const text = await this.page.evaluate(el => el.textContent, element);
                        if (text && text.toLowerCase().includes('follower')) {
                            // Extract number from text like "1,234 followers"
                            const match = text.match(/(\d{1,3}(?:,\d{3})*)/);
                            if (match) {
                                followerCount = parseInt(match[1].replace(/,/g, ''));
                                console.log('Found follower count:', followerCount);
                                break;
                            }
                        }
                    }
                    if (followerCount) break;
                } catch (err) {
                    // Continue to next selector
                    continue;
                }
            }

            // If no follower count found, try getting the page content for debugging
            if (!followerCount) {
                const pageContent = await this.page.content();
                console.log('Page title:', await this.page.title());
                
                // Look for any numbers that might be follower count
                const numberMatches = pageContent.match(/(\d{1,3}(?:,\d{3})*)\s*followers?/gi);
                if (numberMatches && numberMatches.length > 0) {
                    const match = numberMatches[0].match(/(\d{1,3}(?:,\d{3})*)/);
                    if (match) {
                        followerCount = parseInt(match[1].replace(/,/g, ''));
                    }
                }
            }

            return followerCount;

        } catch (error) {
            console.error('Error fetching LinkedIn follower count:', error);
            return null;
        }
    }

    async close() {
        try {
            if (this.browser) {
                await this.browser.close();
                this.browser = null;
                this.page = null;
                console.log('LinkedIn service closed');
            }
        } catch (error) {
            console.error('Error closing LinkedIn service:', error);
        }
    }

    // Alternative method using public LinkedIn API (if available)
    async getPublicProfileData(linkedinUrl) {
        try {
            // Extract username from URL
            const match = linkedinUrl.match(/linkedin\.com\/in\/([^\/]+)/);
            if (!match) {
                throw new Error('Invalid LinkedIn URL');
            }

            const username = match[1];
            console.log('LinkedIn username:', username);

            // For now, return a simulated count since public API access is limited
            // In production, you might use LinkedIn's official API with proper authentication
            return {
                username,
                simulatedCount: Math.floor(1200 + Math.random() * 100), // Simulated growth
                lastUpdated: new Date()
            };

        } catch (error) {
            console.error('Error getting public profile data:', error);
            return null;
        }
    }
}

module.exports = LinkedInService;
