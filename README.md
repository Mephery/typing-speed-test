# Fast & Keyrious

Fast & Keyrious est une application moderne et minimaliste de test de vitesse de frappe (typing speed test). Le projet est développé en React avec Vite, mettant l'accent sur la performance, l'accessibilité visuelle et une expérience utilisateur fluide.

## Fonctionnalités

* **Mode Mots :** Génération dynamique de listes de mots (15, 30 ou 50 mots) tirés d'un dictionnaire personnalisé.
* **Modificateurs dynamiques :** Options permettant d'injecter de la ponctuation (virgules et points) ou des nombres de manière aléatoire au sein du mode Mots.
* **Mode Citations :** Sélection de citations littéraires classiques pour un entraînement axé sur la saisie de textes réels.
* **Statistiques en temps réel :** Calcul instantané du score WPM (Words Per Minute) et du taux de précision basé sur les caractères correctement saisis.
* **Gestion du Highscore :** Persistance du record personnel de l'utilisateur via l'API LocalStorage du navigateur.
* **Retour sonore :** Génération de bips audio en cas d'erreur de saisie via l'API Web Audio (AudioContext), avec option de mise en sourdine.
* **Sélecteur de thèmes :** Interface personnalisable avec plusieurs thèmes visuels (Matrix, Serika, Journal, Café) gérés par des variables CSS dynamiques et un mode d'aperçu au survol.

## Technologies utilisées

* **Frontend :** React 18, JavaScript (Vanilla ES6+), CSS3 (Variables personnalisées)
* **Outil de build :** Vite
* **Hébergement et CI/CD :** Vercel (Déploiement continu automatisé à chaque push)
* **Gestion de domaine :** Hostinger (Configuration de zone DNS avec enregistrements CNAME uniques)

## Architecture du projet

Le projet s'articule autour d'un composant principal optimisé pour limiter les rejets de rendus asynchrones de React, notamment lors de la réinitialisation des états du jeu.

* `src/App.jsx` : Logique principale de l'application, gestion des états (statut du jeu, chronomètre, saisie utilisateur) et rendu de l'interface.
* `src/App.css` : Architecture des thèmes graphiques et gestion des animations de l'interface (notamment l'effet de pulsation lumineuse du logo).
* `src/text.js` : Base de données locale contenant le dictionnaire de mots et le tableau des citations.

## Installation et configuration locale

Pour exécuter ce projet sur votre machine locale, suivez les étapes suivantes :

1. Clonez le dépôt :
```bash
git clone https://github.com/Mephery/typing-speed-test.git
```

2. Accédez au répertoire du projet :
```bash
cd typing-speed-test
```

3. Installez les dépendances :
```bash
npm install
```

4. Lancez le serveur de développement local :
```bash
npm run dev
```

5. Pour compiler le projet pour la production :
```bash
npm run build
```