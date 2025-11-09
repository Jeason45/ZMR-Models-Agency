# 🎯 Guide du Système de Positionnement des Champs PDF

## Vue d'ensemble

Le système de positionnement des champs PDF permet de placer précisément chaque champ éditable sur vos documents (devis, factures, contrats). Plus besoin de modifier le code - tout se fait visuellement !

## 📋 Table des matières

1. [Accès aux outils](#accès-aux-outils)
2. [Éditeur visuel de positions](#éditeur-visuel-de-positions)
3. [Validation des positions](#validation-des-positions)
4. [Application des modifications](#application-des-modifications)
5. [Workflow complet](#workflow-complet)
6. [Résolution des problèmes](#résolution-des-problèmes)

---

## 🚀 Accès aux outils

Depuis la page **Documents** (`/admin/documents`), vous avez accès à 3 boutons principaux :

1. **🎯 Positionner les champs** (orange) - Éditeur visuel drag & drop
2. **✅ Valider positions** (violet) - Aperçu et validation
3. **📝 Éditeur PDF Interactif** (vert) - Édition des documents

---

## 🎨 Éditeur visuel de positions

### Fonctionnalités principales

#### 1. **Drag & Drop intuitif**
- Cliquez et glissez n'importe quel champ pour le positionner
- Les champs sélectionnés apparaissent en bleu
- Utilisez les poignées aux coins pour redimensionner

#### 2. **Ajout de champs personnalisés**
- Cliquez sur **➕ Ajouter un champ**
- Double-cliquez sur un champ pour éditer son nom
- Changez le type dans la liste à droite (texte, nombre, date, email, signature)

#### 3. **Arrangement automatique**
Utilisez les boutons d'arrangement rapide :
- **📄 En-tête** : Positionne logo, numéro et dates
- **👤 Client** : Organise les informations client
- **📊 Tableau** : Aligne parfaitement les lignes de prestations
- **💰 Totaux** : Place les montants à droite
- **✍️ Signatures** : Positionne les zones de signature

#### 4. **Outils d'alignement**
- **⬅️** : Aligner à gauche
- **↔️** : Centrer horizontalement
- **➡️** : Aligner à droite
- **Grille magnétique** : Active l'alignement automatique (5pt, 10pt ou 20pt)

#### 5. **Options d'affichage**
- **Zoom** : 50% à 200%
- **Taille PDF** : A4, Letter, A3, ou A4 Long
- **Grille** : Afficher/masquer la grille d'alignement

### Types de champs et codes couleur

- 📝 **Texte** (gris) : Champs texte standard
- 🔢 **Nombre** (orange) : Montants, quantités, prix
- 📅 **Date** (violet) : Dates
- ✉️ **Email** (vert) : Adresses email
- ✍️ **Signature** (rouge) : Zones de signature
- 📄 **Zone texte** (bleu) : Descriptions longues

### Modification des champs

1. **Éditer le nom** : Double-cliquez sur le champ
2. **Changer le type** : Sélectionnez dans la liste à droite
3. **Supprimer** : Cliquez sur le bouton × rouge
4. **Dupliquer** : Maintenez Alt en glissant (à venir)

---

## ✅ Validation des positions

La page de validation permet de :

### 1. **Visualiser l'aperçu**
- Voir tous les champs positionnés sur le PDF
- Zones colorées pour identifier les sections
- Coordonnées affichées pour chaque champ

### 2. **Analyser la répartition**
- Nombre total de champs
- Répartition par zone (en-tête, client, tableau, totaux, pied de page)
- Répartition par type (texte, nombre, date, etc.)

### 3. **Tests automatiques**
Cliquez sur "Lancer les tests" pour vérifier :
- ✅ Alignement de l'en-tête
- ✅ Zone client complète
- ✅ Alignement du tableau
- ✅ Alignement des totaux
- ✅ Pas de chevauchement
- ✅ Tous les champs dans les limites

### 4. **Actions disponibles**
- **📥 Télécharger l'aperçu** : Sauvegarde le PDF de validation
- **✅ Valider les positions** : Confirme les positions actuelles

---

## 🔧 Application des modifications

### Méthode 1 : Export et application manuelle

1. Dans l'éditeur, cliquez sur **📋 Exporter configuration**
2. La configuration est copiée dans le presse-papier
3. Ouvrez le fichier `scripts/apply-field-positions.ts`
4. Collez la configuration dans la zone indiquée
5. Exécutez : `npx tsx scripts/apply-field-positions.ts`

### Méthode 2 : Application automatique (recommandé)

Les positions sont automatiquement sauvegardées et appliquées quand vous utilisez l'éditeur.

---

## 📊 Workflow complet

### Pour créer un nouveau devis avec positions personnalisées :

1. **Étape 1 : Positionner les champs**
   ```
   /admin/documents → 🎯 Positionner les champs
   ```
   - Arrangez les champs visuellement
   - Ajoutez des champs si nécessaire
   - Utilisez les outils d'alignement

2. **Étape 2 : Valider**
   ```
   /admin/documents → ✅ Valider positions
   ```
   - Vérifiez l'aperçu
   - Lancez les tests
   - Validez si tout est correct

3. **Étape 3 : Générer un document**
   ```
   /admin/documents → ➕ Générer un document
   ```
   - Sélectionnez le template
   - Les champs utilisent automatiquement les nouvelles positions

---

## 🛠 Résolution des problèmes

### Les champs ne sont pas au bon endroit

1. Vérifiez la taille du PDF (A4 par défaut : 595x842 points)
2. Utilisez la grille pour un alignement précis
3. Testez avec différents niveaux de zoom

### Les champs se chevauchent

1. Réduisez la taille des champs
2. Utilisez l'arrangement automatique par zone
3. Activez la grille magnétique pour un espacement régulier

### Les modifications ne s'appliquent pas

1. Assurez-vous d'avoir cliqué sur "Exporter configuration"
2. Vérifiez que le script `apply-field-positions.ts` s'exécute sans erreur
3. Redémarrez le serveur de développement si nécessaire

### Champs manquants

1. Utilisez **➕ Ajouter un champ** pour créer les champs manquants
2. Nommez-les correctement (ex: `telephone_agence`, `email_client`)
3. Définissez le bon type (texte, nombre, date, etc.)

---

## 💡 Conseils et astuces

### Organisation professionnelle

1. **En-tête** : Logo à gauche, numérotation à droite
2. **Client** : Informations alignées à gauche, bien espacées
3. **Tableau** : Colonnes alignées, largeurs cohérentes
4. **Totaux** : Alignés à droite, Total TTC plus grand
5. **Signatures** : En bas, bien espacées

### Nommage des champs

Utilisez une convention cohérente :
- `nom_agence`, `adresse_agence` (infos agence)
- `nom_client`, `email_client` (infos client)
- `ligne_1_description`, `ligne_1_prix` (lignes de tableau)
- `total_ht`, `total_ttc` (totaux)

### Tailles recommandées

- **Champs texte courts** : 100-150px de large, 20-25px de haut
- **Adresses** : 250-300px de large
- **Descriptions** : 200-250px de large, 30-40px de haut
- **Montants** : 60-80px de large
- **Signatures** : 120px de large, 50px de haut

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez ce guide
2. Vérifiez la console du navigateur pour les erreurs
3. Testez avec un nouveau document
4. Contactez le support technique si nécessaire

---

## 🎉 Résumé

Avec ce système de positionnement visuel :
- ✅ Plus besoin de modifier le code
- ✅ Positionnement précis au pixel près
- ✅ Prévisualisation en temps réel
- ✅ Validation automatique
- ✅ Application immédiate

Vous pouvez maintenant créer des documents PDF parfaitement formatés en quelques clics !