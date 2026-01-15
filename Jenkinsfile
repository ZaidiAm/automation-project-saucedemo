pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install') {
            steps {
                bat 'pip install -r requirements.txt'
                bat 'npm install'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Robot Tests') {
                    steps {
                        bat 'robot --outputdir reports robot_tests'
                    }
                }
                stage('Playwright Tests') {
                    steps {
                        bat 'npx playwright test'
                    }
                }
                stage('Selenium Tests') {
                    steps {
                        bat 'pytest selenium_tests --html=reports/selenium.html'
                    }
                }
            }
        }
        
        stage('Reports') {
            steps {
                publishHTML(target: [
                    reportDir: 'reports',
                    reportFiles: 'output.html',
                    reportName: 'Test Results'
                ])
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo '✅ Success!'
        }
        failure {
            echo '❌ Failed!'
        }
    }
}
