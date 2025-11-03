# Phase 1 - Configuration SMTP et Vercel

## 📋 ÉTAPE 1 : Vérifier les variables Vercel

### Variables à vérifier sur Vercel Dashboard

1. **Allez sur** : https://vercel.com/dashboard
2. **Sélectionnez votre projet** : ZMR Models Agency
3. **Allez dans** : Settings → Environment Variables
4. **Vérifiez que ces variables sont configurées** :

#### Variables CRITIQUES (Production + Preview + Development) :

```
DATABASE_URL
postgresql://postgres.fzsmjingetgyipevzuuv:Geomesuredatabase45!@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

AUTH_SECRET
gdix9X5o6vJwsm+10tBqQPqfPvVR9iPEp09fsrnjlEQ=

R2_ACCOUNT_ID
4fd35179c0dc4a2190eaee7e01874cc1

R2_ACCESS_KEY_ID
97a3f661122e069f0a5da5fb2292b9f6

R2_SECRET_ACCESS_KEY
65e1b93920e0d01e43bb352019bbed0d82c2df87efe42161e0d50856e2bae27d

R2_BUCKET_NAME
zmr-models-media

R2_PUBLIC_URL
https://pub-dc61571c80744a2ab957efeb53f9f897.r2.dev

RESEND_API_KEY
re_J8ZQu24K_8gonntBwb8X6ttHTWy7bihRc

ADMIN_EMAIL
jlwebdesign33@gmail.com
```

#### Variables SMTP (à ajouter après avoir obtenu le App Password) :

```
SMTP_HOST
smtp.gmail.com

SMTP_PORT
587

SMTP_SECURE
false

SMTP_USER
jlwebdesign33@gmail.com

SMTP_PASSWORD
(votre App Password Gmail - voir étape 2)
```

#### Variables Next.js (Production uniquement) :

```
NEXT_PUBLIC_APP_URL
https://votre-domaine-vercel.vercel.app
(ou votre domaine custom)

NEXTAUTH_URL
https://votre-domaine-vercel.vercel.app
(ou votre domaine custom)
```

---

## 📧 ÉTAPE 2 : Obtenir un Gmail App Password

### Instructions pour créer un App Password Gmail

1. **Allez sur** : https://myaccount.google.com/apppasswords
   - Connectez-vous avec : `jlwebdesign33@gmail.com`

2. **Si la page n'est pas disponible** :
   - Allez d'abord sur : https://myaccount.google.com/security
   - Activez la **validation en deux étapes** (2FA) si ce n'est pas déjà fait
   - Une fois 2FA activé, retournez sur : https://myaccount.google.com/apppasswords

3. **Créer l'App Password** :
   - Nom de l'application : "ZMR Models Agency"
   - Cliquez sur "Créer"
   - Copiez le mot de passe généré (16 caractères, ex: `abcd efgh ijkl mnop`)

4. **IMPORTANT** :
   - Enregistrez ce mot de passe quelque part de sûr
   - Vous ne pourrez plus le voir après avoir fermé la fenêtre

---

## 🔧 ÉTAPE 3 : Configurer SMTP localement et sur Vercel

### A. Configuration locale

Mettez à jour le fichier `.env` ligne 13 :

**Avant** :
```
SMTP_PASSWORD=your_gmail_app_password_here
```

**Après** :
```
SMTP_PASSWORD=abcd efgh ijkl mnop
(remplacez par votre App Password généré)
```

⚠️ **IMPORTANT** : Le App Password doit être **sans espaces** :
```
SMTP_PASSWORD=abcdefghijklmnop
```

### B. Configuration Vercel

Sur Vercel Dashboard (Settings → Environment Variables) :
1. Ajoutez la variable `SMTP_PASSWORD`
2. Valeur : votre App Password (sans espaces)
3. Environnement : Production + Preview + Development

---

## ✅ ÉTAPE 4 : Tester la configuration

### Test local (après avoir configuré SMTP_PASSWORD)

Je vais lancer un script de test pour vérifier que l'envoi d'emails fonctionne.

---

## 📊 Checklist

- [ ] Variables Vercel vérifiées (DATABASE_URL, AUTH_SECRET, R2_*, etc.)
- [ ] Gmail 2FA activé
- [ ] App Password Gmail généré
- [ ] `.env` mis à jour avec SMTP_PASSWORD
- [ ] SMTP_PASSWORD ajouté sur Vercel
- [ ] NEXT_PUBLIC_APP_URL et NEXTAUTH_URL mis à jour en production
- [ ] Test d'envoi d'email réussi

---

## 🆘 Problèmes courants

### "App Passwords" non disponible
→ Activez d'abord la validation en deux étapes (2FA)

### "Error sending email: Invalid login"
→ Vérifiez que le App Password est correct et sans espaces

### "Connection refused"
→ Vérifiez que SMTP_HOST=smtp.gmail.com et SMTP_PORT=587

---

## 🎯 Une fois terminé

Dites-moi quand vous avez :
1. ✅ Vérifié les variables Vercel
2. ✅ Obtenu l'App Password Gmail
3. ✅ Mis à jour `.env`
4. ✅ Ajouté SMTP_PASSWORD sur Vercel

Je lancerai ensuite le test d'envoi d'email.
