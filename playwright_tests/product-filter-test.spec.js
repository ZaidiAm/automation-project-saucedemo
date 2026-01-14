const { test, expect } = require('@playwright/test');
const testData = require('./test-data.json');

test.describe('Tests Playwright 1: filtrage des produits et vérification de l\'ordre', () => {
  let page;
  
  // Hook beforeAll pour la connexion
  test.beforeAll(async ({ browser }) => {
    // Créer une nouvelle page
    page = await browser.newPage();
    
    // Naviguer vers l'URL de base
    await page.goto(testData.urls.baseUrl);
    
    // Se connecter avec l'utilisateur standard
    await page.fill(testData.selectors.usernameInput, testData.users.standard.username);
    await page.fill(testData.selectors.passwordInput, testData.users.standard.password);
    await page.click(testData.selectors.loginButton);
    
    // Attendre la redirection vers la page d'inventaire
    await expect(page).toHaveURL(testData.urls.inventoryUrl);
  });

  test('Test du filtrage des produits par prix croissant et décroissant', async () => {
    // Étape 2: Vérifier que le filtre par défaut est "Name (A to Z)"
    const defaultFilter = await page.locator(testData.selectors.productFilter);
    await expect(defaultFilter).toHaveValue(testData.filterOptions.nameAtoZ);
    
    // Étape 3: Changer le filtre à "Price (low to high)"
    await defaultFilter.selectOption(testData.filterOptions.priceLowToHigh);
    
    // Étape 4: Vérifier que les produits sont bien triés par prix croissant
    const productPrices = await page.locator(testData.selectors.productPrices).allTextContents();
    const pricesAsNumbers = productPrices.map(price => parseFloat(price.replace('$', '')));
    
    // Vérifier que les prix sont en ordre croissant
    for (let i = 0; i < pricesAsNumbers.length - 1; i++) {
      expect(pricesAsNumbers[i]).toBeLessThanOrEqual(pricesAsNumbers[i + 1]);
    }
    
    // Étape 5: Capturer une screenshot après le tri
    await page.screenshot({ path: 'screenshots/price-low-to-high.png', fullPage: false });
    
    // Étape 6: Changer le filtre à "Price (high to low)"
    await defaultFilter.selectOption(testData.filterOptions.priceHighToLow);
    
    // Attendre un peu pour que le tri s'applique
    await page.waitForTimeout(1000);
    
    // Étape 7: Vérifier que le premier produit a le prix le plus élevé
    const productPricesHighLow = await page.locator(testData.selectors.productPrices).allTextContents();
    const pricesHighLow = productPricesHighLow.map(price => parseFloat(price.replace('$', '')));
    
    // Trier les prix dans l'ordre décroissant pour la vérification
    const sortedPricesDesc = [...pricesHighLow].sort((a, b) => b - a);
    
    // Vérifier que le premier prix est le plus élevé
    expect(pricesHighLow[0]).toBe(sortedPricesDesc[0]);
    
    // Étape 8: Vérifier que le dernier produit a le prix le plus bas
    const lastIndex = pricesHighLow.length - 1;
    const sortedPricesAsc = [...pricesHighLow].sort((a, b) => a - b);
    expect(pricesHighLow[lastIndex]).toBe(sortedPricesAsc[0]);
    
    // Capturer une screenshot finale
    await page.screenshot({ path: 'screenshots/price-high-to-low.png', fullPage: false });
  });

  // Nettoyage après les tests
  test.afterAll(async () => {
    await page.close();
  });
});
