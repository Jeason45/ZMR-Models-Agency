# Configuration Sanity pour ZMR Models Agency

## Étape 1 : Créer un compte Sanity (gratuit)

1. Va sur https://www.sanity.io
2. Clique sur "Get started for free"
3. Inscris-toi avec Google/GitHub ou email
4. C'est gratuit, aucune carte bancaire requise !

## Étape 2 : Créer un nouveau projet

1. Une fois connecté, clique sur "Create new project"
2. Nom du projet : **ZMR Models Agency**
3. Choisis le plan : **Free** (largement suffisant pour commencer)
4. Note le **Project ID** qui s'affiche (tu en auras besoin)

## Étape 3 : Configurer les variables d'environnement

1. Ouvre le fichier `.env.local` à la racine du projet
2. Remplace `your-project-id` par ton vrai Project ID de Sanity
3. Exemple :
```
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

4. Ouvre aussi le fichier `sanity.config.ts`
5. Remplace `'your-project-id'` par ton vrai Project ID

## Étape 4 : Déployer le schema Sanity

1. Ouvre un terminal dans le dossier du projet
2. Lance la commande :
```bash
npx sanity init --project-id=TON_PROJECT_ID --dataset=production
```

Ou simplement :
```bash
npm run dev
```

3. Va sur http://localhost:3000/studio
4. Tu verras l'interface Sanity Studio ! 🎉

## Étape 5 : Ajouter ton premier mannequin

1. Sur http://localhost:3000/studio, tu verras l'interface admin
2. Clique sur "Model" dans le menu à gauche
3. Clique sur le bouton "+" ou "Create new"
4. Remplis les champs :
   - **Name** : Nom du mannequin (ex: "Sophie Martin")
   - **Slug** : Clique sur "Generate" pour créer automatiquement
   - **Category** : Choisis "Woman" ou "Man"
   - **Main Image** : Clique pour upload ou drag & drop une photo
   - **Hover Image** : Photo qui apparaîtra au survol
   - **Gallery Images** : Ajoute plusieurs photos pour le portfolio
   - **Measurements** : Remplis les mensurations (Height, Bust, Waist, etc.)
5. Clique sur "Publish" en bas à droite

## Étape 6 : Voir ton mannequin sur le site

1. Va sur http://localhost:3000/models
2. Tu devrais voir ton nouveau mannequin !
3. Clique dessus pour voir sa page de détail

## Commandes utiles

### Lancer le site et l'admin en même temps :
```bash
npm run dev
```
- Site : http://localhost:3000
- Admin Sanity : http://localhost:3000/studio

### Si tu as des problèmes :
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Relancer le serveur
npm run dev
```

## Structure des données

Chaque mannequin a ces champs :

**Obligatoires :**
- Name (nom complet)
- Slug (URL automatique)
- Category (Woman/Man)
- Main Image (photo principale)

**Optionnels :**
- Hover Image (photo au survol)
- Gallery Images (photos du portfolio)
- Height, Neck, Bust/Chest, Waist, Hips, Suit, Inseam, Shoes, Eyes, Hair

## Trucs et astuces

### Upload d'images
- Tu peux drag & drop plusieurs images en même temps
- Sanity optimise automatiquement les images
- Format recommandé : JPG ou PNG, résolution 1920x2880 px

### Modifier un mannequin
1. Va sur http://localhost:3000/studio
2. Clique sur "Model" à gauche
3. Clique sur le mannequin à modifier
4. Fais tes modifications
5. Clique sur "Publish"

### Supprimer un mannequin
1. Ouvre le mannequin dans le studio
2. Clique sur les 3 points ⋯ en haut à droite
3. Choisis "Delete"

## Limites du plan gratuit

✅ **Ce qui est inclus gratuitement :**
- 3 utilisateurs
- Modèles illimités
- 500,000 requêtes API/mois (largement suffisant)
- 5GB de bande passante images/mois
- 200,000 requêtes images CDN/mois

⚠️ **Si tu dépasses ces limites :**
- Le site continuera de fonctionner
- Tu recevras un email de Sanity
- Tu pourras upgrader vers le plan Growth ($99/mois)

Pour un lancement, tu as de la marge ! Si tu atteins ces limites, c'est que le site a du succès 🎉

## Support

Si tu as des problèmes :
1. Vérifie que le Project ID est correct dans `.env.local` et `sanity.config.ts`
2. Assure-toi que `npm run dev` tourne sans erreur
3. Consulte la doc Sanity : https://www.sanity.io/docs

## Prochaines étapes

Une fois que tu as ajouté quelques mannequins dans Sanity :
1. Le site les affichera automatiquement
2. Ton client pourra les gérer lui-même via http://localhost:3000/studio
3. Quand tu déploieras sur Vercel, il pourra accéder à https://ton-site.com/studio

C'est tout ! Tu as maintenant un CMS professionnel pour gérer tes mannequins 🚀
