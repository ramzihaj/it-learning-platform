# 🚀 Guide de Déploiement Gratuit - IT Learning Platform

## 📋 Prérequis

- Compte GitHub (déjà setup ✅)
- Compte Vercel (gratuit)
- Compte Render (gratuit)
- Compte MongoDB Atlas (gratuit)

---

## 🗄️ Étape 1: Configurer MongoDB Atlas (Gratuit)

### 1.1 Créer un cluster gratuit
1. Accès à https://www.mongodb.com/cloud/atlas
2. Crée un compte gratuit
3. Crée un nouveau projet
4. Crée un M0 cluster (gratuit) - sélectionne ta région
5. Attends 5-10 minutes que le cluster soit créé

### 1.2 Créer un utilisateur de base de données
1. Va dans **Database Access**
2. Crée un nouvel utilisateur (nom: `admin`, mot de passe: complexe)
3. Donne les permissions complètes

### 1.3 Autoriser les connexions
1. Va dans **Network Access**
2. Clique sur **Add IP Address**
3. Autorise toutes les IPs: `0.0.0.0/0` (pour le développement)

### 1.4 Obtenir la chaîne de connexion
1. Clique sur **Connect**
2. Sélectionne **Drivers** → **Node.js**
3. Copie la connexion: `mongodb+srv://admin:PASSWORD@cluster.mongodb.net/it-learning-platform?retryWrites=true&w=majority`
4. Remplace `PASSWORD` par ton mot de passe réel

---

## 🔧 Étape 2: Déployer le Backend sur Render (Gratuit)

### 2.1 Connecter ton repos GitHub à Render
1. Accès à https://render.com
2. Crée un compte gratuit avec GitHub
3. Clique sur **New +** → **Web Service**
4. Sélectionne ton repos `it-learning-platform`
5. Remplis les champs:
   - **Name**: `it-learning-platform-api`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Frankfurt (ou ta région)
   - **Plan**: Free

### 2.2 Ajouter les variables d'environnement
Clique sur **Environment** et ajoute:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/it-learning-platform?retryWrites=true&w=majority
JWT_SECRET=ta-clé-secrète-complexe-ici
OPENAI_API_KEY=ta-clé-openai-ici
STRIPE_SECRET_KEY=ta-clé-stripe-ici
```

### 2.3 Déployer
1. Clique sur **Create Web Service**
2. Attends ~5 minutes le déploiement
3. Note l'URL générée: `https://it-learning-platform-api.onrender.com`

---

## 🎨 Étape 3: Déployer le Frontend sur Vercel (Gratuit)

### 3.1 Connecter ton repos à Vercel
1. Accès à https://vercel.com
2. Clique sur **Add New** → **Project**
3. Importe ton repos GitHub `it-learning-platform`
4. Sélectionne la root: `.` (racine)

### 3.2 Configurer le build
1. **Framework**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`

### 3.3 Ajouter les variables d'environnement
Ajoute dans **Environment Variables**:
```
VITE_API_URL=https://it-learning-platform-api.onrender.com
```

### 3.4 Déployer
1. Clique sur **Deploy**
2. Attends ~3-5 minutes
3. Ton site sera accessible à: `https://it-learning-platform.vercel.app`

---

## 🔗 Configuration Finale

### Mettre à jour .env.local frontend avec l'URL Render:
```bash
VITE_API_URL=https://it-learning-platform-api.onrender.com
```

### Mettre à jour .env backend avec MongoDB Atlas:
```bash
MONGO_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/it-learning-platform
JWT_SECRET=ta-clé-secrète
OPENAI_API_KEY=ta-clé
STRIPE_SECRET_KEY=ta-clé
```

---

## ⚠️ Points Importants

### Render (Backend)
- ✅ Gratuit mais le service peut s'endormir après 15 min d'inactivité
- Solution: Utilise https://kaffeine.herokuapp.com ou un simple cron job

### Vercel (Frontend)
- ✅ Totalement gratuit
- ✅ Déploiement automatique à chaque push sur main
- ✅ Support des variables d'environnement

### MongoDB Atlas
- ✅ Gratuit jusqu'à 512 MB de données
- ✅ Bon pour le développement et les petits projets

---

## 📊 Résumé des URLs

| Service | URL | Statut |
|---------|-----|--------|
| Frontend | `https://it-learning-platform.vercel.app` | 🟢 |
| Backend API | `https://it-learning-platform-api.onrender.com` | 🟢 |
| Database | MongoDB Atlas | 🟢 |

---

## 🐛 Troubleshooting

### Le backend ne démarre pas
- Vérifie les logs Render: **Logs** → vois les erreurs
- Assure-toi que MONGO_URI est correct
- Vérifie que MongoDB Atlas a ton IP en whitelist

### Le frontend ne se connecte pas au backend
- Vérifie que `VITE_API_URL` est correct
- Ouvre la console du navigateur (F12) pour voir les erreurs CORS
- Assure-toi que le backend accepte les requêtes depuis Vercel

### MongoDB n'est pas accessible
- Va dans **Network Access** sur MongoDB Atlas
- Vérifie que `0.0.0.0/0` est autorisé
- Vérifie le mot de passe

---

## 🎉 Bravo!

Ton application est maintenant accessible gratuitement en ligne! 🚀

Tu peux:
- Partager l'URL avec d'autres
- Continuer à développer localement
- Les changements sont automatiquement deployés quand tu push sur GitHub

