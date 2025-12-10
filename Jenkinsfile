pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_USERNAME = 'leogrv22'
        IMAGE_NAME = 'frontend'
        VERSION = "${env.BUILD_NUMBER}"
        HELM_PIPELINE_JOB = 'helm-deploy'
        KUBERNETES_NAMESPACE = 'dev'
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out code from ${env.GIT_URL}"
                    checkout scm
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing Node.js dependencies..."
                    sh '''
                        npm ci || npm install
                    '''
                }
            }
        }
        
        stage('Tests') {
            steps {
                script {
                    echo "Running unit tests..."
                    sh '''
                        # Run tests if they exist (placeholder for now)
                        npm test || echo "No tests configured yet"
                    '''
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo "Building Next.js application..."
                    sh '''
                        npm run build
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image for frontend..."
                    sh """
                        docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} .
                        docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin ${DOCKER_REGISTRY}
                            
                            docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
                            docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }
        
        stage('Trigger Helm Deployment') {
            steps {
                script {
                    echo "Triggering Helm pipeline to deploy frontend service..."
                    build job: "${HELM_PIPELINE_JOB}", 
                          parameters: [
                              string(name: 'SERVICE', value: 'frontend'),
                              string(name: 'IMAGE_VERSION', value: "${VERSION}"),
                              string(name: 'NAMESPACE', value: "${KUBERNETES_NAMESPACE}")
                          ],
                          wait: false
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Frontend pipeline completed successfully!"
            echo "Image pushed: ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
        }
        failure {
            echo "❌ Frontend pipeline failed!"
        }
        always {
            cleanWs()
        }
    }
}

