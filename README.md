# 🎮 Logica - Collection de Jeux de Logique

Ce dépôt contient le code source de Logica, une plateforme de jeux de logique en ligne. L'application est développée avec Next.js pour une expérience utilisateur rapide et est entièrement conteneurisée avec Docker.

---

## ✨ Fonctionnalités de Logica

Logica propose une collection de jeux pour exercer l'esprit :

* **Mots Croisés** : Testez votre vocabulaire et votre esprit de déduction.
* **Sudoku** : Résolvez des grilles de différents niveaux de difficulté.
* **Binero** : Explorez la logique binaire avec ce puzzle captivant de 0 et de 1.

---

## 📦 Prérequis

Assurez-vous que les logiciels suivants sont installés sur votre machine pour lancer l'environnement de développement :

* **Docker et Docker Compose**
* **Git**

---

## 📂 Structure du Projet

L'application suit une architecture Next.js standard conteneurisée, en utilisant le dossier src/ comme contexte de construction.


* **compose.yaml** : Fichier principal qui orchestre le lancement du service portfolio.
* **.env** : Fichier pour stocker les variables d'environnement de configuration (ports, clés d'API etc).
* **Dockerfile** : Les instructions pour construire l'image Docker de l'application Next.js.
* **package.json** : Métadonnées et dépendances du projet Node.js / Next.js.
* **src/** : Dossier contenant les composants et pages Next.js.

---

## 🚀 Installation et Démarrage

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/wilmore-dynamics.git
cd wilmore-dynamics
```

### 2. Configuration
```bash
# Copier le fichier d'exemple des variables d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos propres valeurs
nano .env
```

### 3. Lancement avec Docker
```bash
# Construction et démarrage du conteneur
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d --build
```

Le site sera accessible sur `http://localhost:3000`

### 4. Développement local (optionnel)
Si vous préférez développer sans Docker :

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev
```


## 🛑 Arrêter et Nettoyer

Pour arrêter les conteneurs :
```bash
docker-compose down
```
Pour nettoyer les volumes et les réseaux :
```bash
docker-compose down -v
```

--- 

## ⚖️ Licence et Attribution

Ce projet est sous licence MIT. Bien que l'attribution ne soit pas une obligation légale, nous encourageons la citation de ce dépôt si vous utilisez notre architecture ou nos composants dans votre propre travail.

* Lien du Dépôt : https://github.com/eberess/logica.git

---

## 📧 Contact

Pour les questions liées à ce code ou aux contributions :

* **Problèmes/Bugs** : Créez une nouvelle "Issue" dans ce dépôt.

* **Email** : [Contact](mailto:elt@wilmoredynamics.com)

* **LinkedIn** : [LinkedIn](https://www.linkedin.com/in/el-beressa/)
