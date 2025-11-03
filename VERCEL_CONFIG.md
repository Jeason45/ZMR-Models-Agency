# Configuration Vercel - Variables d'environnement

## 🎯 Variables à ajouter sur Vercel

Allez sur : **https://vercel.com/dashboard** → Votre projet → **Settings** → **Environment Variables**

---

## 📧 Variables Email/SMTP (À AJOUTER)

Ajoutez ces 6 variables :

### 1. ADMIN_EMAIL
```
jeason.lemoine@gmail.com
```
- Environnement : ✅ Production ✅ Preview ✅ Development

### 2. RESEND_API_KEY
```
re_J8ZQu24K_8gonntBwb8X6ttHTWy7bihRc
```
- Environnement : ✅ Production ✅ Preview ✅ Development

### 3. SMTP_HOST
```
smtp.gmail.com
```
- Environnement : ✅ Production ✅ Preview ✅ Development

### 4. SMTP_PORT
```
587
```
- Environnement : ✅ Production ✅ Preview ✅ Development

### 5. SMTP_SECURE
```
false
```
- Environnement : ✅ Production ✅ Preview ✅ Development

### 6. SMTP_USER
```
jeason.lemoine@gmail.com
```
- Environnement : ✅ Production ✅ Preview ✅ Development

### 7. SMTP_PASSWORD
```
pgdsdahunhgvpevq
```
- Environnement : ✅ Production ✅ Preview ✅ Development
- ⚠️ **IMPORTANT** : Sans espaces, en minuscules

---

## ✅ Variables déjà configurées (À VÉRIFIER)

Vérifiez que ces variables existent déjà :

### Base de données
- `DATABASE_URL` → `postgresql://postgres.fzsmjingetgyipevzuuv:Geomesuredatabase45!@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

### Auth
- `AUTH_SECRET` → `gdix9X5o6vJwsm+10tBqQPqfPvVR9iPEp09fsrnjlEQ=`

### Cloudflare R2
- `R2_ACCOUNT_ID` → `4fd35179c0dc4a2190eaee7e01874cc1`
- `R2_ACCESS_KEY_ID` → `97a3f661122e069f0a5da5fb2292b9f6`
- `R2_SECRET_ACCESS_KEY` → `65e1b93920e0d01e43bb352019bbed0d82c2df87efe42161e0d50856e2bae27d`
- `R2_BUCKET_NAME` → `zmr-models-media`
- `R2_PUBLIC_URL` → `https://pub-dc61571c80744a2ab957efeb53f9f897.r2.dev`

### Next.js (Production seulement)
- `NEXT_PUBLIC_APP_URL` → URL de votre site Vercel (ex: `https://zmr-models.vercel.app`)
- `NEXTAUTH_URL` → Même URL que NEXT_PUBLIC_APP_URL

---

## 🔧 Comment ajouter une variable sur Vercel

1. **Allez dans Settings → Environment Variables**
2. **Cliquez sur "Add New"**
3. **Name** : Le nom de la variable (ex: `SMTP_USER`)
4. **Value** : La valeur (ex: `jeason.lemoine@gmail.com`)
5. **Environments** : Cochez les 3 (Production, Preview, Development)
6. **Cliquez sur "Save"**
7. **Répétez pour chaque variable**

---

## 🚀 Après avoir ajouté les variables

### Option 1 : Redéploiement automatique
- Les variables sont appliquées au **prochain déploiement**
- Si vous faites un commit/push, Vercel redéploie automatiquement

### Option 2 : Redéploiement manuel
1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Choisissez **"Use existing Build Cache"** pour plus rapide

---

## ✅ Checklist

- [ ] Connecté à Vercel Dashboard
- [ ] Projet sélectionné
- [ ] Onglet Settings → Environment Variables ouvert
- [ ] `ADMIN_EMAIL` ajouté
- [ ] `RESEND_API_KEY` ajouté
- [ ] `SMTP_HOST` ajouté
- [ ] `SMTP_PORT` ajouté
- [ ] `SMTP_SECURE` ajouté
- [ ] `SMTP_USER` ajouté
- [ ] `SMTP_PASSWORD` ajouté
- [ ] Variables existantes vérifiées (DATABASE_URL, etc.)
- [ ] `NEXT_PUBLIC_APP_URL` et `NEXTAUTH_URL` mis à jour avec l'URL production
- [ ] Redéploiement lancé
- [ ] Test d'envoi d'email en production

---

## 🧪 Test en production

Une fois déployé, testez l'envoi d'email :

1. Allez sur votre site en production
2. Remplissez le formulaire de contact
3. Vérifiez que vous recevez l'email sur `jeason.lemoine@gmail.com`

OU

Créez un script de test en production (optionnel).

---

## 📞 En cas de problème

### Email non reçu en production
1. Vérifiez les logs Vercel : Dashboard → Deployments → View Function Logs
2. Vérifiez que `SMTP_PASSWORD` est bien sans espaces
3. Vérifiez que `SMTP_USER` correspond bien au compte qui a l'App Password

### Variables non prises en compte
- Faites un redéploiement complet (sans cache)
- Vérifiez que les 3 environnements sont cochés

---

## ⏱️ Temps estimé : 10 minutes

- Ajout des 7 variables : ~5 min
- Vérification des variables existantes : ~2 min
- Redéploiement : ~3 min
- Test : ~2 min

**Total : ~12 minutes**
