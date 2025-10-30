# Comment ajouter un mannequin à la page Models

## Structure des dossiers

```
ZMR Models Agency/
├── data/
│   └── models/
│       └── models.json          ← Fichier avec les informations des mannequins
├── public/
│   └── models/
│       ├── women/               ← Photos des femmes mannequins
│       └── men/                 ← Photos des hommes mannequins
```

---

## Étapes pour ajouter un nouveau mannequin

### 1. Ajouter la photo

1. Prépare une photo au format **JPG** ou **PNG**
2. Nomme-la avec le nom du mannequin (sans espaces, utilise des tirets)
   - Exemple : `emma-laurent.jpg` ou `lucas-bernard.jpg`
3. Place la photo dans le bon dossier :
   - **Femme** : `/public/models/women/`
   - **Homme** : `/public/models/men/`

---

### 2. Ajouter les informations dans models.json

Ouvre le fichier `/data/models/models.json` et ajoute les informations du mannequin.

#### Pour une femme (dans la section "women") :

```json
{
  "id": "6",
  "name": "Prénom Nom",
  "image": "/models/women/nom-fichier.jpg",
  "height": "175 cm",
  "bust": "84 cm",
  "waist": "61 cm",
  "hips": "89 cm",
  "shoes": "38 EU",
  "hair": "Blonde",
  "eyes": "Blue"
}
```

#### Pour un homme (dans la section "men") :

```json
{
  "id": "7",
  "name": "Prénom Nom",
  "image": "/models/men/nom-fichier.jpg",
  "height": "188 cm",
  "chest": "98 cm",
  "waist": "78 cm",
  "shoes": "43 EU",
  "hair": "Brown",
  "eyes": "Blue"
}
```

**Important :** N'oublie pas de mettre une **virgule** après l'entrée précédente !

---

### 3. Exemple complet

Voici à quoi ressemble le fichier `models.json` avec plusieurs mannequins :

```json
{
  "women": [
    {
      "id": "1",
      "name": "Emma Laurent",
      "image": "/models/women/emma-laurent.jpg",
      "height": "175 cm",
      "bust": "84 cm",
      "waist": "61 cm",
      "hips": "89 cm",
      "shoes": "38 EU",
      "hair": "Blonde",
      "eyes": "Blue"
    },
    {
      "id": "2",
      "name": "Sofia Martinez",
      "image": "/models/women/sofia-martinez.jpg",
      "height": "178 cm",
      "bust": "86 cm",
      "waist": "63 cm",
      "hips": "91 cm",
      "shoes": "39 EU",
      "hair": "Brown",
      "eyes": "Brown"
    }
  ],
  "men": [
    {
      "id": "4",
      "name": "Lucas Bernard",
      "image": "/models/men/lucas-bernard.jpg",
      "height": "188 cm",
      "chest": "98 cm",
      "waist": "78 cm",
      "shoes": "43 EU",
      "hair": "Brown",
      "eyes": "Blue"
    }
  ]
}
```

---

## Résumé rapide

1. 📁 Place la photo dans `/public/models/women/` ou `/public/models/men/`
2. ✏️ Ouvre `/data/models/models.json`
3. ➕ Ajoute les informations du mannequin dans la bonne section (women ou men)
4. 💾 Sauvegarde le fichier
5. 🔄 Rafraîchis ton navigateur

C'est tout ! Le mannequin apparaîtra automatiquement sur la page Models.
