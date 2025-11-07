# 🎨 Système Professionnel de Génération de Documents PDF

## ✨ Approche HTML → PDF (comme les vrais CRM)

Votre système utilise maintenant l'**approche professionnelle** employée par HubSpot, Zoho, Salesforce, et tous les CRM majeurs.

---

## 🏆 Pourquoi cette approche est meilleure ?

### ❌ Ancien système (PDFME / Positionnement manuel)
- ⚠️ Fastidieux : ajouter chaque champ à la main
- ⚠️ Difficile à maintenir
- ⚠️ Rendu imprévisible
- ⚠️ Pas professionnel

### ✅ Nouveau système (HTML Templates → PDF)
- ✅ **Templates professionnels pré-créés**
- ✅ **Puissance de HTML/CSS** (layouts complexes, flexbox, grid)
- ✅ **Édition simple** (éditeur HTML ou code)
- ✅ **Rendu parfait** (Chromium = votre navigateur)
- ✅ **Comme les vrais CRM** (HubSpot, Zoho, Salesforce)

---

## 🔧 Architecture Technique

```
Template HTML/CSS
       ↓
Injection des données (Mustache)
       ↓
Puppeteer (Chrome headless)
       ↓
PDF Professionnel
```

### Stack
- **Templates** : HTML5 + CSS3
- **Moteur de template** : Mustache.js
- **Génération PDF** : Puppeteer (Chromium)
- **API** : Next.js API Routes

---

## 📂 Structure des Fichiers

```
/templates/documents/
  ├── devis-moderne.html      ✅ Template de devis (prêt)
  ├── facture-pro.html         🔜 À créer
  └── contrat-standard.html    🔜 À créer

/app/api/documents/
  └── generate-pdf/
      └── route.ts             ✅ API de génération

/app/admin/documents/
  └── test-generation/
      └── page.tsx             ✅ Page de test
