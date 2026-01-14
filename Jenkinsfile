pipeline {
    agent any

    stages {
        // Étape 1: Checkout du code source
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/ZaidiAm/automation-project-saucedemo.git'
            }
        }

        // Étape 2: Installation des dépendances
        stage('Install Dependencies') {
            steps {
                script {
                    // Installation des dépendances Python
                    sh 'pip install -r requirements.txt'
                    
                    // Installation des dépendances Node.js (si package.json existe)
                    sh 'npm install'
                    
                    // Installation de Playwright (si nécessaire)
                    sh 'npx playwright install'
                }
            }
        }

        // Étape 3: Tests Robot Framework
        stage('Robot Framework Tests') {
            steps {
                script {
                    // Créer le dossier de rapports si inexistant
                    sh 'mkdir -p reports/robot'
                    
                    // Exécuter les tests Robot Framework
                    sh '''
                    robot --outputdir reports/robot \
                          --log robot_log.html \
                          --report robot_report.html \
                          robot_tests/
                    '''
                }
            }
            post {
                always {
                    // Publier les rapports Robot Framework
                    publishHTML(target: [
                        reportDir: 'reports/robot',
                        reportFiles: 'robot_report.html',
                        reportName: 'Robot Framework Report'
                    ])
                }
            }
        }

        // Étape 4: Tests Playwright
        stage('Playwright Tests') {
            steps {
                script {
                    // Exécuter les tests Playwright
                    sh 'npx playwright test --reporter=html'
                }
            }
            post {
                always {
                    // Publier les rapports Playwright
                    publishHTML(target: [
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                }
            }
        }

        // Étape 5: Tests Selenium Python
        stage('Selenium Tests') {
            steps {
                script {
                    // Créer le dossier de rapports
                    sh 'mkdir -p reports/selenium'
                    
                    // Exécuter les tests Selenium avec pytest
                    sh 'pytest selenium_tests/ -v --html=reports/selenium/report.html --self-contained-html'
                }
            }
            post {
                always {
                    // Publier les rapports Selenium
                    publishHTML(target: [
                        reportDir: 'reports/selenium',
                        reportFiles: 'report.html',
                        reportName: 'Selenium Report'
                    ])
                }
            }
        }

        // Étape 6: Archivage des résultats
        stage('Archive Results') {
            steps {
                // Archivage des rapports pour consultation future
                archiveArtifacts artifacts: 'reports/**/*, playwright-report/**/*, screenshots/**/*'
            }
        }
    }

    // Configuration post-build
    post {
        always {
            // Nettoyage (optionnel)
            echo 'Pipeline terminé. Nettoyage...'
            
            // Afficher les informations du workspace
            sh 'echo "Workspace: ${WORKSPACE}"'
            sh 'ls -la'
        }
        
        success {
            echo '✅ Tous les tests ont réussi!'
            // Option: Notification de succès (Slack, Email, etc.)
            // slackSend(color: 'good', message: "Pipeline réussi: ${env.JOB_NAME} - ${env.BUILD_NUMBER}")
        }
        
        failure {
            echo '❌ Le pipeline a échoué. Vérifiez les logs.'
            // Option: Notification d'échec
            // slackSend(color: 'danger', message: "Pipeline échoué: ${env.JOB_NAME} - ${env.BUILD_NUMBER}")
            
            // Capturer les logs d'erreur
            sh '''
            echo "=== DERNIÈRES ERREURS ==="
            find . -name "*.log" -type f | head -5 | xargs tail -20 2>/dev/null || true
            '''
        }
        
        unstable {
            echo '⚠️ Pipeline instable (certains tests ont échoué)'
        }
    }

    // Options de configuration du pipeline
    options {
        timeout(time: 30, unit: 'MINUTES')  // Timeout global
        buildDiscarder(logRotator(numToKeepStr: '10'))  // Garder les 10 derniers builds
        disableConcurrentBuilds()  // Éviter les builds concurrents
    }

    // Variables d'environnement
    environment {
        // Définir des variables d'environnement si nécessaire
        PYTHONPATH = "${WORKSPACE}"
        NODE_ENV = 'test'
    }
}
