# 🔧 FIX: Erreur Vercel "package.json not found"

## ❌ Problème
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/vercel/path0/package.json'
```

Vercel cherche le `package.json` à la racine du projet, mais le frontend est dans un sous-dossier!

---

## ✅ Solution: Configuration Vercel Correcte

### Méthode 1: Configuration Automatique (Recommandée)
Vercel devrait auto-détecter la structure. Essaie ceci dans **Project Settings**:

1. Va sur https://vercel.com/dashboard
2. Sélectionne ton projet `it-learning-platform`
3. Clique sur **Settings** → **General**
4. Trouve la section **Root Directory**
5. Mets la valeur à: `frontend`
6. Clique **Save**
7. Redéploie: **Deployments** → **Redeploy** (sur le dernier)

---

### Méthode 2: Utiliser vercel.json (à la racine)

Un fichier `vercel.json` a été créé à la racine avec cette configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "roots": [
    {
      "src": "frontend",
      "path": "frontend"
    }
  ]
}
```

Cela dit à Vercel:
- ✅ Le code est dans le dossier `frontend`
- ✅ Le build output est `frontend/dist`
- ✅ C'est une app Vite

**Après avoir poussé ce fichier**, refais un déploiement.

---

## 📋 Configuration Vercel (UI)

Si tu préfères configurer manuellement:

| Paramètre | Valeur |
|-----------|--------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Framework Preset** | Vite |

### Variables d'environnement (important!)
Ajoute dans **Environment Variables**:
```
VITE_API_URL=https://ton-backend-render.onrender.com
```

---

## 🚀 Prochaines étapes

### 1. Pousse les changements sur GitHub
```bash
git add -A
git commit -m "🔧 Fix Vercel deployment: Add correct vercel.json configuration"
git push origin main
```

### 2. Redéploie sur Vercel
- Option A: Va dans Dashboard → **Redeploy**
- Option B: Fais un nouveau push (redéploiement automatique)

### 3. Vérification
- Attends ~5-10 minutes
- Regarde les **Deployments** pour voir si ça build correctement
- Clique sur le déploiement pour voir les logs complets

---

## ✅ Tu saurais que c'est correct quand:
- ✅ Build says "Ready" (pas "Failed")
- ✅ Tu peux accéder à l'URL: `https://it-learning-platform.vercel.app`
- ✅ La page charge sans erreurs 404

---

## 🐛 Si ça ne fonctionne toujours pas:

1. **Vérifie les logs** dans Vercel → Deployments → Click sur le déploiement
2. **Assure-toi que `frontend/package.json` existe**
3. **Vérifie que `VITE_API_URL` est défini** correctement
4. **Essaie un "Redeploy from Cache"** (dans le dashboard)

---

## 💡 Tips
- Les logs Vercel sont très détaillés - lis-les bien!
- Le build doit terminer avec "Ready" en vert
- Si ça échoue, un nouveau push sur GitHub re-trigger le build automatiquement

Bonne chance! 🚀
