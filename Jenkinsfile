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
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image for frontend..."
                    sh """
                        docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} .
                        docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
                        docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:dev
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                        
                        sh "docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
                        sh "docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
                        sh "docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:dev"
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

