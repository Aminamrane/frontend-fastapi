# Frontend Repository

Repository contenant l'application frontend Next.js.

## Structure

```
frontend/
├── src/               # Code source Next.js
├── public/            # Assets statiques
├── Dockerfile         # Image Docker
├── package.json       # Dépendances Node.js
├── Jenkinsfile        # Pipeline CI/CD Jenkins
└── README.md
```

## Pipeline Jenkins

La pipeline Jenkins effectue les étapes suivantes :

1. **Checkout** : Récupération du code source
2. **Install Dependencies** : Installation des dépendances npm
3. **Tests** : Exécution des tests unitaires
4. **Build** : Build de l'application Next.js
5. **Build Docker Image** : Construction de l'image Docker
6. **Push to Docker Hub** : Envoi de l'image vers Docker Hub (aminamr/frontend)
7. **Trigger Helm Deployment** : Déclenchement de la pipeline Helm pour déployer le service

## Variables d'environnement

- `DOCKER_REGISTRY` : docker.io
- `DOCKER_USERNAME` : aminamr
- `IMAGE_NAME` : frontend
- `VERSION` : Numéro de build Jenkins
- `HELM_PIPELINE_JOB` : Nom du job Jenkins pour Helm
- `KUBERNETES_NAMESPACE` : Namespace Kubernetes (dev/prod)

## Image Docker

L'image est taggée avec :
- Version : `aminamr/frontend:{BUILD_NUMBER}`
- Latest : `aminamr/frontend:latest`

## Configuration Jenkins

Créer les credentials suivants dans Jenkins :
- **docker-hub-credentials** : Credentials Docker Hub (username/password)

