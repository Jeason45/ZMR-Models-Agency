# 🎨 Guide d'utilisation - PDFME Designer

## ✨ Nouveau système professionnel de positionnement de champs PDF

Votre éditeur utilise maintenant **PDFME**, une bibliothèque professionnelle open-source avec une interface WYSIWYG de qualité.

---

## 🚀 Accès rapide

**URL** : `http://localhost:3000/admin/documents/position-editor`

**Depuis la page Documents** : Cliquez sur le bouton **🎯 Positionner les champs**

---

## 📖 Comment utiliser l'éditeur

### 1. **Sélection du document**

Au démarrage, un modal vous propose de choisir :

- **📄 Devis** - Proposition commerciale
- **💰 Facture** - Document de facturation
- **📜 Contrat** - Accord légal

Le PDF correspondant se charge automatiquement depuis :
- `/storage/documents/{type}.pdf`
- `/storage/test/{type}_test_editable.pdf`
- `/documents/{type}.pdf`

**Alternative** : Vous pouvez aussi charger un PDF personnalisé via le bouton **📂 Charger un PDF personnalisé**

---

### 2. **Interface du Designer**

Une fois le PDF chargé, l'interface PDFME s'affiche avec :

#### **Panneau gauche - Champs disponibles**
- Liste des schémas de champs
- Types : Text, Image, QR Code
- Glissez-déposez sur le PDF

#### **Zone centrale - Canvas PDF**
- Votre PDF s'affiche en arrière-plan
- **Zoom parfait** avec molette ou contrôles
- **Guides d'alignement** automatiques
- Drag & drop fluide des champs

#### **Panneau droit - Propriétés**
- Position X, Y
- Largeur et hauteur
- Rotation
- Opacité
- Contenu par défaut

---

### 3. **Ajouter des champs**

#### Méthode A : Drag & Drop depuis la sidebar
1. Dans le panneau gauche, cliquez sur le type de champ (Text, Image, etc.)
2. Glissez-le sur le PDF
3. Positionnez-le où vous voulez

#### Méthode B : Ajouter via le bouton +
1. Cliquez sur le bouton **+** dans la barre d'outils
2. Choisissez le type de champ
3. Il apparaît au centre du PDF
4. Déplacez-le

---

### 4. **Modifier les champs**

#### Déplacer un champ
- **Cliquez et glissez** le champ
- Les **guides d'alignement** apparaissent automatiquement
- Les champs "collent" aux guides pour un alignement parfait

#### Redimensionner un champ
- Sélectionnez le champ
- Utilisez les **poignées aux coins** pour redimensionner
- Maintenez **Shift** pour garder les proportions

#### Renommer un champ
1. Sélectionnez le champ
2. Dans le panneau droit, modifiez le champ **Name**
3. Utilisez des noms clairs : `numero_devis`, `nom_client`, etc.

#### Configurer les propriétés
Dans le panneau droit :
- **Position** : X, Y précis au pixel près
- **Taille** : Width, Height
- **Rotation** : Angle en degrés
- **Required** : Champ obligatoire ou non

---

### 5. **Navigation et Zoom**

#### Zoom
- **Molette de la souris** : Zoom in/out
- **Ctrl + Molette** : Zoom plus rapide
- **Boutons +/-** dans la barre d'outils
- **Zoom parfait** - Le PDF reste net à tous les niveaux

#### Déplacement de la vue
- **Clic molette + glisser** : Pan/déplacement
- **Barre d'espace + glisser** : Mode main

#### Guides et grille
- Les guides d'alignement apparaissent automatiquement
- Aident à aligner les champs parfaitement
- Rouge = alignement avec d'autres champs
- Bleu = alignement avec les bords du PDF

---

### 6. **Exporter le template**

#### Bouton "📤 Exporter Template" (en haut à droite)
1. Cliquez sur **📤 Exporter Template**
2. Le template JSON est **automatiquement téléchargé**
3. Il est aussi **copié dans le presse-papier**

#### Contenu du template
Le fichier JSON contient :
```json
{
  "basePdf": "data:application/pdf;base64,...",
  "schemas": [
    [
      {
        "name": "numero_devis",
        "type": "text",
        "position": { "x": 120, "y": 20 },
        "width": 50,
        "height": 8
      }
      // ... autres champs
    ]
  ]
}
```

#### Sauvegarde automatique
Le template est aussi sauvegardé dans `localStorage` sous la clé `pdf_template`

---

### 7. **Changer de document**

**Bouton "🔄 Changer de document"** (en haut à droite)

1. Cliquez sur **🔄 Changer de document**
2. Le modal de sélection réapparaît
3. Choisissez un autre type (Devis → Facture par exemple)
4. Le nouveau PDF se charge
5. Vous pouvez repositionner les champs pour ce document

---

## 💡 Conseils et astuces

### Alignement professionnel

1. **Utilisez les guides** : Les lignes rouges/bleues qui apparaissent
2. **Zoomez** pour plus de précision
3. **Groupez visuellement** : Mettez les infos client ensemble, les montants ensemble
4. **Espacez uniformément** : Utilisez les guides pour garder le même espacement

### Organisation des champs

#### En-tête
```
logo_agence         numero_devis
                    date_devis
                    date_validite
```

#### Informations client
```
nom_client
adresse_client
code_postal_client    ville_client
telephone_client      email_client
```

#### Tableau de prestations
```
Description                  Qté    PU HT      Total HT
ligne_1_description         ligne_1_quantite   ligne_1_prix_unitaire   ligne_1_total
ligne_2_description         ligne_2_quantite   ligne_2_prix_unitaire   ligne_2_total
```

#### Totaux (alignés à droite)
```
                            Sous-total HT:    sous_total_ht
                            TVA (20%):        tva_montant
                            TOTAL TTC:        total_ttc
```

### Nommage des champs

Utilisez une convention cohérente :

- **Agence** : `nom_agence`, `adresse_agence`, `telephone_agence`
- **Client** : `nom_client`, `adresse_client`, `email_client`
- **Lignes** : `ligne_1_description`, `ligne_1_quantite`, `ligne_1_prix_unitaire`
- **Totaux** : `sous_total_ht`, `tva_montant`, `total_ttc`
- **Dates** : `date_devis`, `date_validite`, `date_livraison`

---

## 🎯 Avantages par rapport à l'ancien système

| Fonctionnalité | Ancien système | PDFME ✨ |
|----------------|----------------|----------|
| **Zoom** | ❌ Bug (zoom la zone) | ✅ Parfait (zoom le PDF) |
| **Rendering** | iframe (problèmes) | Canvas natif |
| **Guides d'alignement** | ❌ Grille basique | ✅ Guides intelligents |
| **Performance** | ⚡⚡ Moyenne | ⚡⚡⚡ Excellente |
| **UX** | 🤔 Acceptable | 😍 Professionnelle |
| **Précision** | ±5px | Au pixel près |
| **Export** | JSON manuel | JSON automatique |
| **Qualité visuelle** | 👍 OK | 🌟 Excellent |

---

## 🆘 Résolution des problèmes

### Le PDF ne se charge pas

**Solution** :
1. Vérifiez que le fichier existe dans `/public/storage/documents/`
2. Essayez de charger un PDF manuellement (bouton 📂)
3. Vérifiez la console pour les erreurs

### Les champs ne s'affichent pas

**Solution** :
1. Actualisez la page (F5)
2. Videz le cache du navigateur
3. Vérifiez que PDFME est bien installé : `npm list @pdfme/ui`

### Le zoom ne fonctionne pas

**Solution** :
1. Essayez avec la molette de la souris
2. Utilisez les boutons +/- dans la barre d'outils
3. Si ça ne fonctionne toujours pas, actualisez la page

### Erreur "Designer is not defined"

**Solution** :
```bash
npm install @pdfme/ui @pdfme/common @pdfme/schemas
```

### Les modifications ne sont pas sauvegardées

**Solution** :
1. Cliquez toujours sur **📤 Exporter Template** avant de quitter
2. Le template est sauvegardé dans localStorage
3. Gardez une copie du fichier JSON téléchargé

---

## 📚 Ressources

- **Documentation PDFME** : https://pdfme.com/docs
- **GitHub PDFME** : https://github.com/pdfme/pdfme
- **Exemples** : https://pdfme.com/playground

---

## 🎉 Prochaines étapes

1. ✅ Positionnez vos champs avec PDFME
2. ✅ Exportez le template JSON
3. 🔄 Intégrez le template dans votre système de génération
4. 🚀 Générez des PDFs avec les bonnes positions !

---

**Bon design ! 🎨✨**
