# 🎵 Soundnar - Votre plateforme musicale tout-en-un

Soundnar est une application web moderne qui vous permet d'explorer l'univers de la musique. Grâce à l'utilisation dde l'api de deezer, découvrez vos morceaux, albums et artistes préférés, et profitez de fonctionnalités interactives comme la création de playlists et la gestion de favoris. Grâce à un système d'authentification sécurisé, chaque utilisateur peut personnaliser son expérience musicale.

---

## 🛠️ Fonctionnalités principales

1. **🔍 Recherche globale** :
   - Recherchez des **musiques**, **albums**, ou **artistes** avec une barre de recherche intuitive.
   - Affichez les détails complets d'un album ou d'un artiste (visuels, titres des chansons, etc.).

2. **🎶 Création et gestion de playlists** :
   - Connectez-vous pour créer vos propres playlists personnalisées.
   - Ajoutez ou supprimez des morceaux à vos playlists en toute simplicité.

3. **⭐ Favoris** :
   - Sauvegardez vos musiques, albums et artistes préférés dans une liste de favoris.

4. **🔒 Authentification sécurisée** :
   - Inscription et connexion avec un système robuste basé sur **JWT**.
   - Accès aux fonctionnalités personnalisées après connexion (playlists, favoris).

5. **🎨 Interface moderne et responsive** :
   - Une UI élégante et réactive conçue avec **Tailwind CSS**, optimisée pour desktop et mobile.

---

## 🚀 Technologies utilisées

- **Frontend** :
  - [React](https://reactjs.org/) avec Remix pour une navigation rapide et performante.
  - [Tailwind CSS](https://tailwindcss.com/) pour un design propre et réactif.

- **Backend** :
  - [Node.js](https://nodejs.org/) avec [Express](https://expressjs.com/) pour la gestion des APIs.
  - [Prisma](https://www.prisma.io/) pour gérer les interactions avec la base de données SQLite.

- **Base de données** :
  - [SQLite](https://www.sqlite.org/) : Une solution légère pour stocker vos utilisateurs, playlists, favoris et musiques.

- **Authentification** :
  - [JWT (JSON Web Tokens)](https://jwt.io/) pour sécuriser les sessions utilisateur.
  - Cookies sécurisés gérés via Remix.

---

## 📦 Installation et configuration

### 1️⃣ Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- SQLite (inclus dans Prisma)
- Un éditeur de texte comme [VSCode](https://code.visualstudio.com/)

### 2️⃣ Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/soundnar.git
   cd soundnar
   cd apiWeb => node index.js
   cd webMusic => npm run dev
