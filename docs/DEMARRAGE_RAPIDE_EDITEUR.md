# 🚀 Démarrage Rapide - Éditeur de Positions PDF

## Problème résolu ✅

**AVANT** : L'éditeur s'ouvrait sans afficher votre PDF de devis en arrière-plan, vous ne saviez pas où positionner les champs.

**MAINTENANT** : Le PDF de votre devis se charge automatiquement en arrière-plan !

---

## 🎯 Comment utiliser l'éditeur

### 1. **Accès**
- Allez sur `/admin/documents`
- Cliquez sur **🎯 Positionner les champs** (bouton orange)
- Le PDF de votre devis devrait apparaître automatiquement en arrière-plan

### 2. **Si le PDF ne s'affiche pas**

Vous avez **3 options** :

#### Option A : Charger votre PDF manuellement
1. Cliquez sur le bouton **📄 Charger votre PDF** (orange, en haut à gauche)
2. Sélectionnez votre fichier `devis.pdf` depuis votre ordinateur
3. Le PDF apparaît en arrière-plan

#### Option B : Chercher un PDF existant
1. Cliquez sur **🔍 Chercher un PDF existant** (bleu)
2. Le système cherche automatiquement dans :
   - `/storage/documents/devis.pdf`
   - `/storage/test/devis_test_editable.pdf`

#### Option C : Convertir votre DOCX en PDF
```bash
cd "/Users/jeasonlemoine/Desktop/Projet Rémy/ZMR Models Agency"
soffice --headless --convert-to pdf --outdir "public/storage/documents" "documents/devis.docx"
```

### 3. **Ajuster la visibilité du PDF**

Une fois le PDF chargé :
- Utilisez le **slider "Opacité PDF"** en haut à droite
- Réglez entre 0% (invisible) et 100% (opaque)
- **Recommandé** : 40-60% pour bien voir à la fois le PDF et les champs

### 4. **Positionner vos champs**

#### Méthode rapide - Arrangements automatiques :
1. Cliquez sur **📄 En-tête** pour positionner logo, numéro et date
2. Cliquez sur **👤 Client** pour organiser les infos client
3. Cliquez sur **📊 Tableau** pour aligner les lignes de prestations
4. Cliquez sur **💰 Totaux** pour placer les montants
5. Cliquez sur **✍️ Signatures** pour les zones de signature

#### Méthode précise - Drag & Drop :
1. **Glissez** n'importe quel champ pour le positionner exactement où vous voulez
2. **Redimensionnez** en utilisant les poignées aux coins
3. **Double-cliquez** sur un champ pour changer son nom
4. **Changez le type** dans la liste à droite (texte, nombre, date, email, signature)

### 5. **Outils d'aide au positionnement**

- **Grille magnétique** : Active l'alignement automatique
  - Cochez "Grille" et choisissez 5pt, 10pt ou 20pt

- **Zoom** : Ajustez de 50% à 200%
  - Plus de zoom = plus de précision

- **Alignement** :
  - ⬅️ Aligner à gauche
  - ↔️ Centrer horizontalement
  - ➡️ Aligner à droite

### 6. **Ajouter des champs manquants**

Si un champ manque :
1. Cliquez sur **➕ Ajouter un champ** (vert)
2. Double-cliquez sur le nouveau champ pour le renommer
3. Changez son type dans la liste à droite
4. Positionnez-le où vous voulez

### 7. **Exporter votre configuration**

Une fois satisfait :
1. Cliquez sur le bouton flottant **📤** (vert, en bas à droite)
2. La configuration est **automatiquement copiée** dans le presse-papier
3. Un fichier JSON est aussi **téléchargé** automatiquement

### 8. **Sauvegarder et charger**

Boutons flottants en bas à droite :
- **💾** : Sauvegarder localement (dans le navigateur)
- **📂** : Charger une sauvegarde locale
- **📥** : Importer une configuration JSON
- **📤** : Exporter la configuration

---

## 💡 Conseils d'utilisation

### Pour un alignement parfait :
1. Activez la grille à **10pt**
2. Zoomez à **125%** ou **150%**
3. Ajustez l'opacité du PDF à **50%**
4. Utilisez les arrangements automatiques d'abord
5. Ajustez finement ensuite

### Raccourcis utiles :
- **Double-clic** : Éditer le nom du champ
- **Clic simple** : Sélectionner un champ
- **Bouton ×** : Supprimer le champ sélectionné
- **Grille active** : Les champs "collent" automatiquement

### Si les champs ne sont pas bien placés :
1. Augmentez le zoom
2. Diminuez l'opacité du PDF pour mieux voir
3. Utilisez la grille magnétique
4. Vérifiez que la taille du PDF est correcte (A4 = 595x842)

---

## 🎨 Code couleur des champs

- 📝 **Gris** : Texte standard
- 🔢 **Orange** : Nombres (prix, quantités, montants)
- 📅 **Violet** : Dates
- ✉️ **Vert** : Emails
- ✍️ **Rouge** : Signatures
- 📄 **Bleu** : Zones de texte longues

---

## ✅ Checklist de positionnement

- [ ] PDF du devis visible en arrière-plan
- [ ] Tous les champs nécessaires présents
- [ ] En-tête : logo, numéro, dates bien placés
- [ ] Client : nom, adresse, téléphone, email alignés
- [ ] Tableau : colonnes alignées (description, qté, PU, total)
- [ ] Totaux : sous-total, TVA, total TTC à droite
- [ ] Signatures : en bas, bien espacées
- [ ] Opacité du PDF réglée pour bonne visibilité
- [ ] Grille activée pour alignement précis
- [ ] Configuration exportée

---

## 🆘 Problèmes fréquents

### Le PDF ne se charge pas
- Vérifiez que le fichier existe : `/public/storage/documents/devis.pdf`
- Essayez de le charger manuellement
- Convertissez le DOCX en PDF avec LibreOffice

### Les champs sont trop petits
- Sélectionnez le champ
- Utilisez les poignées aux coins pour agrandir
- Ou utilisez les arrangements automatiques qui ont des tailles optimisées

### Je ne vois pas bien le PDF
- Augmentez l'opacité avec le slider
- Zoomez pour voir plus grand
- Vérifiez que le PDF est bien chargé (texte en vert "✅ PDF chargé")

### Les champs ne s'alignent pas
- Activez la grille magnétique
- Choisissez une granularité appropriée (10pt recommandé)
- Utilisez les boutons d'alignement (⬅️ ↔️ ➡️)

---

## 🎉 Prochaines étapes

Une fois vos champs positionnés :
1. **Validez** avec `/admin/documents/validate-positions`
2. **Générez** un document test
3. **Vérifiez** que tout est bien placé
4. **Ajustez** si nécessaire

Bon positionnement ! 🚀