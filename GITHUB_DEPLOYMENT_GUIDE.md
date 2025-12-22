# Guide Complet: Déployer avec GitHub

## Phase 1: Préparation GitHub

### Étape 1.1: Initialiser le repository GitHub
```bash
cd "c:\data\Project\MERN stack projects\it-learning-platform"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/it-learning-platform.git
git push -u origin main
```

**Note:** Remplacez `votre-username` par votre nom d'utilisateur GitHub.

### Étape 1.2: Configurer les Secrets GitHub

1. Accédez à votre repository sur GitHub.com
2. Allez à **Settings** (Paramètres)
3. Cliquez sur **Secrets and variables** > **Actions**
4. Cliquez sur **New repository secret** et ajoutez:

   - **`VITE_API_URL`**
     - Valeur: `https://votre-api.onrender.com` (vous l'obtiendrez après Étape 3)
     - Pour le développement: `http://localhost:5000`

   - **`RENDER_DEPLOY_WEBHOOK_URL`**
     - Vous l'obtiendrez à l'Étape 3.5

---

## Phase 2: Configurer GitHub Pages (Frontend)

### Étape 2.1: Activer GitHub Pages

1. Allez à **Settings** de votre repository
2. Scrollez à **Pages** (dans la sidebar gauche)
3. Sous "Source", sélectionnez **GitHub Actions**
4. Votre frontend sera accessible à:
   ```
   https://votre-username.github.io/it-learning-platform
   ```

### Étape 2.2: Vérifier la configuration du frontend

Assurez-vous que `frontend/vite.config.js` contient:
```javascript
export default {
  base: '/it-learning-platform/',
  // ... reste de la config
}
```

> **Remplacez** `/it-learning-platform/` par le nom exact de votre repository si différent.

### Étape 2.3: Tester le build frontend localement
```bash
cd frontend
npm install
npm run build
```

---

## Phase 3: Configurer Render.com (Backend)

### Étape 3.1: Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **Sign Up**
3. Connectez-vous avec votre compte GitHub
4. Autorisez l'accès à votre repository

### Étape 3.2: Créer un Web Service

1. Sur le dashboard Render, cliquez sur **New +** > **Web Service**
2. Sélectionnez votre repository `it-learning-platform`
3. Configurez comme suit:

   | Paramètre | Valeur |
   |-----------|--------|
   | Name | `it-learning-platform-api` |
   | Environment | `Node` |
   | Region | `Frankfurt` (ou votre région) |
   | Branch | `main` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Plan | `Free` |

4. Cliquez sur **Create Web Service**

### Étape 3.3: Ajouter les Variables d'Environnement

Sur le page de votre Web Service:

1. Allez à **Environment** (onglet)
2. Cliquez sur **Add Environment Variable** et ajoutez:

```
NODE_ENV = production

MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/db-name?retryWrites=true&w=majority

JWT_SECRET = votre_secret_jwt_long_et_securise

OPENAI_API_KEY = sk-xxxxxxxxxxxxxxxxxx (optionnel, si utilisé)

STRIPE_SECRET_KEY = sk_live_xxxxxxxxxxx (optionnel, si utilisé)
```

> **Importante:** Utilisez des clés sécurisées et gardez-les confidentielles!

### Étape 3.4: Vérifier le URL de l'API

Une fois le déploiement initial réussi:
1. Regardez l'URL en haut de la page Render
2. Elle ressemblera à: `https://it-learning-platform-api-xxxx.onrender.com`
3. **Copiez cette URL**

### Étape 3.5: Récupérer le Webhook de Déploiement

1. Sur la page du Web Service, allez à **Settings**
2. Scrollez à **Deploy Hook**
3. Copiez l'URL du webhook
4. Elle ressemblera à:
   ```
   https://api.render.com/deploy/srv-xxxxxxxxxxxxxxxxx?key=xxxxxxxxxxxxxxxxx
   ```

---

## Phase 4: Configurer les Secrets GitHub (Suite)

### Étape 4.1: Ajouter le Webhook Render

1. Retournez à votre repository GitHub
2. Allez à **Settings** > **Secrets and variables** > **Actions**
3. Cliquez sur **New repository secret**
4. Nom: `RENDER_DEPLOY_WEBHOOK_URL`
5. Valeur: Collez l'URL du webhook de Render (depuis Étape 3.5)
6. Cliquez sur **Add secret**

### Étape 4.2: Mettre à jour VITE_API_URL

1. Allez à **Secrets and variables** > **Actions**
2. Cliquez sur **Edit** du secret `VITE_API_URL`
3. Remplacez par l'URL Render obtenue à l'Étape 3.4:
   ```
   https://it-learning-platform-api-xxxx.onrender.com
   ```

---

## Phase 5: Tester le Backend Localement

### Étape 5.1: Installer et lancer le backend

```bash
cd backend
npm install
npm start
```

Vous devriez voir:
```
Server running on port 5000
Connected to MongoDB
```

### Étape 5.2: Tester les routes

```bash
# Test simple
curl http://localhost:5000/api/courses
```

---

## Phase 6: Tester le Frontend Localement

### Étape 6.1: Installer et lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

Accédez à: `http://localhost:5173`

### Étape 6.2: Vérifier les appels API

Ouvrez la console du navigateur (F12) et vérifiez que les appels API fonctionnent correctement.

---

## Phase 7: Déploiement Automatique

### Étape 7.1: Déclencher le déploiement

Faites un commit et un push sur la branche `main`:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### Étape 7.2: Vérifier le statut

1. Allez à votre repository GitHub
2. Cliquez sur **Actions**
3. Vous devriez voir votre workflow s'exécuter
4. Il y a 2 jobs:
   - ✅ **build-frontend** - Construit le site React
   - ✅ **deploy-frontend** - Publie sur GitHub Pages
   - ✅ **deploy-backend-render** - Déclenche le déploiement Render

### Étape 7.3: Vérifier les déploiements

**Frontend (GitHub Pages):**
- URL: `https://votre-username.github.io/it-learning-platform`
- Vérifiez dans 2-3 minutes

**Backend (Render):**
- URL: `https://it-learning-platform-api-xxxx.onrender.com`
- Vérifiez les logs dans le dashboard Render

---

## Phase 8: Dépannage

### Problème: GitHub Pages affiche une page vide

**Solution:**
1. Vérifiez que `frontend/vite.config.js` a `base: '/it-learning-platform/'`
2. Relancez le workflow: allez à **Actions** > cliquez sur le dernier workflow > **Re-run all jobs**

### Problème: Le backend ne démarre pas

**Solution:**
1. Vérifiez les logs sur Render (Settings > Logs)
2. Vérifiez que `backend/index.js` utilise `process.env.PORT`:
   ```javascript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server on ${PORT}`));
   ```

### Problème: L'API n'est pas accessible depuis le frontend

**Solution:**
1. Vérifiez que `VITE_API_URL` est correcte dans les Secrets GitHub
2. Vérifiez les CORS dans `backend/index.js`:
   ```javascript
   app.use(cors({
     origin: ['https://votre-username.github.io', 'http://localhost:3000'],
     credentials: true
   }));
   ```

### Problème: MongoDB n'est pas accessible

**Solution:**
1. Vérifiez que `MONGO_URI` est correct
2. Vérifiez que votre IP est dans MongoDB Atlas IP Whitelist (ajouter `0.0.0.0/0` pour Render)

---

## Phase 9: URL Finales

Une fois déployé:

| Service | URL |
|---------|-----|
| Frontend | `https://votre-username.github.io/it-learning-platform` |
| Backend API | `https://it-learning-platform-api-xxxx.onrender.com` |
| GitHub Repo | `https://github.com/votre-username/it-learning-platform` |

---

## Checklist Finale

- [ ] Repository GitHub créé et configuré
- [ ] Secrets GitHub ajoutés (VITE_API_URL, RENDER_DEPLOY_WEBHOOK_URL)
- [ ] GitHub Pages activé
- [ ] Compte Render créé
- [ ] Web Service Render créé
- [ ] Variables d'environnement Render configurées
- [ ] Webhook Render récupéré et ajouté aux Secrets
- [ ] Backend testé localement
- [ ] Frontend testé localement
- [ ] Premier déploiement via `git push` réussi
- [ ] Frontend accessible sur GitHub Pages
- [ ] Backend accessible via son URL Render

---

## Support Rapide

- **GitHub Actions:** Documentations → [Actions](https://docs.github.com/en/actions)
- **GitHub Pages:** Documentation → [Pages](https://docs.github.com/en/pages)
- **Render.com:** Documentation → [Render Docs](https://render.com/docs)
- **MongoDB Atlas:** Documentation → [Atlas](https://www.mongodb.com/docs/atlas/)
