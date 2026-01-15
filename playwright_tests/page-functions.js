import config from './test-config.js';

// Fonction de connexion
export async function connect(page) {
    await page.goto(config.login.url);
    await page.fill('#user-name', config.login.user);
    await page.fill('#password', config.login.pass);
    await page.click('#login-button');
    await page.waitForURL('**' + config.pages.inventory);
    console.log('Connecté avec succès');
}

// Fonction pour trier
export async function sortProducts(page, option) {
    await page.selectOption('.product_sort_container', option);
    await page.waitForTimeout(300); // Attente pour le tri
}

// Fonction pour vérifier le tri croissant
export async function verifyAscendingPrices(page) {
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    
    for (let i = 0; i < numericPrices.length - 1; i++) {
        if (numericPrices[i] > numericPrices[i + 1]) {
            return false;
        }
    }
    return true;
}

// Fonction pour vérifier le tri décroissant
export async function verifyDescendingPrices(page) {
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    
    return numericPrices[0] === Math.max(...numericPrices) &&
           numericPrices[numericPrices.length - 1] === Math.min(...numericPrices);
}

// Fonction de capture d'écran
export async function takeScreenshot(page, name) {
    await page.screenshot({ 
        path: config.paths.screenshots + name + '.png',
        fullPage: false 
    });
}
