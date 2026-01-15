import { test, expect } from '@playwright/test';
import config from './test-config.js';
import { 
    connect, 
    sortProducts, 
    verifyAscendingPrices, 
    verifyDescendingPrices,
    takeScreenshot 
} from './page-functions.js';

// Variable partagée pour la page
let sharedPage;

test.describe('Tests de tri des produits', () => {
    
    // Connexion unique avant tous les tests
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        sharedPage = await context.newPage();
        await connect(sharedPage);
    });
    
    // Avant chaque test, vérifier le filtre par défaut
    test.beforeEach(async () => {
        await sharedPage.goto(config.login.url + config.pages.inventory);
        const currentSort = await sharedPage.locator('.product_sort_container').inputValue();
        expect(currentSort).toBe(config.sort.az);
    });
    
    test('Tri par prix croissant', async () => {
        // Trier du moins cher au plus cher
        await sortProducts(sharedPage, config.sort.lohi);
        
        // Vérifier le tri
        const isSorted = await verifyAscendingPrices(sharedPage);
        expect(isSorted).toBeTruthy();
        
        // Prendre une capture
        await takeScreenshot(sharedPage, 'price_high_to_low');
    });
    
    test('Tri par prix décroissant', async () => {
        // Trier du plus cher au moins cher
        await sortProducts(sharedPage, config.sort.hilo);
        
        // Vérifier le premier et dernier prix
        const isCorrect = await verifyDescendingPrices(sharedPage);
        expect(isCorrect).toBeTruthy();
        
        // Prendre une capture
        await takeScreenshot(sharedPage, 'price_low_to_high');
    });
    
    // Nettoyage après les tests
    test.afterAll(async () => {
        await sharedPage.close();
    });
});
