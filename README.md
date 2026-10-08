# YY — Yves Yao | Portfolio React + Express

Le site utilise React et Vite pour l’interface, Express pour l’API et MySQL pour les données. Le schéma MySQL existant est conservé afin de préserver les projets, médias, messages et comptes administrateur.

## Prérequis

- Node.js 20 ou plus récent et npm
- MySQL 8 ou MariaDB avec une base de données configurée

## Installation

1. Installer les dépendances depuis la racine :

   ```powershell
   npm install
   ```

2. Copier `server/.env.example` vers `server/.env`, puis renseigner les paramètres MySQL. Remplacer également `SESSION_SECRET` par une valeur aléatoire longue.
3. Si la base n’existe pas encore, importer `database/schema.sql` puis `database/features.sql`. Ne pas réimporter ces fichiers sur une base existante sans avoir vérifié les données : ils initialisent également du contenu de démonstration. L’API crée automatiquement ses tables de session, de limitation de connexion et d’audit.
4. En développement, lancer Express et Vite :

   ```powershell
   npm run dev
   ```

   Ouvrir `http://localhost:5173`. Vite transmet les requêtes `/api` au serveur Express sur `http://localhost:3000`.

5. Pour la production, construire React puis démarrer Express :

   ```powershell
   npm run build
   npm start
   ```

   Le serveur Express sert alors le client construit sur le port indiqué par `PORT` (3000 par défaut).

## Déploiement sur Vercel + Render

### Frontend Vercel

- Importer le dépôt GitHub dans Vercel.
- Définir le dossier racine du projet sur `client` si tu déclares le projet depuis le dépôt complet.
- Build command : `npm install && npm run build`
- Output directory : `dist`
- Ajouter une variable d’environnement dans Vercel :

  ```env
  VITE_API_BASE_URL=https://ton-backend.render.com
  VITE_ASSETS_BASE_URL=https://ton-backend.render.com
  ```

- Le fichier `vercel.json` à la racine du dépôt permet de réécrire les routes SPA vers `index.html` pour les pages comme `/admin` et `/projects/:id`.

### Backend Render

- Créer un service Web Node.js avec le dossier `server` comme racine.
- Build command : `npm install`
- Start command : `node src/index.js`
- Définir les variables d’environnement suivantes :

  ```env
  PORT=10000
  APP_URL=https://ton-front.vercel.app
  SESSION_SECRET=remplacer-par-une-cle-secrete-longue
  DB_HOST=host-mysql
  DB_PORT=3306
  DB_NAME=portfolio_yves_yao
  DB_USER=utilisateur
  DB_PASSWORD=motdepasse
  COOKIE_SECURE=true
  ```

- Les uploads de médias restent sur le disque du backend et doivent donc être conservés sur le service backend, pas sur Vercel.

## Administration

- `/admin/setup` permet de créer le premier administrateur uniquement si aucun compte n’existe. Utiliser un mot de passe d’au moins 12 caractères.
- `/admin` ouvre la connexion et le tableau de bord.
- L’administration permet de gérer les projets, compétences, services, vidéos, médias, traductions, témoignages, messages, profil et comptes.
- Les comptes déjà enregistrés dans MySQL restent utilisables. Les mots de passe historiques `password_hash` sont vérifiés au format bcrypt.
- Les rôles limités ne peuvent pas gérer le profil, les traductions ou les utilisateurs.

## Fichiers et sécurité

- Les médias fournis restent dans `assets/`. Les nouveaux fichiers sont enregistrés dans `assets/projects/`, `assets/videos/` et `assets/uploads/`.
- `server/.env` contient les secrets locaux et ne doit pas être ajouté au contrôle de version.
- En production, activer HTTPS et définir `COOKIE_SECURE=true`.
- Les formulaires protégés utilisent une session serveur MySQL et un jeton CSRF. Les connexions administrateur sont limitées après plusieurs échecs.
- `database/schema.sql` et `database/features.sql` restent disponibles pour créer une base vierge et documenter le schéma conservé.
