# 🔧 FIX: Erreur Render "package.json not found"

## ❌ Problème
```
Error: ENOENT: no such file or directory, open '/opt/render/project/src/package.json'
```

Render cherche le `package.json` au mauvais endroit!

---

## ✅ Solution: Configuration Manuelle sur Render

### Étape 1: Accéder aux paramètres du service

1. Va sur https://dashboard.render.com
2. Sélectionne ton service `it-learning-platform-api`
3. Clique sur **Settings** (Paramètres)

### Étape 2: Corriger la configuration

Cherche la section **Build & Deploy** et modifie:

| Paramètre | Valeur Actuelle | Nouvelle Valeur |
|-----------|-----------------|-----------------|
| **Root Directory** | `.` ou vide | `backend` |
| **Build Command** | `npm install` | `npm install` |
| **Start Command** | `npm start` | `npm start` |

### Étape 3: Variables d'environnement

Ajoute ces variables dans **Environment**:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/it-learning-platform
JWT_SECRET=ta-clé-secrète-complexe
OPENAI_API_KEY=ta-clé-openai
STRIPE_SECRET_KEY=ta-clé-stripe
```

### Étape 4: Redéployer

1. Clique sur **Manual Deploy** ou fais un nouveau push sur GitHub
2. Regarde les logs pour vérifier que ça fonctionne

---

## 📋 Alternative: Utiliser render.yaml

Si tu veux utiliser le fichier `render.yaml` (à la racine):

```yaml
services:
  - type: web
    name: it-learning-platform-api
    env: node
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
```

Puis dans Render:
1. Va dans **Settings**
2. Active **Use render.yaml** (si disponible)

---

## 🔍 Vérification

Une fois corrigé, tu devrais voir:
- ✅ Build OK
- ✅ Service running
- ✅ URL accessible

Si ça ne fonctionne toujours pas:
1. Vérifie les **logs** (va dans **Logs** en haut)
2. Vérifie que MongoDB est accessible (whitelist des IPs)
3. Vérifie les variables d'environnement

---

## 💡 Tips

- Rends-toi dans **Backend** → **Settings** pour vérifier les autres paramètres
- Les logs sont très utiles pour debugger: regarde l'onglet **Logs**
- Si Render ne redémarre pas, force un redéploiement manuel

Bonne chance! 🚀
