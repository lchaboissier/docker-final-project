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
- **Frontend** : http://localhost
- **API Test** : http://localhost/api/hello

## Choix Techniques & Optimisations
1. **Multi-stage Builds** : Utilisé pour séparer l'environnement de compilation (Maven, Node) de l'image de production (JRE, Nginx). Ce qui réduit beaucoup la taille des images finales.
2. **Layer Caching Maven** : Dans le Dockerfile du Backend, copie du `pom.xml` et exécution de `mvn dependency:go-offline` *avant* de copier le code source. Cela réduit le temps de build de 1m30s à **17 secondes** après modifications.
3. **Images Alpine** : On utilise des images Alpine Linux pour la sécurité et la performance (oui).
4. **Utilisateur non-root** : Par défaut en root, on a configuré pour avoir un user avec des droits simples dans le conteneur Java pour éviter l'exécution en root.

## Problèmes rencontrés et Solutions
* **Erreur 404 API** : Spring Boot ne trouvait pas le contrôleur.
    * *Solution* : On a déplacé le `TestController.java` dans le même package que la classe principale (`MainApplication`) pour que le scan fonctionne (Problème nommage projet).
* **Build lent** : Maven retéléchargeait toutes les dépendances à chaque changement de code.
    * *Solution* : On a utilisé des flags `-T 1C` lors du clean pour optimiser la compilation.
* **Routing Angular** : Erreur 404 au refresh de la page Front.
    * *Solution* : Ajout d'une configuration Nginx personnalisée (`try_files $uri /index.html`).