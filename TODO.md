# ZMR Models Agency - TODO List

**Dernière mise à jour** : 3 janvier 2025

---

## ✅ DÉJÀ FAIT

### Infrastructure & Backend
- [x] Base de données Supabase PostgreSQL connectée
- [x] Cloudflare R2 configuré et migration complète (42 fichiers)
- [x] API upload vers R2 avec détection de doublons (MD5)
- [x] NextAuth 5.0 pour authentification
- [x] Toutes les API routes (11 endpoints)

### Site Public
- [x] Page d'accueil avec 3 vidéos hero en rotation
- [x] Toutes les pages : Models, Acting, Promo, Details, Contact
- [x] Design responsive et professionnel
- [x] Déployé sur Vercel

### CRM Admin
- [x] Dashboard admin complet
- [x] Gestion des contacts
- [x] Calendrier de rendez-vous
- [x] Gestion des documents
- [x] Gestion des modèles/talents
- [x] Interface d'édition avec upload multi-fichiers
- [x] Sidebar avec animations

### Système de Documents
- [x] Génération de documents (DOCX, PDF)
- [x] Templates de documents
- [x] **Signature électronique complète** :
  - API `/api/signatures` (création, lecture)
  - API `/api/signatures/verify` (vérification)
  - Preuve cryptographique (hash SHA-256)
  - Stockage IP, user agent, timestamp, localisation
  - Backup JSON des preuves légales
  - Interface de signature

### Email
- [x] Système Nodemailer avec templates HTML
- [x] API Resend pour formulaire contact
- [x] Logging des emails en base de données

---

## 🔴 PRIORITÉ CRITIQUE

### 1. Configuration SMTP Production
**Statut** : Placeholder dans `.env`
**Impact** : Empêche l'envoi automatique de documents par email
**Fichier** : `.env` ligne 13
**Action requise** :
- Obtenir un App Password Gmail OU
- Configurer SendGrid/Mailgun/SES
- Mettre à jour `SMTP_PASSWORD` dans `.env` et `.env.local`
- Ajouter la variable sur Vercel

**Temps estimé** : 15 minutes

---

### 2. Variables d'environnement Vercel
**Statut** : À vérifier
**Impact** : Site production peut avoir des fonctionnalités manquantes
**Action requise** :
- Vérifier que toutes les variables de `.env.local` sont sur Vercel :
  - `DATABASE_URL`
  - `AUTH_SECRET`
  - `R2_*` (5 variables)
  - `SMTP_*` (4 variables)
  - `RESEND_API_KEY`
  - `ADMIN_EMAIL`
  - Clerk keys (si utilisé)

**Temps estimé** : 10 minutes

---

## 🟠 PRIORITÉ IMPORTANTE (Légal)

### 3. Pages légales
**Statut** : Manquantes
**Impact** : Non-conformité RGPD
**Action requise** :
- Créer `/app/mentions-legales/page.tsx`
- Créer `/app/politique-confidentialite/page.tsx`
- Créer `/app/cgu/page.tsx` (CGU/CGV)
- Ajouter les liens dans le footer
- Contenu à fournir par le client (raison sociale, SIRET, etc.)

**Temps estimé** : 2-3 heures (selon si contenu fourni)

---

### 4. Page Blog
**Statut** : Placeholder "Coming soon"
**Impact** : Donne une impression d'incomplet
**Action requise** :
- **Option A** : Implémenter le blog (3-4h)
- **Option B** : Supprimer la page et le lien (5 min)
- **Décision client requise**

**Temps estimé** : 5 min (suppression) OU 3-4h (implémentation)

---

## 🟡 PRIORITÉ NORMALE (Contenu)

### 5. Enrichissement du contenu
**Statut** : 5 talents actuellement
**Impact** : Site semble peu fourni
**Action requise** :
- Ajouter plus de talents via l'interface admin
- Ajouter plus de photos/vidéos dans les galeries
- Compléter les profils existants

**Temps estimé** : Selon volume de contenu

---

## 🟢 PRIORITÉ BASSE (Optimisation)

### 6. SEO & Analytics
**Statut** : Non implémenté
**Impact** : Visibilité Google limitée
**Action requise** :
- Ajouter meta tags dynamiques
- Créer `sitemap.xml`
- Créer `robots.txt`
- Ajouter Google Analytics
- Ajouter OpenGraph pour réseaux sociaux

**Temps estimé** : 2-3 heures

---

### 7. Domaine personnalisé
**Statut** : Sur Vercel avec sous-domaine *.vercel.app
**Impact** : Branding
**Action requise** :
- Acheter domaine (ex: zmrmodels.com)
- Configurer DNS
- Ajouter sur Vercel

**Temps estimé** : 30 minutes (si domaine déjà acheté)

---

### 8. Fonctionnalités avancées (optionnel)
**Statut** : Non planifié
**Action requise** :
- Multi-langue (FR/EN)
- Recherche avancée
- Filtres avancés
- Newsletter
- Chat support

**Temps estimé** : Variable selon features

---

## 📋 CHRONOLOGIE D'IMPLÉMENTATION SUGGÉRÉE

### Phase 1 : URGENT (Aujourd'hui)
1. ✅ Vérifier les variables Vercel (10 min)
2. ✅ Configurer SMTP production (15 min)
3. ✅ Tester l'envoi d'emails (5 min)

**Total Phase 1 : ~30 minutes**

---

### Phase 2 : LÉGAL (Cette semaine)
4. ✅ Décider du sort du Blog (garder/supprimer)
5. ✅ Créer les pages légales (2-3h)
6. ✅ Ajouter liens footer (15 min)

**Total Phase 2 : ~3 heures**

---

### Phase 3 : CONTENU (Semaine suivante)
7. ✅ Enrichir le contenu (talents, photos)
8. ✅ Tester toutes les fonctionnalités en production

**Total Phase 3 : Variable**

---

### Phase 4 : SEO (Optionnel)
9. ✅ SEO & Analytics
10. ✅ Domaine personnalisé

**Total Phase 4 : ~3 heures**

---

## 📊 RÉSUMÉ

- **Fonctionnalités implémentées** : ~95%
- **Reste à faire (critique)** : SMTP + Vercel env (30 min)
- **Reste à faire (important)** : Pages légales (3h)
- **Reste à faire (optionnel)** : Contenu + SEO (variable)

---

## 🎯 RECOMMANDATION

**Ordre d'implémentation recommandé** :

1. **AUJOURD'HUI** : SMTP + Vérifier Vercel
2. **CETTE SEMAINE** : Pages légales + Décision blog
3. **SEMAINE PROCHAINE** : Enrichir contenu
4. **PLUS TARD** : SEO et domaine custom

---

## Notes

- ✅ Signature électronique = DÉJÀ FAITE et fonctionnelle
- ✅ Upload fichiers galeries = DÉJÀ FAIT et fonctionnel
- La majorité du travail technique est terminée
- Il reste surtout de la configuration et du contenu
