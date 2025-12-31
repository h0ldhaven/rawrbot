<div align="center">
    <img src="https://cdn.discordapp.com/avatars/563651023722250240/dfbe3815352f225e900d2314a889fb32?size=512" style="width: 10rem" alt="bot logo">
    <h1>🦖 RawrBot</h1>
</div>

<div align="center">
    <img style="margin: 0 1em" src="https://img.shields.io/badge/node-24.4.1-5FA04E?logo=nodedotjs&style=for-the-badge" alt="Node 24.4.1">
    <img style="margin: 0 1em" src="https://img.shields.io/badge/typescript-5.9.3-3178C6?logo=typescript&style=for-the-badge&logoColor=white" alt="TypeScript 5.9.3">
    <img style="margin: 0 1em" src="https://img.shields.io/badge/eslint-9.39.2-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint 9.39.2"/>
    <img style="margin: 0 1em" src="https://img.shields.io/badge/GitHub_Actions--2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions 1.0"/>
</div>

---

<div align="center">

  [![Commit CI - Main](https://img.shields.io/github/actions/workflow/status/h0ldhaven/rawrbot/commit-ci.yml?branch=main&style=for-the-badge&logo=github)](https://github.com/h0ldhaven/rawrbot/actions)
  [![Commit CI - Dev](https://img.shields.io/github/actions/workflow/status/h0ldhaven/rawrbot/commit-ci.yml?branch=dev&style=for-the-badge&logo=github)](https://github.com/h0ldhaven/rawrbot/actions)
  [![Release](https://img.shields.io/github/v/release/h0ldhaven/rawrbot?style=for-the-badge&logo=github)](https://github.com/h0ldhaven/rawrbot/releases)

</div>

---

<div align="center">
    <img src="https://img.shields.io/badge/hosted%20on-SkyBots-123F6D?style=for-the-badge&logo=skybots&logoColor=white" alt="Hosted on SkyBots"/>
</div>

---

<div align="center">
  <img src="https://img.shields.io/badge/Made with ❤️ by H0ldhaven-333?style=for-the-badge" alt="Made with Love by holdhaven">
</div>

---

## ⚙️ Commands & Setup

### 1️⃣ Cloner et installer le projet
Pour démarrer le projet en local, clonez le repo puis installez les dépendances :
```sh
$ git clone https://github.com/h0ldhaven/rawrbot.git
cd rawrbot
npm install
```

### 2️⃣ Lancer le projet en développement
Pour travailler en local avec hot-reload automatique :
```sh
npm run dev
```
Chaque modification dans le code sera automatiquement reflétée dans le bot sans avoir besoin de redémarrer.

### 3️⃣ ESLint
Le projet utilise ESLint avec TypeScript pour garantir un code cohérent et lisible.
- `no-console` : Autorisé
- Variables non utilisées : Warning (`_` autorisé en préfixe)
- `consistent-type-imports` (Imports de types cohérents) : Obligatoire
- `prefer-const` : Désactivé
- `Semicolons`: Obligatoires
- `Quotes` : Doubles

Avant un commit, il est recommandé de vérifier le code avec ESLint :
```sh
$ npm run lint
```
Cette commande analysera tous les fichiers et vous donnera des warnings pour :
- Variables inutilisées
- Imports de types incohérents
- Quotes incorrectes
- Semicolons manquants

### 4️⃣ Build du projet
Pour générer la version de production optimisée :
```sh
$ npm run build
```
Le dossier dist/ contiendra la version prête à être déployée sur votre serveur.

