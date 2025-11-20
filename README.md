# Projet final Docker - Stack Complète

Ce projet déploie une architecture micro-services prête pour la production, orchestrée par Docker Compose.

## Architecture
- **Frontend** : Application Angular buildée et servie via Nginx.
- **Backend** : API REST Spring Boot (Java 21) exécutée dans une image Alpine.
- **Database** : Une base PostgreSQL avec volume persistant à l'aide de Docker.
- **Reverse Proxy** : À l'aide de Nginx, routage des requêtes vers le Frontend (`/`) et le Backend (`/api/`).

## Commandes pour lancer
1. Créer le fichier d'environnement :
   `cp .env.example .env`
2. Lancer la stack :
   `docker compose up --build -d`

## Endpoints
* Backend disponible sur [http://localhost:8080](http://localhost:8080)
  * Routes disponibles :
    * `GET /api/health` : Affiche le statut de l'API
    * `GET /api/items` : Récupère la liste des items
    * `POST /api/items` : Crée un nouvel item
* Frontend disponible sur [http://localhost:8081](http://localhost:8081)

## Choix Techniques & Optimisations
1. **Multi-stage Builds** : Utilisé pour séparer l'environnement de compilation (Maven, Node) de l'image de production (JRE, Nginx). Ce qui réduit beaucoup la taille des images finales.
2. **Layer Caching Maven** : Dans le Dockerfile du Backend, copie du `pom.xml` et exécution de `mvn dependency:go-offline` *avant* de copier le code source. Cela réduit le temps de build de 1m30s à **17 secondes** après modifications.
3. **Images Alpine** : On utilise des images Alpine Linux pour la sécurité et la performance (oui).
4. **Utilisateur non-root** : Par défaut en root, on a configuré pour avoir un user avec des droits simples dans le conteneur pour éviter l'exécution en root.

## Problèmes rencontrés et Solutions
* **Build lent** : Maven retéléchargeait toutes les dépendances à chaque changement de code.
    * *Solution* : On a utilisé des flags `-T 1C` lors du clean pour optimiser la compilation.